"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getCustomer, getTransactions, addTransaction,
  deleteTransaction, Customer, Transaction,
} from "@/lib/api";
import {
  ArrowLeft, Phone, PlusCircle, MinusCircle,
  CheckCircle, Trash2, TrendingUp, TrendingDown, Receipt
} from "lucide-react";

const AVATAR_COLORS = [
  { bg: "#FDE68A", fg: "#78350F" },
  { bg: "#A7F3D0", fg: "#064E3B" },
  { bg: "#BAE6FD", fg: "#0C4A6E" },
  { bg: "#FECACA", fg: "#7F1D1D" },
  { bg: "#DDD6FE", fg: "#4C1D95" },
  { bg: "#FED7AA", fg: "#7C2D12" },
  { bg: "#D1FAE5", fg: "#065F46" },
  { bg: "#E0E7FF", fg: "#3730A3" },
];
const [visibleCount, setVisibleCount] = useState(10);

function Avatar({ name, size = 52 }: { name: string; size?: number }) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div style={{
      width: size, height: size,
      backgroundColor: color.bg, color: color.fg,
      borderRadius: 14,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: size * 0.38, flexShrink: 0,
    }}>
      {name[0].toUpperCase()}
    </div>
  );
}

export default function CustomerDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"credit" | "payment" | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    const [c, t] = await Promise.all([
      getCustomer(Number(id)),
      getTransactions(Number(id)),
    ]);
    setCustomer(c);
    setTransactions(t);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    setSubmitting(true);
    try {
      await addTransaction(Number(id), modal!, Number(amount), note || undefined);
      setModal(null); setAmount(""); setNote("");
      await fetchData();
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (txId: number) => {
    if (!confirm("Remove this entry?")) return;
    await deleteTransaction(txId);
    await fetchData();
  };

  const handleFullPayment = async () => {
    if (!customer || customer.balance <= 0) return;
    if (!confirm(`Mark ₹${customer.balance.toFixed(2)} as fully paid?`)) return;
    await addTransaction(Number(id), "payment", customer.balance, "Full payment");
    await fetchData();
  };
  const handleWhatsApp = () => {
    if (!customer) return;

    const lines: string[] = [];
    lines.push(`📒 *Udhaar Summary — ${customer.name}*`);
    lines.push(`📱 From: Mayura Provision Store`);
    lines.push(``);

    {transactions.length === 0 ? (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", padding: "40px 20px", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Receipt size={22} color="#E5E7EB" />
            </div>
            <p style={{ color: "#6B7280", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>No transactions yet</p>
            <p style={{ color: "#D1D5DB", fontSize: 12, margin: 0 }}>Add a credit to get started</p>
          </div>
        ) : (
          <>
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", overflow: "hidden" }}>
              {transactions.slice(0, visibleCount).map((t, idx) => (
                <div key={t.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: t.type === "credit" ? "#FEF2F2" : "#F0FDF4" }}>
                      {t.type === "credit" ? <TrendingUp size={16} color="#EF4444" /> : <TrendingDown size={16} color="#16A34A" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px", color: t.type === "credit" ? "#EF4444" : "#16A34A" }}>
                        {t.type === "credit" ? "Credit Given" : "Payment Received"}
                      </p>
                      {t.note && <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.note}</p>}
                      <p style={{ fontSize: 11, color: "#D1D5DB", margin: 0 }}>
                        {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <p style={{ fontWeight: 900, fontSize: 15, margin: 0, color: t.type === "credit" ? "#EF4444" : "#16A34A" }}>
                        {t.type === "credit" ? "+" : "-"}₹{Number(t.amount).toFixed(0)}
                      </p>
                      <button
                        onClick={() => handleDelete(t.id)}
                        style={{ width: 32, height: 32, borderRadius: 10, background: "#F9FAFB", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#FEF2F2")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#F9FAFB")}
                        onTouchStart={e => (e.currentTarget.style.background = "#FEF2F2")}
                        onTouchEnd={e => (e.currentTarget.style.background = "#F9FAFB")}
                      >
                        <Trash2 size={13} color="#D1D5DB" />
                      </button>
                    </div>
                  </div>
                  {idx < Math.min(visibleCount, transactions.length) - 1 && (
                    <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />
                  )}
                </div>
              ))}
            </div>

            {/* Load more / show less */}
            {transactions.length > 10 && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {visibleCount < transactions.length && (
                  <button
                    onClick={() => setVisibleCount(v => v + 10)}
                    style={{ flex: 1, background: "white", border: "1.5px solid #EEEEE8", borderRadius: 14, padding: "12px 0", fontSize: 13, fontWeight: 700, color: "#6B7280", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}
                  >
                    Load 10 more ({transactions.length - visibleCount} remaining)
                  </button>
                )}
                {visibleCount > 10 && (
                  <button
                    onClick={() => setVisibleCount(10)}
                    style={{ background: "white", border: "1.5px solid #EEEEE8", borderRadius: 14, padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#9CA3AF", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}
                  >
                    Collapse
                  </button>
                )}
              </div>
            )}

            {/* Total count info */}
            {transactions.length > 0 && (
              <p style={{ textAlign: "center", fontSize: 11, color: "#D1D5DB", fontWeight: 500, margin: "8px 0 0" }}>
                Showing {Math.min(visibleCount, transactions.length)} of {transactions.length} transactions
              </p>
            )}
          </>
        )}

    lines.push(``);
    lines.push(`💰 *Total Due: ₹${customer.balance.toFixed(2)}*`);

    if (customer.balance > 0) {
      lines.push(``);
      lines.push(`Please settle when convenient 🙏`);
    } else {
      lines.push(``);
      lines.push(`✅ All dues cleared. Thank you!`);
    }

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/91${customer.phone}?text=${message}`, "_blank");
  };

  if (loading) return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#34D399", fontWeight: 700, fontSize: 14 }}>Loading...</p>
    </div>
  );

  if (!customer) return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#9CA3AF" }}>Customer not found</p>
    </div>
  );

  const totalCredit = transactions.filter(t => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
  const totalPaid = transactions.filter(t => t.type === "payment").reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #052e16 0%, #0A3D2E 50%, #166534 100%)",
        padding: "56px 20px 28px",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 200, height: 200, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)"
        }} />
        <div style={{
          position: "absolute", bottom: -30, left: -20,
          width: 120, height: 120, borderRadius: "50%",
          background: "rgba(255,255,255,0.03)"
        }} />

        <div style={{ position: "relative" }}>
          {/* Back */}
          <button
            onClick={() => router.back()}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              color: "#6EE7B7", fontSize: 13, fontWeight: 700,
              marginBottom: 20, background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-jakarta), sans-serif"
            }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {/* Customer info */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <Avatar name={customer.name} size={54} />
            <div>
              <h1 style={{
                fontFamily: "var(--font-playfair), serif",
                color: "white", fontSize: 30, fontWeight: 900,
                margin: "0 0 4px", lineHeight: 1
              }}>
                {customer.name}
              </h1>
              <a
                href={`tel:${customer.phone}`}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  color: "#6EE7B7", fontSize: 13, fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                <Phone size={13} /> {customer.phone}
              </a>
            </div>
          </div>

          {/* Balance card */}
          <div style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: 18
          }}>
            <p style={{
              color: "#6EE7B7", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.15em", textTransform: "uppercase",
              margin: "0 0 6px"
            }}>
              Outstanding Balance
            </p>
            <p style={{
              fontSize: 46, fontWeight: 900, lineHeight: 1, margin: "0 0 4px",
              color: customer.balance > 0 ? "#FCD34D" : "#6EE7B7",
              fontFamily: "var(--font-playfair), serif"
            }}>
              ₹{customer.balance.toFixed(2)}
            </p>
            {customer.balance === 0 && (
              <p style={{ color: "#6EE7B7", fontSize: 12, fontWeight: 600, margin: "4px 0 0" }}>
                ✓ Fully settled
              </p>
            )}
            <div style={{
              display: "flex", gap: 20, marginTop: 14,
              paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <TrendingUp size={12} color="#FCA5A5" />
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                  Given: <span style={{ color: "#FCA5A5", fontWeight: 700 }}>₹{totalCredit.toFixed(0)}</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <TrendingDown size={12} color="#6EE7B7" />
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                  Paid: <span style={{ color: "#6EE7B7", fontWeight: 700 }}>₹{totalPaid.toFixed(0)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 16px" }}>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <button
            onClick={() => setModal("credit")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              background: "#DC2626", color: "white",
              border: "none", borderRadius: 18, padding: "16px 0",
              fontSize: 14, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(220,38,38,0.25)",
              fontFamily: "var(--font-jakarta), sans-serif"
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onTouchStart={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <PlusCircle size={17} /> Add Credit
          </button>
          <button
            onClick={() => setModal("payment")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              background: "linear-gradient(135deg, #052e16, #166534)", color: "white",
              border: "none", borderRadius: 18, padding: "16px 0",
              fontSize: 14, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(5,46,22,0.25)",
              fontFamily: "var(--font-jakarta), sans-serif"
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onTouchStart={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <MinusCircle size={17} /> Add Payment
          </button>
        </div>

        {customer.balance > 0 && (
          <button
            onClick={handleFullPayment}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              background: "#F0FDF4", color: "#15803D",
              border: "2px solid #16A34A", borderRadius: 18, padding: "14px 0",
              fontSize: 14, fontWeight: 800, cursor: "pointer", marginBottom: 10,
              fontFamily: "var(--font-jakarta), sans-serif", boxSizing: "border-box"
            }}
            onMouseDown={e => (e.currentTarget.style.background = "#DCFCE7")}
            onMouseUp={e => (e.currentTarget.style.background = "#F0FDF4")}
            onTouchStart={e => (e.currentTarget.style.background = "#DCFCE7")}
            onTouchEnd={e => (e.currentTarget.style.background = "#F0FDF4")}
          >
            <CheckCircle size={17} /> Mark Fully Paid — ₹{customer.balance.toFixed(2)}
          </button>
          
        )
        }
        {/* WhatsApp button */}
        <button
          onClick={handleWhatsApp}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#25D366", color: "white",
            border: "none", borderRadius: 18, padding: "16px 0",
            fontSize: 14, fontWeight: 800, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
            fontFamily: "var(--font-jakarta), sans-serif",
            boxSizing: "border-box",
          }}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
          onTouchStart={e => (e.currentTarget.style.transform = "scale(0.97)")}
          onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Send Summary on WhatsApp
        </button>
        

        {/* History */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "16px 0 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Receipt size={12} color="#9CA3AF" />
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
              History
            </p>
          </div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#D1D5DB", margin: 0 }}>
            {transactions.length} entries
          </p>
        </div>

        {transactions.length === 0 ? (
          <div style={{
            background: "white", borderRadius: 24,
            border: "1.5px solid #EEEEE8",
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            padding: "48px 20px", textAlign: "center"
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", background: "#F9FAFB",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px"
            }}>
              <Receipt size={22} color="#E5E7EB" />
            </div>
            <p style={{ color: "#6B7280", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>No transactions yet</p>
            <p style={{ color: "#D1D5DB", fontSize: 12, margin: 0 }}>Add a credit to get started</p>
          </div>
        ) : (
          <div style={{
            background: "white", borderRadius: 24,
            border: "1.5px solid #EEEEE8",
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            overflow: "hidden"
          }}>
            {transactions.map((t, idx) => (
              <div key={t.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: t.type === "credit" ? "#FEF2F2" : "#F0FDF4"
                  }}>
                    {t.type === "credit"
                      ? <TrendingUp size={16} color="#EF4444" />
                      : <TrendingDown size={16} color="#16A34A" />
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontWeight: 700, fontSize: 14, margin: "0 0 2px",
                      color: t.type === "credit" ? "#EF4444" : "#16A34A"
                    }}>
                      {t.type === "credit" ? "Credit Given" : "Payment Received"}
                    </p>
                    {t.note && (
                      <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.note}
                      </p>
                    )}
                    <p style={{ fontSize: 11, color: "#D1D5DB", margin: 0 }}>
                      {new Date(t.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <p style={{
                      fontWeight: 900, fontSize: 15, margin: 0,
                      color: t.type === "credit" ? "#EF4444" : "#16A34A"
                    }}>
                      {t.type === "credit" ? "+" : "-"}₹{Number(t.amount).toFixed(0)}
                    </p>
                    <button
                      onClick={() => handleDelete(t.id)}
                      style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: "#F9FAFB", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#FEF2F2")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#F9FAFB")}
                      onTouchStart={e => (e.currentTarget.style.background = "#FEF2F2")}
                      onTouchEnd={e => (e.currentTarget.style.background = "#F9FAFB")}
                    >
                      <Trash2 size={13} color="#D1D5DB" />
                    </button>
                  </div>
                </div>
                {idx < transactions.length - 1 && (
                  <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "flex-end"
          }}
        >
          <div style={{
            background: "white", width: "100%", maxWidth: 384,
            margin: "0 auto", borderRadius: "28px 28px 0 0",
            padding: "20px 20px 40px",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.15)"
          }}>
            {/* Handle */}
            <div style={{ width: 36, height: 4, background: "#E5E7EB", borderRadius: 4, margin: "0 auto 24px" }} />

            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: modal === "credit" ? "#FEF2F2" : "#F0FDF4",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {modal === "credit"
                  ? <PlusCircle size={20} color="#EF4444" />
                  : <MinusCircle size={20} color="#16A34A" />
                }
              </div>
              <div>
                <h2 style={{ fontWeight: 900, fontSize: 18, color: "#111827", margin: "0 0 2px", fontFamily: "var(--font-playfair), serif" }}>
                  {modal === "credit" ? "Add Credit" : "Add Payment"}
                </h2>
                <p style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, margin: 0 }}>for {customer.name}</p>
              </div>
            </div>

            {/* Amount */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>
              Amount (₹)
            </p>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
              style={{
                width: "100%", border: "2px solid #F3F4F6",
                borderRadius: 14, padding: "14px 16px",
                fontSize: 32, fontWeight: 900, color: "#111827",
                outline: "none", boxSizing: "border-box",
                fontFamily: "var(--font-jakarta), sans-serif",
                marginBottom: 14
              }}
              onFocus={e => e.target.style.borderColor = "#0A3D2E"}
              onBlur={e => e.target.style.borderColor = "#F3F4F6"}
            />

            {/* Note */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>
              Note (optional)
            </p>
            <input
              type="text"
              placeholder="e.g. rice, oil, sugar..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: "100%", border: "2px solid #F3F4F6",
                borderRadius: 14, padding: "14px 16px",
                fontSize: 15, fontWeight: 500, color: "#374151",
                outline: "none", boxSizing: "border-box",
                fontFamily: "var(--font-jakarta), sans-serif",
                marginBottom: 20
              }}
              onFocus={e => e.target.style.borderColor = "#0A3D2E"}
              onBlur={e => e.target.style.borderColor = "#F3F4F6"}
            />

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setModal(null); setAmount(""); setNote(""); }}
                style={{
                  flex: 1, border: "2px solid #F3F4F6", background: "white",
                  borderRadius: 14, padding: "14px 0",
                  fontSize: 14, fontWeight: 700, color: "#9CA3AF", cursor: "pointer",
                  fontFamily: "var(--font-jakarta), sans-serif"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !amount}
                style={{
                  flex: 1, border: "none",
                  background: modal === "credit" ? "#DC2626" : "linear-gradient(135deg, #052e16, #166534)",
                  borderRadius: 14, padding: "14px 0",
                  fontSize: 14, fontWeight: 800, color: "white", cursor: "pointer",
                  opacity: submitting || !amount ? 0.5 : 1,
                  fontFamily: "var(--font-jakarta), sans-serif"
                }}
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