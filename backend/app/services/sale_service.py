from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.sale import Sale
from app.models.bill import Bill
from app.models.item import Item
from app.models.stock_entry import StockEntry
from app.schemas.sale import QuickSellInput, BillInput


def quick_sell(db: Session, data: QuickSellInput):
    item = db.query(Item).filter(Item.id == data.item_id).first()
    if not item:
        return None, "Item not found"

    current_stock = _get_current_stock(db, data.item_id)
    if current_stock < data.quantity:
        return None, f"Not enough stock. Available: {current_stock} {item.unit}"

    profit = float(item.sell_price - item.buy_price) * data.quantity

    sale = Sale(
        item_id=data.item_id,
        quantity_sold=data.quantity,
        sell_price=item.sell_price,
        buy_price=item.buy_price,
        profit=profit,
    )
    db.add(sale)

    new_stock = current_stock - data.quantity
    entry = StockEntry(
        item_id=data.item_id,
        type="count",
        quantity=new_stock,
        buy_price=item.buy_price,
        sell_price=item.sell_price,
        noted_at=datetime.now(timezone.utc),
    )
    db.add(entry)
    db.commit()
    db.refresh(sale)
    return sale, None


def create_bill(db: Session, data: BillInput):
    total_amount = 0.0
    total_profit = 0.0
    sales_data = []

    for sale_item in data.items:
        item = db.query(Item).filter(Item.id == sale_item.item_id).first()
        if not item:
            return None, f"Item {sale_item.item_id} not found"
        current_stock = _get_current_stock(db, sale_item.item_id)
        if current_stock < sale_item.quantity:
            return None, f"Not enough stock for {item.name}. Available: {current_stock} {item.unit}"
        profit = (sale_item.sell_price - float(item.buy_price)) * sale_item.quantity
        total_amount += sale_item.sell_price * sale_item.quantity
        total_profit += profit
        sales_data.append((item, sale_item, profit, current_stock))

    bill = Bill(total_amount=total_amount, total_profit=total_profit)
    db.add(bill)
    db.flush()

    for item, sale_item, profit, current_stock in sales_data:
        sale = Sale(
            item_id=sale_item.item_id,
            bill_id=bill.id,
            quantity_sold=sale_item.quantity,
            sell_price=sale_item.sell_price,
            buy_price=item.buy_price,
            profit=profit,
        )
        db.add(sale)

        new_stock = current_stock - sale_item.quantity
        entry = StockEntry(
            item_id=sale_item.item_id,
            type="count",
            quantity=new_stock,
            buy_price=item.buy_price,
            sell_price=item.sell_price,
            noted_at=datetime.now(timezone.utc),
        )
        db.add(entry)

    db.commit()
    db.refresh(bill)
    return bill, None


def get_profit_summary(db: Session):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

    def sum_profit(start):
        sales = db.query(Sale).filter(Sale.sold_at >= start).all()
        return round(sum(float(s.profit) for s in sales), 2)

    def sum_revenue(start):
        sales = db.query(Sale).filter(Sale.sold_at >= start).all()
        return round(sum(float(s.sell_price) * float(s.quantity_sold) for s in sales), 2)

    return {
        "today_profit": sum_profit(today_start),
        "month_profit": sum_profit(month_start),
        "year_profit": sum_profit(year_start),
        "today_revenue": sum_revenue(today_start),
        "month_revenue": sum_revenue(month_start),
        "year_revenue": sum_revenue(year_start),
    }


def get_recent_bills(db: Session, limit: int = 20):
    bills = db.query(Bill).order_by(Bill.created_at.desc()).limit(limit).all()
    result = []
    for bill in bills:
        from app.models.sale import Sale as SaleModel
        sales_count = db.query(SaleModel).filter(SaleModel.bill_id == bill.id).count()
        result.append({
            "id": bill.id,
            "total_amount": float(bill.total_amount),
            "total_profit": float(bill.total_profit),
            "created_at": bill.created_at,
            "sales_count": sales_count,
        })
    return result


def get_today_summary(db: Session):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    today_bills = db.query(Bill).filter(Bill.created_at >= today_start).all()
    today_sales = db.query(Sale).filter(Sale.sold_at >= today_start).all()

    revenue = round(sum(float(s.sell_price) * float(s.quantity_sold) for s in today_sales), 2)
    profit = round(sum(float(s.profit) for s in today_sales), 2)

    item_totals: dict = {}
    for s in today_sales:
        if s.item_id not in item_totals:
            item_totals[s.item_id] = {"qty": 0.0, "revenue": 0.0}
        item_totals[s.item_id]["qty"] += float(s.quantity_sold)
        item_totals[s.item_id]["revenue"] += float(s.sell_price) * float(s.quantity_sold)

    top_items = []
    for item_id, data in sorted(item_totals.items(), key=lambda x: x[1]["revenue"], reverse=True)[:5]:
        item = db.query(Item).filter(Item.id == item_id).first()
        if item:
            top_items.append({
                "id": item.id,
                "name": item.name,
                "brand": item.brand or "",
                "unit": item.unit,
                "qty_sold": round(data["qty"], 2),
                "revenue": round(data["revenue"], 2),
            })

    from app.models.transaction import Transaction
    today_udhaar = db.query(Transaction).filter(
        Transaction.type == "credit",
        Transaction.created_at >= today_start
    ).all()
    udhaar_total = round(sum(float(t.amount) for t in today_udhaar), 2)

    return {
        "date": now.strftime("%d %B %Y"),
        "bills_count": len(today_bills),
        "revenue": revenue,
        "profit": profit,
        "udhaar_given": udhaar_total,
        "top_items": top_items,
    }


def _get_current_stock(db: Session, item_id: int) -> float:
    latest_count = (
        db.query(StockEntry)
        .filter(StockEntry.item_id == item_id, StockEntry.type == "count")
        .order_by(StockEntry.noted_at.desc())
        .first()
    )
    if latest_count:
        restocks_after = (
            db.query(StockEntry)
            .filter(
                StockEntry.item_id == item_id,
                StockEntry.type == "restock",
                StockEntry.noted_at > latest_count.noted_at
            )
            .all()
        )
        return round(float(latest_count.quantity) + sum(float(r.quantity) for r in restocks_after), 3)
    restocks = db.query(StockEntry).filter(StockEntry.item_id == item_id, StockEntry.type == "restock").all()
    return round(sum(float(r.quantity) for r in restocks), 3)