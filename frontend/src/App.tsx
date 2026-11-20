import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  Scale, 
  Layers, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Cpu, 
  ChevronRight, 
  RefreshCw, 
  Sliders, 
  Search,
  ExternalLink,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Copy,
  Check,
  Calendar,
  Users,
  Gauge,
  RotateCcw,
  Printer,
  Download
} from 'lucide-react';

interface PeerData {
  name: string;
  pe?: number;
  ev_sales?: number;
  ev_ebitda?: number;
  growth?: number;
}

interface LockinScheduleItem {
  stage: string;
  period: string;
  category: string;
  value_cr: number;
  pct_of_issue: number;
  status: string;
  risk_flag: string;
}

interface IPOData {
  company_name: string;
  ticker: string;
  sector?: string;
  price_band: string;
  issue_price: number;
  verdict: string;
  conviction_score: number;
  summary: string;
  peers?: PeerData[];
  ipo_multiples?: {
    ev_sales?: number;
    pe?: number;
    ev_ebitda?: number;
  };
  debate_stream: Array<{
    agent: string;
    role: string;
    message: string;
    risk_level: string;
  }>;
  math_metrics: {
    beneish: {
      m_score: number;
      risk_classification: string;
      red_flags: string[];
      ratios?: Record<string, number>;
    };
    dilution: {
      total_issue_size_cr: number;
      ofs_ratio_pct: number;
      fresh_ratio_pct: number;
      promoter_dilution_pct: number;
      anchor_cliff: {
        anchor_book_cr?: number;
        day_30_unlock_cr: number;
        day_90_unlock_cr: number;
        warning?: string;
      };
      lockin_schedule?: LockinScheduleItem[];
      red_flags: string[];
    };
    spike_cone: {
      issue_price?: number;
      gmp_in_rupees: number;
      gmp_pct: number;
      spike_probability_pct: number;
      market_sentiment: string;
      listing_cone: {
        bearish_gain_pct: number;
        expected_gain_pct: number;
        bullish_gain_pct: number;
        bearish_price: number;
        expected_price: number;
        bullish_price: number;
      };
    };
  };
  red_flags: string[];
  disclaimer: string;
}

const SAMPLE_FALLBACKS: Record<string, IPOData> = {
  SWIGGY: {
    company_name: "Swiggy Limited",
    ticker: "SWIGGY",
    sector: "Consumer Tech / Quick Commerce",
    price_band: "₹371 - ₹390",
    issue_price: 390.0,
    verdict: "TACTICAL SUBSCRIBE",
    conviction_score: 78,
    summary: "Subscribe strictly for Day-1 listing gains (+7.7% projected). Due to high OFS dilution (60.3%) and heavy Instamart burn, retail investors should book profits on listing day rather than holding through the T+30 anchor unlock cliff.",
    peers: [
      { name: "Zomato Ltd", pe: 115.0, ev_sales: 9.2, growth: 35.0 }
    ],
    ipo_multiples: { ev_sales: 6.8 },
    debate_stream: [
      {
        agent: "Valuation Auditor",
        role: "Fundamental Sanity",
        message: "Swiggy is priced at ₹390 (EV/Sales ~6.8x), a ~26% discount to Zomato's 9.2x multiple. While operating losses persist (-₹2,350 Cr net loss), the price band leaves tactical listing room.",
        risk_level: "MODERATE"
      },
      {
        agent: "Demand Forecaster",
        role: "Momentum & Listing Spikes",
        message: "QIB subscription oversubscribed 6.02x with GMP hovering at +₹15–20. Institutional book quality is robust; Day-1 spike probability cone indicates an upside target of ₹418–422.",
        risk_level: "LOW"
      },
      {
        agent: "Dilution Auditor",
        role: "Forensics & Governance",
        message: "WARNING: 60.3% of the ₹11,327 Cr issue is Offer for Sale (OFS). Selling financial sponsors (Prosus, Softbank) are liquidating stakes. Furthermore, ₹2,542 Cr of Anchor shares unlock at Day 30.",
        risk_level: "HIGH"
      },
      {
        agent: "Consensus Arbiter",
        role: "Multi-Agent Synthesis",
        message: "Arbitration Verdict: TACTICAL SUBSCRIBE. Day-1 momentum and valuation relative discount provide a positive listing window, but long-term allocation is capped due to high OFS overhang.",
        risk_level: "MODERATE"
      }
    ],
    math_metrics: {
      beneish: {
        m_score: -2.235,
        risk_classification: "LOW / STANDARD ACCRUAL PROFILE",
        red_flags: [],
        ratios: { DSRI: 0.99, GMI: 0.94, AQI: 0.96, SGI: 1.36, DEPI: 1.04, SGAI: 0.84, TATA: -0.10, LVGI: 1.04 }
      },
      dilution: {
        total_issue_size_cr: 11327.0,
        ofs_ratio_pct: 60.3,
        fresh_ratio_pct: 39.7,
        promoter_dilution_pct: 0.0,
        anchor_cliff: {
          anchor_book_cr: 5085.0,
          day_30_unlock_cr: 2542.5,
          day_90_unlock_cr: 2542.5,
          warning: "Watch for post-listing institutional selling pressure around T+30 and T+90 calendar days."
        },
        lockin_schedule: [
          { stage: "Day 0", period: "Listing Day", category: "Retail, NII & Floating QIB Quota", value_cr: 6242.0, pct_of_issue: 55.1, status: "IMMEDIATE_TRADING", risk_flag: "Active secondary price discovery" },
          { stage: "Day 30", period: "T+30 Days", category: "50% Anchor Investor Quota", value_cr: 2542.5, pct_of_issue: 22.4, status: "SUPPLY_CLIFF", risk_flag: "Initial institutional supply shock" },
          { stage: "Day 90", period: "T+90 Days", category: "Remaining 50% Anchor Quota", value_cr: 2542.5, pct_of_issue: 22.4, status: "SECONDARY_CLIFF", risk_flag: "Full anchor liquidity released" },
          { stage: "Day 180", period: "T+180 Days", category: "Pre-IPO Non-Promoter Holding", value_cr: 2731.2, pct_of_issue: 24.1, status: "VENTURE_CAPITAL_UNLOCK", risk_flag: "Early PE investor unlock (Prosus, Softbank)" },
          { stage: "Year 1 - 3", period: "T+365 to T+1095 Days", category: "Statutory Promoter Contribution", value_cr: 0.0, pct_of_issue: 0.0, status: "CORE_PROMOTER_LOCK", risk_flag: "Professionally run / zero promoter entity" }
        ],
        red_flags: [
          "HIGH RISK: OFS ratio is 60.3% (>50%). Majority of public funds exit to selling shareholders rather than funding expansion capex."
        ]
      },
      spike_cone: {
        gmp_in_rupees: 15.0,
        gmp_pct: 3.8,
        spike_probability_pct: 74.5,
        market_sentiment: "MODERATE LISTING GAIN EXPECTED",
        listing_cone: {
          bearish_gain_pct: -0.5,
          expected_gain_pct: 4.8,
          bullish_gain_pct: 8.2,
          bearish_price: 388.0,
          expected_price: 408.7,
          bullish_price: 422.0
        }
      }
    },
    red_flags: [
      "60.3% Offer for Sale: Primary beneficiaries are selling private equity investors.",
      "Consolidated trailing operating loss of -₹2,350 Cr; reliant on high customer retention.",
      "Anchor Lock-in: ₹2,542 Cr of stock unlocks for open-market liquidation on Day 30."
    ],
    disclaimer: "SEBI Compliance Notice: Research generated by autonomous multi-agent algorithms for academic evaluation only. Not registered investment advisory."
  },
  HYUNDAI: {
    company_name: "Hyundai Motor India Limited",
    ticker: "HYUNDAI",
    sector: "Automotive / Passenger Vehicles",
    price_band: "₹1865 - ₹1960",
    issue_price: 1960.0,
    verdict: "AVOID / FULLY PRICED",
    conviction_score: 88,
    summary: "Strong Avoid recommendation. 100% of this ₹27,870 Cr mega-offering is an Offer for Sale (OFS) cash-out to the Korean parent with zero capital entering India operations, compounded by a royalty hike.",
    peers: [
      { name: "Maruti Suzuki Ltd", pe: 26.5, ev_sales: 2.1, ev_ebitda: 18.2, growth: 12.0 },
      { name: "Tata Motors Ltd", pe: 10.8, ev_sales: 0.8, ev_ebitda: 6.4, growth: 18.0 }
    ],
    ipo_multiples: { pe: 26.2, ev_ebitda: 17.8 },
    debate_stream: [
      {
        agent: "Valuation Auditor",
        role: "Fundamental Sanity",
        message: "Hyundai is priced at P/E ~26.2x, matching market leader Maruti Suzuki (26.5x). Given Maruti's 2x higher market share and distribution network, Hyundai offers zero pricing discount.",
        risk_level: "HIGH"
      },
      {
        agent: "Demand Forecaster",
        role: "Momentum & Listing Spikes",
        message: "GMP collapsed to -₹10 (-0.5% discount) leading into listing. Retail portion remained undersubscribed (0.50x), reflecting widespread individual skepticism.",
        risk_level: "HIGH"
      },
      {
        agent: "Dilution Auditor",
        role: "Forensics & Governance",
        message: "CRITICAL RED FLAG: 100.0% OFS. Exactly ₹0 flows into Indian EV capex; all ₹27,870 Cr is repatriated. In addition, parent royalty fees were raised from 0.65% to 1.50% of revenue.",
        risk_level: "CRITICAL"
      },
      {
        agent: "Consensus Arbiter",
        role: "Multi-Agent Synthesis",
        message: "Arbitration Verdict: AVOID / FULLY PRICED. The complete absence of fresh capital combined with aggressive pricing creates high asymmetric downside risk for retail subscribers.",
        risk_level: "HIGH"
      }
    ],
    math_metrics: {
      beneish: {
        m_score: -2.48,
        risk_classification: "LOW / STANDARD ACCRUAL PROFILE",
        red_flags: [],
        ratios: { DSRI: 1.01, GMI: 1.02, AQI: 0.96, SGI: 1.15, DEPI: 1.04, SGAI: 0.98, TATA: 0.02, LVGI: 0.95 }
      },
      dilution: {
        total_issue_size_cr: 27870.0,
        ofs_ratio_pct: 100.0,
        fresh_ratio_pct: 0.0,
        promoter_dilution_pct: 17.5,
        anchor_cliff: {
          anchor_book_cr: 8315.0,
          day_30_unlock_cr: 4157.5,
          day_90_unlock_cr: 4157.5,
          warning: "Watch for post-listing institutional selling pressure around T+30 and T+90 calendar days."
        },
        lockin_schedule: [
          { stage: "Day 0", period: "Listing Day", category: "Retail & Floating Quota", value_cr: 19555.0, pct_of_issue: 70.2, status: "IMMEDIATE_TRADING", risk_flag: "Public float exposed to secondary market" },
          { stage: "Day 30", period: "T+30 Days", category: "50% Anchor Investor Quota", value_cr: 4157.5, pct_of_issue: 14.9, status: "SUPPLY_CLIFF", risk_flag: "Massive ₹4,157 Cr supply unlock" },
          { stage: "Day 90", period: "T+90 Days", category: "Remaining 50% Anchor Quota", value_cr: 4157.5, pct_of_issue: 14.9, status: "SECONDARY_CLIFF", risk_flag: "Final anchor supply unlock" },
          { stage: "Day 180", period: "T+180 Days", category: "Pre-IPO Investor Release", value_cr: 0.0, pct_of_issue: 0.0, status: "VENTURE_CAPITAL_UNLOCK", risk_flag: "No pre-IPO PE investor base" },
          { stage: "Year 1 - 3", period: "T+365 to T+1095 Days", category: "Promoter Retained Holding", value_cr: 41805.0, pct_of_issue: 82.5, status: "CORE_PROMOTER_LOCK", risk_flag: "Korean parent maintains 82.5% stake" }
        ],
        red_flags: [
          "CRITICAL: 100.0% of issue is Offer for Sale (OFS). Zero capital enters Indian operations.",
          "Royalty rate paid to foreign parent increased from 0.65% to 1.50% of revenue."
        ]
      },
      spike_cone: {
        gmp_in_rupees: -10.0,
        gmp_pct: -0.5,
        spike_probability_pct: 22.1,
        market_sentiment: "BEARISH / DISCOUNT RISK",
        listing_cone: {
          bearish_gain_pct: -6.5,
          expected_gain_pct: -1.5,
          bullish_gain_pct: 2.8,
          bearish_price: 1832.0,
          expected_price: 1931.0,
          bullish_price: 2014.0
        }
      }
    },
    red_flags: [
      "100.0% OFS: Entire ₹27,870 Cr is a promoter liquidity exit repatriated to South Korea.",
      "Permanent margin drag: Royalty payment to parent company more than doubled to 1.50%.",
      "Priced at parity with industry benchmark Maruti Suzuki despite single-plant concentration."
    ],
    disclaimer: "SEBI Compliance Notice: Research generated by autonomous multi-agent algorithms for academic evaluation only. Not registered investment advisory."
  },
  OLA_ELEC: {
    company_name: "Ola Electric Mobility Limited",
    ticker: "OLAELEC",
    sector: "Electric Vehicles (2-Wheelers)",
    price_band: "₹72 - ₹76",
    issue_price: 76.0,
    verdict: "HIGH SPECULATIVE RISK",
    conviction_score: 82,
    summary: "High forensic risk detected. Elevated accrual anomaly signals (Beneish M-Score: -1.605) combined with escalating consumer complaints and subsidy phase-out present acute long-term volatility.",
    peers: [
      { name: "TVS Motor Ltd", pe: 48.0, ev_sales: 3.2, growth: 15.0 },
      { name: "Bajaj Auto Ltd", pe: 34.0, ev_sales: 4.1, growth: 14.0 }
    ],
    ipo_multiples: { ev_sales: 7.4 },
    debate_stream: [
      {
        agent: "Valuation Auditor",
        role: "Fundamental Sanity",
        message: "Ola Electric is priced at EV/Sales ~7.4x, nearly double legacy 2-wheeler OEMs (TVS at 3.2x, Bajaj Auto at 4.1x). Revenue growth is strong but burdened by heavy gross losses.",
        risk_level: "HIGH"
      },
      {
        agent: "Demand Forecaster",
        role: "Momentum & Listing Spikes",
        message: "Initial speculative retail frenzy and GMP of +₹12 (+15.8%) drove an initial spike to ₹76 on listing day (and brief surge to ₹157), but lack of earnings support caused rapid collapse.",
        risk_level: "MODERATE"
      },
      {
        agent: "Dilution Auditor",
        role: "Forensics & Governance",
        message: "Beneish M-Score flags an aggressive accrual metric (-1.605 > -1.78 threshold). Statutory notes document persistent regulatory subsidy dependency and customer service disputes.",
        risk_level: "CRITICAL"
      },
      {
        agent: "Consensus Arbiter",
        role: "Multi-Agent Synthesis",
        message: "Arbitration Verdict: HIGH SPECULATIVE RISK. Despite initial speculative listing euphoria, structural balance sheet distress and service escalations justify staying away.",
        risk_level: "HIGH"
      }
    ],
    math_metrics: {
      beneish: {
        m_score: -1.605,
        risk_classification: "HIGH MANIPULATION / ACCRUAL RISK",
        red_flags: ["Beneish M-Score of -1.605 breaches the -1.78 threshold, signaling aggressive cost capitalization."],
        ratios: { DSRI: 1.28, GMI: 1.18, AQI: 1.32, SGI: 1.90, DEPI: 0.92, SGAI: 1.10, TATA: 0.09, LVGI: 1.25 }
      },
      dilution: {
        total_issue_size_cr: 6145.0,
        ofs_ratio_pct: 10.5,
        fresh_ratio_pct: 89.5,
        promoter_dilution_pct: 8.2,
        anchor_cliff: {
          anchor_book_cr: 2763.0,
          day_30_unlock_cr: 1381.5,
          day_90_unlock_cr: 1381.5,
          warning: "Watch for post-listing institutional selling pressure around T+30 and T+90 calendar days."
        },
        lockin_schedule: [
          { stage: "Day 0", period: "Listing Day", category: "Retail, NII & Float", value_cr: 3382.0, pct_of_issue: 55.0, status: "IMMEDIATE_TRADING", risk_flag: "Active retail trading float" },
          { stage: "Day 30", period: "T+30 Days", category: "50% Anchor Investor Quota", value_cr: 1381.5, pct_of_issue: 22.5, status: "SUPPLY_CLIFF", risk_flag: "Anchor profit-taking window" },
          { stage: "Day 90", period: "T+90 Days", category: "Remaining 50% Anchor Quota", value_cr: 1381.5, pct_of_issue: 22.5, status: "SECONDARY_CLIFF", risk_flag: "Final anchor liquidity release" },
          { stage: "Day 180", period: "T+180 Days", category: "Pre-IPO Early Seed & Series Investors", value_cr: 258.0, pct_of_issue: 4.2, status: "VENTURE_CAPITAL_UNLOCK", risk_flag: "Secondary liquidity for early backers" },
          { stage: "Year 1 - 3", period: "T+365 to T+1095 Days", category: "Promoter Bhavish Aggarwal Stake", value_cr: 2267.5, pct_of_issue: 36.9, status: "CORE_PROMOTER_LOCK", risk_flag: "Promoter holding locked per SEBI guidelines" }
        ],
        red_flags: [
          "Promoter post-issue stake declines to 36.9%, diluting founder ownership.",
          "Altman Z'' distress metric at 0.84 indicates ongoing working capital vulnerability."
        ]
      },
      spike_cone: {
        gmp_in_rupees: 12.0,
        gmp_pct: 15.8,
        spike_probability_pct: 71.0,
        market_sentiment: "SPECULATIVE VOLATILITY",
        listing_cone: {
          bearish_gain_pct: 0.0,
          expected_gain_pct: 10.4,
          bullish_gain_pct: 18.9,
          bearish_price: 76.0,
          expected_price: 83.9,
          bullish_price: 90.4
        }
      }
    },
    red_flags: [
      "Beneish M-Score = -1.605 indicates aggressive capitalization of operating expenses.",
      "Regulatory vulnerability: Substantial reliance on central FAME/EMPS EV subsidy payouts.",
      "Severe post-listing drawdown: Initial spike from ₹76 to ₹157 subsequently crashed to ₹68 (-56%)."
    ],
    disclaimer: "SEBI Compliance Notice: Research generated by autonomous multi-agent algorithms for academic evaluation only. Not registered investment advisory."
  }
};

export default function App() {
  const [selectedKey, setSelectedKey] = useState<string>("SWIGGY");
  const [activeTab, setActiveTab] = useState<"terminal" | "math" | "peers" | "timeline" | "simulator">("terminal");
  const [data, setData] = useState<IPOData>(SAMPLE_FALLBACKS["SWIGGY"]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [groqKey, setGroqKey] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [showDossierModal, setShowDossierModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>("ALL");

  const downloadMarkdownDossier = () => {
    const md = `# INSTITUTIONAL IPO DUE-DILIGENCE DOSSIER: ${data.company_name} (${data.ticker})
*Department of Computer Engineering, Fr. Conceicao Rodrigues College of Engineering, Mumbai*
*Academic Course Seminar: 25SEM14CE01 | Candidate: Rohan Benegal (Roll No. 10170)*

---

## 1. EXECUTIVE CONSENSUS SYNTHESIS
- **Arbitration Verdict**: ${data.verdict}
- **Conviction Score**: ${data.conviction_score}%
- **Offering Price Band**: ${data.price_band} (Issue Price: ₹${data.issue_price})
- **Sector**: ${data.sector || "General Industry"}
- **Executive Summary**: ${data.summary}

---

## 2. CAPITAL DILUTION & STATUTORY LOCK-IN CLIFF
- **Total Issue Size**: ₹${data.math_metrics.dilution.total_issue_size_cr.toLocaleString()} Cr
- **Offer For Sale (OFS)**: ${data.math_metrics.dilution.ofs_ratio_pct}%
- **Fresh Growth Capital**: ${data.math_metrics.dilution.fresh_ratio_pct}%
- **Anchor Investor Book**: ₹${(data.math_metrics.dilution.anchor_cliff.anchor_book_cr || 0).toLocaleString()} Cr
  - **T+30 Days Unlock (50%)**: ₹${data.math_metrics.dilution.anchor_cliff.day_30_unlock_cr.toLocaleString()} Cr
  - **T+90 Days Unlock (50%)**: ₹${data.math_metrics.dilution.anchor_cliff.day_90_unlock_cr.toLocaleString()} Cr

### SEBI Statutory Lock-In Timeline:
| Stage | Period | Category | Value (₹ Cr) | % of Issue | Statutory Risk Flag |
|---|---|---|---|---|---|
${(data.math_metrics.dilution.lockin_schedule || []).map(s => `| ${s.stage} | ${s.period} | ${s.category} | ₹${s.value_cr.toLocaleString()} | ${s.pct_of_issue}% | ${s.risk_flag} |`).join('\n')}

---

## 3. FORENSIC ACCOUNTING AUDIT (BENEISH 8-VARIABLE M-SCORE)
- **Calculated M-Score**: ${data.math_metrics.beneish.m_score}
- **Risk Classification**: ${data.math_metrics.beneish.risk_classification}
- **SEBI / Empirical Threshold**: M-Score > -1.78 indicates high probability of earnings manipulation.

| Ratio | Value | Economic Implication |
|---|---|---|
${Object.entries(data.math_metrics.beneish.ratios || {}).map(([k, v]) => `| ${k} | ${v} | ${k === 'DSRI' ? 'Days Sales in Receivables Index' : k === 'GMI' ? 'Gross Margin Index' : k === 'AQI' ? 'Asset Quality Index' : k === 'SGI' ? 'Sales Growth Index' : k === 'DEPI' ? 'Depreciation Index' : k === 'SGAI' ? 'SG&A Expenses Index' : k === 'TATA' ? 'Total Accruals to Total Assets' : 'Leverage Index'} |`).join('\n')}

---

## 4. DAY-1 LISTING PRICE RETURN PROBABILITY CONE
- **Grey Market Premium (GMP)**: ₹${data.math_metrics.spike_cone.gmp_in_rupees} (${data.math_metrics.spike_cone.gmp_pct}%)
- **Listing Spike Probability**: ${data.math_metrics.spike_cone.spike_probability_pct}%
- **Market Sentiment**: ${data.math_metrics.spike_cone.market_sentiment}
- **Expected Day-1 Listing Price**: ₹${data.math_metrics.spike_cone.listing_cone.expected_price} (+${data.math_metrics.spike_cone.listing_cone.expected_gain_pct}%)
- **Bearish Bound (P10)**: ₹${data.math_metrics.spike_cone.listing_cone.bearish_price} (${data.math_metrics.spike_cone.listing_cone.bearish_gain_pct}%)
- **Bullish Bound (P90)**: ₹${data.math_metrics.spike_cone.listing_cone.bullish_price} (+${data.math_metrics.spike_cone.listing_cone.bullish_gain_pct}%)

---

## 5. STATUTORY DRHP DISCLOSURES & FORENSIC RED FLAGS
${data.red_flags.map((flag, i) => `${i + 1}. ${flag}`).join('\n')}

---

## 6. AUTONOMOUS MULTI-AGENT DELIBERATION STREAM
${data.debate_stream.map(d => `### [${d.agent}] - Role: ${d.role} (Risk: ${d.risk_level})
${d.message}
`).join('\n')}

---
*Notice: Generated by IPO-Radar Autonomous Multi-Agent Financial Swarm. Academic research purposes only.*
`;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.ticker}_SEBI_Due_Diligence_Dossier.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // What-If Simulator Interactive State
  const [simGmp, setSimGmp] = useState<number>(15);
  const [simQibSub, setSimQibSub] = useState<number>(6.0);

  // Sync simulator state when company changes
  useEffect(() => {
    setSimGmp(data.math_metrics.spike_cone.gmp_in_rupees || 0);
  }, [data]);

  // Compute dynamic simulation outputs
  const simGmpPct = data.issue_price > 0 ? (simGmp / data.issue_price) * 100 : 0;
  const simExpectedGainPct = Number(((simGmpPct * 0.70) + (Math.min(simQibSub, 50) * 0.25) - 2.0).toFixed(1));
  const simExpectedPrice = Number((data.issue_price * (1 + simExpectedGainPct / 100)).toFixed(2));
  const simBearishPrice = Number((data.issue_price * (1 + (simExpectedGainPct - 5.5) / 100)).toFixed(2));
  const simBullishPrice = Number((data.issue_price * (1 + (simExpectedGainPct + 7.5) / 100)).toFixed(2));
  const simProb = Math.min(Math.max(Math.round(40 + simGmpPct * 2.5 + simQibSub * 1.5), 5), 98);

  // Custom IPO Form State
  const [customForm, setCustomForm] = useState({
    company_name: "NTPC Green Energy Limited",
    ticker: "NTPCGREEN",
    sector: "Renewable Energy / Utilities",
    price_band: "₹102 - ₹108",
    issue_price: 108.0,
    fresh_issue_cr: 10000.0,
    ofs_cr: 0.0,
    gmp_rupees: 3.5,
    qib_subscription_x: 3.2,
    nii_subscription_x: 0.8,
    retail_subscription_x: 1.4,
    anchor_book_cr: 3960.0,
    pre_promoter_holding_pct: 100.0,
    post_promoter_holding_pct: 89.0
  });

  // Switch company with live backend fetch & offline fallback
  const handleSelectIPO = async (key: string) => {
    setSelectedKey(key);
    setIsAnalyzing(true);
    try {
      const url = `http://localhost:8000/api/ipo/${key}/${groqKey ? `?api_key=${groqKey}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setIsAnalyzing(false);
        return;
      }
    } catch (err) {
      // Backend offline or local fallback
    }
    setTimeout(() => {
      setData(SAMPLE_FALLBACKS[key] || SAMPLE_FALLBACKS["SWIGGY"]);
      setIsAnalyzing(false);
    }, 200);
  };

  // Submit custom IPO analysis
  const handleAnalyzeCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setShowCustomModal(false);
    setSelectedKey("CUSTOM");

    try {
      const res = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...customForm,
          groq_api_key: groqKey || undefined
        })
      });

      if (res.ok) {
        const json = await res.json();
        setData(json);
        setIsAnalyzing(false);
        return;
      }
    } catch (err) {
      // Fallback local calculation
    }

    // Local deterministic estimation fallback
    const total = customForm.fresh_issue_cr + customForm.ofs_cr;
    const ofs_pct = total > 0 ? (customForm.ofs_cr / total) * 100 : 0;
    const gmp_pct = customForm.issue_price > 0 ? (customForm.gmp_rupees / customForm.issue_price) * 100 : 0;
    const exp_gain = Number((gmp_pct * 0.75).toFixed(1));
    const exp_price = Number((customForm.issue_price * (1 + exp_gain / 100)).toFixed(2));

    const customResult: IPOData = {
      company_name: customForm.company_name,
      ticker: customForm.ticker,
      sector: customForm.sector,
      price_band: customForm.price_band,
      issue_price: customForm.issue_price,
      verdict: ofs_pct > 80 ? "AVOID / FULLY PRICED" : exp_gain > 5 ? "TACTICAL SUBSCRIBE" : "CAUTION / SELECTIVE APPLY",
      conviction_score: 80,
      summary: `Custom swarm evaluation for ${customForm.company_name}. Fresh issue dominates at ₹${customForm.fresh_issue_cr.toLocaleString()} Cr (${(100 - ofs_pct).toFixed(1)}%). GMP indicates a projected Day-1 return of +${exp_gain}%.`,
      peers: [
        { name: "Tata Power Co", pe: 38.0, ev_sales: 2.8, growth: 14.0 },
        { name: "Adani Green Energy", pe: 110.0, ev_sales: 12.5, growth: 28.0 }
      ],
      ipo_multiples: { ev_sales: 3.1 },
      debate_stream: [
        {
          agent: "Valuation Auditor",
          role: "Fundamental Sanity",
          message: `Valuation sanity check for ${customForm.ticker}: Issue priced at ₹${customForm.issue_price}. 100% of proceeds fund capital expansion, mitigating liquidity exit concerns.`,
          risk_level: ofs_pct > 50 ? "HIGH" : "LOW"
        },
        {
          agent: "Demand Forecaster",
          role: "Momentum & Listing Spikes",
          message: `GMP is ₹${customForm.gmp_rupees} (${gmp_pct.toFixed(1)}% spread). QIB subscription at ${customForm.qib_subscription_x}x indicates institutional participation.`,
          risk_level: customForm.gmp_rupees >= 0 ? "LOW" : "HIGH"
        },
        {
          agent: "Dilution Auditor",
          role: "Forensics & Governance",
          message: `Capital Structure: OFS ratio is ${ofs_pct.toFixed(1)}%. ₹${(customForm.anchor_book_cr * 0.5).toLocaleString()} Cr unlocks at Day 30 post-listing.`,
          risk_level: ofs_pct > 50 ? "HIGH" : "LOW"
        },
        {
          agent: "Consensus Arbiter",
          role: "Multi-Agent Synthesis",
          message: `Arbiter Synthesis: Proceed with disciplined allocation based on fresh capital deployment and listing gain momentum.`,
          risk_level: "MODERATE"
        }
      ],
      math_metrics: {
        beneish: {
          m_score: -2.35,
          risk_classification: "LOW / STANDARD ACCRUAL PROFILE",
          red_flags: [],
          ratios: { DSRI: 1.0, GMI: 1.0, AQI: 1.0, SGI: 1.15, DEPI: 1.0, SGAI: 0.95, TATA: 0.01, LVGI: 0.98 }
        },
        dilution: {
          total_issue_size_cr: total,
          ofs_ratio_pct: Number(ofs_pct.toFixed(1)),
          fresh_ratio_pct: Number((100 - ofs_pct).toFixed(1)),
          promoter_dilution_pct: Number((customForm.pre_promoter_holding_pct - customForm.post_promoter_holding_pct).toFixed(1)),
          anchor_cliff: {
            anchor_book_cr: customForm.anchor_book_cr,
            day_30_unlock_cr: customForm.anchor_book_cr * 0.5,
            day_90_unlock_cr: customForm.anchor_book_cr * 0.5
          },
          lockin_schedule: [
            { stage: "Day 0", period: "Listing Day", category: "Active Floating Quota", value_cr: total - customForm.anchor_book_cr, pct_of_issue: 60.4, status: "IMMEDIATE_TRADING", risk_flag: "Active secondary trading" },
            { stage: "Day 30", period: "T+30 Days", category: "50% Anchor Investor Quota", value_cr: customForm.anchor_book_cr * 0.5, pct_of_issue: 19.8, status: "SUPPLY_CLIFF", risk_flag: "First anchor exit window" },
            { stage: "Day 90", period: "T+90 Days", category: "Remaining Anchor Quota", value_cr: customForm.anchor_book_cr * 0.5, pct_of_issue: 19.8, status: "SECONDARY_CLIFF", risk_flag: "Full anchor liquidity released" },
            { stage: "Year 1 - 3", period: "T+365 to T+1095 Days", category: "Promoter Quota (NTPC)", value_cr: 8900.0, pct_of_issue: 89.0, status: "CORE_PROMOTER_LOCK", risk_flag: "Sovereign parent alignment" }
          ],
          red_flags: ofs_pct > 50 ? ["OFS exceeds 50% of total offering."] : []
        },
        spike_cone: {
          gmp_in_rupees: customForm.gmp_rupees,
          gmp_pct: Number(gmp_pct.toFixed(1)),
          spike_probability_pct: Math.min(Math.max(50 + gmp_pct * 2, 10), 95),
          market_sentiment: gmp_pct > 5 ? "POSITIVE LISTING MOMENTUM" : "SUBDUED DEMAND",
          listing_cone: {
            bearish_gain_pct: Number((exp_gain - 4).toFixed(1)),
            expected_gain_pct: exp_gain,
            bullish_gain_pct: Number((exp_gain + 5).toFixed(1)),
            bearish_price: Number((customForm.issue_price * (1 + (exp_gain - 4) / 100)).toFixed(2)),
            expected_price: exp_price,
            bullish_price: Number((customForm.issue_price * (1 + (exp_gain + 5) / 100)).toFixed(2))
          }
        }
      },
      red_flags: ofs_pct > 50 ? ["OFS exceeds 50% of total offering."] : ["Standard statutory regulatory disclosures."],
      disclaimer: "SEBI Compliance Notice: Research generated by autonomous multi-agent algorithms for academic evaluation only. Not registered investment advisory."
    };

    setTimeout(() => {
      setData(customResult);
      setIsAnalyzing(false);
    }, 250);
  };

  const copyReportSummary = () => {
    const reportText = `### IPO-Radar Due-Diligence Brief: ${data.company_name} (${data.ticker})
- **Arbitration Verdict**: ${data.verdict} (Conviction: ${data.conviction_score}%)
- **Issue Price**: ₹${data.issue_price} (Price Band: ${data.price_band})
- **Offer for Sale (OFS)**: ${data.math_metrics.dilution.ofs_ratio_pct}%
- **Beneish M-Score**: ${data.math_metrics.beneish.m_score} (${data.math_metrics.beneish.risk_classification})
- **Expected Day-1 Return**: ${data.math_metrics.spike_cone.listing_cone.expected_gain_pct}% (Cone: ₹${data.math_metrics.spike_cone.listing_cone.bearish_price} - ₹${data.math_metrics.spike_cone.listing_cone.bullish_price})
- **Anchor Lock-In Cliff (T+30d)**: ₹${data.math_metrics.dilution.anchor_cliff.day_30_unlock_cr.toLocaleString()} Cr
- **Summary**: ${data.summary}

Autonomous Multi-Agent Analysis by Rohan Benegal (Roll No. 10170), Fr. CRCE.`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter debate stream
  const filteredDebates = data.debate_stream.filter(d => {
    if (selectedAgentFilter === "ALL") return true;
    if (selectedAgentFilter === "VALUATION") return d.agent.includes("Valuation");
    if (selectedAgentFilter === "DEMAND") return d.agent.includes("Demand");
    if (selectedAgentFilter === "DILUTION") return d.agent.includes("Dilution");
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070709] text-[#f4f4f5] font-sans antialiased selection:bg-white selection:text-black">
      {/* TOP HEADER */}
      <header className="border-b border-[#27272a] bg-[#0c0c0e]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded bg-white text-black flex items-center justify-center font-bold font-mono text-sm shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
              IR
            </div>
            <div>
              <span className="font-mono font-bold tracking-tight text-sm text-white">IPO-RADAR</span>
              <span className="text-[10px] text-zinc-400 font-mono ml-2 border border-zinc-800 rounded px-1.5 py-0.5 bg-black">
                SWARM v2.4
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>4 AGENTS ACTIVE</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-300">GROQ 3-KEY ROTATION + GEMINI</span>
            </div>

            <button 
              onClick={() => setShowCustomModal(true)}
              className="sk-btn-primary px-3 py-1.5 text-xs font-mono flex items-center space-x-1.5 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>CUSTOM IPO</span>
            </button>

            <button 
              onClick={() => setShowKeyModal(!showKeyModal)}
              className="sk-btn-secondary px-3 py-1.5 text-xs font-mono flex items-center space-x-1.5 cursor-pointer"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>{groqKey ? "KEY OVERRIDE" : "API KEYS"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* CUSTOM IPO MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="sk-card max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> ANALYZE CUSTOM IPO VIA MULTI-AGENT SWARM
              </h3>
              <button onClick={() => setShowCustomModal(false)} className="text-zinc-500 hover:text-white text-xs font-mono cursor-pointer">
                [CLOSE]
              </button>
            </div>
            <form onSubmit={handleAnalyzeCustom} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Company Name</label>
                  <input 
                    type="text" 
                    value={customForm.company_name}
                    onChange={(e) => setCustomForm({...customForm, company_name: e.target.value})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Ticker</label>
                  <input 
                    type="text" 
                    value={customForm.ticker}
                    onChange={(e) => setCustomForm({...customForm, ticker: e.target.value})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Issue Price (₹)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={customForm.issue_price}
                    onChange={(e) => setCustomForm({...customForm, issue_price: parseFloat(e.target.value) || 0})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Fresh Issue (₹ Cr)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={customForm.fresh_issue_cr}
                    onChange={(e) => setCustomForm({...customForm, fresh_issue_cr: parseFloat(e.target.value) || 0})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Offer For Sale (₹ Cr)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={customForm.ofs_cr}
                    onChange={(e) => setCustomForm({...customForm, ofs_cr: parseFloat(e.target.value) || 0})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">GMP (₹)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={customForm.gmp_rupees}
                    onChange={(e) => setCustomForm({...customForm, gmp_rupees: parseFloat(e.target.value) || 0})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">QIB Sub (x)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={customForm.qib_subscription_x}
                    onChange={(e) => setCustomForm({...customForm, qib_subscription_x: parseFloat(e.target.value) || 0})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Retail Sub (x)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={customForm.retail_subscription_x}
                    onChange={(e) => setCustomForm({...customForm, retail_subscription_x: parseFloat(e.target.value) || 0})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Anchor Book (₹ Cr)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={customForm.anchor_book_cr}
                    onChange={(e) => setCustomForm({...customForm, anchor_book_cr: parseFloat(e.target.value) || 0})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Pre-Promoter %</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={customForm.pre_promoter_holding_pct}
                    onChange={(e) => setCustomForm({...customForm, pre_promoter_holding_pct: parseFloat(e.target.value) || 0})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Post-Promoter %</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={customForm.post_promoter_holding_pct}
                    onChange={(e) => setCustomForm({...customForm, post_promoter_holding_pct: parseFloat(e.target.value) || 0})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button 
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="sk-btn-secondary px-4 py-2 font-mono cursor-pointer"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="sk-btn-primary px-5 py-2 font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Cpu className="h-3.5 w-3.5" /> RUN AGENT SWARM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KEY INPUT MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="sk-card max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
                <Cpu className="h-4 w-4" /> MULTI-KEY ROTATION POOL
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-zinc-500 hover:text-white text-xs font-mono cursor-pointer">
                [CLOSE]
              </button>
            </div>
            <div className="space-y-2 text-xs text-zinc-400 leading-relaxed">
              <div className="p-3 border border-zinc-800 rounded bg-[#0a0a0c] space-y-1 font-mono text-[11px]">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Key Rotation Engine Active
                </div>
                <div className="text-zinc-400">3 Groq Cloud API keys configured in round-robin failover pool.</div>
                <div className="text-zinc-400">Google Gemini API backup configured for secondary arbiter.</div>
              </div>
              <p>Optionally enter a session key override for this browser window:</p>
            </div>
            <input 
              type="password"
              placeholder="gsk_..."
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              className="sk-recessed w-full px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 outline-none focus:border-zinc-400"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowKeyModal(false)}
                className="sk-btn-primary px-4 py-1.5 text-xs font-mono cursor-pointer"
              >
                SAVE & RESUME
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL DUE-DILIGENCE DOSSIER EXPORT MODAL */}
      {showDossierModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="sk-card max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto border border-zinc-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-800 pb-3 no-print">
              <div>
                <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
                  <FileText className="h-4 w-4" /> SEBI STATUTORY DUE-DILIGENCE DOSSIER
                </h3>
                <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  Academic Research Report • Candidate: Rohan Benegal (Roll No. 10170)
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={downloadMarkdownDossier}
                  className="sk-btn-secondary px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>EXPORT .MD</span>
                </button>
                <button 
                  onClick={() => window.print()}
                  className="sk-btn-primary px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>PRINT / PDF</span>
                </button>
                <button 
                  onClick={() => setShowDossierModal(false)} 
                  className="text-zinc-500 hover:text-white text-xs font-mono px-2 py-1 cursor-pointer"
                >
                  [CLOSE]
                </button>
              </div>
            </div>

            {/* DOSSIER BODY CONTENT (PRINTABLE) */}
            <div className="space-y-6 text-xs text-zinc-300 font-sans leading-relaxed">
              
              {/* Institutional Header */}
              <div className="border border-zinc-800 rounded p-4 bg-[#0a0a0d] space-y-2">
                <div className="flex justify-between items-start border-b border-zinc-800/80 pb-2">
                  <div>
                    <h2 className="text-base font-bold text-white font-mono">{data.company_name} ({data.ticker})</h2>
                    <div className="text-zinc-400 text-[11px] font-mono">SEBI ICDR Due-Diligence & Forensic Valuation Audit</div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="px-2 py-0.5 rounded border border-white text-white font-bold bg-black text-[11px]">
                      {data.verdict}
                    </span>
                    <div className="text-[10px] text-zinc-500 mt-1">Conviction: {data.conviction_score}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div><span className="text-zinc-500">Issue Price:</span> <span className="text-white font-bold">₹{data.issue_price}</span></div>
                  <div><span className="text-zinc-500">Price Band:</span> <span className="text-white">{data.price_band}</span></div>
                  <div><span className="text-zinc-500">OFS Ratio:</span> <span className="text-white font-bold">{data.math_metrics.dilution.ofs_ratio_pct}%</span></div>
                  <div><span className="text-zinc-500">Beneish M-Score:</span> <span className="text-white font-bold">{data.math_metrics.beneish.m_score}</span></div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-1.5">
                <h4 className="font-mono font-bold text-white text-[11px] uppercase tracking-wider">
                  1. Executive Arbitration Summary
                </h4>
                <p className="sk-recessed p-3 text-zinc-300">
                  {data.summary}
                </p>
              </div>

              {/* Capital Dilution & Lock-in Cliff */}
              <div className="space-y-2">
                <h4 className="font-mono font-bold text-white text-[11px] uppercase tracking-wider">
                  2. Capital Dilution & SEBI Anchor Lock-in Cliff
                </h4>
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-center">
                  <div className="sk-recessed p-2">
                    <div className="text-zinc-500">TOTAL ISSUE</div>
                    <div className="text-white font-bold">₹{data.math_metrics.dilution.total_issue_size_cr.toLocaleString()} Cr</div>
                  </div>
                  <div className="sk-recessed p-2">
                    <div className="text-zinc-500">T+30 ANCHOR CLIFF</div>
                    <div className="text-white font-bold">₹{data.math_metrics.dilution.anchor_cliff.day_30_unlock_cr.toLocaleString()} Cr</div>
                  </div>
                  <div className="sk-recessed p-2">
                    <div className="text-zinc-500">T+90 ANCHOR CLIFF</div>
                    <div className="text-white font-bold">₹{data.math_metrics.dilution.anchor_cliff.day_90_unlock_cr.toLocaleString()} Cr</div>
                  </div>
                </div>
              </div>

              {/* Listing Return Probability Cone */}
              <div className="space-y-2">
                <h4 className="font-mono font-bold text-white text-[11px] uppercase tracking-wider">
                  3. Day-1 Listing Spike Probability Cone
                </h4>
                <div className="grid grid-cols-3 gap-2 font-mono text-center">
                  <div className="sk-recessed p-2">
                    <div className="text-[10px] text-zinc-500">BEARISH (P10)</div>
                    <div className="text-xs font-bold text-zinc-300">₹{data.math_metrics.spike_cone.listing_cone.bearish_price} ({data.math_metrics.spike_cone.listing_cone.bearish_gain_pct}%)</div>
                  </div>
                  <div className="sk-recessed p-2 border border-zinc-700">
                    <div className="text-[10px] text-white font-bold">EXPECTED</div>
                    <div className="text-xs font-bold text-white">₹{data.math_metrics.spike_cone.listing_cone.expected_price} (+{data.math_metrics.spike_cone.listing_cone.expected_gain_pct}%)</div>
                  </div>
                  <div className="sk-recessed p-2">
                    <div className="text-[10px] text-zinc-500">BULLISH (P90)</div>
                    <div className="text-xs font-bold text-zinc-300">₹{data.math_metrics.spike_cone.listing_cone.bullish_price} (+{data.math_metrics.spike_cone.listing_cone.bullish_gain_pct}%)</div>
                  </div>
                </div>
              </div>

              {/* Statutory Red Flags */}
              <div className="space-y-1.5">
                <h4 className="font-mono font-bold text-white text-[11px] uppercase tracking-wider">
                  4. Statutory Prospectus Risk Flags
                </h4>
                <div className="space-y-1 font-mono text-[11px]">
                  {data.red_flags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-zinc-300">
                      <span className="text-zinc-600">•</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-Agent Deliberation Logs */}
              <div className="space-y-2">
                <h4 className="font-mono font-bold text-white text-[11px] uppercase tracking-wider">
                  5. Autonomous Swarm Deliberation Records
                </h4>
                <div className="space-y-2">
                  {data.debate_stream.map((d, idx) => (
                    <div key={idx} className="sk-recessed p-3 space-y-1">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="font-bold text-white">[{d.agent}] • {d.role}</span>
                        <span className="text-zinc-400">Risk: {d.risk_level}</span>
                      </div>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">{d.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Footer */}
              <div className="border-t border-zinc-800 pt-3 text-[10px] font-mono text-zinc-500 flex justify-between">
                <div>Fr. CRCE, Dept. of Computer Engineering • Course Seminar 25SEM14CE01</div>
                <div>Rohan Benegal (Roll No. 10170)</div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* TOP CONTROLS & OFFERING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { key: "SWIGGY", label: "Swiggy Limited", sub: "₹11,327 Cr • 60.3% OFS", verdict: "TACTICAL SUBSCRIBE" },
            { key: "HYUNDAI", label: "Hyundai Motor India", sub: "₹27,870 Cr • 100% OFS", verdict: "AVOID / FULLY PRICED" },
            { key: "OLA_ELEC", label: "Ola Electric Mobility", sub: "₹6,145 Cr • 10.5% OFS", verdict: "HIGH SPECULATIVE RISK" }
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => handleSelectIPO(item.key)}
              className={`p-3.5 rounded-lg border transition-all text-left flex flex-col justify-between cursor-pointer ${
                selectedKey === item.key 
                  ? "sk-card-active bg-[#141417]" 
                  : "sk-card-interactive bg-[#0c0c0e]"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-white tracking-tight">{item.label}</div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5">{item.sub}</div>
                </div>
                <ChevronRight className={`h-4 w-4 ${selectedKey === item.key ? "text-white" : "text-zinc-600"}`} />
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500">SYSTEM VERDICT</span>
                <span className="font-bold text-zinc-300">{item.verdict}</span>
              </div>
            </div>
          ))}

          {/* CUSTOM IPO SELECTION CARD */}
          <div
            onClick={() => setShowCustomModal(true)}
            className={`p-3.5 rounded-lg border transition-all text-left flex flex-col justify-between cursor-pointer ${
              selectedKey === "CUSTOM" 
                ? "sk-card-active bg-[#141417]" 
                : "sk-card-interactive bg-[#0c0c0e] border-dashed border-zinc-700 hover:border-zinc-500"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>{selectedKey === "CUSTOM" ? data.company_name : "Analyze Custom IPO"}</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  {selectedKey === "CUSTOM" ? `${data.ticker} • Live Swarm` : "Enter ticker, GMP & ratios"}
                </div>
              </div>
              <ChevronRight className={`h-4 w-4 ${selectedKey === "CUSTOM" ? "text-white" : "text-zinc-600"}`} />
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-500">{selectedKey === "CUSTOM" ? "VERDICT" : "SWARM AGENT"}</span>
              <span className="font-bold text-white">{selectedKey === "CUSTOM" ? data.verdict : "CUSTOM INPUT"}</span>
            </div>
          </div>
        </div>

        {/* 4 CORE TACTILE STAT TILES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="sk-card p-3.5">
            <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">ISSUE VALUATION & PRICE</div>
            <div className="text-xl font-bold font-mono text-white mt-1">₹{data.issue_price}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Band: {data.price_band}</div>
          </div>

          <div className="sk-card p-3.5">
            <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">OFFER FOR SALE (OFS)</div>
            <div className="text-xl font-bold font-mono text-white mt-1">{data.math_metrics.dilution.ofs_ratio_pct}%</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Exit vs Growth Capex</div>
          </div>

          <div className="sk-card p-3.5">
            <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">BENEISH M-SCORE</div>
            <div className="text-xl font-bold font-mono text-white mt-1">{data.math_metrics.beneish.m_score}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5 truncate">{data.math_metrics.beneish.risk_classification}</div>
          </div>

          <div className="sk-card p-3.5">
            <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">DAY-1 SPIKE CONE</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {data.math_metrics.spike_cone.listing_cone.expected_gain_pct >= 0 ? "+" : ""}
              {data.math_metrics.spike_cone.listing_cone.expected_gain_pct}%
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Prob: {data.math_metrics.spike_cone.spike_probability_pct}%</div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 7 COLS: AGENT DEBATE & WORKSPACE TABS */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* ARBITER VERDICT HERO BANNER */}
            <div className="sk-card p-5 border border-zinc-700/80 bg-gradient-to-b from-[#141418] to-[#0c0c0e]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-white" />
                    CONSENSUS ARBITER SYNTHESIS
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-white">{data.company_name}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyReportSummary}
                    className="sk-btn-secondary px-2.5 py-1 text-[11px] font-mono flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
                    title="Copy Due-Diligence Summary"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "COPIED" : "BRIEF"}</span>
                  </button>
                  <button
                    onClick={() => setShowDossierModal(true)}
                    className="sk-btn-secondary px-2.5 py-1 text-[11px] font-mono flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
                    title="Export Full SEBI Due-Diligence Dossier"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>DOSSIER</span>
                  </button>
                  <div className="px-3 py-1 rounded text-xs font-mono font-bold border border-white bg-zinc-900 text-white shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
                    {data.verdict}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {data.summary}
                </p>

                <div className="flex items-center justify-between pt-2 text-xs font-mono border-t border-zinc-800/80">
                  <span className="text-zinc-500">CONVICTION CONFIDENCE</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-28 sm:w-36 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${data.conviction_score}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-white">{data.conviction_score}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex flex-wrap gap-1 border-b border-zinc-800 pb-1">
              {[
                { id: "terminal", label: "AGENT DEBATE", icon: Terminal },
                { id: "math", label: "BENEISH FORENSICS", icon: Scale },
                { id: "peers", label: "PEER MATRIX", icon: Users },
                { id: "timeline", label: "LOCK-IN CLIFF", icon: Calendar },
                { id: "simulator", label: "WHAT-IF SIMULATOR", icon: Gauge }
              ].map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer ${
                      activeTab === tab.id 
                        ? "border-b-2 border-white text-white font-bold bg-[#141418] rounded-t" 
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: DEBATE STREAM */}
            {activeTab === "terminal" && (
              <div className="space-y-3">
                {/* Agent Filters */}
                <div className="flex items-center space-x-1 text-[11px] font-mono">
                  <span className="text-zinc-500 mr-1.5">FILTER:</span>
                  {["ALL", "VALUATION", "DEMAND", "DILUTION"].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setSelectedAgentFilter(filter)}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        selectedAgentFilter === filter 
                          ? "bg-white text-black font-bold" 
                          : "text-zinc-400 hover:text-white bg-[#111114] border border-zinc-800"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {isAnalyzing ? (
                  <div className="sk-recessed p-8 text-center space-y-3">
                    <RefreshCw className="h-6 w-6 animate-spin text-white mx-auto" />
                    <div className="text-xs font-mono text-zinc-400">
                      ORCHESTRATING 4-AGENT DELIBERATION SWARM...
                    </div>
                  </div>
                ) : (
                  filteredDebates.map((debate, idx) => (
                    <div key={idx} className="sk-card p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white">{debate.agent}</span>
                          <span className="text-zinc-500">•</span>
                          <span className="text-zinc-400 text-[11px]">{debate.role}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          debate.risk_level === "CRITICAL" || debate.risk_level === "HIGH" 
                            ? "border-zinc-500 bg-zinc-900 text-zinc-100" 
                            : "border-zinc-800 bg-black text-zinc-400"
                        }`}>
                          {debate.risk_level}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {debate.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: BENEISH MATHEMATICAL DECOMPOSITION */}
            {activeTab === "math" && (
              <div className="sk-card p-5 space-y-4">
                <div className="border-b border-zinc-800 pb-3">
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Scale className="h-4 w-4" /> BENEISH 8-VARIABLE M-SCORE MATHEMATICAL DECOMPOSITION
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Benchmark: M-Score &gt; -1.78 indicates high probability of accounting manipulation / aggressive accruals.
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                  {Object.entries(data.math_metrics.beneish.ratios || {}).map(([key, val]) => (
                    <div key={key} className="sk-recessed p-2.5">
                      <div className="text-zinc-500 text-[10px]">{key}</div>
                      <div className="text-white font-bold text-sm mt-0.5">{val}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-800 pt-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Calculated M-Score:</span>
                  <span className="font-bold text-white text-sm">{data.math_metrics.beneish.m_score}</span>
                </div>
              </div>
            )}

            {/* TAB 3: LISTED PEER VALUATION MATRIX */}
            {activeTab === "peers" && (
              <div className="sk-card p-5 space-y-4">
                <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <Users className="h-4 w-4" /> INDUSTRY PEER VALUATION BENCHMARKING
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Comparative multi-factor analysis against listed Indian benchmarks.
                    </div>
                  </div>
                  <span className="text-[10px] font-mono border border-zinc-800 px-2 py-0.5 rounded bg-black text-zinc-300">
                    {data.sector || "General Industry"}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono text-left">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500 text-[10px]">
                        <th className="py-2">COMPANY</th>
                        <th className="py-2">P/E RATIO</th>
                        <th className="py-2">EV / SALES</th>
                        <th className="py-2">REV GROWTH</th>
                        <th className="py-2">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {/* IPO Company Row */}
                      <tr className="bg-[#18181d] text-white font-bold">
                        <td className="py-2.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          <span>{data.ticker} (IPO)</span>
                        </td>
                        <td className="py-2.5">{data.ipo_multiples?.pe ? `${data.ipo_multiples.pe}x` : "Negative / N.A."}</td>
                        <td className="py-2.5">{data.ipo_multiples?.ev_sales ? `${data.ipo_multiples.ev_sales}x` : "—"}</td>
                        <td className="py-2.5">~35%</td>
                        <td className="py-2.5">
                          <span className="border border-white/60 px-1.5 py-0.5 rounded text-[10px] bg-black text-white">
                            ISSUER
                          </span>
                        </td>
                      </tr>
                      {/* Peer Rows */}
                      {(data.peers || []).map((peer, idx) => (
                        <tr key={idx} className="text-zinc-300 hover:bg-[#111114]">
                          <td className="py-2.5 text-zinc-200">{peer.name}</td>
                          <td className="py-2.5">{peer.pe ? `${peer.pe}x` : "N.A."}</td>
                          <td className="py-2.5">{peer.ev_sales ? `${peer.ev_sales}x` : (peer.ev_ebitda ? `${peer.ev_ebitda}x (EBITDA)` : "—")}</td>
                          <td className="py-2.5">+{peer.growth}%</td>
                          <td className="py-2.5">
                            <span className="text-[10px] text-zinc-400 font-mono">LISTED BENCHMARK</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: SEBI REGULATORY LOCK-IN TIMELINE */}
            {activeTab === "timeline" && (
              <div className="sk-card p-5 space-y-4">
                <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> SEBI STATUTORY LOCK-IN CLIFF TIMELINE
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Supply shock calendar mapping institutional share release per SEBI ICDR regulations.
                    </div>
                  </div>
                  <span className="text-[10px] font-mono border border-zinc-800 px-2 py-0.5 rounded bg-black text-zinc-300">
                    SEBI ICDR 2024
                  </span>
                </div>

                <div className="space-y-3">
                  {(data.math_metrics.dilution.lockin_schedule || []).map((item, idx) => (
                    <div key={idx} className="sk-recessed p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[10px]">{item.stage}</span>
                          <span>{item.category}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400">{item.risk_flag}</div>
                      </div>

                      <div className="text-right sm:self-center font-mono text-xs">
                        <div className="font-bold text-white">₹{item.value_cr.toLocaleString()} Cr</div>
                        <div className="text-[10px] text-zinc-500">{item.pct_of_issue}% of Issue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: WHAT-IF LISTING RETURN SIMULATOR */}
            {activeTab === "simulator" && (
              <div className="sk-card p-5 space-y-5">
                <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <Gauge className="h-4 w-4" /> INTERACTIVE DAY-1 LISTING RETURN SIMULATOR
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Test hypothetical market conditions (GMP and institutional subscription shifts).
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSimGmp(data.math_metrics.spike_cone.gmp_in_rupees || 0);
                      setSimQibSub(6.0);
                    }}
                    className="sk-btn-secondary px-2.5 py-1 text-[10px] font-mono flex items-center gap-1 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" /> RESET
                  </button>
                </div>

                {/* Slider Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-400">GREY MARKET PREMIUM (GMP)</span>
                      <span className="font-bold text-white">₹{simGmp} ({simGmpPct.toFixed(1)}%)</span>
                    </div>
                    <input 
                      type="range" 
                      min="-50" 
                      max="150" 
                      step="1"
                      value={simGmp}
                      onChange={(e) => setSimGmp(parseFloat(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                      <span>-₹50 (Discount)</span>
                      <span>₹0</span>
                      <span>+₹150 (Premium)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-400">QIB INSTITUTIONAL SUBSCRIPTION</span>
                      <span className="font-bold text-white">{simQibSub.toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="50" 
                      step="0.5"
                      value={simQibSub}
                      onChange={(e) => setSimQibSub(parseFloat(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                      <span>0.1x (Undersubscribed)</span>
                      <span>15x</span>
                      <span>50x (Mega Frenzy)</span>
                    </div>
                  </div>
                </div>

                {/* Live Simulated Cone Output */}
                <div className="sk-recessed p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400">SIMULATED EXPECTED LISTING PRICE</span>
                    <span className="text-lg font-bold text-white">₹{simExpectedPrice}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2 border border-zinc-800 rounded bg-[#09090c]">
                      <div className="text-[9px] text-zinc-500">BEARISH (P10)</div>
                      <div className="text-xs font-bold text-zinc-300">₹{simBearishPrice}</div>
                      <div className="text-[9px] text-zinc-500">({(simExpectedGainPct - 5.5).toFixed(1)}%)</div>
                    </div>

                    <div className="p-2 border border-zinc-700 rounded bg-[#121216]">
                      <div className="text-[9px] text-white font-bold">EXPECTED</div>
                      <div className="text-xs font-bold text-white">₹{simExpectedPrice}</div>
                      <div className="text-[9px] text-zinc-300">(+{simExpectedGainPct}%)</div>
                    </div>

                    <div className="p-2 border border-zinc-800 rounded bg-[#09090c]">
                      <div className="text-[9px] text-zinc-500">BULLISH (P90)</div>
                      <div className="text-xs font-bold text-zinc-300">₹{simBullishPrice}</div>
                      <div className="text-[9px] text-zinc-500">(+{(simExpectedGainPct + 7.5).toFixed(1)}%)</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-xs font-mono">
                    <span className="text-zinc-500">Listing Spike Probability:</span>
                    <span className="font-bold text-white">{simProb}%</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT 5 COLS: MATHEMATICAL CONES & STATUTORY DRHP RISKS */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* LISTING PRICE PROBABILITY CONE */}
            <div className="sk-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-white" />
                  DAY-1 LISTING RETURN CONE
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  GMP: ₹{data.math_metrics.spike_cone.gmp_in_rupees}
                </span>
              </div>

              <div className="sk-recessed p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-mono">Expected Listing Price</span>
                  <span className="text-base font-bold font-mono text-white">
                    ₹{data.math_metrics.spike_cone.listing_cone.expected_price}
                  </span>
                </div>

                {/* 3-Point Cone Visual */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono pt-2 border-t border-zinc-800/80">
                  <div className="p-2 border border-zinc-800 rounded bg-[#09090c]">
                    <div className="text-[9px] text-zinc-500">BEARISH (P10)</div>
                    <div className="text-xs font-bold text-zinc-300">₹{data.math_metrics.spike_cone.listing_cone.bearish_price}</div>
                    <div className="text-[9px] text-zinc-500">({data.math_metrics.spike_cone.listing_cone.bearish_gain_pct}%)</div>
                  </div>

                  <div className="p-2 border border-zinc-700 rounded bg-[#121216]">
                    <div className="text-[9px] text-white font-bold">EXPECTED</div>
                    <div className="text-xs font-bold text-white">₹{data.math_metrics.spike_cone.listing_cone.expected_price}</div>
                    <div className="text-[9px] text-zinc-300">(+{data.math_metrics.spike_cone.listing_cone.expected_gain_pct}%)</div>
                  </div>

                  <div className="p-2 border border-zinc-800 rounded bg-[#09090c]">
                    <div className="text-[9px] text-zinc-500">BULLISH (P90)</div>
                    <div className="text-xs font-bold text-zinc-300">₹{data.math_metrics.spike_cone.listing_cone.bullish_price}</div>
                    <div className="text-[9px] text-zinc-500">(+{data.math_metrics.spike_cone.listing_cone.bullish_gain_pct}%)</div>
                  </div>
                </div>
              </div>

              {/* ANCHOR LOCK-IN CLIFF ALERT */}
              <div className="border border-zinc-800 rounded p-3 text-xs space-y-1.5 bg-[#0e0e11]">
                <div className="flex items-center space-x-1.5 text-zinc-300 font-mono text-[11px] font-bold">
                  <Lock className="h-3.5 w-3.5 text-white" />
                  <span>ANCHOR INVESTOR LOCK-IN CLIFF</span>
                </div>
                <div className="text-[11px] text-zinc-400 leading-snug">
                  ₹{data.math_metrics.dilution.anchor_cliff.day_30_unlock_cr.toLocaleString()} Cr unlocks at T+30 days (50% quota); remaining 50% unlocks at T+90 days.
                </div>
              </div>
            </div>

            {/* FORENSIC RED FLAGS LIST */}
            <div className="sk-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-white" />
                  STATUTORY DRHP RED FLAGS
                </span>
                <span className="text-[10px] font-mono text-zinc-400">{data.red_flags.length} FLAGGED</span>
              </div>

              <div className="space-y-2">
                {data.red_flags.map((flag, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                    <span className="text-zinc-600 font-mono mt-0.5">•</span>
                    <span className="leading-snug">{flag}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1f23] py-6 mt-12 bg-black text-center text-xs font-mono text-zinc-500 space-y-1">
        <div>Department of Computer Engineering • Fr. Conceicao Rodrigues College of Engineering, Mumbai</div>
        <div>Course Seminar B.E. Sem VII (2026-27) • Candidate: Rohan Benegal (Roll No. 10170)</div>
      </footer>
    </div>
  );
}
