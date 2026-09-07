"use client";

import React from "react";
import { TimeHorizon } from "@/types/flow";

interface HeroBannerProps {
  currentPeriod: TimeHorizon;
  onSelectPeriod: (period: TimeHorizon) => void;
  syncTime: string;
  isSyncing: boolean;
  onTriggerSync: () => void;
}

const horizons: TimeHorizon[] = ["7d", "30d", "90d", "ytd", "all"];

export function HeroBanner({
  currentPeriod,
  onSelectPeriod,
  syncTime,
  isSyncing,
  onTriggerSync,
}: HeroBannerProps) {
  return (
    <div className="p-6 sm:p-12 lg:p-16 rounded-[24px] sm:rounded-[32px] bg-klarna-pink text-klarna-ink shadow-pink-glow relative overflow-hidden flex flex-col justify-between gap-6 sm:gap-10">
      <div className="max-w-3xl space-y-4 sm:space-y-6">
        <div className="inline-flex items-center px-3.5 sm:px-4 py-1.5 rounded-full bg-white/80 border border-black/10 text-klarna-ink text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
          <span>Institutional Capital Tracker</span>
        </div>

        <h1 className="klarna-display text-3xl sm:text-5xl lg:text-7xl text-klarna-ink font-black break-words">
          Where institutional capital <br className="hidden sm:inline" />
          flows into Bitcoin.
        </h1>

        <p className="text-klarna-ink/85 text-sm sm:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl">
          Live net inflows, redemptions, and historical liquidity trends across all 11 US Spot Bitcoin ETFs. Clean, transparent, and effortlessly accessible.
        </p>
      </div>

      {/* Period Horizon Selector & Sync Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 sm:pt-6 border-t border-black/10">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs text-klarna-ink/80">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-klarna-ink/75">
            <span>Horizon:</span>
            <span className="text-klarna-ink font-black font-mono">{currentPeriod.toUpperCase()}</span>
          </div>

          <span className="text-black/20 hidden sm:inline">•</span>

          {/* Sync Time & Refresh (clean layout, no active green dot) */}
          <div className="flex items-center gap-2">
            <span className="text-klarna-ink/70">Pembaruan:</span>
            <span className="font-bold text-klarna-ink font-mono">{syncTime}</span>
            <button
              type="button"
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 hover:bg-white border border-black/10 text-[11px] font-bold text-klarna-ink transition-all shadow-xs cursor-pointer focus-ring"
              title="Perbarui data ETF"
              aria-label="Perbarui data ETF"
            >
              <svg
                className={`w-3 h-3 text-klarna-ink ${isSyncing ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
              <span>{isSyncing ? "Sinkron..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        <div className="inline-flex p-1 sm:p-1.5 rounded-full bg-white shadow-sm border border-black/5 overflow-x-auto no-scrollbar max-w-full" role="group" aria-label="Time Horizon Filters">
          {horizons.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onSelectPeriod(p)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all focus-ring cursor-pointer shrink-0 ${
                currentPeriod === p ? "bg-klarna-ink text-white" : "text-klarna-muted hover:text-klarna-ink"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
