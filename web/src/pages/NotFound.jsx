import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Link2 } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pt-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-baseline gap-3 mb-4">
              <div className="h-px w-16 bg-neutral-800"></div>
              <p className="text-neutral-600 text-xs uppercase tracking-[0.3em]">
                Error 404
              </p>
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-thin text-white leading-[0.9] tracking-tight mb-3">
              404
            </h1>
            <p className="text-neutral-500 text-base">Page not found</p>
          </div>

          {/* Message Section */}
          <div className="border-t border-neutral-900 pt-8 pb-10 mb-10">
            <p className="text-xl sm:text-2xl font-light text-white mb-4">
              This page doesn't exist
            </p>
            <p className="text-neutral-500 text-sm sm:text-base max-w-xl">
              The page you're looking for doesn't exist or the link may have
              expired. Try going back or visit the homepage to find what you
              need.
            </p>
          </div>

          {/* Icon Section */}
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-neutral-900">
            <div className="w-20 h-20 border-2 border-neutral-900 flex items-center justify-center flex-shrink-0">
              <Link2 className="w-10 h-10 text-neutral-700" />
            </div>
            <div>
              <div className="text-sm text-neutral-600 uppercase tracking-wider mb-1">
                Lost Link
              </div>
              <div className="text-xs text-neutral-700">
                The short link you're trying to access may have been removed or
                never existed
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="border-2 border-neutral-800 text-neutral-400 px-8 py-3 font-medium hover:border-neutral-700 hover:text-white transition-all text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-neutral-600">
            Need help?{" "}
            <button
              onClick={() => navigate("/home")}
              className="text-[#76B900] hover:text-[#8FD400] transition-colors cursor-pointer"
            >
              Visit your dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
