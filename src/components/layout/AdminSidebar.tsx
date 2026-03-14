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
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "#1A0A2E",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px 0",
        }}
      >
        <div>
          <h1
            className="text-gradient"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            S2S Admin
          </h1>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
            Management Panel
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LogOut style={{ width: "18px", height: "18px", color: "rgba(255,255,255,0.4)" }} />
        </button>
      </div>

      {/* Nav tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          padding: "14px 16px 0",
          overflowX: "auto",
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
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                borderRadius: "12px 12px 0 0",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                whiteSpace: "nowrap",
                textDecoration: "none",
                transition: "all 0.2s",
                ...(isActive
                  ? {
                      background: "linear-gradient(135deg, #FF8C00, #E91E8C, #6B21A8)",
                      color: "#fff",
                      boxShadow: "0 4px 16px rgba(233,30,140,0.25)",
                    }
                  : {
                      color: "rgba(255,255,255,0.4)",
                      background: "transparent",
                    }),
              }}
            >
              <Icon style={{ width: "16px", height: "16px" }} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
