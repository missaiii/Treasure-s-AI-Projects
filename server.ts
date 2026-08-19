import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy get GenAI client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper for delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Resilient Gemini generateContent with retries and fallback models
async function generateContentWithRetry(params: {
  contents: any;
  config?: any;
  primaryModel?: string;
}) {
  const ai = getGenAI();
  const candidateModels = [
    params.primaryModel || "gemini-3.7-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMessage = (err?.message || "").toLowerCase();
        const isTransient =
          err?.status === 503 ||
          err?.code === 503 ||
          errMessage.includes("high demand") ||
          errMessage.includes("unavailable") ||
          errMessage.includes("resource_exhausted") ||
          errMessage.includes("rate limit") ||
          errMessage.includes("overloaded");

        if (isTransient && attempt < 3) {
          // Wait with exponential backoff before retrying same model
          const backoff = attempt * 1000 + Math.random() * 500;
          console.warn(`[Gemini Retry] ${model} attempt ${attempt} failed with transient error (${err.message}). Retrying in ${Math.round(backoff)}ms...`);
          await delay(backoff);
        } else if (isTransient) {
          // If all 3 attempts failed on this model, break out to try next candidate model
          console.warn(`[Gemini Fallback] Model ${model} unavailable after 3 attempts. Switching to next candidate model...`);
          break;
        } else {
          // Non-transient error (e.g. invalid arguments), rethrow immediately
          throw err;
        }
      }
    }
  }

  throw lastError || new Error("All Gemini models encountered high demand. Please retry in a few moments.");
}

// Decision analysis endpoint
app.post("/api/analyze-decision", async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, context, options, category, customCriteria } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ error: "Decision title or question is required." });
      return;
    }

    const optionsList = Array.isArray(options) && options.length > 0
      ? options.filter((o: string) => o && o.trim())
      : ["Option 1", "Option 2"];

    const prompt = `You are "The Tiebreaker", an expert strategic decision advisor, executive consultant, and rational decision scientist.
Analyze the following decision thoroughly:

DECISION QUESTION / TITLE: ${title}
CATEGORY: ${category || "General"}
ADDITIONAL CONTEXT & CONSTRAINTS: ${context || "None provided"}
OPTIONS UNDER CONSIDERATION:
${optionsList.map((opt: string, i: number) => `${i + 1}. ${opt}`).join("\n")}
${customCriteria && customCriteria.length ? `CUSTOM CRITERIA OF INTEREST: ${customCriteria.join(", ")}` : ""}

Conduct a rigorous, multi-framework analysis:
1. Provide comprehensive Pros & Cons for each option (with impact rating: low, medium, high, critical, numerical impact from 1 to 5 for pros, -1 to -5 for cons, and category).
2. Produce a thorough SWOT Analysis for EACH option (Strengths, Weaknesses, Opportunities, Threats).
3. Create a Comparison Table across key criteria (e.g., Financial Impact, Long-term Value, Effort/Complexity, Stress & Risk, Speed of Execution, Regret Potential). Score each option 1-10 on each criterion with a crisp rationale.
4. Give a definitive, decisive "The Tiebreaker Verdict": Recommend the single best option with confidence percentage (0-100), why it wins, critical trade-offs, and whether this is a "one-way-door" (irreversible) or "two-way-door" (reversible) decision.
5. Apply the 10/10/10 Rule for each option (How you'll feel in 10 minutes, 10 months, 10 years).
6. Provide Jeff Bezos' Regret Minimization Framework analysis.
7. Uncover 2-4 critical Blind Spots or cognitive biases that might be clouding judgment, plus practical mitigations.
8. Outline 3-5 immediate concrete next action steps.

Be objective, perceptive, realistic, and highly actionable.`;

    const response = await generateContentWithRetry({
      primaryModel: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are The Tiebreaker, an elite rational decision intelligence advisor. Always return valid, detailed JSON conforming strictly to the requested schema. Provide deep, specific insights tailored to the user's exact context rather than generic platitudes.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: {
              type: Type.STRING,
              description: "A punchy summary of the decision verdict, e.g., 'Take the startup offer with negotiated equity protection'",
            },
            executiveSummary: {
              type: Type.STRING,
              description: "Detailed 2-3 paragraph executive rationale breaking down the dilemma and the winning path.",
            },
            recommendedOptionName: {
              type: Type.STRING,
              description: "The exact name of the winning option chosen by the AI.",
            },
            confidenceScore: {
              type: Type.INTEGER,
              description: "Confidence rating from 0 to 100 on the recommendation.",
            },
            whyThisWins: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 compelling reasons why the recommended option triumphs.",
            },
            keyTradeoffs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-4 honest sacrifices or challenges the user must accept with this choice.",
            },
            reversibilityType: {
              type: Type.STRING,
              enum: ["one-way-door", "two-way-door"],
              description: "Whether the decision is largely irreversible (one-way door) or easy to reverse (two-way door).",
            },
            reversibilityRationale: {
              type: Type.STRING,
              description: "Explanation of why this decision is one-way or two-way door and how to treat it.",
            },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        impact: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
                        score: { type: Type.INTEGER, description: "1 to 5" },
                        category: { type: Type.STRING, description: "e.g. Financial, Career, Lifestyle, Strategy" },
                      },
                      required: ["text", "impact", "score"],
                    },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        impact: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
                        score: { type: Type.INTEGER, description: "-1 to -5 (negative integer)" },
                        category: { type: Type.STRING, description: "e.g. Financial, Career, Lifestyle, Strategy" },
                      },
                      required: ["text", "impact", "score"],
                    },
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["strengths", "weaknesses", "opportunities", "threats"],
                  },
                  tenTenTen: {
                    type: Type.OBJECT,
                    properties: {
                      in10Minutes: { type: Type.STRING },
                      in10Months: { type: Type.STRING },
                      in10Years: { type: Type.STRING },
                    },
                    required: ["in10Minutes", "in10Months", "in10Years"],
                  },
                },
                required: ["name", "pros", "cons", "swot", "tenTenTen"],
              },
            },
            criteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  weight: { type: Type.INTEGER, description: "Importance weight from 1 to 5" },
                  optionScores: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        optionName: { type: Type.STRING },
                        score: { type: Type.INTEGER, description: "Score from 1 to 10" },
                        rationale: { type: Type.STRING },
                      },
                      required: ["optionName", "score", "rationale"],
                    },
                  },
                },
                required: ["name", "weight", "optionScores"],
              },
            },
            regretMinimizationAnalysis: {
              type: Type.STRING,
              description: "Insight into which choice avoids deep long-term regret when looking back in 20-30 years.",
            },
            blindSpots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  mitigation: { type: Type.STRING },
                },
                required: ["title", "description", "mitigation"],
              },
            },
            actionSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 immediate concrete next steps.",
            },
          },
          required: [
            "headline",
            "executiveSummary",
            "recommendedOptionName",
            "confidenceScore",
            "whyThisWins",
            "keyTradeoffs",
            "reversibilityType",
            "reversibilityRationale",
            "options",
            "criteria",
            "regretMinimizationAnalysis",
            "blindSpots",
            "actionSteps",
          ],
        },
      },
    });

    const text = response.text || "{}";
    const rawData = JSON.parse(text);

    // Normalize IDs and format output
    const optionMap: Record<string, string> = {};
    const formattedOptions = (rawData.options || []).map((opt: any, idx: number) => {
      const id = `opt-${idx + 1}-${Date.now()}`;
      optionMap[opt.name] = id;
      
      const posSum = (opt.pros || []).reduce((acc: number, p: any) => acc + (Math.abs(p.score) || 3), 0);
      const negSum = (opt.cons || []).reduce((acc: number, c: any) => acc + (Math.abs(c.score) || 3), 0);
      const rawScore = Math.max(10, Math.min(95, Math.round(50 + (posSum - negSum) * 4)));

      return {
        id,
        name: opt.name,
        description: opt.description || "",
        pros: (opt.pros || []).map((p: any) => ({
          text: p.text,
          impact: p.impact || "medium",
          score: Math.abs(p.score) || 3,
          category: p.category || "General",
        })),
        cons: (opt.cons || []).map((c: any) => ({
          text: c.text,
          impact: c.impact || "medium",
          score: -Math.abs(c.score || 3),
          category: c.category || "General",
        })),
        swot: {
          strengths: opt.swot?.strengths || [],
          weaknesses: opt.swot?.weaknesses || [],
          opportunities: opt.swot?.opportunities || [],
          threats: opt.swot?.threats || [],
        },
        overallScore: rawScore,
      };
    });

    // Match recommended option ID
    const recommendedOpt = formattedOptions.find(
      (o: any) => o.name.toLowerCase().trim() === (rawData.recommendedOptionName || "").toLowerCase().trim()
    ) || formattedOptions[0];

    const tenTenTenRule: Record<string, any> = {};
    (rawData.options || []).forEach((opt: any) => {
      const optId = optionMap[opt.name];
      if (optId && opt.tenTenTen) {
        tenTenTenRule[optId] = {
          in10Minutes: opt.tenTenTen.in10Minutes || "No immediate reaction data",
          in10Months: opt.tenTenTen.in10Months || "No medium-term data",
          in10Years: opt.tenTenTen.in10Years || "No long-term data",
        };
      }
    });

    const formattedCriteria = (rawData.criteria || []).map((crit: any, idx: number) => {
      const scoresRecord: Record<string, { score: number; rationale: string }> = {};
      (crit.optionScores || []).forEach((os: any) => {
        const matchingOpt = formattedOptions.find(
          (o: any) => o.name.toLowerCase().trim() === (os.optionName || "").toLowerCase().trim()
        );
        if (matchingOpt) {
          scoresRecord[matchingOpt.id] = {
            score: Math.max(1, Math.min(10, os.score || 5)),
            rationale: os.rationale || "",
          };
        }
      });

      // Default scores for any missing options
      formattedOptions.forEach((o: any) => {
        if (!scoresRecord[o.id]) {
          scoresRecord[o.id] = { score: 5, rationale: "Standard baseline evaluation" };
        }
      });

      return {
        id: `crit-${idx + 1}`,
        name: crit.name,
        weight: Math.max(1, Math.min(5, crit.weight || 3)),
        scores: scoresRecord,
      };
    });

    const analysis = {
      id: `decision-${Date.now()}`,
      title,
      context: context || "",
      category: category || "General",
      createdAt: new Date().toISOString(),
      options: formattedOptions,
      criteria: formattedCriteria,
      verdict: {
        recommendedOptionId: recommendedOpt ? recommendedOpt.id : formattedOptions[0]?.id,
        confidenceScore: Math.max(50, Math.min(99, rawData.confidenceScore || 85)),
        headline: rawData.headline || "Recommended Path",
        executiveSummary: rawData.executiveSummary || "",
        whyThisWins: rawData.whyThisWins || [],
        keyTradeoffs: rawData.keyTradeoffs || [],
        reversibilityType: rawData.reversibilityType || "two-way-door",
        reversibilityRationale: rawData.reversibilityRationale || "",
      },
      tenTenTenRule,
      regretMinimizationAnalysis: rawData.regretMinimizationAnalysis || "",
      blindSpots: rawData.blindSpots || [],
      actionSteps: rawData.actionSteps || [],
    };

    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error("Error analyzing decision:", error);
    const msg = error.message || "Failed to analyze decision.";
    res.status(500).json({
      error: msg.includes("high demand") || msg.includes("503")
        ? "The AI model is experiencing peak temporary traffic. Please click 'Synthesize Matrix & Break The Tie' again."
        : msg,
    });
  }
});

// "What If" Scenario & Follow-up AI Advisor
app.post("/api/what-if", async (req: Request, res: Response): Promise<void> => {
  try {
    const { analysis, scenarioQuestion, chatHistory } = req.body;

    if (!scenarioQuestion || !scenarioQuestion.trim()) {
      res.status(400).json({ error: "Scenario question is required." });
      return;
    }

    const prompt = `You are "The Tiebreaker" AI advisor. The user is evaluating an existing decision analysis and asking a follow-up "What-If" scenario or exploratory question.

DECISION TITLE: ${analysis?.title}
CONTEXT: ${analysis?.context}
CURRENT VERDICT: ${analysis?.verdict?.headline} (Confidence: ${analysis?.verdict?.confidenceScore}%)
OPTIONS: ${(analysis?.options || []).map((o: any) => `- ${o.name}`).join("\n")}

USER'S SCENARIO / QUESTION: "${scenarioQuestion}"

PREVIOUS CHAT HISTORY:
${(chatHistory || []).map((m: any) => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.content}`).join("\n")}

Provide an incisive, well-reasoned answer:
1. Direct impact on the decision: Does this shift the recommendation or change the risk balance?
2. Which specific option benefits or suffers the most from this scenario?
3. Recommended adjustment or counter-strategy.
4. Keep the response focused, structured with clear bullet points, empathetic yet ruthlessly rational.`;

    const response = await generateContentWithRetry({
      primaryModel: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are The Tiebreaker, an elite rational advisor. Deliver direct, high-value advice on hypothetical scenarios and strategic questions.",
      },
    });

    res.json({
      success: true,
      reply: response.text || "No response generated.",
    });
  } catch (error: any) {
    console.error("Error in what-if scenario:", error);
    res.status(500).json({
      error: error.message || "Failed to evaluate scenario.",
    });
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Vite middleware & Production Serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Tiebreaker server running on http://localhost:${PORT}`);
  });
}

start();
