import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://10.103.99.203:8000",
});

export interface Customer {
  id: number;
  name: string;
  phone: string;
  balance: number;
  created_at: string;
}

export interface Transaction {
  id: number;
  customer_id: number;
  type: "credit" | "payment";
  amount: number;
  note: string | null;
  created_at: string;
}

export interface Item {
  id: number;
  name: string;
  category: string;
  brand: string;
  unit: string;
  buy_price: number;
  sell_price: number;
  min_stock: number;
  current_stock: number;
  is_low: boolean;
  created_at: string;
}

export interface StockEntry {
  id: number;
  item_id: number;
  type: "restock" | "count";
  quantity: number;
  buy_price: number;
  sell_price: number;
  noted_at: string;
  created_at: string;
}

export interface Sale {
  id: number;
  item_id: number;
  bill_id: number | null;
  quantity_sold: number;
  sell_price: number;
  buy_price: number;
  profit: number;
  sold_at: string;
}

export interface Bill {
  id: number;
  total_amount: number;
  total_profit: number;
  created_at: string;
  sales: Sale[];
  sales_count?: number;
}

export interface ProfitSummary {
  today_profit: number;
  month_profit: number;
  year_profit: number;
  today_revenue: number;
  month_revenue: number;
  year_revenue: number;
}


export interface TodaySummary {
  date: string;
  bills_count: number;
  revenue: number;
  profit: number;
  udhaar_given: number;
  top_items: {
    id: number;
    name: string;
    brand: string;
    unit: string;
    qty_sold: number;
    revenue: number;
  }[];
}

export interface SupplierPayment {
  id: number;
  supplier_name: string;
  amount: number;
  note: string | null;
  paid_at: string;
  created_at: string;
}

export interface SupplierPayment {
  id: number;
  supplier_name: string;
  amount: number;
  note: string | null;
  paid_at: string;
  created_at: string;
}

export interface SupplierSummary {
  total_ever: number;
  this_month: number;
  this_year: number;
}


// Udhaar
export const getCustomers = () => api.get<Customer[]>("/customers/").then(r => r.data);
export const getCustomer = (id: number) => api.get<Customer>(`/customers/${id}`).then(r => r.data);
export const createCustomer = (name: string, phone: string) => api.post<Customer>("/customers/", { name, phone }).then(r => r.data);
export const getTransactions = (customerId: number) => api.get<Transaction[]>(`/transactions/customer/${customerId}`).then(r => r.data);
export const addTransaction = (customer_id: number, type: "credit" | "payment", amount: number, note?: string) => api.post<Transaction>("/transactions/", { customer_id, type, amount, note }).then(r => r.data);
export const deleteTransaction = (id: number) => api.delete(`/transactions/${id}`);
export const getTodaysCredits = () => api.get<Transaction[]>("/transactions/today").then(r => r.data);

// Stock
export const getItems = () => api.get<Item[]>("/items/").then(r => r.data);
export const getItem = (id: number) => api.get<Item>(`/items/${id}`).then(r => r.data);
export const createItem = (data: { name: string; category?: string; brand?: string; unit: string; buy_price: number; sell_price: number; min_stock?: number }) => api.post<Item>("/items/", data).then(r => r.data);
export const updateItem = (id: number, data: Partial<{ name: string; category: string; brand: string; unit: string; buy_price: number; sell_price: number; min_stock: number }>) => api.put<Item>(`/items/${id}`, data).then(r => r.data);
export const deleteItem = (id: number) => api.delete(`/items/${id}`);
export const getCategories = () => api.get<string[]>("/items/categories").then(r => r.data);
export const addStockEntry = (data: { item_id: number; type: "restock" | "count"; quantity: number; buy_price: number; sell_price: number }) => api.post<StockEntry>("/stock/entry", data).then(r => r.data);
export const getStockEntries = (itemId: number) => api.get<StockEntry[]>(`/stock/entries/${itemId}`).then(r => r.data);

// Sales
export const quickSell = (item_id: number, quantity: number) => api.post<Sale>("/sales/quick", { item_id, quantity }).then(r => r.data);
export const createBill = (items: { item_id: number; quantity: number; sell_price: number }[]) => api.post<Bill>("/sales/bill", { items }).then(r => r.data);
export const getProfitSummary = () => api.get<ProfitSummary>("/sales/profit").then(r => r.data);
export const getRecentBills = () => api.get<Bill[]>("/sales/bills").then(r => r.data);

export const getTodaySummary = () =>
  api.get<TodaySummary>("/sales/summary/today").then(r => r.data);

export const addSupplierPayment = (data: { supplier_name: string; amount: number; note?: string }) =>
  api.post<SupplierPayment>("/suppliers/payment", data).then(r => r.data);
export const getSupplierPayments = () =>
  api.get<SupplierPayment[]>("/suppliers/payments").then(r => r.data);
export const getSupplierSummary = () =>
  api.get<SupplierSummary>("/suppliers/summary").then(r => r.data);