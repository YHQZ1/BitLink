/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Link2,
  MousePointerClick,
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

const DataRow = ({ label, count, percentage, rank }) => (
  <div className="flex items-center gap-4 py-3 border-b border-neutral-900/50 last:border-0 group hover:bg-neutral-900/20 transition-all px-2 -mx-2">
    {rank && (
      <div className="w-5 text-neutral-600 text-xs font-medium flex-shrink-0 text-center">
        {rank}
      </div>
    )}
    <span className="text-neutral-300 text-sm flex-1 truncate group-hover:text-white transition-colors">
      {label}
    </span>
    <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
      <span className="text-white font-light text-sm tabular-nums">
        {count}
      </span>
      <span className="text-neutral-600 text-xs w-10 text-right tabular-nums">
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
      setError(null);

      const response = await api.get("/api/analytics/global", {
        params: { range: timeRange },
      });

      const data = response.data;
      const totalClicks = data.totalClicks || 0;

      const calculatePercentages = (items) => {
        if (!items || !Array.isArray(items)) return [];
        return items.map((item) => ({
          ...item,
          percentage:
            totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 0,
        }));
      };

      const trafficSources = Array.isArray(data.trafficSources)
        ? data.trafficSources
        : [];
      const geographicData = Array.isArray(data.geographicData)
        ? data.geographicData
        : [];
      const deviceDistribution = Array.isArray(data.deviceDistribution)
        ? data.deviceDistribution
        : [];

      setGlobalStats({
        ...data,
        trafficSources: calculatePercentages(trafficSources),
        geographicData: calculatePercentages(geographicData),
        deviceDistribution: calculatePercentages(deviceDistribution),
      });

      setTopLinks(Array.isArray(data.topLinks) ? data.topLinks : []);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to load analytics"
      );
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
        <div className="w-full px-8 sm:px-12 lg:px-16 mx-auto pt-20">
          <div className="text-center py-12 lg:py-16">
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
        <div className="w-full px-8 sm:px-12 lg:px-16 mx-auto pt-20">
          <div className="max-w-md mx-auto">
            <div className="border border-red-500/30 bg-red-500/10 p-6 text-center">
              <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-4" />
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

  if (!globalStats) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="w-full px-8 sm:px-12 lg:px-16 mx-auto pt-20">
          <div className="text-center py-12 lg:py-16">
            <p className="text-neutral-400">No analytics data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
      <Navbar userName={currentUser.name} userEmail={currentUser.email} />

      <div className="w-full px-8 sm:px-12 lg:px-16 mx-auto pt-20">
        <div className="mb-10 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white mb-2 tracking-tight">
                Analytics
              </h1>
              <p className="text-neutral-500 text-sm sm:text-base">
                Performance overview across all your links
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-12 gap-y-6 lg:gap-y-8 py-6 lg:py-8 border-y border-neutral-900/50">
            <StatCard
              title="Total Links"
              value={globalStats.totalLinks || 0}
              icon={Link2}
            />
            <StatCard
              title="Total Clicks"
              value={(globalStats.totalClicks || 0).toLocaleString()}
              icon={MousePointerClick}
            />
            <StatCard
              title="Avg per Link"
              value={globalStats.avgClicks || 0}
              icon={TrendingUp}
            />
            <StatCard
              title="Active Links"
              value={globalStats.activeLinks || 0}
              icon={BarChart3}
              subtext="Last 30 days"
            />
          </div>
        </div>

        <div className="mb-12 lg:mb-16">
          <div className="flex items-center gap-3 mb-5 lg:mb-6">
            <h3 className="text-xl sm:text-2xl font-extralight text-white tracking-tight">
              Top Performing Links
            </h3>
            <div className="h-px flex-1 bg-neutral-900"></div>
          </div>

          {topLinks.length > 0 ? (
            <div className="space-y-3 lg:space-y-4">
              {topLinks.map((link, index) => (
                <div key={link.id} className="group relative">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-4 sm:py-5 border-b border-neutral-900/50 hover:border-neutral-800 transition-all">
                    <div className="w-8 text-neutral-600 text-sm font-light flex-shrink-0 group-hover:text-[#76B900] transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#76B900] hover:text-[#8FD400] flex items-center gap-2 mb-1.5 transition-colors cursor-pointer group/link"
                      >
                        <span className="truncate text-sm font-medium">
                          {link.shortUrl}
                        </span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                      <p className="text-xs text-neutral-600 truncate">
                        {link.originalUrl}
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <div className="text-2xl sm:text-3xl font-extralight text-white tabular-nums">
                        {link.clicks.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-600 uppercase tracking-wider mt-0.5">
                        clicks
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 lg:py-12 border border-dashed border-neutral-900">
              <p className="text-neutral-600 text-sm">
                No links yet. Create your first link to see performance data.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-lg sm:text-xl font-extralight text-white tracking-tight">
                Traffic Sources
              </h3>
              <div className="h-px flex-1 bg-neutral-900"></div>
            </div>
            <div className="space-y-1">
              {globalStats.trafficSources?.length > 0 ? (
                globalStats.trafficSources
                  .slice(0, 5)
                  .map((source, index) => (
                    <DataRow
                      key={index}
                      rank={index + 1}
                      label={source.source}
                      count={source.count}
                      percentage={source.percentage}
                    />
                  ))
              ) : (
                <div className="text-center py-8 lg:py-10 border border-dashed border-neutral-900">
                  <p className="text-neutral-600 text-xs">
                    No traffic data yet
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-lg sm:text-xl font-extralight text-white tracking-tight">
                Top Countries
              </h3>
              <div className="h-px flex-1 bg-neutral-900"></div>
            </div>
            <div className="space-y-1">
              {globalStats.geographicData?.length > 0 ? (
                globalStats.geographicData
                  .slice(0, 5)
                  .map((country, index) => (
                    <DataRow
                      key={index}
                      rank={index + 1}
                      label={country.country}
                      count={country.count}
                      percentage={country.percentage}
                    />
                  ))
              ) : (
                <div className="text-center py-8 lg:py-10 border border-dashed border-neutral-900">
                  <p className="text-neutral-600 text-xs">
                    Geographic data will appear as links get clicks
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-lg sm:text-xl font-extralight text-white tracking-tight">
                Devices
              </h3>
              <div className="h-px flex-1 bg-neutral-900"></div>
            </div>
            <div className="space-y-1">
              {globalStats.deviceDistribution?.length > 0 ? (
                globalStats.deviceDistribution
                  .slice(0, 5)
                  .map((device, index) => (
                    <DataRow
                      key={index}
                      rank={index + 1}
                      label={device.device}
                      count={device.count}
                      percentage={device.percentage}
                    />
                  ))
              ) : (
                <div className="text-center py-8 lg:py-10 border border-dashed border-neutral-900">
                  <p className="text-neutral-600 text-xs">No device data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
