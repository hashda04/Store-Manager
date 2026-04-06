from sqlalchemy import Column, Integer, String, Numeric, DateTime, func
from app.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    brand = Column(String, nullable=True)
    unit = Column(String, nullable=False)
    buy_price = Column(Numeric(10, 2), nullable=False)
    sell_price = Column(Numeric(10, 2), nullable=False)
    min_stock = Column(Numeric(10, 3), nullable=False, server_default="5")
    created_at = Column(DateTime(timezone=True), server_default=func.now())