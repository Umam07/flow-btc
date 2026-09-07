"use client";

import React from "react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onExportCSV: () => void;
}

export function MobileDrawer({ isOpen, onClose, onExportCSV }: MobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-klarna-border bg-klarna-canvas px-5 py-5 space-y-4 shadow-elevated animate-in fade-in slide-in-from-top-2 duration-200">
      <nav className="flex flex-col space-y-2 text-base font-semibold text-klarna-muted" aria-label="Mobile Navigation">
        <a href="#overview" onClick={onClose} className="py-2.5 px-3 rounded-xl hover:bg-klarna-surface-1 text-klarna-ink hover:text-black transition-colors">
          Overview
        </a>
        <a href="#chart-section" onClick={onClose} className="py-2.5 px-3 rounded-xl hover:bg-klarna-surface-1 hover:text-klarna-ink transition-colors">
          Dynamics
        </a>
        <a href="#issuers" onClick={onClose} className="py-2.5 px-3 rounded-xl hover:bg-klarna-surface-1 hover:text-klarna-ink transition-colors">
          Issuers Directory
        </a>
        <a href="#historical-data" onClick={onClose} className="py-2.5 px-3 rounded-xl hover:bg-klarna-surface-1 hover:text-klarna-ink transition-colors">
          Historical Ledger
        </a>
        <a href="#scripting-studio" onClick={onClose} className="py-2.5 px-3 rounded-xl hover:bg-klarna-surface-1 hover:text-klarna-ink transition-colors flex items-center justify-between">
          <span>Indicator Lab</span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-klarna-pink font-bold text-klarna-ink font-mono">Fase 2</span>
        </a>
      </nav>
      <div className="pt-3 border-t border-klarna-border">
        <button
          type="button"
          onClick={() => {
            onExportCSV();
            onClose();
          }}
          className="w-full py-3 rounded-full bg-klarna-ink text-white font-title font-bold text-sm text-center flex items-center justify-center gap-2 cursor-pointer shadow-card"
        >
          <svg className="w-4 h-4 text-klarna-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export CSV Dataset</span>
        </button>
      </div>
    </div>
  );
}
