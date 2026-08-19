import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Lightbulb,
  ArrowRight,
  Loader2,
  Zap,
  Layers,
} from "lucide-react";
import { SAMPLE_TEMPLATES, CATEGORIES } from "../data/templates";
import { QuickTemplate } from "../types";

interface DecisionFormProps {
  onSubmit: (data: {
    title: string;
    context: string;
    category: string;
    options: string[];
    customCriteria: string[];
  }) => Promise<void>;
  isLoading: boolean;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [category, setCategory] = useState("Career & Work");
  const [options, setOptions] = useState<string[]>([
    "Accept the new offer / proposed move",
    "Maintain the current trajectory",
  ]);
  const [customCriteria, setCustomCriteria] = useState<string[]>([
    "Long-term Growth Potential",
    "Financial Upside & Cost Delta",
    "Stress & Quality of Life",
  ]);
  const [newCriterionInput, setNewCriterionInput] = useState("");
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const loadingSteps = [
    "Analyzing inquiry parameters and extracting trade-offs...",
    "Compiling Upsides & Downsides across all vectors...",
    "Constructing 4-quadrant SWOT matrix & threat mitigations...",
    "Computing multi-factor comparison delta & criteria scores...",
    "Evaluating 10/10/10 Rule and Regret Minimization...",
    "Synthesizing definitive Tiebreaker Verdict & confidence...",
  ];

  React.useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % loadingSteps.length);
      }, 1700);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, `Option ${options.length + 1}`]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const next = [...options];
      next.splice(index, 1);
      setOptions(next);
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const next = [...options];
    next[index] = val;
    setOptions(next);
  };

  const handleAddCriterion = () => {
    if (newCriterionInput.trim() && !customCriteria.includes(newCriterionInput.trim())) {
      setCustomCriteria([...customCriteria, newCriterionInput.trim()]);
      setNewCriterionInput("");
    }
  };

  const handleRemoveCriterion = (crit: string) => {
    setCustomCriteria(customCriteria.filter((c) => c !== crit));
  };

  const handleApplyTemplate = (template: QuickTemplate) => {
    setTitle(template.title);
    setCategory(template.category);
    setContext(template.context);
    setOptions(template.options);
    setCustomCriteria(template.criteria);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const validOptions = options.filter((o) => o.trim().length > 0);
    if (validOptions.length < 2) {
      alert("Please provide at least two distinct options to compare.");
      return;
    }

    await onSubmit({
      title: title.trim(),
      context: context.trim(),
      category,
      options: validOptions,
      customCriteria,
    });
  };

  return (
    <div id="decision-input-container" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Bento Hero Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-mono font-medium text-indigo-300 shadow-lg shadow-indigo-500/10 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>AI DECISION ENGINE & MULTI-FRAMEWORK MATRIX</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-sans">
          Break The Tie. <span className="text-zinc-400">Decide With Precision.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-400">
          Feed in any high-stakes fork in the road. The Tiebreaker systematically models Pros & Cons,
          SWOT quadrants, comparison deltas, and outputs an actionable verdict.
        </p>
      </div>

      {/* Bento Quick Templates Grid */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Quick-Start Real-World Dilemmas
            </h2>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Select to prefill</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              id={`template-btn-${tmpl.id}`}
              onClick={() => handleApplyTemplate(tmpl)}
              className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 text-left transition-all hover:border-indigo-500/60 hover:bg-zinc-900 hover:shadow-lg hover:shadow-indigo-500/10 focus:outline-hidden cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-mono font-medium text-indigo-300 bg-indigo-950/70 px-2 py-0.5 rounded-md border border-indigo-900/50">
                  {tmpl.category}
                </span>
                <p className="mt-2.5 text-xs font-bold text-zinc-200 line-clamp-2 group-hover:text-indigo-200 transition-colors">
                  {tmpl.title}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500 group-hover:text-zinc-400">
                <span>Load Model</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-indigo-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Bento Form Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-md space-y-6 shadow-xl shadow-black/40"
      >
        {/* Title / Question */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="decision-title-input"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono"
            >
              Primary Inquiry / Dilemma <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] text-zinc-500 font-mono">Core decision question</span>
          </div>
          <input
            id="decision-title-input"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Should I relocate to Tokyo for a Senior Design role vs stay in London?"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3.5 text-sm sm:text-base font-medium text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
            disabled={isLoading}
          />
        </div>

        {/* Category & Context */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label
              htmlFor="category-select"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono block"
            >
              Domain Category
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-3 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              disabled={isLoading}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-950 text-zinc-200">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 space-y-2">
            <label
              htmlFor="context-input"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono block"
            >
              Context, Nuances & Constraints (Optional)
            </label>
            <textarea
              id="context-input"
              rows={2}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., 5 years experience, $85k savings, partner works remotely, value long-term upside over immediate ease..."
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Options to Compare */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                Options Under Consideration
              </label>
            </div>
            {options.length < 5 && (
              <button
                type="button"
                id="btn-add-option"
                onClick={handleAddOption}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-900/60 px-3 py-1 rounded-xl transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Path</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {options.map((optionText, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-xs font-mono font-bold text-zinc-300">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  id={`option-input-${idx}`}
                  type="text"
                  required
                  value={optionText}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1} title / description`}
                  className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    id={`btn-remove-option-${idx}`}
                    onClick={() => handleRemoveOption(idx)}
                    disabled={isLoading}
                    className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                    title="Remove this option"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Priority Evaluation Criteria */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                Evaluation Factors & Metrics
              </label>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">Custom comparison vectors</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {customCriteria.map((crit) => (
              <span
                key={crit}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-xs font-medium text-zinc-300"
              >
                <span>{crit}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCriterion(crit)}
                  className="text-zinc-500 hover:text-rose-400 transition-colors"
                  disabled={isLoading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="new-criterion-input"
              value={newCriterionInput}
              onChange={(e) => setNewCriterionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCriterion();
                }
              }}
              placeholder="Add factor (e.g., Relocation Friction, Tax Delta, Commute...)"
              className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-hidden"
              disabled={isLoading}
            />
            <button
              type="button"
              id="btn-add-criterion"
              onClick={handleAddCriterion}
              disabled={isLoading || !newCriterionInput.trim()}
              className="rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors disabled:opacity-40"
            >
              Add Factor
            </button>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4">
          {isLoading ? (
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/40 p-5 text-center shadow-lg shadow-indigo-500/10">
              <div className="flex items-center justify-center gap-3 text-sm font-semibold text-indigo-200">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                <span className="font-mono">Processing Decision Intelligence Matrix...</span>
              </div>
              <p className="mt-2 text-xs text-indigo-300/80 font-mono">
                {loadingSteps[loadingStepIndex]}
              </p>
            </div>
          ) : (
            <button
              type="submit"
              id="btn-submit-decision"
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-indigo-200" />
              <span>Synthesize Matrix & Break The Tie</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
