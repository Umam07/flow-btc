"use client";

import React, { useId, useMemo, useState } from "react";
import {
  Search,
  ArrowUpDown,
  Filter,
  Calendar,
  Layers,
  ChevronDown,
  X,
  TrendingUp,
  TrendingDown,
  Building2,
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

type SortColumn = "date" | "total" | "ibit" | "fbtc" | "bitb" | "arkb" | "gbtc" | "others";
type SortOrder = "asc" | "desc";

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

  // Interactive column sorting
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
              Data verified via{" "}
              <a
                href="https://farside.co.uk/btc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-klarna-ink font-bold underline focus-ring rounded"
              >
                farside.co.uk
              </a>{" "}
              institutional feeds. Click table headers to sort columns.
            </CardDescription>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input with shadcn Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-klarna-subdued absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                placeholder="Filter date (e.g. Sep 04)..."
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
                <option value="all">All Sessions</option>
                <option value="inflow">Inflows Only (+$)</option>
                <option value="outflow">Outflows Only (-$)</option>
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
        {/* Mobile Swipe Hint */}
        <div className="sm:hidden flex items-center justify-between px-4 py-2 bg-klarna-surface-2/60 border-b border-klarna-border text-[11px] text-klarna-muted font-medium">
          <span className="flex items-center gap-1.5">
            <span>👉</span>
            <span>Geser horizontal untuk rincian semua ETF</span>
          </span>
          <span className="font-mono font-bold text-klarna-ink text-[10px]">11 ISSUERS</span>
        </div>

        {/* shadcn Table Component */}
        <div className="w-full overflow-x-auto">
          <Table className="w-full border-collapse font-finance">
            <TableHeader>
              <TableRow className="bg-klarna-surface-2/70 border-b border-klarna-border text-[11px] font-mono uppercase text-klarna-muted tracking-wider hover:bg-klarna-surface-2">
                <TableHead
                  onClick={() => handleSort("date")}
                  className="py-3.5 px-4 font-bold text-klarna-ink cursor-pointer select-none hover:text-klarna-pink-pressed transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-klarna-subdued" />
                  </div>
                </TableHead>

                <TableHead
                  onClick={() => handleSort("total")}
                  className="py-3.5 px-4 font-bold text-klarna-ink cursor-pointer select-none hover:text-klarna-pink-pressed transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Net Total</span>
                    <ArrowUpDown className="w-3 h-3 text-klarna-subdued" />
                  </div>
                </TableHead>

                <TableHead
                  onClick={() => handleSort("ibit")}
                  className="py-3.5 px-3 font-bold text-emerald-700 cursor-pointer select-none hover:text-emerald-900 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>IBIT</span>
                    <span className="text-[9px] font-sans font-normal opacity-75">(BlackRock)</span>
                  </div>
                </TableHead>

                <TableHead
                  onClick={() => handleSort("fbtc")}
                  className="py-3.5 px-3 font-bold text-klarna-ink cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>FBTC</span>
                    <span className="text-[9px] font-sans font-normal opacity-75">(Fidelity)</span>
                  </div>
                </TableHead>

                <TableHead
                  onClick={() => handleSort("bitb")}
                  className="py-3.5 px-3 font-bold text-klarna-ink cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>BITB</span>
                  </div>
                </TableHead>

                <TableHead
                  onClick={() => handleSort("arkb")}
                  className="py-3.5 px-3 font-bold text-klarna-ink cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>ARKB</span>
                  </div>
                </TableHead>

                <TableHead
                  onClick={() => handleSort("gbtc")}
                  className="py-3.5 px-3 font-bold text-klarna-error cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>GBTC</span>
                    <span className="text-[9px] font-sans font-normal opacity-75">(Grayscale)</span>
                  </div>
                </TableHead>

                <TableHead
                  onClick={() => handleSort("others")}
                  className="py-3.5 px-3 font-bold text-klarna-subdued cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Others</span>
                  </div>
                </TableHead>

                <TableHead className="py-3.5 px-4 font-bold text-right text-klarna-ink">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-xs divide-y divide-klarna-border/60">
              {sortedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-16 text-center">
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

                  return (
                    <TableRow
                      key={r.date}
                      className="hover:bg-klarna-surface-1/80 transition-colors group"
                    >
                      <TableCell className="py-3.5 px-4 font-bold text-klarna-ink whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{r.label}, 2026</span>
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

                      <TableCell className="py-3.5 px-3 font-semibold text-klarna-success whitespace-nowrap">
                        {r.ibit >= 0 ? "+" : ""}
                        {r.ibit.toFixed(1)}M
                      </TableCell>

                      <TableCell
                        className={`py-3.5 px-3 whitespace-nowrap font-medium ${
                          r.fbtc >= 0 ? "text-klarna-ink" : "text-klarna-error"
                        }`}
                      >
                        {r.fbtc >= 0 ? "+" : ""}
                        {r.fbtc.toFixed(1)}M
                      </TableCell>

                      <TableCell
                        className={`py-3.5 px-3 whitespace-nowrap ${
                          r.bitb >= 0 ? "text-klarna-ink" : "text-klarna-error"
                        }`}
                      >
                        {r.bitb >= 0 ? "+" : ""}
                        {r.bitb.toFixed(1)}M
                      </TableCell>

                      <TableCell
                        className={`py-3.5 px-3 whitespace-nowrap ${
                          r.arkb >= 0 ? "text-klarna-ink" : "text-klarna-error"
                        }`}
                      >
                        {r.arkb >= 0 ? "+" : ""}
                        {r.arkb.toFixed(1)}M
                      </TableCell>

                      <TableCell className="py-3.5 px-3 font-bold text-klarna-error whitespace-nowrap">
                        {r.gbtc >= 0 ? "+" : ""}
                        {r.gbtc.toFixed(1)}M
                      </TableCell>

                      <TableCell className="py-3.5 px-3 text-klarna-muted whitespace-nowrap">
                        {r.others >= 0 ? "+" : ""}
                        {r.others.toFixed(1)}M
                      </TableCell>

                      <TableCell className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Badge variant={isPos ? "success" : "destructive"}>
                          {isPos ? "Net Inflow" : "Net Outflow"}
                        </Badge>
                      </TableCell>
                    </TableRow>
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
              ? "Tampilkan 10 Sesi Terbaru"
              : `Tampilkan Semua Sesi (${totalTableRowsCount})`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
