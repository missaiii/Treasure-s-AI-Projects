import React, { useState } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { DecisionAnalysis } from "../types";

interface Message {
  role: "user" | "advisor";
  content: string;
  timestamp: string;
}

interface WhatIfAdvisorProps {
  analysis: DecisionAnalysis;
}

export const WhatIfAdvisor: React.FC<WhatIfAdvisorProps> = ({ analysis }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "advisor",
      content: `I've mapped out the multi-framework matrix between **${analysis.options
        .map((o) => o.name)
        .join("** and **")}**.
Ask any hypothetical "What-If" scenario or parameter change to stress-test your options!

*Example prompts:*
• "What if Option A allows remote work 2 days a week?"
• "What if my living expenses increase by 20% in the target city?"
• "What is the single highest leverage negotiation request?"`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isTyping) return;

    const userMessageText = inputQuestion.trim();
    const userMsg: Message = {
      role: "user",
      content: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/what-if", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis,
          scenarioQuestion: userMessageText,
          chatHistory: messages.slice(-6),
        }),
      });

      const data = await response.json();
      if (data.reply) {
        const advisorMsg: Message = {
          role: "advisor",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, advisorMsg]);
      } else {
        throw new Error(data.error || "Failed to generate answer");
      }
    } catch (err: any) {
      const errorMsg: Message = {
        role: "advisor",
        content: `Apologies, I encountered an issue analyzing that scenario: ${err.message}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const sampleChips = [
    "What if the budget / timeline is cut in half?",
    "What if I regret this in 12 months?",
    "What is the single highest leverage negotiation point?",
  ];

  return (
    <div id="what-if-bento-section" className="space-y-4">
      {/* Intro Header */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
            "What-If" Dynamic Scenario Stress-Tester
          </h3>
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          Simulate variable changes, test edge-case assumptions, or explore counter-arguments.
        </p>
      </div>

      {/* Message Stream */}
      <div className="min-h-[340px] max-h-[500px] overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4 shadow-xl shadow-black/30 backdrop-blur-md">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                m.role === "user"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-zinc-800 text-zinc-200 border border-zinc-700/60"
              }`}
            >
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                m.role === "user"
                  ? "bg-indigo-600 text-white font-medium"
                  : "bg-zinc-900/80 border border-zinc-800 text-zinc-200"
              }`}
            >
              {m.content}
              <span
                className={`mt-2 block text-[10px] font-mono ${
                  m.role === "user" ? "text-indigo-200 text-right" : "text-zinc-500"
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 pl-2">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
            <span>Simulating scenario consequences with Gemini...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {sampleChips.map((chip, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInputQuestion(chip)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:text-white px-3 py-1.5 text-xs font-mono text-zinc-400 transition-colors cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask a what-if scenario (e.g. 'What if I am offered 20% higher equity?')..."
          className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-hidden"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isTyping}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
