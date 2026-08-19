import React from "react";
import { X, Trash2, Calendar, CheckCircle2, ArrowRight, FolderOpen } from "lucide-react";
import { DecisionAnalysis } from "../types";

interface SavedDecisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
}

export const SavedDecisionsModal: React.FC<SavedDecisionsModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="saved-decisions-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <div
        id="saved-decisions-modal-content"
        className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-[#09090b] p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <FolderOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-sans">
                Decision Log & History
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Persisted Analytical Inquiry Records
              </p>
            </div>
          </div>

          <button
            id="btn-close-saved-modal"
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List of decisions */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-medium text-zinc-400 font-mono">No decisions stored yet.</p>
              <p className="text-xs text-zinc-600 mt-1">
                Your analyzed dilemmas will automatically appear here.
              </p>
            </div>
          ) : (
            savedDecisions.map((dec) => {
              const recommendedOpt =
                dec.options.find((o) => o.id === dec.verdict.recommendedOptionId) ||
                dec.options[0];

              return (
                <div
                  key={dec.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all shadow-md"
                >
                  <div className="flex-1 space-y-1.5 cursor-pointer" onClick={() => onSelectDecision(dec)}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-medium text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-900/50">
                        {dec.category}
                      </span>
                      {dec.isDecided && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-900/50">
                          <CheckCircle2 className="h-3 w-3" /> Committed
                        </span>
                      )}
                      <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(dec.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm text-zinc-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {dec.title}
                    </h4>

                    <p className="text-xs text-zinc-400 line-clamp-1 font-mono">
                      Verdict: <strong className="text-zinc-200">{recommendedOpt?.name}</strong> ({dec.verdict.confidenceScore}% confidence)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onSelectDecision(dec)}
                      className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-mono font-semibold text-white hover:bg-indigo-500 transition-colors cursor-pointer shadow-sm"
                    >
                      <span>Open</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteDecision(dec.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                      title="Delete saved decision"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
          <span>{savedDecisions.length} stored decisions</span>
          <button
            onClick={onClose}
            className="font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
