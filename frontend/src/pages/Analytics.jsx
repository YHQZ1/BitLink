import React, { useState, useEffect } from "react";
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
  Calendar,
  Crown,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function Analytics() {
  const navigate = useNavigate();
  const [globalStats, setGlobalStats] = useState(null);
  const [topLinks, setTopLinks] = useState([]);
  const [currentUser, setCurrentUser] = useState({ name: "", profileImage: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    fetchUserData();
    fetchGlobalAnalytics();
  }, [timeRange]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");
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

  const fetchGlobalAnalytics = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");
      
      if (!token) {
        throw new Error("Please login to view analytics");
      }

      // Fetch all user links first
      const linksResponse = await axios.get(`${BASE_URL}/api/links/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const links = linksResponse.data.links;

      // Calculate global stats
      const totalLinks = links.length;
      const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
      const avgClicks = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

      // Get top 5 performing links
      const topPerformingLinks = links
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5)
        .map(link => ({
          id: link._id,
          shortUrl: link.shortUrl,
          originalUrl: link.originalUrl,
          clicks: link.clicks,
          createdAt: link.createdAt,
        }));

      // Calculate active links (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const activeLinks = links.filter(link => 
        link.lastAccessed && new Date(link.lastAccessed) > thirtyDaysAgo
      ).length;

      // Mock global analytics data (you can enhance this with real backend analytics)
      const globalAnalytics = {
        totalLinks,
        totalClicks,
        avgClicks,
        activeLinks,
        topLinks: topPerformingLinks,
        trafficSources: calculateGlobalTrafficSources(links),
        geographicData: calculateGlobalGeographicData(links),
        deviceDistribution: calculateGlobalDeviceDistribution(links),
        growthData: calculateGrowthData(links, timeRange),
      };

      setGlobalStats(globalAnalytics);
      setTopLinks(topPerformingLinks);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching global analytics:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Helper functions for global analytics
  const calculateGlobalTrafficSources = (links) => {
    // This would come from your backend analytics aggregation
    return [
      { source: 'Direct', percentage: 45, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.45) },
      { source: 'Social Media', percentage: 30, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.3) },
      { source: 'Email', percentage: 15, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.15) },
      { source: 'Search', percentage: 10, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.1) },
    ];
  };

  const calculateGlobalGeographicData = (links) => {
    return [
      { country: 'United States', percentage: 40, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.4) },
      { country: 'India', percentage: 25, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.25) },
      { country: 'United Kingdom', percentage: 15, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.15) },
      { country: 'Germany', percentage: 10, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.1) },
      { country: 'Other', percentage: 10, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.1) },
    ];
  };

  const calculateGlobalDeviceDistribution = (links) => {
    return [
      { device: 'Mobile', percentage: 60, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.6) },
      { device: 'Desktop', percentage: 35, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.35) },
      { device: 'Tablet', percentage: 5, count: Math.floor(links.reduce((sum, link) => sum + link.clicks, 0) * 0.05) },
    ];
  };

  const calculateGrowthData = (links, range) => {
    // Mock growth data - in real app, this would come from time-based analytics
    const baseClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    return [
      { period: 'Jan', clicks: Math.floor(baseClicks * 0.1) },
      { period: 'Feb', clicks: Math.floor(baseClicks * 0.15) },
      { period: 'Mar', clicks: Math.floor(baseClicks * 0.2) },
      { period: 'Apr', clicks: Math.floor(baseClicks * 0.25) },
      { period: 'May', clicks: Math.floor(baseClicks * 0.3) },
      { period: 'Jun', clicks: Math.floor(baseClicks * 0.35) },
    ];
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar userName={currentUser.name} profileImage={currentUser.profileImage} />
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
        <Navbar userName={currentUser.name} profileImage={currentUser.profileImage} />
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
      <Navbar userName={currentUser.name} profileImage={currentUser.profileImage} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">Global Analytics</h1>
              <p className="text-gray-400">
                Overview of all your links and their combined performance
              </p>
            </div>

            {/* Time Range Filter */}
            <div className="flex space-x-2">
              {["7d", "30d", "90d", "all"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    timeRange === range
                      ? "bg-[#7ed957] text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "All Time"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Links</span>
              <Link2 className="w-5 h-5 text-[#7ed957]" />
            </div>
            <div className="text-3xl font-bold text-white">{globalStats?.totalLinks || 0}</div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Clicks</span>
              <MousePointerClick className="w-5 h-5 text-[#7ed957]" />
            </div>
            <div className="text-3xl font-bold text-white">{globalStats?.totalClicks?.toLocaleString() || 0}</div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Avg per Link</span>
              <TrendingUp className="w-5 h-5 text-[#7ed957]" />
            </div>
            <div className="text-3xl font-bold text-white">{globalStats?.avgClicks || 0}</div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Active Links</span>
              <BarChart3 className="w-5 h-5 text-[#7ed957]" />
            </div>
            <div className="text-3xl font-bold text-white">{globalStats?.activeLinks || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Links */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-[#7ed957]" />
              Top Performing Links
            </h3>
            <div className="space-y-4">
              {topLinks.map((link, index) => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#7ed957]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#7ed957] font-bold text-sm">{index + 1}</span>
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
                      <p className="text-xs text-gray-400 truncate">{link.originalUrl}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{link.clicks}</div>
                    <div className="text-xs text-gray-500">clicks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#7ed957]" />
              Traffic Sources
            </h3>
            <div className="space-y-3">
              {globalStats?.trafficSources?.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{source.source}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-[#7ed957] font-semibold">{source.count}</span>
                    <span className="text-gray-400 text-sm w-12 text-right">{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Geographic Distribution */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-[#7ed957]" />
              Top Countries
            </h3>
            <div className="space-y-3">
              {globalStats?.geographicData?.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{country.country}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-[#7ed957] font-semibold">{country.count}</span>
                    <span className="text-gray-400 text-sm w-12 text-right">{country.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Distribution */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-[#7ed957]" />
              Device Distribution
            </h3>
            <div className="space-y-3">
              {globalStats?.deviceDistribution?.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{device.device}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-[#7ed957] font-semibold">{device.count}</span>
                    <span className="text-gray-400 text-sm w-12 text-right">{device.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}