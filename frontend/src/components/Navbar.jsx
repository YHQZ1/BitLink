import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Settings } from "lucide-react";

const Navbar = ({ userName = "User" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("jwtToken");
    
    // Navigate to home page
    navigate("/");
  };

  const handleEditProfile = () => {
    // Add edit profile logic here
    console.log("Edit profile clicked");
    navigate("/profile");
  };

  return (
    <nav className="fixed w-full bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-gray-800 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <img src="/logo.png" alt="BitLink" className="w-10 h-10" />
            <span className="text-xl font-bold text-[#7ed957]">BitLink</span>
          </div>

          {/* Desktop Menu - Homepage Oriented */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/dashboard"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/analytics"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Analytics
            </a>
            <a
              href="/settings"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Settings
            </a>
            
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-3 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-[#7ed957] rounded-full flex items-center justify-center text-black font-semibold text-sm">
                  {userName.charAt(0)}
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg py-2 pb-0 z-50">
                  <div className="px-4 pb-2 pt-0 border-b border-gray-700">
                    <p className="text-sm text-white font-medium">{userName}</p>
                    <p className="text-xs text-gray-400">Welcome back!</p>
                  </div>
                  
                  <button
                    onClick={handleEditProfile}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Edit Profile</span>
                  </button>
                  
                  <button
                    onClick={() => navigate("/settings")}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  
                  <div className="border-t border-gray-700"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Homepage Oriented */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-gray-800">
          <div className="px-4 py-4 space-y-3">
            <a
              href="/dashboard"
              className="block text-gray-300 hover:text-white"
            >
              Dashboard
            </a>
            <a
              href="/analytics"
              className="block text-gray-300 hover:text-white"
            >
              Analytics
            </a>
            <a
              href="/settings"
              className="block text-gray-300 hover:text-white"
            >
              Settings
            </a>
            <div className="pt-2 border-t border-gray-800">
              <div className="flex items-center space-x-3 py-2">
                <div className="w-8 h-8 bg-[#7ed957] rounded-full flex items-center justify-center text-black font-semibold text-sm">
                  {userName.charAt(0)}
                </div>
                <span className="text-gray-300">{userName}</span>
              </div>
              <button
                onClick={handleEditProfile}
                className="w-full flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2 px-1 rounded-lg cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors py-2 px-1 rounded-lg cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;