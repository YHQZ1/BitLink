import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const isNewUser = searchParams.get("isNewUser") === "true";

  useEffect(() => {
    if (token) {
      localStorage.setItem("jwtToken", token);
      const redirectTimer = setTimeout(() => {
        navigate("/home");
      }, 1500);

      return () => clearTimeout(redirectTimer);
    } else {
      navigate("/auth");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-[#7ed957] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          {isNewUser ? "Welcome to BitLink!" : "Welcome back!"}
        </h2>
        <p className="text-gray-400">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
