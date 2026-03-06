import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Check,
  Zap,
  Shield,
  BarChart3,
  Link2,
  ExternalLink,
  Terminal,
  Key,
  AlertCircle,
  Clock,
  Globe,
  Activity,
  ChevronRight,
  Code,
  Github,
  MapPin,
  Smartphone,
  Chrome,
  Monitor,
  Hash,
  CheckCircle2,
} from "lucide-react";

/* ─── Code Block ─────────────────────────────────────────────────────────── */
const CodeBlock = ({ code, language = "bash" }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative bg-[#080A0D] border border-neutral-900 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-neutral-900 bg-[#0A0C10]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 font-mono">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="text-neutral-600 hover:text-[#76B900] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">
                Copied
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto">
        <code className="text-sm font-mono text-neutral-300 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
};

/* ─── Method Badge ───────────────────────────────────────────────────────── */
const MethodBadge = ({ method }) => {
  const styles = {
    GET: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    POST: "text-[#76B900] border-[#76B900]/30 bg-[#76B900]/5",
    PUT: "text-amber-400 border-amber-400/30 bg-amber-400/5",
    DELETE: "text-red-400 border-red-400/30 bg-red-400/5",
  };
  return (
    <span
      className={`text-xs font-mono tracking-[0.15em] px-2.5 py-1 border flex-shrink-0 ${styles[method]}`}
    >
      {method}
    </span>
  );
};

/* ─── Endpoint Card ──────────────────────────────────────────────────────── */
const EndpointCard = ({
  method,
  path,
  description,
  auth = false,
  children,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-900 mb-4 hover:border-neutral-800 transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 p-6 text-left cursor-pointer hover:bg-[#0D0F13]/40 transition-colors"
      >
        <MethodBadge method={method} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <code className="text-base text-neutral-200 break-all font-mono font-light">
              {path}
            </code>
            {auth && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/5 border border-amber-500/20">
                <Key className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] text-amber-500 uppercase tracking-[0.2em]">
                  Auth
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-neutral-600 font-light leading-relaxed">
            {description}
          </p>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-neutral-700 transition-transform duration-200 flex-shrink-0 mt-0.5 ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-neutral-900 p-6 bg-[#0D0F13]/40 space-y-6">
          {children}
        </div>
      )}
    </div>
  );
};

/* ─── Param Table ────────────────────────────────────────────────────────── */
const ParamTable = ({ params }) => (
  <div className="overflow-x-auto border border-neutral-900">
    <table className="w-full">
      <thead>
        <tr className="border-b border-neutral-900 bg-[#0A0C10]">
          {["Parameter", "Type", "Required", "Description"].map((h) => (
            <th
              key={h}
              className="text-left py-3 px-5 text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-normal"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {params.map((p, i) => (
          <tr
            key={i}
            className="border-b border-neutral-900/60 last:border-0 hover:bg-[#0A0C10] transition-colors"
          >
            <td className="py-3.5 px-5 font-mono text-[#76B900] text-sm">
              {p.name}
            </td>
            <td className="py-3.5 px-5 text-neutral-500 font-mono text-sm">
              {p.type}
            </td>
            <td className="py-3.5 px-5">
              {p.required ? (
                <span className="inline-flex items-center gap-1.5 text-amber-500 text-xs uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  required
                </span>
              ) : (
                <span className="text-neutral-700 text-xs uppercase tracking-wider">
                  optional
                </span>
              )}
            </td>
            <td className="py-3.5 px-5 text-neutral-500 font-light text-sm leading-relaxed">
              {p.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ─── Sub-label ──────────────────────────────────────────────────────────── */
const SubLabel = ({ children }) => (
  <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 mb-3">
    {children}
  </p>
);

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function ApiDocs() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "authentication", label: "Authentication" },
    { id: "links", label: "Links" },
    { id: "analytics", label: "Analytics" },
    { id: "redirect", label: "Redirect" },
    { id: "rate-limits", label: "Rate Limits" },
    { id: "errors", label: "Errors" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionEls = document.querySelectorAll("section[id]");
      sectionEls.forEach((s) => {
        const rect = s.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) setActiveSection(s.id);
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
      {/* ── Nav ── */}
      <nav className="fixed top-0 w-full border-b border-neutral-800 bg-[#0B0D10]/95 backdrop-blur-sm z-50">
        <div className="w-full px-4 sm:px-8 lg:px-16 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 sm:gap-3 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/logo.png"
                alt="BitLink"
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
              <span className="text-base sm:text-lg font-extralight tracking-tight text-white">
                BitLink
              </span>
            </div>
          </button>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-600">
            Docs
          </span>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-900 fixed top-16 left-0 bottom-0 overflow-y-auto flex-shrink-0 z-40 bg-[#0B0D10]">
          <div className="p-7 border-b border-neutral-900">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 mb-3">
              Base URL
            </p>
            <code className="text-sm text-[#76B900] font-mono break-all bg-[#080A0D] p-3 block border border-neutral-900">
              https://api.bitlk.in
            </code>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#76B900]/60 animate-pulse"></span>
              <span className="text-xs uppercase tracking-wider text-neutral-600">
                Operational
              </span>
            </div>
          </div>

          <nav className="p-6 flex-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 mb-4">
              Sections
            </p>
            <div className="space-y-0.5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-light transition-all cursor-pointer text-left ${
                    activeSection === s.id
                      ? "text-[#76B900] border-l-2 border-[#76B900] bg-[#76B900]/5 pl-[14px]"
                      : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="p-6 border-t border-neutral-900">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 mb-4">
              Powered by
            </p>
            <div className="space-y-3">
              {[
                { label: "Queue", value: "BullMQ" },
                { label: "GeoIP", value: "MaxMind" },
                { label: "Cache", value: "Upstash" },
                { label: "DB", value: "MongoDB" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-neutral-600 uppercase tracking-wider">
                    {label}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Mobile section strip ── */}
        <div className="lg:hidden fixed top-16 w-full border-b border-neutral-900 bg-[#0B0D10]/95 backdrop-blur-sm z-40 overflow-x-auto">
          <div className="flex px-4 py-2.5 space-x-1 min-w-max">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`text-xs uppercase tracking-[0.2em] px-4 py-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeSection === s.id
                    ? "text-[#76B900] bg-[#76B900]/5"
                    : "text-neutral-600 hover:text-neutral-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 lg:ml-64 mt-10 lg:mt-0">
          {/* ══════════════════════════════════════════
              OVERVIEW — full-bleed editorial hero
          ══════════════════════════════════════════ */}
          <section id="overview" className="scroll-mt-28">
            {/* Hero — matches landing page structure */}
            <div className="px-8 sm:px-12 lg:px-16 pt-16 pb-16 border-b border-neutral-900">
              <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
                {/* Left — editorial headline */}
                <div>
                  <p className="text-[#76B900] text-xs uppercase tracking-[0.3em] mb-6">
                    API Documentation
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-thin leading-[0.95] tracking-tight mb-6">
                    Build anything
                    <br />
                    with BitLink.
                    <br />
                    <span className="text-[#76B900]">Ship faster.</span>
                  </h1>
                  <p className="text-neutral-500 max-w-lg text-sm sm:text-base font-light leading-relaxed mb-10">
                    A clean REST API for creating short links, tracking clicks,
                    and pulling analytics — from any stack, in minutes.
                  </p>

                  {/* Quick jump pills */}
                  <div className="flex flex-wrap gap-2">
                    {sections.slice(1).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => scrollTo(s.id)}
                        className="text-xs uppercase tracking-[0.2em] px-4 py-2 border border-neutral-900 text-neutral-500 hover:border-[#76B900]/40 hover:text-[#76B900] transition-colors cursor-pointer"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right — stats grid + health strip (mirrors landing page right column) */}
                <div className="hidden lg:block border-l-2 border-neutral-900 pl-10">
                  <div className="flex items-baseline gap-3 mb-8">
                    <div className="w-2 h-2 bg-[#76B900]"></div>
                    <span className="text-xs text-neutral-600 uppercase tracking-wider">
                      System Status
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-neutral-900 mb-8">
                    {[
                      { label: "Uptime", value: "99.9%", sub: "SLA" },
                      {
                        label: "Response",
                        value: "<100ms",
                        sub: "p95 latency",
                      },
                      {
                        label: "Rate limit",
                        value: "50/day",
                        sub: "free tier",
                      },
                      { label: "Endpoints", value: "24", sub: "total" },
                    ].map((s) => (
                      <div key={s.label} className="bg-[#0B0D10] p-5">
                        <div className="text-3xl font-thin text-[#76B900] mb-1.5 tracking-tight">
                          {s.value}
                        </div>
                        <div className="text-xs uppercase tracking-wider text-neutral-600">
                          {s.label}
                        </div>
                        <div className="text-[10px] text-neutral-700 mt-0.5">
                          {s.sub}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="border border-neutral-900 bg-[#0D0F13]/40 p-4 flex items-center gap-4">
                      <Terminal className="w-4 h-4 text-[#76B900] flex-shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-1">
                          Base URL
                        </p>
                        <code className="text-sm text-neutral-300 font-mono">
                          https://api.bitlk.in
                        </code>
                      </div>
                    </div>
                    <div className="border border-neutral-900 bg-[#0D0F13]/40 p-4 flex items-center gap-4">
                      <Activity className="w-4 h-4 text-[#76B900] flex-shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-1">
                          Health check
                        </p>
                        <code className="text-sm text-neutral-300 font-mono">
                          GET /health → 200 ok
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick start — full width, two column */}
            <div className="px-8 sm:px-12 lg:px-16 py-14 border-b border-neutral-900">
              <div className="mb-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-thin mb-4 tracking-tight">
                  Up and running
                  <br />
                  <span className="text-[#76B900]">in two steps.</span>
                </h2>
                <div className="flex items-baseline gap-4">
                  <div className="h-px w-16 bg-[#76B900]"></div>
                  <p className="text-neutral-600 text-xs uppercase tracking-widest">
                    Quick Start
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-neutral-900">
                <div className="bg-[#0B0D10] p-6 sm:p-8">
                  <div className="border-l-2 border-[#76B900] pl-4 mb-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 mb-1">
                      Step 1
                    </p>
                    <p className="text-lg font-light text-white">
                      Get your token
                    </p>
                  </div>
                  <CodeBlock
                    language="bash"
                    code={`curl -X POST https://api.bitlk.in/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "you@example.com",
    "password": "your_password"
  }'`}
                  />
                  <p className="text-xs text-neutral-600 font-light mt-4 leading-relaxed">
                    Returns a JWT token valid for 7 days. Keep it secret — it
                    authenticates all your requests.
                  </p>
                </div>

                <div className="bg-[#0B0D10] p-6 sm:p-8">
                  <div className="border-l-2 border-neutral-800 pl-4 mb-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 mb-1">
                      Step 2
                    </p>
                    <p className="text-lg font-light text-white">
                      Create your first link
                    </p>
                  </div>
                  <CodeBlock
                    language="bash"
                    code={`curl -X POST https://api.bitlk.in/api/links \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalUrl": "https://example.com/a-very-long-url"
  }'`}
                  />
                  <p className="text-xs text-neutral-600 font-light mt-4 leading-relaxed">
                    Get back a short URL and QR code instantly. That's it.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              AUTHENTICATION
          ══════════════════════════════════════════ */}
          <section id="authentication" className="scroll-mt-28">
            <div className="px-8 sm:px-12 lg:px-16 py-14 border-b border-neutral-900">
              {/* Section header — same pattern as landing */}
              <div className="mb-12">
                <p className="text-[#76B900] text-xs uppercase tracking-[0.3em] mb-6">
                  01 — Authentication
                </p>
                <h2 className="text-4xl sm:text-5xl font-thin mb-4 tracking-tight">
                  One token.
                  <br />
                  Every request.
                </h2>
                <div className="flex items-baseline gap-4 mb-4">
                  <div className="h-px w-16 bg-[#76B900]"></div>
                  <p className="text-neutral-600 text-xs uppercase tracking-widest">
                    JWT + Google OAuth
                  </p>
                </div>
                <p className="text-neutral-500 text-sm font-light max-w-xl leading-relaxed">
                  BitLink uses signed JWT tokens. Get one from the login
                  endpoint, drop it in the{" "}
                  <code className="text-neutral-400 font-mono text-xs">
                    Authorization
                  </code>{" "}
                  header, and you're done. Tokens expire after 7 days.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-0 mb-10">
                <div className="lg:pr-10 pb-8 lg:pb-0">
                  <div className="border-l-2 border-[#76B900] pl-4 mb-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 mb-1">
                      Get a token
                    </p>
                    <p className="text-base font-light text-white">
                      Login or register
                    </p>
                  </div>
                  <CodeBlock
                    language="bash"
                    code={`curl -X POST https://api.bitlk.in/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "your_password"
  }'

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "expiresIn": 604800,
  "tokenType": "Bearer"
}`}
                  />
                </div>
                <div className="hidden lg:block w-px bg-neutral-900 self-stretch" />
                <div className="lg:pl-10">
                  <div className="border-l-2 border-neutral-800 pl-4 mb-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 mb-1">
                      Use it
                    </p>
                    <p className="text-base font-light text-white">
                      Attach to every request
                    </p>
                  </div>
                  <CodeBlock
                    language="javascript"
                    code={`// Using fetch
const res = await fetch('https://api.bitlk.in/api/links', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
});

// Using axios — set it once, forget it
axios.defaults.headers.common['Authorization']
  = \`Bearer \${token}\`;`}
                  />
                </div>
              </div>

              {/* Auth methods — left-border cards matching landing features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-8">
                {[
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "JWT — HS256",
                    body: "Tokens are cryptographically signed. Valid for 7 days. Refresh with POST /api/auth/refresh before expiry.",
                  },
                  {
                    icon: <Globe className="w-5 h-5" />,
                    title: "Google OAuth",
                    body: "Sign in via /api/auth/google. We never see your Google password — just a profile token.",
                  },
                  {
                    icon: <Key className="w-5 h-5" />,
                    title: "X-API-Key",
                    body: "For automation and service accounts, use the X-API-Key header instead of Bearer tokens.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="border-l-2 border-neutral-900 pl-5 py-1"
                  >
                    <div className="text-[#76B900] mb-3">{item.icon}</div>
                    <h3 className="text-base font-light text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-600 font-light leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-neutral-400 font-light">
                  Call{" "}
                  <code className="text-amber-400 font-mono text-xs">
                    POST /api/auth/refresh
                  </code>{" "}
                  before your token expires to stay authenticated without
                  re-logging in.
                </p>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              LINKS
          ══════════════════════════════════════════ */}
          <section id="links" className="scroll-mt-28">
            <div className="px-8 sm:px-12 lg:px-16 py-14 border-b border-neutral-900">
              <div className="mb-12">
                <p className="text-[#76B900] text-xs uppercase tracking-[0.3em] mb-6">
                  02 — Link Management
                </p>
                <h2 className="text-4xl sm:text-5xl font-thin mb-4 tracking-tight">
                  Create. Update.
                  <br />
                  Track everything.
                </h2>
                <div className="flex items-baseline gap-4 mb-4">
                  <div className="h-px w-16 bg-[#76B900]"></div>
                  <p className="text-neutral-600 text-xs uppercase tracking-widest">
                    Short Links API
                  </p>
                </div>
                <p className="text-neutral-500 text-sm font-light max-w-xl leading-relaxed">
                  Guest users can create one link per session to try it out.
                  Authenticated users on the free tier get 50 per day, unlimited
                  on Pro. Every link includes a QR code automatically.
                </p>
              </div>

              {/* Feature tags — landing-page style */}
              <div className="flex flex-wrap gap-2 mb-10">
                {[
                  {
                    icon: <Zap className="w-3 h-3" />,
                    label: "50 links/day free",
                  },
                  {
                    icon: <Hash className="w-3 h-3" />,
                    label: "Custom aliases",
                  },
                  {
                    icon: <Code className="w-3 h-3" />,
                    label: "QR code included",
                  },
                  {
                    icon: <Activity className="w-3 h-3" />,
                    label: "Real-time click tracking",
                  },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-500 border border-neutral-900 px-3 py-1.5 uppercase tracking-wider"
                  >
                    {icon}
                    {label}
                  </span>
                ))}
              </div>

              {/* Endpoints */}
              <EndpointCard
                method="POST"
                path="/api/links/guest/shorten"
                description="Try it without signing up. Paste a URL, get a short link. Limited to one per guest session."
              >
                <SubLabel>Request body</SubLabel>
                <ParamTable
                  params={[
                    {
                      name: "originalUrl",
                      type: "string",
                      required: true,
                      description:
                        "The URL to shorten — must be a valid http/https URL",
                    },
                    {
                      name: "sessionId",
                      type: "string",
                      required: true,
                      description:
                        "Your guest session ID (store in localStorage and reuse)",
                    },
                    {
                      name: "customAlias",
                      type: "string",
                      required: false,
                      description:
                        "Optional: choose your own short code, 4–20 alphanumeric chars",
                    },
                  ]}
                />
                <div className="grid sm:grid-cols-2 gap-5 mt-2">
                  <div>
                    <SubLabel>Success — 201</SubLabel>
                    <CodeBlock
                      language="json"
                      code={`{
  "id": "507f1f77bcf86cd799439011",
  "originalUrl": "https://example.com/very-long-url",
  "shortUrl": "https://bitlk.in/r/my-link",
  "shortCode": "my-link",
  "clicks": 0,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "isGuestLink": true,
  "qrCode": "data:image/png;base64,..."
}`}
                    />
                  </div>
                  <div>
                    <SubLabel>Guest limit hit — 403</SubLabel>
                    <CodeBlock
                      language="json"
                      code={`{
  "error": "You've used your free link. 
  Sign in to create unlimited links.",
  "requiresAuth": true
}`}
                    />
                  </div>
                </div>
              </EndpointCard>

              <EndpointCard
                method="POST"
                path="/api/links"
                description="Create short links from your account. Pick a custom alias, add tags, and get a QR code — all in one call."
                auth
              >
                <SubLabel>Request body</SubLabel>
                <ParamTable
                  params={[
                    {
                      name: "originalUrl",
                      type: "string",
                      required: true,
                      description: "The destination URL",
                    },
                    {
                      name: "customAlias",
                      type: "string",
                      required: false,
                      description:
                        "Your custom short code — unique, 4–20 chars",
                    },
                    {
                      name: "tags",
                      type: "array",
                      required: false,
                      description:
                        "Strings to help you organise links (e.g. ['campaign', 'twitter'])",
                    },
                    {
                      name: "generateQR",
                      type: "boolean",
                      required: false,
                      description: "Generate a QR code image — default: true",
                    },
                  ]}
                />
                <SubLabel>Response 201</SubLabel>
                <CodeBlock
                  language="json"
                  code={`{
  "id": "507f1f77bcf86cd799439011",
  "originalUrl": "https://example.com/article",
  "shortUrl": "https://bitlk.in/r/article-2025",
  "shortCode": "article-2025",
  "clicks": 0,
  "tags": ["marketing", "campaign"],
  "createdAt": "2025-01-15T10:30:00.000Z",
  "qrCode": "data:image/png;base64,...",
  "expiresAt": null
}`}
                />
              </EndpointCard>

              <div className="grid sm:grid-cols-2 gap-4">
                <EndpointCard
                  method="GET"
                  path="/api/links"
                  description="Fetch all your links, newest first. Supports pagination and tag filtering."
                  auth
                >
                  <SubLabel>Query parameters</SubLabel>
                  <ParamTable
                    params={[
                      {
                        name: "page",
                        type: "number",
                        required: false,
                        description: "Page number (default: 1)",
                      },
                      {
                        name: "limit",
                        type: "number",
                        required: false,
                        description: "Items per page (default: 20, max: 100)",
                      },
                      {
                        name: "tag",
                        type: "string",
                        required: false,
                        description: "Filter to a specific tag",
                      },
                    ]}
                  />
                  <SubLabel>Response 200</SubLabel>
                  <CodeBlock
                    language="json"
                    code={`{
  "data": [{
    "id": "507f1f77bcf86cd799439011",
    "shortUrl": "https://bitlk.in/r/abc123",
    "shortCode": "abc123",
    "clicks": 147,
    "createdAt": "2025-01-10T08:00:00.000Z"
  }],
  "pagination": {
    "page": 1, "limit": 20,
    "total": 45, "pages": 3
  }
}`}
                  />
                </EndpointCard>

                <EndpointCard
                  method="PUT"
                  path="/api/links/:id"
                  description="Change where a link points, or rename its alias. QR code regenerates automatically if the alias changes."
                  auth
                >
                  <SubLabel>Request body</SubLabel>
                  <ParamTable
                    params={[
                      {
                        name: "originalUrl",
                        type: "string",
                        required: false,
                        description: "New destination URL",
                      },
                      {
                        name: "customAlias",
                        type: "string",
                        required: false,
                        description: "New short code — must be unique",
                      },
                      {
                        name: "tags",
                        type: "array",
                        required: false,
                        description: "Replacement tag array",
                      },
                    ]}
                  />
                  <SubLabel>Response 200</SubLabel>
                  <CodeBlock
                    language="json"
                    code={`{
  "id": "507f1f77bcf86cd799439011",
  "shortUrl": "https://bitlk.in/r/new-alias",
  "shortCode": "new-alias",
  "clicks": 147,
  "qrCode": "data:image/png;base64,...",
  "updatedAt": "2025-01-15T11:30:00.000Z"
}`}
                  />
                </EndpointCard>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <EndpointCard
                  method="DELETE"
                  path="/api/links/:id"
                  description="Permanently delete a link and all its analytics history. This cannot be undone."
                  auth
                >
                  <SubLabel>Response 204</SubLabel>
                  <CodeBlock
                    language="json"
                    code={`// 204 No Content — link and all analytics deleted`}
                  />
                </EndpointCard>

                <EndpointCard
                  method="POST"
                  path="/api/links/migrate"
                  description="After a guest signs up, call this to move their guest links into their new account."
                  auth
                >
                  <SubLabel>Request body</SubLabel>
                  <ParamTable
                    params={[
                      {
                        name: "sessionId",
                        type: "string",
                        required: true,
                        description: "The guest session ID to import from",
                      },
                    ]}
                  />
                  <SubLabel>Response 200</SubLabel>
                  <CodeBlock language="json" code={`{ "migratedCount": 1 }`} />
                </EndpointCard>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              ANALYTICS
          ══════════════════════════════════════════ */}
          <section id="analytics" className="scroll-mt-28">
            <div className="px-8 sm:px-12 lg:px-16 py-14 border-b border-neutral-900">
              <div className="mb-12">
                <p className="text-[#76B900] text-xs uppercase tracking-[0.3em] mb-6">
                  03 — Analytics
                </p>
                <h2 className="text-4xl sm:text-5xl font-thin mb-4 tracking-tight">
                  Know exactly who
                  <br />
                  clicked, and where.
                </h2>
                <div className="flex items-baseline gap-4 mb-4">
                  <div className="h-px w-16 bg-[#76B900]"></div>
                  <p className="text-neutral-600 text-xs uppercase tracking-widest">
                    Click Intelligence
                  </p>
                </div>
                <p className="text-neutral-500 text-sm font-light max-w-xl leading-relaxed">
                  Every click is captured asynchronously — so redirects stay
                  fast. Get per-link or global breakdowns by country, device,
                  browser, referrer, and time.
                </p>
              </div>

              {/* Data points grid — landing features style */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-8 mb-12">
                {[
                  {
                    icon: <MapPin className="w-5 h-5" />,
                    label: "Geography",
                    value: "Country + City",
                  },
                  {
                    icon: <Smartphone className="w-5 h-5" />,
                    label: "Device",
                    value: "Mobile / Desktop / Tablet",
                  },
                  {
                    icon: <Chrome className="w-5 h-5" />,
                    label: "Browser",
                    value: "Chrome, Firefox, Safari…",
                  },
                  {
                    icon: <Monitor className="w-5 h-5" />,
                    label: "OS",
                    value: "Windows, macOS, iOS…",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="border-l-2 border-neutral-900 pl-5 py-1"
                  >
                    <div className="text-[#76B900] mb-3">{item.icon}</div>
                    <div className="text-sm font-light text-white mb-1">
                      {item.label}
                    </div>
                    <div className="text-xs text-neutral-600 font-light">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <EndpointCard
                method="GET"
                path="/api/analytics/:id"
                description="Full breakdown for one link — timeline, top referrers, countries, devices, and peak hours."
                auth
              >
                <SubLabel>Query parameters</SubLabel>
                <ParamTable
                  params={[
                    {
                      name: "range",
                      type: "string",
                      required: false,
                      description:
                        "'7d', '30d', '90d', or 'all' — default: '30d'",
                    },
                    {
                      name: "from",
                      type: "date",
                      required: false,
                      description: "Custom start date in ISO 8601",
                    },
                    {
                      name: "to",
                      type: "date",
                      required: false,
                      description: "Custom end date in ISO 8601",
                    },
                  ]}
                />
                <SubLabel>Response 200</SubLabel>
                <CodeBlock
                  language="json"
                  code={`{
  "summary": {
    "totalClicks": 1247,
    "uniqueVisitors": 892,
    "bounceRate": "32.4%"
  },
  "timeline": [
    { "date": "2025-01-10", "clicks": 45, "unique": 38 }
  ],
  "referrers": [
    { "source": "Twitter", "count": 234, "percentage": 18.8 }
  ],
  "geography": [
    { "country": "US", "city": "New York", "count": 156 }
  ],
  "devices": { "mobile": 687, "desktop": 456, "tablet": 104 },
  "browsers": [{ "name": "Chrome", "count": 567 }],
  "peakHours": [
    { "hour": 9, "clicks": 45 },
    { "hour": 14, "clicks": 78 }
  ]
}`}
                />
              </EndpointCard>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <EndpointCard
                  method="GET"
                  path="/api/analytics/global"
                  description="See how all your links are performing together — top performers, growth trends, and totals."
                  auth
                >
                  <SubLabel>Query parameters</SubLabel>
                  <ParamTable
                    params={[
                      {
                        name: "range",
                        type: "string",
                        required: false,
                        description: "'7d', '30d' (default), '90d', or 'year'",
                      },
                    ]}
                  />
                  <SubLabel>Response 200</SubLabel>
                  <CodeBlock
                    language="json"
                    code={`{
  "overview": {
    "totalLinks": 45,
    "totalClicks": 12847,
    "activeLinks": 42,
    "clickThroughRate": "4.2%"
  },
  "topPerforming": [
    { "shortCode": "abc123", "clicks": 1247 }
  ],
  "growthTrend": [
    { "month": "2025-01", "clicks": 4234, "growth": "+8.3%" }
  ]
}`}
                  />
                </EndpointCard>

                <EndpointCard
                  method="GET"
                  path="/api/analytics/stats"
                  description="Lightweight summary for populating dashboard counters — fast and minimal."
                  auth
                >
                  <SubLabel>Response 200</SubLabel>
                  <CodeBlock
                    language="json"
                    code={`{
  "totalLinks": 45,
  "totalClicks": 12847,
  "activeLinks": 42,
  "clicksToday": 234,
  "clicksThisWeek": 1567,
  "trend": "+5.2%",
  "topCountry": "US (44.2%)",
  "topDevice": "Mobile (54.8%)"
}`}
                  />
                </EndpointCard>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              REDIRECT
          ══════════════════════════════════════════ */}
          <section id="redirect" className="scroll-mt-28">
            <div className="px-8 sm:px-12 lg:px-16 py-14 border-b border-neutral-900">
              <div className="mb-12">
                <p className="text-[#76B900] text-xs uppercase tracking-[0.3em] mb-6">
                  04 — Redirect Layer
                </p>
                <h2 className="text-4xl sm:text-5xl font-thin mb-4 tracking-tight">
                  50ms redirects.
                  <br />
                  Zero compromise.
                </h2>
                <div className="flex items-baseline gap-4 mb-4">
                  <div className="h-px w-16 bg-[#76B900]"></div>
                  <p className="text-neutral-600 text-xs uppercase tracking-widest">
                    Speed-first architecture
                  </p>
                </div>
                <p className="text-neutral-500 text-sm font-light max-w-xl leading-relaxed">
                  Clicks are redirected from Redis cache first — MongoDB is only
                  hit on a cache miss. Analytics are queued via BullMQ so they
                  never slow down the redirect itself.
                </p>
              </div>

              <EndpointCard
                method="GET"
                path="/r/:code"
                description="Resolves a short code and redirects the visitor. Click counting and analytics capture happen asynchronously."
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div>
                    <SubLabel>What happens on each click</SubLabel>
                    <div className="space-y-3 border-l-2 border-neutral-900 pl-5">
                      {[
                        "Check Redis cache for the short code",
                        "On miss: query MongoDB, warm the cache",
                        "Increment click counter atomically",
                        "Queue analytics event via BullMQ (async)",
                        "Return 302 with Location header — done",
                        "Worker processes IP, UA, referrer, GeoIP in background",
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-neutral-500 font-light"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-[#76B900] flex-shrink-0 mt-0.5" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <SubLabel>Data captured per click</SubLabel>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        "IP address",
                        "User-Agent",
                        "Referrer",
                        "Country",
                        "City",
                        "Device type",
                        "Browser",
                        "OS",
                        "Language",
                        "Timestamp",
                      ].map((d) => (
                        <div
                          key={d}
                          className="text-[10px] uppercase tracking-[0.1em] text-neutral-600 border border-neutral-900 px-3 py-2 bg-[#0A0C10]"
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <SubLabel>Example response headers</SubLabel>
                  <CodeBlock
                    language="bash"
                    code={`curl -I https://api.bitlk.in/r/abc123

HTTP/1.1 302 Found
Location: https://example.com
Cache-Control: no-cache, no-store, must-revalidate
X-Redirect-Time: 23ms
X-Analytics-Queued: true`}
                  />
                </div>
              </EndpointCard>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              RATE LIMITS
          ══════════════════════════════════════════ */}
          <section id="rate-limits" className="scroll-mt-28">
            <div className="px-8 sm:px-12 lg:px-16 py-14 border-b border-neutral-900">
              <div className="mb-12">
                <p className="text-[#76B900] text-xs uppercase tracking-[0.3em] mb-6">
                  05 — Rate Limits
                </p>
                <h2 className="text-4xl sm:text-5xl font-thin mb-4 tracking-tight">
                  Fair limits.
                  <br />
                  Clear signals.
                </h2>
                <div className="flex items-baseline gap-4 mb-4">
                  <div className="h-px w-16 bg-[#76B900]"></div>
                  <p className="text-neutral-600 text-xs uppercase tracking-widest">
                    Per user + per IP
                  </p>
                </div>
                <p className="text-neutral-500 text-sm font-light max-w-xl leading-relaxed">
                  Limits are enforced per-user and per-IP. When you hit a limit,
                  we return 429 with a{" "}
                  <code className="text-neutral-400 font-mono text-xs">
                    Retry-After
                  </code>{" "}
                  header so you know exactly when to try again.
                </p>
              </div>

              {/* Tier grid — matches landing pricing aesthetic */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-neutral-900 mb-10">
                {[
                  {
                    tier: "Guest",
                    limit: "1",
                    unit: "per session",
                    note: "No account needed",
                    color: "text-neutral-400",
                  },
                  {
                    tier: "Free",
                    limit: "50",
                    unit: "links/day",
                    note: "Authenticated",
                    color: "text-blue-400",
                  },
                  {
                    tier: "Pro",
                    limit: "∞",
                    unit: "unlimited",
                    note: "$9 / month",
                    color: "text-[#76B900]",
                  },
                  {
                    tier: "Enterprise",
                    limit: "∞",
                    unit: "custom",
                    note: "SLA included",
                    color: "text-purple-400",
                  },
                ].map(({ tier, limit, unit, note, color }) => (
                  <div key={tier} className="bg-[#0B0D10] p-5 sm:p-7">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-700 mb-3">
                      {tier}
                    </p>
                    <p
                      className={`text-4xl sm:text-5xl font-thin ${color} mb-2 tracking-tight`}
                    >
                      {limit}
                    </p>
                    <p className="text-xs text-neutral-600 uppercase tracking-wider mb-1">
                      {unit}
                    </p>
                    <p className="text-[10px] text-neutral-700">{note}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-neutral-900 mb-6">
                <div className="bg-[#0B0D10] p-6 sm:p-8">
                  <div className="border-l-2 border-[#76B900] pl-4 mb-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 mb-1">
                      Response headers
                    </p>
                    <p className="text-base font-light text-white">
                      Know your remaining quota
                    </p>
                  </div>
                  <CodeBlock
                    language="text"
                    code={`X-RateLimit-Limit: 50
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1640995200
Retry-After: 3600`}
                  />
                </div>
                <div className="bg-[#0B0D10] p-6 sm:p-8">
                  <div className="border-l-2 border-neutral-800 pl-4 mb-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 mb-1">
                      CORS origins
                    </p>
                    <p className="text-base font-light text-white">
                      Allowed in production
                    </p>
                  </div>
                  <div className="space-y-3 font-mono text-sm">
                    {[
                      "https://bitlk.in",
                      "https://www.bitlk.in",
                      "www.bitlk.in",
                    ].map((o) => (
                      <p
                        key={o}
                        className="text-neutral-400 border-b border-neutral-900/50 pb-2"
                      >
                        {o}
                      </p>
                    ))}
                    <p className="text-neutral-700">
                      http://localhost:5173{" "}
                      <span className="font-sans text-[10px] text-neutral-800">
                        (dev only)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-neutral-400 font-light">
                  On a 429, wait for the{" "}
                  <code className="text-amber-400 font-mono text-xs">
                    Retry-After
                  </code>{" "}
                  value in seconds. Use exponential backoff — don't hammer the
                  API.
                </p>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              ERRORS
          ══════════════════════════════════════════ */}
          <section id="errors" className="scroll-mt-28">
            <div className="px-8 sm:px-12 lg:px-16 py-14 border-b border-neutral-900">
              <div className="mb-12">
                <p className="text-[#76B900] text-xs uppercase tracking-[0.3em] mb-6">
                  06 — Error Codes
                </p>
                <h2 className="text-4xl sm:text-5xl font-thin mb-4 tracking-tight">
                  Predictable errors.
                  <br />
                  Easy to handle.
                </h2>
                <div className="flex items-baseline gap-4 mb-4">
                  <div className="h-px w-16 bg-[#76B900]"></div>
                  <p className="text-neutral-600 text-xs uppercase tracking-widest">
                    Standard HTTP codes
                  </p>
                </div>
                <p className="text-neutral-500 text-sm font-light max-w-xl leading-relaxed">
                  Every error response includes an{" "}
                  <code className="text-neutral-400 font-mono text-xs">
                    error
                  </code>{" "}
                  field with a plain-English message. Use HTTP status codes for
                  programmatic handling.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-px bg-neutral-900 mb-10">
                {/* Status code table */}
                <div className="bg-[#0B0D10]">
                  <div className="px-6 py-4 border-b border-neutral-900">
                    <SubLabel>HTTP status codes</SubLabel>
                  </div>
                  {[
                    {
                      code: "200",
                      label: "OK",
                      color: "text-[#76B900]",
                      desc: "Request succeeded",
                    },
                    {
                      code: "201",
                      label: "Created",
                      color: "text-[#76B900]",
                      desc: "Resource created",
                    },
                    {
                      code: "204",
                      label: "No Content",
                      color: "text-[#76B900]",
                      desc: "Deleted — no body",
                    },
                    {
                      code: "400",
                      label: "Bad Request",
                      color: "text-amber-400",
                      desc: "Invalid input or validation error",
                    },
                    {
                      code: "401",
                      label: "Unauthorized",
                      color: "text-amber-400",
                      desc: "Missing or expired token",
                    },
                    {
                      code: "403",
                      label: "Forbidden",
                      color: "text-amber-400",
                      desc: "Guest limit reached, or not your resource",
                    },
                    {
                      code: "404",
                      label: "Not Found",
                      color: "text-amber-400",
                      desc: "Link doesn't exist or was deleted",
                    },
                    {
                      code: "409",
                      label: "Conflict",
                      color: "text-amber-400",
                      desc: "Custom alias already taken",
                    },
                    {
                      code: "429",
                      label: "Too Many Requests",
                      color: "text-amber-400",
                      desc: "Rate limit hit — check Retry-After",
                    },
                    {
                      code: "500",
                      label: "Server Error",
                      color: "text-red-400",
                      desc: "Something broke on our end",
                    },
                    {
                      code: "503",
                      label: "Unavailable",
                      color: "text-red-400",
                      desc: "Maintenance or overload",
                    },
                  ].map(({ code, label, color, desc }, i, arr) => (
                    <div
                      key={code}
                      className={`flex items-center gap-5 px-6 py-3.5 ${i < arr.length - 1 ? "border-b border-neutral-900/60" : ""} hover:bg-[#0D0F13]/40 transition-colors`}
                    >
                      <code
                        className={`text-sm font-mono w-10 flex-shrink-0 ${color}`}
                      >
                        {code}
                      </code>
                      <span className="text-sm text-neutral-400 w-32 flex-shrink-0 font-light">
                        {label}
                      </span>
                      <span className="text-sm text-neutral-600 font-light">
                        {desc}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Error shapes + JS example */}
                <div className="bg-[#0B0D10] p-6 sm:p-8 flex flex-col gap-8">
                  <div>
                    <SubLabel>What an error looks like</SubLabel>
                    <div className="space-y-3">
                      <CodeBlock
                        language="json"
                        code={`{ "error": "Please enter a valid URL." }`}
                      />
                      <CodeBlock
                        language="json"
                        code={`{
  "error": "You've used your free link. Sign in to create more.",
  "requiresAuth": true
}`}
                      />
                      <CodeBlock
                        language="json"
                        code={`{
  "error": "That alias is already taken. Try a different one."
}`}
                      />
                    </div>
                  </div>
                  <div>
                    <SubLabel>Handling errors in JS</SubLabel>
                    <CodeBlock
                      language="javascript"
                      code={`try {
  const res = await fetch('/api/links', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${token}\` },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const { error } = await res.json();
    if (res.status === 401) return redirectToLogin();
    if (res.status === 429) {
      const wait = res.headers.get('Retry-After');
      await delay(wait * 1000);
      return retry();
    }
    throw new Error(error);
  }

  return await res.json();
} catch (err) {
  console.error('Network error:', err);
}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              FOOTER SUPPORT STRIP
          ══════════════════════════════════════════ */}
          <section className="px-8 sm:px-12 lg:px-16 py-14">
            <div className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-thin mb-4 tracking-tight">
                Everything you need
                <br />
                <span className="text-[#76B900]">in one place.</span>
              </h2>
              <div className="flex items-baseline gap-4">
                <div className="h-px w-16 bg-[#76B900]"></div>
                <p className="text-neutral-600 text-xs uppercase tracking-widest">
                  Resources
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-px bg-neutral-900 mb-14">
              {[
                {
                  icon: <Terminal className="w-5 h-5" />,
                  title: "Base API",
                  body: "All endpoints live here. Use this as your base URL for every request.",
                  link: "https://api.bitlk.in",
                  linkLabel: "api.bitlk.in",
                },
                {
                  icon: <Link2 className="w-5 h-5" />,
                  title: "BitLink",
                  body: "The main product — create links, view analytics, manage your account.",
                  link: "https://bitlk.in",
                  linkLabel: "bitlk.in",
                },
                {
                  icon: <Github className="w-5 h-5" />,
                  title: "GitHub",
                  body: "Full source code, open for contributions. Star it if you feel it's useful.",
                  link: "https://github.com/YHQZ1/BitLink",
                  linkLabel: "github.com/YHQZ1/BitLink",
                },
              ].map((item) => (
                <div key={item.title} className="bg-[#0B0D10] p-7">
                  <div className="text-[#76B900] mb-4">{item.icon}</div>
                  <h3 className="text-base font-light text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 font-light leading-relaxed mb-5">
                    {item.body}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#76B900] hover:underline font-mono flex items-center gap-1.5"
                  >
                    {item.linkLabel} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-700 pt-8 border-t border-neutral-900">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="BitLink"
                  className="w-6 h-6 opacity-50"
                />
                <span>© {new Date().getFullYear()} BitLink</span>
                <span className="w-1 h-1 bg-neutral-800"></span>
                <span>v1.0.0</span>
              </div>
              <span className="text-neutral-800 text-xs">
                Built for speed. Designed for scale.
              </span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
