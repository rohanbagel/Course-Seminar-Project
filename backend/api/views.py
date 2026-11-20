from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from data.sample_ipos import SAMPLE_IPOS
from agents.orchestrator import analyze_ipo

@api_view(['GET'])
def health_check(request):
    return Response({
        "status": "online",
        "engine": "IPO-Radar Django REST Swarm",
        "agents": ["Valuation Auditor", "Demand Forecaster", "Dilution Auditor", "Consensus Arbiter"]
    })

@api_view(['GET'])
def list_ipos(request):
    catalog = []
    for key, data in SAMPLE_IPOS.items():
        total_issue = data["fresh_issue_cr"] + data["ofs_cr"]
        ofs_ratio = (data["ofs_cr"] / total_issue * 100.0) if total_issue > 0 else 0.0
        catalog.append({
            "key": key,
            "company_name": data["company_name"],
            "ticker": data["ticker"],
            "sector": data["sector"],
            "listing_date": data["listing_date"],
            "issue_price": data["issue_price"],
            "price_band": data["price_band"],
            "total_issue_cr": total_issue,
            "ofs_ratio_pct": round(ofs_ratio, 1),
            "actual_day1_return": data["actual_outcome"]["day1_gain_pct"]
        })
    return Response(catalog)

@api_view(['GET'])
def get_ipo_analysis(request, key):
    key_upper = key.upper()
    if key_upper not in SAMPLE_IPOS:
        return Response({"error": f"IPO '{key}' not found"}, status=status.HTTP_404_NOT_FOUND)
    
    api_key = request.GET.get('api_key', None)
    ipo_data = SAMPLE_IPOS[key_upper]
    analysis = analyze_ipo(ipo_data, groq_api_key=api_key)
    analysis["actual_outcome"] = ipo_data.get("actual_outcome", {})
    return Response(analysis)

@api_view(['POST'])
def analyze_custom_ipo(request):
    data = request.data
    groq_key = data.get("groq_api_key", None)
    analysis = analyze_ipo(data, groq_api_key=groq_key)
    return Response(analysis)
