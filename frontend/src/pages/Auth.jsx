/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Github,
  Chrome,
  Eye,
  EyeOff,
  User,
  Shield,
  Zap,
  Link2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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
        className="w-full bg-transparent border border-neutral-800 focus:border-[#76B900] pl-12 pr-4 py-3 text-white placeholder-neutral-600 outline-none transition-all"
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
        setTimeout(() => navigate("/home"), 1000);
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
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() =>
              window.history.length > 1 ? navigate(-1) : navigate("/")
            }
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 mb-12 cursor-pointer group"
          >
            <img src="/logo.png" alt="BitLink" className="w-8 h-8" />
            <span className="text-xl font-medium tracking-tight group-hover:text-[#76B900] transition-colors">
              BitLink
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-light mb-3">
              {isSignUp ? "Create account" : "Welcome back"}
            </h1>
            <p className="text-neutral-400">
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
          <div className="space-y-3 mb-8">
            <OAuthButton
              provider="GitHub"
              icon={Github}
              label="Continue with GitHub"
              onClick={handleOAuth}
            />
            <OAuthButton
              provider="Google"
              icon={Chrome}
              label="Continue with Google"
              onClick={handleOAuth}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center mb-8">
            <div className="flex-1 border-t border-neutral-800"></div>
            <span className="mx-4 text-neutral-500 text-sm">or</span>
            <div className="flex-1 border-t border-neutral-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full bg-[#76B900] hover:bg-[#8FD400] disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-medium py-3 transition-all flex items-center justify-center gap-2 group disabled:cursor-not-allowed mt-8 cursor-pointer"
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
          <div className="mt-8 text-center text-sm">
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
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0D0F13] to-[#0B0D10] border-l border-neutral-800 items-center justify-center p-12">
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
                  10M+
                </div>
                <div className="text-xs text-neutral-500">Links Created</div>
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
