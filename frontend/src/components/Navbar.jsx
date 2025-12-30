import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";

const NavLink = ({ onClick, children, isActive }) => (
  <button
    onClick={onClick}
    className={`text-base transition-colors cursor-pointer font-medium ${
      isActive ? "text-[#76B900]" : "text-neutral-400 hover:text-white"
    }`}
  >
    {children}
  </button>
);

export default function Navbar({ userName = "User", userEmail = "" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  }, [navigate]);

  const handleEditProfile = useCallback(() => {
    navigate("/profile");
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      setMobileMenuOpen(false);
    },
    [navigate]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideUserDropdown =
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target);

      const isOutsideMobileMenu =
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target);

      if (userDropdownOpen && isOutsideUserDropdown) {
        setUserDropdownOpen(false);
      }

      if (mobileMenuOpen && isOutsideMobileMenu) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen, mobileMenuOpen]);

  return (
    <nav className="fixed w-full bg-[#0B0D10]/95 backdrop-blur-sm border-b border-neutral-800 z-50">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img src="/logo.png" alt="BitLink" className="w-8 h-8" />
            <span className="text-[20px] font-medium tracking-tight text-white">
              BitLink
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <NavLink onClick={() => navigate("/analytics")}>Analytics</NavLink>

            {/* User Button */}
            <div className="relative" ref={userDropdownRef}>
              <button
                ref={userButtonRef}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 border border-neutral-800 hover:border-[#76B900] transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-[#76B900] flex items-center justify-center text-black font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-base text-white font-medium">
                  {userName}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-14 w-64 bg-[#0D0F13] border border-neutral-800 shadow-2xl">
                  <div className="p-4 border-b border-neutral-800">
                    <p className="text-base text-white font-medium mb-1">
                      {userName}
                    </p>
                    <p className="text-sm text-neutral-500">{userEmail}</p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center gap-3 w-full px-4 py-3 text-base text-neutral-300 hover:bg-[#76B900]/10 hover:text-[#76B900] transition-colors cursor-pointer"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-base text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={mobileMenuButtonRef}
            className="md:hidden text-neutral-400 hover:text-white transition-colors cursor-pointer"
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
          className="md:hidden bg-[#0B0D10]/95 backdrop-blur-sm border-t border-neutral-800"
        >
          <div className="px-5 py-6">
            {/* User Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-neutral-800">
              <div className="w-12 h-12 bg-[#76B900] flex items-center justify-center text-black font-semibold text-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base text-white font-medium truncate">
                  {userName}
                </p>
                <p className="text-sm text-neutral-500 truncate">{userEmail}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="py-6 space-y-2">
              <button
                onClick={() => handleNavigation("/home")}
                className="block w-full text-left px-4 py-3 text-base font-medium text-neutral-400 hover:text-[#76B900] hover:bg-[#76B900]/10 transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation("/analytics")}
                className="block w-full text-left px-4 py-3 text-base font-medium text-neutral-400 hover:text-[#76B900] hover:bg-[#76B900]/10 transition-colors cursor-pointer"
              >
                Analytics
              </button>
            </div>

            {/* User Actions */}
            <div className="pt-6 border-t border-neutral-800 space-y-2">
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-neutral-400 hover:text-[#76B900] hover:bg-[#76B900]/10 transition-colors cursor-pointer"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
