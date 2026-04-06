from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.stock_entry import StockEntryCreate
from app.services import stock_service

router = APIRouter(prefix="/stock", tags=["stock"])

@router.post("/entry", status_code=201)
def add_entry(data: StockEntryCreate, db: Session = Depends(get_db)):
    entry = stock_service.add_entry(db, data)
    if not entry:
        raise HTTPException(status_code=404, detail="Item not found")
    return entry

@router.get("/entries/{item_id}")
def get_entries(item_id: int, db: Session = Depends(get_db)):
    return stock_service.get_entries_for_item(db, item_id)

@router.get("/profit")
def get_profit(db: Session = Depends(get_db)):
    return stock_service.get_profit_summary(db)