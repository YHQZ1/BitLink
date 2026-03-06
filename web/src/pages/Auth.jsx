/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Shield,
  Zap,
  Link2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const GitHubLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.11 3.29 9.44 7.86 10.97.57.1.78-.25.78-.55v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.16v3.2c0 .3.2.65.79.54A11.52 11.52 0 0 0 23.5 12C23.5 5.74 18.27.5 12 .5Z" />
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.7 1.23 9.19 3.63l6.84-6.84C35.79 2.54 30.23 0 24 0 14.64 0 6.55 5.38 2.67 13.22l7.97 6.19C12.48 13.47 17.77 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.1 24.5c0-1.64-.15-3.21-.43-4.73H24v9.02h12.43c-.54 2.9-2.18 5.36-4.64 7.04l7.18 5.57C43.44 37.09 46.1 31.36 46.1 24.5z"
    />
    <path
      fill="#FBBC05"
      d="M10.64 28.41A14.5 14.5 0 0 1 9.5 24c0-1.53.27-3 .77-4.41l-7.97-6.19A23.9 23.9 0 0 0 0 24c0 3.86.92 7.51 2.3 10.78l8.34-6.37z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.23 0 11.45-2.06 15.27-5.6l-7.18-5.57c-2 1.35-4.57 2.15-8.09 2.15-6.23 0-11.52-3.97-13.36-9.39l-8.34 6.37C6.55 42.62 14.64 48 24 48z"
    />
  </svg>
);

const OAuthButton = ({ provider, icon: Icon, label, onClick }) => (
  <button
    onClick={() => onClick(provider)}
    className="w-full bg-transparent border border-neutral-800 hover:border-[#76B900] text-neutral-300 hover:text-white px-4 py-3 transition-all flex items-center justify-center gap-3 group cursor-pointer"
  >
    <Icon className="w-5 h-5 text-neutral-400 group-hover:text-[#76B900] transition-colors" />
    <span className="font-medium">{label}</span>
  </button>
);

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  icon: Icon,
  showPasswordToggle,
  onTogglePassword,
}) => (
  <div>
    <label className="block text-sm font-medium text-neutral-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border border-neutral-800 focus:border-[#76B900] pl-12 pr-10 py-3 text-white placeholder-neutral-600 outline-none transition-all"
        placeholder={placeholder}
        required={required}
        minLength={type === "password" ? "6" : undefined}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
        >
          {type === "password" ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  </div>
);

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
      const payload = isSignUp
        ? formData
        : { email: formData.email, password: formData.password };

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("jwtToken", data.token);
        setMessage(
          isSignUp ? "Account created successfully!" : "Login successful!"
        );
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(data.error || "Something went wrong!");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    const urls = {
      GitHub: `${BASE_URL}/api/auth/github`,
      Google: `${BASE_URL}/api/auth/google`,
    };
    if (urls[provider]) {
      window.location.href = urls[provider];
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex">
      {/* Mobile Header */}
      <nav className="lg:hidden fixed top-0 w-full border-b border-neutral-900/50 bg-[#0B0D10]/95 backdrop-blur-sm z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="BitLink" className="w-8 h-8" />
              <span className="text-lg font-extralight text-white">
                BitLink
              </span>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => navigate("/")}
                className="text-sm text-neutral-400 hover:text-white whitespace-nowrap px-2 py-2"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-12 lg:py-0 mt-16 lg:mt-0">
        <div className="w-full max-w-md">
          <button
            onClick={() =>
              window.history.length > 1 ? navigate(-1) : navigate("/")
            }
            className="hidden lg:flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-3xl lg:text-4xl font-light mb-3">
              {isSignUp ? "Create account" : "Welcome back"}
            </h1>
            <p className="text-neutral-400 text-sm lg:text-base">
              {isSignUp
                ? "Start shortening and tracking your links"
                : "Sign in to access your dashboard"}
            </p>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`mb-6 p-4 border text-sm ${
                message.includes("successful")
                  ? "bg-[#76B900]/10 text-[#76B900] border-[#76B900]/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              }`}
            >
              {message}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6 lg:mb-8">
            <OAuthButton
              provider="GitHub"
              icon={GitHubLogo}
              label="GitHub"
              onClick={handleOAuth}
            />
            <OAuthButton
              provider="Google"
              icon={GoogleLogo}
              label="Google"
              onClick={handleOAuth}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6 lg:mb-8">
            <div className="flex-1 border-t border-neutral-800"></div>
            <span className="mx-4 text-neutral-500 text-sm">or</span>
            <div className="flex-1 border-t border-neutral-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            {isSignUp && (
              <InputField
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
                icon={User}
              />
            )}

            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
              icon={Mail}
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              icon={Lock}
              showPasswordToggle
              onTogglePassword={togglePasswordVisibility}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#76B900] hover:bg-[#8FD400] disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-medium py-3 transition-all flex items-center justify-center gap-2 group disabled:cursor-not-allowed mt-6 lg:mt-8 cursor-pointer"
            >
              <span>
                {loading
                  ? "Processing..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 lg:mt-8 text-center text-sm">
            <span className="text-neutral-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>{" "}
            <button
              onClick={toggleAuthMode}
              className="text-[#76B900] hover:text-[#8FD400] font-medium transition-colors cursor-pointer"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>

          {/* Terms */}
          {isSignUp && (
            <p className="mt-6 text-xs text-center text-neutral-500">
              By creating an account, you agree to our{" "}
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors underline"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors underline"
              >
                Privacy Policy
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Right Side - Feature Showcase */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0D0F13] to-[#0B0D10] border-l border-neutral-800 items-center justify-center p-8 lg:p-12">
        <div className="max-w-lg">
          {/* Animated Feature Cards */}
          <div className="mb-12">
            <h2 className="text-4xl font-light leading-tight mb-4">
              Your links,
              <br />
              <span className="text-[#76B900]">supercharged.</span>
            </h2>
            <p className="text-neutral-400 text-lg">
              Track every click, optimize every campaign, and manage all your
              links from one powerful dashboard.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="p-3 border border-neutral-800 bg-[#0B0D10] group-hover:border-[#76B900]/50 transition-colors">
                <Zap className="w-6 h-6 text-[#76B900]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Lightning Fast</h3>
                <p className="text-sm text-neutral-400">
                  Create and share links in milliseconds with our optimized
                  infrastructure.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 border border-neutral-800 bg-[#0B0D10] group-hover:border-[#76B900]/50 transition-colors">
                <Shield className="w-6 h-6 text-[#76B900]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Enterprise Security</h3>
                <p className="text-sm text-neutral-400">
                  Bank-grade encryption and security protocols to keep your data
                  safe.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 border border-neutral-800 bg-[#0B0D10] group-hover:border-[#76B900]/50 transition-colors">
                <Link2 className="w-6 h-6 text-[#76B900]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Branded Links</h3>
                <p className="text-sm text-neutral-400">
                  Custom domains and memorable short codes for maximum brand
                  impact.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-neutral-800">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-2xl font-light text-[#76B900] mb-1">
                  50B+
                </div>
                <div className="text-xs text-neutral-500">Address Space</div>
              </div>
              <div>
                <div className="text-2xl font-light text-[#76B900] mb-1">
                  99.9%
                </div>
                <div className="text-xs text-neutral-500">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-light text-[#76B900] mb-1">
                  &lt;100ms
                </div>
                <div className="text-xs text-neutral-500">Response</div>
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="mt-12 relative h-32 overflow-hidden border border-neutral-800 bg-[#0B0D10]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[#76B900]/10 text-8xl font-mono">
                {"</>"}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
