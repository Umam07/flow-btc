"use client";

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { ChartMode, DashboardStats, FlowRecord } from "@/types/flow";

interface FlowDynamicsChartProps {
  filteredData: FlowRecord[];
  currentChartMode: ChartMode;
  showMovingAverage: boolean;
  stats: DashboardStats;
  onSelectMode: (mode: ChartMode) => void;
  onToggleMovingAverage: () => void;
}

export function FlowDynamicsChart({
  filteredData,
  currentChartMode,
  showMovingAverage,
  stats,
  onSelectMode,
  onToggleMovingAverage,
}: FlowDynamicsChartProps) {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Chart rendering with Chart.js
  useEffect(() => {
    if (!chartCanvasRef.current) return;
    const ctx = chartCanvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const labels = filteredData.map((d) => d.label);

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0E0E0E",
          titleColor: "#FFFFFF",
          bodyColor: "#FFB3C7",
          borderColor: "#E3E0DC",
          borderWidth: 1,
          padding: 14,
          cornerRadius: 14,
          titleFont: { family: "Plus Jakarta Sans", weight: "bold" as const, size: 13 },
          bodyFont: { family: "JetBrains Mono", size: 12 },
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || "";
              const val = context.parsed.y;
              if (val === null || val === undefined) return "";
              const sign = val > 0 ? "+" : "";
              return ` ${label}: ${sign}$${val}M`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(227, 224, 220, 0.5)", drawBorder: false },
          ticks: { color: "#767676", font: { family: "Plus Jakarta Sans", size: 11 } },
        },
        y: {
          grid: { color: "rgba(227, 224, 220, 0.5)", drawBorder: false },
          ticks: {
            color: "#767676",
            font: { family: "Plus Jakarta Sans", size: 11 },
            callback: (v: any) => (v >= 0 ? "+" : "") + "$" + v + "M",
          },
        },
      },
    };

    if (currentChartMode === "daily") {
      const totals = filteredData.map((d) => d.total);
      const barColors = totals.map((v) => (v >= 0 ? "#0E0E0E" : "#D6332E"));

      const datasets: any[] = [];

      if (showMovingAverage) {
        const sma7 = totals.map((_, idx, arr) => {
          if (idx < 2) return null;
          const windowSlice = arr.slice(Math.max(0, idx - 4), idx + 1);
          return (windowSlice.reduce((a, b) => a + b, 0) / windowSlice.length).toFixed(1);
        });

        datasets.push({
          type: "line",
          label: "7D Moving Avg",
          data: sma7,
          borderColor: "#F58BA6",
          borderWidth: 3,
          pointRadius: 0,
          tension: 0.35,
          order: 1,
        });
      }

      datasets.push({
        type: "bar",
        label: "Net Flow ($M)",
        data: totals,
        backgroundColor: barColors,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.65,
        order: 2,
      });

      chartInstanceRef.current = new Chart(ctx, {
        data: { labels, datasets },
        options: commonOptions,
      });
    } else if (currentChartMode === "cumulative") {
      let runningTotal = 0;
      const cumulativeData = filteredData.map((d) => {
        runningTotal += d.total;
        return Math.round(runningTotal * 10) / 10;
      });

      const gradient = ctx.createLinearGradient(0, 0, 0, 420);
      gradient.addColorStop(0, "rgba(255, 179, 199, 0.45)");
      gradient.addColorStop(1, "rgba(255, 179, 199, 0.02)");

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Cumulative Net Inflow ($M)",
              data: cumulativeData,
              borderColor: "#0E0E0E",
              borderWidth: 3,
              backgroundColor: gradient,
              fill: true,
              tension: 0.35,
              pointBackgroundColor: "#FFB3C7",
              pointBorderColor: "#0E0E0E",
              pointBorderWidth: 2,
              pointHoverRadius: 6,
              pointRadius: 4,
            },
          ],
        },
        options: commonOptions,
      });
    } else if (currentChartMode === "breakdown") {
      const ibitData = filteredData.map((d) => d.ibit);
      const fbtcData = filteredData.map((d) => d.fbtc);
      const bitbData = filteredData.map((d) => d.bitb);
      const arkbData = filteredData.map((d) => d.arkb);
      const gbtcData = filteredData.map((d) => d.gbtc);
      const othersData = filteredData.map((d) => d.others);

      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            { label: "IBIT", data: ibitData, backgroundColor: "#0E0E0E", stack: "etf" },
            { label: "FBTC", data: fbtcData, backgroundColor: "#4A4A4A", stack: "etf" },
            { label: "BITB", data: bitbData, backgroundColor: "#767676", stack: "etf" },
            { label: "ARKB", data: arkbData, backgroundColor: "#FFB3C7", stack: "etf" },
            { label: "Others", data: othersData, backgroundColor: "#E3E0DC", stack: "etf" },
            { label: "GBTC", data: gbtcData, backgroundColor: "#D6332E", stack: "etf" },
          ],
        },
        options: {
          ...commonOptions,
          scales: {
            ...commonOptions.scales,
            x: { ...commonOptions.scales.x, stacked: true },
            y: { ...commonOptions.scales.y, stacked: true },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [filteredData, currentChartMode, showMovingAverage]);

  return (
    <section id="chart-section" className="w-full min-w-0 overflow-hidden p-5 sm:p-8 lg:p-10 rounded-[24px] sm:rounded-[28px] bg-klarna-canvas border border-klarna-border shadow-card space-y-6 sm:space-y-8">
      {/* Header & Mode Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 border-b border-klarna-border pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="klarna-heading text-2xl sm:text-3xl text-klarna-ink">
              Institutional Flow Dynamics
            </h2>
            <span className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full bg-klarna-surface-2 text-klarna-ink font-semibold">
              {currentChartMode === "daily" && "Daily Net Flow ($M)"}
              {currentChartMode === "cumulative" && "Cumulative Trajectory"}
              {currentChartMode === "breakdown" && "Fund Breakdown"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-klarna-muted mt-1.5">
            Tracking daily capital entries against institutional liquidations across US Spot Bitcoin ETFs.
          </p>
        </div>

        {/* Chart Mode Tabs */}
        <div className="inline-flex p-1 rounded-full bg-klarna-surface-2 border border-klarna-border self-start md:self-auto overflow-x-auto no-scrollbar max-w-full" role="tablist">
          {(
            [
              { id: "daily", label: "Daily Net Flow" },
              { id: "cumulative", label: "Cumulative Trajectory" },
              { id: "breakdown", label: "Fund Breakdown" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectMode(tab.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all focus-ring cursor-pointer shrink-0 ${
                currentChartMode === tab.id ? "bg-klarna-ink text-white" : "text-klarna-muted hover:text-klarna-ink"
              }`}
              role="tab"
              aria-selected={currentChartMode === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 py-1">
        <div className="p-4 sm:p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-klarna-subdued">Peak Day Inflow</span>
          <p className="font-finance text-lg sm:text-2xl font-black text-klarna-success mt-1">
            +${stats.peakInflow.toFixed(1)}M
          </p>
          <span className="text-[11px] sm:text-xs text-klarna-muted block mt-0.5">{stats.peakInflowDate}</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-klarna-subdued">Peak Day Outflow</span>
          <p className="font-finance text-lg sm:text-2xl font-black text-klarna-error mt-1">
            {stats.peakOutflow.toFixed(1)}M
          </p>
          <span className="text-[11px] sm:text-xs text-klarna-muted block mt-0.5">{stats.peakOutflowDate}</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-klarna-subdued">Positive Rate</span>
          <p className="font-finance text-lg sm:text-2xl font-black text-klarna-ink mt-1">{stats.posRate}%</p>
          <span className="text-[11px] sm:text-xs text-klarna-success font-semibold block mt-0.5">{stats.positiveCount} of {stats.totalDays} days</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-klarna-subdued">Average Daily</span>
          <p className="font-finance text-lg sm:text-2xl font-black text-klarna-ink mt-1">
            {stats.totalSum >= 0 ? "+" : ""}${stats.avgDaily}M
          </p>
          <span className="text-[11px] sm:text-xs text-klarna-muted block mt-0.5">Sustained net flow</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full max-w-full overflow-hidden h-[300px] sm:h-[440px] pt-2 sm:pt-4">
        <canvas ref={chartCanvasRef} aria-label="Bitcoin ETF Net Flows Chart" role="img" />
      </div>

      {/* Chart Legend & Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-klarna-border text-xs text-klarna-muted">
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-klarna-ink inline-block"></span>
            <span className="text-klarna-ink font-semibold">Net Inflow (+$)</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-klarna-error inline-block"></span>
            <span className="text-klarna-ink font-semibold">Net Outflow (-$)</span>
          </div>
          <button
            type="button"
            onClick={onToggleMovingAverage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-klarna-surface-2 hover:bg-klarna-border transition-colors focus-ring cursor-pointer"
            aria-pressed={showMovingAverage}
          >
            <span className="w-3.5 h-1.5 bg-klarna-pink-pressed inline-block rounded-full"></span>
            <span className={showMovingAverage ? "text-klarna-ink font-bold" : "text-klarna-subdued font-medium line-through"}>
              7D MA ({showMovingAverage ? "Active" : "Hidden"})
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-klarna-subdued text-[11px] sm:text-xs">
          <svg className="w-3.5 h-3.5 text-klarna-ink shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Tap bars to inspect fund volumes</span>
        </div>
      </div>
    </section>
  );
}
