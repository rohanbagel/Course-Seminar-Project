"""
Sample Indian IPO Dataset for Empirical Case Studies
Includes statutory metrics for Swiggy, Hyundai Motor India, and Ola Electric.
"""

from typing import Dict, Any

SAMPLE_IPOS: Dict[str, Dict[str, Any]] = {
    "SWIGGY": {
        "company_name": "Swiggy Limited",
        "ticker": "SWIGGY",
        "sector": "Consumer Tech / Quick Commerce",
        "listing_date": "Nov 2024",
        "issue_price": 390.0,
        "price_band": "₹371 - ₹390",
        "fresh_issue_cr": 4499.0,
        "ofs_cr": 6828.0,
        "total_issue_size_cr": 11327.0,
        "pre_promoter_holding_pct": 0.0,  # Professionally managed / PE backed
        "post_promoter_holding_pct": 0.0,
        "anchor_book_cr": 5085.0,
        "qib_subscription_x": 6.02,
        "nii_subscription_x": 0.41,
        "retail_subscription_x": 1.14,
        "gmp_rupees": 15.0,
        "peers": [
            {"name": "Zomato Ltd", "pe": 115.0, "ev_sales": 9.2, "growth": 35.0}
        ],
        "ipo_ev_sales": 6.8,
        "beneish_inputs": {
            "receivables_t": 820.0, "receivables_prev": 610.0,
            "sales_t": 11247.0, "sales_prev": 8264.0,
            "cogs_t": 6800.0, "cogs_prev": 5200.0,
            "current_assets_t": 5800.0, "current_assets_prev": 4900.0,
            "ppe_t": 1600.0, "ppe_prev": 1300.0,
            "total_assets_t": 11400.0, "total_assets_prev": 9800.0,
            "deprec_t": 480.0, "deprec_prev": 410.0,
            "sga_t": 6200.0, "sga_prev": 5400.0,
            "net_income_t": -2350.0,
            "cfo_t": -1200.0,
            "current_liab_t": 2800.0, "current_liab_prev": 2300.0,
            "lt_debt_t": 350.0, "lt_debt_prev": 300.0
        },
        "drhp_risk_notes": [
            "Heavy dark-store network capital expenditure for Instamart quick commerce.",
            "60.3% of total issue proceeds exit to selling financial investors (Prosus, Softbank).",
            "History of consolidated net operating losses; unit economics vulnerable to 10-minute delivery competition."
        ],
        "actual_outcome": {
            "listing_price": 420.0,
            "day1_gain_pct": 7.69,
            "benchmark_verdict": "TACTICAL SUBSCRIBE (Modest listing gain, volatile mid-term holding)"
        }
    },
    "HYUNDAI": {
        "company_name": "Hyundai Motor India Limited",
        "ticker": "HYUNDAI",
        "sector": "Automotive / Passenger Vehicles",
        "listing_date": "Oct 2024",
        "issue_price": 1960.0,
        "price_band": "₹1865 - ₹1960",
        "fresh_issue_cr": 0.0,
        "ofs_cr": 27870.0,
        "total_issue_size_cr": 27870.0,
        "pre_promoter_holding_pct": 100.0,
        "post_promoter_holding_pct": 82.5,
        "anchor_book_cr": 8315.0,
        "qib_subscription_x": 6.97,
        "nii_subscription_x": 0.60,
        "retail_subscription_x": 0.50,
        "gmp_rupees": -10.0,
        "peers": [
            {"name": "Maruti Suzuki Ltd", "pe": 26.5, "ev_ebitda": 18.2, "growth": 12.0},
            {"name": "Tata Motors Ltd", "pe": 10.8, "ev_ebitda": 6.4, "growth": 18.0}
        ],
        "ipo_pe": 26.2,
        "ipo_ev_ebitda": 17.8,
        "beneish_inputs": {
            "receivables_t": 2400.0, "receivables_prev": 2100.0,
            "sales_t": 69829.0, "sales_prev": 60307.0,
            "cogs_t": 48500.0, "cogs_prev": 42100.0,
            "current_assets_t": 14200.0, "current_assets_prev": 13100.0,
            "ppe_t": 18900.0, "ppe_prev": 16500.0,
            "total_assets_t": 38500.0, "total_assets_prev": 33200.0,
            "deprec_t": 2100.0, "deprec_prev": 1850.0,
            "sga_t": 7200.0, "sga_prev": 6400.0,
            "net_income_t": 6060.0,
            "cfo_t": 6800.0,
            "current_liab_t": 11500.0, "current_liab_prev": 10200.0,
            "lt_debt_t": 0.0, "lt_debt_prev": 0.0
        },
        "drhp_risk_notes": [
            "100.0% of issue is Offer for Sale (OFS). Zero rupees allocated for Indian factory capex; entire ₹27,870 Cr repatriated to Korean parent.",
            "Royalty rate paid to parent company hiked from 0.65% to 1.50% of revenue.",
            "Fully priced at parity with market leader Maruti Suzuki despite single-plant manufacturing concentration."
        ],
        "actual_outcome": {
            "listing_price": 1931.0,
            "day1_gain_pct": -1.48,
            "benchmark_verdict": "AVOID / FULLY PRICED (Zero capex benefit, high exit risk)"
        }
    },
    "OLA_ELEC": {
        "company_name": "Ola Electric Mobility Limited",
        "ticker": "OLAELEC",
        "sector": "Electric Vehicles (2-Wheelers)",
        "listing_date": "Aug 2024",
        "issue_price": 76.0,
        "price_band": "₹72 - ₹76",
        "fresh_issue_cr": 5500.0,
        "ofs_cr": 645.0,
        "total_issue_size_cr": 6145.0,
        "pre_promoter_holding_pct": 45.1,
        "post_promoter_holding_pct": 36.9,
        "anchor_book_cr": 2763.0,
        "qib_subscription_x": 5.31,
        "nii_subscription_x": 2.40,
        "retail_subscription_x": 3.92,
        "gmp_rupees": 12.0,
        "peers": [
            {"name": "TVS Motor Ltd", "pe": 48.0, "ev_sales": 3.2, "growth": 15.0},
            {"name": "Bajaj Auto Ltd", "pe": 34.0, "ev_sales": 4.1, "growth": 14.0}
        ],
        "ipo_ev_sales": 7.4,
        "beneish_inputs": {
            "receivables_t": 780.0, "receivables_prev": 420.0,
            "sales_t": 5009.0, "sales_prev": 2631.0,
            "cogs_t": 4200.0, "cogs_prev": 2300.0,
            "current_assets_t": 3200.0, "current_assets_prev": 1900.0,
            "ppe_t": 4100.0, "ppe_prev": 2800.0,
            "total_assets_t": 8900.0, "total_assets_prev": 5600.0,
            "deprec_t": 320.0, "deprec_prev": 180.0,
            "sga_t": 2100.0, "sga_prev": 1400.0,
            "net_income_t": -1584.0,
            "cfo_t": -1100.0,
            "current_liab_t": 2600.0, "current_liab_prev": 1500.0,
            "lt_debt_t": 1800.0, "lt_debt_prev": 1100.0
        },
        "drhp_risk_notes": [
            "Severe working capital strain and continuing cash bleed; heavy reliance on government FAME/EMPS subsidies.",
            "Rising customer service grievances, software bugs, and battery degradation dispute disclosures.",
            "Promoter holding drops below 40%; Gigafactory cell manufacturing expansion subject to execution delays."
        ],
        "actual_outcome": {
            "listing_price": 76.0,
            "day1_gain_pct": 0.0,
            "benchmark_verdict": "HIGH SPECULATIVE RISK (Initial post-listing spike to ₹157 collapsed to ₹68 within 90 days)"
        }
    }
}
