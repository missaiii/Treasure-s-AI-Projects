import React, { useState } from "react";
import {
  Clock,
  HeartCrack,
  EyeOff,
  CheckSquare,
  ShieldCheck,
  Compass,
  ArrowRight,
  Check,
} from "lucide-react";
import { DecisionAnalysis } from "../types";

interface MentalModelsViewProps {
  analysis: DecisionAnalysis;
}

export const MentalModelsView: React.FC<MentalModelsViewProps> = ({ analysis }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div id="mental-models-bento-section" className="space-y-6">
      {/* 1. The 10/10/10 Rule Bento Card */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-7 backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-sans">
                The 10/10/10 Framework (Suzy Welch)
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Temporal Perspective Shift across 3 Time Horizons
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
            Emotional Longevity Test
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {analysis.options.map((opt) => {
            const perspective = analysis.tenTenTenRule[opt.id];
            const isWinner = opt.id === analysis.verdict.recommendedOptionId;
            return (
              <div
                key={opt.id}
                className={`rounded-2xl border p-5 transition-all ${
                  isWinner
                    ? "border-indigo-500/40 bg-indigo-950/20 shadow-lg shadow-indigo-900/20"
                    : "border-zinc-800 bg-zinc-950/40"
                }`}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
                  <h4 className="font-bold text-sm text-zinc-200 line-clamp-1">
                    {opt.name}
                  </h4>
                  {isWinner && (
                    <span className="rounded-md bg-indigo-500 px-2 py-0.5 text-[10px] font-mono font-bold text-white uppercase">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="space-y-3.5">
                  {/* 10 Minutes */}
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 rounded-lg bg-zinc-800 border border-zinc-700/60 px-2 py-1 text-[11px] font-mono font-bold text-amber-400">
                      10 Min
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                        Immediate Visceral Reaction
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
                        {perspective?.in10Minutes || "Immediate feeling of relief or anxious uncertainty."}
                      </p>
                    </div>
                  </div>

                  {/* 10 Months */}
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 rounded-lg bg-zinc-800 border border-zinc-700/60 px-2 py-1 text-[11px] font-mono font-bold text-indigo-400">
                      10 Mo
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                        Operational Routine & Daily Grind
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
                        {perspective?.in10Months || "Navigating intermediate learning curve and daily execution."}
                      </p>
                    </div>
                  </div>

                  {/* 10 Years */}
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 rounded-lg bg-zinc-800 border border-zinc-700/60 px-2 py-1 text-[11px] font-mono font-bold text-emerald-400">
                      10 Yr
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                        Long-Term Life Arc & Compound Delta
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
                        {perspective?.in10Years || "A defining milestone or forgotten footnote in your trajectory."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Regret Minimization & Immediate Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Regret Minimization Bento Card */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <HeartCrack className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Regret Minimization Framework
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Jeff Bezos' Age-80 Projection Test
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-900/30 bg-rose-950/20 p-4 text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
            {analysis.regretMinimizationAnalysis}
          </div>
        </div>

        {/* Immediate Action Steps Checklist Bento Card */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Immediate Execution Protocol
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Validation & De-risking Checklist
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {analysis.actionSteps.map((step, idx) => {
              const isChecked = !!completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                    isChecked
                      ? "border-emerald-900/40 bg-emerald-950/30 line-through text-zinc-500"
                      : "border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-200"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      isChecked
                        ? "border-emerald-500 bg-emerald-600 text-white"
                        : "border-zinc-600 bg-zinc-800"
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3" />}
                  </div>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Cognitive Biases Bento Tile */}
      {analysis.blindSpots.length > 0 && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-7 backdrop-blur-md">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <EyeOff className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-sans">
                Cognitive Biases & Blind Spot Detector
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Subconscious Traps & Heuristic Distortions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {analysis.blindSpots.map((blind, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-indigo-900/30 bg-zinc-950/60 p-4 space-y-2"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 font-mono">
                  <Compass className="h-4 w-4 text-indigo-400" />
                  <span>{blind.title}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {blind.description}
                </p>
                <div className="mt-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 font-mono">
                  <span className="font-bold text-indigo-400">Mitigation: </span>
                  {blind.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
