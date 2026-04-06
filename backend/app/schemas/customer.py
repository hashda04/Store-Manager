from pydantic import BaseModel
from datetime import datetime

class CustomerCreate(BaseModel):
    name: str
    phone: str

class CustomerOut(BaseModel):
    id: int
    name: str
    phone: str
    balance: float
    created_at: datetime

    class Config:
        from_attributes = True