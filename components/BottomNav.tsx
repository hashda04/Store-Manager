"use client";

import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { label: "Home", icon: "🏠", href: "/" },
  { label: "Stock", icon: "📦", href: "/stock" },
  { label: "Billing", icon: "🧾", href: "/billing" },
  { label: "Profit", icon: "📊", href: "/profit" },
  { label: "Summary", icon: "📋", href: "/summary" },
];

export default function BottomNav() {
  const router = useRouter();
  const path = usePathname();
 const isActive = (href: string) => href === "/" ? path === "/" : path.startsWith(href);

  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%",
      transform: "translateX(-50%)",
      width: "100%", maxWidth: 384,
      background: "white",
      borderTop: "1.5px solid #EEEEE8",
      display: "flex", zIndex: 100,
      boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.href}
          onClick={() => router.push(tab.href)}
          style={{
            flex: 1, border: "none", background: "none",
            padding: "10px 0 14px", cursor: "pointer",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3,
            position: "relative",
          }}
        >
          <span style={{ fontSize: 18 }}>{tab.icon}</span>
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: isActive(tab.href) ? "#052e16" : "#9CA3AF",
            fontFamily: "var(--font-jakarta), sans-serif",
          }}>
            {tab.label}
          </span>
          {isActive(tab.href) && (
            <div style={{
              position: "absolute", bottom: 0,
              width: 28, height: 3,
              background: "#052e16", borderRadius: 2,
            }} />
          )}
        </button>
      ))}
    </div>
  );
}