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
} from "lucide-react";

export default function Security() {
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
        <h1 className="text-5xl font-light mb-6">Security</h1>
        <p className="text-xl text-neutral-400 mb-12 leading-relaxed">
          Security is at the core of everything we build. Here's how we protect
          your data and maintain the integrity of our platform.
        </p>

        <section className="mb-16">
          <h2 className="text-3xl font-light mb-8 flex items-center gap-3">
            <Shield className="w-7 h-7 text-[#76B900]" />
            Security Architecture
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-[#76B900]" />
                <h3 className="text-lg font-medium">Authentication</h3>
              </div>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>• JWT-based stateless authentication</li>
                <li>• 7-day token expiration</li>
                <li>• Signed and verified tokens</li>
                <li>• OAuth 2.0 integration</li>
              </ul>
            </div>

            <div className="border border-neutral-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-6 h-6 text-[#76B900]" />
                <h3 className="text-lg font-medium">Password Security</h3>
              </div>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>• Bcrypt hashing with salt</li>
                <li>• No plaintext storage</li>
                <li>• Secure password reset flow</li>
                <li>• Minimum complexity requirements</li>
              </ul>
            </div>

            <div className="border border-neutral-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-[#76B900]" />
                <h3 className="text-lg font-medium">Data Protection</h3>
              </div>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>• Encrypted data transmission (TLS)</li>
                <li>• MongoDB Atlas encryption at rest</li>
                <li>• Regular automated backups</li>
                <li>• Strict access controls</li>
              </ul>
            </div>

            <div className="border border-neutral-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Server className="w-6 h-6 text-[#76B900]" />
                <h3 className="text-lg font-medium">Infrastructure</h3>
              </div>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>• Stateless backend instances</li>
                <li>• DDoS protection</li>
                <li>• Isolated environments</li>
                <li>• Regular security updates</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-light mb-6">
            Authentication & Authorization
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-4">JWT Implementation</h3>
              <p className="text-neutral-400 mb-4 leading-relaxed">
                We use JSON Web Tokens (JWT) for stateless authentication.
                Tokens are signed with a secret key and include user
                identification data. Each token expires after 7 days, requiring
                re-authentication.
              </p>
              <div className="border border-neutral-800 p-4 bg-[#0D0F13]">
                <p className="text-xs text-neutral-400 mb-2">
                  Token Structure:
                </p>
                <ul className="space-y-1 text-xs text-neutral-400 ml-4">
                  <li>
                    • <strong className="text-neutral-300">Header:</strong>{" "}
                    Algorithm and token type
                  </li>
                  <li>
                    • <strong className="text-neutral-300">Payload:</strong>{" "}
                    User ID and expiration
                  </li>
                  <li>
                    • <strong className="text-neutral-300">Signature:</strong>{" "}
                    HMAC-based verification
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">
                OAuth 2.0 Integration
              </h3>
              <p className="text-neutral-400 mb-4 leading-relaxed">
                We support OAuth authentication through GitHub and Google. OAuth
                tokens are never exposed client-side. We only request necessary
                permissions (email and basic profile) and map users across
                providers via email unification.
              </p>
              <div className="border-l-2 border-[#76B900] pl-6 py-2">
                <p className="text-sm text-neutral-400">
                  OAuth providers handle password security on their end. We
                  never see or store your OAuth provider password.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">
                Authorization Controls
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Every protected endpoint enforces authorization. Users can only
                access their own links, analytics, and account data. All
                requests are validated against the authenticated user's
                identity.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-light mb-6">
            Rate Limiting & Abuse Prevention
          </h2>

          <div className="space-y-4">
            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-medium mb-3">API Rate Limits</h3>
              <p className="text-xs text-neutral-400 mb-3">
                All API endpoints are rate-limited to prevent abuse and ensure
                fair resource allocation. Limits vary by account tier and
                endpoint type.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-neutral-300 mb-1">Guest:</p>
                  <p className="text-neutral-400">1 link per session</p>
                </div>
                <div>
                  <p className="text-neutral-300 mb-1">Free:</p>
                  <p className="text-neutral-400">50 links/day</p>
                </div>
                <div>
                  <p className="text-neutral-300 mb-1">Pro:</p>
                  <p className="text-neutral-400">Unlimited links</p>
                </div>
                <div>
                  <p className="text-neutral-300 mb-1">Enterprise:</p>
                  <p className="text-neutral-400">Custom limits</p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-medium mb-3">
                Redirect Layer Protection
              </h3>
              <p className="text-xs text-neutral-400">
                The redirect endpoint includes rate limiting to prevent abuse.
                Suspicious patterns trigger automatic throttling to protect our
                infrastructure.
              </p>
            </div>

            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-medium mb-3">Link Validation</h3>
              <p className="text-xs text-neutral-400">
                All submitted URLs are validated to ensure they follow
                HTTP/HTTPS protocols. We check for common malicious patterns and
                suspicious domains.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-light mb-6">Data Encryption</h2>

          <div className="space-y-4">
            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">In Transit</h3>
              <p className="text-sm text-neutral-400">
                All data transmitted between your browser and our servers is
                encrypted using TLS 1.3. This includes API requests,
                authentication tokens, and user data.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">At Rest</h3>
              <p className="text-sm text-neutral-400">
                Our database (MongoDB Atlas) uses encryption at rest with
                AES-256. Passwords are hashed using bcrypt before storage. We
                never store plaintext passwords.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">In Memory</h3>
              <p className="text-sm text-neutral-400">
                Sensitive data in memory is handled securely with automatic
                cleanup. JWT secrets and API keys are stored in environment
                variables, never in code.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-light mb-6">Privacy & Data Access</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-[#76B900]" />
                <h3 className="text-lg font-medium">Data Minimization</h3>
              </div>
              <p className="text-sm text-neutral-400">
                We only collect data necessary for service operation. No
                unnecessary tracking, no third-party analytics, no advertising
                pixels.
              </p>
            </div>

            <div className="border border-neutral-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-[#76B900]" />
                <h3 className="text-lg font-medium">Access Control</h3>
              </div>
              <p className="text-sm text-neutral-400">
                Internal access to production data is strictly limited and
                logged. No employee can access user data without proper
                authorization.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-light mb-6">CORS & API Security</h2>

          <div className="space-y-4">
            <div className="border border-neutral-800 p-6 bg-[#0D0F13]">
              <h3 className="text-sm font-medium mb-3">
                Cross-Origin Resource Sharing
              </h3>
              <p className="text-xs text-neutral-400 mb-3">
                Our API implements strict CORS policies to prevent unauthorized
                cross-origin requests. Only whitelisted domains can make
                requests to our API.
              </p>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>• Whitelisted origins only</li>
                <li>• Credentials handling restrictions</li>
                <li>• Method and header validation</li>
              </ul>
            </div>

            <div className="border border-neutral-800 p-6 bg-[#0D0F13]">
              <h3 className="text-sm font-medium mb-3">Request Validation</h3>
              <p className="text-xs text-neutral-400">
                All API requests are validated for proper structure, data types,
                and required fields. Malformed requests are rejected before
                processing.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-light mb-6">
            Monitoring & Incident Response
          </h2>

          <div className="space-y-4">
            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Security Monitoring</h3>
              <p className="text-sm text-neutral-400">
                We continuously monitor our systems for suspicious activity,
                failed authentication attempts, and unusual traffic patterns.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Logging</h3>
              <p className="text-sm text-neutral-400">
                All API requests, authentication attempts, and system events are
                logged for security analysis. Logs are retained securely and
                reviewed regularly.
              </p>
            </div>

            <div className="border-l-2 border-[#76B900] pl-6 py-2">
              <h3 className="text-sm font-medium mb-2">Incident Response</h3>
              <p className="text-sm text-neutral-400">
                In the event of a security incident, we have protocols in place
                for immediate response, investigation, remediation, and user
                notification when necessary.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-light mb-6">Best Practices for Users</h2>

          <div className="space-y-3">
            <div className="border border-neutral-800 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#76B900] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Strong Passwords</h3>
                  <p className="text-xs text-neutral-400">
                    Use unique, complex passwords with a mix of letters,
                    numbers, and symbols. Consider using a password manager.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-800 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#76B900] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium mb-1">
                    Keep Tokens Secret
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Never share your authentication tokens or API keys. If
                    compromised, regenerate them immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-800 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#76B900] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Regular Audits</h3>
                  <p className="text-xs text-neutral-400">
                    Periodically review your active links and delete those no
                    longer needed. Monitor analytics for suspicious activity.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-800 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#76B900] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Report Issues</h3>
                  <p className="text-xs text-neutral-400">
                    If you notice suspicious activity or potential security
                    issues, report them to security@bitlink.xyz immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-light mb-6">Compliance & Standards</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-medium mb-3">Industry Standards</h3>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>• OWASP Top 10 guidelines</li>
                <li>• RESTful API best practices</li>
                <li>• JWT security recommendations</li>
                <li>• OAuth 2.0 specifications</li>
              </ul>
            </div>

            <div className="border border-neutral-800 p-6">
              <h3 className="text-sm font-medium mb-3">Data Protection</h3>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>• GDPR-compliant data handling</li>
                <li>• User data export capabilities</li>
                <li>• Right to deletion enforcement</li>
                <li>• Transparent privacy policies</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-800 pt-12">
          <h2 className="text-3xl font-light mb-6 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-orange-400" />
            Responsible Disclosure
          </h2>

          <p className="text-neutral-400 leading-relaxed mb-6">
            If you discover a security vulnerability in BitLink, we encourage
            responsible disclosure. Please report security issues to:
          </p>

          <div className="border border-neutral-800 p-6 bg-[#0D0F13] mb-6">
            <p className="text-sm text-neutral-400 mb-4">
              Email:{" "}
              <a
                href="mailto:security@bitlink.xyz"
                className="text-[#76B900] hover:text-[#8FD400]"
              >
                security@bitlink.xyz
              </a>
            </p>
            <p className="text-xs text-neutral-400">
              Please include detailed information about the vulnerability and
              steps to reproduce it. We will acknowledge your report within 48
              hours and work with you to resolve the issue.
            </p>
          </div>

          <div className="border border-orange-400/20 bg-orange-400/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-orange-400 mb-1">
                  Responsible Disclosure Guidelines
                </h4>
                <ul className="text-xs text-neutral-400 space-y-1">
                  <li>
                    • Do not exploit the vulnerability beyond demonstrating it
                  </li>
                  <li>
                    • Do not publicly disclose the issue before we've addressed
                    it
                  </li>
                  <li>
                    • Give us reasonable time to investigate and fix the issue
                  </li>
                  <li>
                    • We commit to keeping you updated on the resolution
                    timeline
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
