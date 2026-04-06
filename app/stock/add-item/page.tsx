"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createItem, getCategories } from "@/lib/api";
import { ArrowLeft, Package } from "lucide-react";

const UNITS = ["kg", "litre", "piece", "packet", "dozen", "box", "bottle", "gram"];

export default function AddItem() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState("piece");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [minStock, setMinStock] = useState("5");
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getCategories().then(setExistingCategories).catch(() => {});
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Item name is required";
    if (!buyPrice || Number(buyPrice) <= 0) e.buyPrice = "Enter valid buy price";
    if (!sellPrice || Number(sellPrice) <= 0) e.sellPrice = "Enter valid sell price";
    if (Number(sellPrice) < Number(buyPrice)) e.sellPrice = "Sell price must be more than buy price";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createItem({
        name: name.trim(),
        category: category.trim() || undefined,
        brand: brand.trim() || undefined,
        unit,
        buy_price: Number(buyPrice),
        sell_price: Number(sellPrice),
        min_stock: Number(minStock) || 5,
      });
      router.push("/stock");
    } catch {
      setErrors({ submit: "Failed to save. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const margin = buyPrice && sellPrice && Number(buyPrice) > 0
    ? (((Number(sellPrice) - Number(buyPrice)) / Number(buyPrice)) * 100).toFixed(1)
    : null;

  const inputStyle = (hasError?: boolean) => ({
    width: "100%",
    border: `2px solid ${hasError ? "#FCA5A5" : "#F3F4F6"}`,
    borderRadius: 14, padding: "13px 16px",
    fontSize: 15, fontWeight: 600, color: "#1F2937",
    outline: "none", boxSizing: "border-box" as const,
    fontFamily: "var(--font-jakarta), sans-serif",
    background: "white",
  });

  return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #1e40af 50%, #2563EB 100%)", padding: "56px 20px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative" }}>
          <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 6, color: "#BAE6FD", fontSize: 13, fontWeight: 700, marginBottom: 20, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>
            <ArrowLeft size={15} /> Back
          </button>
          <p style={{ color: "#BAE6FD", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>Add to your</p>
          <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "white", fontSize: 38, fontWeight: 900, lineHeight: 1, margin: 0 }}>New Item</h1>
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", overflow: "hidden" }}>

          {/* Name */}
          <div style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Item Name *</p>
            <input type="text" placeholder="e.g. Parle-G Biscuit" value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
              style={inputStyle(!!errors.name)}
              onFocus={e => e.target.style.borderColor = "#2563EB"}
              onBlur={e => e.target.style.borderColor = errors.name ? "#FCA5A5" : "#F3F4F6"}
            />
            {errors.name && <p style={{ color: "#EF4444", fontSize: 12, fontWeight: 600, margin: "5px 0 0" }}>⚠ {errors.name}</p>}
          </div>

          <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />

          {/* Category */}
          <div style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Category</p>
            <input type="text" placeholder="e.g. Biscuits, Rice, Oil..." value={category}
              onChange={e => setCategory(e.target.value)}
              style={inputStyle()}
              onFocus={e => e.target.style.borderColor = "#2563EB"}
              onBlur={e => e.target.style.borderColor = "#F3F4F6"}
            />
            {/* Existing category suggestions */}
            {existingCategories.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {existingCategories.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: `1.5px solid ${category === cat ? "#2563EB" : "#E5E7EB"}`, background: category === cat ? "#EFF6FF" : "white", color: category === cat ? "#2563EB" : "#6B7280", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />

          {/* Brand */}
          <div style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Brand</p>
            <input type="text" placeholder="e.g. Parle, Britannia, Fortune..." value={brand}
              onChange={e => setBrand(e.target.value)}
              style={inputStyle()}
              onFocus={e => e.target.style.borderColor = "#2563EB"}
              onBlur={e => e.target.style.borderColor = "#F3F4F6"}
            />
          </div>

          <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />

          {/* Unit */}
          <div style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>Unit</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {UNITS.map(u => (
                <button key={u} onClick={() => setUnit(u)}
                  style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: `2px solid ${unit === u ? "#2563EB" : "#F3F4F6"}`, background: unit === u ? "#EFF6FF" : "white", color: unit === u ? "#2563EB" : "#6B7280", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />

          {/* Prices */}
          <div style={{ padding: "18px 20px", display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" }}>Buy Price (₹)</p>
              <input type="number" placeholder="0" value={buyPrice}
                onChange={e => { setBuyPrice(e.target.value); setErrors(p => ({ ...p, buyPrice: "" })); }}
                style={{ ...inputStyle(!!errors.buyPrice), fontSize: 20, fontWeight: 900 }}
                onFocus={e => e.target.style.borderColor = "#2563EB"}
                onBlur={e => e.target.style.borderColor = errors.buyPrice ? "#FCA5A5" : "#F3F4F6"}
              />
              {errors.buyPrice && <p style={{ color: "#EF4444", fontSize: 11, margin: "4px 0 0" }}>⚠ {errors.buyPrice}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" }}>Sell Price (₹)</p>
              <input type="number" placeholder="0" value={sellPrice}
                onChange={e => { setSellPrice(e.target.value); setErrors(p => ({ ...p, sellPrice: "" })); }}
                style={{ ...inputStyle(!!errors.sellPrice), fontSize: 20, fontWeight: 900 }}
                onFocus={e => e.target.style.borderColor = "#2563EB"}
                onBlur={e => e.target.style.borderColor = errors.sellPrice ? "#FCA5A5" : "#F3F4F6"}
              />
              {errors.sellPrice && <p style={{ color: "#EF4444", fontSize: 11, margin: "4px 0 0" }}>⚠ {errors.sellPrice}</p>}
            </div>
          </div>

          {/* Live margin preview */}
          {margin && Number(margin) > 0 && (
            <div style={{ margin: "0 20px 16px", background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 13, color: "#15803D", fontWeight: 600, margin: 0 }}>Profit per {unit}</p>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#15803D", margin: 0 }}>₹{(Number(sellPrice) - Number(buyPrice)).toFixed(2)}</p>
                <p style={{ fontSize: 11, color: "#16A34A", fontWeight: 700, margin: 0 }}>{margin}% margin</p>
              </div>
            </div>
          )}

          <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />

          {/* Min stock alert */}
          <div style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 4px" }}>Low Stock Alert</p>
            <p style={{ fontSize: 12, color: "#D1D5DB", margin: "0 0 8px" }}>Alert when stock falls below this</p>
            <input type="number" placeholder="5" value={minStock}
              onChange={e => setMinStock(e.target.value)}
              style={{ ...inputStyle(), width: "50%" }}
              onFocus={e => e.target.style.borderColor = "#2563EB"}
              onBlur={e => e.target.style.borderColor = "#F3F4F6"}
            />
          </div>
        </div>

        {errors.submit && (
          <div style={{ marginTop: 12, background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 14, padding: "12px 16px" }}>
            <p style={{ color: "#EF4444", fontSize: 13, fontWeight: 600, margin: 0 }}>⚠ {errors.submit}</p>
          </div>
        )}

        <button
          onClick={handleSubmit} disabled={loading}
          style={{ marginTop: 16, width: "100%", background: loading ? "#9CA3AF" : "linear-gradient(135deg, #1e3a5f, #2563EB)", color: "white", border: "none", borderRadius: 18, padding: "18px 0", fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 24px rgba(37,99,235,0.3)", cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Package size={17} />
          {loading ? "Saving..." : "Save Item"}
        </button>
      </div>
    </div>
  );
}