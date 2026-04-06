from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.customer import Customer
from app.models.transaction import Transaction
from app.schemas.customer import CustomerCreate

def get_all_customers(db: Session):
    customers = db.query(Customer).all()
    result = []
    for c in customers:
        balance = _calculate_balance(db, c.id)
        result.append({
            "id": c.id,
            "name": c.name,
            "phone": c.phone,
            "balance": balance,
            "created_at": c.created_at
        })
    # Sort by balance descending
    result.sort(key=lambda x: x["balance"], reverse=True)
    return result

def get_customer(db: Session, customer_id: int):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        return None
    balance = _calculate_balance(db, customer_id)
    return {
        "id": customer.id,
        "name": customer.name,
        "phone": customer.phone,
        "balance": balance,
        "created_at": customer.created_at
    }

def create_customer(db: Session, data: CustomerCreate):
    customer = Customer(name=data.name, phone=data.phone)
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

def _calculate_balance(db: Session, customer_id: int) -> float:
    rows = db.query(Transaction).filter(Transaction.customer_id == customer_id).all()
    total = 0.0
    for row in rows:
        if row.type == "credit":
            total += float(row.amount)
        else:
            total -= float(row.amount)
    return round(total, 2)