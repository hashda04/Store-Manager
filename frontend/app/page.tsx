"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ChevronRight } from "lucide-react";
import { getCustomers, getItems, getProfitSummary, addStockEntry, Item } from "@/lib/api";

export default function Landing() {
  const router = useRouter();
  const [totalPending, setTotalPending] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [lowCount, setLowCount] = useState(0);
  const [todayProfit, setTodayProfit] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lowItems, setLowItems] = useState<Item[]>([]);
  const [restockModal, setRestockModal] = useState<Item | null>(null);
  const [restockQty, setRestockQty] = useState("");
  const [restocking, setRestocking] = useState(false);

  useEffect(() => {
    Promise.all([getCustomers(), getItems(), getProfitSummary()])
      .then(([customers, items, profit]) => {
        setTotalPending(customers.reduce((s, c) => s + (c.balance > 0 ? c.balance : 0), 0));
        setPendingCount(customers.filter(c => c.balance > 0).length);
        setItemCount(items.length);
        setLowCount(items.filter(i => i.is_low).length);
        setTodayProfit(profit.today_profit);
        setTodayRevenue(profit.today_revenue);
        setLowCount(items.filter(i => i.is_low).length);
        setLowItems(items.filter(i => i.is_low));
      })
      .finally(() => setLoading(false));
  }, []);

  const Card = ({ onClick, gradient, emoji, tag, title, children, linkColor }: any) => (
    <div
      onClick={onClick}
      style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", overflow: "hidden", cursor: "pointer" }}
      onTouchStart={e => (e.currentTarget.style.transform = "scale(0.98)")}
      onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
      onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ background: gradient, padding: "20px 20px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 4px", color: "rgba(255,255,255,0.7)" }}>{tag}</p>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", color: "white", fontSize: 26, fontWeight: 900, margin: 0, lineHeight: 1 }}>{title}</h2>
        </div>
        <div style={{ fontSize: 36 }}>{emoji}</div>
      </div>
      {children}
      <div style={{ padding: "0 20px 16px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: linkColor }}>Open</span>
        <ChevronRight size={14} color={linkColor} />
      </div>
    </div>
  );
  

  const StatRow = ({ left, right }: { left: { label: string; value: string; color: string }; right: { label: string; value: string; color: string } }) => (
    <div style={{ padding: "16px 20px", display: "flex" }}>
      <div style={{ flex: 1, borderRight: "1px solid #F3F4F6", paddingRight: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>{left.label}</p>
        <p style={{ fontSize: 20, fontWeight: 900, color: left.color, margin: 0 }}>{loading ? "—" : left.value}</p>
      </div>
      <div style={{ flex: 1, paddingLeft: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>{right.label}</p>
        <p style={{ fontSize: 20, fontWeight: 900, color: right.color, margin: 0 }}>{loading ? "—" : right.value}</p>
      </div>
    </div>
  );
  const handleRestock = async () => {
    if (!restockModal || !restockQty || Number(restockQty) <= 0) return;
    setRestocking(true);
    try {
      await addStockEntry({
        item_id: restockModal.id,
        type: "restock",
        quantity: Number(restockQty),
        buy_price: restockModal.buy_price,
        sell_price: restockModal.sell_price,
      });
      setRestockModal(null);
      setRestockQty("");
      const items = await getItems();
      setLowItems(items.filter(i => i.is_low));
      setLowCount(items.filter(i => i.is_low).length);
    } finally { setRestocking(false); }
  };
  

  return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #052e16 0%, #0A3D2E 50%, #166534 100%)", padding: "56px 20px 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: -30, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ position: "relative" }}>
          <p style={{ color: "#6EE7B7", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>Welcome to</p>
          <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "white", fontSize: 40, fontWeight: 900, lineHeight: 1, margin: "0 0 4px" }}>Appa's Store</h1>
          <p style={{ fontFamily: "var(--font-playfair), serif", color: "#34D399", fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Manager</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 500, margin: 0 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Udhaar */}
        <Card onClick={() => router.push("/udhaar")} gradient="linear-gradient(135deg, #052e16, #166534)" emoji="📒" tag="Customer Credit" title="Udhaar Book" linkColor="#166534">
          <StatRow
            left={{ label: "Total Pending", value: `₹${totalPending.toFixed(0)}`, color: "#EF4444" }}
            right={{ label: "Customers Due", value: `${pendingCount}`, color: "#111827" }}
          />
        </Card>

        {/* Stock */}
        <Card onClick={() => router.push("/stock")} gradient="linear-gradient(135deg, #1e3a5f, #2563EB)" emoji="📦" tag="Inventory" title="Stock Book" linkColor="#2563EB">
          <StatRow
            left={{ label: "Items Tracked", value: `${itemCount}`, color: "#111827" }}
            right={{ label: "Low Stock", value: `${lowCount}`, color: lowCount > 0 ? "#EF4444" : "#16A34A" }}
          />
        </Card>

        {/* Billing */}
        <Card onClick={() => router.push("/billing")} gradient="linear-gradient(135deg, #064e3b, #059669)" emoji="🧾" tag="Point of Sale" title="New Bill" linkColor="#059669">
          <StatRow
            left={{ label: "Today's Sales", value: `₹${todayRevenue.toFixed(0)}`, color: "#059669" }}
            right={{ label: "Today's Profit", value: `₹${todayProfit.toFixed(0)}`, color: "#16A34A" }}
          />
        </Card>

        {/* Profit */}
        <Card onClick={() => router.push("/profit")} gradient="linear-gradient(135deg, #713f12, #ca8a04)" emoji="📊" tag="Earnings" title="Profit Report" linkColor="#ca8a04">
          <div style={{ padding: "16px 20px" }}>
            <p style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500, margin: 0 }}>Daily, monthly and yearly profit from real sales</p>
          </div>
        </Card>

        {/* Low stock quick restock */}
        {lowItems.length > 0 && (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #FECACA", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #7f1d1d, #dc2626)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#FCA5A5", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 2px" }}>Needs Restocking</p>
                <h2 style={{ fontFamily: "var(--font-playfair), serif", color: "white", fontSize: 20, fontWeight: 900, margin: 0 }}>⚠ Low Stock Alert</h2>
              </div>
              <span style={{ fontSize: 28 }}>📦</span>
            </div>
            <div>
              {lowItems.slice(0, 5).map((item, idx) => (
                <div key={item.id}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: "0 0 2px" }}>{item.name}</p>
                      <p style={{ fontSize: 12, color: "#EF4444", fontWeight: 600, margin: 0 }}>Only {item.current_stock} {item.unit} left</p>
                    </div>
                    <button
                      onClick={() => setRestockModal(item)}
                      style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: "#DC2626", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}
                    >
                      + Restock
                    </button>
                  </div>
                  {idx < Math.min(lowItems.length, 5) - 1 && <div style={{ height: 1, background: "#FEF2F2", margin: "0 20px" }} />}
                </div>
              ))}
              {lowItems.length > 5 && (
                <div style={{ padding: "10px 20px", borderTop: "1px solid #FEF2F2" }}>
                  <button onClick={() => router.push("/stock")} style={{ background: "none", border: "none", color: "#DC2626", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>
                    +{lowItems.length - 5} more low stock items →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary */}
        <Card onClick={() => router.push("/summary")} gradient="linear-gradient(135deg, #1e1b4b, #4338ca)" emoji="📋" tag="End of Day" title="Daily Summary" linkColor="#4338ca">
          <div style={{ padding: "16px 20px" }}>
            <p style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500, margin: 0 }}>Today's bills, revenue, profit and top sellers</p>
          </div>
        </Card>
        {/* Suppliers */}
        <Card onClick={() => router.push("/suppliers")} gradient="linear-gradient(135deg, #134e4a, #0d9488)" emoji="🚚" tag="Stock Purchases" title="Supplier Log" linkColor="#0d9488">
          <div style={{ padding: "16px 20px" }}>
            <p style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500, margin: 0 }}>Track supplier payments and monthly stock expenses</p>
          </div>
        </Card>

        {/* Quick restock modal */}
      {restockModal && (
        <div onClick={e => e.target === e.currentTarget && setRestockModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", zIndex: 999 }}>
          <div style={{ background: "white", width: "100%", maxWidth: 384, margin: "0 auto", borderRadius: "28px 28px 0 0", padding: "20px 20px 40px", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ width: 36, height: 4, background: "#E5E7EB", borderRadius: 4, margin: "0 auto 24px" }} />
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 900, fontSize: 20, color: "#111827", margin: "0 0 4px" }}>Restock</h2>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 20px" }}>{restockModal.name} — currently {restockModal.current_stock} {restockModal.unit}</p>

            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>
              Quantity Added ({restockModal.unit})
            </p>
            <input
              type="number" placeholder="0" value={restockQty}
              onChange={e => setRestockQty(e.target.value)} autoFocus
              style={{ width: "100%", border: "2px solid #F3F4F6", borderRadius: 14, padding: "14px 16px", fontSize: 32, fontWeight: 900, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "var(--font-jakarta), sans-serif", marginBottom: 20 }}
              onFocus={e => e.target.style.borderColor = "#DC2626"}
              onBlur={e => e.target.style.borderColor = "#F3F4F6"}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setRestockModal(null); setRestockQty(""); }} style={{ flex: 1, border: "2px solid #F3F4F6", background: "white", borderRadius: 14, padding: "14px 0", fontSize: 14, fontWeight: 700, color: "#9CA3AF", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>Cancel</button>
              <button onClick={handleRestock} disabled={restocking || !restockQty}
                style={{ flex: 1, border: "none", background: "linear-gradient(135deg, #7f1d1d, #dc2626)", borderRadius: 14, padding: "14px 0", fontSize: 14, fontWeight: 800, color: "white", cursor: "pointer", opacity: (restocking || !restockQty) ? 0.5 : 1, fontFamily: "var(--font-jakarta), sans-serif" }}>
                {restocking ? "Saving..." : "Restock"}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}