"use client";

import React from "react";
import { ScriptKey } from "@/types/flow";
import { scriptPresets } from "@/constants/script-presets";

interface IndicatorStudioProps {
  selectedScript: ScriptKey;
  isSimulating: boolean;
  onSelectScript: (script: ScriptKey) => void;
  onRunSimulation: () => void;
}

const presetsList: Array<{ key: ScriptKey; label: string }> = [
  { key: "zscore", label: "14D Z-Score" },
  { key: "rotation", label: "IBIT / GBTC Rotation" },
  { key: "velocity", label: "Cumulative Velocity" },
];

export function IndicatorStudio({
  selectedScript,
  isSimulating,
  onSelectScript,
  onRunSimulation,
}: IndicatorStudioProps) {
  const currentPreset = scriptPresets[selectedScript];

  return (
    <section id="scripting-studio" className="w-full min-w-0 overflow-hidden p-5 sm:p-8 lg:p-10 rounded-[24px] sm:rounded-[28px] bg-klarna-canvas border border-klarna-border shadow-card space-y-6 sm:space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 pb-6 border-b border-klarna-border">
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
          <p className="text-xs sm:text-sm text-klarna-muted mt-1">
            Execute sandboxed algorithmic indicators over raw ETF flow series.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-klarna-subdued font-bold mr-1">Presets:</span>
          {presetsList.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => onSelectScript(preset.key)}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all focus-ring cursor-pointer shrink-0 ${
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
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-white border-b border-klarna-border text-xs font-mono text-klarna-muted">
            <span className="flex items-center gap-2 font-bold text-klarna-ink">
              <span className="w-2.5 h-2.5 rounded-full bg-klarna-pink"></span>
              <span className="truncate max-w-[200px] sm:max-w-none">{currentPreset.file}</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-klarna-success shrink-0">Sandboxed Runtime</span>
          </div>
          <pre className="p-4 sm:p-5 text-xs font-mono text-klarna-ink overflow-x-auto leading-relaxed max-h-[320px] sm:max-h-none">
            <code>{currentPreset.code}</code>
          </pre>
        </div>

        {/* Output Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-klarna-surface-1 border border-klarna-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-klarna-subdued">Computed Analysis Output</span>
            <div
              className={`mt-4 p-5 sm:p-6 rounded-2xl bg-klarna-canvas border border-klarna-pink shadow-card space-y-4 transition-opacity duration-300 ${
                isSimulating ? "opacity-35" : "opacity-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-klarna-muted">Indicator Metric</span>
                <span className="font-mono font-bold text-klarna-ink text-xs">{currentPreset.metric}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-klarna-muted">Current Value</span>
                <span className="klarna-display text-2xl sm:text-3xl font-black text-klarna-success font-finance">
                  {currentPreset.value}
                </span>
              </div>
              <div className="pt-3 border-t border-klarna-border flex justify-between text-xs">
                <span className="text-klarna-muted">Signal Status</span>
                <span className={`font-bold ${currentPreset.signalColor}`}>
                  {currentPreset.signal}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={onRunSimulation}
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
  );
}
