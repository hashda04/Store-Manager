from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    bill_id = Column(Integer, ForeignKey("bills.id"), nullable=True)
    quantity_sold = Column(Numeric(10, 3), nullable=False)
    sell_price = Column(Numeric(10, 2), nullable=False)
    buy_price = Column(Numeric(10, 2), nullable=False)
    profit = Column(Numeric(10, 2), nullable=False)
    sold_at = Column(DateTime(timezone=True), server_default=func.now())

    item = relationship("Item", backref="sales")
    bill = relationship("Bill", backref="sales")