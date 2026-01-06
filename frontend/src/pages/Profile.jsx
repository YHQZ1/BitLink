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
import PageLoader from "../components/PageLoader";

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
      <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col">
        <Navbar userName={currentUser.name} userEmail={currentUser.email} />
        <PageLoader label="Loading Profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col">
      <Navbar userName={currentUser.name} userEmail={currentUser.email} />
      <Toast {...toast} onClose={closeToast} />

      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-neutral-500 hover:text-white mb-8 lg:mb-12 transition-colors cursor-pointer text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Homepage</span>
        </button>

        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white mb-2 tracking-tight">
            Account Settings
          </h1>
          <p className="text-neutral-500 text-sm sm:text-base">
            Manage your profile and security settings
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-16">
          {/* Left Column - Account Info */}
          <div className="space-y-8 lg:space-y-12">
            {/* Profile Card */}
            <div className="text-center pb-8 lg:pb-12 border-b border-neutral-900/50">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-neutral-900 flex items-center justify-center text-white text-xl lg:text-3xl font-extralight mx-auto mb-4 lg:mb-6">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg lg:text-xl font-light text-white mb-2">
                {currentUser.name}
              </h2>
              <p className="text-neutral-600 text-xs lg:text-sm">
                {currentUser.email}
              </p>
            </div>

            {/* Account Details */}
            <div className="space-y-4 lg:space-y-6">
              <div className="pb-4 lg:pb-6 border-b border-neutral-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-neutral-600" />
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

              <div className="pb-4 lg:pb-6 border-b border-neutral-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="text-xs text-neutral-600 uppercase tracking-wider">
                    User ID
                  </span>
                </div>
                <p className="text-neutral-400 text-xs font-mono break-all font-light">
                  {currentUser.id || "N/A"}
                </p>
              </div>

              <div className="pb-4 lg:pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-3.5 h-3.5 text-[#76B900]" />
                  <span className="text-xs text-neutral-600 uppercase tracking-wider">
                    Security
                  </span>
                </div>
                <p className="text-neutral-600 text-xs font-light leading-relaxed">
                  Your account is protected with password authentication
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="space-y-12 lg:space-y-16 mt-8 lg:mt-0">
            {/* Profile Information Form */}
            <div>
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <h2 className="text-xl sm:text-2xl font-extralight text-white tracking-tight">
                  Profile Information
                </h2>
                <div className="h-px flex-1 bg-neutral-900"></div>
              </div>

              <form
                onSubmit={handleUpdateProfile}
                className="space-y-4 lg:space-y-6"
              >
                {/* Name Field */}
                <div>
                  <label className="text-neutral-500 text-xs uppercase tracking-widest mb-3 block font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-neutral-900 pl-8 pr-0 py-3 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors font-light text-sm lg:text-base"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="text-neutral-500 text-xs uppercase tracking-widest mb-3 block font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-neutral-900 pl-8 pr-0 py-3 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors font-light text-sm lg:text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={
                      isSaving ||
                      (formData.name === currentUser.name &&
                        formData.email === currentUser.email)
                    }
                    className="flex items-center justify-center gap-2 bg-[#76B900] text-black px-6 lg:px-8 py-3 font-medium hover:bg-[#8FD400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs lg:text-sm uppercase tracking-wider w-full lg:w-auto"
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
                </div>
              </form>
            </div>

            {/* Password Form */}
            <div className="pt-8 lg:pt-16 border-t border-neutral-900">
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <h2 className="text-xl sm:text-2xl font-extralight text-white tracking-tight">
                  Change Password
                </h2>
                <div className="h-px flex-1 bg-neutral-900"></div>
              </div>

              <form
                onSubmit={handleUpdatePassword}
                className="space-y-4 lg:space-y-6"
              >
                {/* Current Password */}
                <div>
                  <label className="text-neutral-500 text-xs uppercase tracking-widest mb-3 block font-medium">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-neutral-900 pl-8 pr-10 py-3 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors font-light text-sm lg:text-base"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 cursor-pointer"
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
                  <label className="text-neutral-500 text-xs uppercase tracking-widest mb-3 block font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-neutral-900 pl-8 pr-10 py-3 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors font-light text-sm lg:text-base"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formData.newPassword && formData.newPassword.length < 6 && (
                    <p className="text-yellow-500 text-xs mt-2 font-light">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-neutral-500 text-xs uppercase tracking-widest mb-3 block font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-neutral-900 pl-8 pr-10 py-3 text-white placeholder-neutral-600 focus:border-[#76B900] outline-none transition-colors font-light text-sm lg:text-base"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 cursor-pointer"
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
                      <p className="text-red-500 text-xs mt-2 font-light">
                        Passwords do not match
                      </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={
                      isSaving ||
                      !formData.currentPassword ||
                      !formData.newPassword ||
                      formData.newPassword.length < 6 ||
                      formData.newPassword !== formData.confirmPassword
                    }
                    className="flex items-center justify-center gap-2 bg-[#76B900] text-black px-6 lg:px-8 py-3 font-medium hover:bg-[#8FD400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs lg:text-sm uppercase tracking-wider w-full lg:w-auto"
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
                </div>
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
