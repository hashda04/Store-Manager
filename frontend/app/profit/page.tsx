"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfitSummary, getItems, getRecentBills, ProfitSummary, Item, Bill } from "@/lib/api";
import { TrendingUp, ShoppingBag } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function ProfitPage() {
  const router = useRouter();
  const [profit, setProfit] = useState<ProfitSummary | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProfitSummary(), getItems(), getRecentBills()])
      .then(([p, i, b]) => { setProfit(p); setItems(i); setBills(b); })
      .finally(() => setLoading(false));
  }, []);

  const totalStockValue = items.reduce((s, i) => s + (i.current_stock * i.buy_price), 0);
  const totalSellValue = items.reduce((s, i) => s + (i.current_stock * i.sell_price), 0);

  return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #713f12 0%, #92400e 50%, #b45309 100%)", padding: "56px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative" }}>
          <button onClick={() => router.push("/")} style={{ color: "#FEF9C3", fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif", marginBottom: 16, display: "block" }}>← Home</button>
          <p style={{ color: "#FEF9C3", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>Your Store's</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "white", fontSize: 44, fontWeight: 900, lineHeight: 1, margin: 0 }}>Profit</h1>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "#FCD34D", fontSize: 44, fontWeight: 900, lineHeight: 1, margin: 0 }}>Report.</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Today", value: profit ? `₹${profit.today_profit.toFixed(0)}` : "—", color: "#FEF9C3" },
              { label: "Month", value: profit ? `₹${profit.month_profit.toFixed(0)}` : "—", color: "#FCD34D" },
              { label: "Year", value: profit ? `₹${profit.year_profit.toFixed(0)}` : "—", color: "#FCD34D" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "10px 12px" }}>
                <p style={{ color: stat.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>{stat.label}</p>
                <p style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>

        {/* Revenue vs Profit */}
        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>Revenue vs Profit</p>
        <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", overflow: "hidden", marginBottom: 16 }}>
          {[
            { period: "Today", revenue: profit?.today_revenue ?? 0, profit: profit?.today_profit ?? 0 },
            { period: "This Month", revenue: profit?.month_revenue ?? 0, profit: profit?.month_profit ?? 0 },
            { period: "This Year", revenue: profit?.year_revenue ?? 0, profit: profit?.year_profit ?? 0 },
          ].map((row, idx) => (
            <div key={row.period}>
              <div style={{ padding: "16px 20px" }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#374151", margin: "0 0 8px" }}>{row.period}</p>
                <div style={{ display: "flex", gap: 0 }}>
                  <div style={{ flex: 1, borderRight: "1px solid #F3F4F6", paddingRight: 16 }}>
                    <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, margin: "0 0 2px" }}>Revenue</p>
                    <p style={{ fontSize: 18, fontWeight: 900, color: "#2563EB", margin: 0 }}>₹{loading ? "—" : row.revenue.toFixed(0)}</p>
                  </div>
                  <div style={{ flex: 1, paddingLeft: 16 }}>
                    <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, margin: "0 0 2px" }}>Profit</p>
                    <p style={{ fontSize: 18, fontWeight: 900, color: "#16A34A", margin: 0 }}>₹{loading ? "—" : row.profit.toFixed(0)}</p>
                  </div>
                </div>
              </div>
              {idx < 2 && <div style={{ height: 1, background: "#F9FAFB" }} />}
            </div>
          ))}
        </div>

        {/* Stock value */}
        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>Current Stock Value</p>
        <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", overflow: "hidden", marginBottom: 16 }}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1, padding: "20px", borderRight: "1px solid #F3F4F6" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Cost Value</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: "#EF4444", margin: "0 0 2px" }}>₹{totalStockValue.toFixed(0)}</p>
              <p style={{ fontSize: 11, color: "#D1D5DB", margin: 0 }}>what you paid</p>
            </div>
            <div style={{ flex: 1, padding: "20px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Sell Value</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: "#16A34A", margin: "0 0 2px" }}>₹{totalSellValue.toFixed(0)}</p>
              <p style={{ fontSize: 11, color: "#D1D5DB", margin: 0 }}>if sold everything</p>
            </div>
          </div>
          <div style={{ height: 1, background: "#F9FAFB" }} />
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: 0 }}>Potential Profit</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: "#ca8a04", margin: 0 }}>₹{(totalSellValue - totalStockValue).toFixed(0)}</p>
          </div>
        </div>

        {/* Recent bills */}
        {bills.length > 0 && (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>Recent Bills</p>
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", overflow: "hidden", marginBottom: 16 }}>
              {bills.slice(0, 10).map((bill, idx) => (
                <div key={bill.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <ShoppingBag size={16} color="#16A34A" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: "0 0 2px" }}>
                        Bill #{bill.id} · {bill.sales?.length ?? 0} items
                      </p>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                        {new Date(bill.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 900, fontSize: 15, color: "#111827", margin: "0 0 2px" }}>₹{Number(bill.total_amount).toFixed(0)}</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", margin: 0 }}>+₹{Number(bill.total_profit).toFixed(0)}</p>
                    </div>
                  </div>
                  {idx < Math.min(bills.length, 10) - 1 && <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Per item margin */}
        {items.length > 0 && (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>Per Item Margin</p>
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", overflow: "hidden" }}>
              {items.map((item, idx) => {
                const margin = (((item.sell_price - item.buy_price) / item.buy_price) * 100).toFixed(1);
                const profitPer = (item.sell_price - item.buy_price).toFixed(2);
                return (
                  <div key={item.id}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name} {item.brand ? `— ${item.brand}` : ""}
                        </p>
                        <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>₹{profitPer} profit per {item.unit}</p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontWeight: 800, fontSize: 15, color: "#16A34A", margin: "0 0 2px" }}>{margin}%</p>
                        <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{item.current_stock} {item.unit} left</p>
                      </div>
                    </div>
                    {idx < items.length - 1 && <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}