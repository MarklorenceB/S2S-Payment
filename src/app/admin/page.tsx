"use client";

import { useEffect, useState } from "react";
import { Users, Wallet, AlertTriangle, Clock, KeyRound, Eye, EyeOff, Check } from "lucide-react";
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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage("");
    setPwError("");

    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }

    setChangingPw(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPwError(data.error || "Failed to change password.");
        return;
      }

      setPwMessage("Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
    } catch {
      setPwError("Something went wrong.");
    } finally {
      setChangingPw(false);
    }
  };

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

      {/* Change Admin Password */}
      <div
        style={{
          marginTop: "24px",
          background: "#fff",
          borderRadius: "18px",
          padding: "20px",
          border: "1px solid rgba(26,10,46,0.06)",
          boxShadow: "0 2px 12px rgba(26,10,46,0.06), 0 1px 3px rgba(26,10,46,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div
            style={{
              padding: "10px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
              flexShrink: 0,
            }}
          >
            <KeyRound style={{ width: "18px", height: "18px", color: "#fff" }} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "16px",
                fontWeight: 800,
                color: "#1A0A2E",
              }}
            >
              Change My Password
            </h2>
            <p style={{ fontSize: "12px", color: "rgba(26,10,46,0.4)" }}>
              Update your admin login password
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setPwError(""); setPwMessage(""); }}
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "14px 48px 14px 16px",
                borderRadius: "12px",
                background: "rgba(26,10,46,0.03)",
                border: "2px solid rgba(26,10,46,0.08)",
                color: "#1A0A2E",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#7C3AED"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(26,10,46,0.08)"; }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                padding: "4px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? (
                <EyeOff style={{ width: "18px", height: "18px", color: "rgba(26,10,46,0.3)" }} />
              ) : (
                <Eye style={{ width: "18px", height: "18px", color: "rgba(26,10,46,0.3)" }} />
              )}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setPwError(""); setPwMessage(""); }}
            required
            minLength={6}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              background: "rgba(26,10,46,0.03)",
              border: "2px solid rgba(26,10,46,0.08)",
              color: "#1A0A2E",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#7C3AED"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(26,10,46,0.08)"; }}
          />

          {pwError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "#FEF2F2",
                color: "#EF4444",
                fontSize: "13px",
                fontWeight: 600,
                border: "1px solid #FECACA",
              }}
            >
              {pwError}
            </div>
          )}

          {pwMessage && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "#F0FDF4",
                color: "#16A34A",
                fontSize: "13px",
                fontWeight: 600,
                border: "1px solid #BBF7D0",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Check style={{ width: "16px", height: "16px" }} />
              {pwMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={changingPw}
            className="cursor-pointer"
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: "14px",
              background: changingPw
                ? "rgba(139,92,246,0.5)"
                : "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              border: "none",
              cursor: changingPw ? "not-allowed" : "pointer",
              boxShadow: "0 8px 32px rgba(124,58,237,0.2)",
            }}
          >
            {changingPw ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
