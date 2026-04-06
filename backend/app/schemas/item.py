from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ItemCreate(BaseModel):
    name: str
    category: Optional[str] = None
    brand: Optional[str] = None
    unit: str
    buy_price: float
    sell_price: float
    min_stock: Optional[float] = 5.0

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    unit: Optional[str] = None
    buy_price: Optional[float] = None
    sell_price: Optional[float] = None
    min_stock: Optional[float] = None

class ItemOut(BaseModel):
    id: int
    name: str
    category: Optional[str]
    brand: Optional[str]
    unit: str
    buy_price: float
    sell_price: float
    min_stock: float
    current_stock: float
    created_at: datetime

    class Config:
        from_attributes = True