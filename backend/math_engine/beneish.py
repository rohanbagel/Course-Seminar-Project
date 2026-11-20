"""
Beneish M-Score Mathematical Forensic Accounting Engine
Calculates the 8-variable Beneish M-Score to detect earnings manipulation
in statutory IPO prospectuses.

Formula:
M-Score = -4.84 + 0.920*DSRI + 0.528*GMI + 0.404*AQI + 0.892*SGI + 0.115*DEPI
          - 0.172*SGAI + 4.037*TATA + 0.0327*LVGI

Benchmark Threshold:
- M-Score > -1.78 indicates high probability of accounting manipulation / aggressive accruals.
- M-Score <= -1.78 indicates standard / non-manipulator financial reporting profile.
"""

from typing import Dict, Any, Tuple

def calculate_beneish_m_score(
    receivables_t: float, receivables_prev: float,
    sales_t: float, sales_prev: float,
    cogs_t: float, cogs_prev: float,
    current_assets_t: float, current_assets_prev: float,
    ppe_t: float, ppe_prev: float,
    total_assets_t: float, total_assets_prev: float,
    deprec_t: float, deprec_prev: float,
    sga_t: float, sga_prev: float,
    net_income_t: float,
    cfo_t: float,  # Cash Flow from Operations
    current_liab_t: float, current_liab_prev: float,
    lt_debt_t: float, lt_debt_prev: float
) -> Dict[str, Any]:
    """
    Computes all 8 Beneish ratios, overall M-score, and forensic risk flags.
    Units should be uniform (e.g. in ₹ Crores).
    """
    # 1. Days Sales in Receivables Index (DSRI)
    rec_to_sales_t = receivables_t / sales_t if sales_t > 0 else 1.0
    rec_to_sales_prev = receivables_prev / sales_prev if sales_prev > 0 else 1.0
    dsri = rec_to_sales_t / rec_to_sales_prev if rec_to_sales_prev > 0 else 1.0

    # 2. Gross Margin Index (GMI)
    gm_prev = (sales_prev - cogs_prev) / sales_prev if sales_prev > 0 else 0.0
    gm_t = (sales_t - cogs_t) / sales_t if sales_t > 0 else 0.0
    gmi = gm_prev / gm_t if gm_t > 0 else 1.0

    # 3. Asset Quality Index (AQI)
    nca_t = 1.0 - (current_assets_t + ppe_t) / total_assets_t if total_assets_t > 0 else 0.0
    nca_prev = 1.0 - (current_assets_prev + ppe_prev) / total_assets_prev if total_assets_prev > 0 else 0.0
    aqi = nca_t / nca_prev if nca_prev > 0 else 1.0

    # 4. Sales Growth Index (SGI)
    sgi = sales_t / sales_prev if sales_prev > 0 else 1.0

    # 5. Depreciation Index (DEPI)
    dep_rate_prev = deprec_prev / (ppe_prev + deprec_prev) if (ppe_prev + deprec_prev) > 0 else 0.0
    dep_rate_t = deprec_t / (ppe_t + deprec_t) if (ppe_t + deprec_t) > 0 else 0.0
    depi = dep_rate_prev / dep_rate_t if dep_rate_t > 0 else 1.0

    # 6. Sales, General & Administrative Expenses Index (SGAI)
    sga_rate_t = sga_t / sales_t if sales_t > 0 else 0.0
    sga_rate_prev = sga_prev / sales_prev if sales_prev > 0 else 0.0
    sgai = sga_rate_t / sga_rate_prev if sga_rate_prev > 0 else 1.0

    # 7. Total Accruals to Total Assets (TATA)
    total_accruals = (net_income_t - cfo_t)
    tata = total_accruals / total_assets_t if total_assets_t > 0 else 0.0

    # 8. Leverage Index (LVGI)
    lev_t = (current_liab_t + lt_debt_t) / total_assets_t if total_assets_t > 0 else 0.0
    lev_prev = (current_liab_prev + lt_debt_prev) / total_assets_prev if total_assets_prev > 0 else 0.0
    lvgi = lev_t / lev_prev if lev_prev > 0 else 1.0

    # Beneish M-Score Formula
    m_score = (
        -4.84
        + 0.920 * dsri
        + 0.528 * gmi
        + 0.404 * aqi
        + 0.892 * sgi
        + 0.115 * depi
        - 0.172 * sgai
        + 4.037 * tata
        + 0.0327 * lvgi
    )

    is_high_risk = m_score > -1.78

    red_flags = []
    if dsri > 1.25:
        red_flags.append(f"DSRI = {dsri:.2f}: Disproportionate receivables surge vs. revenue (potential aggressive revenue booking).")
    if gmi > 1.15:
        red_flags.append(f"GMI = {gmi:.2f}: Deteriorating gross margins hidden behind top-line expansion.")
    if aqi > 1.25:
        red_flags.append(f"AQI = {aqi:.2f}: Increasing capitalization of operating overheads into intangible/other assets.")
    if tata > 0.08:
        red_flags.append(f"TATA = {tata:.2f}: Accruals significantly exceed operating cash flows (low cash conversion).")
    if lvgi > 1.20:
        red_flags.append(f"LVGI = {lvgi:.2f}: Material leverage expansion entering the public issue.")

    return {
        "m_score": round(m_score, 3),
        "is_high_risk": is_high_risk,
        "risk_classification": "HIGH MANIPULATION RISK" if is_high_risk else "LOW / STANDARD ACCRUAL PROFILE",
        "ratios": {
            "DSRI": round(dsri, 3),
            "GMI": round(gmi, 3),
            "AQI": round(aqi, 3),
            "SGI": round(sgi, 3),
            "DEPI": round(depi, 3),
            "SGAI": round(sgai, 3),
            "TATA": round(tata, 3),
            "LVGI": round(lvgi, 3),
        },
        "red_flags": red_flags
    }
