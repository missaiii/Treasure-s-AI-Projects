import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { DecisionForm } from "./components/DecisionForm";
import { AnalysisDashboard } from "./components/AnalysisDashboard";
import { SavedDecisionsModal } from "./components/SavedDecisionsModal";
import { DecisionAnalysis } from "./types";
import {
  loadSavedDecisions,
  saveDecision,
  deleteSavedDecision,
  exportDecisionAsMarkdown,
} from "./utils/storage";
import { AlertCircle, X, RotateCw } from "lucide-react";

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<DecisionAnalysis | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<{
    title: string;
    context: string;
    category: string;
    options: string[];
    customCriteria: string[];
  } | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const loaded = loadSavedDecisions();
    setSavedDecisions(loaded);
  }, []);

  const handleAnalyzeDecision = async (formData: {
    title: string;
    context: string;
    category: string;
    options: string[];
    customCriteria: string[];
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastSubmission(formData);

    try {
      const response = await fetch("/api/analyze-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate decision analysis.");
      }

      const analysis: DecisionAnalysis = data.analysis;
      setCurrentAnalysis(analysis);
      saveDecision(analysis);
      setSavedDecisions(loadSavedDecisions());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Analysis error:", err);
      setErrorMessage(
        err.message || "An unexpected error occurred while communicating with the AI advisor."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLast = () => {
    if (lastSubmission) {
      handleAnalyzeDecision(lastSubmission);
    }
  };

  const handleUpdateAnalysis = (updated: DecisionAnalysis) => {
    setCurrentAnalysis(updated);
    saveDecision(updated);
    setSavedDecisions(loadSavedDecisions());
  };

  const handleDeleteDecision = (id: string) => {
    const remaining = deleteSavedDecision(id);
    setSavedDecisions(remaining);
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }
  };

  const handleSelectDecision = (decision: DecisionAnalysis) => {
    setCurrentAnalysis(decision);
    setIsHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExportMarkdown = () => {
    if (!currentAnalysis) return;
    const md = exportDecisionAsMarkdown(currentAnalysis);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `decision-${currentAnalysis.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        currentAnalysis={currentAnalysis}
        onNewDecision={() => {
          setCurrentAnalysis(null);
          setErrorMessage(null);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onExportMarkdown={handleExportMarkdown}
        historyCount={savedDecisions.length}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mx-auto max-w-5xl px-4 pt-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-rose-900/60 bg-rose-950/40 p-4 text-xs sm:text-sm text-rose-300 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              {lastSubmission && (
                <button
                  onClick={handleRetryLast}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 border border-rose-700/60 px-3 py-1.5 text-xs font-mono font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Retry Analysis</span>
                </button>
              )}
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-rose-200 p-1.5 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-12">
        {currentAnalysis ? (
          <AnalysisDashboard
            analysis={currentAnalysis}
            onBackToInput={() => setCurrentAnalysis(null)}
            onUpdateAnalysis={handleUpdateAnalysis}
          />
        ) : (
          <DecisionForm
            onSubmit={handleAnalyzeDecision}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Decision Log Modal */}
      <SavedDecisionsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectDecision}
        onDeleteDecision={handleDeleteDecision}
      />

      {/* Footer in Bento style */}
      <footer className="mt-auto border-t border-zinc-900 bg-[#09090b] py-6 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-medium text-zinc-400">
              The Tiebreaker Decision Engine
            </span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500 font-mono text-[11px]">
            <span>Pros & Cons</span>
            <span>•</span>
            <span>SWOT Matrix</span>
            <span>•</span>
            <span>Comparison Grid</span>
            <span>•</span>
            <span>10/10/10 Rule</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
