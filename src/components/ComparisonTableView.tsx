import React, { useState } from "react";
import { Sliders, Trophy, Plus, Award } from "lucide-react";
import { DecisionAnalysis, ComparisonCriterion } from "../types";

interface ComparisonTableViewProps {
  analysis: DecisionAnalysis;
  onUpdateCriteria: (updatedCriteria: ComparisonCriterion[]) => void;
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({
  analysis,
  onUpdateCriteria,
}) => {
  const [activeCriteria, setActiveCriteria] = useState<ComparisonCriterion[]>(
    analysis.criteria || []
  );
  const [newCritName, setNewCritName] = useState("");

  const handleWeightChange = (critId: string, newWeight: number) => {
    const updated = activeCriteria.map((c) =>
      c.id === critId ? { ...c, weight: newWeight } : c
    );
    setActiveCriteria(updated);
    onUpdateCriteria(updated);
  };

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const initialScores: Record<string, { score: number; rationale: string }> = {};
    analysis.options.forEach((opt) => {
      initialScores[opt.id] = {
        score: 6,
        rationale: "User-defined comparison vector",
      };
    });

    const newCriterion: ComparisonCriterion = {
      id: `crit-custom-${Date.now()}`,
      name: newCritName.trim(),
      weight: 3,
      scores: initialScores,
    };

    const updated = [...activeCriteria, newCriterion];
    setActiveCriteria(updated);
    onUpdateCriteria(updated);
    setNewCritName("");
  };

  const handleRemoveCriterion = (critId: string) => {
    const updated = activeCriteria.filter((c) => c.id !== critId);
    setActiveCriteria(updated);
    onUpdateCriteria(updated);
  };

  const totalWeight = activeCriteria.reduce((sum, c) => sum + (c.weight || 1), 0) || 1;

  const optionTotals: Record<string, { weightedSum: number; percentage: number }> = {};
  analysis.options.forEach((opt) => {
    let sum = 0;
    activeCriteria.forEach((crit) => {
      const scoreObj = crit.scores[opt.id];
      const val = scoreObj ? scoreObj.score : 5;
      sum += val * (crit.weight || 1);
    });
    const percentage = Math.round((sum / (totalWeight * 10)) * 100);
    optionTotals[opt.id] = { weightedSum: sum, percentage };
  });

  let highestPercentage = -1;
  let leaderOptionId = "";
  Object.entries(optionTotals).forEach(([optId, data]) => {
    if (data.percentage > highestPercentage) {
      highestPercentage = data.percentage;
      leaderOptionId = optId;
    }
  });

  const getScoreBadge = (score: number) => {
    if (score >= 8) return "text-emerald-400 bg-emerald-950/80 border-emerald-800/60";
    if (score >= 6) return "text-indigo-400 bg-indigo-950/80 border-indigo-800/60";
    if (score >= 4) return "text-amber-400 bg-amber-950/80 border-amber-800/60";
    return "text-rose-400 bg-rose-950/80 border-rose-800/60";
  };

  return (
    <div id="comparison-bento-section" className="space-y-6">
      {/* Bento Header & Dynamic Leader Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Direct Metric Comparison Matrix
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Adjust individual factor weights ($1\times$ to $5\times$) to match your strategic priorities.
          </p>
        </div>

        {/* Dynamic Leader Callout */}
        <div className="flex items-center gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-950/40 px-4 py-2.5 font-mono text-xs">
          <Award className="h-4 w-4 text-indigo-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-300 block">Current Leader</span>
            <span className="font-bold text-white">
              {analysis.options.find((o) => o.id === leaderOptionId)?.name || "Analyzing..."} (
              {highestPercentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Bento Table */}
      <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md shadow-xl shadow-black/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-zinc-500 border-b border-zinc-800 uppercase tracking-wider font-mono bg-zinc-950/40">
              <th className="py-4 px-5 font-semibold w-1/3">Evaluation Metric</th>
              {analysis.options.map((opt) => {
                const isLeader = opt.id === leaderOptionId;
                return (
                  <th key={opt.id} className="py-4 px-5 font-semibold">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-zinc-200 font-sans line-clamp-1">
                        {opt.name}
                      </span>
                      {isLeader && (
                        <span className="shrink-0 rounded-full bg-indigo-500 px-2 py-0.5 text-[9px] font-mono font-bold text-white shadow-xs">
                          Leader
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-zinc-800/50">
            {activeCriteria.map((crit) => (
              <tr key={crit.id} className="hover:bg-zinc-900/60 transition-colors">
                {/* Metric Name & Slider */}
                <td className="py-4 px-5 align-top">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-200">{crit.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCriterion(crit.id)}
                      className="text-zinc-600 hover:text-rose-400 text-xs px-1 transition-colors cursor-pointer"
                      title="Remove metric"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-2 font-mono">
                    <span className="text-[10px] text-zinc-500">
                      Weight: {crit.weight}x
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={crit.weight}
                      onChange={(e) => handleWeightChange(crit.id, Number(e.target.value))}
                      className="h-1.5 w-24 accent-indigo-500 rounded-lg cursor-pointer bg-zinc-800"
                    />
                  </div>
                </td>

                {/* Option Scores */}
                {analysis.options.map((opt) => {
                  const scoreData = crit.scores[opt.id] || {
                    score: 5,
                    rationale: "Standard baseline evaluation",
                  };
                  return (
                    <td key={opt.id} className="py-4 px-5 align-top">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center justify-center rounded-lg px-2.5 py-0.5 text-xs font-mono font-bold border ${getScoreBadge(
                              scoreData.score
                            )}`}
                          >
                            {scoreData.score} / 10
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-normal">
                          {scoreData.rationale}
                        </p>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* TOTAL WEIGHTED SCORE ROW */}
            <tr className="bg-zinc-950/60 font-bold border-t-2 border-zinc-800">
              <td className="py-5 px-5 text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                Aggregate Score
              </td>
              {analysis.options.map((opt) => {
                const total = optionTotals[opt.id];
                const isLeader = opt.id === leaderOptionId;
                return (
                  <td key={opt.id} className="py-5 px-5">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-xl font-extrabold text-white">
                        {total?.percentage}%
                      </span>
                      {isLeader && (
                        <Trophy className="h-4 w-4 text-indigo-400 inline-block" />
                      )}
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2 mt-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isLeader ? "bg-indigo-500" : "bg-zinc-600"
                        }`}
                        style={{ width: `${total?.percentage || 50}%` }}
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Custom Criterion Form */}
      <form
        onSubmit={handleAddCriterion}
        className="flex items-center gap-3 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-md"
      >
        <input
          type="text"
          value={newCritName}
          onChange={(e) => setNewCritName(e.target.value)}
          placeholder="Append custom comparison vector (e.g. Commute Duration, Tax Burden, Cultural Immersion...)"
          className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={!newCritName.trim()}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Metric</span>
        </button>
      </form>
    </div>
  );
};
