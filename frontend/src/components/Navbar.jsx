/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";

const NavLink = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-gray-300 hover:text-white transition-colors"
  >
    {children}
  </button>
);

const UserDropdownItem = ({
  onClick,
  icon: Icon,
  children,
  isDanger = false,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
      isDanger
        ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
        : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{children}</span>
  </button>
);

export default function Navbar({ userName = "User" }) {
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

  const closeAllMenus = useCallback(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, []);

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
    <nav className="fixed w-full bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-gray-800 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center space-x-2"
          >
            <img src="/logo.png" alt="BitLink" className="w-10 h-10" />
            <span className="text-xl font-bold text-[#7ed957]">BitLink</span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink onClick={() => navigate("/dashboard")}>Dashboard</NavLink>
            <NavLink onClick={() => navigate("/analytics")}>Analytics</NavLink>

            <div className="relative" ref={userDropdownRef}>
              <button
                ref={userButtonRef}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center p-1 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-[#7ed957] rounded-full flex items-center justify-center text-black font-semibold text-sm">
                  {userName.charAt(0)}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 pb-2 border-b border-gray-700">
                    <p className="text-sm text-white font-medium">{userName}</p>
                    <p className="text-xs text-gray-400">Welcome back!</p>
                  </div>

                  <UserDropdownItem onClick={handleEditProfile} icon={User}>
                    Edit Profile
                  </UserDropdownItem>

                  <div className="border-t border-gray-700"></div>

                  <UserDropdownItem
                    onClick={handleLogout}
                    icon={LogOut}
                    isDanger
                  >
                    Logout
                  </UserDropdownItem>
                </div>
              )}
            </div>
          </div>

          <button
            ref={mobileMenuButtonRef}
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

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-[#0a0a0a] border-t border-gray-800"
        >
          <div className="px-4 py-4 space-y-3">
            <NavLink onClick={() => handleNavigation("/dashboard")}>
              Dashboard
            </NavLink>
            <NavLink onClick={() => handleNavigation("/analytics")}>
              Analytics
            </NavLink>

            <div className="pt-2 border-t border-gray-800">
              <div className="flex items-center space-x-3 py-2">
                <div className="w-8 h-8 bg-[#7ed957] rounded-full flex items-center justify-center text-black font-semibold text-sm">
                  {userName.charAt(0)}
                </div>
                <span className="text-gray-300">{userName}</span>
              </div>

              <div className="space-y-1">
                <UserDropdownItem onClick={handleEditProfile} icon={User}>
                  Edit Profile
                </UserDropdownItem>
                <UserDropdownItem onClick={handleLogout} icon={LogOut} isDanger>
                  Logout
                </UserDropdownItem>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
