import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Mail,
} from "lucide-react";

export default function Terms() {
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
            Terms of Service
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-8 lg:px-16 border-b border-neutral-900">
        <div className="grid lg:grid-cols-[1.1fr_1px_0.9fr] items-stretch gap-0">
          <div className="lg:pr-20 pb-12 lg:pb-0">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-6">
              Legal
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-thin leading-[0.9] tracking-tight mb-8">
              Terms of
              <br />
              <span className="text-[#76B900]">Service.</span>
            </h1>
            <p className="text-neutral-500 font-light leading-relaxed text-sm sm:text-base max-w-lg mb-10">
              Plain language where we can, legalese only where we must. These
              terms exist to protect both you and BitLink — nothing hidden,
              nothing surprising.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "acceptance", label: "Acceptance" },
                { id: "account", label: "Account" },
                { id: "acceptable-use", label: "Acceptable Use" },
                { id: "tiers", label: "Service Tiers" },
                { id: "links", label: "Link Ownership" },
                { id: "api", label: "API" },
                { id: "liability", label: "Liability" },
                { id: "termination", label: "Termination" },
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
            <div className="border border-neutral-800 bg-[#0D0F13] p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-6">
                <FileText className="w-4 h-4 text-[#76B900] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  By accessing or using BitLink, you agree to be bound by these
                  Terms. If you don't agree, please don't use the service.
                </p>
              </div>
              <div className="border-t border-neutral-800 pt-5 grid grid-cols-2 gap-6">
                {[
                  { label: "Last updated", value: "Dec 31, 2025" },
                  { label: "Effective", value: "Immediately" },
                  { label: "Jurisdiction", value: "Applicable Law" },
                  { label: "Contact", value: "rupareluttkarsh2309@gmail.com" },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-xs uppercase tracking-wider text-neutral-700 mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm text-neutral-400 font-light">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { num: "11", label: "Sections" },
                { num: "3", label: "Tiers covered" },
                { num: "0", label: "Hidden clauses" },
              ].map((s, i) => (
                <div key={i} className="border-t border-neutral-800 pt-4">
                  <div className="text-2xl sm:text-3xl font-thin text-[#76B900] mb-1">
                    {s.num}
                  </div>
                  <div className="text-xs text-neutral-600 uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 01 — Acceptance */}
      <section
        id="acceptance"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900"
      >
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              01
            </p>
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight">
              Acceptance
              <br />
              of Terms
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
            <div className="border-l-2 border-[#76B900] pl-5">
              <h3 className="text-sm font-medium text-white mb-3">
                How you agree
              </h3>
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                These Terms govern your access to BitLink's website, API, and
                all related services. By creating an account or simply using the
                service, you agree — no signature needed.
              </p>
            </div>
            <div className="border-l-2 border-neutral-800 pl-5">
              <h3 className="text-sm font-medium text-white mb-3">
                When things change
              </h3>
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                We may update these Terms from time to time. Material changes
                will be communicated clearly. Continuing to use BitLink after
                changes means you accept the updated Terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Account */}
      <section
        id="account"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900 bg-[#0D0F13]/40"
      >
        <div className="mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
            02
          </p>
          <h2 className="text-3xl sm:text-4xl font-thin tracking-tight">
            Account Registration
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-px bg-neutral-900">
          {[
            {
              title: "Eligibility",
              body: "You must be at least 13 years old to create a BitLink account. By registering, you confirm you meet this requirement.",
              accent: true,
            },
            {
              title: "Your responsibility",
              body: "You're responsible for everything that happens under your account. Keep your credentials safe — don't share them with anyone.",
              accent: false,
            },
            {
              title: "Accurate info",
              body: "Please provide real, accurate information at signup. Fake or misleading details violate these Terms and may result in suspension.",
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

      {/* 03 — Acceptable Use */}
      <section
        id="acceptable-use"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900"
      >
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              03
            </p>
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-6">
              Acceptable
              <br />
              Use
            </h2>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              BitLink is a tool for legitimate link management. Here's what that
              means in practice.
            </p>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="flex items-center gap-2.5 text-sm font-medium text-white mb-5 pb-3 border-b border-neutral-900">
                <CheckCircle2 className="w-4 h-4 text-[#76B900] flex-shrink-0" />
                You may use BitLink to
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Shorten legitimate URLs for personal or business use",
                  "Track analytics for your own links",
                  "Generate QR codes for shortened links",
                  "Create custom aliases for branded links",
                  "Integrate our API into your applications",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 border border-neutral-900 p-4"
                  >
                    <span className="w-1.5 h-1.5 bg-[#76B900] rounded-full flex-shrink-0 mt-1.5" />
                    <span className="text-xs text-neutral-400 font-light leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="flex items-center gap-2.5 text-sm font-medium text-white mb-5 pb-3 border-b border-neutral-900">
                <XCircle className="w-4 h-4 text-[#e05c5c] flex-shrink-0" />
                You may not use BitLink to
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  "Distribute malware or malicious code",
                  "Link to phishing or fraudulent content",
                  "Share illegal content or links",
                  "Spam or send unsolicited messages",
                  "Interfere with or disrupt the service",
                  "Impersonate others or misrepresent yourself",
                  "Scrape or harvest data without authorization",
                  "Circumvent rate limiting or security",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 border border-neutral-900 p-4"
                  >
                    <span className="w-1.5 h-1.5 bg-[#e05c5c] rounded-full flex-shrink-0 mt-1.5" />
                    <span className="text-xs text-neutral-400 font-light leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-orange-400/20 bg-orange-400/5 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-orange-400 mb-1.5">
                    Violation consequences
                  </h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Violations may result in immediate account suspension,
                    termination, link deletion, and legal action where
                    warranted. We take abuse seriously.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Service Tiers */}
      <section
        id="tiers"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900 bg-[#0D0F13]/40"
      >
        <div className="mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
            04
          </p>
          <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-3">
            Service Tiers & Limits
          </h2>
          <p className="text-neutral-600 text-sm font-light max-w-xl">
            BitLink is free to try. Here's exactly what each tier gets you.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-px bg-neutral-900">
          {[
            {
              name: "Guest",
              sub: "No account required",
              color: "text-neutral-500",
              highlight: false,
              items: [
                "1 link per session",
                "Basic analytics",
                "No API access",
                "Links migrate on signup",
              ],
            },
            {
              name: "Free",
              sub: "$0 / month",
              color: "text-neutral-400",
              highlight: false,
              items: [
                "50 links per day",
                "7-day analytics retention",
                "QR code generation",
                "Limited API access",
              ],
            },
            {
              name: "Pro",
              sub: "$9 / month",
              color: "text-[#76B900]",
              highlight: true,
              items: [
                "Unlimited links",
                "Unlimited retention",
                "Custom domains",
                "Full API access",
                "Priority support",
              ],
            },
          ].map((tier, i) => (
            <div
              key={i}
              className={`bg-[#0B0D10] p-6 sm:p-8 ${tier.highlight ? "ring-1 ring-inset ring-[#76B900]/20" : ""}`}
            >
              <div className="mb-6 pb-5 border-b border-neutral-900">
                <h3 className="text-xl font-light text-white mb-1">
                  {tier.name}
                </h3>
                <span className={`text-xs ${tier.color}`}>{tier.sub}</span>
              </div>
              <ul className="space-y-3">
                {tier.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-sm text-neutral-500 font-light"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${tier.highlight ? "bg-[#76B900]" : "bg-neutral-700"}`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — Link Ownership */}
      <section
        id="links"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900"
      >
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              05
            </p>
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight">
              Link Ownership
              <br />& Content
            </h2>
          </div>
          <div className="divide-y divide-neutral-900">
            {[
              {
                title: "Your content",
                body: "You retain all rights to the URLs you shorten and what they point to. You're solely responsible for the content your links lead to.",
              },
              {
                title: "Content moderation",
                body: "We reserve the right to review, disable, or delete links that violate these Terms or applicable laws. We don't pre-screen, but we do investigate reports.",
              },
              {
                title: "DMCA compliance",
                body: "We respond to valid DMCA takedown requests. If you believe a link infringes your copyright, reach out to rupareluttkarsh2309@gmail.com with the details.",
              },
              {
                title: "Link expiration",
                body: "You can set expiration dates for your links. Expired links redirect to a 404. We don't auto-delete expired links from your dashboard.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="grid sm:grid-cols-[200px_1fr] gap-4 sm:gap-12 py-7"
              >
                <div className="flex items-start gap-4">
                  <div className="w-px self-stretch bg-[#76B900] hidden sm:block flex-shrink-0" />
                  <span className="text-sm font-medium text-white">
                    {item.title}
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

      {/* 06 + 07 + 08 — API, Availability, IP side by side */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900 bg-[#0D0F13]/40">
        <div className="grid lg:grid-cols-2 gap-px bg-neutral-900">
          <div id="api" className="bg-[#0B0D10] p-6 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              06
            </p>
            <h2 className="text-2xl sm:text-3xl font-thin tracking-tight mb-8">
              API Usage
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: "Rate limits",
                  body: "API usage is subject to limits based on your plan. Exceeding them may result in throttling or temporary suspension.",
                },
                {
                  title: "Authentication",
                  body: "Use valid auth tokens for all API requests. Never share credentials or tokens with unauthorized parties.",
                },
                {
                  title: "Fair use",
                  body: "You may not use the API to build competing services or in ways that unreasonably burden our infrastructure.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-0.5 bg-[#76B900] flex-shrink-0 self-stretch" />
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0B0D10] divide-y divide-neutral-900">
            <div id="availability" className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
                07
              </p>
              <h2 className="text-2xl sm:text-3xl font-thin tracking-tight mb-6">
                Service Availability
              </h2>
              <p className="text-sm text-neutral-500 font-light leading-relaxed mb-6">
                We aim for reliability but can't guarantee 100% uptime. BitLink
                is provided "as is."
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    title: "Maintenance",
                    body: "Announced in advance when possible. Emergency maintenance may occur without notice.",
                  },
                  {
                    title: "Interruptions",
                    body: "We're not liable for interruptions, data loss, or damages from unavailability.",
                  },
                ].map((item, i) => (
                  <div key={i} className="border border-neutral-800 p-4">
                    <h3 className="text-xs font-medium text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-600 font-light leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div id="ip" className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
                08
              </p>
              <h2 className="text-2xl sm:text-3xl font-thin tracking-tight mb-6">
                Intellectual Property
              </h2>
              <div className="space-y-5">
                {[
                  {
                    title: "BitLink's property",
                    body: "The BitLink name, logo, and design are ours. You may not use our branding without written permission.",
                  },
                  {
                    title: "Third-party content",
                    body: "We don't claim ownership of URLs you shorten. Third-party content is the responsibility of those parties.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-0.5 bg-neutral-800 flex-shrink-0 self-stretch" />
                    <div>
                      <h3 className="text-xs font-medium text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-500 font-light leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 09 — Liability */}
      <section
        id="liability"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900"
      >
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
            09
          </p>
          <h2 className="text-3xl sm:text-4xl font-thin tracking-tight mb-3">
            Disclaimers & Liability
          </h2>
          <p className="text-neutral-600 text-sm font-light">
            The legal stuff. We've kept it as readable as possible.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-px bg-neutral-900">
          {[
            {
              label: "No warranties",
              body: 'BitLink is provided "as is" and "as available" without warranties of any kind — express or implied. We disclaim all warranties including merchantability and fitness for purpose.',
            },
            {
              label: "Limitation of liability",
              body: "To the maximum extent permitted by law, BitLink isn't liable for indirect, incidental, special, consequential, or punitive damages — including lost profits or data loss.",
            },
            {
              label: "User content",
              body: "We're not responsible for the content your links lead to, or any damages arising from third-party content accessed through BitLink shortened links.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D0F13] p-6 sm:p-8">
              <span className="text-xs uppercase tracking-widest text-neutral-700 block mb-4">
                {item.label}
              </span>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 10 — Termination */}
      <section
        id="termination"
        className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900 bg-[#0D0F13]/40"
      >
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-3">
              10
            </p>
            <h2 className="text-3xl sm:text-4xl font-thin tracking-tight">
              Termination
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-neutral-900">
            {[
              {
                tag: "→ You",
                title: "By you",
                body: "You can terminate your account anytime by contacting rupareluttkarsh2309@gmail.com. Your access ends immediately upon termination.",
              },
              {
                tag: "→ Us",
                title: "By us",
                body: "We may suspend or terminate your account for Terms violations, illegal activity, or at our discretion. We'll notify you when possible.",
              },
              {
                tag: "→ After",
                title: "What follows",
                body: "Your links may go inactive and data may be deleted per our retention policies. Some provisions in these Terms survive termination.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#0B0D10] p-6 sm:p-8">
                <p className="text-xs text-neutral-700 uppercase tracking-wider mb-4">
                  {item.tag}
                </p>
                <h3 className="text-base font-medium text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — Contact */}
      <section id="contact" className="px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-6">
              11
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-thin tracking-tight leading-[0.95] mb-6">
              Still have
              <br />
              <span className="text-[#76B900]">questions?</span>
            </h2>
            <p className="text-neutral-500 font-light leading-relaxed text-sm sm:text-base max-w-md">
              If anything here is unclear, or you need to raise a legal matter,
              we're reachable directly. No contact forms, no bots — just email.
            </p>
          </div>
          <div className="border border-neutral-800 bg-[#0D0F13] p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-4 h-4 text-[#76B900]" />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Get in touch
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-thin text-white mb-2">
              rupareluttkarsh2309@gmail.com
            </p>
            <p className="text-neutral-600 text-xs font-light mb-8">
              We typically respond within 24 hours on business days.
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
