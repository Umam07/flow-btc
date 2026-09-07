import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-klarna-border mt-16 sm:mt-24 py-8 sm:py-12 bg-klarna-canvas">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-klarna-pink flex items-center justify-center font-title font-black text-klarna-ink text-sm">
            ₿
          </div>
          <div>
            <p className="font-title font-bold text-sm text-klarna-ink">BTC Flow</p>
            <p className="text-xs text-klarna-muted">Created by Umam • Portfolio Project</p>
          </div>
        </div>

        <div className="text-xs text-klarna-muted text-center md:text-right max-w-md">
          Data scraped from public reporting at{" "}
          <a
            href="https://farside.co.uk/btc/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-klarna-ink font-bold underline focus-ring rounded"
          >
            farside.co.uk
          </a>
          . Built for informational and portfolio demonstration purposes. Not financial advice.
        </div>
      </div>
    </footer>
  );
}
