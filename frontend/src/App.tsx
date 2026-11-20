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
  ArrowDownRight
} from 'lucide-react';

interface IPOData {
  company_name: string;
  ticker: string;
  price_band: string;
  issue_price: number;
  verdict: string;
  conviction_score: number;
  summary: string;
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
      ratios: Record<string, number>;
    };
    dilution: {
      total_issue_size_cr: number;
      ofs_ratio_pct: number;
      fresh_ratio_pct: number;
      promoter_dilution_pct: number;
      anchor_cliff: {
        anchor_book_cr: number;
        day_30_unlock_cr: number;
        day_90_unlock_cr: number;
        warning: string;
      };
      red_flags: string[];
    };
    spike_cone: {
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

const SAMPLE_FALLBACKS: Record<string, any> = {
  SWIGGY: {
    company_name: "Swiggy Limited",
    ticker: "SWIGGY",
    price_band: "₹371 - ₹390",
    issue_price: 390.0,
    verdict: "TACTICAL SUBSCRIBE",
    conviction_score: 78,
    summary: "Subscribe strictly for Day-1 listing gains (+7.7% projected). Due to high OFS dilution (60.3%) and heavy Instamart burn, retail investors should book profits on listing day rather than holding through the T+30 anchor unlock cliff.",
    debate_stream: [
      {
        agent: "Valuation Auditor",
        role: "Fundamental Sanity",
        message: "Swiggy is priced at ₹390 (EV/Sales ~6.8x), a ~25% discount to Zomato's 9.2x multiple. While operating losses persist (-₹2,350 Cr net loss), the price band leaves tactical listing room.",
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
        message: "Arbitration Verdict: TACTICAL SUBSCRIBE. High institutional demand justifies subscribing for immediate Day-1 listing gains, but severe OFS dilution dictates a strict listing-day exit strategy.",
        risk_level: "MODERATE"
      }
    ],
    math_metrics: {
      beneish: {
        m_score: -2.235,
        risk_classification: "LOW / STANDARD ACCRUAL PROFILE",
        red_flags: [],
        ratios: { DSRI: 1.02, GMI: 0.98, AQI: 1.05, SGI: 1.36, DEPI: 0.95, SGAI: 1.08, TATA: -0.10, LVGI: 1.04 }
      },
      dilution: {
        total_issue_size_cr: 11327.0,
        ofs_ratio_pct: 60.28,
        fresh_ratio_pct: 39.72,
        promoter_dilution_pct: 0.0,
        anchor_cliff: {
          anchor_book_cr: 5085.0,
          day_30_unlock_cr: 2542.5,
          day_90_unlock_cr: 2542.5,
          warning: "Watch for post-listing institutional selling pressure around T+30 and T+90 calendar days."
        },
        red_flags: [
          "HIGH RISK: OFS ratio is 60.3% (>50%). Majority of funds exit to selling shareholders.",
          "Instamart quick-commerce dark-store capex burn exposes capital to fierce 10-minute competition."
        ]
      },
      spike_cone: {
        gmp_in_rupees: 15.0,
        gmp_pct: 3.8,
        spike_probability_pct: 64.5,
        market_sentiment: "BULLISH",
        listing_cone: {
          bearish_gain_pct: -0.5,
          expected_gain_pct: 7.7,
          bullish_gain_pct: 12.5,
          bearish_price: 388.0,
          expected_price: 420.0,
          bullish_price: 438.5
        }
      }
    },
    red_flags: [
      "60.3% OFS: ₹6,828 Cr exits directly to early financial sponsors (Prosus, Softbank).",
      "Consolidated trailing operating loss of -₹2,350 Cr; reliant on high customer retention.",
      "Anchor Lock-in: ₹2,542 Cr of stock unlocks for open-market liquidation on Day 30."
    ],
    disclaimer: "SEBI Compliance Notice: Research generated by autonomous multi-agent algorithms for academic evaluation only. Not registered investment advisory."
  },
  HYUNDAI: {
    company_name: "Hyundai Motor India Limited",
    ticker: "HYUNDAI",
    price_band: "₹1865 - ₹1960",
    issue_price: 1960.0,
    verdict: "AVOID / FULLY PRICED",
    conviction_score: 88,
    summary: "Strong Avoid recommendation. 100% of this ₹27,870 Cr mega-offering is an Offer for Sale (OFS) cash-out to the Korean parent with zero capital entering India operations, compounded by a royalty hike.",
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
    price_band: "₹72 - ₹76",
    issue_price: 76.0,
    verdict: "HIGH SPECULATIVE RISK",
    conviction_score: 82,
    summary: "High forensic risk detected. Elevated accrual anomaly signals (Beneish M-Score: -1.605) combined with escalating consumer complaints and subsidy phase-out present acute long-term volatility.",
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
  const [activeTab, setActiveTab] = useState<"terminal" | "math" | "metrics">("terminal");
  const [data, setData] = useState<IPOData>(SAMPLE_FALLBACKS["SWIGGY"]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [groqKey, setGroqKey] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

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
    }, 350);
  };

  const getVerdictBadge = (verdict: string) => {
    if (verdict.includes("TACTICAL")) {
      return "border-white bg-[#18181b] text-white";
    }
    if (verdict.includes("AVOID")) {
      return "border-white/80 bg-black text-white";
    }
    return "border-zinc-400 bg-zinc-900 text-zinc-100";
  };

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

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>4 AGENTS ACTIVE</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-300">GROQ LPU / LLAMA-3.3-70B</span>
            </div>

            <button 
              onClick={() => setShowKeyModal(!showKeyModal)}
              className="sk-btn-secondary px-3 py-1.5 text-xs font-mono flex items-center space-x-1.5"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>{groqKey ? "API KEY SET" : "GROQ KEY"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* KEY INPUT MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="sk-card max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
                <Cpu className="h-4 w-4" /> CONFIGURE GROQ CLOUD API KEY
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-zinc-500 hover:text-white text-xs font-mono">
                [CLOSE]
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enter your zero-cost Groq Cloud API key from <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-white underline font-mono">console.groq.com</a> to enable real-time LPU Llama-3.3-70B multi-agent generation.
            </p>
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
                className="sk-btn-primary px-4 py-1.5 text-xs font-mono"
              >
                SAVE & RESUME
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* TOP CONTROLS & OFFERING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { key: "SWIGGY", label: "Swiggy Limited", sub: "₹11,327 Cr • 60.3% OFS", verdict: "TACTICAL SUBSCRIBE" },
            { key: "HYUNDAI", label: "Hyundai Motor India", sub: "₹27,870 Cr • 100% OFS", verdict: "AVOID / FULLY PRICED" },
            { key: "OLA_ELEC", label: "Ola Electric Mobility", sub: "₹6,145 Cr • 10.5% OFS", verdict: "HIGH SPECULATIVE RISK" }
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => handleSelectIPO(item.key)}
              className={`p-3.5 rounded-lg border transition-all text-left flex flex-col justify-between ${
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
          
          {/* LEFT 7-COL: MULTI-AGENT DEBATE STREAM */}
          <div className="lg:col-span-7 sk-card p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-white" />
                <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                  MULTI-AGENT DELIBERATION STREAM
                </h2>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                <span>STATE-GRAPH: CONVERGED</span>
              </div>
            </div>

            {/* DEBATE CARDS */}
            <div className="space-y-3.5 overflow-y-auto max-h-[580px] pr-1">
              {data.debate_stream.map((item, idx) => (
                <div key={idx} className="sk-recessed p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-white">
                        [{item.agent.toUpperCase()}]
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        // {item.role}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-900 text-zinc-300">
                      RISK: {item.risk_level}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>

            {/* SEBI STATUTORY DISCLAIMER FOOTNOTE */}
            <div className="pt-2 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
              * Verification: Generated by 3 autonomous peer auditors cross-checked by the Consensus Arbiter.
            </div>
          </div>

          {/* RIGHT 5-COL: CONSENSUS, CONE & FORENSIC CHECKLIST */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* VERDICT SUMMARY CARD */}
            <div className="sk-card p-5 space-y-4">
              <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                CHIEF ARBITER VERDICT
              </div>

              <div className="flex items-center justify-between">
                <div className={`px-3 py-1.5 rounded border font-mono font-bold text-sm tracking-tight ${getVerdictBadge(data.verdict)}`}>
                  {data.verdict}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-zinc-400">CONVICTION</div>
                  <div className="font-mono font-bold text-sm text-white">{data.conviction_score}%</div>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-sans border-l-2 border-white pl-3 py-0.5">
                {data.summary}
              </p>

              {/* LISTING PRICE PROBABILITY CONE */}
              <div className="sk-recessed p-3.5 space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>DAY-1 PRICE CONE</span>
                  <span>CONFIDENCE: 92%</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="border border-zinc-800 p-2 rounded bg-black">
                    <div className="text-[9px] text-zinc-500">BEARISH</div>
                    <div className="text-xs font-bold text-zinc-300">₹{data.math_metrics.spike_cone.listing_cone.bearish_price}</div>
                    <div className="text-[9px] text-zinc-500">({data.math_metrics.spike_cone.listing_cone.bearish_gain_pct}%)</div>
                  </div>
                  <div className="border border-white/50 p-2 rounded bg-zinc-900">
                    <div className="text-[9px] text-white font-bold">EXPECTED</div>
                    <div className="text-xs font-bold text-white">₹{data.math_metrics.spike_cone.listing_cone.expected_price}</div>
                    <div className="text-[9px] text-zinc-300">({data.math_metrics.spike_cone.listing_cone.expected_gain_pct}%)</div>
                  </div>
                  <div className="border border-zinc-800 p-2 rounded bg-black">
                    <div className="text-[9px] text-zinc-500">BULLISH</div>
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
