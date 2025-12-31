import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Terms() {
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
        <h1 className="text-5xl font-light mb-4">Terms of Service</h1>
        <p className="text-neutral-400 mb-12">
          Last updated: December 31, 2025
        </p>

        <div className="border border-neutral-800 p-6 bg-[#0D0F13] mb-12">
          <p className="text-sm text-neutral-400 leading-relaxed">
            By accessing or using BitLink, you agree to be bound by these Terms
            of Service. If you do not agree to these terms, please do not use
            our service.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6 flex items-center gap-3">
            <FileText className="w-7 h-7 text-[#76B900]" />
            Acceptance of Terms
          </h2>

          <p className="text-neutral-400 leading-relaxed mb-4">
            These Terms of Service ("Terms") govern your access to and use of
            BitLink's website, API, and related services (collectively, the
            "Service"). By creating an account or using the Service, you agree
            to these Terms.
          </p>

          <p className="text-neutral-400 leading-relaxed">
            We reserve the right to modify these Terms at any time. Continued
            use of the Service after changes constitutes acceptance of the
            modified Terms.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Account Registration</h2>

          <div className="space-y-4">
            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Eligibility</h3>
              <p className="text-sm text-neutral-400">
                You must be at least 13 years old to create an account. By
                registering, you represent that you meet this age requirement.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">
                Account Responsibility
              </h3>
              <p className="text-sm text-neutral-400">
                You are responsible for maintaining the security of your account
                credentials. You are fully responsible for all activities that
                occur under your account.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Accurate Information</h3>
              <p className="text-sm text-neutral-400">
                You agree to provide accurate and complete information during
                registration and to keep this information up to date.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Acceptable Use</h2>

          <div className="mb-6">
            <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#76B900]" />
              You May Use BitLink To:
            </h3>
            <ul className="space-y-2 text-neutral-400 ml-6">
              <li>• Shorten legitimate URLs for personal or business use</li>
              <li>• Track analytics for your own links</li>
              <li>• Generate QR codes for your shortened links</li>
              <li>• Create custom aliases for branded short links</li>
              <li>• Integrate our API into your applications</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              You May Not Use BitLink To:
            </h3>
            <ul className="space-y-2 text-neutral-400 ml-6">
              <li>• Distribute malware, viruses, or malicious code</li>
              <li>• Link to phishing sites or fraudulent content</li>
              <li>• Share illegal content or links to illegal activities</li>
              <li>• Violate intellectual property rights</li>
              <li>• Spam or send unsolicited communications</li>
              <li>• Harass, abuse, or harm others</li>
              <li>• Circumvent our rate limiting or security measures</li>
              <li>• Scrape or harvest user data without authorization</li>
              <li>• Impersonate others or misrepresent your affiliation</li>
              <li>• Interfere with or disrupt the Service</li>
            </ul>
          </div>

          <div className="border border-orange-400/20 bg-orange-400/5 p-4 mt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-orange-400 mb-1">
                  Violation Consequences
                </h4>
                <p className="text-xs text-neutral-400">
                  Violation of acceptable use policies may result in immediate
                  suspension or termination of your account, deletion of your
                  links, and legal action if warranted.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Service Tiers & Limits</h2>

          <div className="space-y-4">
            <div className="border border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Guest Users</h3>
                <span className="text-xs text-neutral-500">No Account</span>
              </div>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>• 1 link per session</li>
                <li>• Basic analytics</li>
                <li>• No API access</li>
                <li>• Links can be migrated after signup</li>
              </ul>
            </div>

            <div className="border border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Free Tier</h3>
                <span className="text-xs text-neutral-500">$0/month</span>
              </div>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>• 50 links per day</li>
                <li>• 7-day analytics retention</li>
                <li>• QR code generation</li>
                <li>• Limited API access</li>
              </ul>
            </div>

            <div className="border border-[#76B900] p-6 bg-[#76B900]/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Pro Tier</h3>
                <span className="text-xs text-[#76B900]">$9/month</span>
              </div>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>• Unlimited links</li>
                <li>• Unlimited analytics retention</li>
                <li>• Custom domains</li>
                <li>• Full API access</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Link Ownership & Content</h2>

          <div className="space-y-4 text-neutral-400">
            <p>
              <strong className="text-neutral-300">Your Content:</strong> You
              retain all rights to the URLs you shorten and the content they
              link to. You are solely responsible for the content you link to
              through BitLink.
            </p>
            <p>
              <strong className="text-neutral-300">Content Moderation:</strong>{" "}
              We reserve the right to review, disable, or delete links that
              violate these Terms or applicable laws. We do not pre-screen links
              but may investigate reported content.
            </p>
            <p>
              <strong className="text-neutral-300">DMCA Compliance:</strong> We
              respond to valid DMCA takedown requests. If you believe a link
              infringes your copyright, contact support@bitlink.xyz with
              details.
            </p>
            <p>
              <strong className="text-neutral-300">Link Expiration:</strong> You
              may set expiration dates for your links. Expired links become
              inactive and redirect to a 404 page. We do not automatically
              delete expired links.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">API Usage</h2>

          <div className="space-y-4">
            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Rate Limits</h3>
              <p className="text-sm text-neutral-400">
                API usage is subject to rate limits based on your account tier.
                Exceeding these limits may result in temporary throttling or
                suspension.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Authentication</h3>
              <p className="text-sm text-neutral-400">
                You must use valid authentication tokens for API requests. Do
                not share your API credentials or tokens with unauthorized
                parties.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Fair Use</h3>
              <p className="text-sm text-neutral-400">
                You may not use the API to create competing services or in ways
                that unreasonably burden our infrastructure.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Service Availability</h2>

          <p className="text-neutral-400 leading-relaxed mb-4">
            We strive to provide reliable service but cannot guarantee 100%
            uptime. The Service is provided "as is" without warranties of any
            kind.
          </p>

          <div className="space-y-3">
            <div className="border border-neutral-800 p-4">
              <h3 className="text-sm font-medium mb-2">Maintenance</h3>
              <p className="text-xs text-neutral-400">
                We may perform scheduled maintenance with advance notice when
                possible. Emergency maintenance may occur without notice.
              </p>
            </div>

            <div className="border border-neutral-800 p-4">
              <h3 className="text-sm font-medium mb-2">
                Service Interruptions
              </h3>
              <p className="text-xs text-neutral-400">
                We are not liable for service interruptions, data loss, or any
                damages resulting from unavailability of the Service.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Intellectual Property</h2>

          <div className="space-y-4 text-neutral-400">
            <p>
              <strong className="text-neutral-300">BitLink Property:</strong>{" "}
              The BitLink name, logo, design, and all related intellectual
              property are owned by BitLink. You may not use our branding
              without written permission.
            </p>
            <p>
              <strong className="text-neutral-300">Third-Party Content:</strong>{" "}
              BitLink does not claim ownership of URLs or content you shorten.
              Links to third-party content are the responsibility of those third
              parties.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Disclaimers & Liability</h2>

          <div className="border border-neutral-800 p-6 bg-[#0D0F13]">
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              <strong className="text-neutral-300">NO WARRANTIES:</strong>{" "}
              BitLink is provided "as is" and "as available" without warranties
              of any kind, express or implied. We disclaim all warranties,
              including merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              <strong className="text-neutral-300">
                LIMITATION OF LIABILITY:
              </strong>{" "}
              To the maximum extent permitted by law, BitLink shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, including lost profits, data loss, or business
              interruption.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              <strong className="text-neutral-300">USER CONTENT:</strong> We are
              not responsible for the content you link to or any damages arising
              from third-party content accessed through shortened links.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Termination</h2>

          <div className="space-y-4">
            <div className="border-l-2 border-neutral-800 pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">By You</h3>
              <p className="text-sm text-neutral-400">
                You may terminate your account at any time by contacting
                support@bitlink.xyz. Upon termination, your access to the
                Service will cease.
              </p>
            </div>

            <div className="border-l-2 border-neutral-800 pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">By Us</h3>
              <p className="text-sm text-neutral-400">
                We may suspend or terminate your account at any time for
                violations of these Terms, illegal activity, or at our sole
                discretion. We will attempt to provide notice when possible.
              </p>
            </div>

            <div className="border-l-2 border-neutral-800 pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">
                Effect of Termination
              </h3>
              <p className="text-sm text-neutral-400">
                Upon termination, your links may become inactive, and your data
                may be deleted according to our retention policies. Some
                provisions of these Terms survive termination.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Indemnification</h2>

          <p className="text-neutral-400 leading-relaxed">
            You agree to indemnify and hold harmless BitLink and its affiliates
            from any claims, damages, losses, liabilities, and expenses
            (including legal fees) arising from your use of the Service, your
            violation of these Terms, or your violation of any rights of another
            party.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Governing Law</h2>

          <p className="text-neutral-400 leading-relaxed">
            These Terms shall be governed by and construed in accordance with
            applicable laws, without regard to conflict of law provisions. Any
            disputes shall be resolved through binding arbitration or in courts
            of competent jurisdiction.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-light mb-6">Changes to Terms</h2>

          <p className="text-neutral-400 leading-relaxed">
            We reserve the right to modify these Terms at any time. Material
            changes will be communicated via email or prominent notice on our
            website. Your continued use of the Service after changes constitutes
            acceptance of the modified Terms.
          </p>
        </section>

        <section className="border-t border-neutral-800 pt-12">
          <h2 className="text-3xl font-light mb-6">Contact</h2>

          <p className="text-neutral-400 leading-relaxed mb-6">
            If you have questions about these Terms of Service, please contact
            us:
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
