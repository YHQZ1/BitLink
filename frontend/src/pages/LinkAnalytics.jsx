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
  Check,
} from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/Navbar";

const timeRangeOptions = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "all", label: "All Time" },
];

const StatCard = ({ title, value, icon: Icon, subtext }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
    <div className="flex items-center justify-between mb-1 sm:mb-2">
      <span className="text-gray-400 text-xs sm:text-sm">{title}</span>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#7ed957]" />
    </div>
    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
      {value}
    </div>
    {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
  </div>
);

const DataSection = ({
  title,
  icon: Icon,
  data,
  dataKey,
  labelKey = "name",
}) => (
  <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#7ed957]" />
      {title}
    </h3>
    <div className="space-y-2 sm:space-y-3">
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <span className="text-gray-300 text-sm sm:text-base truncate flex-1">
              {item[labelKey] || item.deviceType || item.device || item.source}
            </span>
            <span className="text-[#7ed957] font-semibold text-sm sm:text-base flex-shrink-0">
              {item.count}
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No data available</p>
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
  const [copied, setCopied] = useState(false);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
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
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
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
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
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
    const yearFormat = window.innerWidth < 640 ? "2-digit" : "numeric";
    return new Date(link.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: yearFormat,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar userName={currentUser.name} userEmail={currentUser.email} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-20 sm:pt-24">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 sm:mb-6 lg:mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back to Links</span>
        </button>

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
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {link.shortUrl}
                  </span>
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                </a>
                <button
                  onClick={() => copyToClipboard(link.shortUrl)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
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

            <div className="flex flex-wrap gap-2">
              {timeRangeOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimeRange(value)}
                  className={`flex-1 min-w-[70px] px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                    timeRange === value
                      ? "bg-[#7ed957] text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <StatCard
            title="Total Clicks"
            value={totalClicks}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
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

        <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#7ed957]" />
            Peak Hours (Top 5)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {peakHours.length > 0 ? (
              peakHours.map((hour, index) => (
                <div
                  key={index}
                  className="text-center bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50"
                >
                  <div className="text-[#7ed957] font-bold text-lg sm:text-xl mb-1">
                    {hour.clicks}
                  </div>
                  <div className="text-gray-300 text-sm sm:text-base font-medium">
                    {hour.hour}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {index === 0 ? "Peak" : `#${index + 1}`}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm col-span-full text-center py-4">
                No peak hours data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
