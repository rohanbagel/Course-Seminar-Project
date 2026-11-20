import sys
sys.path.append(r'C:\Webathon\Course Seminar\Course-Seminar-Project\backend')
from data.sample_ipos import SAMPLE_IPOS
from agents.orchestrator import analyze_ipo

for key, ipo in SAMPLE_IPOS.items():
    print(f'================= {key} =================')
    result = analyze_ipo(ipo)
    print(f"Company: {result['company_name']}")
    print(f"Verdict: {result['verdict']} (Conviction: {result['conviction_score']}%)")
    print(f"Summary: {result['summary']}")
    print(f"Listing Cone: {result['math_metrics']['spike_cone']['listing_cone']}")
    print(f"Red Flags Count: {len(result['red_flags'])}")
