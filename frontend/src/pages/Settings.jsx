import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings as SettingsIcon, Bell, Shield, Moon, Trash2, LogOut } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function Settings() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    name: "",
    profileImage: null,
  });
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      clickAlerts: true,
      weeklyReports: false,
    },
    privacy: {
      showProfile: true,
      trackAnalytics: true,
      searchIndexing: true,
    },
    appearance: {
      theme: "dark",
      compactView: false,
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUserData();
    loadSettings();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");
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

  const loadSettings = () => {
    // Load settings from localStorage or use defaults
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setIsLoading(false);
  };

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSuccess("Settings saved successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      saveSettings();
      setIsSaving(false);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.")) {
      // Implement account deletion logic
      console.log("Account deletion requested");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        <Navbar userName={currentUser.name} profileImage={currentUser.profileImage} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ed957] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar userName={currentUser.name} profileImage={currentUser.profileImage} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
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
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and settings</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-6">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 sticky top-24">
              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-[#7ed957]/10 border border-[#7ed957]/20 rounded-lg text-[#7ed957] font-medium">
                  <SettingsIcon className="w-4 h-4 inline mr-3" />
                  General
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                  <Bell className="w-4 h-4 inline mr-3" />
                  Notifications
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                  <Shield className="w-4 h-4 inline mr-3" />
                  Privacy
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                  <Moon className="w-4 h-4 inline mr-3" />
                  Appearance
                </button>
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notification Settings */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-[#7ed957]" />
                Notification Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 font-medium">Email Notifications</p>
                    <p className="text-gray-400 text-sm">Receive updates about your links via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7ed957]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 font-medium">Click Alerts</p>
                    <p className="text-gray-400 text-sm">Get notified when your links get clicks</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.clickAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'clickAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7ed957]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 font-medium">Weekly Reports</p>
                    <p className="text-gray-400 text-sm">Receive weekly analytics reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReports}
                      onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7ed957]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#7ed957]" />
                Privacy Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 font-medium">Show Profile</p>
                    <p className="text-gray-400 text-sm">Allow others to see your profile</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showProfile}
                      onChange={(e) => handleSettingChange('privacy', 'showProfile', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7ed957]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 font-medium">Track Analytics</p>
                    <p className="text-gray-400 text-sm">Collect analytics data for your links</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.trackAnalytics}
                      onChange={(e) => handleSettingChange('privacy', 'trackAnalytics', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7ed957]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-gray-900/30 border border-red-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Trash2 className="w-5 h-5 mr-2 text-red-400" />
                Danger Zone
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 font-medium">Delete Account</p>
                    <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Delete Account
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 font-medium">Logout</p>
                    <p className="text-gray-400 text-sm">Sign out from your account</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Save Settings Button */}
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full bg-[#7ed957] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#8ee367] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}