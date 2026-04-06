"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getItem, getStockEntries, addStockEntry, updateItem, deleteItem, Item, StockEntry } from "@/lib/api";
import { ArrowLeft, Package, TrendingUp, TrendingDown, Edit2, Trash2 } from "lucide-react";

export default function ItemDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"restock" | "count" | "edit" | null>(null);
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    const [i, e] = await Promise.all([getItem(Number(id)), getStockEntries(Number(id))]);
    setItem(i);
    setEntries(e);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const openModal = (type: "restock" | "count" | "edit") => {
    if (item) { setBuyPrice(String(item.buy_price)); setSellPrice(String(item.sell_price)); }
    setQuantity("");
    setModal(type);
  };

  const handleSubmit = async () => {
    if (!quantity || Number(quantity) < 0) return;
    setSubmitting(true);
    try {
      if (modal === "edit") {
        await updateItem(Number(id), { buy_price: Number(buyPrice), sell_price: Number(sellPrice) });
      } else {
        await addStockEntry({ item_id: Number(id), type: modal!, quantity: Number(quantity), buy_price: Number(buyPrice), sell_price: Number(sellPrice) });
      }
      setModal(null);
      await fetchData();
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this item? All stock history will be lost.")) return;
    await deleteItem(Number(id));
    router.push("/stock");
  };

  if (loading) return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#2563EB", fontWeight: 700 }}>Loading...</p>
    </div>
  );

  if (!item) return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#9CA3AF" }}>Item not found</p>
    </div>
  );

  const margin = (((item.sell_price - item.buy_price) / item.buy_price) * 100).toFixed(1);
  const profitPerUnit = (item.sell_price - item.buy_price).toFixed(2);

  return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", paddingBottom: 20 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #1e40af 50%, #2563EB 100%)", padding: "56px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 6, color: "#BAE6FD", fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>
              <ArrowLeft size={15} /> Back
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openModal("edit")} style={{ width: 36, height: 36, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Edit2 size={14} color="white" />
              </button>
              <button onClick={handleDelete} style={{ width: 36, height: 36, background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Trash2 size={14} color="#FCA5A5" />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 54, height: 54, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Package size={26} color="white" />
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "white", fontSize: 28, fontWeight: 900, margin: "0 0 2px", lineHeight: 1 }}>{item.name}</h1>
              <p style={{ color: "#BAE6FD", fontSize: 13, fontWeight: 600, margin: 0 }}>per {item.unit}</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 18 }}>
            <p style={{ color: "#BAE6FD", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Current Stock</p>
            <p style={{ fontSize: 44, fontWeight: 900, color: item.current_stock < 5 ? "#FCA5A5" : "#93C5FD", margin: "0 0 14px", lineHeight: 1, fontFamily: "var(--font-playfair), serif" }}>
              {item.current_stock} <span style={{ fontSize: 18 }}>{item.unit}</span>
            </p>
            <div style={{ display: "flex", gap: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 2px" }}>Buy</p>
                <p style={{ color: "#FCA5A5", fontWeight: 700, fontSize: 14, margin: 0 }}>₹{item.buy_price}/{item.unit}</p>
              </div>
              <div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 2px" }}>Sell</p>
                <p style={{ color: "#6EE7B7", fontWeight: 700, fontSize: 14, margin: 0 }}>₹{item.sell_price}/{item.unit}</p>
              </div>
              <div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 2px" }}>Profit</p>
                <p style={{ color: "#FCD34D", fontWeight: 700, fontSize: 14, margin: 0 }}>₹{profitPerUnit} ({margin}%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: "16px 16px 0", display: "flex", gap: 10 }}>
        <button
          onClick={() => openModal("restock")}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "linear-gradient(135deg, #1e3a5f, #2563EB)", color: "white", border: "none", borderRadius: 18, padding: "16px 0", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 16px rgba(37,99,235,0.25)", fontFamily: "var(--font-jakarta), sans-serif" }}
          onTouchStart={e => (e.currentTarget.style.transform = "scale(0.97)")}
          onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <TrendingUp size={17} /> Restock
        </button>
        <button
          onClick={() => openModal("count")}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#F0FDF4", color: "#15803D", border: "2px solid #16A34A", borderRadius: 18, padding: "16px 0", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}
          onTouchStart={e => (e.currentTarget.style.background = "#DCFCE7")}
          onTouchEnd={e => (e.currentTarget.style.background = "#F0FDF4")}
        >
          <TrendingDown size={17} /> Take Count
        </button>
      </div>

      {/* History */}
      <div style={{ padding: "20px 16px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 12px" }}>
          History ({entries.length} entries)
        </p>

        {entries.length === 0 ? (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", padding: "40px 20px", textAlign: "center" }}>
            <p style={{ color: "#9CA3AF", fontWeight: 600, fontSize: 14, margin: 0 }}>No entries yet</p>
            <p style={{ color: "#D1D5DB", fontSize: 12, margin: "4px 0 0" }}>Add a restock to get started</p>
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            {entries.map((e, idx) => (
              <div key={e.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: e.type === "restock" ? "#EFF6FF" : "#F0FDF4" }}>
                    {e.type === "restock" ? <TrendingUp size={16} color="#2563EB" /> : <TrendingDown size={16} color="#16A34A" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px", color: e.type === "restock" ? "#2563EB" : "#16A34A" }}>
                      {e.type === "restock" ? "Restocked" : "Stock Count"}
                    </p>
                    <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
                      Buy ₹{e.buy_price} · Sell ₹{e.sell_price}
                    </p>
                    <p style={{ fontSize: 11, color: "#D1D5DB", margin: "2px 0 0" }}>
                      {new Date(e.noted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <p style={{ fontWeight: 900, fontSize: 15, margin: 0, color: e.type === "restock" ? "#2563EB" : "#16A34A" }}>
                    {e.type === "restock" ? "+" : ""}{e.quantity} {item.unit}
                  </p>
                </div>
                {idx < entries.length - 1 && <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={(e) => e.target === e.currentTarget && setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", zIndex: 50 }}>
          <div style={{ background: "white", width: "100%", maxWidth: 384, margin: "0 auto", borderRadius: "28px 28px 0 0", padding: "20px 20px 40px", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ width: 36, height: 4, background: "#E5E7EB", borderRadius: 4, margin: "0 auto 24px" }} />

            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 900, fontSize: 20, color: "#111827", margin: "0 0 4px" }}>
              {modal === "restock" ? "Restock" : modal === "count" ? "Stock Count" : "Edit Prices"}
            </h2>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 20px" }}>
              {modal === "restock" ? `How much ${item.name} came in?` : modal === "count" ? "What's the current quantity?" : "Update buy and sell price"}
            </p>

            {modal !== "edit" && (
              <>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>
                  Quantity ({item.unit})
                </p>
                <input
                  type="number" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} autoFocus
                  style={{ width: "100%", border: "2px solid #F3F4F6", borderRadius: 14, padding: "14px 16px", fontSize: 32, fontWeight: 900, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "var(--font-jakarta), sans-serif", marginBottom: 16 }}
                  onFocus={e => e.target.style.borderColor = "#2563EB"}
                  onBlur={e => e.target.style.borderColor = "#F3F4F6"}
                />
              </>
            )}

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Buy Price (₹)</p>
                <input
                  type="number" placeholder="0" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)}
                  style={{ width: "100%", border: "2px solid #F3F4F6", borderRadius: 14, padding: "12px 14px", fontSize: 18, fontWeight: 800, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "var(--font-jakarta), sans-serif" }}
                  onFocus={e => e.target.style.borderColor = "#2563EB"}
                  onBlur={e => e.target.style.borderColor = "#F3F4F6"}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Sell Price (₹)</p>
                <input
                  type="number" placeholder="0" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)}
                  style={{ width: "100%", border: "2px solid #F3F4F6", borderRadius: 14, padding: "12px 14px", fontSize: 18, fontWeight: 800, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "var(--font-jakarta), sans-serif" }}
                  onFocus={e => e.target.style.borderColor = "#2563EB"}
                  onBlur={e => e.target.style.borderColor = "#F3F4F6"}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, border: "2px solid #F3F4F6", background: "white", borderRadius: 14, padding: "14px 0", fontSize: 14, fontWeight: 700, color: "#9CA3AF", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>
                Cancel
              </button>
              <button
                onClick={handleSubmit} disabled={submitting}
                style={{ flex: 1, border: "none", background: "linear-gradient(135deg, #1e3a5f, #2563EB)", borderRadius: 14, padding: "14px 0", fontSize: 14, fontWeight: 800, color: "white", cursor: "pointer", opacity: submitting ? 0.5 : 1, fontFamily: "var(--font-jakarta), sans-serif" }}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}