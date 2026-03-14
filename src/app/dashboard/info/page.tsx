"use client";

import { useEffect, useState } from "react";
import { User, Hash, Phone, Mail, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/types";

export default function InfoPage() {
  const [profile, setProfile] = useState<Profile | null>(null);

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
    </div>
  );
}
