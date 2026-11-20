# IPO-Radar: Autonomous Financial Multi-Agent Forensic Due-Diligence Platform

> **B.E. Seminar Project (Computer Engineering, Sem VII, 2026-27)**  
> **Course Code:** `25SEM14CE01`  
> **Institution:** Department of Computer Engineering, Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE), University of Mumbai  
> **Candidate:** Rohan Benegal (Roll No. 10170, Div: A)  
> **Supervisor / HOD:** Dr. Sujata Deshmukh  

---

## 1. Executive Summary & Problem Formulation
Indian primary public equity markets experienced historic retail participation in FY 2024–25, with landmark offerings frequently raising upwards of ₹10,000 Cr to ₹28,000 Cr. However, individual retail investors face asymmetric information disadvantage when analyzing statutory Draft Red Herring Prospectuses (DRHPs) spanning 500+ pages of dense legalistic disclosures.

**IPO-Radar** bridges this gap by deploying an autonomous multi-agent swarm architecture coupled with mathematical forensic auditing:
1. **Mathematical Forensic Verification:** Computes the 8-variable Beneish M-Score to detect earnings manipulation, calculates the SEBI Anchor Investor Lock-In Cliff (Day 30 and Day 90 supply shocks), and projects Day-1 listing returns using a probabilistic logit cone.
2. **Autonomous Multi-Agent Swarm:** Orchestrates a structured adversarial deliberation across four specialized agent personas (Valuation Auditor, Demand Forecaster, Dilution Auditor, Consensus Arbiter) powered by ultra-fast Groq LPU inference with automatic multi-key round-robin rotation.
3. **Institutional Interface:** Implemented in a high-contrast minimalist black-and-white aesthetic with tactile skeuomorphic depth (`sk-card`, `sk-recessed`, `sk-btn-primary`), featuring interactive What-If simulators, peer valuation spreads, and one-click printable SEBI due-diligence dossiers.

---

## 2. Multi-Agent Swarm Architecture

```
                       +---------------------------------------+
                       |    Statutory Prospectus / DRHP Feed   |
                       +---------------------------------------+
                                           |
                                           v
               +-------------------------------------------------------+
               |     Deterministic Quantitative Mathematical Engines   |
               |  - Beneish M-Score Formula (8 Accounting Variables)   |
               |  - Dilution & SEBI Anchor Lock-in Cliff Engine        |
               |  - Logistic Day-1 Listing Spike Probability Cone      |
               +-------------------------------------------------------+
                                           |
                   +-----------------------+-----------------------+
                   |                       |                       |
                   v                       v                       v
        +---------------------+ +---------------------+ +---------------------+
        |  Valuation Auditor  | |  Demand Forecaster  | |  Dilution Auditor   |
        |  (Industry Peers &  | |   (GMP & QIB Bids   | | (OFS Exit & Beneish |
        |   Multiple Spreads) | |     Probability)    | |  Forensic Audit)    |
        +---------------------+ +---------------------+ +---------------------+
                   \                       |                       /
                    \                      |                      /
                     v                     v                     v
                  +-----------------------------------------------+
                  |               Consensus Arbiter               |
                  |     - Adversarial Multi-Agent Debate Round    |
                  |     - Conviction-Weighted Synthesis Matrix    |
                  |     - Definitive Actionable Verdict           |
                  +-----------------------------------------------+
                                           |
                                           v
                  +-----------------------------------------------+
                  |          Institutional Terminal UI            |
                  |   - What-If Day-1 Listing Simulator           |
                  |   - Listed Peer Benchmarking Matrix           |
                  |   - SEBI T+30 to T+1095 Lock-In Schedule      |
                  |   - Printable Due-Diligence Dossier Export    |
                  +-----------------------------------------------+
```

---

## 3. Mathematical Foundations

### 3.1 Beneish M-Score Forensic Model
The Beneish M-Score evaluates whether an issuer capitalized operating expenses or accelerated revenues prior to its public offering:

$$\text{M-Score} = -4.84 + 0.920 \cdot \text{DSRI} + 0.528 \cdot \text{GMI} + 0.404 \cdot \text{AQI} + 0.892 \cdot \text{SGI} + 0.115 \cdot \text{DEPI} - 0.172 \cdot \text{SGAI} + 4.037 \cdot \text{TATA} + 0.0327 \cdot \text{LVGI}$$

- **Empirical Threshold:** $\text{M-Score} > -1.78$ indicates aggressive accounting / manipulation risk.
- **Components:** Days Sales in Receivables Index ($\text{DSRI}$), Gross Margin Index ($\text{GMI}$), Asset Quality Index ($\text{AQI}$), Sales Growth Index ($\text{SGI}$), Depreciation Index ($\text{DEPI}$), SG&A Expense Index ($\text{SGAI}$), Total Accruals to Total Assets ($\text{TATA}$), and Leverage Index ($\text{LVGI}$).

### 3.2 SEBI Anchor Lock-In Supply Cliff
Per SEBI (Issue of Capital and Disclosure Requirements) Regulations:
- **T+30 Calendar Days:** Exactly $50\%$ of shares allocated to Anchor Investors are released into the open market.
- **T+90 Calendar Days:** The remaining $50\%$ of Anchor Investor shares unlock.
- **Supply Cliff Impact:** Historically triggers acute volatility spikes as institutional funds take profit or reallocate capital.

### 3.3 Listing Return Probability Cone Model
Day-1 listing gains are estimated via a logistic return distribution:

$$P(\text{Spike} > 10\%) = \frac{1}{1 + e^{-z}}$$

$$z = -1.2 + 0.045 \cdot \text{GMP}_{\%} + 0.025 \cdot \min(\text{QIB}_{\text{sub}}, 80) + 0.015 \cdot \min(\text{NII}_{\text{sub}}, 50) - 0.035 \cdot \text{Overval}_{\%}$$

$$\text{Expected Day-1 Gain \%} = (\text{GMP}_{\%} \times 0.70) + (\min(\text{QIB}_{\text{sub}}, 60) \times 0.25) - (\text{Overval}_{\%} \times 0.20)$$

$$\text{Bearish Bound } (P_{10}) = \text{Expected Gain \%} - 6.5\% \quad | \quad \text{Bullish Bound } (P_{90}) = \text{Expected Gain \%} + 8.5\%$$

---

## 4. Key Platform Features

- **Pre-Indexed Landmark Case Studies:**
  - **Swiggy Limited (Nov 2024):** ₹11,327 Cr issue ($60.3\%$ OFS) $\rightarrow$ *Verdict: TACTICAL SUBSCRIBE* (+7.7% listed gain).
  - **Hyundai Motor India (Oct 2024):** ₹27,870 Cr issue ($100\%$ OFS, zero capex inflow) $\rightarrow$ *Verdict: AVOID / FULLY PRICED* (-1.5% discount).
  - **Ola Electric Mobility (Aug 2024):** ₹6,145 Cr issue (Beneish M-Score: $-1.605 > -1.78$) $\rightarrow$ *Verdict: HIGH SPECULATIVE RISK* (-56% post-spike collapse).
- **Interactive What-If Listing Simulator:** Real-time dynamic parameter modeling allowing users to drag GMP and institutional subscription sliders to simulate custom market environments.
- **SEBI Statutory Lock-In Timeline:** Maps out Day 0, Day 30, Day 90, Day 180, and Year 1-3 share unlocks with calculated Crores and regulatory risk ratings.
- **Listed Industry Peer Benchmarking:** Compares IPO implied multiples (P/E, EV/Sales, EV/EBITDA, YoY Revenue Growth) against listed Indian competitors (e.g. Zomato, Maruti Suzuki, TVS Motor).
- **Custom IPO Submission Swarm:** Allows analyzing any upcoming offering dynamically by inputting issue parameters into a skeuomorphic modal.
- **Export Due-Diligence Dossier:** One-click generation of publication-ready Markdown files and print-optimized PDF dossiers.

---

## 5. Technology Stack & Design System

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React.
  - Skills applied: `skeuomorphism-ui`, `frontend-design`, `design-taste-frontend`, `eyes-of-render`.
  - Minimalist black-and-white palette (`#070709`, `#0C0C0E`, `#121215`, `#27272A`, `#F4F4F5`) with tactile depth, pressed state travel, and monospace metrics.
- **Backend:** FastAPI, Python 3.12, Uvicorn, Django REST Framework.
- **Inference Swarm:** Groq Cloud LPU (`llama-3.3-70b-versatile`, `qwen/qwen3.8-27b`, `openai/gpt-oss-120b`) with round-robin multi-key pooling and Google Gemini backup failover.

---

## 6. Quickstart Guide

### 6.1 Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 6.2 Environment Configuration
Create `backend/.env` (already gitignored):
```env
GROQ_API_KEY=your_groq_key_1
GROQ_API_KEY_2=your_groq_key_2
GROQ_API_KEY_3=your_groq_key_3
GEMINI_API_KEY=your_gemini_key
```

### 6.3 Run Backend Server
```bash
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```
* API Documentation / Swagger: `http://localhost:8000/docs`
* Health Check: `http://localhost:8000/`

### 6.4 Run Frontend Application
```bash
cd frontend
npm install
npm run dev -- --host
```
* Web Application: `http://localhost:5173/`

---

## 7. Automated Test Suites

### 7.1 Backend Unit Tests
Execute the comprehensive mathematical and multi-agent test suite:
```bash
cd backend
python -m unittest discover -p "test_*.py"
```
* **Coverage:** 16 tests covering Beneish M-Score thresholds, OFS dilution math, SEBI anchor lock-in unlocks, probability cones, API endpoints, key rotation, and candidate model failover.

### 7.2 Frontend Production Build
```bash
cd frontend
npm run build
```
* **Performance:** Full TypeScript compilation and asset bundling in $\le 600$ ms.

---

## 8. Academic Evaluation & License
Developed as part of the Final Year B.E. Course Seminar requirement (`25SEM14CE01`) at Fr. Conceicao Rodrigues College of Engineering, University of Mumbai.

*Notice: Generated by IPO-Radar Autonomous Multi-Agent Financial Swarm. Academic evaluation only. Not registered SEBI investment advice.*
