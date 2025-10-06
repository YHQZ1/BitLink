// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Sparkles } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";


export default function Settings() {
  const [currentUser, setCurrentUser] = useState({
    name: "",
    profileImage: null,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("jwtToken");
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar
        userName={currentUser.name}
        profileImage={currentUser.profileImage}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 pt-24 sm:pt-28">
        <div className="text-center">
          {/* Icon Container */}
          <div className="relative inline-block mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-[#7ed957] blur-3xl opacity-20 rounded-full"></div>
            <div className="relative bg-gray-900/50 border border-gray-800 rounded-full p-6 sm:p-8 inline-block">
              <SettingsIcon className="w-12 h-12 sm:w-16 sm:h-16 text-[#7ed957] animate-spin-slow" style={{ animationDuration: '8s' }} />
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#7ed957]/10 border border-[#7ed957]/30 rounded-full px-4 py-2 mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4 text-[#7ed957]" />
            <span className="text-[#7ed957] text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Coming Soon
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Settings
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
            We're crafting an amazing settings experience for you. Soon you'll be able to customize your account, manage preferences, and more!
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 text-left">
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-gray-700 transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#7ed957]/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">👤</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Profile Settings</h3>
              <p className="text-xs sm:text-sm text-gray-400">Update your personal information and avatar</p>
            </div>

            <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-gray-700 transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#7ed957]/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🔐</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Security</h3>
              <p className="text-xs sm:text-sm text-gray-400">Manage passwords and security options</p>
            </div>

            <div className="bg-gray-900/30 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-gray-700 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#7ed957]/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🔔</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Notifications</h3>
              <p className="text-xs sm:text-sm text-gray-400">Control your notification preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}