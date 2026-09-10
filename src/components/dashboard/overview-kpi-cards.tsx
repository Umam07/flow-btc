import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  Flame,
  Coins,
  Zap,
  Activity,
  Award,
} from "lucide-react";
import { DashboardStats, TimeHorizon } from "@/types/flow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OverviewKpiCardsProps {
  stats: DashboardStats;
  currentPeriod: TimeHorizon;
}

export function OverviewKpiCards({ stats, currentPeriod }: OverviewKpiCardsProps) {
  const isTotalPos = stats.totalSum >= 0;
  const isLatestPos = stats.latest.total >= 0;
  const isStreakInflow = stats.currentStreak.type === "inflow";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Primary Spotlight */}
        <Card className="hover:shadow-elevated transition-all flex flex-col justify-between">
          <CardHeader className="p-5 sm:p-6 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-klarna-subdued">
                Net Inflow Periode
              </span>
              <Badge variant="secondary" className="font-mono text-[10px] uppercase">
                {currentPeriod} Horizon
              </Badge>
            </div>
            <div
              className={`font-finance text-3xl sm:text-4xl font-black ${
                isTotalPos ? "text-klarna-success" : "text-klarna-error"
              }`}
            >
              {isTotalPos ? "+" : ""}${stats.totalSum.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M
            </div>
            <p className="text-xs text-klarna-muted mt-1">Total akumulasi modal masuk ke instrumen spot</p>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="pt-4 border-t border-klarna-border flex items-center justify-between text-xs mt-4">
              <span className="text-klarna-subdued font-medium flex items-center gap-1">
                {isTotalPos ? <TrendingUp className="w-3.5 h-3.5 text-klarna-success" /> : <TrendingDown className="w-3.5 h-3.5 text-klarna-error" />}
                Kecepatan Aliran
              </span>
              <span className="font-mono font-bold text-klarna-ink">{stats.avgDaily}M/hari</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Latest Session */}
        <Card className="hover:shadow-elevated transition-all flex flex-col justify-between">
          <CardHeader className="p-5 sm:p-6 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-klarna-subdued flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Sesi Terakhir
              </span>
              <Badge variant={isLatestPos ? "success" : "destructive"} className="text-[10px]">
                {isLatestPos ? "Inflow" : "Outflow"}
              </Badge>
            </div>
            <div
              className={`font-finance text-3xl sm:text-4xl font-black ${
                isLatestPos ? "text-klarna-success" : "text-klarna-error"
              }`}
            >
              {isLatestPos ? "+" : ""}${stats.latest.total.toFixed(1)}M
            </div>
            <p className="text-xs text-klarna-muted mt-1">{stats.latest.label}, 2026</p>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="pt-4 border-t border-klarna-border flex items-center justify-between text-xs text-klarna-muted mt-4 font-finance">
              <span>Dominasi IBIT:</span>
              <span className="font-bold text-klarna-ink">+${stats.latest.ibit.toFixed(1)}M</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Dominant Fund (IBIT) */}
        <Card className="hover:shadow-elevated transition-all flex flex-col justify-between">
          <CardHeader className="p-5 sm:p-6 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-klarna-subdued flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Fund Terbesar
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-klarna-ink text-white">
                IBIT
              </span>
            </div>
            <div className="font-finance text-3xl sm:text-4xl font-black text-klarna-ink">
              +${stats.ibitSum.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M
            </div>
            <p className="text-xs text-klarna-muted mt-1">iShares Bitcoin Trust (BlackRock)</p>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="pt-4 border-t border-klarna-border space-y-1 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-klarna-subdued">Pangsa Pasar:</span>
                <span className="font-bold text-klarna-ink">{stats.ibitShare}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Cumulative All-Time */}
        <Card className="hover:shadow-elevated transition-all flex flex-col justify-between">
          <CardHeader className="p-5 sm:p-6 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-klarna-subdued flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Total Bersih Akumulatif
              </span>
              <Badge variant="outline" className="font-mono text-[10px]">
                All Trust
              </Badge>
            </div>
            <div className="font-finance text-3xl sm:text-4xl font-black text-klarna-ink">
              +$27,423M
            </div>
            <p className="text-xs text-klarna-muted mt-1">Sejak peluncuran ETF Spot Januari 2024</p>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="pt-4 border-t border-klarna-border flex items-center justify-between text-xs text-klarna-muted mt-4">
              <span>Rasio Hari Hijau:</span>
              <span className="font-bold text-klarna-success font-finance">{stats.posRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature 2: Institutional Absorption & Streak Intelligence Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Box A: Bitcoin Absorbed vs Miner Issuance */}
        <Card className="bg-klarna-canvas border-klarna-border hover:shadow-elevated transition-all">
          <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className="text-[10px] font-bold border-amber-300/80 bg-amber-50/50 text-amber-900 gap-1">
                    <Coins className="w-3 h-3 text-amber-600" />
                    Bitcoin Supply Absorption
                  </Badge>
                  <span className="text-[11px] font-mono text-klarna-subdued font-semibold">
                    ~${(stats.btcPriceEstimate / 1000).toFixed(0)}k/BTC ref
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-klarna-ink">
                  ETF Penyerapan Pasokan Koin
                </h4>
                <p className="text-xs text-klarna-muted mt-0.5">
                  Perbandingan aliran likuiditas ETF terhadap produksi koin baru miner (~450 BTC/hari).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-klarna-border/70 font-finance">
              <div className="p-3 rounded-xl bg-klarna-surface-1/80 border border-klarna-border/60">
                <span className="text-[10px] uppercase font-bold text-klarna-subdued block">
                  Penyerapan Sesi Ini
                </span>
                <span
                  className={`text-lg sm:text-xl font-black block mt-1 ${
                    isLatestPos ? "text-klarna-success" : "text-klarna-error"
                  }`}
                >
                  {isLatestPos ? "+" : ""}
                  {stats.latestBtcAbsorbed.toLocaleString("en-US")} BTC
                </span>
                <span className="text-[10px] text-klarna-muted font-sans mt-0.5 block">
                  {stats.dailyMinerMultiplier}x lipat pasokan harian
                </span>
              </div>

              <div className="p-3 rounded-xl bg-klarna-surface-1/80 border border-klarna-border/60">
                <span className="text-[10px] uppercase font-bold text-klarna-subdued block">
                  Total Periode ({currentPeriod.toUpperCase()})
                </span>
                <span
                  className={`text-lg sm:text-xl font-black block mt-1 ${
                    stats.periodBtcAbsorbed >= 0 ? "text-klarna-ink" : "text-klarna-error"
                  }`}
                >
                  {stats.periodBtcAbsorbed >= 0 ? "+" : ""}
                  {stats.periodBtcAbsorbed.toLocaleString("en-US")} BTC
                </span>
                <span className="text-[10px] text-klarna-muted font-sans mt-0.5 block">
                  Net reserve change
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Box B: Streak Radar & Institutional Momentum */}
        <Card className="bg-klarna-canvas border-klarna-border hover:shadow-elevated transition-all">
          <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className="text-[10px] font-bold border-blue-300/80 bg-blue-50/50 text-blue-900 gap-1">
                    <Activity className="w-3 h-3 text-blue-600" />
                    Institutional Streak Radar
                  </Badge>
                  <span className="text-[11px] font-mono text-klarna-subdued font-semibold">
                    Momentum Analisis
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-klarna-ink">
                  Rentetan Sesi & Sentimen Pasar
                </h4>
                <p className="text-xs text-klarna-muted mt-0.5">
                  Mengukur konsistensi akumulasi modal tanpa terputus (*consecutive sessions*).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-klarna-border/70 font-finance">
              <div className="p-3 rounded-xl bg-klarna-surface-1/80 border border-klarna-border/60">
                <span className="text-[10px] uppercase font-bold text-klarna-subdued block flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  Streak Saat Ini
                </span>
                <span
                  className={`text-lg sm:text-xl font-black block mt-1 ${
                    isStreakInflow ? "text-klarna-success" : "text-klarna-error"
                  }`}
                >
                  {stats.currentStreak.days} Hari Berturut-turut
                </span>
                <span className="text-[10px] text-klarna-muted font-sans mt-0.5 block">
                  Sesi {isStreakInflow ? "Net Inflow (+)" : "Net Outflow (-)"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-klarna-surface-1/80 border border-klarna-border/60">
                <span className="text-[10px] uppercase font-bold text-klarna-subdued block flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600" />
                  Rekor Inflow Terpanjang
                </span>
                <span className="text-lg sm:text-xl font-black text-klarna-ink block mt-1">
                  {stats.longestInflowStreak} Hari Hijau
                </span>
                <span className="text-[10px] text-klarna-muted font-sans mt-0.5 block">
                  Rekor akumulasi historis
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
