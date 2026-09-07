"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FlowRecord,
  Issuer,
  ScrapedFlowJson,
  TimeHorizon,
  ChartMode,
  FlowDirectionFilter,
  IssuerSortOption,
  ScriptKey,
  DashboardStats,
} from "@/types/flow";
import { defaultRawFlowData, defaultIssuersData } from "@/constants/default-data";
import { transformScrapedData } from "@/utils/data-transform";
import { exportFlowsToCSV } from "@/utils/csv-export";
import { formatToWIB } from "@/utils/formatters";

export function useFlowDashboard() {
  const [currentPeriod, setCurrentPeriod] = useState<TimeHorizon>("30d");
  const [currentChartMode, setCurrentChartMode] = useState<ChartMode>("daily");
  const [showMovingAverage, setShowMovingAverage] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [dirFilter, setDirFilter] = useState<FlowDirectionFilter>("all");
  const [showAllRows, setShowAllRows] = useState<boolean>(false);
  const [issuerSort, setIssuerSort] = useState<IssuerSortOption>("inflow");
  const [selectedScript, setSelectedScript] = useState<ScriptKey>("zscore");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncTime, setSyncTime] = useState<string>("21:01 WIB");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic state loaded from scraped JSON
  const [flowData, setFlowData] = useState<FlowRecord[]>(defaultRawFlowData);
  const [issuers, setIssuers] = useState<Issuer[]>(defaultIssuersData);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Initial load of scraped data on mount
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        let res = await fetch(`/data/btc_etf_flows_all.json?t=${Date.now()}`);
        if (!res.ok) {
          res = await fetch(`/data/btc_etf_flows.json?t=${Date.now()}`);
        }
        if (res.ok && isMounted) {
          const json: ScrapedFlowJson = await res.json();
          const { convertedFlows, computedIssuers } = transformScrapedData(json);
          if (convertedFlows.length > 0) {
            setFlowData(convertedFlows);
          }
          if (computedIssuers.length > 0) {
            setIssuers(computedIssuers);
          }
          if (json.metadata?.scraped_at) {
            setSyncTime(formatToWIB(json.metadata.scraped_at));
          }
        }
      } catch (err) {
        console.warn("Could not load initial scraped data, using default fallback:", err);
      }
    };

    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered dataset for statistics and chart based on period
  const filteredData = useMemo(() => {
    let count: number;
    switch (currentPeriod) {
      case "7d":
        count = 7;
        break;
      case "30d":
        count = 30;
        break;
      case "90d":
        count = 90;
        break;
      case "ytd": {
        const latestYear = flowData[0]?.date?.slice(0, 4) || "2026";
        const ytdRecords = flowData.filter((d) => d.date.startsWith(latestYear));
        count = Math.max(7, ytdRecords.length);
        break;
      }
      case "all":
      default:
        count = flowData.length;
        break;
    }
    return flowData.slice(0, count).reverse();
  }, [flowData, currentPeriod]);

  // Financial calculations
  const stats: DashboardStats = useMemo(() => {
    const totalSum = Math.round(filteredData.reduce((acc, curr) => acc + curr.total, 0) * 10) / 10;
    const totalDays = filteredData.length;

    // Prior window delta
    const count = currentPeriod === "7d" ? 7 : currentPeriod === "30d" ? 30 : 14;
    const recentSlice = flowData.slice(0, count);
    const priorSlice = flowData.slice(count, count * 2);
    const recentSum = recentSlice.reduce((a, b) => a + b.total, 0);
    const priorSum = priorSlice.length > 0 ? priorSlice.reduce((a, b) => a + b.total, 0) : recentSum * 0.9;
    const delta = Math.round((recentSum - priorSum) * 10) / 10;
    const deltaPct = priorSum !== 0 ? ((delta / Math.abs(priorSum)) * 100).toFixed(1) : "0.0";

    // Latest session stats
    const latest = flowData[0] || {
      date: "",
      label: "",
      total: 0,
      ibit: 0,
      fbtc: 0,
      bitb: 0,
      arkb: 0,
      gbtc: 0,
      others: 0,
    };
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
        peakInflowDate = `${d.label}, ${d.date?.slice(0, 4) || ""}`;
      }
      if (d.total < peakOutflow) {
        peakOutflow = d.total;
        peakOutflowDate = `${d.label}, ${d.date?.slice(0, 4) || ""}`;
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
      peakInflow: peakInflow === -Infinity ? 0 : peakInflow,
      peakInflowDate: peakInflowDate || "-",
      peakOutflow: peakOutflow === Infinity ? 0 : peakOutflow,
      peakOutflowDate: peakOutflowDate || "-",
      positiveCount,
      totalDays,
      posRate,
      avgDaily,
    };
  }, [flowData, filteredData, currentPeriod]);

  // Sorted issuers
  const sortedIssuers = useMemo(() => {
    return [...issuers].sort((a, b) => {
      if (issuerSort === "inflow") return b.totalInflow - a.totalInflow;
      if (issuerSort === "fee") return a.fee - b.fee;
      if (issuerSort === "ticker") return a.ticker.localeCompare(b.ticker);
      return 0;
    });
  }, [issuers, issuerSort]);

  // Filtered table rows
  const tableRows = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return flowData.filter((row) => {
      const matchesSearch = row.label.toLowerCase().includes(q) || row.date.includes(q);
      const matchesDir = dirFilter === "all" ? true : dirFilter === "inflow" ? row.total >= 0 : row.total < 0;
      return matchesSearch && matchesDir;
    });
  }, [flowData, searchQuery, dirFilter]);

  const displayedRows = useMemo(() => {
    return showAllRows ? tableRows : tableRows.slice(0, 15);
  }, [tableRows, showAllRows]);

  // CSV Export handler
  const handleExportCSV = () => {
    const records = tableRows.length > 0 ? tableRows : flowData;
    exportFlowsToCSV(records);
    showToast(`Exported ${records.length} sessions to CSV`);
  };

  // Pipeline Sync trigger with real data refetching
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    showToast("Mengambil data terbaru dari hasil scraping Farside...");

    try {
      let res = await fetch(`/data/btc_etf_flows_all.json?t=${Date.now()}`);
      if (!res.ok) {
        res = await fetch(`/data/btc_etf_flows.json?t=${Date.now()}`);
      }
      if (!res.ok) {
        throw new Error(`HTTP status: ${res.status}`);
      }

      const json: ScrapedFlowJson = await res.json();
      const { convertedFlows, computedIssuers } = transformScrapedData(json);

      if (convertedFlows.length > 0) {
        setFlowData(convertedFlows);
      }
      if (computedIssuers.length > 0) {
        setIssuers(computedIssuers);
      }

      const timeStr = formatToWIB(json.metadata?.scraped_at || new Date());
      setSyncTime(timeStr);
      showToast(`Data sinkron! ${convertedFlows.length} sesi transaksi ETF dimuat (${timeStr})`);
    } catch (err) {
      console.error("Sinkronisasi gagal:", err);
      showToast("Gagal mengambil data scraping, menggunakan cache lokal.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Script simulator
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      showToast("Indicator successfully executed against dataset");
    }, 350);
  };

  return {
    currentPeriod,
    setCurrentPeriod,
    currentChartMode,
    setCurrentChartMode,
    showMovingAverage,
    setShowMovingAverage,
    searchQuery,
    setSearchQuery,
    dirFilter,
    setDirFilter,
    showAllRows,
    setShowAllRows,
    issuerSort,
    setIssuerSort,
    selectedScript,
    setSelectedScript,
    isSimulating,
    isSyncing,
    syncTime,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toastMessage,
    showToast,
    flowData,
    filteredData,
    stats,
    sortedIssuers,
    tableRows,
    displayedRows,
    handleExportCSV,
    handleTriggerSync,
    handleRunSimulation,
  };
}
