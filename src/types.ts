export interface DecisionOption {
  id: string;
  name: string;
  description?: string;
  pros: Array<{
    text: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    score: number; // 1 to 5
    category?: string;
  }>;
  cons: Array<{
    text: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    score: number; // -1 to -5
    category?: string;
  }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  overallScore: number; // 0-100 calculated
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  weight: number; // 1 to 5
  scores: Record<string, { score: number; rationale: string }>; // optionId -> { score: 1-10, rationale }
}

export interface BlindSpot {
  title: string;
  description: string;
  mitigation: string;
}

export interface TimeframePerspective {
  in10Minutes: string;
  in10Months: string;
  in10Years: string;
}

export interface DecisionAnalysis {
  id: string;
  title: string;
  context: string;
  category: string;
  createdAt: string;
  isDecided?: boolean;
  chosenOptionId?: string;
  
  options: DecisionOption[];
  criteria: ComparisonCriterion[];
  
  verdict: {
    recommendedOptionId: string;
    confidenceScore: number; // 0 - 100
    headline: string;
    executiveSummary: string;
    whyThisWins: string[];
    keyTradeoffs: string[];
    reversibilityType: 'one-way-door' | 'two-way-door';
    reversibilityRationale: string;
  };

  tenTenTenRule: Record<string, TimeframePerspective>; // optionId -> perspective
  regretMinimizationAnalysis: string;
  blindSpots: BlindSpot[];
  actionSteps: string[];
}

export interface QuickTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  context: string;
  options: string[];
  criteria: string[];
}
