"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTodaySummary, TodaySummary } from "@/lib/api";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function SummaryPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<TodaySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodaySummary().then(setSummary).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)", padding: "56px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative" }}>
          <button onClick={() => router.push("/")} style={{ color: "#C7D2FE", fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif", marginBottom: 16, display: "block" }}>← Home</button>
          <p style={{ color: "#C7D2FE", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>
            {loading ? "Loading..." : summary?.date}
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "white", fontSize: 44, fontWeight: 900, lineHeight: 1, margin: 0 }}>Today's</h1>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "#A5B4FC", fontSize: 44, fontWeight: 900, lineHeight: 1, margin: 0 }}>Summary.</h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Revenue", value: `₹${summary?.revenue.toFixed(0) ?? "—"}`, color: "#C7D2FE" },
              { label: "Profit", value: `₹${summary?.profit.toFixed(0) ?? "—"}`, color: "#A5F3FC" },
              { label: "Bills", value: `${summary?.bills_count ?? "—"}`, color: "#C7D2FE" },
              { label: "Udhaar Given", value: `₹${summary?.udhaar_given.toFixed(0) ?? "—"}`, color: "#FCA5A5" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "10px 12px" }}>
                <p style={{ color: stat.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>{stat.label}</p>
                <p style={{ color: "white", fontWeight: 700, fontSize: 18, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>

        {/* Profit margin */}
        {summary && summary.revenue > 0 && (
          <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #EEEEE8", padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600, margin: "0 0 2px" }}>Today's margin</p>
              <p style={{ fontSize: 11, color: "#D1D5DB", margin: 0 }}>profit ÷ revenue</p>
            </div>
            <p style={{ fontSize: 28, fontWeight: 900, color: "#4338ca", margin: 0 }}>
              {((summary.profit / summary.revenue) * 100).toFixed(1)}%
            </p>
          </div>
        )}

        {/* Top selling items */}
        {summary?.top_items && summary.top_items.length > 0 && (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>
              Top Selling Items
            </p>
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", overflow: "hidden", marginBottom: 16 }}>
              {summary.top_items.map((item, idx) => (
                <div key={item.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: "#4338ca" }}>#{idx + 1}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name} {item.brand ? `— ${item.brand}` : ""}
                      </p>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                        {item.qty_sold} {item.unit} sold
                      </p>
                    </div>
                    <p style={{ fontWeight: 900, fontSize: 15, color: "#4338ca", margin: 0 }}>
                      ₹{item.revenue.toFixed(0)}
                    </p>
                  </div>
                  {idx < summary.top_items.length - 1 && <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && summary?.bills_count === 0 && (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid #EEEEE8", padding: "48px 20px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <ShoppingBag size={24} color="#D1D5DB" />
            </div>
            <p style={{ color: "#6B7280", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>No sales yet today</p>
            <p style={{ color: "#D1D5DB", fontSize: 12, margin: "0 0 20px" }}>Create a bill to see today's summary</p>
            <button
              onClick={() => router.push("/billing")}
              style={{ background: "linear-gradient(135deg, #1e1b4b, #4338ca)", color: "white", border: "none", borderRadius: 14, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-jakarta), sans-serif" }}
            >
              Create Bill
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}