"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Wallet, AlertTriangle } from "lucide-react";

const navItems = [
  { href: "/dashboard/info", label: "Info", icon: User },
  { href: "/dashboard/topup", label: "Top Up", icon: Wallet },
  { href: "/dashboard/report", label: "Report", icon: AlertTriangle },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "rgba(255,255,255,0.96)",
        borderTop: "1px solid rgba(26,10,46,0.06)",
        boxShadow: "0 -2px 16px rgba(26,10,46,0.05)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          maxWidth: "540px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "8px 16px",
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "6px 16px",
                borderRadius: "14px",
                textDecoration: "none",
                transition: "all 0.2s",
                color: isActive ? "#E91E8C" : "rgba(26,10,46,0.4)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(255,140,0,0.14), rgba(233,30,140,0.16), rgba(107,33,168,0.14))"
                    : "transparent",
                  boxShadow: isActive ? "inset 0 0 0 1px rgba(233,30,140,0.12)" : "none",
                }}
              >
                <Icon
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth={isActive ? 2.4 : 2}
                />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
