"use client";

import { useEffect, useState } from "react";
import { Users, Wallet, AlertTriangle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  totalUsers: number;
  pendingTopups: number;
  openIssues: number;
  totalTopups: number;
}

const gradients = [
  "linear-gradient(135deg, #F97316, #FBBF24)",
  "linear-gradient(135deg, #EC4899, #F43F5E)",
  "linear-gradient(135deg, #7C3AED, #8B5CF6)",
  "linear-gradient(135deg, #10B981, #14B8A6)",
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingTopups: 0,
    openIssues: 0,
    totalTopups: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const [users, pendingTopups, openIssues, allTopups] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "user"),
        supabase.from("topup_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("issue_reports").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress"]),
        supabase.from("topup_requests").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalUsers: users.count || 0,
        pendingTopups: pendingTopups.count || 0,
        openIssues: openIssues.count || 0,
        totalTopups: allTopups.count || 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Pending Top-ups", value: stats.pendingTopups, icon: Clock },
    { label: "Open Issues", value: stats.openIssues, icon: AlertTriangle },
    { label: "Total Top-ups", value: stats.totalTopups, icon: Wallet },
  ];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            fontWeight: 900,
            color: "#1A0A2E",
            letterSpacing: "-0.02em",
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(26,10,46,0.4)", marginTop: "4px" }}>
          Overview of your S2S system
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="animate-slide-up"
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "18px",
                border: "1px solid rgba(26,10,46,0.06)",
                boxShadow: "0 2px 12px rgba(26,10,46,0.06), 0 1px 3px rgba(26,10,46,0.04)",
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "rgba(26,10,46,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {stat.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "32px",
                      fontWeight: 900,
                      color: "#1A0A2E",
                      marginTop: "6px",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    background: gradients[index],
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ width: "18px", height: "18px", color: "#fff" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
