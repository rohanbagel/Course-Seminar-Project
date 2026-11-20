"""
Dilution & Governance Forensic Engine
Calculates Offer for Sale (OFS) cash-out ratios, promoter holding changes,
and Anchor Investor Lock-In Cliff exposure for Indian IPOs.
"""

from typing import Dict, Any, List

def calculate_dilution_and_governance(
    fresh_issue_cr: float,
    ofs_cr: float,
    pre_promoter_holding_pct: float,
    post_promoter_holding_pct: float,
    anchor_book_cr: float,
    qib_portion_cr: float,
    total_debt_cr: float = 0.0
) -> Dict[str, Any]:
    """
    Computes OFS ratio, capital use breakdown, and anchor lock-in cliff exposure.
    Units in ₹ Crores and Percentages.
    """
    total_issue_size = fresh_issue_cr + ofs_cr
    ofs_ratio_pct = (ofs_cr / total_issue_size * 100.0) if total_issue_size > 0 else 0.0
    fresh_ratio_pct = 100.0 - ofs_ratio_pct
    promoter_dilution_pct = pre_promoter_holding_pct - post_promoter_holding_pct

    # SEBI Anchor Investor Lock-in Rules:
    # 50% of Anchor book shares unlock at Day 30 post-listing.
    # The remaining 50% of Anchor shares unlock at Day 90 post-listing.
    anchor_30d_unlock_cr = anchor_book_cr * 0.50
    anchor_90d_unlock_cr = anchor_book_cr * 0.50

    red_flags: List[str] = []
    
    # Forensic Flags
    if ofs_ratio_pct >= 90.0:
        red_flags.append(
            f"CRITICAL: {ofs_ratio_pct:.1f}% of issue is Offer for Sale (OFS). Near 100% promoter/PE exit; zero or negligible capital flows into company balance sheet."
        )
    elif ofs_ratio_pct > 50.0:
        red_flags.append(
            f"HIGH RISK: OFS ratio is {ofs_ratio_pct:.1f}% (>50%). Majority of public funds exit to selling shareholders rather than funding expansion capex."
        )

    if promoter_dilution_pct > 25.0:
        red_flags.append(
            f"Significant promoter stake dilution of {promoter_dilution_pct:.1f}% (Holding drops from {pre_promoter_holding_pct:.1f}% to {post_promoter_holding_pct:.1f}%)."
        )

    if post_promoter_holding_pct < 50.0 and pre_promoter_holding_pct >= 50.0:
        red_flags.append(
            f"Loss of majority control: Promoter holding falls below 50.0% (Post-issue: {post_promoter_holding_pct:.1f}%)."
        )

    # SEBI Statutory Lock-In Timeline Schedule
    lockin_schedule = [
        {
            "stage": "Day 0",
            "period": "Listing Day",
            "category": "Retail, NII & Active Floating Quota",
            "value_cr": round(max(0.0, total_issue_size - anchor_book_cr), 2),
            "pct_of_issue": round(max(0.0, 100.0 - (anchor_book_cr / total_issue_size * 100.0 if total_issue_size > 0 else 0.0)), 1),
            "status": "IMMEDIATE_TRADING",
            "risk_flag": "Initial secondary price discovery and trading volume."
        },
        {
            "stage": "Day 30",
            "period": "T+30 Calendar Days",
            "category": "50% Anchor Investor Quota Release",
            "value_cr": round(anchor_30d_unlock_cr, 2),
            "pct_of_issue": round((anchor_30d_unlock_cr / total_issue_size * 100.0 if total_issue_size > 0 else 0.0), 1),
            "status": "SUPPLY_CLIFF",
            "risk_flag": "First institutional selling window; empirical study indicates sharpest supply dip."
        },
        {
            "stage": "Day 90",
            "period": "T+90 Calendar Days",
            "category": "Remaining 50% Anchor Investor Quota",
            "value_cr": round(anchor_90d_unlock_cr, 2),
            "pct_of_issue": round((anchor_90d_unlock_cr / total_issue_size * 100.0 if total_issue_size > 0 else 0.0), 1),
            "status": "SECONDARY_CLIFF",
            "risk_flag": "100% of Anchor book unlocked into open market order books."
        },
        {
            "stage": "Day 180",
            "period": "T+180 Calendar Days (6 Months)",
            "category": "Pre-IPO Non-Promoter & PE Investor Quota",
            "value_cr": round(ofs_cr * 0.40, 2),
            "pct_of_issue": round((ofs_cr * 0.40 / total_issue_size * 100.0 if total_issue_size > 0 else 0.0), 1),
            "status": "VENTURE_CAPITAL_UNLOCK",
            "risk_flag": "Early Series/Venture fund secondary sales window."
        },
        {
            "stage": "Year 1 - 3",
            "period": "T+365 to T+1095 Days",
            "category": "Promoter Statutory Minimum Contribution (20%)",
            "value_cr": round(total_issue_size * 1.5, 2),
            "pct_of_issue": round(post_promoter_holding_pct, 1),
            "status": "CORE_PROMOTER_LOCK",
            "risk_flag": "Long-term sponsor alignment locked per SEBI ICDR Chapter II."
        }
    ]

    return {
        "total_issue_size_cr": round(total_issue_size, 2),
        "ofs_ratio_pct": round(ofs_ratio_pct, 2),
        "fresh_ratio_pct": round(fresh_ratio_pct, 2),
        "promoter_dilution_pct": round(promoter_dilution_pct, 2),
        "anchor_cliff": {
            "anchor_book_cr": round(anchor_book_cr, 2),
            "day_30_unlock_cr": round(anchor_30d_unlock_cr, 2),
            "day_90_unlock_cr": round(anchor_90d_unlock_cr, 2),
            "warning": "Watch for post-listing institutional selling pressure around T+30 and T+90 calendar days."
        },
        "lockin_schedule": lockin_schedule,
        "governance_risk_rating": "HIGH EXIT RISK" if ofs_ratio_pct > 60 else ("MODERATE" if ofs_ratio_pct > 30 else "LOW / GROWTH CAPITAL FOCUS"),
        "red_flags": red_flags
    }
