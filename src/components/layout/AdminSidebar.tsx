"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, Wallet, AlertTriangle, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/topups", label: "Top-ups", icon: Wallet },
  { href: "/admin/issues", label: "Issues", icon: AlertTriangle },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header
      style={{
        width: "100%",
        background: "linear-gradient(135deg, #FF8C00 0%, #E91E8C 50%, #6B21A8 100%)",
        position: "relative",
        overflow: "hidden",
        paddingBottom: "24px",
      }}
    >
      {/* Header row */}
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "48px 20px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: "2px" }}>
              Management Panel
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "26px",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              S2S Admin
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

        {/* Nav tabs inside glass card */}
        <div
          style={{
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "5px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "3px",
          }}
        >
          {navItems.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  padding: "10px 4px",
                  borderRadius: "12px",
                  fontSize: "10px",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  justifyContent: "center",
                  letterSpacing: "0.02em",
                  ...(isActive
                    ? {
                        background: "rgba(255,255,255,0.22)",
                        color: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }
                    : {
                        color: "rgba(255,255,255,0.55)",
                        background: "transparent",
                      }),
                }}
              >
                <Icon style={{ width: "18px", height: "18px" }} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Curved bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 32" fill="none" style={{ width: "100%", display: "block" }}>
          <path d="M0 32V0C360 28 720 32 1080 28C1260 26 1380 20 1440 12V32H0Z" fill="#FFF5E6" />
        </svg>
      </div>
    </header>
  );
}
