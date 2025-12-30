/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
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
} from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/Navbar";

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

export default function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    createdAt: "",
    id: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
  };

  const closeToast = () => setToast((prev) => ({ ...prev, isVisible: false }));

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/user/profile");
      const userData = response.data;

      setCurrentUser({
        name: userData.name || "",
        email: userData.email || "",
        createdAt: userData.createdAt || "",
        id: userData.id || "",
      });

      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
      }));
    } catch {
      localStorage.removeItem("jwtToken");
      navigate("/auth");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      const updateData = {};
      if (formData.name !== currentUser.name) {
        updateData.name = formData.name;
      }
      if (formData.email !== currentUser.email) {
        updateData.email = formData.email;
      }

      if (Object.keys(updateData).length === 0) {
        showToast("error", "No changes to save");
        setIsSaving(false);
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
        err.response?.data?.error || "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("error", "New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters");
      return;
    }

    try {
      setIsSaving(true);

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
        err.response?.data?.error || "Failed to update password"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-8 pt-24">
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-neutral-800 border-t-[#76B900] rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-neutral-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
      <Navbar userName={currentUser.name} userEmail={currentUser.email} />
      <Toast {...toast} onClose={closeToast} />

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
            Account Settings
          </h1>
          <p className="text-neutral-400 text-lg">
            Manage your profile and security settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Account Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="border border-neutral-800 p-8 bg-[#0D0F13] text-center">
              <div className="w-24 h-24 bg-[#76B900] flex items-center justify-center text-black text-3xl font-semibold mx-auto mb-4">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-medium text-white mb-1">
                {currentUser.name}
              </h2>
              <p className="text-neutral-400 text-sm mb-6">
                {currentUser.email}
              </p>
              <div className="border-t border-neutral-800 pt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined
                  </span>
                  <span className="text-neutral-300">
                    {currentUser.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-start justify-between text-sm">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    ID
                  </span>
                  <span className="text-neutral-300 text-xs font-mono text-right break-all">
                    {currentUser.id || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="border border-neutral-800 p-6 bg-[#0D0F13]">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-[#76B900]" />
                <h3 className="text-base font-medium text-white">Security</h3>
              </div>
              <p className="text-neutral-400 text-sm">
                Your account is protected with password authentication. Update
                your password regularly to maintain security.
              </p>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Form */}
            <div className="border border-neutral-800 p-8 bg-[#0D0F13]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
                <h2 className="text-xl font-light text-white">
                  Profile Information
                </h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="text-neutral-300 text-sm font-medium mb-2 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border border-neutral-700 pl-12 pr-4 py-3 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="text-neutral-300 text-sm font-medium mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border border-neutral-700 pl-12 pr-4 py-3 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    (formData.name === currentUser.name &&
                      formData.email === currentUser.email)
                  }
                  className="flex items-center justify-center gap-2 bg-[#76B900] text-black px-6 py-3 font-medium hover:bg-[#8FD400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Password Form */}
            <div className="border border-neutral-800 p-8 bg-[#0D0F13]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
                <h2 className="text-xl font-light text-white">
                  Change Password
                </h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="text-neutral-300 text-sm font-medium mb-2 block">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border border-neutral-700 pl-12 pr-12 py-3 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="text-neutral-300 text-sm font-medium mb-2 block">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border border-neutral-700 pl-12 pr-12 py-3 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formData.newPassword && formData.newPassword.length < 6 && (
                    <p className="text-yellow-500 text-xs mt-2">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-neutral-300 text-sm font-medium mb-2 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border border-neutral-700 pl-12 pr-12 py-3 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword &&
                    formData.newPassword !== formData.confirmPassword && (
                      <p className="text-red-500 text-xs mt-2">
                        Passwords do not match
                      </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    !formData.currentPassword ||
                    !formData.newPassword ||
                    formData.newPassword.length < 6 ||
                    formData.newPassword !== formData.confirmPassword
                  }
                  className="flex items-center justify-center gap-2 bg-[#76B900] text-black px-6 py-3 font-medium hover:bg-[#8FD400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
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
