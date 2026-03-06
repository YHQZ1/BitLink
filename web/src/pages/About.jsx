import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Shield, TrendingUp, ArrowRight } from "lucide-react";

export default function About() {
  const navigate = useNavigate();

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
            About
          </span>
        </div>
      </nav>

      {/* Hero — full width, two-column */}
      <section className="pt-32 pb-16 px-4 sm:px-8 lg:px-16 border-b border-neutral-900">
        <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-0 items-start">
          {/* Left: big statement */}
          <div className="lg:pr-16 pb-10 lg:pb-0">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76B900] mb-6">
              Our Story
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-thin leading-[0.95] tracking-tight mb-8">
              Built from
              <br />
              a frustration
              <br />
              <span className="text-[#76B900]">with shortcuts.</span>
            </h1>
            <p className="text-neutral-500 font-light leading-relaxed max-w-md">
              Most link shorteners treat URLs like disposable objects. We built
              BitLink because we believed every link deserves to be tracked,
              understood, and owned.
            </p>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-neutral-800 self-stretch" />

          {/* Right: founder note */}
          <div className="lg:pl-16 pt-8 lg:pt-2">
            <div className="border-l-2 border-[#76B900] pl-6 mb-8">
              <p className="text-neutral-400 font-light leading-relaxed text-sm sm:text-base italic">
                "I wanted to build something that wasn't just functional — I
                wanted it to reflect how I think about software: clean,
                intentional, and built to last. BitLink started as a side
                project and became a study in doing things properly."
              </p>
              <p className="text-neutral-600 text-xs mt-4 uppercase tracking-wider">
                — Uttkarsh Ruparel, Founder
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {[
                { value: "50B+", label: "Possible IDs" },
                { value: "<100ms", label: "Redirect Time" },
                { value: "100%", label: "Stateless API" },
              ].map((s, i) => (
                <div key={i} className="border-t border-neutral-800 pt-4">
                  <div className="text-2xl sm:text-3xl font-thin text-[#76B900] mb-1 tracking-tight">
                    {s.value}
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

      {/* Mission — full bleed with side accent */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900">
        <div className="grid lg:grid-cols-[200px_1fr] gap-8 lg:gap-16 items-start">
          <div>
            <div className="h-px w-12 bg-[#76B900] mb-4" />
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
              Mission
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
            <p className="text-neutral-400 font-light leading-relaxed text-sm sm:text-base">
              BitLink exists to prove that even a "simple" product is an
              opportunity to apply real engineering principles. Not just making
              links shorter — but making them smarter, safer, and more
              insightful.
            </p>
            <p className="text-neutral-400 font-light leading-relaxed text-sm sm:text-base">
              Clarity over complexity. Performance over bloat. Real analytics
              over vanity metrics. Every decision made at BitLink — from backend
              architecture to UI — reflects a commitment to software that
              actually scales.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles — horizontal cards, full width */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900">
        <div className="flex items-center gap-4 mb-12">
          <div>
            <div className="h-px w-12 bg-[#76B900] mb-4" />
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
              Core Principles
            </p>
          </div>
          <div className="h-px flex-1 bg-neutral-900" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:divide-x sm:divide-neutral-900">
          {[
            {
              icon: <Zap className="w-5 h-5" />,
              title: "Speed is non-negotiable",
              body: "Redirects happen in under 100ms. Analytics are captured asynchronously so they never slow down your users. Performance isn't a feature — it's the baseline.",
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: "Security baked in",
              body: "JWT auth, bcrypt hashing, strict CORS, and rate limiting at every layer. Not bolted on at the end — designed in from day one.",
            },
            {
              icon: <TrendingUp className="w-5 h-5" />,
              title: "Built to grow with you",
              body: "Stateless architecture. Horizontal scaling ready. Clean service boundaries that make every future feature straightforward to add, not a nightmare to untangle.",
            },
          ].map((p, i) => (
            <div
              key={i}
              className="sm:px-8 lg:px-12 py-6 sm:py-0 border-b sm:border-b-0 border-neutral-900 first:pl-0 last:pr-0"
            >
              <div className="text-[#76B900] mb-5">{p.icon}</div>
              <h3 className="text-base sm:text-lg font-light text-white mb-3 leading-snug">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture — numbered list, asymmetric layout */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 border-b border-neutral-900">
        <div className="grid lg:grid-cols-[200px_1fr] gap-8 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <div className="h-px w-12 bg-[#76B900] mb-4" />
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-600 mb-2">
              Under the Hood
            </p>
            <p className="text-neutral-700 text-xs font-light leading-relaxed hidden lg:block">
              The decisions that make BitLink different from a weekend CRUD
              project.
            </p>
          </div>

          <div className="space-y-0 divide-y divide-neutral-900">
            {[
              {
                num: "01",
                title: "Everything has its place",
                body: "Controllers handle HTTP. Services own the logic. Utilities stay stateless. What started as a 1,000-line monolith was refactored into focused, testable layers — because clean architecture isn't optional when you're building to scale.",
              },
              {
                num: "02",
                title: "Analytics that never slow you down",
                body: "Every click is captured asynchronously — device, browser, location, referrer — without adding a single millisecond to your redirect. The pipeline writes events in the background while your user is already on their way.",
              },
              {
                num: "03",
                title: "One account, any provider",
                body: "Sign in with Google, GitHub, or email — it all maps to the same user. OAuth accounts are unified by email so you're never locked into one login method, and your data follows you everywhere.",
              },
              {
                num: "04",
                title: "Your guest links come with you",
                body: "Try BitLink without signing up. When you eventually do, every link you created as a guest — including its analytics history — is automatically migrated to your account. Nothing gets left behind.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="grid sm:grid-cols-[80px_1fr] gap-4 sm:gap-8 py-8"
              >
                <div className="text-3xl sm:text-4xl font-thin text-neutral-800 tabular-nums">
                  {item.num}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-light text-white mb-2">
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
      </section>

      {/* CTA — full width, centered */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-24">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-thin tracking-tight mb-4">
              Want to see how it works
              <br />
              <span className="text-[#76B900]">under the hood?</span>
            </h2>
            <p className="text-neutral-600 text-sm font-light max-w-lg">
              The API is clean, well-documented, and built for real
              integrations. Whether you're a developer or just curious, it's
              worth a look.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={() => navigate("/docs")}
              className="border-2 border-[#76B900] text-[#76B900] px-6 py-3 hover:bg-[#76B900] hover:text-black transition-all cursor-pointer flex items-center gap-2 text-xs uppercase tracking-widest font-medium whitespace-nowrap"
            >
              View API Docs <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 px-6 py-3 transition-all cursor-pointer text-xs uppercase tracking-widest font-medium whitespace-nowrap"
            >
              Try BitLink Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
