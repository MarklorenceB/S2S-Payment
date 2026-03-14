"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, CheckCircle2, Clock, Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { IssueReport } from "@/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function ReportPage() {
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [description, setDescription] = useState("");
  const [modemStatus, setModemStatus] = useState<"online" | "offline">("online");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("issue_reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setIssues(data);
    };
    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please describe the issue.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: issue, error: insertError } = await supabase
        .from("issue_reports")
        .insert({
          user_id: user.id,
          description,
          modem_status: modemStatus,
          status: "open",
        })
        .select()
        .single();

      if (insertError) {
        setError("Failed to submit report. Please try again.");
        setLoading(false);
        return;
      }

      if (issue) {
        setIssues((prev) => [issue, ...prev]);
      }

      setSuccess(true);
      setDescription("");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const issueStatusConfig = {
    open: { badge: "warning" as const, icon: Clock, label: "Open" },
    in_progress: { badge: "info" as const, icon: Wrench, label: "In Progress" },
    resolved: { badge: "success" as const, icon: CheckCircle2, label: "Resolved" },
  };

  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "20px",
          fontWeight: 800,
          color: "#1A0A2E",
          marginBottom: "18px",
        }}
      >
        Report Issue
      </h2>

      {success && (
        <div
          className="animate-slide-up"
          style={{
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            borderRadius: "16px",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          <CheckCircle2 style={{ width: "20px", height: "20px", color: "#059669", flexShrink: 0 }} />
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#047857" }}>
            Issue report submitted! Our team will look into it.
          </p>
        </div>
      )}

      {/* Report form card */}
      <div
        className="animate-slide-up"
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 4px 24px rgba(26,10,46,0.08)",
          border: "1px solid rgba(26,10,46,0.05)",
          marginBottom: "20px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Modem status selector */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: "rgba(26,10,46,0.7)",
                  marginBottom: "10px",
                }}
              >
                Modem Status
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setModemStatus("online")}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    padding: "16px 12px",
                    borderRadius: "16px",
                    transition: "all 0.3s",
                    border: modemStatus === "online" ? "2px solid #22C55E" : "2px solid rgba(26,10,46,0.1)",
                    background: modemStatus === "online" ? "#ECFDF5" : "transparent",
                    transform: modemStatus === "online" ? "scale(1.02)" : "scale(1)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: modemStatus === "online" ? "#22C55E" : "rgba(26,10,46,0.1)",
                      boxShadow: modemStatus === "online" ? "0 0 20px rgba(34,197,94,0.4)" : "none",
                      transition: "all 0.3s",
                    }}
                  >
                    <Wifi
                      style={{
                        width: "22px",
                        height: "22px",
                        color: modemStatus === "online" ? "#fff" : "rgba(26,10,46,0.3)",
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: modemStatus === "online" ? "#22C55E" : "rgba(26,10,46,0.4)",
                      }}
                    >
                      Online
                    </p>
                    <p style={{ fontSize: "10px", marginTop: "2px", color: "rgba(26,10,46,0.3)" }}>Green light</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setModemStatus("offline")}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    padding: "16px 12px",
                    borderRadius: "16px",
                    transition: "all 0.3s",
                    border: modemStatus === "offline" ? "2px solid #EF4444" : "2px solid rgba(26,10,46,0.1)",
                    background: modemStatus === "offline" ? "#FEF2F2" : "transparent",
                    transform: modemStatus === "offline" ? "scale(1.02)" : "scale(1)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: modemStatus === "offline" ? "#EF4444" : "rgba(26,10,46,0.1)",
                      boxShadow: modemStatus === "offline" ? "0 0 20px rgba(239,68,68,0.4)" : "none",
                      transition: "all 0.3s",
                    }}
                  >
                    <WifiOff
                      style={{
                        width: "22px",
                        height: "22px",
                        color: modemStatus === "offline" ? "#fff" : "rgba(26,10,46,0.3)",
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: modemStatus === "offline" ? "#EF4444" : "rgba(26,10,46,0.4)",
                      }}
                    >
                      Offline
                    </p>
                    <p style={{ fontSize: "10px", marginTop: "2px", color: "rgba(26,10,46,0.3)" }}>Red light</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Issue description */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: "rgba(26,10,46,0.7)",
                  marginBottom: "8px",
                }}
              >
                Issue Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your internet issue..."
                rows={4}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: "2px solid rgba(26,10,46,0.1)",
                  background: "rgba(255,255,255,0.8)",
                  color: "#1A0A2E",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  outline: "none",
                  resize: "none",
                  transition: "all 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#E91E8C";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(233,30,140,0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(26,10,46,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "#FEF2F2",
                  color: "#DC2626",
                  border: "1px solid #FECACA",
                }}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
              style={{
                padding: "16px 24px",
                fontSize: "16px",
                fontWeight: 800,
                borderRadius: "16px",
                marginTop: "4px",
              }}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </div>

      {/* Report history */}
      {issues.length > 0 && (
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "17px",
              fontWeight: 800,
              color: "#1A0A2E",
              marginBottom: "12px",
            }}
          >
            My Reports
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {issues.map((issue, index) => {
              const config = issueStatusConfig[issue.status];
              return (
                <div
                  key={issue.id}
                  className="animate-slide-up"
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "14px 16px",
                    boxShadow: "0 2px 12px rgba(26,10,46,0.06), 0 1px 3px rgba(26,10,46,0.04)",
                    border: "1px solid rgba(26,10,46,0.06)",
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        marginTop: "6px",
                        flexShrink: 0,
                        background: issue.modem_status === "online" ? "#22C55E" : "#EF4444",
                        boxShadow: issue.modem_status === "online"
                          ? "0 0 8px rgba(34,197,94,0.5)"
                          : "0 0 8px rgba(239,68,68,0.5)",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <Badge variant={config.badge}>{config.label}</Badge>
                      </div>
                      <p style={{ fontSize: "13px", marginTop: "4px", color: "rgba(26,10,46,0.7)" }}>{issue.description}</p>
                      <p style={{ fontSize: "11px", marginTop: "8px", color: "rgba(26,10,46,0.4)" }}>
                        {formatDate(issue.created_at)}
                      </p>
                      {issue.admin_notes && (
                        <div style={{ marginTop: "8px", padding: "8px 10px", borderRadius: "10px", background: "rgba(26,10,46,0.05)" }}>
                          <p style={{ fontSize: "13px", fontStyle: "italic", color: "rgba(26,10,46,0.6)" }}>
                            Admin: &ldquo;{issue.admin_notes}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
