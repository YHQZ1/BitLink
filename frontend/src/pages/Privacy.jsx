import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Database, Lock } from "lucide-react";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
      {/* Header */}
      <nav className="fixed top-0 w-full border-b border-neutral-800 bg-[#0B0D10]/95 backdrop-blur-sm z-50">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="BitLink" className="w-8 h-8" />
              <span className="text-[20px] font-medium tracking-tight">
                BitLink
              </span>
            </div>
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 px-5 md:px-8 max-w-4xl mx-auto pb-20">
        <h1 className="text-5xl font-light mb-4">Privacy Policy</h1>
        <p className="text-neutral-400 mb-12">
          Last updated: December 31, 2025
        </p>

        <div className="border border-neutral-800 p-6 bg-[#0D0F13] mb-12">
          <p className="text-sm text-neutral-400 leading-relaxed">
            At BitLink, we take your privacy seriously. This policy explains
            what data we collect, how we use it, and your rights regarding your
            personal information.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6 flex items-center gap-3">
            <Database className="w-7 h-7 text-[#76B900]" />
            Information We Collect
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3">Account Information</h3>
              <p className="text-neutral-400 mb-3">
                When you create an account, we collect:
              </p>
              <ul className="space-y-2 text-neutral-400 ml-6">
                <li>• Email address</li>
                <li>• Password (hashed using bcrypt)</li>
                <li>
                  • OAuth provider information (if using GitHub or Google login)
                </li>
                <li>• Account creation date</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">Link Data</h3>
              <p className="text-neutral-400 mb-3">
                When you create short links, we store:
              </p>
              <ul className="space-y-2 text-neutral-400 ml-6">
                <li>• Original URL</li>
                <li>• Custom alias (if provided)</li>
                <li>• Generated short code</li>
                <li>• Creation and modification timestamps</li>
                <li>• Link expiration date (if set)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">Analytics Data</h3>
              <p className="text-neutral-400 mb-3">
                When someone clicks your short link, we automatically collect:
              </p>
              <ul className="space-y-2 text-neutral-400 ml-6">
                <li>• IP address (for geographic analysis)</li>
                <li>• User agent (browser, device type, operating system)</li>
                <li>• Referrer URL (where the click came from)</li>
                <li>• Timestamp of the click</li>
                <li>
                  • Country and city (derived from IP address using geoip-lite)
                </li>
              </ul>
              <p className="text-neutral-400 mt-3 text-sm">
                This data is used to provide you with click analytics and
                insights. We do not use this data for advertising or sell it to
                third parties.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">Guest Session Data</h3>
              <p className="text-neutral-400 mb-3">
                If you use BitLink without an account:
              </p>
              <ul className="space-y-2 text-neutral-400 ml-6">
                <li>
                  • We generate a session ID stored in your browser's
                  localStorage
                </li>
                <li>• Guest users are limited to 1 link per session</li>
                <li>
                  • Guest links can be migrated to your account if you sign up
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6 flex items-center gap-3">
            <Eye className="w-7 h-7 text-[#76B900]" />
            How We Use Your Information
          </h2>

          <div className="space-y-4">
            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Service Delivery</h3>
              <p className="text-sm text-neutral-400">
                We use your information to provide, maintain, and improve
                BitLink's services, including link shortening, QR code
                generation, and analytics.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Authentication</h3>
              <p className="text-sm text-neutral-400">
                Email and password are used for account authentication. OAuth
                tokens are used to verify your identity with GitHub or Google.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Analytics & Insights</h3>
              <p className="text-sm text-neutral-400">
                Click data is processed to provide you with analytics about your
                links, including geographic distribution, device types, and
                traffic sources.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">
                Security & Fraud Prevention
              </h3>
              <p className="text-sm text-neutral-400">
                We monitor usage patterns to prevent abuse, implement rate
                limiting, and maintain the security of our platform.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6 flex items-center gap-3">
            <Lock className="w-7 h-7 text-[#76B900]" />
            Data Security
          </h2>

          <p className="text-neutral-400 mb-6 leading-relaxed">
            We implement industry-standard security measures to protect your
            data:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-neutral-800 p-4">
              <h3 className="text-sm font-medium mb-2">Encryption</h3>
              <p className="text-xs text-neutral-400">
                All data transmitted between your browser and our servers is
                encrypted using TLS.
              </p>
            </div>

            <div className="border border-neutral-800 p-4">
              <h3 className="text-sm font-medium mb-2">Password Hashing</h3>
              <p className="text-xs text-neutral-400">
                Passwords are hashed using bcrypt with strong salting before
                storage.
              </p>
            </div>

            <div className="border border-neutral-800 p-4">
              <h3 className="text-sm font-medium mb-2">JWT Tokens</h3>
              <p className="text-xs text-neutral-400">
                Authentication tokens are signed and verified, with 7-day
                expiration.
              </p>
            </div>

            <div className="border border-neutral-800 p-4">
              <h3 className="text-sm font-medium mb-2">Access Controls</h3>
              <p className="text-xs text-neutral-400">
                Strict authorization on all protected routes ensures users can
                only access their own data.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Data Retention</h2>

          <div className="space-y-4 text-neutral-400">
            <p>
              <strong className="text-neutral-300">Account Data:</strong>{" "}
              Retained for as long as your account is active. You can delete
              your account at any time.
            </p>
            <p>
              <strong className="text-neutral-300">Link Data:</strong> Retained
              indefinitely unless you manually delete links. Expired links are
              marked inactive but not automatically deleted.
            </p>
            <p>
              <strong className="text-neutral-300">Analytics Data:</strong>{" "}
              Retained according to your plan tier. Free accounts: 7 days. Pro
              accounts: unlimited retention.
            </p>
            <p>
              <strong className="text-neutral-300">Guest Links:</strong> Not
              automatically deleted but can be removed by clearing your
              browser's localStorage.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Your Rights</h2>

          <div className="space-y-3">
            <div className="border border-neutral-800 p-4">
              <h3 className="text-sm font-medium mb-2">Access & Export</h3>
              <p className="text-xs text-neutral-400">
                You can view and export all your link data and analytics through
                your dashboard.
              </p>
            </div>

            <div className="border border-neutral-800 p-4">
              <h3 className="text-sm font-medium mb-2">Correction</h3>
              <p className="text-xs text-neutral-400">
                You can update your account information and modify or delete
                your links at any time.
              </p>
            </div>

            <div className="border border-neutral-800 p-4">
              <h3 className="text-sm font-medium mb-2">Deletion</h3>
              <p className="text-xs text-neutral-400">
                You can request account deletion by contacting
                support@bitlink.xyz. This will permanently delete your account
                and associated data.
              </p>
            </div>

            <div className="border border-neutral-800 p-4">
              <h3 className="text-sm font-medium mb-2">Opt-Out</h3>
              <p className="text-xs text-neutral-400">
                You can choose not to create an account and use guest mode with
                limited features.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Third-Party Services</h2>

          <p className="text-neutral-400 mb-4 leading-relaxed">
            BitLink integrates with the following third-party services:
          </p>

          <div className="space-y-3">
            <div className="border-l-2 border-neutral-800 pl-6 py-2">
              <h3 className="text-sm font-medium mb-1">OAuth Providers</h3>
              <p className="text-xs text-neutral-400">
                GitHub and Google OAuth for authentication. We receive basic
                profile information (email, name) but never access your
                repositories or private data.
              </p>
            </div>

            <div className="border-l-2 border-neutral-800 pl-6 py-2">
              <h3 className="text-sm font-medium mb-1">Database Hosting</h3>
              <p className="text-xs text-neutral-400">
                MongoDB Atlas for secure, encrypted data storage.
              </p>
            </div>

            <div className="border-l-2 border-neutral-800 pl-6 py-2">
              <h3 className="text-sm font-medium mb-1">Application Hosting</h3>
              <p className="text-xs text-neutral-400">
                Vercel (frontend) and Render (backend) for application
                deployment.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Cookies & Tracking</h2>

          <p className="text-neutral-400 mb-4 leading-relaxed">
            BitLink uses minimal tracking:
          </p>

          <ul className="space-y-2 text-neutral-400 ml-6">
            <li>
              • <strong className="text-neutral-300">localStorage:</strong> Used
              to store guest session IDs and authentication tokens
            </li>
            <li>
              •{" "}
              <strong className="text-neutral-300">
                No third-party cookies:
              </strong>{" "}
              We do not use advertising or tracking pixels
            </li>
            <li>
              •{" "}
              <strong className="text-neutral-300">
                No analytics services:
              </strong>{" "}
              We don't use Google Analytics or similar services
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Children's Privacy</h2>

          <p className="text-neutral-400 leading-relaxed">
            BitLink is not intended for users under the age of 13. We do not
            knowingly collect personal information from children. If you believe
            a child has provided us with personal information, please contact us
            at support@bitlink.xyz.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Changes to This Policy</h2>

          <p className="text-neutral-400 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by updating the "Last updated" date at the top of
            this policy. Continued use of BitLink after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section className="border-t border-neutral-800 pt-12">
          <h2 className="text-3xl font-light mb-6">Contact Us</h2>

          <p className="text-neutral-400 leading-relaxed mb-6">
            If you have questions about this Privacy Policy or how we handle
            your data, please contact us:
          </p>

          <div className="border border-neutral-800 p-6 bg-[#0D0F13]">
            <p className="text-sm text-neutral-400">
              Email:{" "}
              <a
                href="mailto:support@bitlink.xyz"
                className="text-[#76B900] hover:text-[#8FD400]"
              >
                support@bitlink.xyz
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
