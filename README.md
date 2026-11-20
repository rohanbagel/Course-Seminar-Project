# IPO-Radar: Autonomous Financial Multi-Agent Intelligence Platform

> **Course Seminar Project (B.E. Computer Engineering, Sem VII, 2026-27)**  
> **Institution:** Department of Computer Engineering, Fr. Conceicao Rodrigues College of Engineering, University of Mumbai  
> **Candidate:** Rohan Benegal (Roll No. 10170, Div: A)  
> **Supervisor / HOD:** Dr. Sujata Deshmukh  

---

## 1. Overview
**IPO-Radar** is an autonomous multi-agent forensic intelligence platform designed to eliminate information asymmetry for retail investors in Indian primary public markets. It ingests complex Draft Red Herring Prospectus (DRHP) data, calculates quantitative forensic accounting metrics (Beneish M-Score, OFS Dilution, and Day-1 Listing Spike Probability Cones), and orchestrates a collaborative debate across four specialized agents to deliver an actionable, transparent verdict.

---

## 2. Multi-Agent Swarm Architecture

| Agent Persona | Analytical Mandate | Tool Suite & Guardrails |
| :--- | :--- | :--- |
| **Valuation Auditor** | Benchmarks issue price band against listed peer multiples (`EV/EBITDA`, `P/E`, `EV/Sales`). | `yfinance` market feeds, peer sector median engine. |
| **Demand Forecaster** | Evaluates institutional QIB/NII bidding momentum and Grey Market Premium (GMP). | Logistic listing spike model, subscription tracker. |
| **Dilution Auditor** | Audits Offer for Sale (OFS) cash-out ratio, promoter holding shifts, and Beneish M-Score. | Beneish 8-variable formula, Anchor lock-in cliff calculator. |
| **Consensus Arbiter** | Cross-examines conflicting agent signals through a structured debate round. | Weighted risk matrix, definitive verdict generator. |

---

## 3. Minimalist Black & White Tactile Design System
Built adhering to:
- **`skeuomorphism-ui`**: Tactile recessed containers, raised buttons with depressed active states (`sk-card`, `sk-recessed`, `sk-btn-primary`).
- **`frontend-design` & `design-taste-frontend`**: Strict monochrome palette (`#09090B`, `#18181B`, `#27272A`, `#FFFFFF`), clean typography, tabular monospace data numbers, and zero extraneous decorative fluff.
- **`eyes-of-render`**: Modular and scalable repository structure.

---

## 4. Quickstart Guide

### Backend Setup (Django REST Framework / FastAPI)
```bash
cd backend

# Option A: Run Django REST Server (Default)
python manage.py runserver 8000

# Option B: Run High-Speed FastAPI Server
python server.py
```
* Backend will be live at `http://127.0.0.1:8000/api/`

### Frontend Setup (Vite + React + Tailwind v4)
```bash
cd frontend

# Install dependencies (already prepared)
npm install

# Start development server
npm run dev
```
* Open `http://localhost:5173` in your browser.

---

## 5. Empirical Case Studies Pre-Loaded
1. **Swiggy Limited (Nov 2024):** 60.3% OFS, high quick-commerce burn $\rightarrow$ **Verdict: TACTICAL SUBSCRIBE** (+7.7% listed gain).
2. **Hyundai Motor India (Oct 2024):** 100% OFS cashout, royalty hike $\rightarrow$ **Verdict: AVOID / FULLY PRICED** (-1.5% discount).
3. **Ola Electric (Aug 2024):** High accrual anomaly (Beneish M-Score: -1.605) $\rightarrow$ **Verdict: HIGH SPECULATIVE RISK** (-56% post-spike collapse).

---

## 6. Zero-Cost Production Deployment
- **Frontend:** Instant deployment to **Vercel** (`npm run build`).
- **Backend:** Deployment to **Render Free Web Service** via `gunicorn ipo_core.wsgi:application`.
- **LLM Engine:** Zero-cost inference via **Groq Cloud** (`llama-3.3-70b-versatile` at 30 req/min).
