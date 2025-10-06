import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Save, Camera } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    username: "",
    profileImage: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");
      
      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data;
      setCurrentUser({
        name: userData.name || "",
        email: userData.email || "",
        username: userData.username || "",
        profileImage: userData.profileImage || null,
      });

      setFormData({
        name: userData.name || "",
        username: userData.username || "",
        email: userData.email || "",
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to load profile data");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size must be less than 5MB");
        return;
      }
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentUser(prev => ({ ...prev, profileImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");
      const formDataToSend = new FormData();

      // Append text fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== currentUser[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append image if changed
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      const response = await axios.put(`${BASE_URL}/api/user/profile`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Profile updated successfully!");
      setCurrentUser(prev => ({
        ...prev,
        ...formData,
        profileImage: response.data.user.profileImage || prev.profileImage
      }));
      setProfileImage(null);

      // Update Navbar by triggering a storage event
      window.dispatchEvent(new Event('storage'));

    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar userName={currentUser.name} profileImage={currentUser.profileImage} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
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
      <Navbar userName={currentUser.name} profileImage={currentUser.profileImage} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
          <p className="text-gray-400">Update your personal information</p>
        </div>

        {/* Profile Image Section */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-[#7ed957]" />
            Profile Picture
          </h2>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-[#7ed957] rounded-full flex items-center justify-center text-black font-semibold text-2xl">
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  currentUser.name?.charAt(0) || "U"
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#7ed957] text-black p-2 rounded-full cursor-pointer hover:bg-[#8ee367] transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="flex-1">
              <p className="text-gray-400 text-sm">
                Upload a new profile picture. JPG, PNG recommended. Max 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-6">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none transition-colors"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#7ed957] focus:outline-none transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#7ed957] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#8ee367] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}