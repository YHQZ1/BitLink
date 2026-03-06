/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Save,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Calendar,
  Hash,
  Trash2,
} from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import PageLoader from "../components/PageLoader";

const Toast = ({ isVisible, type, message, onClose, action }) => {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);

  const triggerClose = () => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      onClose();
    }, 280);
  };

  useEffect(() => {
    if (isVisible && !action) {
      timerRef.current = setTimeout(triggerClose, 3000);
      return () => clearTimeout(timerRef.current);
    }
  }, [isVisible, action]);

  if (!isVisible) return null;

  const configs = {
    success: {
      icon: CheckCircle,
      accent: "text-[#76B900]",
      bar: "bg-[#76B900]",
    },
    error: {
      icon: AlertCircle,
      accent: "text-[#e05c5c]",
      bar: "bg-[#e05c5c]",
    },
    warning: {
      icon: AlertCircle,
      accent: "text-[#e0a85c]",
      bar: "bg-[#e0a85c]",
    },
  };

  const { icon: Icon, accent, bar } = configs[type] || configs.success;

  return (
    <div
      className={`fixed top-20 right-4 sm:right-5 z-50 ${exiting ? "animate-slide-out" : "animate-slide-in"}`}
    >
      <div className="bg-[#111316] border border-neutral-800 text-white px-4 py-3.5 flex items-start gap-3 min-w-[280px] max-w-[calc(100vw-2rem)] sm:min-w-[300px] sm:max-w-sm shadow-2xl relative overflow-hidden">
        {/* accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${bar}`} />

        <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${accent}`} />

        <div className="flex-1">
          <span className="text-sm font-light text-neutral-200">{message}</span>
          {action && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  clearTimeout(timerRef.current);
                  action.onConfirm();
                }}
                className="bg-[#1e1010] hover:bg-[#2a1010] border border-[#e05c5c]/30 hover:border-[#e05c5c]/60 text-[#e05c5c] text-xs px-3 py-1.5 font-medium transition-colors"
              >
                {action.confirmLabel}
              </button>
              <button
                onClick={triggerClose}
                className="bg-neutral-800/60 hover:bg-neutral-700/60 text-neutral-400 hover:text-neutral-300 text-xs px-3 py-1.5 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {!action && (
          <button
            onClick={triggerClose}
            className="text-neutral-600 hover:text-neutral-300 transition-colors cursor-pointer mt-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

const SectionDivider = ({ title, danger }) => (
  <div className="flex items-center gap-4 mb-8">
    <h2
      className={`text-2xl sm:text-3xl font-extralight tracking-tight whitespace-nowrap ${danger ? "text-[#e05c5c]" : "text-white"}`}
    >
      {title}
    </h2>
    <div
      className={`h-px flex-1 ${danger ? "bg-[#e05c5c]/20" : "bg-neutral-800"}`}
    />
  </div>
);

const InputField = ({
  label,
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  disabled,
  hint,
  rightElement,
}) => (
  <div>
    <label className="text-neutral-500 text-xs uppercase tracking-widest mb-3 block font-medium">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full bg-transparent border-b py-3 text-white placeholder-neutral-700 focus:border-[#76B900] outline-none transition-colors font-light text-sm ${Icon ? "pl-8" : "pl-0"} ${rightElement ? "pr-10" : "pr-0"} ${disabled ? "border-neutral-800 opacity-40 cursor-not-allowed" : "border-neutral-800 hover:border-neutral-600"}`}
      />
      {rightElement && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
    {hint && (
      <p className={`text-xs mt-2 font-light ${hint.color}`}>{hint.text}</p>
    )}
  </div>
);

const SubmitButton = ({
  loading,
  disabled,
  loadingLabel,
  label,
  icon: Icon,
}) => (
  <button
    type="submit"
    disabled={loading || disabled}
    className="flex items-center justify-center gap-2 bg-[#76B900] text-black px-8 py-2.5 font-medium hover:bg-[#8FD400] active:bg-[#6aa300] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs uppercase tracking-wider"
  >
    {loading ? (
      <>
        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <span>{loadingLabel}</span>
      </>
    ) : (
      <>
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </>
    )}
  </button>
);

const EMPTY_PROVIDERS = { google: false, github: false, password: false };

export default function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    createdAt: "",
    id: "",
    avatar: null,
    providers: EMPTY_PROVIDERS,
    preferences: { emailSecurityAlerts: true, emailProductUpdates: true },
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    type: "success",
    message: "",
    action: null,
  });

  const isOAuthUser = !currentUser.providers.password;

  const showToast = (type, message, action = null) =>
    setToast({ isVisible: true, type, message, action });

  const closeToast = () =>
    setToast((prev) => ({ ...prev, isVisible: false, action: null }));

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/api/user/profile");
        setCurrentUser({
          name: data.name || "",
          email: data.email || "",
          createdAt: data.createdAt || "",
          id: data.id || "",
          avatar: data.avatar || null,
          providers: data.providers || EMPTY_PROVIDERS,
          preferences: data.preferences || {
            emailSecurityAlerts: true,
            emailProductUpdates: true,
          },
        });
        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
        }));
      } catch {
        localStorage.removeItem("jwtToken");
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      const updateData = {};
      if (formData.name !== currentUser.name) updateData.name = formData.name;
      if (formData.email !== currentUser.email)
        updateData.email = formData.email;
      if (Object.keys(updateData).length === 0) {
        showToast("error", "No changes to save");
        return;
      }
      const response = await api.put("/api/user", updateData);
      const updatedUser = response.data;
      setCurrentUser((prev) => ({
        ...prev,
        name: updatedUser.name || prev.name,
        email: updatedUser.email || prev.email,
      }));
      showToast("success", "Profile updated successfully");
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      showToast("error", "New passwords do not match");
      return;
    }
    if (formData.newPassword.length < 8) {
      showToast("error", "Password must be at least 8 characters");
      return;
    }
    try {
      setIsSavingPassword(true);
      await api.put("/api/user", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      showToast("success", "Password updated successfully");
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Failed to update password",
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    showToast(
      "warning",
      "Permanently delete your account? This cannot be undone.",
      {
        confirmLabel: "Delete Account",
        onConfirm: async () => {
          closeToast();
          try {
            await api.delete("/api/user");
            localStorage.removeItem("jwtToken");
            navigate("/");
          } catch {
            showToast("error", "Failed to delete account");
          }
        },
      },
    );
  };

  const togglePreference = async (key) => {
    try {
      const newValue = !currentUser.preferences[key];
      await api.put("/api/user", { preferences: { [key]: newValue } });
      setCurrentUser((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, [key]: newValue },
      }));
    } catch {
      showToast("error", "Failed to update preference");
    }
  };

  const EyeToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="text-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col">
        <Navbar
          userName={currentUser.name}
          userEmail={currentUser.email}
          userAvatar={currentUser.avatar}
        />
        <PageLoader label="Loading Profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col">
      <Navbar
        userName={currentUser.name}
        userEmail={currentUser.email}
        userAvatar={currentUser.avatar}
      />
      <Toast {...toast} onClose={closeToast} />

      {/* Outer padding: tight on mobile, original on desktop */}
      <div className="flex-1 w-full px-4 sm:px-8 lg:px-20 py-8 pt-20 sm:pt-24">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white mb-2 tracking-tight">
            Account Settings
          </h1>
          <p className="text-neutral-600 text-sm">
            Manage your profile and security settings
          </p>
        </div>

        {/* 
          Mobile: single column, left panel on top then right panel below
          Desktop: original side-by-side grid
        */}
        <div className="grid lg:grid-cols-[500px_1fr] gap-10 lg:gap-16">
          {/* Left Column — profile card */}
          <div>
            {/* Avatar + name — centered on mobile, stays centered on desktop */}
            <div className="text-center pb-6 sm:pb-8 border-b border-neutral-800/60">
              <div className="w-24 h-24 sm:w-30 sm:h-30 mx-auto mb-4">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(currentUser.name);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white text-2xl font-extralight rounded-full">
                    {(currentUser.name?.[0] || "?").toUpperCase()}
                  </div>
                )}
              </div>
              <h2 className="text-base font-light text-white mb-1">
                {currentUser.name}
              </h2>
              <p className="text-neutral-600 text-xs">{currentUser.email}</p>
            </div>

            {/* Meta info — 2-col grid on mobile for compactness, stacked on desktop */}
            <div className="py-6 sm:py-8 border-b border-neutral-800/60 grid grid-cols-2 gap-5 sm:grid-cols-1 sm:space-y-6 sm:gap-0">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar className="w-3 h-3 text-neutral-600" />
                  <span className="text-xs text-neutral-600 uppercase tracking-wider">
                    Joined
                  </span>
                </div>
                <p className="text-neutral-400 text-sm font-light">
                  {currentUser.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Hash className="w-3 h-3 text-neutral-600" />
                  <span className="text-xs text-neutral-600 uppercase tracking-wider">
                    User ID
                  </span>
                </div>
                <p className="text-neutral-500 text-xs font-mono break-all">
                  {currentUser.id || "N/A"}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Shield className="w-3 h-3 text-neutral-600" />
                  <span className="text-xs text-neutral-600 uppercase tracking-wider">
                    Security
                  </span>
                </div>
                <p className="text-neutral-500 text-xs font-light leading-relaxed">
                  {currentUser.providers.password
                    ? "Password authentication enabled"
                    : currentUser.providers.google
                      ? "Google authentication enabled"
                      : currentUser.providers.github
                        ? "GitHub authentication enabled"
                        : "Authentication enabled"}
                </p>
              </div>
            </div>

            {/* Connected accounts */}
            <div className="py-6 sm:py-8">
              <span className="text-sm text-neutral-600 uppercase tracking-wider">
                Connected Accounts
              </span>
              <div className="mt-4 space-y-3">
                {[
                  { icon: FaGoogle, label: "Google", key: "google" },
                  { icon: FaGithub, label: "GitHub", key: "github" },
                  {
                    icon: Lock,
                    label: "Password",
                    key: "password",
                    connectedLabel: "Enabled",
                    disconnectedLabel: "Not Set",
                  },
                ].map(
                  ({
                    icon: Icon,
                    label,
                    key,
                    connectedLabel = "Connected",
                    disconnectedLabel = "Not Connected",
                  }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 text-neutral-500">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-md font-light">{label}</span>
                      </div>
                      <span
                        className={`text-xs font-light ${currentUser.providers[key] ? "text-[#76B900]" : "text-neutral-700"}`}
                      >
                        {currentUser.providers[key]
                          ? connectedLabel
                          : disconnectedLabel}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Right Column — forms */}
          <div className="space-y-10 sm:space-y-12 lg:space-y-14">
            {/* Profile Information */}
            <div>
              <SectionDivider title="Profile Information" />
              <form
                onSubmit={handleUpdateProfile}
                className="space-y-6 max-w-xl"
              >
                <InputField
                  label="Full Name"
                  icon={User}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />
                <InputField
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isOAuthUser}
                  placeholder="Enter your email"
                />
                <div className="pt-2">
                  <SubmitButton
                    loading={isSavingProfile}
                    disabled={
                      formData.name === currentUser.name &&
                      formData.email === currentUser.email
                    }
                    loadingLabel="Saving..."
                    label="Save Changes"
                    icon={Save}
                  />
                </div>
              </form>
            </div>

            {/* Email Preferences */}
            <div className="border-t border-neutral-800/60 pt-10 sm:pt-12 lg:pt-14">
              <SectionDivider title="Email Preferences" />
              <div className="space-y-4 max-w-lg">
                {[
                  { key: "emailSecurityAlerts", label: "Security Alerts" },
                  { key: "emailProductUpdates", label: "Product Updates" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <span className="text-sm font-light text-neutral-400 group-hover:text-neutral-300 transition-colors">
                      {label}
                    </span>
                    <input
                      type="checkbox"
                      checked={currentUser.preferences?.[key] ?? true}
                      onChange={() => togglePreference(key)}
                      className="accent-[#76B900] cursor-pointer w-4 h-4"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Change Password */}
            {!isOAuthUser && (
              <div className="border-t border-neutral-800/60 pt-10 sm:pt-12 lg:pt-14">
                <SectionDivider title="Change Password" />
                <form
                  onSubmit={handleUpdatePassword}
                  className="space-y-6 max-w-lg"
                >
                  <InputField
                    label="Current Password"
                    icon={Lock}
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                    rightElement={
                      <EyeToggle
                        show={showCurrentPassword}
                        onToggle={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      />
                    }
                  />
                  <InputField
                    label="New Password"
                    icon={Lock}
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    rightElement={
                      <EyeToggle
                        show={showNewPassword}
                        onToggle={() => setShowNewPassword(!showNewPassword)}
                      />
                    }
                    hint={
                      formData.newPassword && formData.newPassword.length < 8
                        ? {
                            text: "Password must be at least 8 characters",
                            color: "text-yellow-500",
                          }
                        : null
                    }
                  />
                  <InputField
                    label="Confirm New Password"
                    icon={Lock}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    rightElement={
                      <EyeToggle
                        show={showConfirmPassword}
                        onToggle={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      />
                    }
                    hint={
                      formData.confirmPassword &&
                      formData.newPassword !== formData.confirmPassword
                        ? {
                            text: "Passwords do not match",
                            color: "text-[#e05c5c]",
                          }
                        : null
                    }
                  />
                  <div className="pt-2">
                    <SubmitButton
                      loading={isSavingPassword}
                      disabled={
                        !formData.currentPassword ||
                        !formData.newPassword ||
                        formData.newPassword.length < 8 ||
                        formData.newPassword !== formData.confirmPassword
                      }
                      loadingLabel="Updating..."
                      label="Update Password"
                      icon={Lock}
                    />
                  </div>
                </form>
              </div>
            )}

            {/* Danger Zone */}
            <div className="border-t border-neutral-800/60 pt-10 sm:pt-12 lg:pt-14">
              <SectionDivider title="Account Actions" danger />
              <p className="text-neutral-600 text-sm mb-6 max-w-lg leading-relaxed">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 bg-transparent border border-[#e05c5c]/25 hover:border-[#e05c5c]/50 hover:bg-[#e05c5c]/5 text-[#e05c5c] px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(110%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(110%);
            opacity: 0;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slide-out {
          animation: slide-out 0.28s cubic-bezier(0.4, 0, 1, 1);
        }
      `}</style>
    </div>
  );
}
