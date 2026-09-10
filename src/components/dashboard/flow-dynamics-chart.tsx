"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart as LineChartIcon,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Check,
} from "lucide-react";
import { ChartMode, DashboardStats, FlowRecord } from "@/types/flow";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const [activeTooltipSummary, setActiveTooltipSummary] = useState<string | null>(null);

  // Render chart with Chart.js
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
          backgroundColor: "rgba(14, 14, 14, 0.94)",
          titleColor: "#FFFFFF",
          bodyColor: "#FFB3C7",
          borderColor: "rgba(255, 179, 199, 0.3)",
          borderWidth: 1,
          padding: 14,
          cornerRadius: 16,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: { family: "system-ui, -apple-system, sans-serif", weight: "bold" as const, size: 13 },
          bodyFont: { family: "monospace", size: 12 },
          callbacks: {
            label: function (context: { dataset: { label?: string }; parsed: { y: number | null } }) {
              const label = context.dataset.label || "";
              const val = context.parsed.y;
              if (val === null || val === undefined) return "";
              const sign = val > 0 ? "+" : "";
              return `  ${label}: ${sign}$${val}M`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(227, 224, 220, 0.4)", drawBorder: false },
          ticks: {
            color: "#767676",
            font: { family: "system-ui, -apple-system, sans-serif", size: 11 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
          },
        },
        y: {
          grid: { color: "rgba(227, 224, 220, 0.5)", drawBorder: false },
          ticks: {
            color: "#767676",
            font: { family: "system-ui, -apple-system, sans-serif", size: 11 },
            callback: (v: string | number) => (Number(v) >= 0 ? "+" : "") + "$" + v + "M",
          },
        },
      },
    };

    if (currentChartMode === "daily") {
      const totals = filteredData.map((d) => d.total);
      const barColors = totals.map((v) =>
        v >= 0 ? "rgba(11, 138, 75, 0.88)" : "rgba(214, 51, 46, 0.88)"
      );
      const borderColors = totals.map((v) =>
        v >= 0 ? "#0B8A4B" : "#D6332E"
      );

      const datasets: Chart["data"]["datasets"] = [];

      if (showMovingAverage) {
        const sma7 = totals.map((_, idx, arr) => {
          if (idx < 2) return null;
          const windowSlice = arr.slice(Math.max(0, idx - 4), idx + 1);
          return Number((windowSlice.reduce((a, b) => a + b, 0) / windowSlice.length).toFixed(1));
        });

        datasets.push({
          type: "line",
          label: "7D Moving Avg",
          data: sma7,
          borderColor: "#0E0E0E",
          borderWidth: 2.5,
          borderDash: [5, 4],
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#FFB3C7",
          pointHoverBorderColor: "#0E0E0E",
          tension: 0.35,
          order: 1,
        });
      }

      datasets.push({
        type: "bar",
        label: "Net Flow ($M)",
        data: totals,
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.62,
        order: 2,
      });

      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: { labels, datasets: datasets as unknown as Chart["data"]["datasets"] },
        options: commonOptions,
      });
    } else if (currentChartMode === "cumulative") {
      let runningTotal = 0;
      const cumulativeData = filteredData.map((d) => {
        runningTotal += d.total;
        return Math.round(runningTotal * 10) / 10;
      });

      const gradient = ctx.createLinearGradient(0, 0, 0, 440);
      gradient.addColorStop(0, "rgba(255, 179, 199, 0.65)");
      gradient.addColorStop(0.6, "rgba(255, 179, 199, 0.15)");
      gradient.addColorStop(1, "rgba(255, 179, 199, 0.00)");

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Cumulative Net Flow ($M)",
              data: cumulativeData,
              borderColor: "#0E0E0E",
              borderWidth: 3,
              backgroundColor: gradient,
              fill: true,
              tension: 0.38,
              pointBackgroundColor: "#FFB3C7",
              pointBorderColor: "#0E0E0E",
              pointBorderWidth: 2,
              pointHoverRadius: 7,
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
            { label: "IBIT (BlackRock)", data: ibitData, backgroundColor: "#0B8A4B", borderRadius: 4, stack: "etf" },
            { label: "FBTC (Fidelity)", data: fbtcData, backgroundColor: "#0E0E0E", borderRadius: 4, stack: "etf" },
            { label: "BITB (Bitwise)", data: bitbData, backgroundColor: "#4A4A4A", borderRadius: 4, stack: "etf" },
            { label: "ARKB (ARK 21Shares)", data: arkbData, backgroundColor: "#FFB3C7", borderRadius: 4, stack: "etf" },
            { label: "Others", data: othersData, backgroundColor: "#C2C0BC", borderRadius: 4, stack: "etf" },
            { label: "GBTC (Grayscale)", data: gbtcData, backgroundColor: "#D6332E", borderRadius: 4, stack: "etf" },
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
    <Card id="chart-section" className="w-full border-klarna-border shadow-card overflow-hidden">
      <CardHeader className="border-b border-klarna-border/70 pb-6 bg-klarna-canvas">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge variant="outline" className="gap-1.5 text-[11px] font-bold">
                <BarChart3 className="w-3.5 h-3.5 text-klarna-ink" />
                Visualisasi Arus Modal
              </Badge>
              <Badge variant="secondary" className="font-semibold text-[11px]">
                {currentChartMode === "daily" && "Daily Net Volume"}
                {currentChartMode === "cumulative" && "Cumulative Flow Trajectory"}
                {currentChartMode === "breakdown" && "Fund-by-Fund Stack"}
              </Badge>
            </div>
            <CardTitle className="text-2xl sm:text-3xl text-klarna-ink font-black tracking-tight">
              Institutional Flow Dynamics
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-klarna-muted mt-1">
              Visualisasi distribusi aliran dana masuk (inflow) dan keluar (outflow) institusi pada ETF Bitcoin Spot AS.
            </CardDescription>
          </div>

          {/* Mode Tabs using shadcn styled buttons */}
          <div className="inline-flex p-1 rounded-full bg-klarna-surface-2 border border-klarna-border self-start md:self-auto overflow-x-auto no-scrollbar max-w-full">
            <button
              type="button"
              onClick={() => onSelectMode("daily")}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all focus-ring cursor-pointer shrink-0 ${
                currentChartMode === "daily"
                  ? "bg-klarna-ink text-white shadow-sm"
                  : "text-klarna-muted hover:text-klarna-ink"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Daily Net Flow</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode("cumulative")}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all focus-ring cursor-pointer shrink-0 ${
                currentChartMode === "cumulative"
                  ? "bg-klarna-ink text-white shadow-sm"
                  : "text-klarna-muted hover:text-klarna-ink"
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              <span>Cumulative</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode("breakdown")}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all focus-ring cursor-pointer shrink-0 ${
                currentChartMode === "breakdown"
                  ? "bg-klarna-ink text-white shadow-sm"
                  : "text-klarna-muted hover:text-klarna-ink"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Fund Breakdown</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-8 space-y-6">
        {/* Metric Highlights Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-klarna-surface-1/70 border border-klarna-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-klarna-subdued text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              <span>Rekor Inflow Harian</span>
              <TrendingUp className="w-3.5 h-3.5 text-klarna-success" />
            </div>
            <p className="font-finance text-xl sm:text-2xl font-black text-klarna-success mt-2">
              +${stats.peakInflow.toFixed(1)}M
            </p>
            <span className="text-[11px] text-klarna-muted font-medium mt-0.5">{stats.peakInflowDate}</span>
          </div>

          <div className="p-4 rounded-2xl bg-klarna-surface-1/70 border border-klarna-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-klarna-subdued text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              <span>Rekor Outflow Harian</span>
              <TrendingDown className="w-3.5 h-3.5 text-klarna-error" />
            </div>
            <p className="font-finance text-xl sm:text-2xl font-black text-klarna-error mt-2">
              {stats.peakOutflow.toFixed(1)}M
            </p>
            <span className="text-[11px] text-klarna-muted font-medium mt-0.5">{stats.peakOutflowDate}</span>
          </div>

          <div className="p-4 rounded-2xl bg-klarna-surface-1/70 border border-klarna-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-klarna-subdued text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              <span>Rasio Hari Positif</span>
              <Sparkles className="w-3.5 h-3.5 text-klarna-ink" />
            </div>
            <p className="font-finance text-xl sm:text-2xl font-black text-klarna-ink mt-2">{stats.posRate}%</p>
            <span className="text-[11px] text-klarna-success font-semibold mt-0.5">
              {stats.positiveCount} dari {stats.totalDays} sesi
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-klarna-surface-1/70 border border-klarna-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-klarna-subdued text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              <span>Rata-Rata Harian</span>
              <Calendar className="w-3.5 h-3.5 text-klarna-ink" />
            </div>
            <p className="font-finance text-xl sm:text-2xl font-black text-klarna-ink mt-2">
              {stats.totalSum >= 0 ? "+" : ""}${stats.avgDaily}M
            </p>
            <span className="text-[11px] text-klarna-muted font-medium mt-0.5">Arus rerata per sesi</span>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="relative w-full max-w-full overflow-hidden h-[320px] sm:h-[460px] pt-2">
          <canvas ref={chartCanvasRef} aria-label="Bitcoin ETF Net Flows Chart" role="img" />
        </div>

        {/* Chart Legend, Badges & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-klarna-border text-xs text-klarna-muted">
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
            {currentChartMode === "daily" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-klarna-success inline-block shadow-sm"></span>
                  <span className="text-klarna-ink font-semibold">Net Inflow (+$)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-klarna-error inline-block shadow-sm"></span>
                  <span className="text-klarna-ink font-semibold">Net Outflow (-$)</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onToggleMovingAverage}
                  className={`h-8 text-xs font-bold gap-1.5 transition-all ${
                    showMovingAverage ? "bg-klarna-surface-2 border-klarna-ink" : "opacity-75"
                  }`}
                  aria-pressed={showMovingAverage}
                >
                  <span className="w-3.5 h-1 border-t-2 border-dashed border-klarna-ink inline-block"></span>
                  <span>7D Moving Avg</span>
                  {showMovingAverage && <Check className="w-3.5 h-3.5 ml-0.5" />}
                </Button>
              </>
            )}

            {currentChartMode === "cumulative" && (
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1.5 bg-klarna-pink-pressed rounded-full inline-block"></span>
                <span className="text-klarna-ink font-bold">Total Akumulatif Bersih</span>
              </div>
            )}

            {currentChartMode === "breakdown" && (
              <div className="flex items-center gap-3 flex-wrap text-[11px] font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0B8A4B]"></span> IBIT
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0E0E0E]"></span> FBTC
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#4A4A4A]"></span> BITB
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFB3C7]"></span> ARKB
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#D6332E]"></span> GBTC
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#C2C0BC]"></span> Others
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-klarna-subdued text-[11px] sm:text-xs">
            <Info className="w-3.5 h-3.5 text-klarna-muted shrink-0" />
            <span>Arahkan kursor / sentuh bar grafik untuk rincian sesi</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
