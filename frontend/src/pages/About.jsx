import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Code,
  BarChart3,
  Globe,
} from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
      {/* Header */}
      <nav className="fixed top-0 w-full border-b border-neutral-800 bg-[#0B0D10]/95 backdrop-blur-sm z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 sm:gap-3 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/logo.png"
                alt="BitLink"
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
              <span className="text-base sm:text-[20px] font-medium tracking-tight">
                BitLink
              </span>
            </div>
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-12 lg:pb-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 sm:mb-6">
          About BitLink
        </h1>
        <p className="text-base sm:text-xl text-neutral-400 mb-8 sm:mb-12 leading-relaxed">
          A production-oriented URL shortening platform built with a strong
          emphasis on backend architecture, scalability, and clean code
          separation.
        </p>

        <section className="mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-light mb-4 sm:mb-6">
            Our Mission
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-4">
            BitLink was built to apply real system-design principles to a
            production-ready product. We're not just another link
            shortener—we're a platform designed from the ground up with
            scalability, analytics, and developer experience in mind.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            We believe in clarity over complexity, performance over bloat, and
            real analytics over vanity metrics. Every decision, from our
            stateless backend architecture to our event-based analytics
            pipeline, reflects a commitment to building software that scales.
          </p>
        </section>

        <section className="mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-light mb-6 lg:mb-8">
            Core Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="border border-neutral-800 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#76B900]" />
                <h3 className="text-base sm:text-lg font-medium">
                  Performance First
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">
                Sub-100ms API responses, Redis-backed caching for hot redirects,
                and asynchronous analytics that never block redirects.
              </p>
            </div>

            <div className="border border-neutral-800 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#76B900]" />
                <h3 className="text-base sm:text-lg font-medium">
                  Security by Design
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">
                JWT authentication, bcrypt password hashing, strict CORS
                configuration, and rate limiting at every layer.
              </p>
            </div>

            <div className="border border-neutral-800 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#76B900]" />
                <h3 className="text-base sm:text-lg font-medium">
                  Built to Scale
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">
                Stateless backend instances, horizontal scaling readiness,
                MongoDB aggregation optimization, and clear upgrade paths.
              </p>
            </div>

            <div className="border border-neutral-800 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#76B900]" />
                <h3 className="text-base sm:text-lg font-medium">
                  Real Analytics
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">
                Event-based tracking with device detection, geo-resolution,
                referrer categorization, and peak-hour analysis.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-light mb-4 sm:mb-6">
            Technology Stack
          </h2>
          <div className="border border-neutral-800 p-4 sm:p-6 bg-[#0D0F13]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <h3 className="text-sm font-medium mb-3 text-neutral-300">
                  Frontend
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-400">
                  <li>• React with Vite</li>
                  <li>• Tailwind CSS</li>
                  <li>• Deployed on Vercel</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-3 text-neutral-300">
                  Backend
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-400">
                  <li>• Node.js + Express</li>
                  <li>• MongoDB with Mongoose</li>
                  <li>• JWT authentication</li>
                  <li>• Deployed on Render</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-3 text-neutral-300">
                  Analytics
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-400">
                  <li>• UA-Parser for device detection</li>
                  <li>• geoip-lite for location</li>
                  <li>• Event-based tracking</li>
                  <li>• Async processing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-3 text-neutral-300">
                  Features
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-400">
                  <li>• OAuth 2.0 (GitHub, Google)</li>
                  <li>• QR code generation</li>
                  <li>• Custom aliases</li>
                  <li>• Link expiration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-light mb-4 sm:mb-6">
            Architecture Highlights
          </h2>
          <div className="space-y-4">
            <div className="border-l-2 border-[#76B900] pl-4 sm:pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">
                Service-Driven Architecture
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Strict separation of concerns with controllers handling HTTP
                lifecycle, services managing business logic, and utilities
                providing stateless helpers. Originally monolithic controller
                (~1000 lines) decomposed into focused services.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-4 sm:pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Analytics Pipeline</h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Write-optimized event model that never blocks redirects.
                Analytics are recorded asynchronously with device, browser, OS
                detection, geo-resolution, and referrer categorization.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-4 sm:pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">OAuth Implementation</h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Single logical user mapped across providers via email
                unification. Supports GitHub and Google with JWT-based stateless
                auth.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-4 sm:pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">
                Guest-to-User Migration
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Limited guest usage with post-signup migration. Guest links are
                automatically transferred to authenticated accounts, preserving
                analytics history.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-light mb-4 sm:mb-6">
            For Developers
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-6">
            BitLink exposes a clean REST API designed for integration into any
            workflow. Whether you're building a marketing automation tool, a
            content management system, or a custom analytics dashboard, our API
            provides the flexibility you need.
          </p>
          <button
            onClick={() => navigate("/api-docs")}
            className="border border-[#76B900] text-[#76B900] px-4 sm:px-6 py-2 sm:py-3 hover:bg-[#76B900] hover:text-black transition-colors cursor-pointer text-sm sm:text-base"
          >
            View API Documentation
          </button>
        </section>

        <section className="border-t border-neutral-800 pt-8 sm:pt-12">
          <h2 className="text-2xl sm:text-3xl font-light mb-4 sm:mb-6">
            Built With Purpose
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-4">
            BitLink was created to demonstrate that link shortening is more than
            a simple CRUD application. It's an opportunity to implement real
            system-design principles: caching strategies, analytics pipelines,
            horizontal scaling, OAuth integration, and backend refactoring at
            scale.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            Every line of code reflects a commitment to thinking in terms of
            traffic, failure modes, and growth. This is software built to learn
            from, extend, and scale.
          </p>
        </section>
      </main>
    </div>
  );
}
