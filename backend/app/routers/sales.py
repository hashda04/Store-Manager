from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.sale import QuickSellInput, BillInput
from app.services import sale_service

router = APIRouter(prefix="/sales", tags=["sales"])

@router.post("/quick", status_code=201)
def quick_sell(data: QuickSellInput, db: Session = Depends(get_db)):
    sale, error = sale_service.quick_sell(db, data)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return sale

@router.post("/bill", status_code=201)
def create_bill(data: BillInput, db: Session = Depends(get_db)):
    bill, error = sale_service.create_bill(db, data)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return bill

@router.get("/profit")
def get_profit(db: Session = Depends(get_db)):
    return sale_service.get_profit_summary(db)

@router.get("/bills")
def get_bills(db: Session = Depends(get_db)):
    return sale_service.get_recent_bills(db)
@router.get("/summary/today")
def today_summary(db: Session = Depends(get_db)):
    return sale_service.get_today_summary(db)