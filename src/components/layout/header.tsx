"use client";

import React from "react";
import { MobileDrawer } from "./mobile-drawer";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onExportCSV: () => void;
}

export function Header({
  isMobileMenuOpen,
  onToggleMobileMenu,
  onExportCSV,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-klarna-border bg-klarna-surface-1/90 backdrop-blur-md">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo / Wordmark */}
        <a
          href="#overview"
          className="flex items-center gap-2.5 sm:gap-3 group focus-ring rounded-xl p-1 shrink-0"
          aria-label="Bitcoin ETF Flow Dashboard Home"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-klarna-pink flex items-center justify-center font-title font-black text-klarna-ink text-base sm:text-lg transition-transform group-hover:scale-105 shadow-sm">
            ₿
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-title font-black text-lg sm:text-xl tracking-tight text-klarna-ink group-hover:opacity-80 transition-opacity">
              BTC Flow
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
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Primary CTA: Confident Black Pill Button (desktop/tablet) */}
          <button
            type="button"
            onClick={onExportCSV}
            className="btn-pill-press hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-klarna-ink text-white font-title font-bold text-sm hover:bg-black transition-all focus-ring shadow-card cursor-pointer"
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
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 sm:p-2.5 rounded-full bg-klarna-canvas border border-klarna-border text-klarna-ink hover:bg-klarna-surface-2 focus-ring transition-colors shadow-card cursor-pointer"
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

      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={onToggleMobileMenu}
        onExportCSV={onExportCSV}
      />
    </header>
  );
}
