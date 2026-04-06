from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SaleItemInput(BaseModel):
    item_id: int
    quantity: float
    sell_price: float

class QuickSellInput(BaseModel):
    item_id: int
    quantity: float

class BillInput(BaseModel):
    items: list[SaleItemInput]

class SaleOut(BaseModel):
    id: int
    item_id: int
    bill_id: Optional[int]
    quantity_sold: float
    sell_price: float
    buy_price: float
    profit: float
    sold_at: datetime

    class Config:
        from_attributes = True

class BillOut(BaseModel):
    id: int
    total_amount: float
    total_profit: float
    created_at: datetime
    sales: list[SaleOut] = []

    class Config:
        from_attributes = True