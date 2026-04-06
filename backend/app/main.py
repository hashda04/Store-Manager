from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import customers, transactions, items, stock, sales
import app.models
from app.routers import customers, transactions, items, stock, sales, suppliers

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Store Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)
app.include_router(transactions.router)
app.include_router(items.router)
app.include_router(stock.router)
app.include_router(sales.router)
app.include_router(suppliers.router)

@app.get("/")
def root():
    return {"status": "Store Manager API is running"}