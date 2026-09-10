"use client";

import React, { useId, useMemo, useState } from "react";
import {
  Search,
  ArrowUpDown,
  Filter,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  X,
  TrendingUp,
  TrendingDown,
  Building2,
  Sparkles,
  Info,
  Coins,
} from "lucide-react";
import { FlowDirectionFilter, FlowRecord } from "@/types/flow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

type SortColumn = "date" | "total" | "ibit" | "fbtc" | "gbtc";
type SortOrder = "asc" | "desc";

// Fund issuer metadata reference for the drawer
const FUND_NAMES: Record<string, { name: string; manager: string; fee: string }> = {
  IBIT: { name: "iShares Bitcoin Trust", manager: "BlackRock", fee: "0.25%" },
  FBTC: { name: "Wise Origin Bitcoin Trust", manager: "Fidelity", fee: "0.25%" },
  BITB: { name: "Bitwise Bitcoin ETF", manager: "Bitwise", fee: "0.20%" },
  ARKB: { name: "ARK 21Shares Bitcoin ETF", manager: "ARK / 21Shares", fee: "0.21%" },
  BTCO: { name: "Invesco Galaxy Bitcoin ETF", manager: "Invesco", fee: "0.25%" },
  EZBC: { name: "Franklin Bitcoin ETF", manager: "Franklin Templeton", fee: "0.19%" },
  BRRR: { name: "Valkyrie Bitcoin Fund", manager: "CoinShares", fee: "0.25%" },
  HODL: { name: "VanEck Bitcoin Trust", manager: "VanEck", fee: "0.20%" },
  BTCW: { name: "WisdomTree Bitcoin Fund", manager: "WisdomTree", fee: "0.25%" },
  MSBT: { name: "Grayscale Mini Trust", manager: "Grayscale", fee: "0.14%" },
  GBTC: { name: "Grayscale Bitcoin Trust", manager: "Grayscale", fee: "1.50%" },
  BTC: { name: "Grayscale Mini / Other", manager: "Grayscale", fee: "0.15%" },
};

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
  const dirFilterSelectId = useId();
  const [sortCol, setSortCol] = useState<SortColumn>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const toggleRow = (date: string) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  const handleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortOrder("desc");
    }
  };

  const sortedRows = useMemo(() => {
    return [...displayedRows].sort((a, b) => {
      let valA: number | string = a[sortCol];
      let valB: number | string = b[sortCol];

      if (sortCol === "date") {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [displayedRows, sortCol, sortOrder]);

  const hasActiveFilters = searchQuery.trim() !== "" || dirFilter !== "all";

  return (
    <Card id="historical-data" className="w-full border-klarna-border shadow-card overflow-hidden">
      <CardHeader className="border-b border-klarna-border/70 pb-5 bg-klarna-canvas">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-klarna-subdued flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Granular Records
              </span>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {totalTableRowsCount} Sessions
              </Badge>
            </div>
            <CardTitle className="text-2xl sm:text-3xl text-klarna-ink font-black tracking-tight">
              Historical ETF Flow Ledger
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-klarna-muted mt-1">
              Klik baris mana saja untuk membuka rincian lengkap 11 emiten ETF Bitcoin pada sesi tersebut.
            </CardDescription>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input with shadcn Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-klarna-subdued absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                placeholder="Cari tanggal (misal: Sep 04)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Filter records by date"
                className="pl-10 pr-9 text-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-klarna-subdued hover:text-klarna-ink p-1"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Direction Filter Dropdown */}
            <div className="relative w-full sm:w-auto">
              <label htmlFor={dirFilterSelectId} className="sr-only">
                Filter by flow direction
              </label>
              <select
                id={dirFilterSelectId}
                value={dirFilter}
                onChange={(e) => onDirFilterChange(e.target.value as FlowDirectionFilter)}
                aria-label="Filter records by flow direction"
                className="w-full sm:w-auto appearance-none pl-9 pr-9 py-2 rounded-full bg-klarna-canvas border border-klarna-border text-xs text-klarna-ink font-bold focus-ring cursor-pointer shadow-card h-10"
              >
                <option value="all">Semua Sesi Pasar</option>
                <option value="inflow">Net Inflow Sahaja (+$)</option>
                <option value="outflow">Net Outflow Sahaja (-$)</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-klarna-subdued absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-klarna-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs text-klarna-subdued hover:text-klarna-ink self-center"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Table Tip */}
        <div className="flex items-center justify-between px-4 py-2 bg-klarna-surface-2/60 border-b border-klarna-border text-[11px] text-klarna-muted font-medium">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-klarna-ink" />
            <span>Klik baris untuk membuka / menutup breakdown rincian 11 ETF</span>
          </span>
          <span className="font-mono text-klarna-ink text-[10px] hidden sm:inline">
            EXPANDABLE DRAWER
          </span>
        </div>

        {/* Clean & Legible Table with Progressive Disclosure */}
        <div className="w-full overflow-x-auto">
          <Table className="w-full border-collapse font-finance">
            <TableHeader>
              <TableRow className="bg-klarna-surface-2/70 border-b border-klarna-border text-[11px] font-mono uppercase text-klarna-muted tracking-wider hover:bg-klarna-surface-2">
                <TableHead
                  onClick={() => handleSort("date")}
                  className="py-3.5 px-4 font-bold text-klarna-ink cursor-pointer select-none hover:text-klarna-pink-pressed transition-colors w-[180px]"
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Tanggal</span>
                    <ArrowUpDown className="w-3 h-3 text-klarna-subdued" />
                  </div>
                </TableHead>

                <TableHead
                  onClick={() => handleSort("total")}
                  className="py-3.5 px-4 font-bold text-klarna-ink cursor-pointer select-none hover:text-klarna-pink-pressed transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Total Net Flow</span>
                    <ArrowUpDown className="w-3 h-3 text-klarna-subdued" />
                  </div>
                </TableHead>

                <TableHead className="py-3.5 px-4 font-bold text-klarna-ink">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Market Driver</span>
                  </div>
                </TableHead>

                <TableHead
                  onClick={() => handleSort("ibit")}
                  className="py-3.5 px-4 font-bold text-emerald-700 cursor-pointer select-none hidden md:table-cell"
                >
                  IBIT (BlackRock)
                </TableHead>

                <TableHead
                  onClick={() => handleSort("gbtc")}
                  className="py-3.5 px-4 font-bold text-klarna-error cursor-pointer select-none hidden md:table-cell"
                >
                  GBTC (Grayscale)
                </TableHead>

                <TableHead className="py-3.5 px-4 font-bold text-right text-klarna-ink">
                  Status
                </TableHead>

                <TableHead className="w-10 px-2 text-center"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-xs divide-y divide-klarna-border/60">
              {sortedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-klarna-surface-2 flex items-center justify-center text-klarna-muted">
                        <Search className="w-5 h-5" />
                      </div>
                      <p className="text-klarna-ink font-bold text-sm">Tidak ada rekaman sesi yang cocok</p>
                      <p className="text-xs text-klarna-muted max-w-sm">
                        Tidak ada catatan aliran ETF yang cocok dengan kata kunci pencarian atau filter Anda.
                      </p>
                      <Button variant="default" size="sm" onClick={onClearFilters} className="mt-2">
                        Reset Filter
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedRows.map((r) => {
                  const isPos = r.total >= 0;
                  const isExpanded = expandedDate === r.date;
                  const btcEquiv = Math.round(((r.total || 0) * 1_000_000) / 65000);

                  // Extract all funds from breakdown or fallback
                  const flowsMap = r.breakdown || {
                    IBIT: r.ibit,
                    FBTC: r.fbtc,
                    BITB: r.bitb,
                    ARKB: r.arkb,
                    GBTC: r.gbtc,
                    Others: r.others,
                  };

                  return (
                    <React.Fragment key={r.date}>
                      {/* Primary Clean Row */}
                      <TableRow
                        onClick={() => toggleRow(r.date)}
                        className={`transition-colors cursor-pointer group ${
                          isExpanded
                            ? "bg-klarna-surface-1/90 border-b-0"
                            : "hover:bg-klarna-surface-1/60"
                        }`}
                      >
                        <TableCell className="py-3.5 px-4 font-bold text-klarna-ink whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">{r.label}, 2026</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5 px-4 font-black text-xs sm:text-sm whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {isPos ? (
                              <TrendingUp className="w-3.5 h-3.5 text-klarna-success shrink-0" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5 text-klarna-error shrink-0" />
                            )}
                            <span className={isPos ? "text-klarna-success" : "text-klarna-error"}>
                              {isPos ? "+" : ""}
                              {r.total.toFixed(1)}M
                            </span>
                          </div>
                        </TableCell>

                        {/* Smart Driver Badge (Feature 3) */}
                        <TableCell className="py-3.5 px-4 whitespace-nowrap">
                          {r.marketDriver ? (
                            <div className="flex items-center gap-1.5">
                              <Badge
                                variant={r.marketDriver.isPositive ? "success" : "destructive"}
                                className="text-[10px] font-mono tracking-tight font-bold"
                              >
                                {r.marketDriver.badgeText}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-klarna-subdued text-[11px]">-</span>
                          )}
                        </TableCell>

                        {/* IBIT Column (Clean overview) */}
                        <TableCell className="py-3.5 px-4 font-semibold text-emerald-700 whitespace-nowrap hidden md:table-cell">
                          {r.ibit >= 0 ? "+" : ""}
                          {r.ibit.toFixed(1)}M
                        </TableCell>

                        {/* GBTC Column */}
                        <TableCell className="py-3.5 px-4 font-bold text-klarna-error whitespace-nowrap hidden md:table-cell">
                          {r.gbtc >= 0 ? "+" : ""}
                          {r.gbtc.toFixed(1)}M
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell className="py-3.5 px-4 text-right whitespace-nowrap">
                          <Badge variant={isPos ? "success" : "destructive"}>
                            {isPos ? "Net Inflow" : "Net Outflow"}
                          </Badge>
                        </TableCell>

                        {/* Expand Chevron Icon */}
                        <TableCell className="py-3.5 px-2 text-center text-klarna-subdued group-hover:text-klarna-ink transition-colors">
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-90 text-klarna-ink" : ""
                            }`}
                          />
                        </TableCell>
                      </TableRow>

                      {/* Expandable Drawer Panel (Feature 1: Progressive Disclosure) */}
                      {isExpanded && (
                        <TableRow className="bg-klarna-surface-1/90 border-b border-klarna-border/80">
                          <TableCell colSpan={7} className="p-4 sm:p-6 pt-2">
                            <div className="rounded-2xl bg-klarna-canvas border border-klarna-border/70 p-4 sm:p-5 space-y-4 shadow-sm">
                              {/* Session Summary Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-klarna-border/60">
                                <div>
                                  <h4 className="font-bold text-sm text-klarna-ink flex items-center gap-2">
                                    <span>Rincian Arus Seluruh Emiten ETF</span>
                                    <span className="text-xs text-klarna-muted font-normal font-mono">
                                      ({r.date})
                                    </span>
                                  </h4>
                                  <p className="text-[11px] text-klarna-muted mt-0.5">
                                    Disadur dari institutional feed Farside Investors.
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs">
                                  <Badge variant="outline" className="gap-1 font-mono text-[10px]">
                                    <Coins className="w-3 h-3 text-amber-500" />
                                    {isPos ? "+" : ""}{btcEquiv.toLocaleString("en-US")} BTC Equivalent
                                  </Badge>
                                </div>
                              </div>

                              {/* 11 ETF Flow Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 font-finance">
                                {Object.entries(flowsMap).map(([ticker, val]) => {
                                  const num = Number(val) || 0;
                                  const isFundPos = num >= 0;
                                  const meta = FUND_NAMES[ticker] || {
                                    name: ticker,
                                    manager: "Issuer",
                                    fee: "0.25%",
                                  };

                                  return (
                                    <div
                                      key={ticker}
                                      className="p-3 rounded-xl bg-klarna-surface-1/70 border border-klarna-border/60 flex flex-col justify-between"
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-mono font-bold text-xs text-klarna-ink bg-white px-2 py-0.5 rounded-full border border-klarna-border/80">
                                          {ticker}
                                        </span>
                                        <span className="text-[10px] text-klarna-subdued font-sans">
                                          Fee {meta.fee}
                                        </span>
                                      </div>

                                      <div className="mt-2">
                                        <span
                                          className={`text-sm sm:text-base font-black ${
                                            num === 0
                                              ? "text-klarna-subdued"
                                              : isFundPos
                                              ? "text-klarna-success"
                                              : "text-klarna-error"
                                          }`}
                                        >
                                          {num > 0 ? "+" : ""}
                                          ${num.toFixed(1)}M
                                        </span>
                                        <p className="text-[10px] text-klarna-muted font-sans truncate mt-0.5">
                                          {meta.manager}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer controls & pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-klarna-border bg-klarna-surface-1/40 text-xs text-klarna-muted">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-klarna-subdued" />
            <span>
              {sortedRows.length === 0
                ? "0 sesi ditemukan"
                : `Menampilkan ${sortedRows.length} dari ${totalTableRowsCount} sesi transaksi`}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleShowAllRows}
            className="text-xs font-bold text-klarna-ink shadow-card"
          >
            {showAllRows
              ? "Tampilkan 15 Sesi Terbaru"
              : `Tampilkan Semua Sesi (${totalTableRowsCount})`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
