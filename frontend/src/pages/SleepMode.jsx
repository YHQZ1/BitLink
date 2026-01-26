import { Power, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

export default function SleepMode() {
  const [retrying, setRetrying] = useState(false);

  const retry = () => {
    setRetrying(true);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex items-center justify-center px-6">
      <div className="w-full max-w-3xl">
        <div className="border-l-2 border-neutral-900 pl-6 sm:pl-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Loader2 className="w-5 h-5 text-[#76B900] animate-spin" />
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Starting Server
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-thin tracking-tight mb-6">
            BitLink is
            <br />
            <span className="text-[#76B900]">starting up.</span>
          </h1>

          <p className="text-neutral-500 max-w-lg text-sm sm:text-base font-light leading-relaxed mb-6">
            The backend service goes to sleep during periods of inactivity to
            conserve resources. Your visit has triggered it to start back up.
          </p>

          <p className="text-neutral-500 max-w-lg text-sm sm:text-base font-light leading-relaxed mb-10">
            This typically takes about a minute. The page will automatically
            refresh once the server is ready.
          </p>

          {/* Status */}
          <div className="flex items-start gap-4 mb-10">
            <Clock className="w-5 h-5 text-neutral-600 mt-0.5" />
            <div className="text-sm text-neutral-600 font-light">
              Server initialization in progress.
              <br />
              You'll be redirected automatically when ready.
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={retry}
              disabled={retrying}
              className="border-2 border-[#76B900] text-[#76B900] px-6 py-3 hover:bg-[#76B900] hover:text-black transition-all cursor-pointer text-xs uppercase tracking-widest font-medium disabled:opacity-50"
            >
              {retrying ? "Checking…" : "Check Now"}
            </button>

            <a
              href="https://github.com/YHQZ1/BitLink"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors text-sm font-light flex items-center gap-2"
            >
              View on GitHub
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-16 pt-6 border-t border-neutral-900 text-xs text-neutral-600 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#76B900]" />
          On-demand infrastructure · Auto-scales to zero · Typical startup ~60s
        </div>
      </div>
    </div>
  );
}
