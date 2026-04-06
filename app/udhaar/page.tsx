"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCustomers, getTodaysCredits, Customer, Transaction } from "@/lib/api";
import { Search, UserPlus, TrendingUp, Users, IndianRupee, ChevronRight, Phone } from "lucide-react";
import BottomNav from "@/components/BottomNav";

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

function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div style={{
      width: size, height: size,
      backgroundColor: color.bg, color: color.fg,
      borderRadius: 12,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: size * 0.4, flexShrink: 0,
    }}>
      {name[0].toUpperCase()}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [todayCredits, setTodayCredits] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCustomers(), getTodaysCredits()])
      .then(([c, t]) => { setCustomers(c); setTodayCredits(t); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const todayTotal = todayCredits.reduce((sum, t) => sum + t.amount, 0);
  const totalPending = customers.reduce((sum, c) => sum + (c.balance > 0 ? c.balance : 0), 0);
  const pendingCount = customers.filter((c) => c.balance > 0).length;

  return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5" }}>

      {/* ── BIG HEADER — scrolls away ── */}
      <div style={{
        background: "linear-gradient(160deg, #052e16 0%, #0A3D2E 50%, #166534 100%)",
        padding: "56px 20px 28px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: -30, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ color: "#6EE7B7", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
              Your Store's
            </p>
            <button
              onClick={() => router.push("/udhaar/add-customer")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12, padding: "8px 14px",
                color: "white", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif",
              }}
            >
              <UserPlus size={13} /> New Customer
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 24 }}>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "white", fontSize: 44, fontWeight: 900, lineHeight: 1, margin: 0 }}>Udhaar</h1>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "#34D399", fontSize: 44, fontWeight: 900, lineHeight: 1, margin: 0 }}>Book.</h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { icon: <TrendingUp size={11} />, label: "Today", value: `₹${todayTotal.toFixed(0)}`, color: "#6EE7B7" },
              { icon: <IndianRupee size={11} />, label: "Pending", value: `₹${totalPending.toFixed(0)}`, color: "#FCD34D" },
              { icon: <Users size={11} />, label: "Due", value: `${pendingCount}`, color: "#7DD3FC" },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: "10px 12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: stat.color, marginBottom: 4 }}>
                  {stat.icon}
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{stat.label}</span>
                </div>
                <p style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STICKY BAR — sticks here when header scrolls away ── */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#052e16",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12, padding: "9px 12px",
        }}>
          <Search size={14} color="rgba(255,255,255,0.5)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, border: "none", outline: "none",
              background: "transparent", color: "white",
              fontSize: 14, fontWeight: 500,
              fontFamily: "var(--font-jakarta), sans-serif",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}>×</button>
          )}
        </div>
        <button
          onClick={() => router.push("/add-customer")}
          style={{
            width: 40, height: 40, flexShrink: 0,
            background: "#16A34A", border: "none", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 2px 10px rgba(22,163,74,0.4)",
          }}
        >
          <UserPlus size={17} color="white" />
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "20px 16px" }}>

        {/* List label */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
            {search ? `${filtered.length} results` : `${customers.length} customers`}
          </p>
          {!search && customers.filter(c => c.balance === 0).length > 0 && (
            <p style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", margin: 0 }}>
              {customers.filter(c => c.balance === 0).length} cleared ✓
            </p>
          )}
        </div>

        {/* Customer cards */}
        {loading ? (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            {[1, 2, 3].map((i, idx) => (
              <div key={i}>
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F3F4F6" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 14, width: "60%", background: "#F3F4F6", borderRadius: 6, marginBottom: 6 }} />
                    <div style={{ height: 11, width: "40%", background: "#F9FAFB", borderRadius: 6 }} />
                  </div>
                </div>
                {idx < 2 && <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />}
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", padding: "48px 20px", textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Users size={24} color="#D1D5DB" />
            </div>
            <p style={{ color: "#6B7280", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>No customers found</p>
            <p style={{ color: "#D1D5DB", fontSize: 12, margin: 0 }}>Try a different name</p>
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            {filtered.map((c, idx) => (
              <div key={c.id}>
                <div
                  onClick={() => router.push(`/udhaar/customer/${c.id}`)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", cursor: "pointer" }}
                  onTouchStart={e => (e.currentTarget.style.background = "#F9FAFB")}
                  onTouchEnd={e => (e.currentTarget.style.background = "transparent")}
                  onMouseDown={e => (e.currentTarget.style.background = "#F9FAFB")}
                  onMouseUp={e => (e.currentTarget.style.background = "transparent")}
                >
                  <Avatar name={c.name} size={44} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: "#111827", fontSize: 15, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Phone size={10} color="#D1D5DB" />
                      <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{c.phone}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 800, fontSize: 15, margin: "0 0 3px", color: c.balance > 0 ? "#EF4444" : "#16A34A" }}>₹{c.balance.toFixed(0)}</p>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: c.balance > 0 ? "#FEF2F2" : "#F0FDF4", color: c.balance > 0 ? "#EF4444" : "#16A34A" }}>
                        {c.balance > 0 ? "pending" : "clear"}
                      </span>
                    </div>
                    <ChevronRight size={14} color="#E5E7EB" />
                  </div>
                </div>
                {idx < filtered.length - 1 && <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}