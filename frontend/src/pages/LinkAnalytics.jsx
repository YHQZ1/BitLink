/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Smartphone,
  TrendingUp,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import PageLoader from "../components/PageLoader";

const timeRangeOptions = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "all", label: "All Time" },
];

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

const StatCard = ({ title, value, icon: Icon, subtext }) => (
  <div className="group">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-3.5 h-3.5 text-[#76B900]" />
      <span className="text-neutral-500 text-xs uppercase tracking-widest font-medium">
        {title}
      </span>
    </div>
    <div className="text-4xl sm:text-5xl font-extralight text-white tracking-tight">
      {value}
    </div>
    {subtext && (
      <div className="text-xs text-neutral-600 mt-1.5">{subtext}</div>
    )}
  </div>
);

const DataRow = ({ label, count }) => (
  <div className="flex items-center justify-between py-3 border-b border-neutral-900/50 last:border-0 group hover:bg-neutral-900/20 transition-all px-2 -mx-2">
    <span className="text-neutral-300 text-sm flex-1 truncate group-hover:text-white transition-colors">
      {label}
    </span>
    <span className="text-white font-light text-sm tabular-nums flex-shrink-0">
      {count}
    </span>
  </div>
);

const DataSection = ({ title, data, labelKey = "name" }) => (
  <div>
    <div className="flex items-center gap-3 mb-5">
      <h3 className="text-lg sm:text-xl font-extralight text-white tracking-tight">
        {title}
      </h3>
      <div className="h-px flex-1 bg-neutral-900"></div>
    </div>
    <div className="space-y-1">
      {data.length > 0 ? (
        data.map((item, index) => (
          <DataRow
            key={index}
            label={
              item[labelKey] || item.deviceType || item.device || item.source
            }
            count={item.count}
          />
        ))
      ) : (
        <div className="text-center py-8 lg:py-10 border border-dashed border-neutral-900">
          <p className="text-neutral-600 text-xs">No data available</p>
        </div>
      )}
    </div>
  </div>
);

export default function LinkAnalytics() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [currentUser, setCurrentUser] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");
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

  const fetchLinkAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await api.get(`/api/analytics/link/${linkId}`, {
        params: {
          range: timeRange,
          timeZone,
        },
      });

      setAnalyticsData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [linkId, timeRange]);

  useEffect(() => {
    fetchUserData();
    fetchLinkAnalytics();
  }, [fetchUserData, fetchLinkAnalytics]);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    showToast("success", "Copied to clipboard");
  }, []);

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <PageLoader label="Loading Link Analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="w-full px-8 sm:px-12 lg:px-16 mx-auto pt-20">
          <div className="max-w-md mx-auto">
            <div className="border border-red-500/30 bg-red-500/10 p-6 text-center">
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

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="flex-1 w-full px-8 sm:px-12 lg:px-16 mx-auto pt-20">
          <div className="max-w-md mx-auto">
            <div className="border border-neutral-800 bg-[#0D0F13] p-6 text-center">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-400 mb-6 text-sm sm:text-lg">
                No analytics data available
              </p>
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

  const {
    link = {},
    totalClicks = 0,
    referrers = [],
    countries = [],
    devices = [],
    browsers = [],
    peakHours = [],
  } = analyticsData;

  const getTopCountry = () => {
    const topCountry = countries[0]?.country;
    const excludedCountries = ["Local Network", "Unknown", "Localhost"];
    return topCountry && !excludedCountries.includes(topCountry)
      ? topCountry
      : "Not Available";
  };

  const getTopDevice = () =>
    devices[0]?.deviceType || devices[0]?.device || "N/A";

  const formatCreatedDate = () => {
    if (!link.createdAt) return "N/A";
    return new Date(link.createdAt).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
      <Navbar userName={currentUser.name} userEmail={currentUser.email} />
      <Toast {...toast} onClose={closeToast} />

      <div className="w-full px-8 sm:px-12 lg:px-16 mx-auto pt-20">
        {/* Header */}
        <div className="mb-10 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white mb-2 tracking-tight">
                Link Analytics
              </h1>
              <p className="text-neutral-500 text-sm sm:text-base">
                Performance metrics and engagement data
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {timeRangeOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimeRange(value)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium transition-all cursor-pointer uppercase tracking-wider ${
                    timeRange === value
                      ? "bg-[#76B900] text-black"
                      : "text-neutral-500 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Link Info */}
          <div className="py-5 lg:py-6 border-y border-neutral-900/50">
            <div className="flex items-center gap-3 mb-2">
              <a
                href={link.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#76B900] hover:text-[#8FD400] flex items-center gap-2 transition-colors cursor-pointer text-base sm:text-lg font-medium group/link"
              >
                <span className="break-all">{link.shortUrl}</span>
                <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </a>
              <button
                onClick={() => copyToClipboard(link.shortUrl)}
                className="text-neutral-400 hover:text-[#76B900] transition-colors cursor-pointer p-1"
                aria-label="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-neutral-500 text-sm break-all">
              {link.originalUrl}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-12 gap-y-6 lg:gap-y-8 py-6 lg:py-8 border-b border-neutral-900/50 mb-10 lg:mb-12">
          <StatCard
            title="Total Clicks"
            value={totalClicks.toLocaleString()}
            icon={TrendingUp}
          />
          <StatCard
            title="Created"
            value={formatCreatedDate()}
            icon={Calendar}
          />
          <StatCard title="Top Country" value={getTopCountry()} icon={MapPin} />
          <StatCard
            title="Top Device"
            value={getTopDevice()}
            icon={Smartphone}
          />
        </div>

        {/* Data Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8 lg:gap-y-10 mb-10 lg:mb-12">
          <DataSection
            title="Traffic Sources"
            data={referrers}
            labelKey="source"
          />
          <DataSection
            title="Top Countries"
            data={countries}
            labelKey="country"
          />
          <DataSection title="Devices" data={devices} />
          <DataSection title="Browsers" data={browsers} labelKey="browser" />
        </div>

        {/* Peak Hours */}
        <div>
          <div className="flex items-center gap-3 mb-5 lg:mb-6">
            <h3 className="text-xl sm:text-2xl font-extralight text-white tracking-tight">
              Peak Hours
            </h3>
            <div className="h-px flex-1 bg-neutral-900"></div>
            {peakHours.length > 0 && (
              <span className="text-xs text-neutral-600 uppercase tracking-wider">
                Most active times
              </span>
            )}
          </div>
          {peakHours.length > 0 ? (
            <div className="space-y-3">
              {peakHours.slice(0, 5).map((hour, index) => {
                const maxClicks = peakHours[0]?.clicks || 1;
                const percentage = (hour.clicks / maxClicks) * 100;

                const formatHour = (hourStr) => {
                  const hourNum = parseInt(hourStr);
                  if (isNaN(hourNum)) return hourStr;
                  const period = hourNum >= 12 ? "PM" : "AM";
                  const displayHour = hourNum % 12 || 12;
                  return `${displayHour}:00 ${period}`;
                };

                return (
                  <div
                    key={index}
                    className="group py-3 border-b border-neutral-900/50 last:border-0 hover:bg-neutral-900/20 transition-all px-2 -mx-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-neutral-600 text-xs w-6 text-center">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="text-white text-sm sm:text-base font-light">
                            {formatHour(hour.hour)}
                          </div>
                          <div className="text-neutral-600 text-xs mt-0.5">
                            {index === 0 ? "Peak activity" : "High activity"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-extralight text-white tabular-nums">
                          {hour.clicks}
                        </div>
                        <div className="text-xs text-neutral-600">clicks</div>
                      </div>
                    </div>
                    <div className="relative h-2 bg-neutral-900 overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-[#76B900] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 lg:py-12 border border-dashed border-neutral-900">
              <p className="text-neutral-600 text-sm">
                No peak hours data available
              </p>
            </div>
          )}
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
