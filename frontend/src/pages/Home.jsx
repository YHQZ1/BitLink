/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
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
  CheckCircle,
  AlertCircle,
  Filter,
  ChevronDown,
  Plus,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../lib/api";

const statsConfig = [
  {
    key: "totalLinks",
    label: "Total Links",
    icon: Link2,
    color: "text-[#76B900]",
  },
  {
    key: "totalClicks",
    label: "Total Clicks",
    icon: MousePointerClick,
    color: "text-[#76B900]",
  },
  {
    key: "avgClicks",
    label: "Avg per Link",
    icon: TrendingUp,
    color: "text-[#76B900]",
  },
  {
    key: "activeLinks",
    label: "Active Links",
    icon: BarChart3,
    color: "text-[#76B900]",
  },
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

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, linkUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0D0F13] border border-neutral-800 max-w-md w-full">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 border border-red-500/30 bg-red-500/10">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-2">Delete Link</h3>
              <p className="text-neutral-400 text-sm mb-3">
                Are you sure you want to delete this link? This action cannot be
                undone.
              </p>
              {linkUrl && (
                <p className="text-xs text-neutral-500 break-all border-l-2 border-neutral-800 pl-3 py-1">
                  {linkUrl}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-transparent border border-neutral-800 text-neutral-300 py-2.5 font-medium hover:border-neutral-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-500 text-white py-2.5 font-medium hover:bg-red-600 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, subtext, color }) => (
  <div className="border border-neutral-800 p-6 hover:border-neutral-700 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <span className="text-neutral-400 text-xs uppercase tracking-wider">
        {label}
      </span>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <div className="text-4xl font-light text-white mb-1">{value}</div>
    {subtext && <div className="text-xs text-neutral-500 mt-2">{subtext}</div>}
  </div>
);

const LinkItem = ({
  link,
  editingLink,
  editOriginalUrl,
  editCustomAlias,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onCopy,
  onNavigate,
  setEditOriginalUrl,
  setEditCustomAlias,
}) => (
  <div className="border border-neutral-800 p-6 hover:border-neutral-700 transition-all">
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#76B900] font-medium hover:text-[#8FD400] flex items-center gap-2 transition-colors"
          >
            <span className="break-all text-sm">{link.shortUrl}</span>
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          </a>
          <button
            onClick={() => onCopy(link.shortUrl)}
            className="text-neutral-500 hover:text-[#76B900] transition-colors p-1 cursor-pointer"
            title="Copy link"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        {editingLink === link.id ? (
          <div className="space-y-3 mb-4">
            <input
              type="url"
              value={editOriginalUrl}
              onChange={(e) => setEditOriginalUrl(e.target.value)}
              className="w-full bg-transparent border border-neutral-700 px-4 py-2.5 text-white text-sm focus:border-[#76B900] outline-none transition-colors"
              placeholder="Original URL"
            />
            <input
              type="text"
              value={editCustomAlias}
              onChange={(e) => setEditCustomAlias(e.target.value)}
              className="w-full bg-transparent border border-neutral-700 px-4 py-2.5 text-white text-sm focus:border-[#76B900] outline-none transition-colors"
              placeholder="Custom alias"
            />
          </div>
        ) : (
          <p className="text-sm text-neutral-400 break-words mb-4 line-clamp-1">
            {link.originalUrl}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{link.createdAt}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span className="text-[#76B900]">{link.clicks}</span> clicks
          </span>
          <span className="text-neutral-600">·</span>
          <span>Last: {link.lastAccessed}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:ml-6 flex-shrink-0">
        <button
          onClick={() => onNavigate(`/qr/${link.id}`)}
          className="p-2.5 border border-neutral-800 hover:border-[#76B900] text-neutral-400 hover:text-[#76B900] transition-colors cursor-pointer"
          title="QR Code"
        >
          <QrCode className="w-4 h-4" />
        </button>
        <button
          onClick={() => onNavigate(`/analytics/${link.id}`)}
          className="p-2.5 border border-neutral-800 hover:border-[#76B900] text-neutral-400 hover:text-[#76B900] transition-colors cursor-pointer"
          title="Analytics"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
        {editingLink === link.id ? (
          <>
            <button
              onClick={() => onSaveEdit(link.id)}
              className="p-2.5 border border-[#76B900] text-[#76B900] hover:bg-[#76B900] hover:text-black transition-colors cursor-pointer"
              title="Save"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={onCancelEdit}
              className="p-2.5 border border-neutral-800 hover:border-red-500 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onEdit(link)}
            className="p-2.5 border border-neutral-800 hover:border-[#76B900] text-neutral-400 hover:text-[#76B900] transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(link.id)}
          className="p-2.5 border border-neutral-800 hover:border-red-500 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const formatLastAccessed = (lastAccessed) => {
  if (!lastAccessed) return "Never";
  const now = new Date();
  const lastAccessDate = new Date(lastAccessed);
  const diffTime = Math.abs(now - lastAccessDate);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return lastAccessDate.toLocaleDateString();
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [currentUser, setCurrentUser] = useState({ name: "", email: "" });
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    avgClicks: 0,
    activeLinks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [linksLoading, setLinksLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [editingLink, setEditingLink] = useState(null);
  const [editOriginalUrl, setEditOriginalUrl] = useState("");
  const [editCustomAlias, setEditCustomAlias] = useState("");
  const [toast, setToast] = useState({
    isVisible: false,
    type: "success",
    message: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    linkId: null,
    linkUrl: "",
  });
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/user/profile");
      const userData = response.data;
      setCurrentUser({ name: userData.name || "User", email: userData.email });
      setIsLoading(false);
    } catch {
      localStorage.removeItem("jwtToken");
      navigate("/auth");
    }
  }, [navigate]);

  const transformLink = useCallback(
    (link) => ({
      id: link.id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      shortUrl: link.shortUrl,
      clicks: link.clicks,
      createdAt: new Date(link.createdAt).toLocaleDateString(),
      lastAccessed: formatLastAccessed(link.lastAccessed),
      qrCode: link.qrCode,
      rawLastAccessed: link.lastAccessed,
      rawCreatedAt: link.createdAt,
    }),
    []
  );

  const fetchUserLinks = useCallback(async () => {
    try {
      setLinksLoading(true);
      const response = await api.get("/api/links/me");
      const transformedLinks = response.data.map(transformLink);
      setLinks(transformedLinks);
      setLinksLoading(false);
    } catch {
      setLinks([]);
      setLinksLoading(false);
    }
  }, [transformLink]);

  const fetchUserStats = useCallback(async () => {
    try {
      const response = await api.get("/api/analytics/stats");
      setStats(response.data);
    } catch {
      const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const activeLinks = links.filter(
        (link) =>
          link.rawLastAccessed && new Date(link.rawLastAccessed) > thirtyDaysAgo
      ).length;

      setStats({
        totalLinks: links.length,
        totalClicks,
        avgClicks: links.length ? Math.round(totalClicks / links.length) : 0,
        activeLinks,
      });
    }
  }, [links]);

  useEffect(() => {
    fetchUserData();
    fetchUserLinks();
  }, [fetchUserData, fetchUserLinks]);

  useEffect(() => {
    if (links.length > 0) {
      fetchUserStats();
    }
  }, [links, fetchUserStats]);

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
  };

  const closeToast = () => setToast((prev) => ({ ...prev, isVisible: false }));

  const handleShorten = async () => {
    if (!url) {
      showToast("error", "Please enter a URL to shorten");
      return;
    }

    try {
      setLinksLoading(true);
      const requestBody = { originalUrl: url };
      if (customAlias) requestBody.customAlias = customAlias;
      const response = await api.post("/api/links/shorten", requestBody);
      const newLink = transformLink(response.data);
      setLinks([newLink, ...links]);
      setUrl("");
      setCustomAlias("");
      showToast("success", "Link shortened successfully");
    } catch (error) {
      // Show the exact error message from the API
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create short link";
      showToast("error", errorMessage);
    } finally {
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
      const requestBody = {};
      if (editOriginalUrl) requestBody.originalUrl = editOriginalUrl;
      if (editCustomAlias) requestBody.customAlias = editCustomAlias;

      const response = await api.put(`/api/links/${linkId}`, requestBody);
      const updatedLink = transformLink(response.data);

      setLinks(links.map((link) => (link.id === linkId ? updatedLink : link)));
      setEditingLink(null);
      setEditOriginalUrl("");
      setEditCustomAlias("");
      showToast("success", "Link updated successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update link";
      showToast("error", errorMessage);
    }
  };

  const cancelEdit = () => {
    setEditingLink(null);
    setEditOriginalUrl("");
    setEditCustomAlias("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("success", "Link copied to clipboard");
  };

  const deleteLink = async (id) => {
    const link = links.find((l) => l.id === id);
    setDeleteModal({
      isOpen: true,
      linkId: id,
      linkUrl: link?.shortUrl || "",
    });
  };

  const confirmDelete = async () => {
    const { linkId } = deleteModal;
    setDeleteModal({ isOpen: false, linkId: null, linkUrl: "" });

    try {
      await api.delete(`/api/links/${linkId}`);
      setLinks(links.filter((link) => link.id !== linkId));
      showToast("success", "Link deleted successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete link";
      showToast("error", errorMessage);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, linkId: null, linkUrl: "" });
  };

  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.originalUrl.toLowerCase().includes(query) ||
      link.shortCode.toLowerCase().includes(query)
    );
  });

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    switch (filterBy) {
      case "recent":
        return new Date(b.rawCreatedAt) - new Date(a.rawCreatedAt);
      case "popular":
        return b.clicks - a.clicks;
      case "recent-activity":
        return (
          new Date(b.rawLastAccessed || 0) - new Date(a.rawLastAccessed || 0)
        );
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neutral-800 border-t-[#76B900] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-neutral-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
      <Navbar userName={currentUser.name} userEmail={currentUser.email} />
      <Toast {...toast} onClose={closeToast} />
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        linkUrl={deleteModal.linkUrl}
      />

      <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-white mb-3">
            Welcome back,{" "}
            <span className="text-[#76B900]">{currentUser.name}</span>
          </h1>
          <p className="text-neutral-400 text-lg">
            Manage your links and track performance
          </p>
        </div>

        {/* Create Link Section */}
        <div className="border border-neutral-800 bg-[#0D0F13] p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
            <h2 className="text-xl font-light text-white">Create Short Link</h2>
          </div>

          <div className="grid gap-4">
            <input
              type="url"
              placeholder="Paste your long URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleShorten()}
              className="w-full bg-transparent border border-neutral-700 px-4 py-3.5 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors text-sm"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Custom alias (optional)"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleShorten()}
                className="flex-1 bg-transparent border border-neutral-700 px-4 py-3.5 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors text-sm"
              />
              <button
                onClick={handleShorten}
                disabled={linksLoading}
                className="border border-[#76B900] text-[#76B900] px-8 py-3.5 font-medium hover:bg-[#76B900] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] text-sm cursor-pointer"
              >
                {linksLoading ? "Creating..." : "Shorten URL"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {statsConfig.map((stat) => (
            <StatCard
              key={stat.key}
              label={stat.label}
              value={
                stat.key === "totalClicks"
                  ? stats[stat.key].toLocaleString()
                  : stats[stat.key]
              }
              icon={stat.icon}
              color={stat.color}
              subtext={stat.key === "activeLinks" ? "Last 30 days" : undefined}
            />
          ))}
        </div>

        {/* Links Section */}
        <div className="border border-neutral-800">
          <div className="p-6 border-b border-neutral-800 bg-[#0D0F13]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-light text-white">Your Links</h2>
                <span className="text-xs text-neutral-500 border border-neutral-800 px-2 py-1">
                  {sortedLinks.length}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border border-neutral-800 pl-10 pr-4 py-2.5 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none w-full sm:w-64 text-sm"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="appearance-none bg-transparent border border-neutral-800 px-4 pr-10 py-2.5 text-white focus:border-[#76B900] outline-none cursor-pointer text-sm min-w-[160px] w-full"
                  >
                    <option value="all" className="bg-[#0D0F13]">
                      All Links
                    </option>
                    <option value="recent" className="bg-[#0D0F13]">
                      Most Recent
                    </option>
                    <option value="recent-activity" className="bg-[#0D0F13]">
                      Recent Activity
                    </option>
                    <option value="popular" className="bg-[#0D0F13]">
                      Most Clicks
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#0B0D10]">
            {linksLoading ? (
              <div className="text-center py-16">
                <div className="w-10 h-10 border-2 border-neutral-800 border-t-[#76B900] rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-neutral-400 text-sm">
                  Loading links...
                </p>
              </div>
            ) : sortedLinks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 border border-neutral-800 flex items-center justify-center mx-auto mb-4">
                  <Link2 className="w-8 h-8 text-neutral-600" />
                </div>
                <p className="text-neutral-300 mb-2 text-lg font-light">
                  No links found
                </p>
                <p className="text-neutral-500 text-sm">
                  {searchQuery
                    ? "Try a different search term"
                    : "Create your first short link above"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedLinks.map((link) => (
                  <LinkItem
                    key={link.id}
                    link={link}
                    editingLink={editingLink}
                    editOriginalUrl={editOriginalUrl}
                    editCustomAlias={editCustomAlias}
                    onEdit={handleEdit}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={cancelEdit}
                    onDelete={deleteLink}
                    onCopy={copyToClipboard}
                    onNavigate={navigate}
                    setEditOriginalUrl={setEditOriginalUrl}
                    setEditCustomAlias={setEditCustomAlias}
                  />
                ))}
              </div>
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
