import React, { useState, useEffect } from "react";
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
  Edit,
  X,
} from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/Navbar";

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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
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

      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setIsLoading(false);
    } catch {
      localStorage.removeItem("jwtToken");
      navigate("/auth");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startEditing = (section) => {
    setEditingSection(section);
    setError(null);
    setSuccess(null);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setFormData((prev) => ({
      ...prev,
      name: currentUser.name,
      email: currentUser.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      if (
        editingSection === "password" &&
        formData.newPassword !== formData.confirmPassword
      ) {
        setError("New passwords do not match");
        setIsSaving(false);
        return;
      }

      const updateData = {};

      if (editingSection === "name") {
        if (formData.name !== currentUser.name) {
          updateData.name = formData.name;
        }
      } else if (editingSection === "email") {
        if (formData.email !== currentUser.email) {
          updateData.email = formData.email;
        }
      } else if (editingSection === "password") {
        if (formData.newPassword) {
          updateData.currentPassword = formData.currentPassword;
          updateData.newPassword = formData.newPassword;
        }
      }

      if (Object.keys(updateData).length === 0) {
        setError("No changes made");
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

      setSuccess("Profile updated successfully!");

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setEditingSection(null);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar userName={currentUser.name} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 sm:pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ed957] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar userName={currentUser.name} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 cursor-pointer text-gray-400 hover:text-white transition-colors touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </button>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
            Edit Profile
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Update your account information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
              <p className="text-red-400 text-sm sm:text-base">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
              <p className="text-green-400 text-sm sm:text-base">{success}</p>
            </div>
          )}

          <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-[#7ed957]" />
                Name
              </h2>
              {editingSection !== "name" ? (
                <button
                  type="button"
                  onClick={() => startEditing("name")}
                  className="flex items-center space-x-2 bg-[#7ed957] text-black px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-[#8ee367] transition-colors text-sm cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="flex items-center space-x-2 bg-gray-700 text-gray-300 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {editingSection === "name" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm sm:text-base font-medium mb-2 block">
                    New Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 sm:pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSaving || formData.name === currentUser.name}
                  className="w-full bg-[#7ed957] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#8ee367] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-black"></div>
                      <span>Updating Name...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Update Name</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div>
                  <p className="text-gray-300 font-medium text-sm sm:text-base">
                    {currentUser.name}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Your display name
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Mail className="w-5 h-5 mr-2 text-[#7ed957]" />
                Email Address
              </h2>
              {editingSection !== "email" ? (
                <button
                  type="button"
                  onClick={() => startEditing("email")}
                  className="flex items-center space-x-2 bg-[#7ed957] text-black px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-[#8ee367] transition-colors text-sm cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="flex items-center space-x-2 bg-gray-700 text-gray-300 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {editingSection === "email" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm sm:text-base font-medium mb-2 block">
                    New Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 sm:pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="Enter new email address"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSaving || formData.email === currentUser.email}
                  className="w-full bg-[#7ed957] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#8ee367] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-black"></div>
                      <span>Updating Email...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Update Email</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div>
                  <p className="text-gray-300 font-medium text-sm sm:text-base">
                    {currentUser.email}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Your current email address
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Lock className="w-5 h-5 mr-2 text-[#7ed957]" />
                Password
              </h2>
              {editingSection !== "password" ? (
                <button
                  type="button"
                  onClick={() => startEditing("password")}
                  className="flex items-center space-x-2 bg-[#7ed957] text-black px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-[#8ee367] transition-colors text-sm cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Change</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="flex items-center space-x-2 bg-gray-700 text-gray-300 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {editingSection === "password" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm sm:text-base font-medium mb-2 block">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 sm:pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm sm:text-base font-medium mb-2 block">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 sm:pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formData.newPassword && formData.newPassword.length < 6 && (
                    <p className="text-yellow-500 text-xs mt-1">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-gray-300 text-sm sm:text-base font-medium mb-2 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 sm:pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 cursor-pointer"
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
                      <p className="text-red-500 text-xs mt-1">
                        Passwords do not match
                      </p>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    !formData.newPassword ||
                    formData.newPassword.length < 6 ||
                    formData.newPassword !== formData.confirmPassword
                  }
                  className="w-full bg-[#7ed957] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#8ee367] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-black"></div>
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div>
                  <p className="text-gray-300 font-medium text-sm sm:text-base">
                    ••••••••
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Your password
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[#7ed957]" />
              Account Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Member since</p>
                <p className="text-gray-300 font-medium">
                  {currentUser.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">User ID</p>
                <p className="text-gray-300 font-medium text-xs sm:text-sm font-mono truncate">
                  {currentUser.id || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
