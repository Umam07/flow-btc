"use client";

import React from "react";
import { FlowDirectionFilter, FlowRecord } from "@/types/flow";

interface HistoricalLedgerProps {
  searchQuery: string;
  dirFilter: FlowDirectionFilter;
  displayedRows: FlowRecord[];
  totalTableRowsCount: number;
  showAllRows: boolean;
  onSearchChange: (q: string) => void;
  onDirFilterChange: (dir: FlowDirectionFilter) => void;
  onToggleShowAllRows: () => void;
  onClearFilters: () => void;
}

export function HistoricalLedger({
  searchQuery,
  dirFilter,
  displayedRows,
  totalTableRowsCount,
  showAllRows,
  onSearchChange,
  onDirFilterChange,
  onToggleShowAllRows,
  onClearFilters,
}: HistoricalLedgerProps) {
  return (
    <section id="historical-data" className="w-full min-w-0 space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Granular Records</span>
          <h2 className="klarna-heading text-2xl sm:text-4xl text-klarna-ink mt-1">
            Historical ETF Flow Ledger
          </h2>
          <p className="text-xs sm:text-sm text-klarna-muted mt-1">
            Data sourced from{" "}
            <a
              href="https://farside.co.uk/btc/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-klarna-ink font-bold underline focus-ring rounded"
            >
              farside.co.uk
            </a>{" "}
            table parsing.
          </p>
        </div>

        {/* Search and Filters - Full width on mobile */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <svg
              className="w-4 h-4 text-klarna-subdued absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Filter date (e.g. Sep 04)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Filter records by date"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-klarna-canvas border border-klarna-border text-xs text-klarna-ink placeholder-klarna-subdued focus-ring transition-all shadow-card"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              value={dirFilter}
              onChange={(e) => onDirFilterChange(e.target.value as FlowDirectionFilter)}
              aria-label="Filter records by flow direction"
              className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2.5 rounded-full bg-klarna-canvas border border-klarna-border text-xs text-klarna-ink font-semibold focus-ring cursor-pointer shadow-card"
            >
              <option value="all">All Sessions</option>
              <option value="inflow">Inflows Only (+$)</option>
              <option value="outflow">Outflows Only (-$)</option>
            </select>
            <svg
              className="w-3.5 h-3.5 text-klarna-ink/70 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile swipe hint banner */}
      <div className="sm:hidden flex items-center justify-between px-3.5 py-2 rounded-xl bg-klarna-surface-2 border border-klarna-border text-[11px] text-klarna-muted font-medium">
        <span className="flex items-center gap-1.5">
          <span>👉</span>
          <span>Geser tabel ke samping untuk detail ETF</span>
        </span>
        <span className="font-mono font-bold text-klarna-ink text-[10px]">11 FUNDS</span>
      </div>

      {/* Table Container */}
      <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-[20px] sm:rounded-[24px] border border-klarna-border bg-klarna-canvas shadow-card">
        <table className="w-full text-left text-sm border-collapse" aria-label="Historical daily ETF flows">
          <thead>
            <tr className="border-b border-klarna-border bg-klarna-surface-2 text-[11px] font-mono uppercase text-klarna-muted tracking-wider">
              <th scope="col" className="py-3.5 sm:py-4 px-3 sm:px-4 font-bold text-klarna-ink whitespace-nowrap">Date</th>
              <th scope="col" className="py-3.5 sm:py-4 px-3 sm:px-4 font-bold text-klarna-ink whitespace-nowrap">Total Net Flow</th>
              <th scope="col" className="py-3.5 sm:py-4 px-3 font-bold text-klarna-success whitespace-nowrap">IBIT (BlackRock)</th>
              <th scope="col" className="py-3.5 sm:py-4 px-3 font-bold text-klarna-ink whitespace-nowrap">FBTC (Fidelity)</th>
              <th scope="col" className="py-3.5 sm:py-4 px-3 font-bold text-klarna-ink whitespace-nowrap">BITB (Bitwise)</th>
              <th scope="col" className="py-3.5 sm:py-4 px-3 font-bold text-klarna-ink whitespace-nowrap">ARKB (ARK)</th>
              <th scope="col" className="py-3.5 sm:py-4 px-3 font-bold text-klarna-error whitespace-nowrap">GBTC (Grayscale)</th>
              <th scope="col" className="py-3.5 sm:py-4 px-3 font-bold text-klarna-ink whitespace-nowrap">Others</th>
              <th scope="col" className="py-3.5 sm:py-4 px-3 sm:px-4 font-bold text-right text-klarna-ink whitespace-nowrap">Session</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-klarna-border font-finance text-xs">
            {displayedRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-14 px-4 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-klarna-surface-2 flex items-center justify-center text-klarna-ink">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                    <p className="text-klarna-ink font-title font-bold text-sm">No recorded sessions found</p>
                    <p className="text-xs text-klarna-muted max-w-sm">No ETF flow records match your current search query or direction filter.</p>
                    <button
                      type="button"
                      onClick={onClearFilters}
                      className="btn-pill-press mt-2 px-5 py-2 rounded-full bg-klarna-ink text-white text-xs font-bold hover:bg-black transition-all focus-ring cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              displayedRows.map((r) => {
                const isPos = r.total >= 0;
                return (
                  <tr key={r.date} className="hover:bg-klarna-surface-1 transition-colors">
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 font-bold text-klarna-ink whitespace-nowrap">{r.label}, 2026</td>
                    <td className={`py-3.5 sm:py-4 px-3 sm:px-4 font-bold text-xs sm:text-sm whitespace-nowrap ${isPos ? "text-klarna-success" : "text-klarna-error"}`}>
                      {isPos ? "+" : ""}${r.total.toFixed(1)}M
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 text-klarna-success font-medium whitespace-nowrap">
                      {r.ibit >= 0 ? "+" : ""}${r.ibit.toFixed(1)}M
                    </td>
                    <td className={`py-3.5 sm:py-4 px-3 whitespace-nowrap ${r.fbtc >= 0 ? "text-klarna-ink" : "text-klarna-error"}`}>
                      {r.fbtc >= 0 ? "+" : ""}${r.fbtc.toFixed(1)}M
                    </td>
                    <td className={`py-3.5 sm:py-4 px-3 whitespace-nowrap ${r.bitb >= 0 ? "text-klarna-ink" : "text-klarna-error"}`}>
                      {r.bitb >= 0 ? "+" : ""}${r.bitb.toFixed(1)}M
                    </td>
                    <td className={`py-3.5 sm:py-4 px-3 whitespace-nowrap ${r.arkb >= 0 ? "text-klarna-ink" : "text-klarna-error"}`}>
                      {r.arkb >= 0 ? "+" : ""}${r.arkb.toFixed(1)}M
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 font-semibold text-klarna-error whitespace-nowrap">
                      {r.gbtc >= 0 ? "+" : ""}${r.gbtc.toFixed(1)}M
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 text-klarna-muted whitespace-nowrap">
                      {r.others >= 0 ? "+" : ""}${r.others.toFixed(1)}M
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 text-right whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] font-bold ${
                          isPos ? "bg-emerald-50 text-klarna-success border border-emerald-200/60" : "bg-red-50 text-klarna-error border border-red-200/60"
                        }`}
                      >
                        {isPos ? "Net Inflow" : "Net Outflow"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Count and Pagination toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-klarna-muted px-1">
        <span>
          {displayedRows.length === 0
            ? "0 sessions found"
            : `Showing ${displayedRows.length} of ${totalTableRowsCount} recorded sessions`}
        </span>
        {totalTableRowsCount > 10 && (
          <button
            type="button"
            onClick={onToggleShowAllRows}
            className="text-klarna-ink hover:underline font-bold flex items-center gap-1.5 transition-colors focus-ring rounded p-1 cursor-pointer"
          >
            <span>{showAllRows ? "Show Recent 10 Sessions" : "Show Full 30-Day History"}</span>
            <svg
              className={`w-4 h-4 transition-transform ${showAllRows ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
