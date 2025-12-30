import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const token = searchParams.get("token");
  const isNewUser = searchParams.get("isNewUser") === "true";

  useEffect(() => {
    if (token) {
      localStorage.setItem("jwtToken", token);

      // Animate progress bar
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      const redirectTimer = setTimeout(() => {
        navigate("/home");
      }, 1500);

      return () => {
        clearTimeout(redirectTimer);
        clearInterval(progressInterval);
      };
    } else {
      navigate("/auth");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#0B0D10] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#76B900]/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#76B900]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative text-center max-w-md w-full">
        {/* Success Icon with animation */}
        <div className="mb-8 relative inline-block">
          <div className="w-20 h-20 bg-[#76B900] rounded-full flex items-center justify-center mx-auto relative z-10 animate-scale-in">
            <CheckCircle2 className="w-10 h-10 text-black" strokeWidth={2.5} />
          </div>

          {/* Ripple effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-[#76B900]/30 rounded-full animate-ping"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 bg-[#76B900]/20 rounded-full animate-ping"
              style={{ animationDelay: "0.3s" }}
            ></div>
          </div>

          {/* Sparkles */}
          {isNewUser && (
            <>
              <Sparkles className="w-5 h-5 text-[#76B900] absolute -top-2 -right-2 animate-pulse" />
              <Sparkles
                className="w-4 h-4 text-[#76B900] absolute -bottom-1 -left-1 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </>
          )}
        </div>

        {/* Text content */}
        <h2 className="text-3xl font-light text-white mb-3 animate-fade-in">
          {isNewUser ? (
            <>
              Welcome to <span className="text-[#76B900]">BitLink</span>!
            </>
          ) : (
            "Welcome back!"
          )}
        </h2>

        <p
          className="text-neutral-400 mb-8 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {isNewUser
            ? "Your account has been created successfully"
            : "Authentication successful"}
        </p>

        {/* Progress bar */}
        <div
          className="w-full max-w-xs mx-auto animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#76B900] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-neutral-500 text-sm mt-3">
            Redirecting to dashboard...
          </p>
        </div>

        {/* Feature highlights for new users */}
        {isNewUser && (
          <div
            className="mt-12 pt-8 border-t border-neutral-800 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="text-neutral-400 text-sm mb-4">
              What you can do now:
            </p>
            <div className="flex flex-col gap-2 text-left">
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="w-1.5 h-1.5 bg-[#76B900] rounded-full"></div>
                <span>Create unlimited short links</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="w-1.5 h-1.5 bg-[#76B900] rounded-full"></div>
                <span>Track clicks and analytics</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="w-1.5 h-1.5 bg-[#76B900] rounded-full"></div>
                <span>Generate QR codes instantly</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
