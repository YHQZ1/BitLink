// src/pages/LinkAnalytics.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Globe,
  Smartphone,
  TrendingUp,
  Clock,
  Copy,
  ExternalLink,
  Check,
} from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function LinkAnalytics() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    profileImage: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchLinkAnalytics();
  }, [linkId, timeRange]);

  const fetchUserData = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("jwtToken");
      if (!token) return;

      const response = await axios.get(`${BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser({
        name: response.data.name || response.data.username,
        profileImage: response.data.profileImage,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchLinkAnalytics = async () => {
    try {
      setIsLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("jwtToken");

      if (!token) {
        throw new Error("Please login to view analytics");
      }

      console.log(
        "🔍 Fetching analytics for link:",
        linkId,
        "with range:",
        timeRange
      );

      const response = await axios.get(
        `${BASE_URL}/api/links/analytics/${linkId}?range=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Analytics API Response:", response.data);

      setAnalyticsData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error fetching link analytics:", error);
      console.error("Error details:", error.response?.data);
      setError(error.response?.data?.error || error.message);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Safe data access helpers
  const getTotalClicks = () => analyticsData?.totalClicks || 0;
  const getLink = () => analyticsData?.link || {};
  const getClicksOverTime = () => analyticsData?.clicksOverTime || [];
  const getReferrers = () => analyticsData?.referrers || [];
  const getCountries = () => analyticsData?.countries || [];
  const getDevices = () => analyticsData?.devices || [];
  const getBrowsers = () => analyticsData?.browsers || [];
  const getPeakHours = () => analyticsData?.peakHours || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar
          userName={currentUser.name}
          profileImage={currentUser.profileImage}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ed957] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar
          userName={currentUser.name}
          profileImage={currentUser.profileImage}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 sm:p-6 max-w-md mx-auto">
              <p className="text-red-400 mb-4 text-sm sm:text-base">{error}</p>
              <button
                onClick={handleBack}
                className="bg-[#7ed957] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#8ee367] transition-all duration-200 text-sm sm:text-base"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar
          userName={currentUser.name}
          profileImage={currentUser.profileImage}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
          <div className="text-center">
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-4 sm:p-6 max-w-md mx-auto">
              <p className="text-yellow-400 mb-4 text-sm sm:text-base">
                No analytics data available
              </p>
              <button
                onClick={handleBack}
                className="bg-[#7ed957] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#8ee367] transition-all duration-200 text-sm sm:text-base"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const link = getLink();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar
        userName={currentUser.name}
        profileImage={currentUser.profileImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-20 sm:pt-24">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 sm:mb-6 lg:mb-8 transition-colors touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back to Links</span>
        </button>

        {/* Header */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
                Link Analytics
              </h1>
              <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                <a
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7ed957] text-sm sm:text-base font-medium hover:underline flex items-center space-x-1 break-all"
                >
                  <span className="truncate max-w-[200px] sm:max-w-none">{link.shortUrl}</span>
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                </a>
                <button
                  onClick={() => copyToClipboard(link.shortUrl)}
                  className="text-gray-400 hover:text-white transition-colors p-1 touch-manipulation"
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#7ed957]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm break-all leading-relaxed">
                {link.originalUrl}
              </p>
            </div>

            {/* Time Range Filter - Now Mobile Optimized */}
            <div className="flex flex-wrap gap-2">
              {["7d", "30d", "90d", "all"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`flex-1 min-w-[70px] px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 touch-manipulation ${
                    timeRange === range
                      ? "bg-[#7ed957] text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600"
                  }`}
                >
                  {range === "7d"
                    ? "7 Days"
                    : range === "30d"
                    ? "30 Days"
                    : range === "90d"
                    ? "90 Days"
                    : "All Time"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Stats - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-gray-400 text-xs sm:text-sm">Total Clicks</span>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#7ed957]" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              {getTotalClicks()}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-gray-400 text-xs sm:text-sm">Created</span>
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#7ed957]" />
            </div>
            <div className="text-sm sm:text-base lg:text-lg font-bold text-white leading-tight">
              {link.createdAt
                ? new Date(link.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: window.innerWidth < 640 ? '2-digit' : 'numeric'
                  })
                : "N/A"}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-gray-400 text-xs sm:text-sm">Top Country</span>
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#7ed957]" />
            </div>
            <div className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">
              {getCountries()[0]?.country === "Unknown" ||
              getCountries()[0]?.country === "Local Network"
                ? "Not Available"
                : getCountries()[0]?.country || "N/A"}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-gray-400 text-xs sm:text-sm">Top Device</span>
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-[#7ed957]" />
            </div>
            <div className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">
              {getDevices()[0]?.device || "N/A"}
            </div>
          </div>
        </div>

        {/* Analytics Sections - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Referrers */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#7ed957]" />
              Traffic Sources
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {getReferrers().length > 0 ? (
                getReferrers().map((ref, index) => (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <span className="text-gray-300 text-sm sm:text-base truncate flex-1">
                      {ref.source}
                    </span>
                    <span className="text-[#7ed957] font-semibold text-sm sm:text-base flex-shrink-0">
                      {ref.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No data available</p>
              )}
            </div>
          </div>

          {/* Countries */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#7ed957]" />
              Top Countries
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {getCountries().length > 0 ? (
                getCountries().map((country, index) => (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <span className="text-gray-300 text-sm sm:text-base truncate flex-1">
                      {country.country}
                    </span>
                    <span className="text-[#7ed957] font-semibold text-sm sm:text-base flex-shrink-0">
                      {country.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No data available</p>
              )}
            </div>
          </div>

          {/* Devices */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#7ed957]" />
              Devices
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {getDevices().length > 0 ? (
                getDevices().map((device, index) => (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <span className="text-gray-300 text-sm sm:text-base truncate flex-1">
                      {device.device}
                    </span>
                    <span className="text-[#7ed957] font-semibold text-sm sm:text-base flex-shrink-0">
                      {device.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No data available</p>
              )}
            </div>
          </div>

          {/* Browsers */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#7ed957]" />
              Browsers
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {getBrowsers().length > 0 ? (
                getBrowsers().map((browser, index) => (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <span className="text-gray-300 text-sm sm:text-base truncate flex-1">
                      {browser.browser}
                    </span>
                    <span className="text-[#7ed957] font-semibold text-sm sm:text-base flex-shrink-0">
                      {browser.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No data available</p>
              )}
            </div>
          </div>

          {/* Peak Hours - Full Width on Mobile */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:col-span-2">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#7ed957]" />
              Peak Hours
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              {getPeakHours().length > 0 ? (
                getPeakHours().map((hour, index) => (
                  <div
                    key={index}
                    className="text-center bg-gray-800/50 rounded-lg p-2 sm:p-3"
                  >
                    <div className="text-[#7ed957] font-bold text-base sm:text-lg">
                      {hour.clicks}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm truncate">
                      {hour.hour}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm col-span-full">No data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}