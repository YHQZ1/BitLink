import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const userDropdownRef = useRef(null);
  const userButtonRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileButtonRef = useRef(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  }, [navigate]);

  const handleEditProfile = useCallback(() => {
    navigate("/profile");
    setUserDropdownOpen(false);
    setMobileDropdownOpen(false);
  }, [navigate]);

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      setMobileDropdownOpen(false);
    },
    [navigate]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check for desktop dropdown
      const isOutsideDesktopDropdown =
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target);

      // Check for mobile dropdown
      const isOutsideMobileDropdown =
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target);

      if (userDropdownOpen && isOutsideDesktopDropdown) {
        setUserDropdownOpen(false);
      }

      if (mobileDropdownOpen && isOutsideMobileDropdown) {
        setMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen, mobileDropdownOpen]);

  return (
    <nav className="fixed top-0 w-full bg-[#0B0D10]/95 backdrop-blur-sm border-b border-neutral-900/50 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="BitLink" className="w-6 h-6" />
            <span className="text-base font-extralight text-white">
              BitLink
            </span>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden relative" ref={mobileDropdownRef}>
            <button
              ref={mobileButtonRef}
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="w-7 h-7 bg-neutral-900 flex items-center justify-center text-white text-xs font-light cursor-pointer"
            >
              {userName.charAt(0).toUpperCase()}
            </button>

            {mobileDropdownOpen && (
              <div className="absolute right-0 top-10 w-56 bg-[#0D0F13] border border-neutral-900 shadow-2xl z-50">
                <div className="p-3 border-b border-neutral-900">
                  <p className="text-sm text-white mb-1">{userName}</p>
                  <p className="text-xs text-neutral-600 truncate">
                    {userEmail}
                  </p>
                </div>
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => handleNavigation("/home")}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-400 hover:text-white text-left cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigation("/analytics")}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-400 hover:text-white text-left cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    Analytics
                  </button>
                  <div className="border-t border-neutral-900 pt-1 mt-1">
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-400 hover:text-[#76B900] text-left cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-400 hover:text-red-500 text-left cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <NavLink onClick={() => navigate("/home")}>Home</NavLink>
            <NavLink onClick={() => navigate("/analytics")}>Analytics</NavLink>
            <div className="relative" ref={userDropdownRef}>
              <button
                ref={userButtonRef}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 lg:gap-3 text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <span className="text-sm font-light hidden lg:block">
                  {userName}
                </span>
                <div className="w-7 h-7 bg-neutral-900 flex items-center justify-center text-white font-light text-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 top-12 w-56 bg-[#0D0F13] border border-neutral-900 shadow-2xl z-50">
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
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-neutral-400 hover:text-[#76B900] transition-colors cursor-pointer font-light text-left hover:bg-white/5"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-neutral-400 hover:text-red-500 transition-colors cursor-pointer font-light text-left hover:bg-white/5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
