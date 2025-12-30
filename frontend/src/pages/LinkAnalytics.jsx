/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
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
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/Navbar";

const timeRangeOptions = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "all", label: "All Time" },
];

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

const StatCard = ({ title, value, icon: Icon, subtext }) => (
  <div className="border border-neutral-800 p-6 hover:border-neutral-700 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <span className="text-neutral-400 text-xs uppercase tracking-wider">
        {title}
      </span>
      <Icon className="w-4 h-4 text-[#76B900]" />
    </div>
    <div className="text-4xl font-light text-white mb-1">{value}</div>
    {subtext && <div className="text-xs text-neutral-500 mt-2">{subtext}</div>}
  </div>
);

const DataSection = ({
  title,
  icon: Icon,
  data,
  dataKey,
  labelKey = "name",
}) => (
  <div className="border border-neutral-800 p-6 bg-[#0D0F13]">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
      <h3 className="text-xl font-light text-white">{title}</h3>
    </div>
    <div className="space-y-3">
      {data.length > 0 ? (
        data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 py-2 border-b border-neutral-800 last:border-0"
          >
            <span className="text-neutral-300 text-sm truncate flex-1">
              {item[labelKey] || item.deviceType || item.device || item.source}
            </span>
            <span className="text-[#76B900] font-medium text-sm flex-shrink-0">
              {item.count}
            </span>
          </div>
        ))
      ) : (
        <p className="text-neutral-500 text-sm text-center py-8">
          No data available
        </p>
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
      const response = await api.get(`/api/analytics/link/${linkId}`, {
        params: { range: timeRange },
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
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-8 pt-24">
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-neutral-800 border-t-[#76B900] rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-neutral-400">Loading analytics...</p>
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

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-8 pt-24">
          <div className="max-w-md mx-auto">
            <div className="border border-neutral-800 bg-[#0D0F13] p-8 text-center">
              <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-400 mb-6 text-lg">
                No analytics data available
              </p>
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
          <h1 className="text-4xl font-light text-white mb-3">
            Link Analytics
          </h1>
          <p className="text-neutral-400 text-lg">
            Track performance and engagement metrics
          </p>
        </div>

        {/* Link Info & Time Range */}
        <div className="border border-neutral-800 bg-[#0D0F13] p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <a
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#76B900] hover:text-[#8FD400] flex items-center gap-2 transition-colors cursor-pointer text-lg font-medium"
                >
                  <span className="break-all">{link.shortUrl}</span>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
                <button
                  onClick={() => copyToClipboard(link.shortUrl)}
                  className="text-neutral-400 hover:text-[#76B900] transition-colors cursor-pointer p-1"
                  aria-label="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-neutral-400 text-sm break-all">
                {link.originalUrl}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {timeRangeOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimeRange(value)}
                  className={`px-4 py-2 font-medium transition-colors cursor-pointer text-sm ${
                    timeRange === value
                      ? "bg-[#76B900] text-black"
                      : "border border-neutral-800 text-neutral-300 hover:border-[#76B900] hover:text-[#76B900]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <DataSection
            title="Traffic Sources"
            icon={Users}
            data={referrers}
            labelKey="source"
          />
          <DataSection
            title="Top Countries"
            icon={Globe}
            data={countries}
            labelKey="country"
          />
          <DataSection title="Devices" icon={Smartphone} data={devices} />
          <DataSection
            title="Browsers"
            icon={Globe}
            data={browsers}
            labelKey="browser"
          />
        </div>

        {/* Peak Hours */}
        <div className="border border-neutral-800 p-8 bg-[#0D0F13]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
            <h3 className="text-xl font-light text-white">Peak Hours</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {peakHours.length > 0 ? (
              peakHours.map((hour, index) => (
                <div
                  key={index}
                  className="border border-neutral-800 p-4 text-center hover:border-neutral-700 transition-colors"
                >
                  <div className="text-[#76B900] font-light text-3xl mb-2">
                    {hour.clicks}
                  </div>
                  <div className="text-neutral-300 text-sm font-medium mb-1">
                    {hour.hour}
                  </div>
                  <div className="text-neutral-500 text-xs">
                    {index === 0 ? "Peak" : `#${index + 1}`}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-sm col-span-full text-center py-8">
                No peak hours data available
              </p>
            )}
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
