import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Check,
  Code,
  Lock,
  Zap,
  Shield,
  BarChart3,
  Link2,
  ExternalLink,
  Terminal,
  Key,
  AlertCircle,
  Clock,
  TrendingUp,
  Globe,
  Smartphone,
  MousePointerClick,
} from "lucide-react";

const CodeBlock = ({ code, language = "bash" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#0D0F13] border border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
        <span className="text-xs text-neutral-500 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="text-neutral-400 hover:text-[#76B900] transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-neutral-300">{code}</code>
      </pre>
    </div>
  );
};

const EndpointCard = ({ method, path, description, children }) => {
  const methodColors = {
    GET: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    POST: "text-[#76B900] border-[#76B900]/20 bg-[#76B900]/5",
    PUT: "text-orange-400 border-orange-400/20 bg-orange-400/5",
    DELETE: "text-red-400 border-red-400/20 bg-red-400/5",
  };

  return (
    <div className="border border-neutral-800 p-6 mb-8">
      <div className="flex items-start gap-4 mb-4">
        <span
          className={`text-xs font-mono px-2 py-1 border ${methodColors[method]}`}
        >
          {method}
        </span>
        <div className="flex-1">
          <code className="text-sm text-neutral-300 break-all">{path}</code>
          <p className="text-sm text-neutral-400 mt-2">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

const ParamTable = ({ params }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-neutral-800">
          <th className="text-left py-2 px-3 text-neutral-400 font-medium">
            Parameter
          </th>
          <th className="text-left py-2 px-3 text-neutral-400 font-medium">
            Type
          </th>
          <th className="text-left py-2 px-3 text-neutral-400 font-medium">
            Required
          </th>
          <th className="text-left py-2 px-3 text-neutral-400 font-medium">
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        {params.map((param, i) => (
          <tr key={i} className="border-b border-neutral-800/50">
            <td className="py-3 px-3 font-mono text-xs text-[#76B900]">
              {param.name}
            </td>
            <td className="py-3 px-3 text-neutral-400">{param.type}</td>
            <td className="py-3 px-3">
              {param.required ? (
                <span className="text-orange-400">Yes</span>
              ) : (
                <span className="text-neutral-500">No</span>
              )}
            </td>
            <td className="py-3 px-3 text-neutral-400">{param.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const QuickStatCard = ({ icon, label, value }) => (
  <div className="border border-neutral-800 p-4 bg-[#0D0F13]">
    <div className="flex items-center gap-2 mb-2 text-[#76B900]">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
    <div className="text-2xl font-light">{value}</div>
  </div>
);

export default function ApiDocs() {
  const navigate = useNavigate();

  const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "authentication", label: "Authentication" },
    { id: "links", label: "Links" },
    { id: "analytics", label: "Analytics" },
    { id: "redirect", label: "Redirect" },
    { id: "rate-limits", label: "Rate Limits" },
    { id: "errors", label: "Error Handling" },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

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
          <span className="text-sm text-neutral-500">API Documentation</span>
        </div>
      </nav>

      <div className="pt-16 max-w-[1600px] mx-auto">
        <div className="flex">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 border-r border-neutral-800 h-screen sticky top-16 overflow-y-auto">
            <div className="p-8">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-[#76B900] transition-colors"
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 px-5 md:px-12 py-12 flex gap-12">
            <div className="flex-1 max-w-3xl">
              {/* Introduction */}
              <section id="introduction" className="mb-20 scroll-mt-20">
                <h1 className="text-4xl font-light mb-6">API Documentation</h1>
                <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                  BitLink provides a RESTful API for programmatic link creation,
                  management, and analytics. All endpoints return JSON and use
                  standard HTTP response codes.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <QuickStatCard
                    icon={<Zap className="w-4 h-4" />}
                    label="Fast"
                    value="<100ms"
                  />
                  <QuickStatCard
                    icon={<Shield className="w-4 h-4" />}
                    label="Secure"
                    value="JWT Auth"
                  />
                  <QuickStatCard
                    icon={<BarChart3 className="w-4 h-4" />}
                    label="Scalable"
                    value="62⁶ IDs"
                  />
                </div>

                <div className="border border-neutral-800 p-6 bg-[#0D0F13]">
                  <div className="flex items-start gap-3">
                    <Terminal className="w-5 h-5 text-[#76B900] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium mb-2">Base URL</h3>
                      <code className="text-sm text-neutral-300 break-all">
                        https://api.bitlink.xyz
                      </code>
                    </div>
                  </div>
                </div>
              </section>

              {/* Authentication */}
              <section id="authentication" className="mb-20 scroll-mt-20">
                <h2 className="text-3xl font-light mb-6 flex items-center gap-3">
                  <Lock className="w-7 h-7 text-[#76B900]" />
                  Authentication
                </h2>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  BitLink uses JWT tokens for authentication. Include your token
                  in the Authorization header for all authenticated requests.
                </p>

                <h3 className="text-xl font-medium mb-4 text-neutral-300">
                  Login
                </h3>
                <CodeBlock
                  language="bash"
                  code={`curl -X POST https://api.bitlink.xyz/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "your_password"
  }'`}
                />

                <h3 className="text-xl font-medium mb-4 mt-8 text-neutral-300">
                  Using the Token
                </h3>
                <CodeBlock
                  language="bash"
                  code={`curl -X GET https://api.bitlink.xyz/api/links \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
                />

                <div className="border border-orange-400/20 bg-orange-400/5 p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-orange-400 mb-1">
                        Token Expiration
                      </h4>
                      <p className="text-xs text-neutral-400">
                        JWT tokens expire after 7 days. Store them securely and
                        refresh before expiration to maintain access.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Links Endpoints */}
              <section id="links" className="mb-20 scroll-mt-20">
                <h2 className="text-3xl font-light mb-6 flex items-center gap-3">
                  <Link2 className="w-7 h-7 text-[#76B900]" />
                  Link Management
                </h2>

                {/* Create Link (Guest) */}
                <EndpointCard
                  method="POST"
                  path="/api/links/guest/shorten"
                  description="Create a short link without authentication. Limited to 1 link per session."
                >
                  <h4 className="text-sm font-medium mb-3 text-neutral-300">
                    Request Body
                  </h4>
                  <ParamTable
                    params={[
                      {
                        name: "originalUrl",
                        type: "string",
                        required: true,
                        description:
                          "The URL to shorten (must be valid HTTP/HTTPS)",
                      },
                      {
                        name: "sessionId",
                        type: "string",
                        required: true,
                        description: "Unique guest session identifier",
                      },
                      {
                        name: "customAlias",
                        type: "string",
                        required: false,
                        description: "Custom short code (alphanumeric, unique)",
                      },
                    ]}
                  />
                  <h4 className="text-sm font-medium mb-3 mt-6 text-neutral-300">
                    Response (201)
                  </h4>
                  <CodeBlock
                    language="json"
                    code={`{
  "id": "507f1f77bcf86cd799439011",
  "originalUrl": "https://example.com/very-long-url",
  "shortUrl": "https://bitlink.xyz/r/my-link",
  "shortCode": "my-link",
  "clicks": 0,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "isGuestLink": true,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}`}
                  />
                  <div className="border border-neutral-800 p-4 mt-4 bg-[#0D0F13]">
                    <h5 className="text-xs font-medium text-neutral-300 mb-2">
                      Guest Limit Error (400)
                    </h5>
                    <CodeBlock
                      language="json"
                      code={`{
  "error": "Guest users can only create one link. Please sign up to create more links.",
  "requiresAuth": true
}`}
                    />
                  </div>
                </EndpointCard>

                {/* Create Link (Authenticated) */}
                <EndpointCard
                  method="POST"
                  path="/api/links"
                  description="Create a short link with authentication. No daily limits."
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-orange-400 font-medium">
                      Requires Authentication
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mb-3 text-neutral-300">
                    Request Body
                  </h4>
                  <ParamTable
                    params={[
                      {
                        name: "originalUrl",
                        type: "string",
                        required: true,
                        description: "The URL to shorten",
                      },
                      {
                        name: "customAlias",
                        type: "string",
                        required: false,
                        description: "Custom short code (alphanumeric, unique)",
                      },
                    ]}
                  />
                  <h4 className="text-sm font-medium mb-3 mt-6 text-neutral-300">
                    Response (201)
                  </h4>
                  <CodeBlock
                    language="json"
                    code={`{
  "id": "507f1f77bcf86cd799439011",
  "originalUrl": "https://example.com/article",
  "shortUrl": "https://bitlink.xyz/r/article-2025",
  "shortCode": "article-2025",
  "clicks": 0,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "isGuestLink": false,
  "qrCode": "data:image/png;base64,..."
}`}
                  />
                </EndpointCard>

                {/* Get All Links */}
                <EndpointCard
                  method="GET"
                  path="/api/links"
                  description="Retrieve all links created by the authenticated user, sorted by creation date (newest first)."
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-orange-400 font-medium">
                      Requires Authentication
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mb-3 text-neutral-300">
                    Response (200)
                  </h4>
                  <CodeBlock
                    language="json"
                    code={`[
  {
    "id": "507f1f77bcf86cd799439011",
    "originalUrl": "https://example.com",
    "shortUrl": "https://bitlink.xyz/r/abc123",
    "shortCode": "abc123",
    "clicks": 147,
    "createdAt": "2025-01-10T08:00:00.000Z",
    "isGuestLink": false,
    "qrCode": "data:image/png;base64,..."
  }
]`}
                  />
                </EndpointCard>

                {/* Update Link */}
                <EndpointCard
                  method="PUT"
                  path="/api/links/:id"
                  description="Update a link's URL or custom alias. QR code regenerates on alias change."
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-orange-400 font-medium">
                      Requires Authentication
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mb-3 text-neutral-300">
                    Request Body
                  </h4>
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
                        description: "New custom short code (must be unique)",
                      },
                    ]}
                  />
                  <h4 className="text-sm font-medium mb-3 mt-6 text-neutral-300">
                    Response (200)
                  </h4>
                  <CodeBlock
                    language="json"
                    code={`{
  "id": "507f1f77bcf86cd799439011",
  "originalUrl": "https://example.com/updated",
  "shortUrl": "https://bitlink.xyz/r/new-alias",
  "shortCode": "new-alias",
  "clicks": 147,
  "createdAt": "2025-01-10T08:00:00.000Z",
  "isGuestLink": false,
  "qrCode": "data:image/png;base64,..."
}`}
                  />
                </EndpointCard>

                {/* Delete Link */}
                <EndpointCard
                  method="DELETE"
                  path="/api/links/:id"
                  description="Permanently delete a short link."
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-orange-400 font-medium">
                      Requires Authentication
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mb-3 text-neutral-300">
                    Response (200)
                  </h4>
                  <CodeBlock
                    language="json"
                    code={`{
  "success": true
}`}
                  />
                </EndpointCard>

                {/* Migrate Guest Links */}
                <EndpointCard
                  method="POST"
                  path="/api/links/migrate"
                  description="Migrate guest links to authenticated account after signup."
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-orange-400 font-medium">
                      Requires Authentication
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mb-3 text-neutral-300">
                    Request Body
                  </h4>
                  <ParamTable
                    params={[
                      {
                        name: "sessionId",
                        type: "string",
                        required: true,
                        description: "Guest session ID to migrate from",
                      },
                    ]}
                  />
                  <h4 className="text-sm font-medium mb-3 mt-6 text-neutral-300">
                    Response (200)
                  </h4>
                  <CodeBlock
                    language="json"
                    code={`{
  "migratedCount": 1
}`}
                  />
                </EndpointCard>
              </section>

              {/* Analytics */}
              <section id="analytics" className="mb-20 scroll-mt-20">
                <h2 className="text-3xl font-light mb-6 flex items-center gap-3">
                  <BarChart3 className="w-7 h-7 text-[#76B900]" />
                  Analytics
                </h2>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  Access detailed analytics for individual links or aggregate
                  data across all your links.
                </p>

                {/* Link Analytics */}
                <EndpointCard
                  method="GET"
                  path="/api/analytics/:id"
                  description="Get detailed analytics for a specific link."
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-orange-400 font-medium">
                      Requires Authentication
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mb-3 text-neutral-300">
                    Query Parameters
                  </h4>
                  <ParamTable
                    params={[
                      {
                        name: "range",
                        type: "string",
                        required: false,
                        description:
                          "Time range: '7d', '30d', '90d', or 'all' (default)",
                      },
                    ]}
                  />
                  <h4 className="text-sm font-medium mb-3 mt-6 text-neutral-300">
                    Response (200)
                  </h4>
                  <CodeBlock
                    language="json"
                    code={`{
  "totalClicks": 1247,
  "clicksOverTime": [
    { "date": "2025-01-10", "clicks": 45 },
    { "date": "2025-01-11", "clicks": 67 }
  ],
  "referrers": [
    { "source": "Social", "count": 234 },
    { "source": "Direct", "count": 189 }
  ],
  "countries": [
    { "country": "US", "count": 456 },
    { "country": "GB", "count": 234 }
  ],
  "devices": [
    { "deviceType": "Mobile", "count": 687 },
    { "deviceType": "Desktop", "count": 445 }
  ],
  "browsers": [
    { "browser": "Chrome", "count": 567 },
    { "browser": "Safari", "count": 345 }
  ],
  "peakHours": [
    { "hour": 9, "clicks": 45 },
    { "hour": 14, "clicks": 67 }
  ],
  "link": {
    "id": "507f1f77bcf86cd799439011",
    "shortCode": "abc123",
    "shortUrl": "https://bitlink.xyz/r/abc123",
    "originalUrl": "https://example.com",
    "clicks": 1247,
    "createdAt": "2025-01-10T08:00:00.000Z",
    "lastAccessed": "2025-01-15T12:30:00.000Z"
  }
}`}
                  />
                </EndpointCard>

                {/* Global Analytics */}
                <EndpointCard
                  method="GET"
                  path="/api/analytics/global"
                  description="Get aggregate analytics across all your links."
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-orange-400 font-medium">
                      Requires Authentication
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mb-3 text-neutral-300">
                    Query Parameters
                  </h4>
                  <ParamTable
                    params={[
                      {
                        name: "range",
                        type: "string",
                        required: false,
                        description:
                          "Time range: '7d', '30d' (default), or '90d'",
                      },
                    ]}
                  />
                  <h4 className="text-sm font-medium mb-3 mt-6 text-neutral-300">
                    Response (200)
                  </h4>
                  <CodeBlock
                    language="json"
                    code={`{
  "totalLinks": 45,
  "totalClicks": 12847,
  "avgClicks": 285,
  "activeLinks": 42,
  "topLinks": [
    {
      "id": "507f1f77bcf86cd799439011",
      "shortCode": "abc123",
      "shortUrl": "https://bitlink.xyz/r/abc123",
      "originalUrl": "https://example.com",
      "clicks": 1247,
      "createdAt": "2025-01-10T08:00:00.000Z",
      "lastAccessed": "2025-01-15T12:30:00.000Z"
    }
  ],
  "trafficSources": [
    { "source": "Social", "count": 3456 },
    { "source": "Direct", "count": 2345 }
  ],
  "geographicData": [
    { "country": "US", "count": 5678 },
    { "country": "GB", "count": 2345 }
  ],
  "deviceDistribution": [
    { "deviceType": "Mobile", "count": 7890 },
    { "deviceType": "Desktop", "count": 4567 }
  ],
  "growthData": [
    { "date": "2025-01-10", "clicks": 234 },
    { "date": "2025-01-11", "clicks": 345 }
  ]
}`}
                  />
                </EndpointCard>

                {/* User Stats */}
                <EndpointCard
                  method="GET"
                  path="/api/analytics/stats"
                  description="Get quick summary statistics for your account. Active links = clicked in last 30 days."
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-orange-400 font-medium">
                      Requires Authentication
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mb-3 text-neutral-300">
                    Response (200)
                  </h4>
                  <CodeBlock
                    language="json"
                    code={`{
  "totalLinks": 45,
  "totalClicks": 12847,
  "activeLinks": 42,
  "avgClicks": 285
}`}
                  />
                </EndpointCard>
              </section>

              {/* Redirect */}
              <section id="redirect" className="mb-20 scroll-mt-20">
                <h2 className="text-3xl font-light mb-6">
                  Short Link Redirect
                </h2>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  The redirect endpoint resolves short codes to original URLs
                  and tracks analytics asynchronously.
                </p>

                <EndpointCard
                  method="GET"
                  path="/r/:code"
                  description="Redirect to original URL and track analytics."
                >
                  <h4 className="text-sm font-medium mb-3 text-neutral-300">
                    Behavior
                  </h4>
                  <ul className="space-y-2 text-sm text-neutral-400 mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-[#76B900] mt-1">•</span>
                      <span>Increments click counter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#76B900] mt-1">•</span>
                      <span>
                        Records analytics event (IP, device, browser, referrer,
                        geo)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#76B900] mt-1">•</span>
                      <span>
                        Updates lastAccessed and lastActivity timestamps
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#76B900] mt-1">•</span>
                      <span>Sets isActive to true</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#76B900] mt-1">•</span>
                      <span>Returns 302 redirect to original URL</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#76B900] mt-1">•</span>
                      <span>Returns 404 if link not found or expired</span>
                    </li>
                  </ul>

                  <h4 className="text-sm font-medium mb-3 text-neutral-300">
                    Example
                  </h4>
                  <CodeBlock
                    language="bash"
                    code={`curl -I https://bitlink.xyz/r/abc123

# HTTP/1.1 302 Found
# Location: https://example.com`}
                  />

                  <div className="border border-neutral-800 p-4 mt-6 bg-[#0D0F13]">
                    <h5 className="text-xs font-medium text-neutral-300 mb-2">
                      Analytics Tracked Per Click
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400">
                      <div>• IP Address</div>
                      <div>• User Agent</div>
                      <div>• Referrer</div>
                      <div>• Country & City (geoip)</div>
                      <div>• Device Type</div>
                      <div>• Browser</div>
                      <div>• Operating System</div>
                      <div>• Timestamp</div>
                    </div>
                  </div>
                </EndpointCard>
              </section>

              {/* Rate Limits */}
              <section id="rate-limits" className="mb-20 scroll-mt-20">
                <h2 className="text-3xl font-light mb-6">Rate Limits</h2>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  API rate limits vary by authentication status and plan tier.
                </p>

                <div className="border border-neutral-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800">
                        <th className="text-left py-3 px-4 text-neutral-400 font-medium">
                          Tier
                        </th>
                        <th className="text-left py-3 px-4 text-neutral-400 font-medium">
                          Links Limit
                        </th>
                        <th className="text-left py-3 px-4 text-neutral-400 font-medium">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-800/50">
                        <td className="py-3 px-4 text-neutral-300">Guest</td>
                        <td className="py-3 px-4 text-neutral-400">
                          1 per session
                        </td>
                        <td className="py-3 px-4 text-neutral-400">
                          No authentication
                        </td>
                      </tr>
                      <tr className="border-b border-neutral-800/50">
                        <td className="py-3 px-4 text-neutral-300">Free</td>
                        <td className="py-3 px-4 text-neutral-400">50/day</td>
                        <td className="py-3 px-4 text-neutral-400">
                          Authenticated users
                        </td>
                      </tr>
                      <tr className="border-b border-neutral-800/50">
                        <td className="py-3 px-4 text-neutral-300">Pro</td>
                        <td className="py-3 px-4 text-neutral-400">
                          Unlimited
                        </td>
                        <td className="py-3 px-4 text-neutral-400">
                          Full API access
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-neutral-300">
                          Enterprise
                        </td>
                        <td className="py-3 px-4 text-neutral-400">
                          Unlimited
                        </td>
                        <td className="py-3 px-4 text-neutral-400">
                          Custom SLA
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Error Handling */}
              <section id="errors" className="mb-20 scroll-mt-20">
                <h2 className="text-3xl font-light mb-6">Error Handling</h2>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  BitLink uses conventional HTTP response codes. All error
                  responses include an error field.
                </p>

                <div className="border border-neutral-800 mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800">
                        <th className="text-left py-3 px-4 text-neutral-400 font-medium">
                          Code
                        </th>
                        <th className="text-left py-3 px-4 text-neutral-400 font-medium">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-800/50">
                        <td className="py-3 px-4 font-mono text-[#76B900]">
                          200
                        </td>
                        <td className="py-3 px-4 text-neutral-400">Success</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50">
                        <td className="py-3 px-4 font-mono text-[#76B900]">
                          201
                        </td>
                        <td className="py-3 px-4 text-neutral-400">Created</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50">
                        <td className="py-3 px-4 font-mono text-orange-400">
                          400
                        </td>
                        <td className="py-3 px-4 text-neutral-400">
                          Bad Request - Invalid parameters
                        </td>
                      </tr>
                      <tr className="border-b border-neutral-800/50">
                        <td className="py-3 px-4 font-mono text-orange-400">
                          401
                        </td>
                        <td className="py-3 px-4 text-neutral-400">
                          Unauthorized - Invalid or missing token
                        </td>
                      </tr>
                      <tr className="border-b border-neutral-800/50">
                        <td className="py-3 px-4 font-mono text-orange-400">
                          404
                        </td>
                        <td className="py-3 px-4 text-neutral-400">
                          Not Found - Resource doesn't exist
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-red-400">
                          500
                        </td>
                        <td className="py-3 px-4 text-neutral-400">
                          Internal Server Error
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4 className="text-sm font-medium mb-3 text-neutral-300">
                  Common Error Responses
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-neutral-400 mb-2">
                      Failed to create link:
                    </p>
                    <CodeBlock
                      language="json"
                      code={`{
  "error": "Failed to create link"
}`}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-2">
                      Guest limit reached:
                    </p>
                    <CodeBlock
                      language="json"
                      code={`{
  "error": "Guest users can only create one link. Please sign up to create more links.",
  "requiresAuth": true
}`}
                    />
                  </div>
                </div>
              </section>

              {/* Support Section */}
              <section className="border-t border-neutral-800 pt-12">
                <h2 className="text-2xl font-light mb-6">Need Help?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-neutral-800 p-6">
                    <h3 className="text-sm font-medium mb-2">Support</h3>
                    <p className="text-xs text-neutral-400 mb-4">
                      Reach out to our team for technical assistance
                    </p>
                    <a
                      href="mailto:support@bitlink.xyz"
                      className="text-sm text-[#76B900] hover:text-[#8FD400] flex items-center gap-2"
                    >
                      support@bitlink.xyz
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="border border-neutral-800 p-6">
                    <h3 className="text-sm font-medium mb-2">Status</h3>
                    <p className="text-xs text-neutral-400 mb-4">
                      Check real-time API status and uptime
                    </p>
                    <a
                      href="https://status.bitlink.xyz"
                      className="text-sm text-[#76B900] hover:text-[#8FD400] flex items-center gap-2"
                    >
                      status.bitlink.xyz
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Sidebar - Key Features */}
            <aside className="hidden xl:block w-80">
              <div className="sticky top-24">
                <h3 className="text-sm font-medium mb-4 text-neutral-300">
                  Key Features
                </h3>
                <div className="space-y-3">
                  <div className="border border-neutral-800 p-4">
                    <div className="flex items-center gap-2 text-[#76B900] mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">Response Time</span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Sub-100ms API responses with Redis caching for hot
                      redirects
                    </p>
                  </div>

                  <div className="border border-neutral-800 p-4">
                    <div className="flex items-center gap-2 text-[#76B900] mb-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-xs font-medium">Security</span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      JWT authentication, bcrypt hashing, and strict CORS
                      configuration
                    </p>
                  </div>

                  <div className="border border-neutral-800 p-4">
                    <div className="flex items-center gap-2 text-[#76B900] mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-medium">Scalability</span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Stateless backend designed for horizontal scaling with
                      load balancing
                    </p>
                  </div>

                  <div className="border border-neutral-800 p-4">
                    <div className="flex items-center gap-2 text-[#76B900] mb-2">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-xs font-medium">Analytics</span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Event-based tracking with device, browser, geo, and
                      referrer data
                    </p>
                  </div>

                  <div className="border border-neutral-800 p-4">
                    <div className="flex items-center gap-2 text-[#76B900] mb-2">
                      <Globe className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        Geo Resolution
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Automatic country and city detection using geoip-lite
                    </p>
                  </div>

                  <div className="border border-neutral-800 p-4">
                    <div className="flex items-center gap-2 text-[#76B900] mb-2">
                      <Smartphone className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        Device Detection
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      UA parsing for browser, OS, and device type classification
                    </p>
                  </div>

                  <div className="border border-neutral-800 p-4">
                    <div className="flex items-center gap-2 text-[#76B900] mb-2">
                      <MousePointerClick className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        Click Tracking
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Asynchronous analytics recording that never blocks
                      redirects
                    </p>
                  </div>
                </div>

                <div className="mt-6 border border-neutral-800 p-4 bg-[#0D0F13]">
                  <h4 className="text-xs font-medium mb-3 text-neutral-300">
                    Quick Links
                  </h4>
                  <div className="space-y-2 text-xs">
                    <a
                      href="#introduction"
                      className="block text-neutral-400 hover:text-[#76B900]"
                    >
                      Getting Started
                    </a>
                    <a
                      href="#authentication"
                      className="block text-neutral-400 hover:text-[#76B900]"
                    >
                      Authentication
                    </a>
                    <a
                      href="#links"
                      className="block text-neutral-400 hover:text-[#76B900]"
                    >
                      Link Management
                    </a>
                    <a
                      href="#analytics"
                      className="block text-neutral-400 hover:text-[#76B900]"
                    >
                      Analytics API
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}
