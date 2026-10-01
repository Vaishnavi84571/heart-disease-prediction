from datetime import datetime
from sqlalchemy import DateTime, Float, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base

class Prediction(Base):
    __tablename__ = "predictions"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    age: Mapped[int] = mapped_column(Integer)
    sex: Mapped[int] = mapped_column(Integer)
    cp: Mapped[int] = mapped_column(Integer)
    trestbps: Mapped[int] = mapped_column(Integer)
    chol: Mapped[int] = mapped_column(Integer)
    fbs: Mapped[int] = mapped_column(Integer)
    restecg: Mapped[int] = mapped_column(Integer)
    thalach: Mapped[int] = mapped_column(Integer)
    exang: Mapped[int] = mapped_column(Integer)
    oldpeak: Mapped[float] = mapped_column(Float)
    slope: Mapped[int] = mapped_column(Integer)
    ca: Mapped[int] = mapped_column(Integer)
    thal: Mapped[int] = mapped_column(Integer)
    prediction: Mapped[int] = mapped_column(Integer)
    probability: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="predictions")
