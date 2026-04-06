"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/lib/api";
import { ArrowLeft, User, Phone, UserPlus } from "lucide-react";

export default function AddCustomer() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      newErrors.name = "Name should only contain letters";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createCustomer(name.trim(), phone.trim());
      router.push("/udhaar");
    } catch {
      setErrors({ name: undefined, phone: "Failed to save. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 384, margin: "0 auto", minHeight: "100vh", background: "#F7F8F5" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #052e16 0%, #0A3D2E 50%, #166534 100%)",
        padding: "56px 20px 32px",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 160, height: 160, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)"
        }} />
        <div style={{ position: "relative" }}>
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
          <p style={{
            color: "#6EE7B7", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6, margin: "0 0 6px"
          }}>
            Add to your
          </p>
          <h1 style={{
            fontFamily: "var(--font-playfair), serif",
            color: "white", fontSize: 38, fontWeight: 900, lineHeight: 1, margin: 0
          }}>
            New Customer
          </h1>
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: "24px 16px" }}>
        <div style={{
          background: "white", borderRadius: 24,
          border: "1.5px solid #EEEEE8",
          boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
          overflow: "hidden"
        }}>

          {/* Name Field */}
          <div style={{ padding: "20px 20px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <User size={11} color="#9CA3AF" />
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#9CA3AF",
                letterSpacing: "0.15em", textTransform: "uppercase"
              }}>Customer Name</span>
            </div>
            <input
              type="text"
              placeholder="e.g. Rajan Kumar"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              style={{
                width: "100%", border: `2px solid ${errors.name ? "#FCA5A5" : "#F3F4F6"}`,
                borderRadius: 14, padding: "14px 16px",
                fontSize: 16, fontWeight: 600, color: "#1F2937",
                outline: "none", boxSizing: "border-box",
                fontFamily: "var(--font-jakarta), sans-serif",
              }}
              onFocus={e => e.target.style.borderColor = errors.name ? "#EF4444" : "#0A3D2E"}
              onBlur={e => e.target.style.borderColor = errors.name ? "#FCA5A5" : "#F3F4F6"}
            />
            {errors.name && (
              <p style={{ color: "#EF4444", fontSize: 12, fontWeight: 600, margin: "6px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                ⚠ {errors.name}
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#F9FAFB", margin: "0 20px" }} />

          {/* Phone Field */}
          <div style={{ padding: "16px 20px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Phone size={11} color="#9CA3AF" />
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#9CA3AF",
                letterSpacing: "0.15em", textTransform: "uppercase"
              }}>Phone Number</span>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPhone(val);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                }}
                style={{
                  width: "100%", border: `2px solid ${errors.phone ? "#FCA5A5" : "#F3F4F6"}`,
                  borderRadius: 14, padding: "14px 52px 14px 16px",
                  fontSize: 16, fontWeight: 600, color: "#1F2937",
                  outline: "none", boxSizing: "border-box",
                  fontFamily: "var(--font-jakarta), sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = errors.phone ? "#EF4444" : "#0A3D2E"}
                onBlur={e => e.target.style.borderColor = errors.phone ? "#FCA5A5" : "#F3F4F6"}
              />
              {/* digit counter */}
              <span style={{
                position: "absolute", right: 14, top: "50%",
                transform: "translateY(-50%)",
                fontSize: 12, fontWeight: 700,
                color: phone.length === 10 ? "#16A34A" : "#D1D5DB"
              }}>
                {phone.length}/10
              </span>
            </div>
            {errors.phone && (
              <p style={{ color: "#EF4444", fontSize: 12, fontWeight: 600, margin: "6px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                ⚠ {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: 16, width: "100%",
            background: loading ? "#9CA3AF" : "linear-gradient(135deg, #052e16, #166534)",
            color: "white", border: "none", borderRadius: 18,
            padding: "18px 0", fontSize: 15, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 8px 24px rgba(5,46,22,0.3)",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "var(--font-jakarta), sans-serif",
          }}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <UserPlus size={17} />
          {loading ? "Saving..." : "Save Customer"}
        </button>

        <p style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>
          Customer will appear in your Udhaar Book
        </p>
      </div>
    </div>
  );
}