# HeartPredict — Heart Disease Prediction App

A full-stack educational/decision-support application built from the supplied `heart.csv` dataset. It includes:

- React + Vite frontend
- FastAPI backend
- Login and signup with password hashing and JWT authentication
- Prediction form using the dataset's exact 13 input features
- Saved prediction history per user
- PostgreSQL support for production and SQLite for local development
- Scikit-learn Logistic Regression pipeline with StandardScaler
- Vercel Services configuration for one project with frontend + backend

## Dataset

The supplied dataset contains 1,025 rows and these columns:

`age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal, target`

`target` is the label. The model uses the other 13 columns as inputs.

## Model

`backend/ml/train_model.py` performs a stratified 80/20 split, evaluates a Logistic Regression pipeline, then refits it on the full dataset for deployment. The current holdout metrics from the supplied CSV are stored in `backend/ml/metrics.json`.

Do not interpret the model probability as a clinical probability or diagnosis. Dataset characteristics, possible duplicates, collection practices, and external validation can materially affect real-world performance.

## Local setup

### Backend

Windows PowerShell:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python ml/train_model.py
fastapi dev main.py
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

For local Vite development, create `frontend/.env` if the API is not proxied:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Then open the Vite URL shown in the terminal.

## Production database

Vercel serverless instances should not use local SQLite as the production persistence layer. Provision a managed PostgreSQL database and set these Vercel environment variables:

```env
DATABASE_URL=your-postgresql-connection-string
SECRET_KEY=long-random-production-secret
ACCESS_TOKEN_MINUTES=1440
```

Never commit `.env` or production secrets.

## Vercel deployment

This project uses Vercel Services with a Vite frontend and FastAPI backend. Vercel's current Vite + FastAPI example uses a monorepo with `frontend/`, `backend/`, and `vercel.json`, with service routing through a rewrite. See the official Vercel reference for the current Services syntax.

Install/update the CLI:

```powershell
npm install -g vercel@latest
```

From the project root:

```powershell
vercel login
vercel link
vercel deploy --prod
```

Add `DATABASE_URL`, `SECRET_KEY`, and `ACCESS_TOKEN_MINUTES` in the Vercel project Environment Variables before the production deployment.

## Security notes

This starter is suitable for a student/demo project. Before using real patient information, add stronger production controls such as secure HTTP-only cookies instead of localStorage tokens, CSRF protections where applicable, strict CORS, rate limiting, audit logging, encryption, data retention rules, access controls, and appropriate legal/privacy review.
