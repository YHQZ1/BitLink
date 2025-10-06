import React, { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  Github,
  Chrome,
  Eye,
  EyeOff,
  Link2,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
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

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isSignUp
            ? formData
            : {
                email: formData.email,
                password: formData.password,
              }
        ),
      });

      const data = await response.json();

      if (response.ok) {
        if (isSignUp) {
          localStorage.setItem("jwtToken", data.token);
          setMessage("Account created successfully!");
          navigate("/home");
        } else {
          // Save token to localStorage
          localStorage.setItem("jwtToken", data.token);
          setMessage("Login successful! Redirecting...");
          navigate("/home");
        }
      } else {
        setMessage(data.error || "Something went wrong!");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    alert(`${provider} authentication coming soon!`);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#7ed957]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#7ed957]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <img
              src="/logo.png"
              alt="BitLink Logo"
              className="w-10 h-10 rounded-lg object-contain"
            />
            <span className="text-2xl font-bold text-[#7ed957]">BitLink</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-gray-400">
            {isSignUp
              ? "Start creating powerful short links today"
              : "Sign in to manage your links"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
          {/* Message Alert */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes("successful")
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {message}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth("Google")}
              className="w-full bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-600 text-white rounded-lg px-4 py-3 transition-all flex items-center justify-center space-x-3 group cursor-pointer"
            >
              <Chrome className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              <span className="font-medium">Continue with Google</span>
            </button>

            <button
              onClick={() => handleOAuth("GitHub")}
              className="w-full bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-600 text-white rounded-lg px-4 py-3 transition-all flex items-center justify-center space-x-3 group cursor-pointer"
            >
              <Github className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              <span className="font-medium">Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-400 text-sm">
              Or continue with email
            </span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-gray-950/50 border border-gray-700 focus:border-[#7ed957] rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950/50 border border-gray-700 focus:border-[#7ed957] rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950/50 border border-gray-700 focus:border-[#7ed957] rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-500 outline-none transition-all"
                  placeholder="Enter your password"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 cursor-pointer" />
                  ) : (
                    <Eye className="w-5 h-5 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-700 bg-gray-950/50 text-[#7ed957] focus:ring-[#7ed957] focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-[#7ed957] hover:text-[#8ee367] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7ed957] hover:bg-[#8ee367] disabled:bg-gray-600 text-black font-semibold rounded-lg px-4 py-3 transition-all flex items-center justify-center space-x-2 group cursor-pointer disabled:cursor-not-allowed"
            >
              <span>
                {loading
                  ? "Processing..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </span>
              {!loading && (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          {/* Toggle Sign In/Up */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage("");
              }}
              className="text-[#7ed957] hover:text-[#8ee367] font-medium transition-colors cursor-pointer"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>

          {/* Terms */}
          {isSignUp && (
            <p className="mt-6 text-xs text-center text-gray-500">
              By creating an account, you agree to our{" "}
              <a
                href="#"
                className="text-[#7ed957] hover:text-[#8ee367] transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-[#7ed957] hover:text-[#8ee367] transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>Secured with enterprise-grade encryption</span>
          </p>
        </div>
      </div>
    </div>
  );
}
