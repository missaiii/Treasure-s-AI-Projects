import React, { useState } from "react";
import { Shield, AlertCircle, Sparkles, AlertTriangle, ArrowUpRight } from "lucide-react";
import { DecisionAnalysis } from "../types";

interface SwotViewProps {
  analysis: DecisionAnalysis;
}

export const SwotView: React.FC<SwotViewProps> = ({ analysis }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(analysis.options[0]?.id || "");

  const currentOption =
    analysis.options.find((o) => o.id === selectedOptionId) || analysis.options[0];

  const swot = currentOption?.swot || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };

  return (
    <div id="swot-bento-section" className="space-y-6">
      {/* Option Selector Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex flex-wrap gap-2">
          {analysis.options.map((opt) => {
            const isSelected = opt.id === currentOption.id;
            const isWinner = opt.id === analysis.verdict.recommendedOptionId;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-400/40"
                    : "bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                <span>{opt.name}</span>
                {isWinner && (
                  <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[9px] font-bold text-zinc-950">
                    Leader
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-zinc-500">
          2x2 Strategic Quadrant Architecture
        </span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              SWOT Matrix: {currentOption.name}
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Internal Capabilities vs. External Landscape Analysis
          </p>
        </div>
      </div>

      {/* 2x2 Bento Matrix Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* STRENGTHS (Internal Positive) */}
        <div className="rounded-3xl border border-emerald-900/30 bg-zinc-900/40 p-6 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
                Strengths (Internal Upside)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {swot.strengths.length} items
            </span>
          </div>

          <ul className="space-y-2.5">
            {swot.strengths.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/40 p-3 text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium"
              >
                <span className="text-emerald-400 font-mono font-bold leading-none mt-0.5">
                  +
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES (Internal Negative) */}
        <div className="rounded-3xl border border-rose-900/30 bg-zinc-900/40 p-6 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400 font-mono">
                Weaknesses (Internal Friction)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {swot.weaknesses.length} items
            </span>
          </div>

          <ul className="space-y-2.5">
            {swot.weaknesses.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/40 p-3 text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium"
              >
                <span className="text-rose-400 font-mono font-bold leading-none mt-0.5">
                  –
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OPPORTUNITIES (External Positive) */}
        <div className="rounded-3xl border border-indigo-900/30 bg-zinc-900/40 p-6 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">
                Opportunities (External Upside)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {swot.opportunities.length} items
            </span>
          </div>

          <ul className="space-y-2.5">
            {swot.opportunities.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/40 p-3 text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium"
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* THREATS (External Negative) */}
        <div className="rounded-3xl border border-amber-900/30 bg-zinc-900/40 p-6 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
                Threats (External Risks)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {swot.threats.length} items
            </span>
          </div>

          <ul className="space-y-2.5">
            {swot.threats.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/40 p-3 text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
