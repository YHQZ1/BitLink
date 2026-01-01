import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2,
  BarChart3,
  QrCode,
  Shield,
  Menu,
  X,
  Copy,
  ExternalLink,
  Calendar,
  MousePointerClick,
  Zap,
  Users,
  Lock,
  Globe,
  Code,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const ShortenedUrlDisplay = ({ url, onCopy }) => (
  <div className="border border-neutral-800 p-4 mt-6">
    <div className="flex items-center justify-between gap-4">
      <a
        href={url.shortUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#76B900] text-sm break-all flex items-center gap-1"
      >
        {url.shortUrl}
        <ExternalLink className="w-3 h-3" />
      </a>
      <button
        onClick={() => onCopy(url.shortUrl)}
        className="text-neutral-400 hover:text-[#76B900] cursor-pointer"
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
    <p className="text-xs text-neutral-500 mt-2 break-all">{url.originalUrl}</p>
    <div className="flex gap-6 text-xs text-neutral-500 mt-3">
      <span className="flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {new Date(url.createdAt).toLocaleDateString()}
      </span>
      <span className="flex items-center gap-1">
        <MousePointerClick className="w-3 h-3" />
        {url.clicks || 0} clicks
      </span>
    </div>
  </div>
);

const features = [
  {
    icon: <Link2 className="w-5 h-5" />,
    title: "Custom Links",
    desc: "Short, readable, branded URLs.",
  },
  {
    icon: <QrCode className="w-5 h-5" />,
    title: "QR Codes",
    desc: "Instant QR generation for every link.",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Analytics",
    desc: "Clicks, devices, referrers, geography.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Secure",
    desc: "Rate-limited, validated, protected.",
  },
];

const stats = [
  { value: "50B+", label: "ID Space" },
  { value: "99.9%", label: "Uptime" },
  { value: "<100ms", label: "Response Time" },
  { value: "Daily", label: "Active Redirects" },
];

const useCases = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Marketing Teams",
    description:
      "Track campaign performance with detailed analytics and UTM parameter support.",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Developers",
    description:
      "RESTful API with comprehensive documentation and webhook support for automation.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Content Creators",
    description:
      "Branded short links with custom domains and beautiful QR codes for your audience.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "5 links per day",
      "Basic analytics",
      "QR code generation",
      "7-day data retention",
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    features: [
      "Unlimited links",
      "Advanced analytics",
      "Custom domains",
      "Unlimited data retention",
      "API access",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "SSO/SAML",
      "Volume discounts",
    ],
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [guestSessionId, setGuestSessionId] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let id = localStorage.getItem("guestSessionId");
    if (!id) {
      id = `guest_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem("guestSessionId", id);
    }
    setGuestSessionId(id);
  }, []);

  const handleShorten = async () => {
    if (!url) return;

    try {
      new URL(url);
    } catch {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/links/guest/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: url,
          sessionId: guestSessionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.requiresAuth) {
          setAuthRequired(true);
        }
        return;
      }

      const link = data.data || data;

      setShortenedUrl({
        shortUrl: link.shortUrl,
        originalUrl: link.originalUrl || url,
        createdAt: link.createdAt || new Date().toISOString(),
        clicks: link.clicks ?? 0,
      });

      setUrl("");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
      <nav className="fixed top-0 w-full border-b border-neutral-800 bg-[#0B0D10]/95 backdrop-blur-sm z-50">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="BitLink" className="w-10 h-10" />
            <span className="text-[20px] font-medium tracking-tight">Bit</span>
          </div>
          <div className="hidden md:flex gap-12 text-[20px] font-medium tracking-tight">
            <button
              onClick={() => scrollToSection("features")}
              className="cursor-pointer text-neutral-400 hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("docs")}
              className="cursor-pointer text-neutral-400 hover:text-white transition-colors"
            >
              Docs
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="cursor-pointer text-[#76B900] hover:text-[#8FD400] transition-colors"
            >
              Sign In
            </button>
          </div>
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 border-b border-neutral-800 bg-[#0B0D10]/95 backdrop-blur-sm z-40">
          <div className="px-5 py-4 flex flex-col gap-4 text-sm">
            <button
              onClick={() => scrollToSection("features")}
              className="text-neutral-400 hover:text-white text-left"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("docs")}
              className="text-neutral-400 hover:text-white text-left"
            >
              Docs
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="text-[#76B900] text-left"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 px-5 md:px-8 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-5xl md:text-6xl font-light leading-tight">
              Short links.
              <br />
              Real analytics.
              <br />
              <span className="text-[#76B900]">Zero noise.</span>
            </h1>

            <p className="text-neutral-400 mt-6 max-w-xl text-lg">
              A fast, minimal URL shortener built for developers and teams who
              care about clarity and control.
            </p>

            <div className="mt-10 max-w-xl">
              <div className="flex gap-3">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleShorten()}
                  placeholder="https://example.com"
                  className="flex-1 bg-transparent border border-neutral-700 px-4 py-3 text-sm focus:border-[#76B900] outline-none"
                />
                <button
                  onClick={handleShorten}
                  disabled={isLoading}
                  className="px-6 py-3 border border-[#76B900] text-[#76B900] hover:bg-[#76B900] hover:text-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "..." : "Shorten"}
                </button>
              </div>

              {shortenedUrl && (
                <ShortenedUrlDisplay
                  url={shortenedUrl}
                  onCopy={copyToClipboard}
                  className="cursor-pointer"
                />
              )}

              {authRequired && (
                <div className="mt-4 border border-neutral-800 px-4 py-3 text-sm flex items-center justify-between">
                  <span className="text-neutral-400">
                    Free limit reached. Sign in to continue.
                  </span>
                  <button
                    onClick={() => navigate("/auth")}
                    className="cursor-pointer text-[#76B900] hover:text-[#8FD400] transition-colors whitespace-nowrap"
                  >
                    Login →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="hidden lg:block h-full">
            <div className="border border-neutral-800 p-6 bg-gradient-to-br from-[#0D0F13] to-[#0B0D10] h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
                  <span className="text-xs text-neutral-400">
                    Live Analytics
                  </span>
                </div>
                <div className="text-xs text-neutral-500">Last 7 days</div>
              </div>

              {/* Mini Chart */}
              <div className="h-32 mb-6">
                <svg
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <path
                    d="
        M0 28
        L10 24
        L20 26
        L30 20
        L40 22
        L50 18
        L60 21
        L70 14
        L80 17
        L90 13
        L100 15
      "
                    fill="none"
                    stroke="#76B900"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                </svg>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-neutral-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointerClick className="w-3 h-3 text-[#76B900]" />
                    <span className="text-xs text-neutral-400">
                      Total Clicks
                    </span>
                  </div>
                  <div className="text-2xl font-light">12,847</div>
                  <div className="text-xs text-[#76B900] mt-1">+23.5%</div>
                </div>
                <div className="border border-neutral-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 className="w-3 h-3 text-[#76B900]" />
                    <span className="text-xs text-neutral-400">
                      Active Links
                    </span>
                  </div>
                  <div className="text-2xl font-light">284</div>
                  <div className="text-xs text-[#76B900] mt-1">+12</div>
                </div>
              </div>

              {/* Recent Links */}
              <div className="flex-1">
                <div className="text-xs text-neutral-400 mb-3">
                  Recent Activity
                </div>
                <div className="space-y-3">
                  {[
                    { short: "btlink/prod2024", clicks: 145 },
                    { short: "btlink/launch", clicks: 89 },
                    { short: "btlink/spring", clicks: 67 },
                  ].map((link, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs border-l-2 border-[#76B900]/20 pl-3 py-1"
                    >
                      <span className="text-neutral-300">{link.short}</span>
                      <span className="text-neutral-500">
                        {link.clicks} clicks
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-24 px-5 md:px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-light text-[#76B900] mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="mt-32 px-5 md:px-8 max-w-[1600px] mx-auto scroll-mt-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Everything you need to manage links
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Powerful features designed to give you complete control over your
            shortened URLs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="border border-neutral-800 p-6 hover:border-neutral-700 transition-colors"
            >
              <div className="text-[#76B900] mb-4">{f.icon}</div>
              <h3 className="text-sm font-medium mb-2">{f.title}</h3>
              <p className="text-xs text-neutral-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="mt-32 px-5 md:px-8 max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Built for teams of all sizes
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Whether you're a solo creator or enterprise team, BitLink scales
            with your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, i) => (
            <div key={i} className="border border-neutral-800 p-8">
              <div className="text-[#76B900] mb-4">{useCase.icon}</div>
              <h3 className="text-xl font-medium mb-3">{useCase.title}</h3>
              <p className="text-neutral-400 leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Docs/API Section */}
      <section
        id="docs"
        className="mt-32 px-5 md:px-8 max-w-[1600px] mx-auto scroll-mt-20"
      >
        <div className="border border-neutral-800 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="flex items-center gap-2 text-[#76B900] mb-4">
                <Code className="w-5 h-5" />
                <span className="text-sm font-medium">Developer First</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-light mb-6">
                A clean, predictable API
              </h2>

              <p className="text-neutral-400 mb-6 leading-relaxed">
                BitLink exposes a simple REST API for creating and resolving
                short links. Designed to be stateless, secure, and easy to
                integrate into any workflow.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#76B900] flex-shrink-0" />
                  <span>JSON-based REST endpoints</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#76B900] flex-shrink-0" />
                  <span>Guest and authenticated link creation</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#76B900] flex-shrink-0" />
                  <span>Built-in rate limiting and validation</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#76B900] flex-shrink-0" />
                  <span>Per-link analytics and QR generation</span>
                </li>
              </ul>

              <button
                onClick={() => navigate("/api-docs")}
                className="border border-[#76B900] text-[#76B900] px-6 py-3 hover:bg-[#76B900] hover:text-black transition-colors cursor-pointer flex items-center gap-2"
              >
                View API Docs
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Code snippet */}
            <div className="bg-[#0D0F13] border border-neutral-800 p-6 rounded font-mono text-xs">
              <div className="text-neutral-500 mb-4">
                // Create a short link (guest)
              </div>

              <div className="space-y-1">
                <div>
                  <span className="text-[#76B900]">POST</span>{" "}
                  /api/links/guest/shorten
                </div>

                <div className="text-neutral-400">{`{`}</div>

                <div className="pl-4 text-neutral-400">
                  <span className="text-[#76B900]">"originalUrl"</span>:{" "}
                  <span className="text-orange-400">"https://example.com"</span>
                  ,
                </div>

                <div className="pl-4 text-neutral-400">
                  <span className="text-[#76B900]">"customAlias"</span>:{" "}
                  <span className="text-orange-400">"my-link"</span>,
                </div>

                <div className="pl-4 text-neutral-400">
                  <span className="text-[#76B900]">"sessionId"</span>:{" "}
                  <span className="text-orange-400">"guest_x9a2k1d"</span>
                </div>

                <div className="text-neutral-400">{`}`}</div>
              </div>

              <div className="border-t border-neutral-800 mt-6 pt-6">
                <div className="text-neutral-500 mb-4">// Response</div>

                <div className="space-y-1 text-neutral-400">
                  <div>{`{`}</div>

                  <div className="pl-4">
                    <span className="text-[#76B900]">"shortUrl"</span>:{" "}
                    <span className="text-orange-400">
                      "https://api.bitlk.in/r/my-link"
                    </span>
                    ,
                  </div>

                  <div className="pl-4">
                    <span className="text-[#76B900]">"shortCode"</span>:{" "}
                    <span className="text-orange-400">"my-link"</span>,
                  </div>

                  <div className="pl-4">
                    <span className="text-[#76B900]">"qrCode"</span>:{" "}
                    <span className="text-orange-400">
                      "data:image/png;base64,..."
                    </span>
                  </div>

                  <div>{`}`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="mt-32 px-5 md:px-8 max-w-[1600px] mx-auto scroll-mt-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <div
              key={i}
              className="border border-neutral-800 p-8 flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-light">{plan.price}</span>
                  <span className="text-neutral-400 text-sm">
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#76B900] flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/auth")}
                className="mt-auto w-full py-3 border border-neutral-700 text-neutral-300 hover:border-[#76B900] hover:text-[#76B900] transition-colors cursor-pointer"
              >
                {plan.name === "Free"
                  ? "Start free"
                  : plan.name === "Pro"
                  ? "Upgrade"
                  : "Contact sales"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-32 border-t border-neutral-800">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-16">
          <div className="flex items-center justify-center gap-12">
            {/* Left minimal decoration */}
            <div className="hidden lg:block flex-1">
              <div className="h-px bg-gradient-to-r from-transparent to-neutral-800"></div>
            </div>

            {/* Center - Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-shrink-0">
              {/* Product */}
              <div className="text-center">
                <h4 className="text-sm font-medium mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li>
                    <button
                      onClick={() => scrollToSection("features")}
                      className="hover:text-white transition-colors"
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("features")}
                      className="hover:text-white transition-colors"
                    >
                      Analytics
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("features")}
                      className="hover:text-white transition-colors"
                    >
                      QR Codes
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("pricing")}
                      className="hover:text-white transition-colors"
                    >
                      Pricing
                    </button>
                  </li>
                </ul>
              </div>

              {/* Developers */}
              <div className="text-center">
                <h4 className="text-sm font-medium mb-4">Developers</h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li>
                    <button
                      onClick={() => scrollToSection("docs")}
                      className="hover:text-white transition-colors"
                    >
                      API Docs
                    </button>
                  </li>
                  <li>
                    <a
                      href="https://github.com/YHQZ1/BitLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div className="text-center">
                <h4 className="text-sm font-medium mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li>
                    <button
                      onClick={() => navigate("/about")}
                      className="hover:text-white transition-colors"
                    >
                      About
                    </button>
                  </li>
                  <li>
                    <a
                      href="mailto:support@bitlink.xyz"
                      className="hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div className="text-center">
                <h4 className="text-sm font-medium mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li>
                    <button
                      onClick={() => navigate("/privacy")}
                      className="hover:text-white transition-colors"
                    >
                      Privacy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/terms")}
                      className="hover:text-white transition-colors"
                    >
                      Terms
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/security")}
                      className="hover:text-white transition-colors"
                    >
                      Security
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right minimal decoration */}
            <div className="hidden lg:block flex-1">
              <div className="h-px bg-gradient-to-l from-transparent to-neutral-800"></div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-6 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="BitLink" className="w-6 h-6" />
              <span>© 2025 BitLink</span>
            </div>
            <span>Built for speed. Designed for scale.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
