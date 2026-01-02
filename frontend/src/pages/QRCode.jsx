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
    <div className="fixed top-20 right-4 sm:right-5 z-50 animate-slide-in">
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
  <div className="group">
    <div className="text-xs text-neutral-500 uppercase tracking-widest font-medium mb-2">
      {label}
    </div>
    <div className="text-2xl sm:text-3xl font-extralight text-white tracking-tight tabular-nums">
      {value}
    </div>
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
        <div className="w-full px-8 sm:px-12 lg:px-16 mx-auto py-8 pt-24">
          <div className="text-center py-12 lg:py-20">
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
        <div className="w-full px-8 sm:px-12 lg:px-16 mx-auto py-8 pt-24">
          <div className="max-w-md mx-auto">
            <div className="border border-red-500/30 bg-red-500/10 p-6 sm:p-8 text-center">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 mb-6 text-sm sm:text-lg">{error}</p>
              <button
                onClick={handleBack}
                className="border border-[#76B900] text-[#76B900] px-6 py-3 hover:bg-[#76B900] hover:text-black transition-colors cursor-pointer font-medium text-sm"
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

      <div className="w-full px-8 sm:px-12 lg:px-16 mx-auto py-8 pt-24">
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white mb-2 tracking-tight">
            QR Code
          </h1>
          <p className="text-neutral-500 text-sm sm:text-base">
            Download and share your QR code
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-16 mb-12 lg:mb-20">
          {/* QR Code Display */}
          <div>
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl font-extralight text-white tracking-tight">
                QR Code
              </h2>
              <div className="h-px flex-1 bg-neutral-900"></div>
            </div>

            <div className="bg-white p-2 mb-6 lg:mb-8 flex items-center justify-center mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md">
              {link?.qrCode ? (
                <img
                  src={link.qrCode}
                  alt="QR Code"
                  className="w-full h-auto max-w-full"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <div className="w-full h-64 lg:h-80 bg-neutral-200 flex items-center justify-center">
                  <p className="text-neutral-600 text-sm">
                    QR Code not available
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadQRCode}
                disabled={!link?.qrCode}
                className="flex-1 flex items-center justify-center gap-2 bg-[#76B900] text-black py-3 sm:py-4 font-medium hover:bg-[#8FD400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm uppercase tracking-wider"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => copyToClipboard(link?.qrCode)}
                disabled={!link?.qrCode}
                className="px-5 text-neutral-400 hover:text-[#76B900] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer py-3 sm:py-4 border border-neutral-800 sm:border-0"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Link Information */}
          <div className="mt-8 lg:mt-0">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl font-extralight text-white tracking-tight">
                Link Details
              </h2>
              <div className="h-px flex-1 bg-neutral-900"></div>
            </div>

            <div className="space-y-6 lg:space-y-8">
              {/* Short URL */}
              <div className="pb-6 lg:pb-8 border-b border-neutral-900/50">
                <label className="text-neutral-500 text-xs uppercase tracking-widest block mb-3 font-medium">
                  Short URL
                </label>
                <div className="flex items-center gap-3">
                  <a
                    href={link?.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#76B900] hover:text-[#8FD400] flex items-center gap-2 transition-colors flex-1 break-all cursor-pointer text-base sm:text-lg font-light group/link"
                  >
                    <span>{link?.shortUrl}</span>
                    <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                  <button
                    onClick={() => copyToClipboard(link?.shortUrl)}
                    className="p-2 text-neutral-400 hover:text-[#76B900] transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Original URL */}
              <div className="pb-6 lg:pb-8 border-b border-neutral-900/50">
                <label className="text-neutral-500 text-xs uppercase tracking-widest block mb-3 font-medium">
                  Original URL
                </label>
                <p className="text-neutral-400 text-sm break-all font-light">
                  {link?.originalUrl}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-6 lg:gap-y-8 py-6 lg:py-8 border-b border-neutral-900/50">
                <StatCard value={link?.clicks || 0} label="Total Clicks" />
                <StatCard value={link?.createdAt} label="Created" />
              </div>

              {/* Quick Actions */}
              <div>
                <label className="text-neutral-500 text-xs uppercase tracking-widest block mb-4 font-medium">
                  Quick Actions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => copyToClipboard(link?.shortUrl)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-neutral-400 hover:text-[#76B900] hover:bg-neutral-900/20 transition-all cursor-pointer text-sm border-b border-neutral-900/50 hover:border-[#76B900]/50"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={() => navigate(`/analytics/${link?.id}`)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-neutral-400 hover:text-[#76B900] hover:bg-neutral-900/20 transition-all cursor-pointer text-sm border-b border-neutral-900/50 hover:border-[#76B900]/50"
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
        <div className="border-t border-neutral-900 pt-12 lg:pt-16">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-extralight text-white tracking-tight">
              Usage Tips
            </h2>
            <div className="h-px flex-1 bg-neutral-900"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-4 lg:gap-y-6">
            {usageTips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-neutral-400 text-sm hover:text-white transition-colors group"
              >
                <div className="w-1 h-1 rounded-full bg-[#76B900] mt-2 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                <span className="font-light">{tip}</span>
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
