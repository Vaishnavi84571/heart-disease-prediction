from pathlib import Path
import joblib
import pandas as pd

MODEL_PATH = Path(__file__).resolve().parents[1] / "ml" / "heart_model.joblib"
FEATURES = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"]
_model = None

def get_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model

def predict(values: dict):
    row = pd.DataFrame([[values[f] for f in FEATURES]], columns=FEATURES)
    model = get_model()
    prediction = int(model.predict(row)[0])
    probability = float(model.predict_proba(row)[0][1])
    return prediction, probability
