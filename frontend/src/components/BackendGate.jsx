import { useEffect, useState } from "react";
import { Clock, Zap } from "lucide-react";
import SleepMode from "../pages/SleepMode";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function CheckingBackend() {
  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex items-center justify-center px-6">
      <div className="w-full max-w-3xl">
        <div className="border-l-2 border-neutral-900 pl-6 sm:pl-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-[#76B900]" />
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Checking system status
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-thin tracking-tight mb-6">
            Waking up
            <br />
            <span className="text-[#76B900]">BitLink services.</span>
          </h1>

          <p className="text-neutral-500 max-w-lg text-sm sm:text-base font-light leading-relaxed mb-10">
            We’re verifying backend availability and restoring active services
            if required. This usually takes only a moment.
          </p>

          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 text-neutral-600 mt-0.5" />
            <div className="text-sm text-neutral-600 font-light">
              You’ll be redirected automatically once the system is ready.
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-neutral-900 text-xs text-neutral-600 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#76B900] animate-pulse" />
          On-demand compute · Cost-aware infrastructure · Initializing services
        </div>
      </div>
    </div>
  );
}

export default function BackendGate({ children }) {
  const [backendState, setBackendState] = useState("checking");

  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 2000);

    fetch(`${BASE_URL}/health`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error();
        setBackendState("up");
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setBackendState("down");
        }
      })
      .finally(() => clearTimeout(timeout));

    return () => clearTimeout(timeout);
  }, []);

  if (backendState === "checking") return <CheckingBackend />;
  if (backendState === "down") return <SleepMode />;

  return children;
}
