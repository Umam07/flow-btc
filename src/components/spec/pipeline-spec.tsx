import React from "react";

export function PipelineSpec() {
  return (
    <section className="w-full min-w-0 p-5 sm:p-8 lg:p-10 rounded-[24px] sm:rounded-[28px] bg-klarna-canvas border border-klarna-border shadow-card space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-klarna-border pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Data Pipeline Specification</span>
          <h3 className="klarna-heading text-xl sm:text-2xl text-klarna-ink mt-1">Full-Stack Scraper Architecture</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-klarna-muted">
          <span>Cron Scheduler: Active</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-klarna-muted leading-relaxed max-w-3xl">
        Designed by <strong className="text-klarna-ink">Umam</strong> as a personal portfolio project demonstrating resilient web scraping pipelines, database upsert idempotency, and responsive financial data visualization adhering to the Klarna brand guidelines.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
        <div className="p-4 sm:p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
          <span className="text-[10px] font-mono font-bold uppercase text-klarna-subdued block">PARSER ENGINE</span>
          <span className="text-sm sm:text-base font-bold text-klarna-ink mt-1 block">Camoufox (Stealth C++)</span>
          <span className="text-xs text-klarna-muted mt-0.5 block">Bypasses Cloudflare & extracts tables cleanly</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
          <span className="text-[10px] font-mono font-bold uppercase text-klarna-subdued block">SCHEDULING</span>
          <span className="text-sm sm:text-base font-bold text-klarna-ink mt-1 block">4-Hour Intervals</span>
          <span className="text-xs text-klarna-muted mt-0.5 block">Syncs when farside.co.uk publishes</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
          <span className="text-[10px] font-mono font-bold uppercase text-klarna-subdued block">DATA INTEGRITY</span>
          <span className="text-sm sm:text-base font-bold text-klarna-ink mt-1 block">PostgreSQL Idempotency</span>
          <span className="text-xs text-klarna-muted mt-0.5 block">Compound (date, ticker) unique key</span>
        </div>
      </div>
    </section>
  );
}
