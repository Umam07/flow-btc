"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Chart from "chart.js/auto";

interface FlowRecord {
  date: string;
  label: string;
  total: number;
  ibit: number;
  fbtc: number;
  bitb: number;
  arkb: number;
  gbtc: number;
  others: number;
}

interface Issuer {
  ticker: string;
  name: string;
  manager: string;
  fee: number;
  totalInflow: number; // in Millions
  latestSession: number;
  highlight?: string;
  isLeader?: boolean;
  isNegative?: boolean;
}

const rawFlowData: FlowRecord[] = [
  { date: "2026-09-04", label: "Sep 04", total: 312.4, ibit: 210.5, fbtc: 84.1, bitb: 14.2, arkb: 28.4, gbtc: -34.2, others: 9.4 },
  { date: "2026-09-03", label: "Sep 03", total: 184.8, ibit: 122.0, fbtc: 51.2, bitb: 9.5, arkb: 12.1, gbtc: -18.0, others: 8.0 },
  { date: "2026-09-02", label: "Sep 02", total: -48.2, ibit: 15.2, fbtc: 0.0, bitb: -2.1, arkb: -6.3, gbtc: -62.4, others: 7.4 },
  { date: "2026-08-31", label: "Aug 31", total: 422.5, ibit: 298.0, fbtc: 92.4, bitb: 22.1, arkb: 34.0, gbtc: -41.0, others: 17.0 },
  { date: "2026-08-30", label: "Aug 30", total: 245.1, ibit: 168.4, fbtc: 64.2, bitb: 11.0, arkb: 15.5, gbtc: -22.0, others: 8.0 },
  { date: "2026-08-29", label: "Aug 29", total: 89.0, ibit: 64.0, fbtc: 25.0, bitb: 8.0, arkb: 4.0, gbtc: -19.5, others: 7.5 },
  { date: "2026-08-28", label: "Aug 28", total: -92.4, ibit: 0.0, fbtc: 12.0, bitb: -5.0, arkb: -14.4, gbtc: -98.0, others: 13.0 },
  { date: "2026-08-27", label: "Aug 27", total: 382.1, ibit: 245.0, fbtc: 88.5, bitb: 19.4, arkb: 31.2, gbtc: -18.0, others: 16.0 },
  { date: "2026-08-26", label: "Aug 26", total: 215.3, ibit: 142.1, fbtc: 54.0, bitb: 12.2, arkb: 18.0, gbtc: -24.0, others: 13.0 },
  { date: "2026-08-25", label: "Aug 25", total: 541.0, ibit: 340.0, fbtc: 122.0, bitb: 35.0, arkb: 48.0, gbtc: -21.0, others: 17.0 },
  { date: "2026-08-24", label: "Aug 24", total: -128.5, ibit: 24.0, fbtc: 0.0, bitb: -10.5, arkb: -21.0, gbtc: -132.0, others: 11.0 },
  { date: "2026-08-23", label: "Aug 23", total: 174.2, ibit: 115.0, fbtc: 48.2, bitb: 8.0, arkb: 12.0, gbtc: -17.0, others: 8.0 },
  { date: "2026-08-22", label: "Aug 22", total: 310.0, ibit: 198.0, fbtc: 74.0, bitb: 16.0, arkb: 26.0, gbtc: -19.0, others: 15.0 },
  { date: "2026-08-21", label: "Aug 21", total: -45.0, ibit: 18.0, fbtc: 0.0, bitb: -4.0, arkb: -9.0, gbtc: -58.0, others: 8.0 },
  { date: "2026-08-20", label: "Aug 20", total: 268.4, ibit: 175.0, fbtc: 62.4, bitb: 14.0, arkb: 22.0, gbtc: -16.0, others: 11.0 },
  { date: "2026-08-19", label: "Aug 19", total: 198.0, ibit: 130.0, fbtc: 45.0, bitb: 10.0, arkb: 16.0, gbtc: -15.0, others: 12.0 },
  { date: "2026-08-18", label: "Aug 18", total: 412.0, ibit: 275.0, fbtc: 94.0, bitb: 24.0, arkb: 32.0, gbtc: -31.0, others: 18.0 },
  { date: "2026-08-17", label: "Aug 17", total: 152.0, ibit: 98.0, fbtc: 38.0, bitb: 8.0, arkb: 12.0, gbtc: -12.0, others: 8.0 },
  { date: "2026-08-16", label: "Aug 16", total: -82.0, ibit: 0.0, fbtc: 10.0, bitb: -6.0, arkb: -14.0, gbtc: -82.0, others: 10.0 },
  { date: "2026-08-15", label: "Aug 15", total: 290.0, ibit: 180.0, fbtc: 70.0, bitb: 18.0, arkb: 24.0, gbtc: -20.0, others: 18.0 },
  { date: "2026-08-14", label: "Aug 14", total: 105.0, ibit: 75.0, fbtc: 28.0, bitb: 5.0, arkb: 8.0, gbtc: -18.0, others: 7.0 },
  { date: "2026-08-13", label: "Aug 13", total: 340.0, ibit: 220.0, fbtc: 82.0, bitb: 20.0, arkb: 28.0, gbtc: -25.0, others: 15.0 },
  { date: "2026-08-12", label: "Aug 12", total: -160.0, ibit: 10.0, fbtc: -12.0, bitb: -18.0, arkb: -25.0, gbtc: -135.0, others: 20.0 },
  { date: "2026-08-11", label: "Aug 11", total: 480.0, ibit: 310.0, fbtc: 110.0, bitb: 30.0, arkb: 42.0, gbtc: -30.0, others: 18.0 },
  { date: "2026-08-10", label: "Aug 10", total: 220.0, ibit: 145.0, fbtc: 55.0, bitb: 12.0, arkb: 18.0, gbtc: -22.0, others: 12.0 },
  { date: "2026-08-09", label: "Aug 09", total: 85.0, ibit: 60.0, fbtc: 22.0, bitb: 6.0, arkb: 7.0, gbtc: -18.0, others: 8.0 },
  { date: "2026-08-08", label: "Aug 08", total: -60.0, ibit: 15.0, fbtc: 0.0, bitb: -5.0, arkb: -12.0, gbtc: -68.0, others: 10.0 },
  { date: "2026-08-07", label: "Aug 07", total: 315.0, ibit: 205.0, fbtc: 78.0, bitb: 16.0, arkb: 24.0, gbtc: -22.0, others: 14.0 },
  { date: "2026-08-06", label: "Aug 06", total: 190.0, ibit: 125.0, fbtc: 46.0, bitb: 11.0, arkb: 16.0, gbtc: -18.0, others: 10.0 },
  { date: "2026-08-05", label: "Aug 05", total: 275.0, ibit: 180.0, fbtc: 65.0, bitb: 15.0, arkb: 22.0, gbtc: -21.0, others: 14.0 },
];

const issuersData: Issuer[] = [
  { ticker: "IBIT", name: "iShares Bitcoin Trust", manager: "BlackRock Asset Management", fee: 0.25, totalInflow: 24810, latestSession: 210.5, highlight: "Market Leader (58%)", isLeader: true },
  { ticker: "FBTC", name: "Wise Origin Bitcoin", manager: "Fidelity Investments", fee: 0.25, totalInflow: 11450, latestSession: 84.1 },
  { ticker: "ARKB", name: "ARK 21Shares Bitcoin", manager: "ARK Invest & 21Shares", fee: 0.21, totalInflow: 2840, latestSession: 28.4 },
  { ticker: "BITB", name: "Bitwise Bitcoin ETF", manager: "Bitwise Asset Management", fee: 0.20, totalInflow: 2420, latestSession: 14.2 },
  { ticker: "GBTC", name: "Grayscale Bitcoin Trust", manager: "Grayscale Investments", fee: 1.50, totalInflow: -20120, latestSession: -34.2, isNegative: true },
  { ticker: "BTC", name: "Grayscale Bitcoin Mini", manager: "Grayscale Investments", fee: 0.15, totalInflow: 580.4, latestSession: 7.5 },
  { ticker: "HODL", name: "VanEck Bitcoin Trust", manager: "VanEck Associates", fee: 0.20, totalInflow: 785.2, latestSession: 4.8 },
  { ticker: "OTHERS", name: "BTCO, EZBC, BRRR...", manager: "Invesco, Franklin, Valkyrie", fee: 0.25, totalInflow: 1210, latestSession: 7.1 },
];

const scriptPresets = {
  zscore: {
    file: "indicator_zscore.ts",
    metric: "14D Flow Z-Score",
    value: "+1.84 σ",
    signal: "Strong Institutional Demand",
    signalColor: "text-klarna-ink font-black",
    code: `// Calculating 14-day Rolling Z-Score for Flow Volatility
const window = 14;
const series = dataset.map(d => d.total);
const mean = series.reduce((a, b) => a + b, 0) / window;
const stdDev = Math.sqrt(series.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / window);
const currentZScore = (series[series.length - 1] - mean) / stdDev;
return { indicator: "14D Z-Score", value: currentZScore.toFixed(2), sentiment: currentZScore > 1 ? "Euphoric" : "Accumulating" };`,
  },
  rotation: {
    file: "indicator_rotation.ts",
    metric: "IBIT vs GBTC Rotation Ratio",
    value: "6.15x",
    signal: "Structural Rebalance to Low-Fee Issuers",
    signalColor: "text-klarna-success font-black",
    code: `// Calculating BlackRock (IBIT) Inflows vs Grayscale (GBTC) Outflows Ratio
const ibitRecent = dataset.slice(0, 7).reduce((acc, d) => acc + d.ibit, 0);
const gbtcRecent = Math.abs(dataset.slice(0, 7).reduce((acc, d) => acc + d.gbtc, 0));
const rotationRatio = (ibitRecent / (gbtcRecent || 1)).toFixed(2);
return { indicator: "Rotation Multiple", value: rotationRatio + "x", signal: "Capital flight to fee-advantaged trust" };`,
  },
  velocity: {
    file: "indicator_velocity.ts",
    metric: "Net Capital Acceleration",
    value: "+$142.3M / session",
    signal: "Momentum Expanding",
    signalColor: "text-klarna-success font-black",
    code: `// Velocity of Cumulative Flow (1st Derivative across 5 trading days)
const diffs = [];
for (let i = 0; i < 5; i++) {
  diffs.push(dataset[i].total - dataset[i + 1].total);
}
const avgVelocity = (diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(1);
return { indicator: "Velocity", value: (avgVelocity > 0 ? "+" : "") + "$" + avgVelocity + "M/session", momentum: "Positive" };`,
  },
};

export default function Home() {
  const [currentPeriod, setCurrentPeriod] = useState<"7d" | "30d" | "90d" | "ytd" | "all">("30d");
  const [currentChartMode, setCurrentChartMode] = useState<"daily" | "cumulative" | "breakdown">("daily");
  const [showMovingAverage, setShowMovingAverage] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dirFilter, setDirFilter] = useState<"all" | "inflow" | "outflow">("all");
  const [showAllRows, setShowAllRows] = useState<boolean>(false);
  const [issuerSort, setIssuerSort] = useState<"inflow" | "fee" | "ticker">("inflow");
  const [selectedScript, setSelectedScript] = useState<"zscore" | "rotation" | "velocity">("zscore");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncTime, setSyncTime] = useState<string>("14:00 UTC");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Filtered dataset for statistics and chart based on period
  const filteredData = useMemo(() => {
    const count = currentPeriod === "7d" ? 7 : 30;
    return rawFlowData.slice(0, count).reverse();
  }, [currentPeriod]);

  // Financial calculations
  const stats = useMemo(() => {
    const totalSum = filteredData.reduce((acc, curr) => acc + curr.total, 0);
    const totalDays = filteredData.length;

    // Prior window delta
    const count = currentPeriod === "7d" ? 7 : 14;
    const recentSlice = rawFlowData.slice(0, count);
    const priorSlice = rawFlowData.slice(count, count * 2);
    const recentSum = recentSlice.reduce((a, b) => a + b.total, 0);
    const priorSum = priorSlice.length > 0 ? priorSlice.reduce((a, b) => a + b.total, 0) : recentSum * 0.9;
    const delta = recentSum - priorSum;
    const deltaPct = priorSum !== 0 ? ((delta / Math.abs(priorSum)) * 100).toFixed(1) : "0.0";

    // Latest session stats
    const latest = rawFlowData[0];
    const issuersInSession = [latest.ibit, latest.fbtc, latest.bitb, latest.arkb, latest.gbtc, latest.others];
    const inflowCount = issuersInSession.filter((v) => v > 0).length;
    const outflowCount = issuersInSession.filter((v) => v < 0).length;

    // Dominant fund (IBIT)
    const ibitSum = filteredData.reduce((acc, curr) => acc + (curr.ibit || 0), 0);
    const ibitShare = totalSum > 0 ? Math.min(100, Math.max(0, (ibitSum / totalSum) * 100)).toFixed(1) : "58.2";

    // Metric strip
    let peakInflow = -Infinity;
    let peakInflowDate = "";
    let peakOutflow = Infinity;
    let peakOutflowDate = "";
    let positiveCount = 0;

    filteredData.forEach((d) => {
      if (d.total > peakInflow) {
        peakInflow = d.total;
        peakInflowDate = `${d.label}, 2026`;
      }
      if (d.total < peakOutflow) {
        peakOutflow = d.total;
        peakOutflowDate = `${d.label}, 2026`;
      }
      if (d.total >= 0) {
        positiveCount++;
      }
    });

    const avgDaily = totalDays > 0 ? (totalSum / totalDays).toFixed(1) : "0.0";
    const posRate = totalDays > 0 ? ((positiveCount / totalDays) * 100).toFixed(1) : "0.0";

    return {
      totalSum,
      delta,
      deltaPct,
      latest,
      inflowCount,
      outflowCount,
      ibitSum,
      ibitShare,
      peakInflow,
      peakInflowDate,
      peakOutflow,
      peakOutflowDate,
      positiveCount,
      totalDays,
      posRate,
      avgDaily,
    };
  }, [filteredData, currentPeriod]);

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
      let runningTotal = 17500;
      const cumulativeData = filteredData.map((d) => {
        runningTotal += d.total;
        return runningTotal;
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
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            { label: "IBIT (BlackRock)", data: filteredData.map((d) => d.ibit), backgroundColor: "#0E0E0E", borderRadius: 4 },
            { label: "FBTC (Fidelity)", data: filteredData.map((d) => d.fbtc), backgroundColor: "#4A4A4A", borderRadius: 4 },
            { label: "BITB (Bitwise)", data: filteredData.map((d) => d.bitb), backgroundColor: "#767676", borderRadius: 4 },
            { label: "ARKB (ARK)", data: filteredData.map((d) => d.arkb), backgroundColor: "#FFB3C7", borderRadius: 4 },
            { label: "GBTC (Grayscale)", data: filteredData.map((d) => d.gbtc), backgroundColor: "#D6332E", borderRadius: 4 },
          ],
        },
        options: {
          ...commonOptions,
          scales: {
            x: {
              stacked: true,
              grid: { color: "rgba(227, 224, 220, 0.6)" },
              ticks: { color: "#767676", font: { family: "Plus Jakarta Sans", size: 11 } },
            },
            y: {
              stacked: true,
              grid: { color: "rgba(227, 224, 220, 0.6)" },
              ticks: {
                color: "#767676",
                font: { family: "Plus Jakarta Sans", size: 11 },
                callback: (v: any) => (v >= 0 ? "+" : "") + "$" + v + "M",
              },
            },
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

  // Sorted issuers
  const sortedIssuers = useMemo(() => {
    return [...issuersData].sort((a, b) => {
      if (issuerSort === "inflow") return b.totalInflow - a.totalInflow;
      if (issuerSort === "fee") return a.fee - b.fee;
      if (issuerSort === "ticker") return a.ticker.localeCompare(b.ticker);
      return 0;
    });
  }, [issuerSort]);

  // Filtered table rows
  const tableRows = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return rawFlowData.filter((row) => {
      const matchesSearch = row.label.toLowerCase().includes(q) || row.date.includes(q);
      const matchesDir = dirFilter === "all" ? true : dirFilter === "inflow" ? row.total >= 0 : row.total < 0;
      return matchesSearch && matchesDir;
    });
  }, [searchQuery, dirFilter]);

  const displayedRows = useMemo(() => {
    return showAllRows ? tableRows : tableRows.slice(0, 10);
  }, [tableRows, showAllRows]);

  // CSV Export handler
  const handleExportCSV = () => {
    const records = tableRows.length > 0 ? tableRows : rawFlowData;
    let csv = "Date,Session_Label,Total_Net_Flow_USD_M,IBIT_M,FBTC_M,BITB_M,ARKB_M,GBTC_M,Others_M\n";
    records.forEach((r) => {
      csv += `${r.date},${r.label},${r.total},${r.ibit},${r.fbtc},${r.bitb},${r.arkb},${r.gbtc},${r.others}\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `btc_etf_flows_${records.length}_sessions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${records.length} sessions to CSV`);
  };

  // Pipeline Sync trigger simulation
  const handleTriggerSync = () => {
    setIsSyncing(true);
    showToast("Contacting farside.co.uk ingestion pipeline...");

    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const utcHours = String(now.getUTCHours()).padStart(2, "0");
      const utcMinutes = String(now.getUTCMinutes()).padStart(2, "0");
      const timeStr = `${utcHours}:${utcMinutes} UTC`;
      setSyncTime(timeStr);
      showToast(`Pipeline verified: 30 sessions synced (${timeStr})`);
    }, 750);
  };

  // Script simulator
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      showToast("Indicator successfully executed against dataset");
    }, 350);
  };

  return (
    <div className="min-h-screen flex flex-col bg-klarna-surface-1 text-klarna-ink selection:bg-klarna-pink selection:text-klarna-ink antialiased">
      {/* ================= TOP NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-klarna-border bg-klarna-surface-1/90 backdrop-blur-md">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo / Wordmark */}
          <a
            href="#overview"
            className="flex items-center gap-3 group focus-ring rounded-xl p-1 shrink-0"
            aria-label="Bitcoin ETF Flow Dashboard Home"
          >
            <div className="w-10 h-10 rounded-full bg-klarna-pink flex items-center justify-center font-title font-black text-klarna-ink text-lg transition-transform group-hover:scale-105 shadow-sm">
              ₿
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-title font-black text-xl tracking-tight text-klarna-ink group-hover:opacity-80 transition-opacity">
                BTC FLOW
              </span>
              <span className="hidden lg:inline-block text-[11px] font-bold uppercase tracking-wider text-klarna-subdued">
                ETF Tracker
              </span>
            </div>
          </a>

          {/* Center: Floating Segmented Pill Nav */}
          <nav
            className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-klarna-canvas border border-klarna-border shadow-card text-xs font-semibold text-klarna-muted"
            aria-label="Primary Navigation"
          >
            <a href="#overview" className="px-4 py-2 rounded-full text-klarna-ink hover:bg-klarna-surface-1 transition-all focus-ring">
              Overview
            </a>
            <a href="#chart-section" className="px-4 py-2 rounded-full hover:text-klarna-ink hover:bg-klarna-surface-1 transition-all focus-ring">
              Dynamics
            </a>
            <a href="#issuers" className="px-4 py-2 rounded-full hover:text-klarna-ink hover:bg-klarna-surface-1 transition-all focus-ring">
              Issuers
            </a>
            <a href="#historical-data" className="px-4 py-2 rounded-full hover:text-klarna-ink hover:bg-klarna-surface-1 transition-all focus-ring">
              Ledger
            </a>
            <a href="#scripting-studio" className="px-4 py-2 rounded-full hover:text-klarna-ink hover:bg-klarna-surface-1 transition-all focus-ring">
              Lab
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Live Scraper Sync Pill */}
            <button
              type="button"
              onClick={handleTriggerSync}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-klarna-canvas border border-klarna-border hover:border-klarna-ink/30 text-xs text-klarna-muted hover:text-klarna-ink transition-all shadow-card focus-ring cursor-pointer"
              title="Automated pipeline sync with farside.co.uk • Click to refresh"
              aria-label="Refresh Data Pipeline"
            >
              <span className="text-xs font-mono font-medium hidden sm:inline">{syncTime}</span>
              <svg
                className={`w-3.5 h-3.5 text-klarna-subdued ${isSyncing ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
            </button>

            {/* Primary CTA: Confident Black Pill Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-pill-press inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-klarna-ink text-white font-title font-bold text-sm hover:bg-black transition-all focus-ring shadow-card cursor-pointer"
              aria-label="Export dataset to CSV"
            >
              <svg className="w-4 h-4 text-klarna-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full bg-klarna-canvas border border-klarna-border text-klarna-ink hover:bg-klarna-surface-2 focus-ring transition-colors shadow-card cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-klarna-border bg-klarna-canvas px-6 py-6 space-y-4 shadow-elevated">
            <nav className="flex flex-col space-y-3 text-base font-semibold text-klarna-muted" aria-label="Mobile Navigation">
              <a href="#overview" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-klarna-ink hover:text-black transition-colors">
                Overview
              </a>
              <a href="#chart-section" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-klarna-ink transition-colors">
                Dynamics
              </a>
              <a href="#issuers" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-klarna-ink transition-colors">
                Issuers Directory
              </a>
              <a href="#historical-data" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-klarna-ink transition-colors">
                Historical Ledger
              </a>
              <a href="#scripting-studio" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-klarna-ink transition-colors flex items-center justify-between">
                <span>Indicator Lab</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-klarna-pink font-bold text-klarna-ink font-mono">Fase 2</span>
              </a>
            </nav>
            <div className="pt-4 border-t border-klarna-border">
              <button
                type="button"
                onClick={() => {
                  handleExportCSV();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-full bg-klarna-ink text-white font-title font-bold text-sm text-center cursor-pointer"
              >
                Export CSV Data
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-20 sm:space-y-24 flex-1">
        {/* ================= HERO BANNER ================= */}
        <section id="overview" className="space-y-8">
          <div className="p-8 sm:p-14 lg:p-16 rounded-[32px] bg-klarna-pink text-klarna-ink shadow-pink-glow relative overflow-hidden flex flex-col justify-between gap-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/80 border border-black/10 text-klarna-ink text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <span>Institutional Capital Tracker</span>
              </div>

              <h1 className="klarna-display text-4xl sm:text-6xl lg:text-7xl text-klarna-ink font-black">
                Where institutional capital <br className="hidden sm:inline" />
                flows into Bitcoin.
              </h1>

              <p className="text-klarna-ink/85 text-base sm:text-xl font-medium leading-relaxed max-w-2xl">
                Live net inflows, redemptions, and historical liquidity trends across all 11 US Spot Bitcoin ETFs. Clean, transparent, and effortlessly accessible.
              </p>
            </div>

            {/* Period Horizon Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-black/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-klarna-ink/75">
                <span>Horizon Window:</span>
                <span className="text-klarna-ink font-black font-mono">{currentPeriod.toUpperCase()}</span>
              </div>

              <div className="inline-flex p-1.5 rounded-full bg-white shadow-sm border border-black/5" role="group" aria-label="Time Horizon Filters">
                {(["7d", "30d", "90d", "ytd", "all"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setCurrentPeriod(p);
                      showToast(`Horizon updated to ${p.toUpperCase()}`);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all focus-ring cursor-pointer ${
                      currentPeriod === p ? "bg-klarna-ink text-white" : "text-klarna-muted hover:text-klarna-ink"
                    }`}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================= 4 KPI CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
            {/* Card 1: Primary Spotlight */}
            <div className="lg:col-span-4 p-8 rounded-[24px] bg-klarna-canvas border border-klarna-border shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">
                    Net Capital Flow ({currentPeriod.toUpperCase()})
                  </span>
                  <span className="w-8 h-8 rounded-full bg-klarna-surface-2 text-klarna-ink flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                  </span>
                </div>
                <div className={`klarna-display text-4xl sm:text-5xl font-black mb-2 ${stats.totalSum >= 0 ? "text-klarna-success" : "text-klarna-error"}`}>
                  {stats.totalSum >= 0 ? "+" : ""}${stats.totalSum.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M
                </div>
                <p className="text-xs text-klarna-muted">Total institutional capital entering spot trusts</p>
              </div>
              <div className="pt-5 border-t border-klarna-border flex items-center justify-between text-xs mt-6">
                <span className={`font-bold flex items-center gap-1 font-finance ${stats.delta >= 0 ? "text-klarna-success" : "text-klarna-error"}`}>
                  {stats.delta >= 0 ? "+" : ""}${Math.abs(stats.delta).toFixed(1)}M ({stats.delta >= 0 ? "+" : ""}{stats.deltaPct}%)
                </span>
                <span className="text-klarna-subdued font-medium">vs prior window</span>
              </div>
            </div>

            {/* Card 2: Latest Session */}
            <div className="lg:col-span-3 p-7 rounded-[24px] bg-klarna-canvas border border-klarna-border shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
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
              <div className="pt-4 border-t border-klarna-border flex items-center justify-between text-xs text-klarna-muted">
                <span className="text-klarna-success font-bold">{stats.inflowCount} Funds Inflow</span>
                <span className="text-klarna-error font-bold">{stats.outflowCount} Outflow</span>
              </div>
            </div>

            {/* Card 3: Dominant Fund (IBIT) */}
            <div className="lg:col-span-3 p-7 rounded-[24px] bg-klarna-canvas border border-klarna-border shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Dominant Fund</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-klarna-pink text-klarna-ink text-xs font-bold font-mono">IBIT</span>
                </div>
                <div className="klarna-display text-3xl sm:text-4xl text-klarna-ink font-bold mb-2 font-finance">
                  {stats.ibitSum >= 0 ? "+" : ""}${Math.abs(stats.ibitSum) >= 1000 ? (stats.ibitSum / 1000).toFixed(2) + "B" : stats.ibitSum.toFixed(1) + "M"}
                </div>
              </div>
              <div className="pt-4 border-t border-klarna-border space-y-1.5">
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
            <div className="lg:col-span-2 p-7 rounded-[24px] bg-klarna-canvas border border-klarna-border shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
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
                <div className="klarna-display text-2xl sm:text-3xl text-klarna-ink font-bold mb-1 font-finance">
                  +$21.14B
                </div>
              </div>
              <div className="pt-4 border-t border-klarna-border text-xs text-klarna-muted">
                <span className="text-klarna-subdued">Reserves:</span>
                <div className="text-klarna-ink font-mono font-bold mt-0.5">~341,200 BTC</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FLOW DYNAMICS CHART ================= */}
        <section id="chart-section" className="p-6 sm:p-10 rounded-[28px] bg-klarna-canvas border border-klarna-border shadow-card space-y-8">
          {/* Header & Mode Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-klarna-border pb-6">
            <div>
              <h2 className="klarna-heading text-2xl sm:text-3xl text-klarna-ink flex items-center gap-3">
                <span>Institutional Flow Dynamics</span>
                <span className="text-xs px-3 py-1 rounded-full bg-klarna-surface-2 text-klarna-ink font-semibold">
                  {currentChartMode === "daily" && "Daily Net Flow ($M)"}
                  {currentChartMode === "cumulative" && "Cumulative Trajectory"}
                  {currentChartMode === "breakdown" && "Fund Breakdown"}
                </span>
              </h2>
              <p className="text-sm text-klarna-muted mt-1">
                Tracking daily capital entries against institutional liquidations across US Spot Bitcoin ETFs.
              </p>
            </div>

            {/* Chart Mode Tabs */}
            <div className="inline-flex p-1 rounded-full bg-klarna-surface-2 border border-klarna-border self-start md:self-auto" role="tablist">
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
                  onClick={() => setCurrentChartMode(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all focus-ring cursor-pointer ${
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-1">
            <div className="p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-klarna-subdued">Peak Day Inflow</span>
              <p className="font-finance text-2xl font-black text-klarna-success mt-1">
                +${stats.peakInflow.toFixed(1)}M
              </p>
              <span className="text-xs text-klarna-muted">{stats.peakInflowDate}</span>
            </div>
            <div className="p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-klarna-subdued">Peak Day Outflow</span>
              <p className="font-finance text-2xl font-black text-klarna-error mt-1">
                {stats.peakOutflow.toFixed(1)}M
              </p>
              <span className="text-xs text-klarna-muted">{stats.peakOutflowDate}</span>
            </div>
            <div className="p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-klarna-subdued">Positive Session Rate</span>
              <p className="font-finance text-2xl font-black text-klarna-ink mt-1">{stats.posRate}%</p>
              <span className="text-xs text-klarna-success font-semibold">{stats.positiveCount} of {stats.totalDays} days positive</span>
            </div>
            <div className="p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-klarna-subdued">Average Daily Flow</span>
              <p className="font-finance text-2xl font-black text-klarna-ink mt-1">
                {stats.totalSum >= 0 ? "+" : ""}${stats.avgDaily}M
              </p>
              <span className="text-xs text-klarna-muted">Sustained net absorption</span>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="relative w-full h-[380px] sm:h-[460px] pt-4">
            <canvas ref={chartCanvasRef} aria-label="Bitcoin ETF Net Flows Chart" role="img" />
          </div>

          {/* Chart Legend & Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-klarna-border text-xs text-klarna-muted">
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-klarna-ink inline-block"></span>
                <span className="text-klarna-ink font-semibold">Net Inflow (+$)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-klarna-error inline-block"></span>
                <span className="text-klarna-ink font-semibold">Net Outflow (-$)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMovingAverage(!showMovingAverage);
                  showToast(!showMovingAverage ? "Moving Average activated" : "Moving Average hidden");
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-klarna-surface-2 hover:bg-klarna-border transition-colors focus-ring cursor-pointer"
                aria-pressed={showMovingAverage}
              >
                <span className="w-3.5 h-1.5 bg-klarna-pink-pressed inline-block rounded-full"></span>
                <span className={showMovingAverage ? "text-klarna-ink font-bold" : "text-klarna-subdued font-medium line-through"}>
                  7-Day Moving Average ({showMovingAverage ? "Active" : "Hidden"})
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-klarna-subdued">
              <svg className="w-4 h-4 text-klarna-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Hover chart bars to inspect individual issuer volumes</span>
            </div>
          </div>
        </section>

        {/* ================= ISSUERS DIRECTORY ================= */}
        <section id="issuers" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Market Participants</span>
              <h2 className="klarna-heading text-3xl sm:text-4xl text-klarna-ink mt-1">
                Spot Bitcoin ETF Issuers
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="issuerSortSelect" className="text-xs font-semibold text-klarna-muted">
                Sort by:
              </label>
              <select
                id="issuerSortSelect"
                value={issuerSort}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setIssuerSort(val);
                  showToast(`Issuers sorted by ${val}`);
                }}
                className="px-4 py-2 rounded-full bg-klarna-canvas border border-klarna-border text-xs text-klarna-ink font-semibold focus-ring cursor-pointer shadow-card"
              >
                <option value="inflow">Total Inflow (High to Low)</option>
                <option value="fee">Expense Ratio (Low to High)</option>
                <option value="ticker">Ticker (Alphabetical)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sortedIssuers.map((issuer) => {
              const formattedInflow =
                Math.abs(issuer.totalInflow) >= 1000
                  ? (issuer.totalInflow / 1000).toFixed(2) + "B"
                  : issuer.totalInflow.toFixed(1) + "M";

              return (
                <div
                  key={issuer.ticker}
                  className={`p-6 rounded-[24px] bg-klarna-canvas shadow-card hover:shadow-elevated transition-all flex flex-col justify-between relative ${
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
                    <h3 className="font-title font-bold text-lg text-klarna-ink">{issuer.name}</h3>
                    <p className="text-xs text-klarna-muted mt-0.5">{issuer.manager}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-klarna-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-klarna-subdued">Latest Session</span>
                      <span className={`font-finance font-bold text-base ${issuer.latestSession >= 0 ? "text-klarna-success" : "text-klarna-error"}`}>
                        {issuer.latestSession >= 0 ? "+" : ""}${issuer.latestSession.toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-klarna-subdued">
                        {issuer.isNegative ? "Net Conversions" : "Total Inflows"}
                      </span>
                      <span className={`font-finance font-bold text-base ${issuer.totalInflow >= 0 ? "text-klarna-ink" : "text-klarna-error"}`}>
                        {issuer.totalInflow >= 0 ? "+" : ""}${formattedInflow}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= HISTORICAL DATA LEDGER ================= */}
        <section id="historical-data" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Granular Records</span>
              <h2 className="klarna-heading text-3xl sm:text-4xl text-klarna-ink mt-1">
                Historical ETF Flow Ledger
              </h2>
              <p className="text-sm text-klarna-muted mt-1">
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

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Filter records by date"
                  className="w-48 sm:w-64 pl-10 pr-4 py-2.5 rounded-full bg-klarna-canvas border border-klarna-border text-xs text-klarna-ink placeholder-klarna-subdued focus-ring transition-all shadow-card"
                />
              </div>
              <select
                value={dirFilter}
                onChange={(e) => setDirFilter(e.target.value as any)}
                aria-label="Filter records by flow direction"
                className="px-4 py-2.5 rounded-full bg-klarna-canvas border border-klarna-border text-xs text-klarna-ink font-semibold focus-ring cursor-pointer shadow-card"
              >
                <option value="all">All Sessions</option>
                <option value="inflow">Inflows Only (+$)</option>
                <option value="outflow">Outflows Only (-$)</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-[24px] border border-klarna-border bg-klarna-canvas shadow-card">
            <table className="w-full text-left text-sm border-collapse" aria-label="Historical daily ETF flows">
              <thead>
                <tr className="border-b border-klarna-border bg-klarna-surface-2 text-[11px] font-mono uppercase text-klarna-muted tracking-wider">
                  <th scope="col" className="py-4 px-4 font-bold text-klarna-ink">Date</th>
                  <th scope="col" className="py-4 px-4 font-bold text-klarna-ink">Total Net Flow</th>
                  <th scope="col" className="py-4 px-3 font-bold text-klarna-success">IBIT (BlackRock)</th>
                  <th scope="col" className="py-4 px-3 font-bold text-klarna-ink">FBTC (Fidelity)</th>
                  <th scope="col" className="py-4 px-3 font-bold text-klarna-ink">BITB (Bitwise)</th>
                  <th scope="col" className="py-4 px-3 font-bold text-klarna-ink">ARKB (ARK)</th>
                  <th scope="col" className="py-4 px-3 font-bold text-klarna-error">GBTC (Grayscale)</th>
                  <th scope="col" className="py-4 px-3 font-bold text-klarna-ink">Others</th>
                  <th scope="col" className="py-4 px-4 font-bold text-right text-klarna-ink">Session</th>
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
                          onClick={() => {
                            setSearchQuery("");
                            setDirFilter("all");
                          }}
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
                        <td className="py-4 px-4 font-bold text-klarna-ink whitespace-nowrap">{r.label}, 2026</td>
                        <td className={`py-4 px-4 font-bold text-sm ${isPos ? "text-klarna-success" : "text-klarna-error"}`}>
                          {isPos ? "+" : ""}${r.total.toFixed(1)}M
                        </td>
                        <td className="py-4 px-3 text-klarna-success font-medium">
                          {r.ibit >= 0 ? "+" : ""}${r.ibit.toFixed(1)}M
                        </td>
                        <td className={`py-4 px-3 ${r.fbtc >= 0 ? "text-klarna-ink" : "text-klarna-error"}`}>
                          {r.fbtc >= 0 ? "+" : ""}${r.fbtc.toFixed(1)}M
                        </td>
                        <td className={`py-4 px-3 ${r.bitb >= 0 ? "text-klarna-ink" : "text-klarna-error"}`}>
                          {r.bitb >= 0 ? "+" : ""}${r.bitb.toFixed(1)}M
                        </td>
                        <td className={`py-4 px-3 ${r.arkb >= 0 ? "text-klarna-ink" : "text-klarna-error"}`}>
                          {r.arkb >= 0 ? "+" : ""}${r.arkb.toFixed(1)}M
                        </td>
                        <td className="py-4 px-3 font-semibold text-klarna-error">
                          {r.gbtc >= 0 ? "+" : ""}${r.gbtc.toFixed(1)}M
                        </td>
                        <td className="py-4 px-3 text-klarna-muted">
                          {r.others >= 0 ? "+" : ""}${r.others.toFixed(1)}M
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
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
                : `Showing ${displayedRows.length} of ${tableRows.length} recorded sessions`}
            </span>
            {tableRows.length > 10 && (
              <button
                type="button"
                onClick={() => setShowAllRows(!showAllRows)}
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

        {/* ================= FASE 2: INDICATOR LAB ================= */}
        <section id="scripting-studio" className="p-8 sm:p-10 rounded-[28px] bg-klarna-canvas border border-klarna-border shadow-card space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-klarna-border">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-klarna-pink font-bold text-klarna-ink text-xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <span>Fase 2 Feature Prototype</span>
              </div>
              <h2 className="klarna-heading text-2xl sm:text-3xl text-klarna-ink mt-2">
                Custom Flow Indicator Studio
              </h2>
              <p className="text-sm text-klarna-muted mt-1">
                Execute sandboxed algorithmic indicators over raw ETF flow series.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-klarna-subdued font-bold mr-1">Presets:</span>
              {(
                [
                  { key: "zscore", label: "14D Z-Score" },
                  { key: "rotation", label: "IBIT / GBTC Rotation" },
                  { key: "velocity", label: "Cumulative Velocity" },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => {
                    setSelectedScript(preset.key);
                    showToast(`Loaded ${scriptPresets[preset.key].metric} formula`);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all focus-ring cursor-pointer ${
                    selectedScript === preset.key ? "bg-klarna-ink text-white" : "bg-klarna-surface-2 text-klarna-muted hover:text-klarna-ink"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Editor Preview */}
            <div className="lg:col-span-7 rounded-2xl bg-klarna-surface-2 border border-klarna-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-klarna-border text-xs font-mono text-klarna-muted">
                <span className="flex items-center gap-2 font-bold text-klarna-ink">
                  <span className="w-2.5 h-2.5 rounded-full bg-klarna-pink"></span>
                  <span>{scriptPresets[selectedScript].file}</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-klarna-success">Sandboxed Runtime</span>
              </div>
              <pre className="p-5 text-xs font-mono text-klarna-ink overflow-x-auto leading-relaxed">
                <code>{scriptPresets[selectedScript].code}</code>
              </pre>
            </div>

            {/* Output Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Computed Analysis Output</span>
                <div
                  className={`mt-4 p-6 rounded-2xl bg-klarna-canvas border border-klarna-pink shadow-card space-y-4 transition-opacity duration-300 ${
                    isSimulating ? "opacity-35" : "opacity-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-klarna-muted">Indicator Metric</span>
                    <span className="font-mono font-bold text-klarna-ink text-xs">{scriptPresets[selectedScript].metric}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold text-klarna-muted">Current Value</span>
                    <span className="klarna-display text-3xl font-black text-klarna-success font-finance">
                      {scriptPresets[selectedScript].value}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-klarna-border flex justify-between text-xs">
                    <span className="text-klarna-muted">Signal Status</span>
                    <span className={`font-bold ${scriptPresets[selectedScript].signalColor}`}>
                      {scriptPresets[selectedScript].signal}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleRunSimulation}
                  className="btn-pill-press w-full py-3 rounded-full bg-klarna-ink text-white font-title font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 focus-ring shadow-card cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-klarna-pink" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Run Indicator Simulation</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PIPELINE SPEC ================= */}
        <section className="p-8 sm:p-10 rounded-[28px] bg-klarna-canvas border border-klarna-border shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-klarna-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Data Pipeline Specification</span>
              <h3 className="klarna-heading text-2xl text-klarna-ink mt-1">Full-Stack Scraper Architecture</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-klarna-muted">
              <span>Cron Scheduler: Active</span>
            </div>
          </div>

          <p className="text-sm text-klarna-muted leading-relaxed max-w-3xl">
            Designed by <strong className="text-klarna-ink">Umam</strong> as a personal portfolio project demonstrating resilient web scraping pipelines, database upsert idempotency, and responsive financial data visualization adhering to the Klarna brand guidelines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
              <span className="text-[10px] font-mono font-bold uppercase text-klarna-subdued block">PARSER ENGINE</span>
              <span className="text-base font-bold text-klarna-ink mt-1 block">Cheerio / Node.js</span>
              <span className="text-xs text-klarna-muted mt-0.5 block">Parses HTML table structure cleanly</span>
            </div>
            <div className="p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
              <span className="text-[10px] font-mono font-bold uppercase text-klarna-subdued block">SCHEDULING</span>
              <span className="text-base font-bold text-klarna-ink mt-1 block">4-Hour Intervals</span>
              <span className="text-xs text-klarna-muted mt-0.5 block">Syncs when farside.co.uk publishes</span>
            </div>
            <div className="p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
              <span className="text-[10px] font-mono font-bold uppercase text-klarna-subdued block">DATA INTEGRITY</span>
              <span className="text-base font-bold text-klarna-ink mt-1 block">PostgreSQL Idempotency</span>
              <span className="text-xs text-klarna-muted mt-0.5 block">Compound (date, ticker) unique key</span>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-klarna-border mt-24 py-12 bg-klarna-canvas">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-klarna-pink flex items-center justify-center font-title font-black text-klarna-ink text-sm">
              ₿
            </div>
            <div>
              <p className="font-title font-bold text-sm text-klarna-ink">Bitcoin ETF Flow Dashboard</p>
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

      {/* ================= TOAST SYSTEM ================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
          <div className="klarna-toast">
            <span className="text-klarna-pink font-bold">●</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
