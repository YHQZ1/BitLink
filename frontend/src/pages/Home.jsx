import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2,
  QrCode,
  BarChart3,
  Search,
  Copy,
  Edit2,
  Trash2,
  ExternalLink,
  TrendingUp,
  MousePointerClick,
  Calendar,
  X,
  Save,
} from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function Home() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [currentUser, setCurrentUser] = useState({
    name: "",
    profileImage: null,
  });
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    avgClicks: 0,
    activeLinks: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [linksLoading, setLinksLoading] = useState(false);
  const [error, setError] = useState(null);
  const [links, setLinks] = useState([]);
  const [editingLink, setEditingLink] = useState(null);
  const [editOriginalUrl, setEditOriginalUrl] = useState("");
  const [editCustomAlias, setEditCustomAlias] = useState("");
  const navigate = useNavigate();

  // Fetch user data and links from backend
  useEffect(() => {
    fetchUserData();
    fetchUserLinks();
    fetchUserStats();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("jwtToken");

      if (!token) {
        throw new Error("Please login to access your data");
      }

      const response = await axios.get(`${BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = response.data;
      setCurrentUser({
        name: userData.name || userData.username || "User",
        profileImage: userData.profileImage || null,
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
      setCurrentUser({
        name: "Guest",
        profileImage: null,
      });
      setIsLoading(false);
    }
  };

  const fetchUserLinks = async () => {
    try {
      setLinksLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("jwtToken");

      if (!token) {
        throw new Error("Please login to access your links");
      }

      const response = await axios.get(`${BASE_URL}/api/links/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const transformedLinks = response.data.links.map((link) => ({
        id: link._id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl: link.shortUrl,
        clicks: link.clicks,
        createdAt: new Date(link.createdAt).toLocaleDateString(),
        lastAccessed: formatLastAccessed(link.lastAccessed),
        qrCode: link.qrCode,
        rawLastAccessed: link.lastAccessed,
        rawCreatedAt: link.createdAt, // Add this for proper sorting
      }));

      setLinks(transformedLinks);
      setLinksLoading(false);

      // Refresh stats after loading links
      fetchUserStats();
    } catch (error) {
      console.error("Error fetching links:", error);
      setLinks([]);
      setLinksLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("jwtToken");

      if (!token) return;

      const response = await axios.get(`${BASE_URL}/api/links/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Fallback to calculated stats
      setStats({
        totalLinks: links.length,
        totalClicks: links.reduce((sum, link) => sum + link.clicks, 0),
        avgClicks:
          links.length > 0
            ? Math.round(
                links.reduce((sum, link) => sum + link.clicks, 0) / links.length
              )
            : 0,
        activeLinks: links.filter((link) => {
          if (!link.rawLastAccessed) return false;
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return new Date(link.rawLastAccessed) > thirtyDaysAgo;
        }).length,
      });
    }
  };

  const formatLastAccessed = (lastAccessed) => {
    if (!lastAccessed) return "Never";

    const now = new Date();
    const lastAccessDate = new Date(lastAccessed);
    const diffTime = Math.abs(now - lastAccessDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return lastAccessDate.toLocaleDateString();
  };

  const handleShorten = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    try {
      setLinksLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("jwtToken");

      const requestBody = { originalUrl: url };
      if (customAlias) {
        requestBody.customAlias = customAlias;
      }

      const response = await axios.post(
        `${BASE_URL}/api/links/shorten`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newLink = response.data.link;
      const transformedLink = {
        id: newLink._id,
        originalUrl: newLink.originalUrl,
        shortCode: newLink.shortCode,
        shortUrl: newLink.shortUrl,
        clicks: newLink.clicks,
        createdAt: new Date(newLink.createdAt).toLocaleDateString(),
        lastAccessed: "Never",
        qrCode: newLink.qrCode,
        rawLastAccessed: null,
        rawCreatedAt: newLink.createdAt,
      };

      setLinks([transformedLink, ...links]);
      setUrl("");
      setCustomAlias("");
      setLinksLoading(false);

      // Refresh stats after creating new link
      fetchUserStats();

      alert("Link shortened successfully!");
    } catch (error) {
      console.error("Error creating short link:", error);
      alert(error.response?.data?.error || "Failed to create short link");
      setLinksLoading(false);
    }
  };

  const handleEdit = (link) => {
    setEditingLink(link.id);
    setEditOriginalUrl(link.originalUrl);
    setEditCustomAlias(link.shortCode);
  };

  const handleSaveEdit = async (linkId) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("jwtToken");

      const requestBody = {};
      if (editOriginalUrl) requestBody.originalUrl = editOriginalUrl;
      if (editCustomAlias) requestBody.customAlias = editCustomAlias;

      const response = await axios.put(
        `${BASE_URL}/api/links/${linkId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedLink = response.data.link;
      const transformedLink = {
        id: updatedLink._id,
        originalUrl: updatedLink.originalUrl,
        shortCode: updatedLink.shortCode,
        shortUrl: updatedLink.shortUrl,
        clicks: updatedLink.clicks,
        createdAt: new Date(updatedLink.createdAt).toLocaleDateString(),
        lastAccessed: formatLastAccessed(updatedLink.lastAccessed),
        qrCode: updatedLink.qrCode,
        rawLastAccessed: updatedLink.lastAccessed,
        rawCreatedAt: updatedLink.createdAt,
      };

      setLinks(
        links.map((link) => (link.id === linkId ? transformedLink : link))
      );

      setEditingLink(null);
      setEditOriginalUrl("");
      setEditCustomAlias("");

      // Refresh stats after edit
      fetchUserStats();

      alert("Link updated successfully!");
    } catch (error) {
      console.error("Error updating link:", error);
      alert(error.response?.data?.error || "Failed to update link");
    }
  };

  const cancelEdit = () => {
    setEditingLink(null);
    setEditOriginalUrl("");
    setEditCustomAlias("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const deleteLink = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("jwtToken");

      await axios.delete(`${BASE_URL}/api/links/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setLinks(links.filter((link) => link.id !== id));

      // Refresh stats after delete
      fetchUserStats();

      alert("Link deleted successfully!");
    } catch (error) {
      console.error("Error deleting link:", error);
      alert(error.response?.data?.error || "Failed to delete link");
    }
  };

  // Filter and sort links based on search and filter
  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      searchQuery === "" ||
      link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.shortCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    switch (filterBy) {
      case "recent":
        // Use raw creation dates for accurate sorting
        const dateA = a.rawCreatedAt
          ? new Date(a.rawCreatedAt)
          : new Date(a.createdAt);
        const dateB = b.rawCreatedAt
          ? new Date(b.rawCreatedAt)
          : new Date(b.createdAt);
        return dateB - dateA;
      case "popular":
        return b.clicks - a.clicks;
      case "recent-activity":
        const activityA = a.rawLastAccessed
          ? new Date(a.rawLastAccessed)
          : new Date(0);
        const activityB = b.rawLastAccessed
          ? new Date(b.rawLastAccessed)
          : new Date(0);
        return activityB - activityA;
      default:
        return 0;
    }
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ed957] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar
        userName={currentUser.name}
        profileImage={currentUser.profileImage}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-gray-400">
            Manage your links and track performance
          </p>
        </div>

        {/* Quick Action Card */}
        <div className="bg-gradient-to-br from-[#7ed957]/10 to-transparent border border-[#7ed957]/20 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white mb-2">
                Create Short Link
              </h2>
              <p className="text-gray-400 text-sm">
                Shorten URLs instantly with custom aliases
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-1 max-w-md">
              <input
                type="url"
                placeholder="Paste your URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none transition-colors"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Custom alias (optional)"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none transition-colors"
                />
                <button
                  onClick={handleShorten}
                  disabled={linksLoading}
                  className="bg-[#7ed957] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#8ee367] transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {linksLoading ? "Shortening..." : "Shorten"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Links</span>
              <Link2 className="w-4 h-4 text-[#7ed957]" />
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.totalLinks}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Clicks</span>
              <MousePointerClick className="w-4 h-4 text-[#7ed957]" />
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.totalClicks.toLocaleString()}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Avg per Link</span>
              <TrendingUp className="w-4 h-4 text-[#7ed957]" />
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.avgClicks}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Active Links</span>
              <BarChart3 className="w-4 h-4 text-[#7ed957]" />
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.activeLinks}
            </div>
            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
          </div>
        </div>

        {/* Links Management Section */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl">
          {/* Header with Search and Filters */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-white">Your Links</h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search links..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none w-full sm:w-64 transition-colors"
                  />
                </div>

                <div className="relative inline-block">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="appearance-none bg-gray-900/50 border border-gray-700 rounded-lg px-4 pr-10 py-2 text-white focus:border-[#7ed957] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="all">All Links</option>
                    <option value="recent">Most Recent</option>
                    <option value="recent-activity">Recent Activity</option>
                    <option value="popular">Most Clicks</option>
                  </select>

                  <svg
                    className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Links List */}
          <div className="p-6">
            {linksLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7ed957] mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading links...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedLinks.map((link) => (
                  <div
                    key={link.id}
                    className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Link Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <a
                            href={link.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#7ed957] font-medium hover:underline flex items-center space-x-1 text-sm"
                          >
                            <span>{link.shortUrl}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => copyToClipboard(link.shortUrl)}
                            className="text-gray-400 hover:text-white transition-colors p-1"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        {editingLink === link.id ? (
                          <div className="space-y-2 mb-2">
                            <input
                              type="url"
                              value={editOriginalUrl}
                              onChange={(e) =>
                                setEditOriginalUrl(e.target.value)
                              }
                              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white text-xs focus:border-[#7ed957] focus:outline-none"
                              placeholder="Original URL"
                            />
                            <input
                              type="text"
                              value={editCustomAlias}
                              onChange={(e) =>
                                setEditCustomAlias(e.target.value)
                              }
                              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white text-xs focus:border-[#7ed957] focus:outline-none"
                              placeholder="Custom alias"
                            />
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 truncate mb-2">
                            {link.originalUrl}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{link.createdAt}</span>
                          </span>
                          <span>Last click: {link.lastAccessed}</span>
                        </div>
                      </div>

                      {/* Stats and Actions */}
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">
                            {link.clicks}
                          </div>
                          <div className="text-xs text-gray-500">Clicks</div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => navigate(`/qr/${link.id}`)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group cursor-pointer"
                          >
                            <QrCode className="w-4 h-4 text-gray-400 group-hover:text-white" />
                          </button>
                          <button
                            onClick={() => navigate(`/analytics/${link.id}`)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group cursor-pointer"
                          >
                            <BarChart3 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                          </button>
                          {editingLink === link.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(link.id)}
                                className="p-2 bg-gray-800 hover:bg-green-900/50 rounded-lg transition-colors duration-200 group cursor-pointer"
                              >
                                <Save className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group cursor-pointer"
                              >
                                <X className="w-4 h-4 text-gray-400 group-hover:text-white" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEdit(link)}
                              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteLink(link.id)}
                            className="p-2 bg-gray-800 hover:bg-red-900/50 rounded-lg transition-colors duration-200 group cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!linksLoading && sortedLinks.length === 0 && (
              <div className="text-center py-12">
                <Link2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No links created yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  Create your first short link above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
