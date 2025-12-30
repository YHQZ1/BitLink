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
  Activity,
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

const DataRow = ({ label, count, percentage, rank }) => (
  <div className="flex items-center gap-4 py-3 border-b border-neutral-800 last:border-0">
    {rank && (
      <div className="w-6 h-6 flex items-center justify-center bg-[#76B900]/10 text-[#76B900] text-xs font-medium flex-shrink-0">
        {rank}
      </div>
    )}
    <span className="text-neutral-300 text-sm flex-1 truncate">{label}</span>
    <div className="flex items-center gap-4 flex-shrink-0">
      <span className="text-[#76B900] font-medium text-sm">{count}</span>
      <span className="text-neutral-500 text-xs w-12 text-right">
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
              <Activity className="w-12 h-12 text-red-400 mx-auto mb-4" />
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

      <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors cursor-pointer text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-white mb-3">
            Global Analytics
          </h1>
          <p className="text-neutral-400 text-lg">
            Overview of all your links and their performance
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex flex-wrap gap-3 mb-8">
          {timeRangeOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTimeRange(value)}
              className={`px-5 py-2.5 font-medium transition-colors cursor-pointer text-sm ${
                timeRange === value
                  ? "bg-[#76B900] text-black"
                  : "border border-neutral-800 text-neutral-300 hover:border-[#76B900] hover:text-[#76B900]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
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

        {/* Top Performing Links - Full Width */}
        <div className="border border-neutral-800 p-8 bg-[#0D0F13] mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
            <h3 className="text-xl font-light text-white">
              Top Performing Links
            </h3>
          </div>

          {topLinks.length > 0 ? (
            <div className="grid gap-4">
              {topLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="border border-neutral-800 p-5 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 flex items-center justify-center bg-[#76B900]/10 text-[#76B900] font-medium flex-shrink-0">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#76B900] hover:text-[#8FD400] flex items-center gap-2 mb-1 transition-colors cursor-pointer"
                        >
                          <span className="truncate text-sm font-medium">
                            {link.shortUrl}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        </a>
                        <p className="text-xs text-neutral-500 truncate">
                          {link.originalUrl}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-light text-white">
                        {link.clicks.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500">clicks</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-sm text-center py-8">
              No links yet. Create your first link to see performance data.
            </p>
          )}
        </div>

        {/* Data Grid - 3 Columns */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Traffic Sources */}
          <div className="border border-neutral-800 p-6 bg-[#0D0F13]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
              <h3 className="text-xl font-light text-white">Traffic Sources</h3>
            </div>
            <div className="space-y-1">
              {globalStats?.trafficSources?.length > 0 ? (
                globalStats.trafficSources.map((source, index) => (
                  <DataRow
                    key={index}
                    rank={index + 1}
                    label={source.source}
                    count={source.count}
                    percentage={source.percentage}
                  />
                ))
              ) : (
                <p className="text-neutral-500 text-sm text-center py-8">
                  No traffic data yet
                </p>
              )}
            </div>
          </div>

          {/* Top Countries */}
          <div className="border border-neutral-800 p-6 bg-[#0D0F13]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
              <h3 className="text-xl font-light text-white">Top Countries</h3>
            </div>
            <div className="space-y-1">
              {globalStats?.geographicData?.length > 0 ? (
                globalStats.geographicData.map((country, index) => (
                  <DataRow
                    key={index}
                    rank={index + 1}
                    label={country.country}
                    count={country.count}
                    percentage={country.percentage}
                  />
                ))
              ) : (
                <p className="text-neutral-500 text-sm text-center py-8">
                  Geographic data will appear as links get clicks
                </p>
              )}
            </div>
          </div>

          {/* Device Distribution */}
          <div className="border border-neutral-800 p-6 bg-[#0D0F13]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
              <h3 className="text-xl font-light text-white">Devices</h3>
            </div>
            <div className="space-y-1">
              {globalStats?.deviceDistribution?.length > 0 ? (
                globalStats.deviceDistribution.map((device, index) => (
                  <DataRow
                    key={index}
                    rank={index + 1}
                    label={device.device}
                    count={device.count}
                    percentage={device.percentage}
                  />
                ))
              ) : (
                <p className="text-neutral-500 text-sm text-center py-8">
                  No device data yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
