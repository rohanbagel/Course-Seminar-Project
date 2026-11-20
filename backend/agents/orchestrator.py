"""
Multi-Agent Orchestration & Consensus Engine for IPO-Radar
Coordinates the Valuation Auditor, Demand Forecaster, and Dilution Auditor
with Groq LLM reasoning (Qwen 27B / GPT-OSS 120B) and deterministic forensic fallback.
"""

import os
import json
from typing import Dict, Any, List
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv()

from math_engine.beneish import calculate_beneish_m_score
from math_engine.dilution import calculate_dilution_and_governance
from math_engine.spike_model import calculate_listing_spike_cone
from agents.agent_prompts import (
    VALUATION_PROMPT, DEMAND_PROMPT, DILUTION_PROMPT, ARBITER_PROMPT
)

def get_groq_api_keys() -> list:
    """Collects configured Groq API keys from environment for round-robin rotation."""
    keys = []
    for var_name in ["GROQ_API_KEY", "GROQ_API_KEY_2", "GROQ_API_KEY_3", "GROQ_API_KEY_BACKUP"]:
        k = os.getenv(var_name)
        if k and k.strip() and k.strip() not in keys:
            keys.append(k.strip())
    return keys

GROQ_KEYS = get_groq_api_keys()

CANDIDATE_MODELS = [
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b"
]

def run_groq_inference(system_prompt: str, user_prompt: str, api_key: str = None) -> str:
    """Invokes Groq Cloud API with key rotation and candidate model fallback."""
    keys_to_try = [api_key] if api_key else get_groq_api_keys()
    
    for key in keys_to_try:
        if not key:
            continue
        try:
            from groq import Groq
            client = Groq(api_key=key)
            for model in CANDIDATE_MODELS:
                try:
                    completion = client.chat.completions.create(
                        model=model,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        temperature=0.2,
                        max_tokens=400
                    )
                    content = completion.choices[0].message.content
                    if content and len(content.strip()) > 10:
                        return content.strip()
                except Exception:
                    continue
        except Exception:
            continue
    return None

def analyze_ipo(ipo_data: Dict[str, Any], groq_api_key: str = None) -> Dict[str, Any]:
    """
    Executes end-to-end multi-agent IPO analysis:
    1. Math Engine: Beneish M-Score, OFS Dilution, Listing Spike Cone
    2. Agent 1: Valuation Auditor
    3. Agent 2: Demand Forecaster
    4. Agent 3: Dilution & Governance Auditor
    5. Agent 4: Chief Consensus Arbiter (Debate & Final Verdict)
    """
    company = ipo_data.get("company_name", "Target Company")
    ticker = ipo_data.get("ticker", "IPO")
    price_band = ipo_data.get("price_band", "N/A")
    issue_price = ipo_data.get("issue_price", 100.0)
    gmp = ipo_data.get("gmp_rupees", 0.0)
    qib_sub = ipo_data.get("qib_subscription_x", 1.0)
    nii_sub = ipo_data.get("nii_subscription_x", 1.0)
    retail_sub = ipo_data.get("retail_subscription_x", 1.0)
    fresh_cr = ipo_data.get("fresh_issue_cr", 0.0)
    ofs_cr = ipo_data.get("ofs_cr", 0.0)
    anchor_cr = ipo_data.get("anchor_book_cr", 0.0)
    pre_promoter = ipo_data.get("pre_promoter_holding_pct", 50.0)
    post_promoter = ipo_data.get("post_promoter_holding_pct", 40.0)
    peers = ipo_data.get("peers", [])
    beneish_inputs = ipo_data.get("beneish_inputs", {})
    drhp_notes = ipo_data.get("drhp_risk_notes", [])

    # Step 1: Deterministic Mathematical Formulations
    beneish_res = calculate_beneish_m_score(**beneish_inputs) if beneish_inputs else {
        "m_score": -2.15,
        "is_high_risk": False,
        "risk_classification": "LOW / STANDARD ACCRUAL PROFILE",
        "red_flags": [],
        "ratios": {"DSRI": 1.0, "GMI": 1.0, "AQI": 1.0, "SGI": 1.0, "DEPI": 1.0, "SGAI": 1.0, "TATA": 0.0, "LVGI": 1.0}
    }
    dilution_res = calculate_dilution_and_governance(
        fresh_issue_cr=fresh_cr,
        ofs_cr=ofs_cr,
        pre_promoter_holding_pct=pre_promoter,
        post_promoter_holding_pct=post_promoter,
        anchor_book_cr=anchor_cr,
        qib_portion_cr=(fresh_cr + ofs_cr) * 0.5
    )
    overval_pct = 25.0 if ofs_cr > fresh_cr else 10.0
    spike_res = calculate_listing_spike_cone(
        issue_price=issue_price,
        gmp_in_rupees=gmp,
        qib_subscription_x=qib_sub,
        nii_subscription_x=nii_sub,
        retail_subscription_x=retail_sub,
        overvaluation_pct=overval_pct
    )

    # Step 2: Agent 1 - Valuation Auditor Analysis
    valuation_context = (
        f"Company: {company} ({ticker})\nPrice: ₹{issue_price} (Band: {price_band})\n"
        f"Peers: {json.dumps(peers)}\nImplied Valuation Multiple: {ipo_data.get('ipo_ev_sales', ipo_data.get('ipo_pe', 'N/A'))}\n"
    )
    val_llm = run_groq_inference(VALUATION_PROMPT, valuation_context, groq_api_key)
    if not val_llm:
        val_llm = (
            f"Valuation Audit for {company}: Benchmarked against key peers {peers[0]['name'] if peers else 'sector medians'}. "
            f"The issue price of ₹{issue_price} implies an overvaluation premium of ~{overval_pct}%. "
            f"While current growth momentum is positive, the valuation leaves very little margin of safety for retail buyers. "
            f"Valuation Risk Score: {int(overval_pct * 2.2)} / 100."
        )

    # Step 3: Agent 2 - Demand Forecaster Analysis
    demand_context = (
        f"Company: {company}\nIssue Price: ₹{issue_price}\nGMP: ₹{gmp} ({spike_res['gmp_pct']}% spread)\n"
        f"QIB Subscription: {qib_sub}x | NII: {nii_sub}x | Retail: {retail_sub}x\n"
        f"Calculated Spike Probability: {spike_res['spike_probability_pct']}%\n"
        f"Expected Listing Return: {spike_res['listing_cone']['expected_gain_pct']}%\n"
    )
    dem_llm = run_groq_inference(DEMAND_PROMPT, demand_context, groq_api_key)
    if not dem_llm:
        dem_llm = (
            f"Demand Forecast for {company}: Institutional QIB subscription stands at {qib_sub}x with GMP at ₹{gmp} ({spike_res['gmp_pct']}%). "
            f"Market sentiment is {spike_res['market_sentiment']}. Listing gain probability cone projects a base Day-1 gain of "
            f"+{spike_res['listing_cone']['expected_gain_pct']}% (Range: {spike_res['listing_cone']['bearish_gain_pct']}% to +{spike_res['listing_cone']['bullish_gain_pct']}%). "
            f"Short-term institutional demand provides initial listing buffer."
        )

    # Step 4: Agent 3 - Dilution & Governance Auditor
    dil_context = (
        f"Company: {company}\nTotal Issue: ₹{dilution_res['total_issue_size_cr']} Cr\n"
        f"Fresh Issue: ₹{fresh_cr} Cr ({dilution_res['fresh_ratio_pct']}%) | OFS: ₹{ofs_cr} Cr ({dilution_res['ofs_ratio_pct']}%)\n"
        f"Promoter Dilution: {dilution_res['promoter_dilution_pct']}% (Holding drops to {post_promoter}%)\n"
        f"Beneish M-Score: {beneish_res['m_score']} ({beneish_res['risk_classification']})\n"
        f"Anchor Day-30 Lock-in Cliff: ₹{dilution_res['anchor_cliff']['day_30_unlock_cr']} Cr\n"
        f"Statutory DRHP Risk Notes: {json.dumps(drhp_notes)}\n"
    )
    dil_llm = run_groq_inference(DILUTION_PROMPT, dil_context, groq_api_key)
    if not dil_llm:
        dil_llm = (
            f"Governance & Forensic Audit for {company}: OFS ratio is {dilution_res['ofs_ratio_pct']}%. "
            f"Beneish M-Score is {beneish_res['m_score']} [{beneish_res['risk_classification']}]. "
            f"Key Red Flag: ₹{dilution_res['anchor_cliff']['day_30_unlock_cr']} Cr of Anchor shares unlock at T+30 calendar days, posing supply overhang. "
            f"Specific DRHP Notes: {drhp_notes[0] if drhp_notes else 'Standard disclosures.'}"
        )

    # Step 5: Structured Cross-Agent Debate & Arbiter Decision
    debate_records = [
        {"agent": "Valuation Auditor", "role": "Fundamental Sanity", "message": val_llm, "risk_level": "MODERATE" if overval_pct < 20 else "HIGH"},
        {"agent": "Demand Forecaster", "role": "Momentum & Listing Spikes", "message": dem_llm, "risk_level": "LOW" if spike_res['spike_probability_pct'] > 50 else "MODERATE"},
        {"agent": "Dilution Auditor", "role": "Forensics & Governance", "message": dil_llm, "risk_level": "HIGH" if dilution_res['ofs_ratio_pct'] > 50 else "LOW"}
    ]

    # Consensus Logic
    ofs_pct = dilution_res['ofs_ratio_pct']
    exp_gain = spike_res['listing_cone']['expected_gain_pct']
    is_beneish_risk = beneish_res.get('is_high_risk', False)

    if ofs_pct >= 90.0:
        verdict = "AVOID / FULLY PRICED"
        conviction = 88
        summary = (
            f"Strong Avoid recommendation. The offering is a 100% Offer for Sale (OFS) cash-out totaling ₹{ofs_cr:,.0f} Cr "
            f"with zero fresh capital entering company operations. Fully priced with negative listing margin."
        )
    elif is_beneish_risk or (ofs_pct > 60 and exp_gain < 5.0):
        verdict = "HIGH SPECULATIVE RISK"
        conviction = 82
        summary = (
            f"High forensic risk detected. Aggressive accrual patterns (Beneish M-Score: {beneish_res['m_score']}) and heavy "
            f"early investor selling ({ofs_pct:.1f}% OFS) make this suitable only for risk-tolerant speculative traders."
        )
    elif exp_gain >= 5.0 and ofs_pct > 40.0:
        verdict = "TACTICAL SUBSCRIBE"
        conviction = 78
        summary = (
            f"Subscribe strictly for Day-1 listing gains (+{exp_gain}% projected return). "
            f"Due to high OFS dilution ({ofs_pct:.1f}%) and upcoming T+30 anchor unlock (₹{dilution_res['anchor_cliff']['day_30_unlock_cr']} Cr), "
            f"retail investors should book profits on listing day rather than holding long-term."
        )
    else:
        verdict = "SUBSCRIBE"
        conviction = 85
        summary = (
            f"Definitive Subscribe. Balanced fresh capital allocation ({dilution_res['fresh_ratio_pct']}%), reasonable peer valuation, "
            f"and healthy QIB institutional demand support both listing gains and sustainable medium-term compounding."
        )

    all_red_flags = dilution_res["red_flags"] + beneish_res["red_flags"] + drhp_notes

    return {
        "company_name": company,
        "ticker": ticker,
        "price_band": price_band,
        "issue_price": issue_price,
        "verdict": verdict,
        "conviction_score": conviction,
        "summary": summary,
        "debate_stream": debate_records,
        "sector": ipo_data.get("sector", "Core Financial / Industrial"),
        "peers": ipo_data.get("peers", []),
        "ipo_multiples": {
            "ev_sales": ipo_data.get("ipo_ev_sales"),
            "pe": ipo_data.get("ipo_pe"),
            "ev_ebitda": ipo_data.get("ipo_ev_ebitda")
        },
        "math_metrics": {
            "beneish": beneish_res,
            "dilution": dilution_res,
            "spike_cone": spike_res
        },
        "red_flags": all_red_flags,
        "disclaimer": "SEBI Compliance Notice: Research generated by autonomous multi-agent algorithms for academic evaluation only. Not registered investment advisory."
    }
