from pydantic import BaseModel
from datetime import datetime
from typing import Literal, Optional

class StockEntryCreate(BaseModel):
    item_id: int
    type: Literal["restock", "count"]
    quantity: float
    buy_price: float
    sell_price: float
    noted_at: Optional[datetime] = None

class StockEntryOut(BaseModel):
    id: int
    item_id: int
    type: str
    quantity: float
    buy_price: float
    sell_price: float
    noted_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True