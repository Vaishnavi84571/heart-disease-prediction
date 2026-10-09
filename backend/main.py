
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from models import user, prediction
from routes.auth import router as auth_router
from routes.prediction import router as prediction_router
from routes.user import router as user_router


# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI
app = FastAPI(
    title="Heart Disease Prediction API",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Convert Vercel service paths to the API paths used by FastAPI
@app.middleware("http")
async def normalize_api_path(request, call_next):
    prefix = "/svc/api"
    path = request.scope["path"]

    if path == prefix or path.startswith(prefix + "/"):
        request.scope["path"] = "/api" + path[len(prefix):]

    return await call_next(request)


# Register API routes
app.include_router(auth_router)
app.include_router(prediction_router)
app.include_router(user_router)


# Health-check endpoints
@app.get("/api")
def api_root():
    return {
        "message": "Heart Disease Prediction API",
        "status": "ok",
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}