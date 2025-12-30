import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Copy, ExternalLink } from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/Navbar";

export default function QRCode() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [currentUser, setCurrentUser] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchLinkData();
  }, [linkId]);

  const fetchUserData = async () => {
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
  };

  const fetchLinkData = async () => {
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

      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!link?.qrCode) return;
    const linkElement = document.createElement("a");
    linkElement.href = link.qrCode;
    linkElement.download = `qrcode-${link.shortCode}.png`;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ed957] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading QR code...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={handleBack}
                className="bg-[#7ed957] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#8ee367] transition-all duration-200"
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
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar userName={currentUser.name} userEmail={currentUser.email} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Links</span>
        </button>

        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">QR Code</h1>
            <p className="text-gray-400">
              Scan this QR code to visit your shortened link
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center">
              <div className="bg-white p-6 rounded-2xl inline-block">
                {link?.qrCode ? (
                  <img
                    src={link.qrCode}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">QR Code not available</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={downloadQRCode}
                  disabled={!link?.qrCode}
                  className="flex items-center space-x-2 bg-[#7ed957] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#8ee367] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download QR</span>
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-800/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Link Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">
                    Short URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <a
                      href={link?.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7ed957] font-medium hover:underline flex items-center space-x-1 flex-1"
                    >
                      <span>{link?.shortUrl}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => copyToClipboard(link?.shortUrl)}
                      className="text-gray-400 hover:text-white transition-colors p-2"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-2">
                    Original URL
                  </label>
                  <p className="text-gray-300 text-sm break-all">
                    {link?.originalUrl}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {link?.clicks || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Total Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {link?.createdAt}
                    </div>
                    <div className="text-gray-400 text-sm">Created</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <h3 className="text-gray-400 text-sm mb-3">Share</h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => copyToClipboard(link?.shortUrl)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(link?.qrCode)}
                      disabled={!link?.qrCode}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy QR Image URL</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            QR Code Usage Tips
          </h3>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li>• Print the QR code for physical marketing materials</li>
            <li>• Share the QR code image on social media</li>
            <li>• Embed in presentations or documents</li>
            <li>• Use in email signatures</li>
            <li>• Display on digital screens at events</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
