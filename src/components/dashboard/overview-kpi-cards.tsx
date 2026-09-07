import React from "react";
import { DashboardStats, TimeHorizon } from "@/types/flow";

interface OverviewKpiCardsProps {
  stats: DashboardStats;
  currentPeriod: TimeHorizon;
}

export function OverviewKpiCards({ stats, currentPeriod }: OverviewKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Card 1: Primary Spotlight */}
      <div className="p-6 sm:p-7 rounded-[20px] sm:rounded-[24px] bg-klarna-canvas border border-klarna-border shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">
              Net Flow ({currentPeriod.toUpperCase()})
            </span>
            <span className="w-8 h-8 rounded-full bg-klarna-surface-2 text-klarna-ink flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </span>
          </div>
          <div className={`klarna-display text-3xl sm:text-4xl font-black mb-2 ${stats.totalSum >= 0 ? "text-klarna-success" : "text-klarna-error"}`}>
            {stats.totalSum >= 0 ? "+" : ""}${stats.totalSum.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M
          </div>
          <p className="text-xs text-klarna-muted">Total capital entering spot trusts</p>
        </div>
        <div className="pt-4 border-t border-klarna-border flex items-center justify-between text-xs mt-4">
          <span className={`font-bold flex items-center gap-1 font-finance ${stats.delta >= 0 ? "text-klarna-success" : "text-klarna-error"}`}>
            {stats.delta >= 0 ? "+" : ""}${Math.abs(stats.delta).toFixed(1)}M ({stats.delta >= 0 ? "+" : ""}{stats.deltaPct}%)
          </span>
          <span className="text-klarna-subdued font-medium">vs prior</span>
        </div>
      </div>

      {/* Card 2: Latest Session */}
      <div className="p-6 sm:p-7 rounded-[20px] sm:rounded-[24px] bg-klarna-canvas border border-klarna-border shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Latest ({stats.latest.label})</span>
            <span className="w-8 h-8 rounded-full bg-klarna-surface-2 text-klarna-ink flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </span>
          </div>
          <div className={`klarna-display text-3xl sm:text-4xl font-bold mb-2 font-finance ${stats.latest.total >= 0 ? "text-klarna-ink" : "text-klarna-error"}`}>
            {stats.latest.total >= 0 ? "+" : ""}${stats.latest.total.toFixed(1)}M
          </div>
        </div>
        <div className="pt-4 border-t border-klarna-border flex items-center justify-between text-xs text-klarna-muted mt-4">
          <span className="text-klarna-success font-bold">{stats.inflowCount} Inflow</span>
          <span className="text-klarna-error font-bold">{stats.outflowCount} Outflow</span>
        </div>
      </div>

      {/* Card 3: Dominant Fund (IBIT) */}
      <div className="p-6 sm:p-7 rounded-[20px] sm:rounded-[24px] bg-klarna-canvas border border-klarna-border shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Dominant Fund</span>
            <span className="px-2.5 py-0.5 rounded-full bg-klarna-pink text-klarna-ink text-xs font-bold font-mono">IBIT</span>
          </div>
          <div className="klarna-display text-3xl sm:text-4xl text-klarna-ink font-bold mb-2 font-finance">
            {stats.ibitSum >= 0 ? "+" : ""}${Math.abs(stats.ibitSum) >= 1000 ? (stats.ibitSum / 1000).toFixed(2) + "B" : stats.ibitSum.toFixed(1) + "M"}
          </div>
        </div>
        <div className="pt-4 border-t border-klarna-border space-y-1.5 mt-4">
          <div className="flex justify-between text-xs text-klarna-muted font-medium">
            <span>BlackRock Share</span>
            <span className="text-klarna-ink font-mono font-bold">{stats.ibitShare}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-klarna-surface-2 overflow-hidden">
            <div className="h-full bg-klarna-ink rounded-full transition-all duration-500" style={{ width: `${stats.ibitShare}%` }}></div>
          </div>
        </div>
      </div>

      {/* Card 4: Cumulative All-Time */}
      <div className="p-6 sm:p-7 rounded-[20px] sm:rounded-[24px] bg-klarna-canvas border border-klarna-border shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Total Net</span>
            <span className="w-8 h-8 rounded-full bg-klarna-surface-2 text-klarna-muted flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </span>
          </div>
          <div className="klarna-display text-3xl sm:text-4xl text-klarna-ink font-bold mb-2 font-finance">
            +$21.14B
          </div>
          <p className="text-xs text-klarna-muted">All-time net ETF inflow</p>
        </div>
        <div className="pt-4 border-t border-klarna-border flex items-center justify-between text-xs text-klarna-muted mt-4">
          <span className="text-klarna-subdued font-medium">Reserves:</span>
          <span className="text-klarna-ink font-mono font-bold">~341,200 BTC</span>
        </div>
      </div>
    </div>
  );
}
