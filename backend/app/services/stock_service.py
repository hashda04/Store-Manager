from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone, timedelta
from app.models.stock_entry import StockEntry
from app.models.item import Item
from app.schemas.stock_entry import StockEntryCreate

def add_entry(db: Session, data: StockEntryCreate):
    item = db.query(Item).filter(Item.id == data.item_id).first()
    if not item:
        return None
    entry = StockEntry(
        item_id=data.item_id,
        type=data.type,
        quantity=data.quantity,
        buy_price=data.buy_price,
        sell_price=data.sell_price,
        noted_at=data.noted_at or datetime.now(timezone.utc),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

def get_entries_for_item(db: Session, item_id: int):
    return (
        db.query(StockEntry)
        .filter(StockEntry.item_id == item_id)
        .order_by(StockEntry.noted_at.desc())
        .all()
    )

def get_profit_summary(db: Session):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

    items = db.query(Item).all()

    today_profit = 0.0
    month_profit = 0.0
    year_profit = 0.0

    for item in items:
        entries = (
            db.query(StockEntry)
            .filter(StockEntry.item_id == item.id)
            .order_by(StockEntry.noted_at.asc())
            .all()
        )
        today_profit += _calc_profit_between(entries, today_start, now)
        month_profit += _calc_profit_between(entries, month_start, now)
        year_profit += _calc_profit_between(entries, year_start, now)

    return {
        "today": round(today_profit, 2),
        "this_month": round(month_profit, 2),
        "this_year": round(year_profit, 2),
    }

def _calc_profit_between(entries, start: datetime, end: datetime) -> float:
    profit = 0.0
    counts_in_range = [e for e in entries if e.type == "count" and start <= e.noted_at <= end]

    for i, count in enumerate(counts_in_range):
        # Find previous entry (count or restock) before this count
        prev_entries = [e for e in entries if e.noted_at < count.noted_at]
        if not prev_entries:
            continue
        prev = max(prev_entries, key=lambda e: e.noted_at)
        prev_qty = float(prev.quantity)
        curr_qty = float(count.quantity)
        sold = prev_qty - curr_qty
        if sold > 0:
            margin = float(count.sell_price) - float(count.buy_price)
            profit += sold * margin

    return profit