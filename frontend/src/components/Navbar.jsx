import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";

const NavLink = ({ onClick, children, isActive }) => (
  <button
    onClick={onClick}
    className={`text-sm transition-colors cursor-pointer font-light tracking-wide ${
      isActive ? "text-[#76B900]" : "text-neutral-500 hover:text-white"
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
    <nav className="fixed w-full bg-[#0B0D10]/95 backdrop-blur-sm border-b border-neutral-900/50 z-50">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="BitLink" className="w-7 h-7" />
            <span className="text-lg font-extralight tracking-tight text-white">
              BitLink
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink onClick={() => navigate("/home")}>Home</NavLink>
            <NavLink onClick={() => navigate("/analytics")}>Analytics</NavLink>

            {/* User Button */}
            <div className="relative" ref={userDropdownRef}>
              <button
                ref={userButtonRef}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <span className="text-sm font-light">{userName}</span>
                <div className="w-7 h-7 bg-neutral-900 flex items-center justify-center text-white font-light text-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-12 w-56 bg-[#0D0F13] border border-neutral-900 shadow-2xl">
                  <div className="p-4 border-b border-neutral-900">
                    <p className="text-sm text-white font-light mb-1">
                      {userName}
                    </p>
                    <p className="text-xs text-neutral-600 truncate">
                      {userEmail}
                    </p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-neutral-400 hover:text-[#76B900] transition-colors cursor-pointer font-light"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-neutral-400 hover:text-red-500 transition-colors cursor-pointer font-light"
                    >
                      <LogOut className="w-4 h-4" />
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
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-[#0B0D10]/95 backdrop-blur-sm border-t border-neutral-900/50"
        >
          <div className="px-5 py-6">
            {/* User Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-neutral-900/50">
              <div className="w-10 h-10 bg-neutral-900 flex items-center justify-center text-white font-light text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-light truncate">
                  {userName}
                </p>
                <p className="text-xs text-neutral-600 truncate">{userEmail}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="py-6 space-y-1">
              <button
                onClick={() => handleNavigation("/home")}
                className="block w-full text-left px-3 py-2.5 text-sm font-light text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation("/analytics")}
                className="block w-full text-left px-3 py-2.5 text-sm font-light text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Analytics
              </button>
            </div>

            {/* User Actions */}
            <div className="pt-6 border-t border-neutral-900/50 space-y-1">
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-light text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-light text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
