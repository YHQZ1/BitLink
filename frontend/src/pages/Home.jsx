import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2,
  QrCode,
  BarChart3,
  Copy,
  Edit2,
  Trash2,
  ExternalLink,
  MousePointerClick,
  Calendar,
  X,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import PageLoader from "../components/PageLoader";

const normalizeAndValidateUrl = (input) => {
  if (!input) return null;

  let value = input.trim();

  if (!/^https?:\/\//i.test(value)) {
    value = "https://" + value;
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) return null;

    const hostname = url.hostname;

    if (
      !hostname ||
      !hostname.includes(".") ||
      hostname.startsWith(".") ||
      hostname.endsWith(".")
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
};

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
  <div className="group py-4 border-b border-neutral-900/50 last:border-0 hover:bg-neutral-900/20 transition-all px-2 -mx-2">
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#76B900] font-light hover:text-[#8FD400] flex items-center gap-2 transition-colors text-base group/link"
          >
            <span className="break-all">{link.shortUrl}</span>
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
          <button
            onClick={() => onCopy(link.shortUrl)}
            className="text-neutral-500 hover:text-[#76B900] transition-colors p-1 cursor-pointer opacity-0 group-hover:opacity-100"
            title="Copy link"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        {editingLink === link.id ? (
          <div className="space-y-3 mb-3">
            <input
              type="url"
              value={editOriginalUrl}
              onChange={(e) => setEditOriginalUrl(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-700 px-0 py-2 text-white text-sm focus:border-[#76B900] outline-none transition-colors"
              placeholder="Original URL"
            />
            <input
              type="text"
              value={editCustomAlias}
              onChange={(e) => setEditCustomAlias(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-700 px-0 py-2 text-white text-sm focus:border-[#76B900] outline-none transition-colors"
              placeholder="Custom alias"
            />
          </div>
        ) : (
          <p className="text-sm text-neutral-500 break-words mb-3 line-clamp-1 font-light">
            {link.originalUrl}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-neutral-600">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{link.createdAt}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span className="text-[#76B900] tabular-nums">
              {link.clicks}
            </span>{" "}
            clicks
          </span>
          <span className="hidden sm:inline text-neutral-800">·</span>
          <span className="text-xs">Last: {link.lastAccessed}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:ml-6 flex-shrink-0">
        <button
          onClick={() => onNavigate(`/qr/${link.id}`)}
          className="p-2 text-neutral-500 hover:text-[#76B900] transition-colors cursor-pointer"
          title="QR Code"
        >
          <QrCode className="w-4 h-4" />
        </button>
        <button
          onClick={() => onNavigate(`/analytics/${link.id}`)}
          className="p-2 text-neutral-500 hover:text-[#76B900] transition-colors cursor-pointer"
          title="Analytics"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
        {editingLink === link.id ? (
          <>
            <button
              onClick={() => onSaveEdit(link.id)}
              className="p-2 text-[#76B900] hover:text-white transition-colors cursor-pointer"
              title="Save"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={onCancelEdit}
              className="p-2 text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onEdit(link)}
            className="p-2 text-neutral-500 hover:text-[#76B900] transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(link.id)}
          className="p-2 text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
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
      shortUrl: `${import.meta.env.VITE_BACKEND_URL}/r/${link.shortCode}`,
      clicks: link.clicks,
      createdAt: new Date(link.createdAt).toLocaleDateString(),
      lastAccessed: formatLastAccessed(link.lastAccessed),
      qrCode: link.qrCode,
      rawLastAccessed: link.lastAccessed,
      rawCreatedAt: link.createdAt,
    }),
    [],
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
          link.rawLastAccessed &&
          new Date(link.rawLastAccessed) > thirtyDaysAgo,
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
      showToast("error", "Please enter a URL");
      return;
    }

    const normalizedUrl = normalizeAndValidateUrl(url);

    if (!normalizedUrl) {
      showToast("error", "Please enter a valid URL");
      return;
    }

    try {
      setLinksLoading(true);
      const requestBody = { originalUrl: normalizedUrl };
      if (customAlias) requestBody.customAlias = customAlias;
      const response = await api.post("/api/links/shorten", requestBody);
      const newLink = transformLink(response.data);
      setLinks([newLink, ...links]);
      setUrl("");
      setCustomAlias("");
      showToast("success", "Link shortened successfully");
    } catch (error) {
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
      if (editOriginalUrl) {
        const normalized = normalizeAndValidateUrl(editOriginalUrl);
        if (!normalized) {
          showToast("error", "Invalid URL");
          return;
        }
        requestBody.originalUrl = normalized;
      }

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
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <PageLoader label="Loading Homepage..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col">
      <Navbar userName={currentUser.name} userEmail={currentUser.email} />
      <Toast {...toast} onClose={closeToast} />
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        linkUrl={deleteModal.linkUrl}
      />

      <div className="w-full px-8 sm:px-12 lg:px-16 mx-auto pt-20">
        {/* Header */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mb-10">
          <div>
            <p className="text-neutral-600 text-xs uppercase tracking-[0.3em] mb-3">
              Welcome back
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-thin text-white leading-[0.9] tracking-tight mb-3">
              {currentUser.name}
            </h1>
            <div className="flex items-baseline gap-4 mt-4">
              <div className="h-px w-12 lg:w-16 bg-[#76B900]"></div>
              <p className="text-neutral-600 text-xs uppercase tracking-widest">
                Dashboard
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-end items-end gap-4">
            <div className="w-20 lg:w-24 h-20 lg:h-24 border-2 border-neutral-900 flex items-center justify-center">
              <Link2 className="w-10 lg:w-12 h-10 lg:h-12 text-neutral-900" />
            </div>
            <div className="flex gap-2">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-neutral-900"></div>
              <div className="w-10 lg:w-12 h-10 lg:h-12 border border-neutral-900"></div>
            </div>
          </div>
        </div>

        {/* Create form and stats */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 mb-12 lg:mb-16">
          <div>
            <div className="mb-5">
              <label className="text-[#76B900] text-xs uppercase tracking-[0.3em] mb-3 block">
                Create New Link
              </label>
              <input
                type="url"
                placeholder="Paste your URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleShorten()}
                className="w-full bg-transparent border-b-2 border-neutral-800 px-0 py-3 lg:py-4 text-white text-xl lg:text-2xl font-thin placeholder-neutral-800 focus:border-[#76B900] outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="custom-alias"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleShorten()}
                  className="w-full bg-transparent border-b border-neutral-900 px-0 py-2.5 text-white placeholder-neutral-700 focus:border-[#76B900] outline-none transition-colors font-light text-sm"
                />
              </div>
              <button
                onClick={handleShorten}
                disabled={linksLoading}
                className="border-2 border-[#76B900] text-[#76B900] px-6 sm:px-8 py-2.5 font-medium hover:bg-[#76B900] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest cursor-pointer w-full sm:w-auto"
              >
                {linksLoading ? "..." : "Shorten"}
              </button>
            </div>

            <div className="flex gap-6 lg:gap-12 mt-6 lg:mt-8 text-xs">
              <div>
                <span className="text-neutral-700 uppercase tracking-wider">
                  Avg/Link
                </span>
                <span className="text-white ml-3 tabular-nums">
                  {stats.avgClicks}
                </span>
              </div>
              <div>
                <span className="text-neutral-700 uppercase tracking-wider">
                  Active
                </span>
                <span className="text-white ml-3 tabular-nums">
                  {stats.activeLinks}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Stats */}
          <div className="flex flex-col justify-end gap-6 lg:gap-8 mt-6 lg:mt-0">
            <div className="space-y-5 lg:space-y-6">
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-[#76B900]"></div>
                <div className="text-5xl sm:text-6xl lg:text-7xl font-thin text-white tabular-nums mb-1.5 tracking-tighter">
                  {stats.totalLinks}
                </div>
                <div className="text-xs text-neutral-600 uppercase tracking-[0.3em]">
                  Links Created
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-neutral-800"></div>
                <div className="text-5xl sm:text-6xl lg:text-7xl font-thin text-[#76B900] tabular-nums mb-1.5 tracking-tighter">
                  {stats.totalClicks.toLocaleString()}
                </div>
                <div className="text-xs text-neutral-600 uppercase tracking-[0.3em]">
                  Total Clicks
                </div>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1 h-px bg-neutral-900"></div>
              <div className="w-3 h-3 bg-[#76B900]"></div>
            </div>
          </div>
        </div>

        {/* Links section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-6">
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-thin text-white">
                Links
              </h2>
              <span className="text-neutral-700 text-sm">
                ({sortedLinks.length})
              </span>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-b border-neutral-900 px-0 py-1 text-white placeholder-neutral-700 focus:border-[#76B900] outline-none w-32 text-sm"
                />
              </div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="bg-transparent border-b border-neutral-900 px-0 py-1 text-white focus:border-[#76B900] outline-none cursor-pointer text-sm appearance-none"
              >
                <option value="all" className="bg-[#0D0F13]">
                  All
                </option>
                <option value="recent" className="bg-[#0D0F13]">
                  Recent
                </option>
                <option value="recent-activity" className="bg-[#0D0F13]">
                  Activity
                </option>
                <option value="popular" className="bg-[#0D0F13]">
                  Popular
                </option>
              </select>
            </div>
          </div>

          <div className="border-t border-neutral-900">
            {linksLoading ? (
              <div className="text-center py-12 lg:py-16">
                <div className="w-10 h-10 border-2 border-neutral-800 border-t-[#76B900] rounded-full animate-spin mx-auto"></div>
              </div>
            ) : sortedLinks.length === 0 ? (
              <div className="py-12 lg:py-20 text-center">
                <div className="text-6xl lg:text-8xl font-thin text-neutral-900 mb-3">
                  ∅
                </div>
                <p className="text-neutral-600 text-sm">
                  {searchQuery ? "No matches" : "No links yet"}
                </p>
              </div>
            ) : (
              <div>
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
