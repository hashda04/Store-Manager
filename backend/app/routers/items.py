from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.item import ItemCreate, ItemUpdate
from app.services import item_service

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return item_service.get_categories(db)

@router.get("/")
def list_items(db: Session = Depends(get_db)):
    return item_service.get_all_items(db)

@router.post("/", status_code=201)
def create_item(data: ItemCreate, db: Session = Depends(get_db)):
    return item_service.create_item(db, data)

@router.get("/{item_id}")
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = item_service.get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/{item_id}")
def update_item(item_id: int, data: ItemUpdate, db: Session = Depends(get_db)):
    item = item_service.update_item(db, item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.delete("/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    success = item_service.delete_item(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")