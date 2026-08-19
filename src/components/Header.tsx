import React from "react";
import { Scale, History, PlusCircle, Sparkles, Download, ArrowRight } from "lucide-react";
import { DecisionAnalysis } from "../types";

interface HeaderProps {
  currentAnalysis: DecisionAnalysis | null;
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onExportMarkdown: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentAnalysis,
  onNewDecision,
  onOpenHistory,
  onExportMarkdown,
  historyCount,
}) => {
  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md transition-all shadow-lg shadow-black/20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={onNewDecision}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400/30 transition-transform hover:scale-105">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-zinc-100">
                  The Tiebreaker
                </span>
                <span className="text-zinc-500 font-mono text-xs hidden sm:inline">
                  / Decision Engine
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden md:block">
                Bento-Structured Multi-Framework Decision Analysis
              </p>
            </div>
          </div>

          {/* Current Inquiry pill in header if available */}
          {currentAnalysis && (
            <div className="hidden lg:flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-full px-3.5 py-1.5 text-xs">
              <span className="text-zinc-500 font-mono uppercase text-[10px] tracking-wider">Inquiry:</span>
              <span className="font-medium text-zinc-200 line-clamp-1 max-w-[280px]">
                {currentAnalysis.title}
              </span>
            </div>
          )}

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentAnalysis && (
              <>
                <button
                  id="btn-export-markdown"
                  onClick={onExportMarkdown}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-xs"
                  title="Export full report as Markdown"
                >
                  <Download className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                <button
                  id="btn-new-decision-header"
                  onClick={onNewDecision}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-xs"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">New Inquiry</span>
                </button>
              </>
            )}

            <button
              id="btn-open-history"
              onClick={onOpenHistory}
              className="relative inline-flex items-center gap-1.5 rounded-xl bg-zinc-800/90 border border-zinc-700/60 px-3.5 py-1.5 text-xs font-semibold text-zinc-100 hover:bg-zinc-700 transition-all shadow-xs"
            >
              <History className="h-3.5 w-3.5 text-zinc-300" />
              <span>Decision Log</span>
              {historyCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-indigo-500 px-1.5 py-0.2 text-[10px] font-mono font-bold text-white shadow-xs">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
