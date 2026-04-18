"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Minus, Trash2, ShoppingCart, CheckCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { getItems, createBill, getCustomers, addTransaction, Item, Customer } from "@/lib/api";

interface CartItem {
  item: Item;
  quantity: number;
  sell_price: number;
}

export default function BillingPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [billDone, setBillDone] = useState<{ total: number; profit: number } | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMode, setPaymentMode] = useState<"cash" | "udhaar">("cash");

  useEffect(() => {
    Promise.all([getItems(), getCustomers()])
      .then(([i, c]) => { setItems(i); setCustomers(c); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.length > 0
    ? items.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.brand?.toLowerCase().includes(search.toLowerCase()) ||
        i.category?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const addToCart = (item: Item) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { item, quantity: 1, sell_price: item.sell_price }];
    });
    setSearch("");
  };

  const updateQty = (itemId: number, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.item.id !== itemId) return c;
      const newQty = c.quantity + delta;
      if (newQty <= 0) return null as any;
      return { ...c, quantity: newQty };
    }).filter(Boolean));
  };

  const setQty = (itemId: number, val: number) => {
    if (val <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(c => c.item.id === itemId ? { ...c, quantity: val } : c));
  };

  const removeFromCart = (itemId: number) => setCart(prev => prev.filter(c => c.item.id !== itemId));

  const updatePrice = (itemId: number, price: number) => {
    setCart(prev => prev.map(c => c.item.id === itemId ? { ...c, sell_price: price } : c));
  };

  const total = cart.reduce((s, c) => s + c.quantity * c.sell_price, 0);
  const profit = cart.reduce((s, c) => s + c.quantity * (c.sell_price - c.item.buy_price), 0);

  const handleDone = async (sendWhatsApp = false) => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      if (paymentMode === "udhaar" && selectedCustomer) {
        const items_note = cart.map(c => `${c.item.name} ×${c.quantity}`).join(", ");
        await addTransaction(selectedCustomer.id, "credit", total, items_note);
        await createBill(cart.map(c => ({ item_id: c.item.id, quantity: c.quantity, sell_price: c.sell_price })));
        setBillDone({ total, profit });
      } else {
        const bill = await createBill(cart.map(c => ({ item_id: c.item.id, quantity: c.quantity, sell_price: c.sell_price })));
        setBillDone({ total: bill.total_amount, profit: bill.total_profit });
      }

      if (sendWhatsApp) {
        const lines = ["🧾 *Bill from Appa's Store*", ""];
        cart.forEach(c => {
          lines.push(`• ${c.item.name} × ${c.quantity} ${c.item.unit} = ₹${(c.quantity * c.sell_price).toFixed(0)}`);
        });
        lines.push("");
        lines.push(`*Total: ₹${total.toFixed(0)}*`);
        if (paymentMode === "udhaar" && selectedCustomer) {
          lines.push(`_Added to udhaar for ${selectedCustomer.name}_`);
        }
        lines.push("Thank you! 🙏");
        const phone = paymentMode === "udhaar" && selectedCustomer ? `91${selectedCustomer.phone}` : "";
        const msg = encodeURIComponent(lines.join("\n"));
        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
      }

      setCart([]);
      setSelectedCustomer(null);
      setPaymentMode("cash");
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Failed to create bill");
    } finally {
      setSubmitting(false);
    }
  };

  if (billDone) {
    return (
      <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", paddingBottom: 80 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <CheckCircle size={40} color="#16A34A" />
        </div>
        <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, fontWeight: 900, color: "#111827", margin: "0 0 8px", textAlign: "center" }}>Bill Done!</h2>
        <p style={{ color: "#9CA3AF", fontSize: 15, margin: "0 0 24px", textAlign: "center" }}>Sale recorded successfully</p>

        <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", padding: "20px", width: "100%", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ color: "#9CA3AF", fontWeight: 600, margin: 0 }}>Total Collected</p>
            <p style={{ fontWeight: 900, fontSize: 24, color: "#111827", margin: 0 }}>₹{billDone.total.toFixed(0)}</p>
          </div>
        </div>

        <button
          onClick={() => setBillDone(null)}
          style={{ width: "100%", background: "linear-gradient(135deg, #064e3b, #059669)", color: "white", border: "none", borderRadius: 18, padding: "18px 0", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}
        >
          New Bill
        </button>
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #064e3b 0%, #065f46 50%, #059669 100%)", padding: "56px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative" }}>
          <button onClick={() => router.push("/")} style={{ color: "#6EE7B7", fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif", marginBottom: 16, display: "block" }}>← Home</button>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "white", fontSize: 44, fontWeight: 900, lineHeight: 1, margin: 0 }}>New</h1>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "#6EE7B7", fontSize: 44, fontWeight: 900, lineHeight: 1, margin: 0 }}>Bill.</h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 500, margin: 0 }}>
            {cart.length > 0 ? `${cart.length} item${cart.length > 1 ? "s" : ""} · ₹${total.toFixed(0)} total` : "Search and add items"}
          </p>
        </div>
      </div>

      {/* Sticky search */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#065f46", padding: "10px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "11px 14px" }}>
            <Search size={16} color="rgba(255,255,255,0.5)" style={{ flexShrink: 0 }} />
            <input
              type="text" placeholder="Search item to add..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: "white", fontSize: 15, fontWeight: 500, fontFamily: "var(--font-jakarta), sans-serif" }}
            />
            {search && <button onClick={() => setSearch("")} style={{ color: "rgba(255,255,255,0.5)", fontSize: 20, lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}>×</button>}
          </div>

          {/* Dropdown */}
          {filtered.length > 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "white", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", overflow: "hidden", zIndex: 200, maxHeight: 280, overflowY: "auto" }}>
              {filtered.map((item, idx) => (
                <div key={item.id}>
                  <div
                    onClick={() => addToCart(item)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", cursor: "pointer" }}
                    onMouseDown={e => (e.currentTarget.style.background = "#F9FAFB")}
                    onMouseUp={e => (e.currentTarget.style.background = "transparent")}
                    onTouchStart={e => (e.currentTarget.style.background = "#F9FAFB")}
                    onTouchEnd={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: "0 0 2px" }}>
                        {item.name} {item.brand ? `— ${item.brand}` : ""}
                      </p>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                        {item.category} · ₹{item.sell_price}/{item.unit} · {item.current_stock} {item.unit} left
                      </p>
                    </div>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Plus size={16} color="#16A34A" />
                    </div>
                  </div>
                  {idx < filtered.length - 1 && <div style={{ height: 1, background: "#F9FAFB", margin: "0 16px" }} />}
                </div>
              ))}
            </div>
          )}

          {search.length > 0 && filtered.length === 0 && !loading && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "white", borderRadius: 16, padding: "20px", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", zIndex: 200 }}>
              <p style={{ color: "#9CA3AF", fontWeight: 600, fontSize: 14, margin: 0 }}>No items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart */}
      <div style={{ padding: "16px 16px" }}>
        {cart.length === 0 ? (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", padding: "48px 20px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <ShoppingCart size={24} color="#D1D5DB" />
            </div>
            <p style={{ color: "#6B7280", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>Cart is empty</p>
            <p style={{ color: "#D1D5DB", fontSize: 12, margin: 0 }}>Search above to add items</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>
              Cart ({cart.length} items)
            </p>

            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", overflow: "hidden", marginBottom: 12 }}>
              {cart.map((c, idx) => (
                <div key={c.item.id}>
                  <div style={{ padding: "14px 16px" }}>

                    {/* Item name row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {c.item.name} {c.item.brand ? `— ${c.item.brand}` : ""}
                        </p>
                        <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{c.item.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(c.item.id)}
                        style={{ width: 28, height: 28, borderRadius: 8, background: "#FEF2F2", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginLeft: 8 }}
                      >
                        <Trash2 size={12} color="#EF4444" />
                      </button>
                    </div>

                    {/* Qty + price row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

                      {/* Qty — typeable with +/- */}
                      <div style={{ display: "flex", alignItems: "center", background: "#F9FAFB", borderRadius: 12, overflow: "hidden", border: "1.5px solid #EEEEE8", flexShrink: 0 }}>
                        <button
                          onClick={() => updateQty(c.item.id, -1)}
                          style={{ width: 32, height: 36, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <Minus size={13} color="#6B7280" />
                        </button>
                        <input
                          type="number"
                          value={c.quantity}
                          onChange={e => setQty(c.item.id, Number(e.target.value))}
                          style={{ width: 40, background: "none", border: "none", outline: "none", textAlign: "center", fontWeight: 800, fontSize: 14, color: "#111827", fontFamily: "var(--font-jakarta), sans-serif", padding: 0 }}
                        />
                        <button
                          onClick={() => updateQty(c.item.id, 1)}
                          style={{ width: 32, height: 36, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <Plus size={13} color="#6B7280" />
                        </button>
                      </div>

                      <span style={{ color: "#D1D5DB", fontSize: 11, flexShrink: 0 }}>{c.item.unit}</span>

                      {/* Price editable */}
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
                        <span style={{ color: "#9CA3AF", fontSize: 12 }}>₹</span>
                        <input
                          type="number"
                          value={c.sell_price}
                          onChange={e => updatePrice(c.item.id, Number(e.target.value))}
                          style={{ width: 64, border: "2px solid #F3F4F6", borderRadius: 10, padding: "5px 6px", fontSize: 14, fontWeight: 800, color: "#111827", outline: "none", textAlign: "right", fontFamily: "var(--font-jakarta), sans-serif" }}
                          onFocus={e => e.target.style.borderColor = "#059669"}
                          onBlur={e => e.target.style.borderColor = "#F3F4F6"}
                        />
                        <span style={{ color: "#9CA3AF", fontSize: 10, flexShrink: 0 }}>/{c.item.unit}</span>
                      </div>

                      {/* Line total */}
                      <p style={{ fontWeight: 900, fontSize: 15, color: "#111827", margin: 0, minWidth: 48, textAlign: "right", flexShrink: 0 }}>
                        ₹{(c.quantity * c.sell_price).toFixed(0)}
                      </p>
                    </div>
                  </div>
                  {idx < cart.length - 1 && <div style={{ height: 1, background: "#F9FAFB", margin: "0 16px" }} />}
                </div>
              ))}
            </div>

            {/* Bill total */}
            <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #EEEEE8", padding: "16px 20px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ color: "#9CA3AF", fontWeight: 600, fontSize: 15, margin: 0 }}>Total</p>
                <p style={{ fontWeight: 900, fontSize: 24, color: "#111827", margin: 0 }}>₹{total.toFixed(0)}</p>
              </div>
            </div>

            {/* Payment mode */}
            <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #EEEEE8", padding: "16px 20px", marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 12px" }}>Payment Mode</p>
              <div style={{ display: "flex", gap: 8, marginBottom: paymentMode === "udhaar" ? 12 : 0 }}>
                <button
                  onClick={() => { setPaymentMode("cash"); setSelectedCustomer(null); setCustomerSearch(""); }}
                  style={{ flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 700, border: `2px solid ${paymentMode === "cash" ? "#059669" : "#F3F4F6"}`, background: paymentMode === "cash" ? "#F0FDF4" : "white", color: paymentMode === "cash" ? "#059669" : "#9CA3AF", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}
                >
                  💵 Cash
                </button>
                <button
                  onClick={() => setPaymentMode("udhaar")}
                  style={{ flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 700, border: `2px solid ${paymentMode === "udhaar" ? "#EF4444" : "#F3F4F6"}`, background: paymentMode === "udhaar" ? "#FEF2F2" : "white", color: paymentMode === "udhaar" ? "#EF4444" : "#9CA3AF", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}
                >
                  📒 Udhaar
                </button>
              </div>

              {paymentMode === "udhaar" && (
                selectedCustomer ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FEF2F2", borderRadius: 12, padding: "10px 14px" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: 0 }}>{selectedCustomer.name}</p>
                      <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Balance: ₹{selectedCustomer.balance.toFixed(0)}</p>
                    </div>
                    <button onClick={() => { setSelectedCustomer(null); setCustomerSearch(""); }} style={{ color: "#EF4444", fontSize: 20, background: "none", border: "none", cursor: "pointer" }}>×</button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text" placeholder="Search customer name..."
                      value={customerSearch} onChange={e => setCustomerSearch(e.target.value)}
                      style={{ width: "100%", border: "2px solid #F3F4F6", borderRadius: 12, padding: "10px 14px", fontSize: 14, fontWeight: 500, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "var(--font-jakarta), sans-serif" }}
                      onFocus={e => e.target.style.borderColor = "#EF4444"}
                      onBlur={e => e.target.style.borderColor = "#F3F4F6"}
                    />
                    {customerSearch.length > 0 && (
                      <div style={{ background: "white", border: "1.5px solid #EEEEE8", borderRadius: 12, marginTop: 4, overflow: "hidden", maxHeight: 180, overflowY: "auto" }}>
                        {customers
                          .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()))
                          .map((c, idx, arr) => (
                            <div key={c.id}>
                              <div
                                onClick={() => { setSelectedCustomer(c); setCustomerSearch(""); }}
                                style={{ padding: "10px 14px", cursor: "pointer" }}
                                onMouseDown={e => (e.currentTarget.style.background = "#F9FAFB")}
                                onMouseUp={e => (e.currentTarget.style.background = "transparent")}
                                onTouchStart={e => (e.currentTarget.style.background = "#F9FAFB")}
                                onTouchEnd={e => (e.currentTarget.style.background = "transparent")}
                              >
                                <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: "0 0 2px" }}>{c.name}</p>
                                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Balance: ₹{c.balance.toFixed(0)}</p>
                              </div>
                              {idx < arr.length - 1 && <div style={{ height: 1, background: "#F9FAFB" }} />}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => handleDone(false)}
                disabled={submitting || (paymentMode === "udhaar" && !selectedCustomer)}
                style={{ flex: 1, background: paymentMode === "udhaar" ? "linear-gradient(135deg, #7f1d1d, #dc2626)" : "linear-gradient(135deg, #064e3b, #059669)", color: "white", border: "none", borderRadius: 18, padding: "16px 0", fontSize: 14, fontWeight: 800, cursor: "pointer", opacity: (submitting || (paymentMode === "udhaar" && !selectedCustomer)) ? 0.5 : 1, fontFamily: "var(--font-jakarta), sans-serif" }}
              >
                {submitting ? "Saving..." : paymentMode === "udhaar" ? "📒 Add to Udhaar" : "✓ Done"}
              </button>
              <button
                onClick={() => handleDone(true)}
                disabled={submitting || (paymentMode === "udhaar" && !selectedCustomer)}
                style={{ flex: 1, background: "#25D366", color: "white", border: "none", borderRadius: 18, padding: "16px 0", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: (submitting || (paymentMode === "udhaar" && !selectedCustomer)) ? 0.5 : 1, fontFamily: "var(--font-jakarta), sans-serif" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {paymentMode === "udhaar" ? "Udhaar + WA" : "Bill + WhatsApp"}
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}