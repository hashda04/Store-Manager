from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.transaction import Transaction
from app.models.customer import Customer
from app.schemas.transaction import TransactionCreate
from sqlalchemy import func

def get_transactions_for_customer(db: Session, customer_id: int):
    return (
        db.query(Transaction)
        .filter(Transaction.customer_id == customer_id)
        .order_by(Transaction.created_at.desc())
        .all()
    )

def add_transaction(db: Session, data: TransactionCreate):
    # Validate customer exists
    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        return None

    transaction = Transaction(
        customer_id=data.customer_id,
        type=data.type,
        amount=data.amount,
        note=data.note
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

def delete_transaction(db: Session, transaction_id: int):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        return False
    db.delete(transaction)
    db.commit()
    return True

def get_todays_credits(db: Session):
    today = datetime.now(timezone.utc).date()
    rows = (
        db.query(Transaction)
        .filter(
            Transaction.type == "credit",
            func.date(Transaction.created_at) == today
        )
        .order_by(Transaction.created_at.desc())
        .all()
    )
    return rows