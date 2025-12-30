import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Link2, Search } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex items-center justify-center p-5">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <img src="/logo.png" alt="BitLink" className="w-10 h-10" />
          <span className="text-[24px] font-medium tracking-tight text-white">
            BitLink
          </span>
        </div>

        {/* Main Content */}
        <div className="border border-neutral-800 p-12 bg-[#0D0F13] text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <div className="text-[120px] font-light leading-none text-white mb-2">
              404
            </div>
            <div className="h-px bg-neutral-800 w-32 mx-auto"></div>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-light text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-neutral-400 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or the link may have
            expired.
          </p>

          {/* Icon */}
          <div className="flex justify-center mb-12">
            <div className="border border-neutral-800 p-6 inline-block">
              <Link2 className="w-12 h-12 text-neutral-600" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 bg-[#76B900] text-black px-6 py-3 font-medium hover:bg-[#8FD400] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 border border-neutral-800 text-neutral-300 px-6 py-3 font-medium hover:border-[#76B900] hover:text-[#76B900] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-sm">
            Need help?{" "}
            <button
              onClick={() => navigate("/home")}
              className="text-[#76B900] hover:text-[#8FD400] transition-colors cursor-pointer"
            >
              Visit your Homepage
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
