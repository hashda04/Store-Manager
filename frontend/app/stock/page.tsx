"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getItems, Item } from "@/lib/api";
import { Search, Plus, Package, ChevronRight, AlertTriangle } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function StockPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const headerRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    getItems().then(setItems).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 999;
      setShowSticky(headerBottom <= 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];
  const lowStock = items.filter(i => i.is_low).length;

  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.brand?.toLowerCase().includes(search.toLowerCase()) ||
      i.category?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || i.category === activeCategory;
    return matchSearch && matchCat;
  });

  // Group by category
  const grouped = filtered.reduce((acc, item) => {
    const cat = item.category || "Uncategorised";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", paddingBottom: 80 }}>

      {/* Sticky bar */}
      <div style={{
        position: "fixed", top: 0, left: "50%",
        transform: `translateX(-50%) translateY(${showSticky ? "0%" : "-100%"})`,
        width: "100%", maxWidth: 384, zIndex: 999,
        transition: "transform 0.25s ease",
      }}>
        <div style={{ background: "#1e3a5f", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 12px" }}>
            <Search size={14} color="rgba(255,255,255,0.5)" style={{ flexShrink: 0 }} />
            <input type="text" placeholder="Search item..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: "white", fontSize: 14, fontWeight: 500, fontFamily: "var(--font-jakarta), sans-serif" }} />
            {search && <button onClick={() => setSearch("")} style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}>×</button>}
          </div>
          <button onClick={() => router.push("/stock/add-item")} style={{ width: 40, height: 40, flexShrink: 0, background: "#2563EB", border: "none", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Plus size={18} color="white" />
          </button>
        </div>
      </div>

      {/* Header */}
      <div ref={headerRef} style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #1e40af 50%, #2563EB 100%)", padding: "56px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <button onClick={() => router.push("/")} style={{ color: "#BAE6FD", fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>← Home</button>
            <button onClick={() => router.push("/stock/add-item")} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 14px", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>
              <Plus size={13} /> Add Item
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "white", fontSize: 44, fontWeight: 900, lineHeight: 1, margin: 0 }}>Stock</h1>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "#93C5FD", fontSize: 44, fontWeight: 900, lineHeight: 1, margin: 0 }}>Book.</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Items", value: `${items.length}`, color: "#BAE6FD" },
              { label: "Low Stock", value: `${lowStock}`, color: lowStock > 0 ? "#FCA5A5" : "#BAE6FD" },
              { label: "Categories", value: `${categories.length - 1}`, color: "#BAE6FD" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "10px 12px" }}>
                <p style={{ color: stat.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>{stat.label}</p>
                <p style={{ color: "white", fontWeight: 700, fontSize: 20, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky search + category filter */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#1e40af", padding: "10px 16px 0", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "9px 12px" }}>
            <Search size={14} color="rgba(255,255,255,0.5)" style={{ flexShrink: 0 }} />
            <input type="text" placeholder="Search item, brand, category..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: "white", fontSize: 14, fontWeight: 500, fontFamily: "var(--font-jakarta), sans-serif" }} />
            {search && <button onClick={() => setSearch("")} style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}>×</button>}
          </div>
          <button onClick={() => router.push("/stock/add-item")} style={{ width: 40, height: 40, flexShrink: 0, background: "#2563EB", border: "none", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 10px rgba(37,99,235,0.4)" }}>
            <Plus size={17} color="white" />
          </button>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                border: `1.5px solid ${activeCategory === cat ? "white" : "rgba(255,255,255,0.2)"}`,
                background: activeCategory === cat ? "white" : "transparent",
                color: activeCategory === cat ? "#1e40af" : "rgba(255,255,255,0.7)",
                cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif",
              }}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 16px" }}>

        {/* Low stock alert banner */}
        {lowStock > 0 && (
          <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 16, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <AlertTriangle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", margin: 0 }}>{lowStock} item{lowStock > 1 ? "s are" : " is"} running low — restock soon</p>
          </div>
        )}

        {loading ? (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", overflow: "hidden" }}>
            {[1, 2, 3].map((i, idx) => (
              <div key={i}>
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F3F4F6" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 14, width: "50%", background: "#F3F4F6", borderRadius: 6, marginBottom: 6 }} />
                    <div style={{ height: 11, width: "35%", background: "#F9FAFB", borderRadius: 6 }} />
                  </div>
                </div>
                {idx < 2 && <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />}
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", padding: "48px 20px", textAlign: "center" }}>
            <Package size={28} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
            <p style={{ color: "#6B7280", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>No items found</p>
            <p style={{ color: "#D1D5DB", fontSize: 12, margin: 0 }}>Try a different search</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, catItems]) => (
            <div key={category} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "#6B7280", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px 4px" }}>
                {category} ({catItems.length})
              </p>
              <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #EEEEE8", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                {catItems.map((item, idx) => {
                  const margin = ((item.sell_price - item.buy_price) / item.buy_price * 100).toFixed(0);
                  return (
                    <div key={item.id}>
                      <div
                        onClick={() => router.push(`/stock/${item.id}`)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", cursor: "pointer" }}
                        onTouchStart={e => (e.currentTarget.style.background = "#F9FAFB")}
                        onTouchEnd={e => (e.currentTarget.style.background = "transparent")}
                        onMouseDown={e => (e.currentTarget.style.background = "#F9FAFB")}
                        onMouseUp={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: item.is_low ? "#FEF2F2" : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {item.is_low ? <AlertTriangle size={18} color="#EF4444" /> : <Package size={18} color="#2563EB" />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 700, color: "#111827", fontSize: 14, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.name} {item.brand ? `— ${item.brand}` : ""}
                          </p>
                          <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                            ₹{item.sell_price}/{item.unit} · {margin}% margin
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 2px", color: item.is_low ? "#EF4444" : "#111827" }}>
                              {item.current_stock} {item.unit}
                            </p>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: item.is_low ? "#FEF2F2" : "#F0FDF4", color: item.is_low ? "#EF4444" : "#16A34A" }}>
                              {item.is_low ? "low" : "ok"}
                            </span>
                          </div>
                          <ChevronRight size={13} color="#E5E7EB" />
                        </div>
                      </div>
                      {idx < catItems.length - 1 && <div style={{ height: 1, background: "#F9FAFB", margin: "0 16px" }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}