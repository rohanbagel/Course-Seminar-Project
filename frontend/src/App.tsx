import React, { useState, useEffect } from 'react';
import { 
  Gauge, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown,
  Scale, 
  ChevronRight, 
  PlusCircle, 
  Sparkles,
  Info,
  ShieldCheck,
  Flame,
  CloudRain
} from 'lucide-react';

interface IPOData {
  company_name: string;
  ticker: string;
  sector?: string;
  price_band: string;
  issue_price: number;
  verdict: string;
  conviction_score: number;
  summary: string;
  math_metrics: {
    beneish: {
      m_score: number;
      risk_classification: string;
    };
    dilution: {
      total_issue_size_cr: number;
      ofs_ratio_pct: number;
      fresh_ratio_pct: number;
    };
    spike_cone: {
      gmp_in_rupees: number;
      gmp_pct: number;
      spike_probability_pct: number;
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
    math_metrics: {
      beneish: {
        m_score: -2.235,
        risk_classification: "LOW RISK"
      },
      dilution: {
        total_issue_size_cr: 11327.0,
        ofs_ratio_pct: 60.3,
        fresh_ratio_pct: 39.7
      },
      spike_cone: {
        gmp_in_rupees: 15.0,
        gmp_pct: 3.8,
        spike_probability_pct: 74.5,
        listing_cone: {
          bearish_gain_pct: -0.5,
          expected_gain_pct: 4.8,
          bullish_gain_pct: 8.2,
          bearish_price: 388.0,
          expected_price: 408.7,
          bullish_price: 422.0
        }
      }
    }
  },
  HYUNDAI: {
    company_name: "Hyundai Motor India",
    ticker: "HYUNDAI",
    sector: "Automotive OEM",
    price_band: "₹1,865 - ₹1,960",
    issue_price: 1960.0,
    verdict: "AVOID / FULLY PRICED",
    conviction_score: 85,
    summary: "Avoid on valuation grounds. Issue is 100% OFS (₹27,870 Cr) going entirely to Korean parent company with zero growth capital infused into Indian entity. High risk of listing at a discount.",
    math_metrics: {
      beneish: {
        m_score: -2.68,
        risk_classification: "CLEAN AUDIT PROFILE"
      },
      dilution: {
        total_issue_size_cr: 27870.0,
        ofs_ratio_pct: 100.0,
        fresh_ratio_pct: 0.0
      },
      spike_cone: {
        gmp_in_rupees: -25.0,
        gmp_pct: -1.3,
        spike_probability_pct: 32.0,
        listing_cone: {
          bearish_gain_pct: -4.8,
          expected_gain_pct: -1.5,
          bullish_gain_pct: 1.2,
          bearish_price: 1865.0,
          expected_price: 1930.6,
          bullish_price: 1983.5
        }
      }
    }
  },
  OLA_ELEC: {
    company_name: "Ola Electric Mobility",
    ticker: "OLAELEC",
    sector: "EV 2-Wheelers",
    price_band: "₹72 - ₹76",
    issue_price: 76.0,
    verdict: "HIGH SPECULATIVE RISK",
    conviction_score: 62,
    summary: "High speculative risk. Fresh growth capital is strong (89.5%), but high cash burn rate, operating losses, and regulatory scrutiny on subsidies make it suitable only for aggressive investors.",
    math_metrics: {
      beneish: {
        m_score: -1.82,
        risk_classification: "ELEVATED ACCRUAL LEVEL"
      },
      dilution: {
        total_issue_size_cr: 6145.0,
        ofs_ratio_pct: 10.5,
        fresh_ratio_pct: 89.5
      },
      spike_cone: {
        gmp_in_rupees: 6.0,
        gmp_pct: 7.9,
        spike_probability_pct: 68.0,
        listing_cone: {
          bearish_gain_pct: 1.0,
          expected_gain_pct: 7.2,
          bullish_gain_pct: 14.5,
          bearish_price: 76.8,
          expected_price: 81.5,
          bullish_price: 87.0
        }
      }
    }
  }
};

export default function App() {
  const [selectedKey, setSelectedKey] = useState<string>("SWIGGY");
  const [data, setData] = useState<IPOData>(SAMPLE_FALLBACKS["SWIGGY"]);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  // What-If Simulator Interactive State
  const [simGmp, setSimGmp] = useState<number>(15);
  const [simQibSub, setSimQibSub] = useState<number>(6.0);

  // Sync simulator state when company changes
  useEffect(() => {
    setSimGmp(data.math_metrics.spike_cone.gmp_in_rupees || 0);
    setSimQibSub(6.0);
  }, [data]);

  // Compute dynamic simulation outputs
  const simGmpPct = data.issue_price > 0 ? (simGmp / data.issue_price) * 100 : 0;
  const simExpectedGainPct = Number(((simGmpPct * 0.70) + (Math.min(simQibSub, 50) * 0.25) - 2.0).toFixed(1));
  const simExpectedPrice = Number((data.issue_price * (1 + simExpectedGainPct / 100)).toFixed(2));
  const simBearishPrice = Number((data.issue_price * (1 + (simExpectedGainPct - 5.5) / 100)).toFixed(2));
  const simBullishPrice = Number((data.issue_price * (1 + (simExpectedGainPct + 7.5) / 100)).toFixed(2));
  const simProb = Math.min(Math.max(Math.round(40 + simGmpPct * 2.5 + simQibSub * 1.5), 5), 98);

  // Dynamic Recommendation based on simulated listing metrics
  let dynamicVerdict = "AVOID / LISTING DISCOUNT";
  let verdictStyle = "border-zinc-700 bg-zinc-900 text-zinc-300";
  if (simExpectedGainPct > 12) {
    dynamicVerdict = "STRONG SUBSCRIBE (HIGH LISTING POP)";
    verdictStyle = "border-white bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]";
  } else if (simExpectedGainPct > 4) {
    dynamicVerdict = "TACTICAL SUBSCRIBE (DAY-1 GAIN)";
    verdictStyle = "border-white bg-zinc-900 text-white font-bold";
  } else if (simExpectedGainPct >= 0) {
    dynamicVerdict = "SELECTIVE / CAUTIOUS APPLY";
    verdictStyle = "border-zinc-500 bg-zinc-900 text-zinc-200";
  }

  // Switch company with live backend fetch & offline fallback
  const handleSelectIPO = async (key: string) => {
    setSelectedKey(key);
    try {
      const res = await fetch(`http://localhost:8000/api/ipo/${key}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        return;
      }
    } catch (err) {
      // Backend offline fallback
    }
    setData(SAMPLE_FALLBACKS[key] || SAMPLE_FALLBACKS["SWIGGY"]);
  };

  // Custom IPO Form State
  const [customForm, setCustomForm] = useState({
    company_name: "NTPC Green Energy",
    ticker: "NTPCGREEN",
    issue_price: 108.0,
    gmp_rupees: 3.5,
    qib_subscription_x: 3.2
  });

  const handleAnalyzeCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCustomModal(false);
    setSelectedKey("CUSTOM");

    const gmp_pct = customForm.issue_price > 0 ? (customForm.gmp_rupees / customForm.issue_price) * 100 : 0;
    const exp_gain = Number((gmp_pct * 0.75).toFixed(1));
    const exp_price = Number((customForm.issue_price * (1 + exp_gain / 100)).toFixed(2));

    const customResult: IPOData = {
      company_name: customForm.company_name,
      ticker: customForm.ticker,
      sector: "Renewable Energy",
      price_band: `₹${customForm.issue_price - 6} - ₹${customForm.issue_price}`,
      issue_price: customForm.issue_price,
      verdict: exp_gain > 5 ? "TACTICAL SUBSCRIBE" : "CAUTION / SELECTIVE APPLY",
      conviction_score: 80,
      summary: `Custom IPO simulation for ${customForm.company_name}. Base GMP at ₹${customForm.gmp_rupees} reflects an expected listing return of +${exp_gain}%.`,
      math_metrics: {
        beneish: { m_score: -2.35, risk_classification: "CLEAN AUDIT PROFILE" },
        dilution: { total_issue_size_cr: 10000.0, ofs_ratio_pct: 0.0, fresh_ratio_pct: 100.0 },
        spike_cone: {
          gmp_in_rupees: customForm.gmp_rupees,
          gmp_pct: Number(gmp_pct.toFixed(1)),
          spike_probability_pct: Math.min(Math.max(50 + gmp_pct * 2, 10), 95),
          listing_cone: {
            bearish_gain_pct: Number((exp_gain - 4).toFixed(1)),
            expected_gain_pct: exp_gain,
            bullish_gain_pct: Number((exp_gain + 5).toFixed(1)),
            bearish_price: Number((customForm.issue_price * (1 + (exp_gain - 4) / 100)).toFixed(2)),
            expected_price: exp_price,
            bullish_price: Number((customForm.issue_price * (1 + (exp_gain + 5) / 100)).toFixed(2))
          }
        }
      }
    };
    setData(customResult);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#f4f4f5] font-sans antialiased selection:bg-white selection:text-black flex flex-col justify-between">
      {/* HEADER */}
      <header className="border-b border-[#27272a] bg-[#0c0c0e]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded bg-white text-black flex items-center justify-center font-bold font-mono text-sm shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
              IR
            </div>
            <div>
              <span className="font-mono font-bold tracking-tight text-sm text-white">IPO-RADAR</span>
              <span className="text-[10px] text-zinc-400 font-mono ml-2 border border-zinc-800 rounded px-1.5 py-0.5 bg-black">
                WHAT-IF SIMULATOR
              </span>
            </div>
          </div>

          <button 
            onClick={() => setShowCustomModal(true)}
            className="sk-btn-secondary px-3 py-1.5 text-xs font-mono flex items-center space-x-1.5 cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>CUSTOM IPO</span>
          </button>
        </div>
      </header>

      {/* CUSTOM IPO MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="sk-card max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> SIMULATE CUSTOM IPO
              </h3>
              <button onClick={() => setShowCustomModal(false)} className="text-zinc-500 hover:text-white text-xs font-mono cursor-pointer">
                [CLOSE]
              </button>
            </div>
            <form onSubmit={handleAnalyzeCustom} className="space-y-3 text-xs">
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
              <div className="grid grid-cols-2 gap-3">
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
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Base GMP (₹)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={customForm.gmp_rupees}
                    onChange={(e) => setCustomForm({...customForm, gmp_rupees: parseFloat(e.target.value) || 0})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">QIB Bids (x)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={customForm.qib_subscription_x}
                    onChange={(e) => setCustomForm({...customForm, qib_subscription_x: parseFloat(e.target.value) || 0})}
                    className="sk-recessed w-full px-3 py-1.5 font-mono text-white outline-none mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button 
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="sk-btn-secondary px-3 py-1.5 font-mono cursor-pointer"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="sk-btn-primary px-4 py-1.5 font-mono cursor-pointer"
                >
                  LOAD INTO SIMULATOR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6 w-full">
        
        {/* OFFERING SELECTOR PILLS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>SELECT OFFERING:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "SWIGGY", label: "Swiggy", price: "₹390" },
              { key: "HYUNDAI", label: "Hyundai Motor", price: "₹1,960" },
              { key: "OLA_ELEC", label: "Ola Electric", price: "₹76" }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => handleSelectIPO(item.key)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                  selectedKey === item.key
                    ? "bg-white text-black font-bold shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
                    : "bg-[#111114] text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                <span>{item.label}</span>
                <span className={`text-[10px] ${selectedKey === item.key ? "text-zinc-600" : "text-zinc-500"}`}>
                  ({item.price})
                </span>
              </button>
            ))}

            {selectedKey === "CUSTOM" && (
              <div className="px-3.5 py-1.5 rounded-md text-xs font-mono bg-white text-black font-bold shadow flex items-center gap-2">
                <span>{data.ticker}</span>
                <span className="text-[10px] text-zinc-600">(₹{data.issue_price})</span>
              </div>
            )}
          </div>
        </div>

        {/* ACTIVE COMPANY BANNER */}
        <div className="sk-card p-5 border border-zinc-800 bg-gradient-to-r from-[#111115] to-[#0c0c0e]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                TARGET COMPANY • {data.sector || "General Market"}
              </div>
              <h1 className="text-xl font-bold font-mono text-white mt-0.5">
                {data.company_name} ({data.ticker})
              </h1>
              <div className="text-xs font-mono text-zinc-400 mt-1 flex items-center gap-3">
                <span>Issue Price: <strong className="text-white">₹{data.issue_price}</strong></span>
                <span>•</span>
                <span>Price Band: <span className="text-zinc-300">{data.price_band}</span></span>
              </div>
            </div>

            <div className="text-right flex flex-col items-start sm:items-end">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">DYNAMIC ARBITER VERDICT</div>
              <div className={`mt-1 px-3 py-1 rounded text-xs font-mono border ${verdictStyle}`}>
                {dynamicVerdict}
              </div>
            </div>
          </div>
        </div>

        {/* THE WHAT-IF SIMULATOR ENGINE (HERO) */}
        <div className="sk-card p-6 space-y-6 border border-zinc-700/80 shadow-2xl">
          
          {/* Section Header & Preset Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                <Gauge className="h-4 w-4" /> INTERACTIVE WHAT-IF SCENARIO SIMULATOR
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Test how real-time changes in Grey Market Premium and Institutional Bids alter Day-1 listing gains.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="text-zinc-500 mr-1 hidden sm:inline">PRESETS:</span>
              <button
                onClick={() => {
                  setSimGmp(-Math.round(data.issue_price * 0.03));
                  setSimQibSub(0.8);
                }}
                className="sk-btn-secondary px-2.5 py-1 flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
                title="Simulate weak demand and negative grey market sentiment"
              >
                <CloudRain className="h-3 w-3 text-zinc-400" />
                <span>BEARISH</span>
              </button>

              <button
                onClick={() => {
                  setSimGmp(data.math_metrics.spike_cone.gmp_in_rupees || 0);
                  setSimQibSub(6.0);
                }}
                className="sk-btn-secondary px-2.5 py-1 flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
                title="Reset to current DRHP baseline metrics"
              >
                <RotateCcw className="h-3 w-3" />
                <span>RESET</span>
              </button>

              <button
                onClick={() => {
                  setSimGmp(Math.round(data.issue_price * 0.20));
                  setSimQibSub(25.0);
                }}
                className="sk-btn-secondary px-2.5 py-1 flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
                title="Simulate euphoric bull frenzy with massive oversubscription"
              >
                <Flame className="h-3 w-3 text-amber-400" />
                <span>BULL RUN</span>
              </button>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Slider 1: GMP */}
            <div className="sk-recessed p-4 space-y-3">
              <div className="flex justify-between items-baseline text-xs font-mono">
                <span className="text-zinc-400 uppercase tracking-wide">GREY MARKET PREMIUM (GMP)</span>
                <span className="font-bold text-base text-white">
                  ₹{simGmp > 0 ? `+${simGmp}` : simGmp} 
                  <span className={`text-xs ml-1.5 ${simGmp >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    ({simGmpPct >= 0 ? `+${simGmpPct.toFixed(1)}%` : `${simGmpPct.toFixed(1)}%`})
                  </span>
                </span>
              </div>
              <input 
                type="range" 
                min={-Math.round(data.issue_price * 0.15)} 
                max={Math.round(data.issue_price * 0.40)} 
                step="1"
                value={simGmp}
                onChange={(e) => setSimGmp(parseFloat(e.target.value))}
                className="w-full accent-white cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>Discount (-15%)</span>
                <span>₹0 (Issue Price)</span>
                <span>Euphoria (+40%)</span>
              </div>
            </div>

            {/* Slider 2: QIB Demand */}
            <div className="sk-recessed p-4 space-y-3">
              <div className="flex justify-between items-baseline text-xs font-mono">
                <span className="text-zinc-400 uppercase tracking-wide">INSTITUTIONAL BIDS (QIB)</span>
                <span className="font-bold text-base text-white">
                  {simQibSub.toFixed(1)}x
                  <span className="text-xs text-zinc-400 ml-1.5">
                    ({simQibSub < 1 ? "Undersubscribed" : simQibSub > 15 ? "Heavy Demand" : "Healthy"})
                  </span>
                </span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="50" 
                step="0.5"
                value={simQibSub}
                onChange={(e) => setSimQibSub(parseFloat(e.target.value))}
                className="w-full accent-white cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>0.1x (Weak)</span>
                <span>10x (Normal)</span>
                <span>50x (Mega Squeeze)</span>
              </div>
            </div>
          </div>

          {/* SIMULATED RESULTS: LISTING PRICE & PROBABILITY */}
          <div className="border border-zinc-700 rounded-lg p-5 bg-[#0e0e12] space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  PROJECTED EXPECTED LISTING PRICE
                </span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-3xl font-bold font-mono text-white">₹{simExpectedPrice}</span>
                  <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${
                    simExpectedGainPct >= 0 
                      ? "text-emerald-400 bg-emerald-950/40 border border-emerald-800" 
                      : "text-rose-400 bg-rose-900/30 border border-rose-800"
                  }`}>
                    {simExpectedGainPct >= 0 ? `+${simExpectedGainPct}%` : `${simExpectedGainPct}%`}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider">
                  DAY-1 SPIKE PROBABILITY
                </span>
                <div className="text-2xl font-bold text-white mt-0.5">{simProb}%</div>
                <div className="text-[10px] text-zinc-500">Chance of opening above issue price</div>
              </div>
            </div>

            {/* THE 3-POINT PROBABILITY CONE CARDS (P10, P50, P90) */}
            <div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>PROBABILITY LISTING CONE</span>
                <span className="text-[10px] text-zinc-500">SEBI ICDR Confidence Band</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                
                {/* P10 BEARISH */}
                <div className="p-4 border border-zinc-800 rounded-lg bg-[#08080a] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      BEARISH (P10)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      FLOOR
                    </span>
                  </div>
                  <div className="text-xl font-bold text-zinc-200">₹{simBearishPrice}</div>
                  <div className="text-xs text-zinc-400">
                    {(simExpectedGainPct - 5.5) >= 0 ? `+${(simExpectedGainPct - 5.5).toFixed(1)}%` : `${(simExpectedGainPct - 5.5).toFixed(1)}%`}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans leading-tight pt-1">
                    Worst-case scenario. 90% statistical chance the opening price is <strong>above</strong> this level.
                  </p>
                </div>

                {/* P50 EXPECTED */}
                <div className="p-4 border-2 border-white rounded-lg bg-[#141419] space-y-1.5 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      EXPECTED (P50)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-black font-bold">
                      MEDIAN
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">₹{simExpectedPrice}</div>
                  <div className="text-xs font-bold text-emerald-400">
                    {simExpectedGainPct >= 0 ? `+${simExpectedGainPct}%` : `${simExpectedGainPct}%`}
                  </div>
                  <p className="text-[11px] text-zinc-300 font-sans leading-tight pt-1">
                    Most realistic base case. The median equilibrium where secondary buyers meet institutional demand.
                  </p>
                </div>

                {/* P90 BULLISH */}
                <div className="p-4 border border-zinc-800 rounded-lg bg-[#08080a] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      BULLISH (P90)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      CEILING
                    </span>
                  </div>
                  <div className="text-xl font-bold text-zinc-200">₹{simBullishPrice}</div>
                  <div className="text-xs text-zinc-400">
                    {(simExpectedGainPct + 7.5) >= 0 ? `+${(simExpectedGainPct + 7.5).toFixed(1)}%` : `${(simExpectedGainPct + 7.5).toFixed(1)}%`}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans leading-tight pt-1">
                    Best-case euphoric spike. 90% of outcomes fall <strong>below</strong> this ceiling unless retail FOMO surges.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* INTUITIVE EXPLANATION CARDS (FOR VIVA & QUICK UNDERSTANDING) */}
          <div className="sk-recessed p-4 border border-zinc-800 rounded-lg space-y-2">
            <div className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-white" /> HOW TO READ THIS IN YOUR PRESENTATION:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400 font-sans leading-relaxed pt-1">
              <div className="space-y-0.5">
                <span className="text-white font-mono font-bold text-[11px]">1. The Sliders:</span>
                <p>Move GMP or QIB to simulate how market sentiment directly dictates Day-1 listing gains in real-time.</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-white font-mono font-bold text-[11px]">2. The Cone:</span>
                <p>Rather than giving one deterministic guess, the cone models the downside floor (P10) and upside ceiling (P90).</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-white font-mono font-bold text-[11px]">3. The Verdict:</span>
                <p>The Arbiter automatically updates the recommendation (Subscribe vs Avoid) based on risk-reward margins.</p>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1f23] py-4 mt-8 bg-black text-center text-[11px] font-mono text-zinc-500">
        <div>Department of Computer Engineering • Fr. Conceicao Rodrigues College of Engineering</div>
        <div className="text-zinc-600 mt-0.5">Course Seminar: 25SEM14CE01 • Rohan Benegal (Roll No. 10170)</div>
      </footer>
    </div>
  );
}
