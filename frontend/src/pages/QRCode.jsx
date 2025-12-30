/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/Navbar";

// Toast Notification Component
const Toast = ({ isVisible, type, message, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const Icon = type === "success" ? CheckCircle : AlertCircle;
  const bgColor = type === "success" ? "bg-[#76B900]" : "bg-red-500";

  return (
    <div className="fixed top-20 right-5 z-50 animate-slide-in">
      <div
        className={`${bgColor} text-black px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-md shadow-lg`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium flex-1">{message}</span>
        <button onClick={onClose} className="hover:opacity-70 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ value, label }) => (
  <div className="border border-neutral-800 p-4">
    <div className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
      {label}
    </div>
    <div className="text-2xl font-light text-white">{value}</div>
  </div>
);

export default function QRCode() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [currentUser, setCurrentUser] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    isVisible: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
  };

  const closeToast = () => setToast((prev) => ({ ...prev, isVisible: false }));

  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get("/api/user/profile");
      setCurrentUser({
        name: response.data.name || "User",
        email: response.data.email,
      });
    } catch {
      localStorage.removeItem("jwtToken");
      navigate("/auth");
    }
  }, [navigate]);

  const fetchLinkData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/links/me");
      const foundLink = response.data.find((link) => link.id === linkId);

      if (!foundLink) throw new Error("Link not found");

      setLink({
        id: foundLink.id,
        originalUrl: foundLink.originalUrl,
        shortUrl: foundLink.shortUrl,
        shortCode: foundLink.shortCode,
        clicks: foundLink.clicks,
        qrCode: foundLink.qrCode,
        createdAt: new Date(foundLink.createdAt).toLocaleDateString(),
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [linkId]);

  useEffect(() => {
    fetchUserData();
    fetchLinkData();
  }, [fetchUserData, fetchLinkData]);

  const downloadQRCode = () => {
    if (!link?.qrCode) return;
    const linkElement = document.createElement("a");
    linkElement.href = link.qrCode;
    linkElement.download = `qrcode-${link.shortCode}.png`;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    showToast("success", "QR code downloaded");
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast("success", "Copied to clipboard");
  };

  const handleBack = () => navigate(-1);

  const usageTips = [
    "Print for physical marketing materials and packaging",
    "Share on social media posts and stories",
    "Embed in presentations and documents",
    "Add to email signatures and newsletters",
    "Display on digital screens at events",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-8 pt-24">
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-neutral-800 border-t-[#76B900] rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-neutral-400">Loading QR code...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-8 pt-24">
          <div className="max-w-md mx-auto">
            <div className="border border-red-500/30 bg-red-500/10 p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 mb-6 text-lg">{error}</p>
              <button
                onClick={handleBack}
                className="border border-[#76B900] text-[#76B900] px-6 py-3 hover:bg-[#76B900] hover:text-black transition-colors cursor-pointer font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
      <Navbar userName={currentUser.name} userEmail={currentUser.email} />
      <Toast {...toast} onClose={closeToast} />

      <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors cursor-pointer text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-white mb-3">QR Code</h1>
          <p className="text-neutral-400 text-lg">
            Download and share your QR code
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* QR Code Display */}
          <div className="border border-neutral-800 p-8 bg-[#0D0F13]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
              <h2 className="text-xl font-light text-white">QR Code</h2>
            </div>

            <div className="bg-white p-2 mb-6 flex items-center justify-center mx-auto w-fit">
              {link?.qrCode ? (
                <img
                  src={link.qrCode}
                  alt="QR Code"
                  className="w-64 h-64"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <div className="w-64 h-64 bg-neutral-200 flex items-center justify-center">
                  <p className="text-neutral-600">QR Code not available</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadQRCode}
                disabled={!link?.qrCode}
                className="flex-1 flex items-center justify-center gap-2 bg-[#76B900] text-black py-3 font-medium hover:bg-[#8FD400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => copyToClipboard(link?.qrCode)}
                disabled={!link?.qrCode}
                className="px-4 border border-neutral-800 text-neutral-300 hover:border-[#76B900] hover:text-[#76B900] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Link Information */}
          <div className="border border-neutral-800 p-8 bg-[#0D0F13]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
              <h2 className="text-xl font-light text-white">Link Details</h2>
            </div>

            <div className="space-y-6">
              {/* Short URL */}
              <div>
                <label className="text-neutral-400 text-xs uppercase tracking-wider block mb-2">
                  Short URL
                </label>
                <div className="flex items-center gap-2">
                  <a
                    href={link?.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#76B900] hover:text-[#8FD400] flex items-center gap-2 transition-colors flex-1 break-all cursor-pointer"
                  >
                    <span>{link?.shortUrl}</span>
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </a>
                  <button
                    onClick={() => copyToClipboard(link?.shortUrl)}
                    className="p-2 text-neutral-400 hover:text-[#76B900] transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Original URL */}
              <div>
                <label className="text-neutral-400 text-xs uppercase tracking-wider block mb-2">
                  Original URL
                </label>
                <p className="text-neutral-300 text-sm break-all">
                  {link?.originalUrl}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <StatCard value={link?.clicks || 0} label="Total Clicks" />
                <StatCard value={link?.createdAt} label="Created" />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-neutral-800">
                <label className="text-neutral-400 text-xs uppercase tracking-wider block mb-3">
                  Quick Actions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => copyToClipboard(link?.shortUrl)}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-neutral-800 text-neutral-300 hover:border-[#76B900] hover:text-[#76B900] hover:bg-[#76B900]/10 transition-colors cursor-pointer text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={() => navigate(`/analytics/${link?.id}`)}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-neutral-800 text-neutral-300 hover:border-[#76B900] hover:text-[#76B900] hover:bg-[#76B900]/10 transition-colors cursor-pointer text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="border border-neutral-800 p-8 bg-[#0D0F13]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
            <h2 className="text-xl font-light text-white">Usage Tips</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usageTips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-neutral-300 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#76B900] mt-2 flex-shrink-0"></div>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
