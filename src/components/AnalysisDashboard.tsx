import React, { useState } from "react";
import {
  Scale,
  TableProperties,
  Grid2X2,
  Brain,
  MessageSquareCode,
  ArrowLeft,
  Calendar,
  Share2,
  Check,
} from "lucide-react";
import { DecisionAnalysis, DecisionOption, ComparisonCriterion } from "../types";
import { VerdictHero } from "./VerdictHero";
import { ProsConsView } from "./ProsConsView";
import { ComparisonTableView } from "./ComparisonTableView";
import { SwotView } from "./SwotView";
import { MentalModelsView } from "./MentalModelsView";
import { WhatIfAdvisor } from "./WhatIfAdvisor";

interface AnalysisDashboardProps {
  analysis: DecisionAnalysis;
  onBackToInput: () => void;
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
}

type TabType = "pros-cons" | "comparison-table" | "swot" | "mental-models" | "what-if";

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  onBackToInput,
  onUpdateAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("pros-cons");
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleToggleCommit = () => {
    const updated = {
      ...analysis,
      isDecided: !analysis.isDecided,
    };
    onUpdateAnalysis(updated);
  };

  const handleUpdateOption = (updatedOption: DecisionOption) => {
    const updatedOptions = analysis.options.map((o) =>
      o.id === updatedOption.id ? updatedOption : o
    );
    const updated = {
      ...analysis,
      options: updatedOptions,
    };
    onUpdateAnalysis(updated);
  };

  const handleUpdateCriteria = (updatedCriteria: ComparisonCriterion[]) => {
    const updated = {
      ...analysis,
      criteria: updatedCriteria,
    };
    onUpdateAnalysis(updated);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: "pros-cons", label: "Pros & Cons", icon: <Scale className="h-4 w-4" /> },
    { id: "comparison-table", label: "Direct Comparison", icon: <TableProperties className="h-4 w-4" /> },
    { id: "swot", label: "SWOT Matrix", icon: <Grid2X2 className="h-4 w-4" /> },
    { id: "mental-models", label: "10/10/10 & Models", icon: <Brain className="h-4 w-4" /> },
    { id: "what-if", label: "What-If Advisor", icon: <MessageSquareCode className="h-4 w-4" />, badge: "AI" },
  ];

  return (
    <div id="analysis-dashboard-container" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          id="btn-back-to-input"
          onClick={onBackToInput}
          className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-mono font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all w-fit cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Edit Parameters</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-900/50">
            {analysis.category}
          </span>
          <span className="text-xs text-zinc-500 font-mono flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(analysis.createdAt).toLocaleDateString()}
          </span>
          <button
            onClick={handleShareLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-mono font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
            title="Copy URL"
          >
            {copiedNotification ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-zinc-400" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Decision Question Headline in Bento Card */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-7 backdrop-blur-md space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Active Inquiry Scope
          </span>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
          {analysis.title}
        </h1>
        {analysis.context && (
          <div className="mt-3 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 text-xs sm:text-sm text-zinc-400">
            <span className="font-semibold text-zinc-300 font-mono">Constraints & Nuances: </span>
            {analysis.context}
          </div>
        )}
      </div>

      {/* 🏆 Primary Verdict Bento Grid Section */}
      <VerdictHero analysis={analysis} onToggleCommit={handleToggleCommit} />

      {/* Multi-Perspective Tab Navigation Bar */}
      <div className="space-y-6">
        <div className="flex overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 p-1.5 gap-1.5 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`dashboard-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="rounded-md bg-amber-400 px-1.5 py-0.2 text-[10px] font-bold text-zinc-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab View Content */}
        <div className="pt-2">
          {activeTab === "pros-cons" && (
            <ProsConsView analysis={analysis} onUpdateOption={handleUpdateOption} />
          )}

          {activeTab === "comparison-table" && (
            <ComparisonTableView
              analysis={analysis}
              onUpdateCriteria={handleUpdateCriteria}
            />
          )}

          {activeTab === "swot" && <SwotView analysis={analysis} />}

          {activeTab === "mental-models" && (
            <MentalModelsView analysis={analysis} />
          )}

          {activeTab === "what-if" && <WhatIfAdvisor analysis={analysis} />}
        </div>
      </div>
    </div>
  );
};
