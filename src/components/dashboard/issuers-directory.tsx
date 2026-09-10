"use client";

import React, { useId } from "react";
import { ChevronDown, Building2, TrendingUp, TrendingDown, Percent, Award } from "lucide-react";
import { Issuer, IssuerSortOption } from "@/types/flow";
import { formatFlowValue } from "@/utils/formatters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const issuerSortSelectId = useId();

  return (
    <section id="issuers" className="w-full min-w-0 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            Market Participants
          </span>
          <h2 className="klarna-heading text-2xl sm:text-4xl text-klarna-ink mt-1">
            Spot Bitcoin ETF Issuers
          </h2>
          <p className="text-xs sm:text-sm text-klarna-muted mt-1">
            Daftar pengelola dana (fund managers) dan perbandingan total arus modal serta biaya pengelolaan (expense ratio).
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <label htmlFor={issuerSortSelectId} className="text-xs font-bold text-klarna-muted shrink-0">
            Urutkan berdasarkan:
          </label>
          <div className="relative w-full sm:w-auto">
            <select
              id={issuerSortSelectId}
              value={issuerSort}
              onChange={(e) => onSortChange(e.target.value as IssuerSortOption)}
              className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2 rounded-full bg-klarna-canvas border border-klarna-border text-xs text-klarna-ink font-bold focus-ring cursor-pointer shadow-card h-9"
            >
              <option value="inflow">Total Arus Masuk Terbesar</option>
              <option value="fee">Expense Ratio Terendah</option>
              <option value="ticker">Ticker Alphabetical</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-klarna-ink/70 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {issuers.map((issuer) => {
          const formattedInflow = formatFlowValue(issuer.totalInflow);
          const isLatestPositive = issuer.latestSession >= 0;

          return (
            <Card
              key={issuer.ticker}
              className={`hover:shadow-elevated transition-all flex flex-col justify-between relative overflow-hidden ${
                issuer.isLeader ? "border-2 border-klarna-pink shadow-pink-glow/20" : "border-klarna-border"
              }`}
            >
              {issuer.highlight && (
                <div className="absolute top-3 right-3">
                  <Badge variant="default" className="bg-klarna-pink text-klarna-ink hover:bg-klarna-pink text-[10px] uppercase font-black tracking-wide border-0 shadow-sm flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {issuer.highlight}
                  </Badge>
                </div>
              )}

              <CardHeader className="p-5 sm:p-6 pb-3">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`font-mono font-bold text-xs px-2.5 py-1 rounded-full ${
                      issuer.isLeader ? "bg-klarna-ink text-white" : "bg-klarna-surface-2 text-klarna-ink"
                    }`}
                  >
                    {issuer.ticker}
                  </span>
                  <Badge variant={issuer.isNegative ? "destructive" : "secondary"} className="text-[10px]">
                    <Percent className="w-2.5 h-2.5 mr-0.5" />
                    Fee {issuer.fee.toFixed(2)}%
                  </Badge>
                </div>

                <CardTitle className="text-base sm:text-lg text-klarna-ink line-clamp-1">
                  {issuer.name}
                </CardTitle>
                <p className="text-xs text-klarna-muted mt-0.5">{issuer.manager}</p>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 pt-0">
                <div className="mt-4 pt-4 border-t border-klarna-border space-y-2.5 font-finance">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] uppercase font-bold text-klarna-subdued flex items-center gap-1">
                      Sesi Terakhir
                    </span>
                    <span
                      className={`font-bold text-sm flex items-center gap-1 ${
                        isLatestPositive ? "text-klarna-success" : "text-klarna-error"
                      }`}
                    >
                      {isLatestPositive ? (
                        <TrendingUp className="w-3 h-3 text-klarna-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-klarna-error" />
                      )}
                      {isLatestPositive ? "+" : ""}${issuer.latestSession.toFixed(1)}M
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] uppercase font-bold text-klarna-subdued">
                      {issuer.isNegative ? "Net Redemptions" : "Total Aliran"}
                    </span>
                    <span
                      className={`font-black text-sm sm:text-base ${
                        issuer.totalInflow >= 0 ? "text-klarna-ink" : "text-klarna-error"
                      }`}
                    >
                      {issuer.totalInflow >= 0 ? "+" : ""}${formattedInflow}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
