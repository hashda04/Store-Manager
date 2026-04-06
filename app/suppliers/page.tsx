"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupplierPayments, getSupplierSummary, addSupplierPayment, SupplierPayment, SupplierSummary } from "@/lib/api";
import { ArrowLeft, Plus, Truck } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function SuppliersPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<SupplierPayment[]>([]);
  const [summary, setSummary] = useState<SupplierSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    const [p, s] = await Promise.all([getSupplierPayments(), getSupplierSummary()]);
    setPayments(p);
    setSummary(s);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Get unique supplier names for suggestions
  const supplierNames = Array.from(new Set(payments.map(p => p.supplier_name)));

  const handleSubmit = async () => {
    if (!supplierName.trim() || !amount || Number(amount) <= 0) return;
    setSubmitting(true);
    try {
      await addSupplierPayment({ supplier_name: supplierName.trim(), amount: Number(amount), note: note.trim() || undefined });
      setModal(false);
      setSupplierName(""); setAmount(""); setNote("");
      await fetchData();
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #134e4a 0%, #0f766e 50%, #0d9488 100%)", padding: "56px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <button onClick={() => router.push("/")} style={{ color: "#99F6E4", fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>← Home</button>
            <button onClick={() => setModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 14px", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>
              <Plus size={13} /> Add Payment
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "white", fontSize: 40, fontWeight: 900, lineHeight: 1, margin: 0 }}>Supplier</h1>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "#99F6E4", fontSize: 40, fontWeight: 900, lineHeight: 1, margin: 0 }}>Log.</h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "This Month", value: `₹${summary?.this_month.toFixed(0) ?? "—"}`, color: "#99F6E4" },
              { label: "This Year", value: `₹${summary?.this_year.toFixed(0) ?? "—"}`, color: "#99F6E4" },
              { label: "Total Ever", value: `₹${summary?.total_ever.toFixed(0) ?? "—"}`, color: "#FCD34D" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "10px 12px" }}>
                <p style={{ color: stat.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>{stat.label}</p>
                <p style={{ color: "white", fontWeight: 700, fontSize: 15, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
            Recent Payments
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{payments.length} entries</p>
        </div>

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
        ) : payments.length === 0 ? (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", padding: "48px 20px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Truck size={24} color="#D1D5DB" />
            </div>
            <p style={{ color: "#6B7280", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>No supplier payments yet</p>
            <p style={{ color: "#D1D5DB", fontSize: 12, margin: 0 }}>Log when supplier delivers stock</p>
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            {payments.map((p, idx) => (
              <div key={p.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "#F0FDFA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Truck size={18} color="#0d9488" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: "0 0 2px" }}>{p.supplier_name}</p>
                    {p.note && <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.note}</p>}
                    <p style={{ fontSize: 11, color: "#D1D5DB", margin: 0 }}>
                      {new Date(p.paid_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <p style={{ fontWeight: 900, fontSize: 16, color: "#EF4444", margin: 0, flexShrink: 0 }}>
                    -₹{Number(p.amount).toFixed(0)}
                  </p>
                </div>
                {idx < payments.length - 1 && <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={e => e.target === e.currentTarget && setModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", zIndex: 50 }}>
          <div style={{ background: "white", width: "100%", maxWidth: 384, margin: "0 auto", borderRadius: "28px 28px 0 0", padding: "20px 20px 40px", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ width: 36, height: 4, background: "#E5E7EB", borderRadius: 4, margin: "0 auto 24px" }} />
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 900, fontSize: 20, color: "#111827", margin: "0 0 4px" }}>Log Supplier Payment</h2>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 20px" }}>Record when stock is delivered</p>

            {/* Supplier name */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Supplier Name</p>
            <input
              type="text" placeholder="e.g. Raju Wholesale, Metro Cash & Carry"
              value={supplierName} onChange={e => setSupplierName(e.target.value)} autoFocus
              style={{ width: "100%", border: "2px solid #F3F4F6", borderRadius: 14, padding: "12px 16px", fontSize: 15, fontWeight: 600, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "var(--font-jakarta), sans-serif", marginBottom: 8 }}
              onFocus={e => e.target.style.borderColor = "#0d9488"}
              onBlur={e => e.target.style.borderColor = "#F3F4F6"}
            />

            {/* Supplier suggestions */}
            {supplierNames.length > 0 && !supplierName && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {supplierNames.map(name => (
                  <button key={name} onClick={() => setSupplierName(name)}
                    style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "1.5px solid #E5E7EB", background: "white", color: "#6B7280", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>
                    {name}
                  </button>
                ))}
              </div>
            )}

            {/* Amount */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Amount Paid (₹)</p>
            <input
              type="number" placeholder="0"
              value={amount} onChange={e => setAmount(e.target.value)}
              style={{ width: "100%", border: "2px solid #F3F4F6", borderRadius: 14, padding: "14px 16px", fontSize: 30, fontWeight: 900, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "var(--font-jakarta), sans-serif", marginBottom: 12 }}
              onFocus={e => e.target.style.borderColor = "#0d9488"}
              onBlur={e => e.target.style.borderColor = "#F3F4F6"}
            />

            {/* Note */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Note (optional)</p>
            <input
              type="text" placeholder="e.g. Rice, oil, biscuits batch"
              value={note} onChange={e => setNote(e.target.value)}
              style={{ width: "100%", border: "2px solid #F3F4F6", borderRadius: 14, padding: "12px 16px", fontSize: 14, fontWeight: 500, color: "#374151", outline: "none", boxSizing: "border-box", fontFamily: "var(--font-jakarta), sans-serif", marginBottom: 20 }}
              onFocus={e => e.target.style.borderColor = "#0d9488"}
              onBlur={e => e.target.style.borderColor = "#F3F4F6"}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setModal(false); setSupplierName(""); setAmount(""); setNote(""); }} style={{ flex: 1, border: "2px solid #F3F4F6", background: "white", borderRadius: 14, padding: "14px 0", fontSize: 14, fontWeight: 700, color: "#9CA3AF", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}>
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={submitting || !supplierName || !amount}
                style={{ flex: 1, border: "none", background: "linear-gradient(135deg, #134e4a, #0d9488)", borderRadius: 14, padding: "14px 0", fontSize: 14, fontWeight: 800, color: "white", cursor: "pointer", opacity: (submitting || !supplierName || !amount) ? 0.5 : 1, fontFamily: "var(--font-jakarta), sans-serif" }}>
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}