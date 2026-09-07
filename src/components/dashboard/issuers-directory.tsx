"use client";

import React from "react";
import { Issuer, IssuerSortOption } from "@/types/flow";
import { formatFlowValue } from "@/utils/formatters";

interface IssuersDirectoryProps {
  issuers: Issuer[];
  issuerSort: IssuerSortOption;
  onSortChange: (sort: IssuerSortOption) => void;
}

export function IssuersDirectory({
  issuers,
  issuerSort,
  onSortChange,
}: IssuersDirectoryProps) {
  return (
    <section id="issuers" className="w-full min-w-0 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Market Participants</span>
          <h2 className="klarna-heading text-2xl sm:text-4xl text-klarna-ink mt-1">
            Spot Bitcoin ETF Issuers
          </h2>
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <label htmlFor="issuerSortSelect" className="text-xs font-semibold text-klarna-muted shrink-0">
            Sort by:
          </label>
          <select
            id="issuerSortSelect"
            value={issuerSort}
            onChange={(e) => onSortChange(e.target.value as IssuerSortOption)}
            className="w-full sm:w-auto px-4 py-2 rounded-full bg-klarna-canvas border border-klarna-border text-xs text-klarna-ink font-semibold focus-ring cursor-pointer shadow-card"
          >
            <option value="inflow">Total Inflow (High to Low)</option>
            <option value="fee">Expense Ratio (Low to High)</option>
            <option value="ticker">Ticker (Alphabetical)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {issuers.map((issuer) => {
          const formattedInflow = formatFlowValue(issuer.totalInflow);

          return (
            <div
              key={issuer.ticker}
              className={`p-5 sm:p-6 rounded-[20px] sm:rounded-[24px] bg-klarna-canvas shadow-card hover:shadow-elevated transition-all flex flex-col justify-between relative ${
                issuer.isLeader ? "border-2 border-klarna-pink" : "border border-klarna-border"
              }`}
            >
              {issuer.highlight && (
                <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-klarna-pink text-klarna-ink text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {issuer.highlight}
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono font-bold text-sm px-2.5 py-1 rounded-full ${issuer.isLeader ? "bg-klarna-ink text-white" : "bg-klarna-surface-2 text-klarna-ink"}`}>
                    {issuer.ticker}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${issuer.isNegative ? "bg-red-50 text-klarna-error" : "bg-klarna-surface-2 text-klarna-ink"}`}>
                    Fee: {issuer.fee.toFixed(2)}%
                  </span>
                </div>
                <h3 className="font-title font-bold text-base sm:text-lg text-klarna-ink">{issuer.name}</h3>
                <p className="text-xs text-klarna-muted mt-0.5">{issuer.manager}</p>
              </div>
              <div className="mt-5 sm:mt-6 pt-4 border-t border-klarna-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-klarna-subdued">Latest Session</span>
                  <span className={`font-finance font-bold text-sm sm:text-base ${issuer.latestSession >= 0 ? "text-klarna-success" : "text-klarna-error"}`}>
                    {issuer.latestSession >= 0 ? "+" : ""}${issuer.latestSession.toFixed(1)}M
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-klarna-subdued">
                    {issuer.isNegative ? "Net Conversions" : "Total Inflows"}
                  </span>
                  <span className={`font-finance font-bold text-sm sm:text-base ${issuer.totalInflow >= 0 ? "text-klarna-ink" : "text-klarna-error"}`}>
                    {issuer.totalInflow >= 0 ? "+" : ""}${formattedInflow}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
