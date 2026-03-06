import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Eye,
  Database,
  Lock,
  Mail,
  CheckCircle2,
} from "lucide-react";

export default function Privacy() {
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
            Privacy Policy
          </span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-4 sm:px-8 lg:px-16 border-b border-neutral-900">
        <div className="grid lg:grid-cols-[1.1fr_1px_0.9fr] items-stretch gap-0">
          <div className="lg:pr-20 pb-12 lg:pb-0">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-6">
              Privacy
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-thin leading-[0.9] tracking-tight mb-8">
              Your data,
              <br />
              <span className="text-[#76B900]">your business.</span>
            </h1>
            <p className="text-neutral-500 font-light leading-relaxed text-sm sm:text-base max-w-lg mb-10">
              We built BitLink to be a tool, not a data pipeline. This policy is
              written to be read — not buried. Here's exactly what we collect,
              why, and what we never do with it.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "collect", label: "What we collect" },
                { id: "use", label: "How we use it" },
                { id: "security", label: "Security" },
                { id: "retention", label: "Data retention" },
                { id: "rights", label: "Your rights" },
                { id: "third-party", label: "Third parties" },
                { id: "cookies", label: "Cookies" },
                { id: "contact", label: "Contact" },
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
            {/* our commitment box */}
            <div className="border border-neutral-800 bg-[#0D0F13] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <Shield className="w-4 h-4 text-[#76B900]" />
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Our commitment
                </span>
              </div>
              <div className="space-y-3">
                {[
                  "We never sell your personal data to third parties",
                  "We never use your links for advertising targeting",
                  "Analytics data belongs to you, not us",
                  "You can delete your account and data at any time",
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
                { num: "0", label: "Ad networks" },
                { num: "0", label: "Data brokers" },
                { num: "100%", label: "Your ownership" },
              ].map((s, i) => (
                <div key={i} className="border-t border-neutral-800 pt-4">
                  <div className="text-2xl sm:text-3xl font-thin text-[#76B900] mb-1">
                    {s.num}
                  </div>
                  <div className="text-xs text-neutral-600 uppercase tracking-wider leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-neutral-700 uppercase tracking-wider">
              Last updated: December 31, 2025
            </p>
          </div>
        </div>
      </section>

      {/* ── 01 What we collect ── */}
      <section
        id="collect"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900"
      >
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              01
            </p>
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-4">
              What we
              <br />
              collect
            </h2>
            <p className="text-neutral-600 text-sm font-light leading-relaxed">
              Only what's genuinely needed to run the service. Nothing more.
            </p>
          </div>

          <div className="space-y-0 divide-y divide-neutral-900">
            {[
              {
                icon: <Lock className="w-4 h-4 text-[#76B900]" />,
                title: "Account information",
                sub: "When you sign up",
                items: [
                  "Email address — to identify your account",
                  "Password, hashed with bcrypt — we never store it in plain text",
                  "OAuth profile info (name, email) if you sign in via Google or GitHub",
                  "Account creation date",
                ],
              },
              {
                icon: <Database className="w-4 h-4 text-[#76B900]" />,
                title: "Link data",
                sub: "When you create a short link",
                items: [
                  "The original URL you're shortening",
                  "Your custom alias, if you set one",
                  "The generated short code",
                  "Creation and modification timestamps",
                  "Expiration date, if you set one",
                ],
              },
              {
                icon: <Eye className="w-4 h-4 text-[#76B900]" />,
                title: "Analytics data",
                sub: "When someone clicks your link",
                items: [
                  "IP address — used only to derive approximate location, then discarded",
                  "User agent — to detect device type, browser, and OS",
                  "Referrer URL — to show where your traffic comes from",
                  "Click timestamp",
                  "Country and city, resolved from IP via geoip-lite",
                ],
                note: "This data powers your analytics dashboard. It is never used for advertising and is never sold.",
              },
              {
                icon: <Shield className="w-4 h-4 text-neutral-600]" />,
                title: "Guest session data",
                sub: "If you use BitLink without an account",
                items: [
                  "A randomly generated session ID, stored in your browser's localStorage",
                  "Guest users can create 1 link per session",
                  "Your guest links can be migrated to a full account if you sign up later",
                ],
              },
            ].map((block, i) => (
              <div
                key={i}
                className="py-8 grid sm:grid-cols-[220px_1fr] gap-6 sm:gap-10"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    {block.icon}
                    <h3 className="text-sm font-medium text-white">
                      {block.title}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider">
                    {block.sub}
                  </p>
                </div>
                <div>
                  <ul className="space-y-2 mb-3">
                    {block.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-neutral-500 font-light"
                      >
                        <span className="w-1.5 h-1.5 bg-[#76B900] rounded-full flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {block.note && (
                    <p className="text-xs text-neutral-600 font-light leading-relaxed border-l-2 border-neutral-800 pl-3 mt-4">
                      {block.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 How we use it ── */}
      <section
        id="use"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900 bg-[#0D0F13]/40"
      >
        <div className="mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
            02
          </p>
          <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-3">
            How we use your information
          </h2>
          <p className="text-neutral-600 text-sm font-light max-w-xl">
            Every piece of data we collect has a specific, limited purpose. We
            don't profile you, we don't retarget you, and we don't make
            inferences beyond what's needed to run BitLink.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-900">
          {[
            {
              title: "Service delivery",
              body: "Your email and account details let us provide link shortening, QR generation, and analytics. Without them, the service doesn't work.",
              accent: true,
            },
            {
              title: "Authentication",
              body: "We use your credentials to verify it's you. OAuth tokens confirm your identity with GitHub or Google — we never store those tokens beyond what's needed.",
              accent: false,
            },
            {
              title: "Your analytics",
              body: "Click data is processed solely to populate your dashboard with insights — traffic sources, devices, geography. It's your data, shown to you.",
              accent: false,
            },
            {
              title: "Abuse prevention",
              body: "We monitor usage patterns to enforce rate limits, catch malicious links, and keep the platform safe for everyone.",
              accent: false,
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#0B0D10] p-6 sm:p-8">
              <div
                className={`w-8 h-0.5 mb-5 ${item.accent ? "bg-[#76B900]" : "bg-neutral-800"}`}
              />
              <h3 className="text-base font-medium text-white mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03 Security ── */}
      <section
        id="security"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900"
      >
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              03
            </p>
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-4">
              Data security
            </h2>
            <p className="text-neutral-600 text-sm font-light leading-relaxed">
              Security isn't a checkbox for us. It's designed in from the start
              — not bolted on.
            </p>
          </div>
          <div>
            <div className="grid sm:grid-cols-2 gap-px bg-neutral-900 mb-8">
              {[
                {
                  title: "TLS encryption",
                  body: "All data in transit between your browser and our servers is encrypted. Unencrypted connections are not accepted.",
                },
                {
                  title: "bcrypt password hashing",
                  body: "We never store your password in plain text. bcrypt with strong salting means even we can't read it.",
                },
                {
                  title: "Signed JWT tokens",
                  body: "Authentication tokens are cryptographically signed, verified on every request, and expire after 7 days.",
                },
                {
                  title: "Strict access controls",
                  body: "Every protected route enforces authorization. You can only access your own links, analytics, and account data — no exceptions.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-[#0B0D10] p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-0.5 self-stretch bg-[#76B900] flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-500 font-light leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border border-neutral-800 bg-[#0D0F13] p-5 sm:p-6">
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                <span className="text-white font-medium">Important:</span> No
                system is 100% secure. If you ever suspect your account has been
                compromised, change your password immediately and contact us at{" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&to=rupareluttkarsh2309@gmail.com"
                  className="text-[#76B900] hover:text-[#8FD400]"
                >
                  rupareluttkarsh2309@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 Retention + 05 Rights side by side ── */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900 bg-[#0D0F13]/40">
        <div className="grid lg:grid-cols-2 gap-px bg-neutral-900">
          <div id="retention" className="bg-[#0B0D10] p-6 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              04
            </p>
            <h2 className="text-2xl sm:text-3xl font-thin tracking-tight mb-8">
              Data retention
            </h2>
            <div className="divide-y divide-neutral-900">
              {[
                {
                  label: "Account data",
                  body: "Kept for as long as your account is active. Delete your account and it's gone — no dark patterns, no waiting period.",
                },
                {
                  label: "Link data",
                  body: "Kept until you choose to delete it. Expired links are marked inactive in your dashboard but not wiped automatically.",
                },
                {
                  label: "Analytics data",
                  body: "Free accounts: 7-day rolling retention. Pro accounts: unlimited. You see what you pay for, nothing less.",
                },
                {
                  label: "Guest links",
                  body: "Not auto-deleted. You can clear them anytime by clearing your browser's localStorage, or migrating them to an account.",
                },
              ].map((item, i) => (
                <div key={i} className="py-5 grid grid-cols-[140px_1fr] gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-px self-stretch bg-[#76B900] flex-shrink-0" />
                    <span className="text-xs font-medium text-white leading-relaxed">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div id="rights" className="bg-[#0B0D10] p-6 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              05
            </p>
            <h2 className="text-2xl sm:text-3xl font-thin tracking-tight mb-4">
              Your rights
            </h2>
            <p className="text-neutral-600 text-sm font-light leading-relaxed mb-8">
              These aren't legal obligations we reluctantly honour. They're
              features we built because we believe you should be in control.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Access & export",
                  body: "View and export all your link data and analytics from your dashboard at any time.",
                },
                {
                  title: "Correction",
                  body: "Update your account info, modify link aliases, and manage your data freely.",
                },
                {
                  title: "Deletion",
                  body: "Request full account deletion via rupareluttkarsh2309@gmail.com. Everything associated with you gets permanently removed.",
                },
                {
                  title: "Opt-out",
                  body: "Use guest mode with no account required. You're never forced to hand over data to try the service.",
                },
              ].map((item, i) => (
                <div key={i} className="border border-neutral-800 p-4">
                  <h3 className="text-xs font-medium text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 Third parties ── */}
      <section
        id="third-party"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900"
      >
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              06
            </p>
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-4">
              Third-party
              <br />
              services
            </h2>
            <p className="text-neutral-600 text-sm font-light leading-relaxed">
              BitLink relies on a small number of trusted infrastructure
              providers. Here's who they are and what they see.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-neutral-900">
            {[
              {
                name: "GitHub & Google OAuth",
                role: "Authentication only",
                body: "We receive your name and email to create your account. We never access your repositories, private data, or anything beyond what you explicitly grant during login.",
                accent: false,
              },
              {
                name: "MongoDB Atlas",
                role: "Data storage",
                body: "Your account and link data is stored securely in MongoDB Atlas with encryption at rest. They host the data; they don't process or access it for their own purposes.",
                accent: false,
              },
              {
                name: "Vercel & Render",
                role: "Hosting",
                body: "Our frontend runs on Vercel, our backend on Render. These are infrastructure providers — they run our code, not our data practices.",
                accent: false,
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#0B0D10] p-6 sm:p-8">
                <div className="w-6 h-px bg-neutral-800 mb-5" />
                <h3 className="text-sm font-medium text-white mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-[#76B900] uppercase tracking-wider mb-4">
                  {item.role}
                </p>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 Cookies ── */}
      <section
        id="cookies"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900 bg-[#0D0F13]/40"
      >
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
            07
          </p>
          <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-3">
            Cookies & local tracking
          </h2>
          <p className="text-neutral-600 text-sm font-light max-w-xl">
            We use the bare minimum. No ad networks, no tracking pixels, no
            third-party scripts that follow you around the web.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-px bg-neutral-900">
          {[
            {
              label: "localStorage",
              status: "Used",
              statusColor: "text-[#76B900]",
              body: "We store your guest session ID and authentication JWT token in localStorage. This is purely functional — it's how you stay logged in.",
            },
            {
              label: "Third-party cookies",
              status: "None",
              statusColor: "text-neutral-500",
              body: "We do not use advertising cookies, retargeting pixels, or any third-party tracking scripts. Your browsing behaviour is not tracked across sites.",
            },
            {
              label: "Analytics services",
              status: "None",
              statusColor: "text-neutral-500",
              body: "No Google Analytics, no Mixpanel, no Hotjar. We don't send your usage data to external analytics platforms. BitLink's analytics are entirely self-contained.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#0B0D10] p-6 sm:p-8">
              <div className="mb-5 pb-4 border-b border-neutral-900 flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">{item.label}</h3>
                <span
                  className={`text-xs uppercase tracking-wider ${item.statusColor}`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 08 Children + Changes ── inline, compact */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900">
        <div className="grid sm:grid-cols-2 gap-px bg-neutral-900">
          <div className="bg-[#0B0D10] p-6 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              08
            </p>
            <h2 className="text-2xl sm:text-3xl font-thin tracking-tight mb-5">
              Children's privacy
            </h2>
            <p className="text-sm text-neutral-500 font-light leading-relaxed">
              BitLink is not intended for users under 13. We do not knowingly
              collect personal information from children. If you believe a child
              has created an account, please contact us at{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&to=rupareluttkarsh2309@gmail.com"
                className="text-[#76B900] hover:text-[#8FD400]"
              >
                rupareluttkarsh2309@gmail.com
              </a>{" "}
              and we will take immediate action.
            </p>
          </div>
          <div className="bg-[#0B0D10] p-6 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              09
            </p>
            <h2 className="text-2xl sm:text-3xl font-thin tracking-tight mb-5">
              Policy updates
            </h2>
            <p className="text-sm text-neutral-500 font-light leading-relaxed">
              We may update this policy as BitLink evolves. When something
              material changes, we'll update the date at the top and communicate
              it clearly. Continuing to use BitLink after updates means you
              accept the revised policy. We'll never bury important changes in
              fine print.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-6">
              10
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-thin tracking-tight leading-[0.95] mb-6">
              Privacy questions
              <br />
              <span className="text-[#76B900]">welcome.</span>
            </h2>
            <p className="text-neutral-500 font-light leading-relaxed text-sm sm:text-base max-w-md">
              If anything here is unclear, or you'd like to exercise any of your
              rights — access, correction, deletion — reach out directly. We
              respond personally, not with a template.
            </p>
          </div>
          <div className="border border-neutral-800 bg-[#0D0F13] p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-4 h-4 text-[#76B900]" />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Reach us directly
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-thin text-white mb-2">
              rupareluttkarsh2309@gmail.com
            </p>
            <p className="text-neutral-600 text-xs font-light mb-8">
              We typically respond within 24 hours on business days. No
              ticketing systems, no bots.
            </p>
            <a
              href="https://mail.google.com/mail/?view=cm&to=rupareluttkarsh2309@gmail.com"
              className="inline-flex items-center gap-2 border-2 border-[#76B900] text-[#76B900] hover:bg-[#76B900] hover:text-black px-6 py-3 text-xs uppercase tracking-widest font-medium transition-all"
            >
              Send us an email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
