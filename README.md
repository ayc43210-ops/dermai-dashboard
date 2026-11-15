# DermAI Dashboard

React frontend for the [DermAI skin lesion classifier](https://github.com/ayc43210-ops/Cancer-Detection-Project). Upload a lesion image, send it to the FastAPI backend, and view the predicted class, confidence, risk level and a downloadable PDF report.

> **Disclaimer:** Educational / research prototype. Not a medical device. Not for real diagnosis or treatment decisions.

## Stack

Vite · React · TypeScript · Tailwind CSS · shadcn/ui

## Run it

You need the backend running first.

```bash
# 1. Backend (from the Cancer-Detection-Project repo)
cd backend
pip install -r requirements.txt
pip install tensorflow fastapi uvicorn python-multipart
uvicorn main:app --reload            # http://127.0.0.1:8000

# 2. Frontend (this repo)
cp .env.example .env                 # set VITE_API_URL if the backend is elsewhere
npm install
npm run dev
```

## How it talks to the backend

| Call | Purpose |
|---|---|
| `GET {VITE_API_URL}/` | Health check; drives the ONLINE/OFFLINE indicator (polled every 10 s) |
| `POST {VITE_API_URL}/predict` | `multipart/form-data`, image in the field `file` |

All API code lives in `src/lib/api.ts`. The backend returns `classification`, `confidence` (e.g. `"98.18%"`), `risk_level` and `type`; the client converts these into the shape the UI renders.

Notes:
- The insight text and recommendation are fixed descriptions per class and risk level. They are not findings extracted from the uploaded image.
- "Session history" is kept in browser memory only and is cleared on refresh. The backend separately logs predictions to `backend/patient_data.json`.
- The 93.25% accuracy shown in the sidebar is the figure reported by the backend project; no evaluation code is included to reproduce it.
- Before deploying, restrict `allow_origins` in the backend's `main.py` from `*` to this app's URL.
