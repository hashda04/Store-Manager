from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.supplier_payment import SupplierPayment
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

router = APIRouter(prefix="/suppliers", tags=["suppliers"])

class SupplierPaymentCreate(BaseModel):
    supplier_name: str
    amount: float
    note: Optional[str] = None

@router.post("/payment", status_code=201)
def add_payment(data: SupplierPaymentCreate, db: Session = Depends(get_db)):
    payment = SupplierPayment(
        supplier_name=data.supplier_name,
        amount=data.amount,
        note=data.note,
        paid_at=datetime.now(timezone.utc),
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment

@router.get("/payments")
def get_payments(db: Session = Depends(get_db)):
    return db.query(SupplierPayment).order_by(SupplierPayment.paid_at.desc()).limit(50).all()

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

    all_payments = db.query(SupplierPayment).all()
    month_payments = db.query(SupplierPayment).filter(SupplierPayment.paid_at >= month_start).all()
    year_payments = db.query(SupplierPayment).filter(SupplierPayment.paid_at >= year_start).all()

    return {
        "total_ever": round(sum(float(p.amount) for p in all_payments), 2),
        "this_month": round(sum(float(p.amount) for p in month_payments), 2),
        "this_year": round(sum(float(p.amount) for p in year_payments), 2),
    }