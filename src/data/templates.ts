import { QuickTemplate } from "../types";

export const SAMPLE_TEMPLATES: QuickTemplate[] = [
  {
    id: "startup-vs-corporate",
    title: "Join Early-Stage Startup vs Stay at Stable Corporate Role",
    category: "Career & Work",
    description: "Evaluate high-risk high-upside equity versus job security, benefits, and predictable work hours.",
    context: "Currently at a mid-tier tech firm earning $135k/year with good 401k match and 40 hrs/week. Received offer from Seed-stage AI startup for $115k + 0.8% equity, fast pace, potential unicorn growth.",
    options: [
      "Accept Startup Offer (High growth, equity upside, long hours)",
      "Stay at Corporate Job (Stability, work-life balance, steady progression)",
      "Counteroffer Startup for Higher Base or Advisory Role"
    ],
    criteria: [
      "Financial Upside",
      "Career Acceleration",
      "Work-Life Balance",
      "Job Security & Stress",
      "Regret Avoidance in 10 Years"
    ]
  },
  {
    id: "buy-vs-rent-home",
    title: "Buy First Home Now vs Keep Renting & Invest the Difference",
    category: "Personal Finance",
    description: "Determine whether to lock in a mortgage in today's housing market or remain flexible as a renter.",
    context: "Have $85k saved for down payment. Rent is $2,200/mo. Target townhouse purchase price is $420k with 6.8% mortgage rate, HOA fees $250/mo, property tax $4,000/yr. Might want to relocate in 4 years.",
    options: [
      "Buy Townhouse Now (Build equity, fixed housing cost, pride of ownership)",
      "Continue Renting & Dollar-Cost-Average Savings into Index Funds",
      "Wait 12-18 Months to Save Larger Down Payment & Watch Interest Rates"
    ],
    criteria: [
      "5-Year Net Worth Impact",
      "Geographic Flexibility",
      "Maintenance & Hidden Cost Burden",
      "Quality of Life & Peace of Mind",
      "Downside Risk"
    ]
  },
  {
    id: "build-vs-buy-software",
    title: "Build Custom In-House Internal Tool vs Subscribe to SaaS Enterprise Solution",
    category: "Tech & Architecture",
    description: "Compare engineering resource allocation, technical debt, and long-term customization vs speed-to-market.",
    context: "Company needs a complex customer support dispatch & billing sync system. Building takes ~3 full-time engineers for 4 months plus ongoing maintenance. SaaS tool costs $18k/year with 80% feature fit.",
    options: [
      "Build Custom In-House Tool (100% tailored workflow, full IP ownership)",
      "Subscribe to Enterprise SaaS (Immediate deployment, vendor maintenance, recurring cost)",
      "Hybrid: Buy SaaS and build custom API glue connectors"
    ],
    criteria: [
      "Time-to-Value & Launch Speed",
      "Total Cost of Ownership (3 Years)",
      "Engineering Opportunity Cost",
      "Workflow Customization Fit",
      "Vendor Lock-in Risk"
    ]
  },
  {
    id: "relocate-new-city",
    title: "Relocate to London / Tier-1 Hub vs Stay in Hometown with Remote Work",
    category: "Lifestyle & Relocation",
    description: "Weigh cultural exposure, networking opportunities, and international adventure against family closeness and lower living costs.",
    context: "Mid-20s professional with remote job flexibility. Offered relocation package to London office. Hometown has close family and low rent ($900/mo). London rent is $2,400/mo.",
    options: [
      "Relocate to London (Global networking, cultural vibrancy, high living cost)",
      "Stay in Hometown (Save aggressively, close to family, high comfort)",
      "Trial Period: Spend 3 Months in London on Temporary Lease"
    ],
    criteria: [
      "Personal Growth & Worldview",
      "Annual Savings Rate",
      "Social & Professional Network",
      "Family Closeness",
      "Adventure Quotient"
    ]
  }
];

export const CATEGORIES = [
  "Career & Work",
  "Personal Finance",
  "Tech & Architecture",
  "Business & Strategy",
  "Lifestyle & Relocation",
  "Education & Learning",
  "Health & Wellness",
  "General Decision"
];
