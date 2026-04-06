from pydantic import BaseModel
from datetime import datetime
from typing import Literal, Optional

class TransactionCreate(BaseModel):
    customer_id: int
    type: Literal["credit", "payment"]
    amount: float
    note: Optional[str] = None

class TransactionOut(BaseModel):
    id: int
    customer_id: int
    type: str
    amount: float
    note: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True