from sqlalchemy.orm import Session
from app.models.item import Item
from app.models.stock_entry import StockEntry
from app.schemas.item import ItemCreate, ItemUpdate

def get_all_items(db: Session):
    items = db.query(Item).order_by(Item.category, Item.name).all()
    result = []
    for item in items:
        stock = _calculate_stock(db, item.id)
        result.append({
            "id": item.id,
            "name": item.name,
            "category": item.category or "Uncategorised",
            "brand": item.brand or "",
            "unit": item.unit,
            "buy_price": float(item.buy_price),
            "sell_price": float(item.sell_price),
            "min_stock": float(item.min_stock),
            "current_stock": stock,
            "is_low": stock <= float(item.min_stock),
            "created_at": item.created_at,
        })
    return result

def get_item(db: Session, item_id: int):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        return None
    stock = _calculate_stock(db, item_id)
    return {
        "id": item.id,
        "name": item.name,
        "category": item.category or "Uncategorised",
        "brand": item.brand or "",
        "unit": item.unit,
        "buy_price": float(item.buy_price),
        "sell_price": float(item.sell_price),
        "min_stock": float(item.min_stock),
        "current_stock": stock,
        "is_low": stock <= float(item.min_stock),
        "created_at": item.created_at,
    }

def create_item(db: Session, data: ItemCreate):
    item = Item(
        name=data.name,
        category=data.category,
        brand=data.brand,
        unit=data.unit,
        buy_price=data.buy_price,
        sell_price=data.sell_price,
        min_stock=data.min_stock or 5.0,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def update_item(db: Session, item_id: int, data: ItemUpdate):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

def delete_item(db: Session, item_id: int):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True

def get_categories(db: Session):
    items = db.query(Item.category).distinct().all()
    return [i.category for i in items if i.category]

def _calculate_stock(db: Session, item_id: int) -> float:
    latest_count = (
        db.query(StockEntry)
        .filter(StockEntry.item_id == item_id, StockEntry.type == "count")
        .order_by(StockEntry.noted_at.desc())
        .first()
    )
    if latest_count:
        restocks_after = (
            db.query(StockEntry)
            .filter(StockEntry.item_id == item_id, StockEntry.type == "restock", StockEntry.noted_at > latest_count.noted_at)
            .all()
        )
        return round(float(latest_count.quantity) + sum(float(r.quantity) for r in restocks_after), 3)
    restocks = db.query(StockEntry).filter(StockEntry.item_id == item_id, StockEntry.type == "restock").all()
    return round(sum(float(r.quantity) for r in restocks), 3)