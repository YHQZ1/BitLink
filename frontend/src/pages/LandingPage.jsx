import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2,
  Zap,
  BarChart3,
  QrCode,
  Shield,
  ArrowRight,
  Check,
  Menu,
  X,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = () => {
    if (url) {
      alert("Shortening feature coming soon!");
    }
  };

  const redirectToAuth = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Navigation */}
      <nav className="fixed w-full bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="BitLink" className="w-8 h-8" />
              <span className="text-xl font-bold text-[#7ed957]">BitLink</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                // href="#pricing"
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Pricing
              </a>
              <a
                // href="#docs"
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Docs
              </a>
              <button
                className="bg-[#7ed957] text-black px-4 py-2 rounded-lg hover:bg-[#8ee367] transition-all font-semibold cursor-pointer"
                onClick={redirectToAuth}
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-t border-gray-800">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#docs"
                className="block text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </a>
              <button
                className="block w-full bg-[#7ed957] text-black px-4 py-2 rounded-lg font-semibold text-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  redirectToAuth();
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-[#7ed957]" />
              <span className="text-sm text-gray-300">
                Shorten smarter. Share faster.
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Transform Your Links</span>
              <br />
              <span className="text-[#7ed957]">Into Powerful Assets</span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Create short, memorable links with built-in analytics and QR
              codes. Perfect for marketers, developers, and businesses of all
              sizes.
            </p>

            {/* URL Shortener Input */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3 bg-gray-900/50 border border-gray-700 rounded-xl p-3 backdrop-blur-sm">
                <input
                  type="url"
                  placeholder="Enter your long URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none px-4 py-3"
                />
                <button
                  onClick={handleShorten}
                  className="bg-[#7ed957] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#8ee367] transition-all flex items-center justify-center space-x-2"
                >
                  <span>Shorten</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              No credit card required • Free forever
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
            {[
              {
                icon: <Zap className="w-5 h-5" />,
                text: "Lightning fast redirects",
              },
              {
                icon: <Shield className="w-5 h-5" />,
                text: "Secure and reliable",
              },
              { icon: <Globe className="w-5 h-5" />, text: "Works everywhere" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-center space-x-3 bg-gray-900/30 border border-gray-800 rounded-lg px-6 py-4"
              >
                <div className="text-[#7ed957]">{item.icon}</div>
                <span className="text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="pt-0 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-gray-900/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Everything you need to scale
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful features built for modern link management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Link2 className="w-6 h-6" />,
                title: "Custom Short Links",
                description:
                  "Create branded, memorable links with custom aliases that represent your brand.",
              },
              {
                icon: <QrCode className="w-6 h-6" />,
                title: "QR Code Generation",
                description:
                  "Instantly generate QR codes for any link. Perfect for print, events, and mobile.",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Real-time Analytics",
                description:
                  "Track clicks, referrers, devices, and locations with detailed analytics dashboards.",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Lightning Fast",
                description:
                  "Redirects happen in milliseconds with our globally distributed infrastructure.",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure & Reliable",
                description:
                  "Enterprise-grade security with automatic backups and data protection.",
              },
              {
                icon: <Check className="w-6 h-6" />,
                title: "Link Management",
                description:
                  "Edit, delete, and organize all your links from one powerful dashboard.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-[#7ed957]/30 transition-all hover:transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-[#7ed957]/10 rounded-lg flex items-center justify-center text-[#7ed957] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="BitLink" className="w-8 h-8" />
                <span className="text-xl font-bold text-white">BitLink</span>
              </div>
              <p className="text-gray-500 text-sm">
                The modern URL shortener built for speed and scale.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "API", "Documentation"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Status"],
              },
            ].map((column, i) => (
              <div key={i}>
                <h3 className="font-semibold mb-4 text-white">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 BitLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
