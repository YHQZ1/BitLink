import { useEffect, useState } from "react";
import SleepMode from "../pages/SleepMode";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function CheckingBackend() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-sm uppercase tracking-widest text-gray-400 mb-4">
          System status
        </div>

        <div className="text-2xl font-light mb-2">
          Checking backend availability
        </div>

        <div className="text-sm text-gray-500">Please wait a moment</div>
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
      .catch(() => {
        setBackendState("down");
      })
      .finally(() => clearTimeout(timeout));

    return () => clearTimeout(timeout);
  }, []);

  if (backendState === "checking") return <CheckingBackend />;
  if (backendState === "down") return <SleepMode />;

  return children;
}
