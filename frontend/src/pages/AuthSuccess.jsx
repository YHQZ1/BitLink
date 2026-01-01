import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const token = searchParams.get("token");
  const isNewUser = searchParams.get("isNewUser") === "true";

  useEffect(() => {
    if (token) {
      localStorage.setItem("jwtToken", token);

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
    <div className="min-h-screen bg-[#0B0D10] flex items-center justify-center px-5">
      <div className="max-w-md w-full">
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 border-2 border-[#76B900] flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#76B900]" strokeWidth={2} />
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-[#F5F7FA] mb-4">
            {isNewUser ? "Welcome aboard" : "Welcome back"}
          </h1>
          <p className="text-neutral-400 text-lg">
            {isNewUser
              ? "Your account is ready to go"
              : "Authentication successful"}
          </p>
        </div>

        <div className="mb-12">
          <div className="h-[2px] bg-neutral-800 w-full overflow-hidden">
            <div
              className="h-full bg-[#76B900] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="text-neutral-500">Redirecting to homepage</span>
            <span className="text-[#76B900]">{progress}%</span>
          </div>
        </div>

        {isNewUser && (
          <div className="border border-neutral-800 p-6">
            <p className="text-sm text-neutral-400 mb-4">What's next:</p>
            <div className="space-y-3">
              {[
                "Create unlimited short links",
                "Track detailed analytics",
                "Generate QR codes",
                "Customize your links",
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-[#F5F7FA]"
                >
                  <div className="w-1 h-1 bg-[#76B900]"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isNewUser && (
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
            <span>Taking you to your homepage</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
