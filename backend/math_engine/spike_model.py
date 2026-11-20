"""
Listing Spike & Day-1 Return Probability Cone Model
Combines Grey Market Premium (GMP), institutional QIB oversubscription,
and valuation discounts to estimate listing-day price distributions.
"""

import math
from typing import Dict, Any

def sigmoid(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-max(min(x, 15.0), -15.0)))

def calculate_listing_spike_cone(
    issue_price: float,
    gmp_in_rupees: float,
    qib_subscription_x: float,
    nii_subscription_x: float,
    retail_subscription_x: float,
    overvaluation_pct: float = 0.0
) -> Dict[str, Any]:
    """
    Computes listing gain probability cone and expected trading band.
    """
    gmp_pct = (gmp_in_rupees / issue_price * 100.0) if issue_price > 0 else 0.0
    total_subscription_x = (qib_subscription_x * 0.5) + (nii_subscription_x * 0.15) + (retail_subscription_x * 0.35)

    # Logit score for Day-1 spike > 10%
    # Positive weights: GMP spread, QIB institutional subscription
    # Negative weight: overvaluation vs peer multiples
    logit = (
        -1.2
        + 0.045 * gmp_pct
        + 0.025 * min(qib_subscription_x, 80.0)
        + 0.015 * min(nii_subscription_x, 50.0)
        - 0.035 * max(overvaluation_pct, 0.0)
    )
    
    spike_probability = sigmoid(logit)

    # Base estimate for Day-1 percentage return
    expected_gain_pct = round((gmp_pct * 0.70) + (min(qib_subscription_x, 60.0) * 0.25) - (overvaluation_pct * 0.20), 1)

    # Bearish / Base / Bullish cone ranges
    cone_bearish_pct = round(expected_gain_pct - 6.5, 1)
    cone_bullish_pct = round(expected_gain_pct + 8.5, 1)

    expected_listing_price = round(issue_price * (1.0 + expected_gain_pct / 100.0), 2)
    bearish_listing_price = round(issue_price * (1.0 + cone_bearish_pct / 100.0), 2)
    bullish_listing_price = round(issue_price * (1.0 + cone_bullish_pct / 100.0), 2)

    sentiment = "VERY BULLISH" if spike_probability > 0.75 else ("BULLISH" if spike_probability > 0.55 else ("NEUTRAL / FLAT" if spike_probability > 0.40 else "BEARISH / DISCOUNT RISK"))

    return {
        "issue_price": issue_price,
        "gmp_in_rupees": gmp_in_rupees,
        "gmp_pct": round(gmp_pct, 1),
        "total_subscription_x": round(total_subscription_x, 2),
        "spike_probability_pct": round(spike_probability * 100.0, 1),
        "market_sentiment": sentiment,
        "listing_cone": {
            "bearish_gain_pct": cone_bearish_pct,
            "expected_gain_pct": expected_gain_pct,
            "bullish_gain_pct": cone_bullish_pct,
            "bearish_price": bearish_listing_price,
            "expected_price": expected_listing_price,
            "bullish_price": bullish_listing_price
        }
    }
