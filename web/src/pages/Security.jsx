import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Lock,
  Key,
  Database,
  Server,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Mail,
} from "lucide-react";

export default function Security() {
  const navigate = useNavigate();

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] overflow-x-hidden">
      {/* Nav */}
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
            Security
          </span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-4 sm:px-8 lg:px-16 border-b border-neutral-900">
        <div className="grid lg:grid-cols-[1.1fr_1px_0.9fr] items-stretch gap-0">
          <div className="lg:pr-20 pb-12 lg:pb-0">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-6">
              Security
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-thin leading-[0.9] tracking-tight mb-8">
              Built secure
              <br />
              <span className="text-[#76B900]">by default.</span>
            </h1>
            <p className="text-neutral-500 font-light leading-relaxed text-sm sm:text-base max-w-lg mb-10">
              Security at BitLink isn't a feature added after the fact — it's
              how the system is designed. From authentication to infrastructure,
              every layer is built with the assumption that threats are real.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "architecture", label: "Architecture" },
                { id: "auth", label: "Auth & tokens" },
                { id: "ratelimiting", label: "Rate limiting" },
                { id: "encryption", label: "Encryption" },
                { id: "cors", label: "CORS & API" },
                { id: "monitoring", label: "Monitoring" },
                { id: "users", label: "For users" },
                { id: "disclosure", label: "Disclosure" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="text-xs text-neutral-600 hover:text-[#76B900] transition-colors uppercase tracking-wider border border-neutral-900 hover:border-neutral-700 px-3 py-1.5"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block w-px bg-neutral-800" />

          <div className="lg:pl-20 flex flex-col justify-between gap-10 pt-2">
            {/* security signal box */}
            <div className="border border-neutral-800 bg-[#0D0F13] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <Shield className="w-4 h-4 text-[#76B900]" />
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Security signals
                </span>
              </div>
              <div className="space-y-3">
                {[
                  "TLS 1.3 on all connections — no unencrypted traffic accepted",
                  "Passwords hashed with bcrypt — we cannot read yours",
                  "JWT tokens expire after 7 days and are cryptographically signed",
                  "All routes enforce per-user authorization, no exceptions",
                  "CORS locked to whitelisted origins only",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#76B900] flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-neutral-400 font-light">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { num: "TLS 1.3", label: "In transit" },
                { num: "AES-256", label: "At rest" },
                { num: "7 days", label: "Token expiry" },
              ].map((s, i) => (
                <div key={i} className="border-t border-neutral-800 pt-4">
                  <div className="text-lg sm:text-xl font-thin text-[#76B900] mb-1 tracking-tight">
                    {s.num}
                  </div>
                  <div className="text-xs text-neutral-600 uppercase tracking-wider leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 01 Architecture ── */}
      <section
        id="architecture"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900 bg-[#0D0F13]/40"
      >
        <div className="mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
            01
          </p>
          <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-3">
            Security architecture
          </h2>
          <p className="text-neutral-600 text-sm font-light max-w-xl">
            A layered approach — each component independently secured so that a
            weakness in one layer doesn't cascade into the rest.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-900">
          {[
            {
              icon: <Lock className="w-5 h-5" />,
              title: "Authentication",
              accent: true,
              items: [
                "JWT stateless auth",
                "7-day token expiration",
                "Cryptographically signed tokens",
                "OAuth 2.0 via GitHub & Google",
              ],
            },
            {
              icon: <Key className="w-5 h-5" />,
              title: "Password security",
              accent: false,
              items: [
                "bcrypt hashing with salt rounds",
                "Zero plaintext storage",
                "Secure reset flow",
                "Minimum complexity enforced",
              ],
            },
            {
              icon: <Database className="w-5 h-5" />,
              title: "Data protection",
              accent: false,
              items: [
                "TLS for all data in transit",
                "MongoDB Atlas AES-256 at rest",
                "Automated backups",
                "Strict per-user access controls",
              ],
            },
            {
              icon: <Server className="w-5 h-5" />,
              title: "Infrastructure",
              accent: false,
              items: [
                "Stateless backend instances",
                "DDoS-resistant hosting",
                "Isolated environments",
                "Dependency updates tracked",
              ],
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#0B0D10] p-6 sm:p-8">
              <div className={`text-[#76B900] mb-5`}>{item.icon}</div>
              <div
                className={`w-8 h-0.5 mb-5 ${item.accent ? "bg-[#76B900]" : "bg-neutral-800"}`}
              />
              <h3 className="text-base font-medium text-white mb-4">
                {item.title}
              </h3>
              <ul className="space-y-2">
                {item.items.map((li, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2.5 text-xs text-neutral-500 font-light"
                  >
                    <span className="w-1 h-1 bg-neutral-700 rounded-full flex-shrink-0 mt-1.5" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── 02 Auth & Tokens ── */}
      <section
        id="auth"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900"
      >
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              02
            </p>
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-4">
              Auth &<br />
              tokens
            </h2>
            <p className="text-neutral-600 text-sm font-light leading-relaxed">
              Authentication is stateless by design. Every request proves its
              own validity — no sessions, no server-side state.
            </p>
          </div>
          <div className="space-y-8">
            {/* JWT deep dive */}
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-0.5 h-5 bg-[#76B900]" />
                  <h3 className="text-base font-medium text-white">
                    JWT implementation
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 font-light leading-relaxed mb-5">
                  Tokens are signed with a secret key, include your user ID and
                  expiry, and are verified on every single request. A 7-day
                  expiry ensures stale tokens can't be reused indefinitely.
                </p>
                <div className="bg-[#0D0F13] border border-neutral-800 p-5">
                  <p className="text-xs uppercase tracking-wider text-neutral-600 mb-4">
                    Token structure
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        part: "Header",
                        desc: "Algorithm (HS256) + token type",
                      },
                      {
                        part: "Payload",
                        desc: "User ID + expiration timestamp",
                      },
                      { part: "Signature", desc: "HMAC-SHA256 verification" },
                    ].map((t, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-xs font-medium text-[#76B900] w-20 flex-shrink-0">
                          {t.part}
                        </span>
                        <span className="text-xs text-neutral-500 font-light">
                          {t.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-0.5 h-5 bg-neutral-700" />
                  <h3 className="text-base font-medium text-white">
                    OAuth 2.0
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 font-light leading-relaxed mb-5">
                  GitHub and Google OAuth tokens are never exposed client-side.
                  We only request email and basic profile — nothing more.
                  Accounts are unified by email, so you can switch providers
                  without losing your data.
                </p>
                <div className="border-l-2 border-[#76B900] pl-4 py-1">
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    OAuth providers handle their own password security. BitLink
                    never sees or stores your GitHub or Google password — ever.
                  </p>
                </div>
              </div>
            </div>

            {/* Authorization */}
            <div className="border border-neutral-800 bg-[#0D0F13] p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-4 h-4 text-[#76B900]" />
                <h3 className="text-sm font-medium text-white">
                  Authorization controls
                </h3>
              </div>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                Every protected endpoint verifies that the requesting user owns
                the resource being accessed. There is no way to access another
                user's links, analytics, or account data — not by accident, not
                by design. Authorization is enforced at the route level, not
                assumed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 Rate limiting ── */}
      <section
        id="ratelimiting"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900 bg-[#0D0F13]/40"
      >
        <div className="mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
            03
          </p>
          <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-3">
            Rate limiting & abuse prevention
          </h2>
          <p className="text-neutral-600 text-sm font-light max-w-xl">
            Limits aren't just about fairness — they're a first line of defence
            against automated attacks, scrapers, and bad-faith usage.
          </p>
        </div>
        <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-0 items-start">
          {/* Tier limits */}
          <div className="lg:pr-16 pb-10 lg:pb-0">
            <p className="text-xs uppercase tracking-wider text-neutral-600 mb-6">
              API limits by tier
            </p>
            <div className="divide-y divide-neutral-900">
              {[
                {
                  tier: "Guest",
                  limit: "1 link per session",
                  note: "Session-scoped, no account needed",
                },
                {
                  tier: "Free",
                  limit: "50 links / day",
                  note: "Resets at midnight UTC",
                },
                {
                  tier: "Pro",
                  limit: "Unlimited links",
                  note: "Fair use policy applies",
                },
                {
                  tier: "Enterprise",
                  limit: "Custom limits",
                  note: "Negotiated per contract",
                },
              ].map((item, i) => (
                <div key={i} className="py-5 grid grid-cols-[100px_1fr] gap-6">
                  <span className="text-sm font-medium text-white">
                    {item.tier}
                  </span>
                  <div>
                    <p className="text-sm text-neutral-300 font-light mb-0.5">
                      {item.limit}
                    </p>
                    <p className="text-xs text-neutral-600">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block w-px bg-neutral-900 self-stretch" />

          {/* Other protections */}
          <div className="lg:pl-16 space-y-5 pt-2">
            {[
              {
                title: "Redirect layer protection",
                body: "The redirect endpoint is rate-limited separately from the creation API. Suspicious click patterns — like rapid-fire requests from a single IP — trigger automatic throttling before they become a problem.",
              },
              {
                title: "Link validation",
                body: "Every URL submitted to BitLink is validated to confirm it follows HTTP/HTTPS protocols. Common malicious patterns and known suspicious domains are checked before a link is created.",
              },
              {
                title: "CORS enforcement",
                body: "Only whitelisted origins can make requests to our API. Unrecognised origins are blocked outright — there's no way to call our API from an unauthorised domain.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-0.5 bg-[#76B900] flex-shrink-0 self-stretch" />
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 font-light leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 Encryption ── */}
      <section
        id="encryption"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900"
      >
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              04
            </p>
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-4">
              Data
              <br />
              encryption
            </h2>
            <p className="text-neutral-600 text-sm font-light leading-relaxed">
              Data is protected whether it's moving between systems, sitting in
              the database, or briefly held in memory.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-neutral-900">
            {[
              {
                label: "In transit",
                standard: "TLS 1.3",
                body: "Every byte of data between your browser and our servers is encrypted. Unencrypted HTTP connections are not accepted — they're redirected or rejected.",
                accent: true,
              },
              {
                label: "At rest",
                standard: "AES-256",
                body: "Our database (MongoDB Atlas) encrypts all stored data with AES-256. Passwords are hashed with bcrypt on top of that — they're unreadable at every layer.",
                accent: false,
              },
              {
                label: "In memory",
                standard: "Env vars",
                body: "JWT secrets and API keys live in environment variables — never hardcoded, never committed. Sensitive in-memory data is handled with automatic cleanup.",
                accent: false,
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#0B0D10] p-6 sm:p-8">
                <div className="mb-5 pb-4 border-b border-neutral-900 flex items-baseline justify-between">
                  <h3 className="text-sm font-medium text-white">
                    {item.label}
                  </h3>
                  <span
                    className={`text-xs uppercase tracking-wider ${item.accent ? "text-[#76B900]" : "text-neutral-600"}`}
                  >
                    {item.standard}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 CORS + 06 Monitoring side by side ── */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900 bg-[#0D0F13]/40">
        <div className="grid lg:grid-cols-2 gap-px bg-neutral-900">
          <div id="cors" className="bg-[#0B0D10] p-6 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              05
            </p>
            <h2 className="text-2xl sm:text-3xl font-thin tracking-tight mb-8">
              CORS & API security
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: "Origin whitelisting",
                  body: "Only pre-approved domains can make requests to our API. Any unrecognised origin is blocked before it reaches application logic.",
                },
                {
                  title: "Credential handling",
                  body: "Credentials are only accepted from trusted origins. There are no wildcard permissions — every domain is explicitly reviewed.",
                },
                {
                  title: "Request validation",
                  body: "Every API request is validated for correct structure, data types, and required fields. Malformed requests are rejected immediately — never processed.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-0.5 bg-[#76B900] flex-shrink-0 self-stretch" />
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-500 font-light leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="monitoring" className="bg-[#0B0D10] p-6 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              06
            </p>
            <h2 className="text-2xl sm:text-3xl font-thin tracking-tight mb-8">
              Monitoring & incident response
            </h2>
            <div className="divide-y divide-neutral-900">
              {[
                {
                  title: "Continuous monitoring",
                  body: "Systems are monitored for suspicious activity, repeated failed auth attempts, and unusual traffic patterns. Alerts fire before issues escalate.",
                },
                {
                  title: "Security logging",
                  body: "All API requests, authentication attempts, and system events are logged securely and reviewed regularly. Logs are retained for forensic analysis if needed.",
                },
                {
                  title: "Incident response",
                  body: "We maintain protocols for immediate response, investigation, and remediation. If your data is ever affected, you'll hear from us directly — not through a press release.",
                },
              ].map((item, i) => (
                <div key={i} className="py-5">
                  <h3 className="text-sm font-medium text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 font-light leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 Best practices for users ── */}
      <section
        id="users"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900"
      >
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              07
            </p>
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-4">
              Best practices
              <br />
              for you
            </h2>
            <p className="text-neutral-600 text-sm font-light leading-relaxed">
              We handle platform security. Here's what you can do to protect
              your own account.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-px bg-neutral-900">
            {[
              {
                title: "Use a strong password",
                body: "A unique password — not reused from another site — is your first line of defence. A password manager makes this effortless.",
              },
              {
                title: "Keep tokens private",
                body: "Never share authentication tokens or API keys. If you suspect they've been compromised, change your password immediately and contact us.",
              },
              {
                title: "Audit your links regularly",
                body: "Periodically review your active links. Delete anything outdated or no longer needed. Fewer active links means a smaller attack surface.",
              },
              {
                title: "Watch your analytics",
                body: "Unusual spikes in clicks or traffic from unexpected locations can signal misuse. Your dashboard is a useful early-warning system.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#0B0D10] p-6 sm:p-8">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#76B900] flex-shrink-0 mt-0.5" />
                  <h3 className="text-sm font-medium text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 font-light leading-relaxed pl-7">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 08 Compliance ── full width strip */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900 bg-[#0D0F13]/40">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
            08
          </p>
          <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-3">
            Compliance & standards
          </h2>
          <p className="text-neutral-600 text-sm font-light max-w-xl">
            We follow established security standards — not because we have to,
            but because they represent the right way to build software.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-900">
          {[
            {
              title: "OWASP Top 10",
              body: "We develop against the OWASP Top 10 vulnerability checklist — injection, broken auth, misconfiguration, and more.",
            },
            {
              title: "OAuth 2.0 spec",
              body: "Our OAuth integration follows the full specification — correct scopes, proper token handling, no shortcuts.",
            },
            {
              title: "JWT best practices",
              body: "Short-lived tokens, HMAC signatures, no sensitive payload data. Exactly how JWTs are supposed to be used.",
            },
            {
              title: "GDPR-aligned",
              body: "User data export, right to deletion, and transparent policies. Your rights are enforced, not just listed.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#0B0D10] p-6 sm:p-8">
              <div className="w-6 h-px bg-[#76B900] mb-5" />
              <h3 className="text-sm font-medium text-white mb-3">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 09 Responsible Disclosure ── */}
      <section id="disclosure" className="px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-6">
              09
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-thin tracking-tight leading-[0.95] mb-6">
              Found a<br />
              <span className="text-[#76B900]">vulnerability?</span>
            </h2>
            <p className="text-neutral-500 font-light leading-relaxed text-sm sm:text-base max-w-md mb-8">
              We take every security report seriously. If you've found something
              — however small it seems — please tell us before disclosing it
              publicly. We'll acknowledge you within 48 hours and keep you
              updated through resolution.
            </p>

            <div className="border border-orange-400/20 bg-orange-400/5 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-orange-400 mb-3">
                    Responsible disclosure guidelines
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Don't exploit the vulnerability beyond confirming it exists",
                      "Don't publicly disclose before we've had a chance to fix it",
                      "Give us reasonable time to investigate — we'll be transparent about timelines",
                      "We commit to keeping you in the loop through resolution",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs text-neutral-400 font-light"
                      >
                        <span className="w-1 h-1 bg-orange-400/60 rounded-full flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-neutral-800 bg-[#0D0F13] p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-4 h-4 text-[#76B900]" />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Security contact
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-thin text-white mb-2">
              rupareluttkarsh2309@gmail.com
            </p>
            <p className="text-neutral-600 text-xs font-light mb-8">
              We acknowledge all security reports within 48 hours. Please
              include as much detail as possible — steps to reproduce, affected
              endpoints, and the potential impact you see.
            </p>
            <a
              href="https://mail.google.com/mail/?view=cm&to=rupareluttkarsh2309@gmail.com"
              className="inline-flex items-center gap-2 border-2 border-[#76B900] text-[#76B900] hover:bg-[#76B900] hover:text-black px-6 py-3 text-xs uppercase tracking-widest font-medium transition-all"
            >
              Report a vulnerability
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
