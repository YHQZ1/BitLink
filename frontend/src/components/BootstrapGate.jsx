import { useEffect, useState } from "react";
import SleepMode from "../pages/SleepMode";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const CHECK_INTERVAL_MS = 2000;
const REQUEST_TIMEOUT_MS = 1500;

export default function BootstrapGate({ children }) {
  const [backendUp, setBackendUp] = useState(() => {
    return sessionStorage.getItem("backend-up") === "true";
  });

  useEffect(() => {
    if (backendUp) return;

    const checkBackend = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
      );

      try {
        const res = await fetch(`${BASE_URL}/health`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error();

        sessionStorage.setItem("backend-up", "true");
        setBackendUp(true);
      } catch {
        // silent retry
      } finally {
        clearTimeout(timeoutId);
      }
    };

    checkBackend();

    const interval = setInterval(checkBackend, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [backendUp]);

  if (!backendUp) return <SleepMode />;

  return children;
}
