import React, { useState } from "react";
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
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  // Mock user data
  const userName = "Uttkarsh";

  // Mock links data
  const [links, setLinks] = useState([
    {
      id: 1,
      originalUrl:
        "https://www.example.com/very-long-url-that-needs-shortening",
      shortCode: "abc123",
      shortUrl: "bit.lk/abc123",
      clicks: 1247,
      createdAt: "2025-10-01",
      lastAccessed: "2 hours ago",
    },
    {
      id: 2,
      originalUrl: "https://docs.myproject.com/getting-started/installation",
      shortCode: "docs-start",
      shortUrl: "bit.lk/docs-start",
      clicks: 856,
      createdAt: "2025-09-28",
      lastAccessed: "5 hours ago",
    },
    {
      id: 3,
      originalUrl: "https://github.com/myrepo/awesome-project",
      shortCode: "gh-awesome",
      shortUrl: "bit.lk/gh-awesome",
      clicks: 2341,
      createdAt: "2025-09-25",
      lastAccessed: "1 day ago",
    },
  ]);

  // Stats
  const stats = {
    totalLinks: links.length,
    totalClicks: links.reduce((sum, link) => sum + link.clicks, 0),
    avgClicks: Math.round(
      links.reduce((sum, link) => sum + link.clicks, 0) / links.length
    ),
    activeLinks: links.length,
  };

  const handleShorten = () => {
    if (url) {
      const newLink = {
        id: Date.now(),
        originalUrl: url,
        shortCode: customAlias || Math.random().toString(36).substring(7),
        shortUrl: `bit.lk/${
          customAlias || Math.random().toString(36).substring(7)
        }`,
        clicks: 0,
        createdAt: new Date().toISOString().split("T")[0],
        lastAccessed: "Just now",
      };
      setLinks([newLink, ...links]);
      setUrl("");
      setCustomAlias("");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const deleteLink = (id) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar userName={userName} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome back, {userName}
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
            <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-md">
              <input
                type="url"
                placeholder="Paste your URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none transition-colors"
              />
              <button
                onClick={handleShorten}
                className="bg-[#7ed957] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#8ee367] transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Shorten</span>
              </button>
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
            <div className="space-y-3">
              {links.map((link) => (
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
                      <p className="text-xs text-gray-400 truncate mb-2">
                        {link.originalUrl}
                      </p>
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
                        <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group">
                          <QrCode className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </button>
                        <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group">
                          <BarChart3 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </button>
                        <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group">
                          <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </button>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="p-2 bg-gray-800 hover:bg-red-900/50 rounded-lg transition-colors duration-200 group"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {links.length === 0 && (
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
