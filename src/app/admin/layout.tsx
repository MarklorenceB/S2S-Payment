"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [kicked, setKicked] = useState(false);

  const checkSession = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const localToken = localStorage.getItem("admin_session_token");
    if (!localToken) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("session_token")
      .eq("id", user.id)
      .single();

    if (profile && profile.session_token !== localToken) {
      setKicked(true);
      localStorage.removeItem("admin_session_token");
      await supabase.auth.signOut();
    }
  }, []);

  useEffect(() => {
    checkSession();
    const interval = setInterval(checkSession, 5000);
    return () => clearInterval(interval);
  }, [checkSession]);

  const handleKickedClose = () => {
    router.push("/auth/login");
  };

  if (kicked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #FFF5E6 0%, #FFE0F0 50%, #E8D5F5 100%)",
          padding: "24px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "32px 28px",
            maxWidth: "380px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(26,10,46,0.15)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "rgba(239,68,68,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "28px",
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontWeight: 800,
              color: "#1A0A2E",
              marginBottom: "8px",
            }}
          >
            Session Expired
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(26,10,46,0.5)",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            Someone else logged into this admin account. Only one session is allowed at a time.
          </p>
          <button
            onClick={handleKickedClose}
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #FF8C00 0%, #E91E8C 50%, #6B21A8 100%)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(233,30,140,0.2)",
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(160deg, #FFF5E6 0%, #FFE0F0 50%, #E8D5F5 100%)",
      }}
    >
      <AdminSidebar />
      <main style={{ flex: 1 }}>
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "20px 20px 40px",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
