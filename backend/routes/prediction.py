from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.prediction import Prediction
from models.user import User
from schemas.prediction import PredictionInput
from routes.user import current_user
from services.prediction_service import predict

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])

@router.post("")
def make_prediction(payload: PredictionInput, user: User = Depends(current_user), db: Session = Depends(get_db)):
    values = payload.model_dump()
    result, probability = predict(values)
    record = Prediction(user_id=user.id, prediction=result, probability=probability, **values)
    db.add(record); db.commit(); db.refresh(record)
    return {"id": record.id, "prediction": result, "probability": probability, "created_at": record.created_at}

@router.get("/history")
def history(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(Prediction).filter(Prediction.user_id == user.id).order_by(Prediction.created_at.desc()).limit(100).all()
    return [{"id": r.id, "prediction": r.prediction, "probability": r.probability, "created_at": r.created_at, "age": r.age} for r in rows]
