from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from models import user, prediction
from routes.auth import router as auth_router
from routes.prediction import router as prediction_router
from routes.user import router as user_router

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Heart Disease Prediction API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth_router)
app.include_router(prediction_router)
app.include_router(user_router)

@app.get("/api")
def api_root():
    return {"message": "Heart Disease Prediction API", "status": "ok"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}
