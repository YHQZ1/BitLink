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

const normalizeAndValidateUrl = (input) => {
  if (!input) return null;

  let value = input.trim();

  if (!/^https?:\/\//i.test(value)) {
    value = "https://" + value;
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) return null;

    const hostname = url.hostname;

    if (
      !hostname ||
      !hostname.includes(".") ||
      hostname.startsWith(".") ||
      hostname.endsWith(".")
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
};

const ShortenedUrlDisplay = ({ url, onCopy }) => (
  <div className="py-6 border-t border-neutral-900/50 mt-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-2">
      <a
        href={url.shortUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#76B900] text-sm break-all flex items-center gap-2 hover:text-[#8FD400] transition-colors"
      >
        {url.shortUrl}
        <ExternalLink className="w-3 h-3 flex-shrink-0" />
      </a>
      <button
        onClick={() => onCopy(url.shortUrl)}
        className="text-neutral-500 hover:text-[#76B900] cursor-pointer transition-colors self-start sm:self-auto"
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
    <p className="text-xs text-neutral-600 mb-3 break-all font-light">
      {url.originalUrl}
    </p>
    <div className="flex flex-wrap gap-4 sm:gap-6 text-xs text-neutral-700">
      <span className="flex items-center gap-1.5">
        <Calendar className="w-3 h-3" />
        {new Date(url.createdAt).toLocaleDateString()}
      </span>
      <span className="flex items-center gap-1.5">
        <MousePointerClick className="w-3 h-3" />
        <span className="text-[#76B900]">{url.clicks || 0}</span> clicks
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

    const normalizedUrl = normalizeAndValidateUrl(url);

    if (!normalizedUrl) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/links/guest/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: normalizedUrl,
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
        originalUrl: link.originalUrl || normalizedUrl,
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
      <nav className="fixed top-0 w-full border-b border-neutral-900/50 bg-[#0B0D10]/95 backdrop-blur-sm z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="BitLink" className="w-8 h-8" />
              <span className="text-lg font-extralight text-white">
                BitLink
              </span>
            </div>

            {/* Mobile-only horizontal scroll */}
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide md:hidden">
              <button
                onClick={() => scrollToSection("features")}
                className="text-sm text-neutral-400 hover:text-white whitespace-nowrap px-2 py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("docs")}
                className="text-sm text-neutral-400 hover:text-white whitespace-nowrap px-2 py-2"
              >
                Docs
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="text-sm text-[#76B900] hover:text-[#8FD400] whitespace-nowrap px-2 py-2"
              >
                Sign In
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex gap-8 text-base font-light">
              <button
                onClick={() => scrollToSection("features")}
                className="text-neutral-500 hover:text-white"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("docs")}
                className="text-neutral-500 hover:text-white"
              >
                Docs
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="text-[#76B900] hover:text-[#8FD400]"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 border-b border-neutral-900/50 bg-[#0B0D10]/95 backdrop-blur-sm z-40">
          <div className="px-4 py-6 flex flex-col gap-3">
            <button
              onClick={() => scrollToSection("features")}
              className="text-neutral-400 hover:text-white text-left transition-colors py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("docs")}
              className="text-neutral-400 hover:text-white text-left transition-colors py-2"
            >
              Docs
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="text-[#76B900] text-left hover:text-[#8FD400] transition-colors py-2"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      <section className="pt-32 pb-12 w-full px-8 sm:px-12 lg:px-16 mx-auto">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-thin leading-[0.95] tracking-tight mb-6 sm:mb-8">
              Short links.
              <br />
              Real analytics.
              <br />
              <span className="text-[#76B900]">Zero noise.</span>
            </h1>

            <p className="text-neutral-500 max-w-lg text-sm sm:text-base font-light leading-relaxed mb-8 sm:mb-12">
              A fast, minimal URL shortener built for developers and teams who
              care about clarity and control.
            </p>

            <div className="max-w-xl">
              <label className="text-[#76B900] text-xs uppercase tracking-[0.3em] mb-3 sm:mb-4 block">
                Try it now
              </label>
              <div className="flex flex-col sm:flex-row gap-3 mb-2">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleShorten()}
                  placeholder="https://example.com/your-long-url"
                  className="flex-1 bg-transparent border-b-2 border-neutral-800 px-0 py-3 sm:py-4 text-white placeholder-neutral-800 text-sm font-light focus:border-[#76B900] outline-none transition-colors"
                />
                <button
                  onClick={handleShorten}
                  disabled={isLoading}
                  className="border-2 border-[#76B900] text-[#76B900] px-6 sm:px-8 py-3 hover:bg-[#76B900] hover:text-black transition-all cursor-pointer disabled:opacity-50 text-xs uppercase tracking-widest font-medium"
                >
                  {isLoading ? "..." : "Go"}
                </button>
              </div>

              {shortenedUrl && (
                <ShortenedUrlDisplay
                  url={shortenedUrl}
                  onCopy={copyToClipboard}
                />
              )}

              {authRequired && (
                <div className="mt-6 py-4 border-t border-neutral-900/50 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-neutral-600 font-light">
                    Free limit reached. Sign in to continue.
                  </span>
                  <button
                    onClick={() => navigate("/auth")}
                    className="cursor-pointer text-[#76B900] hover:text-[#8FD400] transition-colors whitespace-nowrap flex items-center gap-2"
                  >
                    Login <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="border-l-2 border-neutral-900 pl-8">
              <div className="flex items-baseline gap-3 mb-8">
                <div className="w-2 h-2 bg-[#76B900]"></div>
                <span className="text-xs text-neutral-600 uppercase tracking-wider">
                  Live Dashboard
                </span>
              </div>

              <div className="h-72 w-full mb-10">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  {/* subtle grid */}
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => (
                    <line
                      key={`v-${x}`}
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="100"
                      stroke="#1f2937"
                      strokeWidth="0.3"
                    />
                  ))}

                  {[15, 30, 45, 60, 75, 90].map((y) => (
                    <line
                      key={`h-${y}`}
                      x1="0"
                      y1={y}
                      x2="100"
                      y2={y}
                      stroke="#1f2937"
                      strokeWidth="0.3"
                    />
                  ))}

                  {/* primary — clicks */}
                  <polyline
                    points="
        0,82
        14,60
        28,66
        42,48
        56,54
        70,36
        84,42
        100,28
      "
                    fill="none"
                    stroke="#76B900"
                    strokeWidth="1.2"
                    strokeLinejoin="miter"
                    strokeLinecap="square"
                  />

                  {/* secondary — unique users */}
                  <polyline
                    points="
        0,40
        14,26
        28,44
        42,58
        56,46
        70,64
        84,52
        100,66
      "
                    fill="none"
                    stroke="#76B900"
                    strokeWidth="0.9"
                    strokeOpacity="0.55"
                    strokeLinejoin="miter"
                    strokeLinecap="square"
                  />

                  {/* tertiary — errors / drops (subtle red) */}
                  <polyline
                    points="
        0,50
        14,42
        28,54
        42,60
        56,62
        70,70
        84,74
        100,78
      "
                    fill="none"
                    stroke="#9B1C1C"
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                    strokeLinejoin="miter"
                    strokeLinecap="square"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="border-l-2 border-[#76B900] pl-4">
                  <div className="text-4xl font-thin text-white tabular-nums mb-1">
                    12,847
                  </div>
                  <div className="text-xs text-neutral-600 uppercase tracking-wider">
                    Total Clicks
                  </div>
                  <div className="text-xs text-[#76B900] mt-1">+23.5%</div>
                </div>

                <div className="border-l-2 border-neutral-800 pl-4">
                  <div className="text-4xl font-thin text-white tabular-nums mb-1">
                    284
                  </div>
                  <div className="text-xs text-neutral-600 uppercase tracking-wider">
                    Active Links
                  </div>
                  <div className="text-xs text-[#76B900] mt-1">+12 new</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 w-full px-8 sm:px-12 lg:px-16 mx-auto border-y border-neutral-900">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-thin text-[#76B900] mb-2 tracking-tighter">
                {stat.value}
              </div>
              <div className="text-xs text-neutral-600 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="py-16 w-full px-8 sm:px-12 lg:px-16 mx-auto scroll-mt-20"
      >
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-thin mb-4 tracking-tight">
            Everything you need
          </h2>
          <div className="flex items-baseline gap-4">
            <div className="h-px w-12 sm:w-20 bg-[#76B900]"></div>
            <p className="text-neutral-600 text-xs sm:text-sm uppercase tracking-widest">
              Features
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="border-l-2 border-neutral-900 pl-4 sm:pl-6 py-2"
            >
              <div className="text-[#76B900] mb-3 sm:mb-4">{f.icon}</div>
              <h3 className="text-base font-light mb-2 text-white">
                {f.title}
              </h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 w-full px-8 sm:px-12 lg:px-16 mx-auto border-t border-neutral-900">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-thin mb-4 tracking-tight">
            Built for everyone
          </h2>
          <div className="flex items-baseline gap-4">
            <div className="h-px w-12 sm:w-20 bg-[#76B900]"></div>
            <p className="text-neutral-600 text-xs sm:text-sm uppercase tracking-widest">
              Use Cases
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {useCases.map((useCase, i) => (
            <div key={i}>
              <div className="text-[#76B900] mb-4 sm:mb-6">{useCase.icon}</div>
              <h3 className="text-lg sm:text-xl font-light mb-3 sm:mb-4 tracking-tight">
                {useCase.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed text-xs sm:text-sm font-light">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="docs"
        className="py-16 w-full px-8 sm:px-12 lg:px-16 mx-auto scroll-mt-20 border-t border-neutral-900"
      >
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
          <div>
            <div className="flex items-center gap-2 text-[#76B900] mb-6 sm:mb-8">
              <Code className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Developer First
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-thin mb-6 tracking-tight leading-tight">
              A clean, predictable API
            </h2>

            <p className="text-neutral-600 mb-6 sm:mb-8 leading-relaxed font-light text-sm sm:text-base">
              BitLink exposes a simple REST API for creating and resolving short
              links. Designed to be stateless, secure, and easy to integrate
              into any workflow.
            </p>

            <ul className="space-y-4 mb-8 sm:mb-12 border-l-2 border-neutral-900 pl-4 sm:pl-6">
              <li className="flex items-start gap-3 text-sm font-light">
                <CheckCircle2 className="w-4 h-4 text-[#76B900] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-500">
                  JSON-based REST endpoints
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <CheckCircle2 className="w-4 h-4 text-[#76B900] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-500">
                  Guest and authenticated link creation
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <CheckCircle2 className="w-4 h-4 text-[#76B900] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-500">
                  Built-in rate limiting and validation
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <CheckCircle2 className="w-4 h-4 text-[#76B900] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-500">
                  Per-link analytics and QR generation
                </span>
              </li>
            </ul>

            <button
              onClick={() => navigate("/api-docs")}
              className="border-2 border-[#76B900] text-[#76B900] px-6 sm:px-8 py-3 hover:bg-[#76B900] hover:text-black transition-all cursor-pointer flex items-center gap-2 text-xs uppercase tracking-widest font-medium"
            >
              View API Docs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-neutral-900/30 border border-neutral-900 p-6 sm:p-8 font-mono text-xs overflow-x-auto">
            <div className="text-neutral-600 mb-6 font-light">
              // Create a short link (guest)
            </div>

            <div className="space-y-1 mb-6 sm:mb-8 min-w-[300px]">
              <div>
                <span className="text-[#76B900]">POST</span>{" "}
                <span className="text-neutral-500">
                  /api/links/guest/shorten
                </span>
              </div>

              <div className="text-neutral-500">{`{`}</div>

              <div className="pl-4 text-neutral-500">
                <span className="text-[#76B900]">"originalUrl"</span>:{" "}
                <span className="text-orange-400">"https://example.com"</span>,
              </div>

              <div className="pl-4 text-neutral-500">
                <span className="text-[#76B900]">"customAlias"</span>:{" "}
                <span className="text-orange-400">"my-link"</span>,
              </div>

              <div className="pl-4 text-neutral-500">
                <span className="text-[#76B900]">"sessionId"</span>:{" "}
                <span className="text-orange-400">"guest_x9a2k1d"</span>
              </div>

              <div className="text-neutral-500">{`}`}</div>
            </div>

            <div className="border-t border-neutral-900 pt-6">
              <div className="text-neutral-600 mb-6 font-light">
                // Response
              </div>

              <div className="space-y-1 text-neutral-500">
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
      </section>

      <section
        id="pricing"
        className="py-16 w-full px-8 sm:px-12 lg:px-16 mx-auto scroll-mt-20 border-t border-neutral-900"
      >
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-thin mb-4 tracking-tight">
            Simple pricing
          </h2>
          <div className="flex items-baseline gap-4">
            <div className="h-px w-12 sm:w-20 bg-[#76B900]"></div>
            <p className="text-neutral-600 text-xs sm:text-sm uppercase tracking-widest">
              Transparent & Fair
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <div
              key={i}
              className="border border-neutral-800 p-6 sm:p-8 flex flex-col"
            >
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-medium mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-light">
                    {plan.price}
                  </span>
                  <span className="text-neutral-400 text-xs sm:text-sm">
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-xs sm:text-sm"
                  >
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#76B900] flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/auth")}
                className="mt-auto w-full py-3 border border-neutral-700 text-neutral-300 hover:border-[#76B900] hover:text-[#76B900] transition-colors cursor-pointer text-sm"
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
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-center">
            <div className="hidden lg:block flex-1">
              <div className="h-px bg-gradient-to-r from-transparent via-transparent to-neutral-800"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 px-4 sm:px-8">
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-medium mb-3 sm:mb-4">Product</h4>
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

              <div className="text-center sm:text-left">
                <h4 className="text-sm font-medium mb-3 sm:mb-4">Developers</h4>
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

              <div className="text-center sm:text-left">
                <h4 className="text-sm font-medium mb-3 sm:mb-4">Company</h4>
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

              <div className="text-center sm:text-left">
                <h4 className="text-sm font-medium mb-3 sm:mb-4">Legal</h4>
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

            <div className="hidden lg:block flex-1">
              <div className="h-px bg-gradient-to-l from-transparent via-transparent to-neutral-800"></div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="BitLink" className="w-6 h-6" />
              <span>© 2025 BitLink</span>
            </div>
            <span className="text-center sm:text-left">
              Built for speed. Designed for scale.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
