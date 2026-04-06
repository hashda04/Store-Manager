from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.transaction import TransactionCreate
from app.services import transaction_service

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/today")
def todays_credits(db: Session = Depends(get_db)):
    return transaction_service.get_todays_credits(db)

@router.get("/customer/{customer_id}")
def get_customer_transactions(customer_id: int, db: Session = Depends(get_db)):
    return transaction_service.get_transactions_for_customer(db, customer_id)

@router.post("/", status_code=201)
def add_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    result = transaction_service.add_transaction(db, data)
    if not result:
        raise HTTPException(status_code=404, detail="Customer not found")
    return result

@router.delete("/{transaction_id}", status_code=204)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    success = transaction_service.delete_transaction(db, transaction_id)
    if not success:
        raise HTTPException(status_code=404, detail="Transaction not found")