"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import BottomNav from "@/components/layout/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(160deg, #FFF5E6 0%, #FFE0F0 50%, #E8D5F5 100%)",
      }}
    >
      {/* Header */}
      <header
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #FF8C00 0%, #E91E8C 50%, #6B21A8 100%)",
          position: "relative",
          overflow: "hidden",
          paddingBottom: "24px",
        }}
      >
        {/* Safe area + content */}
        <div
          style={{
            maxWidth: "540px",
            margin: "0 auto",
            padding: "48px 20px 0",
          }}
        >
          {/* Top row: name + logout */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: "2px" }}>
                Welcome back
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "26px",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {profile?.full_name || "Loading..."}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="cursor-pointer"
              style={{
                padding: "10px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <LogOut className="w-5 h-5" style={{ color: "#fff" }} />
            </button>
          </div>

          {/* Account summary card */}
          <div
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "16px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.55)" }}>
                Account #
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "0.02em",
                  marginTop: "2px",
                }}
              >
                {profile?.account_number || "---"}
              </p>
            </div>
            <div style={{ textAlign: "right", minWidth: 0 }}>
              <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.55)" }}>
                Contact
              </p>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginTop: "2px" }}>
                {profile?.contact_number || "---"}
              </p>
            </div>
          </div>
        </div>

        {/* Curved bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 32" fill="none" style={{ width: "100%", display: "block" }}>
            <path d="M0 32V0C360 28 720 32 1080 28C1260 26 1380 20 1440 12V32H0Z" fill="#FFF5E6" />
          </svg>
        </div>
      </header>

      {/* Content */}
      <main
        style={{
          maxWidth: "540px",
          margin: "0 auto",
          padding: "16px 20px 100px",
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
