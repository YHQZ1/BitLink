/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Link2,
  MousePointerClick,
  Users,
  Globe,
  Smartphone,
  Crown,
  ExternalLink,
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
  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 text-sm">{title}</span>
      <Icon className="w-5 h-5 text-[#7ed957]" />
    </div>
    <div className="text-3xl font-bold text-white">{value}</div>
    {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
  </div>
);

const DataRow = ({ label, count, percentage }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-300">{label}</span>
    <div className="flex items-center space-x-3">
      <span className="text-[#7ed957] font-semibold">{count}</span>
      <span className="text-gray-400 text-sm w-12 text-right">
        {percentage}%
      </span>
    </div>
  </div>
);

export default function Analytics() {
  const navigate = useNavigate();
  const [globalStats, setGlobalStats] = useState(null);
  const [topLinks, setTopLinks] = useState([]);
  const [currentUser, setCurrentUser] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");

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

  const fetchGlobalAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/analytics/global", {
        params: { range: timeRange },
      });

      const data = response.data;
      const totalClicks = data.totalClicks || 0;

      const calculatePercentages = (items) =>
        items.map((item) => ({
          ...item,
          percentage:
            totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 0,
        }));

      setGlobalStats({
        ...data,
        trafficSources: calculatePercentages(data.trafficSources || []),
        geographicData: calculatePercentages(data.geographicData || []),
        deviceDistribution: calculatePercentages(
          (data.deviceDistribution || []).map((d) => ({
            ...d,
            device: d.deviceType || d.device,
          }))
        ),
      });

      setTopLinks(data.topLinks || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchUserData();
    fetchGlobalAnalytics();
  }, [fetchUserData, fetchGlobalAnalytics]);

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ed957] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading global analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                Global Analytics
              </h1>
              <p className="text-gray-400">
                Overview of all your links and their combined performance
              </p>
            </div>
            <div className="flex space-x-2">
              {timeRangeOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimeRange(value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Links"
            value={globalStats?.totalLinks || 0}
            icon={Link2}
          />
          <StatCard
            title="Total Clicks"
            value={(globalStats?.totalClicks || 0).toLocaleString()}
            icon={MousePointerClick}
          />
          <StatCard
            title="Avg per Link"
            value={globalStats?.avgClicks || 0}
            icon={TrendingUp}
          />
          <StatCard
            title="Active Links"
            value={globalStats?.activeLinks || 0}
            icon={BarChart3}
            subtext="Last 30 days"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-[#7ed957]" />
              Top Performing Links
            </h3>
            <div className="space-y-4">
              {topLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#7ed957]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#7ed957] font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7ed957] font-medium hover:underline flex items-center space-x-1 text-sm"
                      >
                        <span className="truncate">{link.shortUrl}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                      <p className="text-xs text-gray-400 truncate">
                        {link.originalUrl}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {link.clicks}
                    </div>
                    <div className="text-xs text-gray-500">clicks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#7ed957]" />
              Traffic Sources
            </h3>
            <div className="space-y-3">
              {globalStats?.trafficSources?.map((source, index) => (
                <DataRow
                  key={index}
                  label={source.source}
                  count={source.count}
                  percentage={source.percentage}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-[#7ed957]" />
              Top Countries
            </h3>
            <div className="space-y-3">
              {globalStats?.geographicData?.length > 0 ? (
                globalStats.geographicData.map((country, index) => (
                  <DataRow
                    key={index}
                    label={country.country}
                    count={country.count}
                    percentage={country.percentage}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  Geographic data will appear as your links get clicks from
                  around the world
                </p>
              )}
            </div>
          </div>

          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-[#7ed957]" />
              Device Distribution
            </h3>
            <div className="space-y-3">
              {globalStats?.deviceDistribution?.map((device, index) => (
                <DataRow
                  key={index}
                  label={device.device}
                  count={device.count}
                  percentage={device.percentage}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
