"use client";

import React from "react";
import { useFlowDashboard } from "@/hooks/use-flow-dashboard";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroBanner } from "@/components/dashboard/hero-banner";
import { OverviewKpiCards } from "@/components/dashboard/overview-kpi-cards";
import { FlowDynamicsChart } from "@/components/dashboard/flow-dynamics-chart";
import { IssuersDirectory } from "@/components/dashboard/issuers-directory";
import { HistoricalLedger } from "@/components/dashboard/historical-ledger";
import { IndicatorStudio } from "@/components/lab/indicator-studio";
import { PipelineSpec } from "@/components/spec/pipeline-spec";
import { Toast } from "@/components/ui/toast";

export default function Home() {
  const {
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
    filteredData,
    stats,
    sortedIssuers,
    tableRows,
    displayedRows,
    handleExportCSV,
    handleTriggerSync,
    handleRunSimulation,
  } = useFlowDashboard();

  return (
    <div className="min-h-screen flex flex-col bg-klarna-surface-1 text-klarna-ink selection:bg-klarna-pink selection:text-klarna-ink antialiased w-full overflow-x-hidden">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onExportCSV={handleExportCSV}
      />

      <main className="w-full max-w-[1240px] mx-auto px-4 sm:px-8 py-8 sm:py-16 space-y-12 sm:space-y-24 flex-1 min-w-0">
        <section id="overview" className="w-full min-w-0 space-y-6 sm:space-y-8">
          <HeroBanner
            currentPeriod={currentPeriod}
            onSelectPeriod={(p) => {
              setCurrentPeriod(p);
              showToast(`Horizon updated to ${p.toUpperCase()}`);
            }}
            syncTime={syncTime}
            isSyncing={isSyncing}
            onTriggerSync={handleTriggerSync}
          />

          <OverviewKpiCards stats={stats} currentPeriod={currentPeriod} />
        </section>

        <FlowDynamicsChart
          filteredData={filteredData}
          currentChartMode={currentChartMode}
          showMovingAverage={showMovingAverage}
          stats={stats}
          onSelectMode={setCurrentChartMode}
          onToggleMovingAverage={() => {
            setShowMovingAverage(!showMovingAverage);
            showToast(!showMovingAverage ? "Moving Average activated" : "Moving Average hidden");
          }}
        />

        <IssuersDirectory
          issuers={sortedIssuers}
          issuerSort={issuerSort}
          onSortChange={(sort) => {
            setIssuerSort(sort);
            showToast(`Issuers sorted by ${sort}`);
          }}
        />

        <HistoricalLedger
          searchQuery={searchQuery}
          dirFilter={dirFilter}
          displayedRows={displayedRows}
          totalTableRowsCount={tableRows.length}
          showAllRows={showAllRows}
          onSearchChange={setSearchQuery}
          onDirFilterChange={setDirFilter}
          onToggleShowAllRows={() => setShowAllRows(!showAllRows)}
          onClearFilters={() => {
            setSearchQuery("");
            setDirFilter("all");
          }}
        />

        <IndicatorStudio
          selectedScript={selectedScript}
          isSimulating={isSimulating}
          onSelectScript={(script) => {
            setSelectedScript(script);
          }}
          onRunSimulation={handleRunSimulation}
        />

        <PipelineSpec />
      </main>

      <Footer />
      <Toast message={toastMessage} />
    </div>
  );
}
