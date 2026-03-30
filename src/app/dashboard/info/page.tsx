"use client";

import { useEffect, useState } from "react";
import { User, Hash, Phone, Mail, Calendar, Copy, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function InfoPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showGcash, setShowGcash] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    loadProfile();
  }, []);

  if (!profile) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              height: "88px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.6)",
            }}
          />
        ))}
      </div>
    );
  }

  const infoItems = [
    { icon: User, label: "Full Name", value: profile.full_name, iconColor: "#E91E8C", iconBg: "rgba(233,30,140,0.1)" },
    { icon: Hash, label: "Account #", value: profile.account_number, iconColor: "#FF8C00", iconBg: "rgba(255,140,0,0.1)" },
    { icon: Phone, label: "Contact #", value: profile.contact_number, iconColor: "#6B21A8", iconBg: "rgba(107,33,168,0.1)" },
    { icon: Mail, label: "Email", value: profile.email || "Not provided", iconColor: "#22C55E", iconBg: "rgba(34,197,94,0.1)" },
    { icon: Calendar, label: "Member Since", value: formatDate(profile.created_at), iconColor: "#1A0A2E", iconBg: "rgba(26,10,46,0.06)", fullWidth: true },
  ];

  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "20px",
          fontWeight: 800,
          color: "#1A0A2E",
          marginBottom: "14px",
        }}
      >
        My Information
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          const isFullWidth = "fullWidth" in item && item.fullWidth;
          return (
            <div
              key={item.label}
              className="animate-slide-up"
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "14px",
                boxShadow: "0 2px 12px rgba(26,10,46,0.06), 0 1px 3px rgba(26,10,46,0.04)",
                border: "1px solid rgba(26,10,46,0.06)",
                animationDelay: `${index * 0.08}s`,
                gridColumn: isFullWidth ? "1 / -1" : undefined,
              }}
            >
              {isFullWidth ? (
                /* Full-width row style */
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      background: item.iconBg,
                      borderRadius: "10px",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: "18px", height: "18px", color: item.iconColor }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(26,10,46,0.4)", marginBottom: "2px" }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#1A0A2E" }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ) : (
                /* Compact card style */
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div
                    style={{
                      background: item.iconBg,
                      borderRadius: "10px",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: "18px", height: "18px", color: item.iconColor }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(26,10,46,0.4)", marginBottom: "3px" }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#1A0A2E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* GCash Numbers Button */}
      <button
        onClick={() => setShowGcash(true)}
        className="animate-slide-up"
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #007DFE 0%, #0060C0 100%)",
          borderRadius: "16px",
          padding: "14px 18px",
          marginTop: "16px",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 4px 16px rgba(0,125,254,0.25)",
          transition: "transform 0.2s, box-shadow 0.2s",
          animationDelay: "0.4s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.01)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,125,254,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,125,254,0.25)";
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "18px",
            flexShrink: 0,
          }}
        >
          G
        </div>
        <div style={{ textAlign: "left", flex: 1 }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "15px" }}>
            View GCash Numbers
          </p>
          <p style={{ fontSize: "12px", opacity: 0.8 }}>
            Tap to see where to send your payment
          </p>
        </div>
        <span style={{ fontSize: "20px", opacity: 0.8 }}>›</span>
      </button>

      {/* GCash Numbers Modal */}
      <Modal open={showGcash} onClose={() => setShowGcash(false)} title="GCash Payment">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #007DFE 0%, #0060C0 100%)",
              borderRadius: "16px",
              padding: "16px 18px",
              color: "#fff",
            }}
          >
            <p style={{ fontSize: "11px", opacity: 0.8, marginBottom: "4px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Account 1
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "18px", letterSpacing: "1px" }}>
                0915 164 7084
              </p>
              <button
                onClick={() => copyNumber("09151647084")}
                style={{
                  background: copiedNumber === "09151647084" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                {copiedNumber === "09151647084" ? (
                  <><Check style={{ width: "14px", height: "14px" }} /> Copied!</>
                ) : (
                  <><Copy style={{ width: "14px", height: "14px" }} /> Copy</>
                )}
              </button>
            </div>
            <p style={{ fontSize: "14px", fontWeight: 600, opacity: 0.9, marginTop: "2px" }}>
              Jennifer S.
            </p>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #007DFE 0%, #0060C0 100%)",
              borderRadius: "16px",
              padding: "16px 18px",
              color: "#fff",
            }}
          >
            <p style={{ fontSize: "11px", opacity: 0.8, marginBottom: "4px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Account 2
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "18px", letterSpacing: "1px" }}>
                0975 798 4862
              </p>
              <button
                onClick={() => copyNumber("09757984862")}
                style={{
                  background: copiedNumber === "09757984862" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                {copiedNumber === "09757984862" ? (
                  <><Check style={{ width: "14px", height: "14px" }} /> Copied!</>
                ) : (
                  <><Copy style={{ width: "14px", height: "14px" }} /> Copy</>
                )}
              </button>
            </div>
            <p style={{ fontSize: "14px", fontWeight: 600, opacity: 0.9, marginTop: "2px" }}>
              Francisco M.
            </p>
          </div>

          <div
            style={{
              background: "#F0F7FF",
              borderRadius: "14px",
              padding: "14px 16px",
              border: "1px solid #BFDBFE",
            }}
          >
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#1E40AF", marginBottom: "8px" }}>
              How to send:
            </p>
            <ol style={{ fontSize: "13px", color: "#1E40AF", lineHeight: "1.8", margin: 0, paddingLeft: "18px" }}>
              <li>Open <strong>GCash</strong> app</li>
              <li>Tap <strong>Send Money</strong></li>
              <li>Enter one of the numbers above</li>
              <li>Send your desired amount</li>
              <li>Take a <strong>screenshot</strong> of the receipt</li>
              <li>Go to <strong>Top Up</strong> tab and submit the form</li>
            </ol>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={() => setShowGcash(false)}
            style={{ marginTop: "4px" }}
          >
            Got it!
          </Button>
        </div>
      </Modal>
    </div>
  );
}
