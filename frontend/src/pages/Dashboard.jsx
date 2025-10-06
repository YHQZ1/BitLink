// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  BarChart3,
  FileText,
} from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function Dashboard() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 pt-32">
        <div className="text-center">
          {/* Icon Container */}
          <div className="relative inline-block mb-8 sm:mb-12">
            <div className="absolute inset-0 bg-[#7ed957] blur-3xl opacity-20 rounded-full"></div>
            <div className="relative bg-gray-900/50 border border-gray-800 rounded-full p-8 sm:p-10 inline-block">
              <LayoutDashboard className="w-16 h-16 sm:w-20 sm:h-20 text-[#7ed957]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Data Analytics
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed px-4">
            Advanced analytics and insights platform is under development. Get
            ready for comprehensive data visualization and performance metrics.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 text-left">
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-gray-700 transition-all duration-300 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#7ed957]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#7ed957]/20 transition-colors">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-[#7ed957]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Real-time Analytics
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Live tracking and monitoring of all your links with real-time
                click data and performance metrics
              </p>
            </div>

            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-gray-700 transition-all duration-300 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#7ed957]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#7ed957]/20 transition-colors">
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-[#7ed957]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Advanced Insights
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Deep dive into performance analytics with detailed reports and
                actionable insights
              </p>
            </div>

            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-gray-700 transition-all duration-300 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#7ed957]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#7ed957]/20 transition-colors">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-[#7ed957]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Custom Reports
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Generate comprehensive reports with customizable metrics and
                export capabilities
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 sm:mt-16 bg-gray-900/20 border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
              What to Expect
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Our analytics dashboard will provide comprehensive insights into
              your link performance, including geographic data, device
              analytics, traffic sources, and detailed click patterns. Stay
              tuned for powerful data visualization tools and advanced reporting
              features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
