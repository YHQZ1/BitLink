import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Settings } from "lucide-react";

const Navbar = ({ userName = "User" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Refs for dropdown and mobile menu
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user dropdown if clicked outside
      if (
        userDropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }

      // Close mobile menu if clicked outside
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen, mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/profile");
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSettings = () => {
    navigate("/settings");
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Analytics
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Settings
            </button>
            
            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                ref={userButtonRef}
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
            ref={mobileMenuButtonRef}
            className="md:hidden text-gray-300 cursor-pointer"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden bg-[#0a0a0a] border-t border-gray-800"
        >
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="block text-gray-300 hover:text-white w-full text-left cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigation("/analytics")}
              className="block text-gray-300 hover:text-white w-full text-left cursor-pointer"
            >
              Analytics
            </button>
            <button
              onClick={() => handleNavigation("/settings")}
              className="block text-gray-300 hover:text-white w-full text-left cursor-pointer"
            >
              Settings
            </button>
            
            {/* User Section in Mobile Menu */}
            <div className="pt-2 border-t border-gray-800">
              <div className="flex items-center space-x-3 py-2">
                <div className="w-8 h-8 bg-[#7ed957] rounded-full flex items-center justify-center text-black font-semibold text-sm">
                  {userName.charAt(0)}
                </div>
                <span className="text-gray-300">{userName}</span>
              </div>
              
              {/* User Dropdown in Mobile - Same as Desktop */}
              <div className="space-y-1">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;