import React from "react";
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  DoorOpen,
  RefreshCw,
  Award,
  Zap,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DecisionAnalysis } from "../types";

interface VerdictHeroProps {
  analysis: DecisionAnalysis;
  onToggleCommit: () => void;
}

export const VerdictHero: React.FC<VerdictHeroProps> = ({ analysis, onToggleCommit }) => {
  const recommended = analysis.options.find(
    (o) => o.id === analysis.verdict.recommendedOptionId
  ) || analysis.options[0];

  const isOneWay = analysis.verdict.reversibilityType === "one-way-door";

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#10b981", "#f59e0b", "#a855f7"],
    });
    onToggleCommit();
  };

  return (
    <div id="verdict-bento-hero" className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Primary Verdict Bento Card (Span 8) */}
      <div className="md:col-span-8 bg-indigo-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-600/20 flex flex-col justify-between">
        {/* Subtle background SVG watermark */}
        <div className="absolute -top-6 -right-6 p-4 opacity-15 pointer-events-none">
          <svg className="h-48 w-48 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-white backdrop-blur-md">
                <Zap className="h-3.5 w-3.5" />
                AI Tiebreaker Verdict
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium backdrop-blur-md ${
                isOneWay
                  ? "bg-rose-950/80 text-rose-200 border border-rose-400/40"
                  : "bg-emerald-950/80 text-emerald-200 border border-emerald-400/40"
              }`}
            >
              {isOneWay ? (
                <>
                  <DoorOpen className="h-3.5 w-3.5 text-rose-300" />
                  <span>One-Way Door (Irreversible)</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Two-Way Door (Reversible)</span>
                </>
              )}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {recommended?.name}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-indigo-100 font-medium leading-relaxed opacity-95">
              {analysis.verdict.headline}
            </p>
          </div>

          <div className="rounded-2xl bg-black/20 p-4 text-xs sm:text-sm text-indigo-50 leading-relaxed border border-white/10 backdrop-blur-xs">
            {analysis.verdict.executiveSummary}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-indigo-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="text-[11px] text-indigo-200/90 max-w-md font-mono">
            <strong className="text-white">Framework Rationale: </strong>
            {analysis.verdict.reversibilityRationale}
          </div>

          <button
            id="btn-lock-in-decision"
            onClick={handleCelebrate}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer ${
              analysis.isDecided
                ? "bg-emerald-500 text-white hover:bg-emerald-400"
                : "bg-white text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            {analysis.isDecided ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>Decision Locked & Committed</span>
              </>
            ) : (
              <>
                <Award className="h-4 w-4 text-indigo-600" />
                <span>Accept Recommendation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confidence Score Bento Tile (Span 4) */}
      <div className="md:col-span-4 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Engine Certainty
            </span>
          </div>
          <TrendingUp className="h-4 w-4 text-indigo-400" />
        </div>

        <div className="py-6 text-center space-y-2">
          <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest">
            Confidence Score
          </p>
          <p className="text-5xl font-mono font-extrabold text-white tracking-tight">
            {analysis.verdict.confidenceScore}%
          </p>
          <div className="w-full bg-zinc-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${analysis.verdict.confidenceScore}%` }}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 text-center font-mono">
          Model: Gemini 3.7 Strategic Intelligence
        </div>
      </div>

      {/* Why This Wins Bento Tile (Span 6) */}
      <div className="md:col-span-6 bg-zinc-900/40 border border-emerald-900/30 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
            Key Catalysts & Why This Wins
          </h3>
        </div>
        <ul className="space-y-3">
          {analysis.verdict.whyThisWins.map((reason, i) => (
            <li key={i} className="text-xs sm:text-sm flex items-start gap-3 text-zinc-300">
              <span className="text-emerald-400 font-bold font-mono text-base leading-none mt-0.5">
                +
              </span>
              <span className="leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trade-Offs Bento Tile (Span 6) */}
      <div className="md:col-span-6 bg-zinc-900/40 border border-rose-900/30 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400 font-mono">
            Required Trade-Offs & Frictions
          </h3>
        </div>
        <ul className="space-y-3">
          {analysis.verdict.keyTradeoffs.map((tradeoff, i) => (
            <li key={i} className="text-xs sm:text-sm flex items-start gap-3 text-zinc-300">
              <span className="text-rose-400 font-bold font-mono text-base leading-none mt-0.5">
                –
              </span>
              <span className="leading-relaxed">{tradeoff}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
