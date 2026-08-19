import React, { useState } from "react";
import { Plus, Trash2, Filter, Sparkles } from "lucide-react";
import { DecisionAnalysis, DecisionOption } from "../types";

interface ProsConsViewProps {
  analysis: DecisionAnalysis;
  onUpdateOption: (updatedOption: DecisionOption) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({ analysis, onUpdateOption }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(analysis.options[0]?.id || "");
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState<"pro" | "con">("pro");
  const [newImpact, setNewImpact] = useState<"low" | "medium" | "high" | "critical">("high");
  const [newCategory, setNewCategory] = useState("General");
  const [filterImpact, setFilterImpact] = useState<string>("all");

  const currentOption = analysis.options.find((o) => o.id === selectedOptionId) || analysis.options[0];

  if (!currentOption) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const impactScores: Record<string, number> = {
      low: 1,
      medium: 2,
      high: 4,
      critical: 5,
    };

    const scoreValue = impactScores[newImpact] || 3;

    const updated = { ...currentOption };
    if (newType === "pro") {
      updated.pros = [
        ...updated.pros,
        {
          text: newText.trim(),
          impact: newImpact,
          score: scoreValue,
          category: newCategory.trim() || "General",
        },
      ];
    } else {
      updated.cons = [
        ...updated.cons,
        {
          text: newText.trim(),
          impact: newImpact,
          score: -scoreValue,
          category: newCategory.trim() || "General",
        },
      ];
    }

    onUpdateOption(updated);
    setNewText("");
  };

  const handleRemovePro = (index: number) => {
    const updated = { ...currentOption };
    updated.pros = updated.pros.filter((_, i) => i !== index);
    onUpdateOption(updated);
  };

  const handleRemoveCon = (index: number) => {
    const updated = { ...currentOption };
    updated.cons = updated.cons.filter((_, i) => i !== index);
    onUpdateOption(updated);
  };

  const totalProsScore = currentOption.pros.reduce((sum, p) => sum + (Math.abs(p.score) || 0), 0);
  const totalConsScore = currentOption.cons.reduce((sum, c) => sum + (Math.abs(c.score) || 0), 0);
  const netScore = totalProsScore - totalConsScore;

  const filteredPros = filterImpact === "all"
    ? currentOption.pros
    : currentOption.pros.filter((p) => p.impact === filterImpact);

  const filteredCons = filterImpact === "all"
    ? currentOption.cons
    : currentOption.cons.filter((c) => c.impact === filterImpact);

  return (
    <div id="pros-cons-bento-section" className="space-y-6">
      {/* Option Selector Pills & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex flex-wrap gap-2">
          {analysis.options.map((opt, i) => {
            const isSelected = opt.id === currentOption.id;
            const isWinner = opt.id === analysis.verdict.recommendedOptionId;
            return (
              <button
                key={opt.id}
                id={`tab-option-${i}`}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`relative inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer ${
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

        {/* Filter by impact level */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Filter className="h-3.5 w-3.5" />
          <select
            value={filterImpact}
            onChange={(e) => setFilterImpact(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Impact Tiers</option>
            <option value="critical">Critical Tier Only</option>
            <option value="high">High & Above</option>
            <option value="medium">Medium Tier</option>
            <option value="low">Low Tier</option>
          </select>
        </div>
      </div>

      {/* Bento Option Header Banner */}
      <div className="flex flex-wrap items-center justify-between rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              Active Evaluation Target
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight font-sans">
            {currentOption.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {currentOption.description || "In-depth pros vs cons breakdown"}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl px-4 py-2.5 font-mono">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Pros</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400">+{totalProsScore}</span>
          </div>
          <div className="text-right border-l border-zinc-800 pl-3">
            <span className="text-[10px] uppercase font-bold text-rose-400 block">Cons</span>
            <span className="text-xs sm:text-sm font-bold text-rose-400">-{totalConsScore}</span>
          </div>
          <div className="text-right border-l border-zinc-800 pl-3">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Net Delta</span>
            <span
              className={`text-sm sm:text-base font-bold ${
                netScore > 0
                  ? "text-emerald-400"
                  : netScore < 0
                  ? "text-rose-400"
                  : "text-zinc-400"
              }`}
            >
              {netScore > 0 ? `+${netScore}` : netScore}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Bento Pros & Cons Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* THE UPSIDE (PROS) */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
                The Upside ({filteredPros.length})
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900/50 px-2 py-0.5 rounded-md">
              +{totalProsScore} pts
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {filteredPros.length === 0 ? (
              <p className="text-xs text-zinc-600 font-mono italic py-8 text-center">
                No upsides found matching this filter tier.
              </p>
            ) : (
              filteredPros.map((pro, idx) => (
                <div
                  key={idx}
                  className="group relative flex items-start justify-between gap-3 rounded-2xl border border-zinc-800/60 bg-zinc-950/40 p-3.5 hover:border-emerald-900/40 hover:bg-zinc-900/60 transition-all"
                >
                  <div className="flex gap-3 flex-1">
                    <span className="text-emerald-400 font-bold font-mono text-base leading-tight">
                      +
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                        {pro.text}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.2 text-[9px] uppercase font-mono font-bold text-emerald-400">
                          {pro.impact}
                        </span>
                        {pro.category && (
                          <span className="text-[10px] text-zinc-500 font-mono">
                            • {pro.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      +{Math.abs(pro.score)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePro(idx)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 p-1 transition-all cursor-pointer"
                      title="Remove this factor"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* THE DOWNSIDE (CONS) */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400 font-mono">
                The Downside ({filteredCons.length})
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-900/50 px-2 py-0.5 rounded-md">
              -{totalConsScore} pts
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {filteredCons.length === 0 ? (
              <p className="text-xs text-zinc-600 font-mono italic py-8 text-center">
                No downsides found matching this filter tier.
              </p>
            ) : (
              filteredCons.map((con, idx) => (
                <div
                  key={idx}
                  className="group relative flex items-start justify-between gap-3 rounded-2xl border border-zinc-800/60 bg-zinc-950/40 p-3.5 hover:border-rose-900/40 hover:bg-zinc-900/60 transition-all"
                >
                  <div className="flex gap-3 flex-1">
                    <span className="text-rose-400 font-bold font-mono text-base leading-tight">
                      –
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                        {con.text}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-rose-950/80 border border-rose-800/60 px-1.5 py-0.2 text-[9px] uppercase font-mono font-bold text-rose-400">
                          {con.impact}
                        </span>
                        {con.category && (
                          <span className="text-[10px] text-zinc-500 font-mono">
                            • {con.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono font-bold text-rose-400">
                      -{Math.abs(con.score)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCon(idx)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 p-1 transition-all cursor-pointer"
                      title="Remove this factor"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Pro / Con Bento Tile */}
      <form
        onSubmit={handleAddItem}
        className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
            Append Custom Vector to {currentOption.name}
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">Personal custom data point</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g. Partner has strong preference for Tokyo public transit..."
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-xs sm:text-sm text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as "pro" | "con")}
              className="w-1/2 rounded-2xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-200 focus:outline-hidden"
            >
              <option value="pro">The Upside (+)</option>
              <option value="con">The Downside (–)</option>
            </select>

            <select
              value={newImpact}
              onChange={(e) => setNewImpact(e.target.value as any)}
              className="w-1/2 rounded-2xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
            >
              <option value="low">Low Impact</option>
              <option value="medium">Medium</option>
              <option value="high">High Impact</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Vector</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
