"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, Filter, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { IssueReport } from "@/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type FilterStatus = "all" | "open" | "in_progress" | "resolved";

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [noteModal, setNoteModal] = useState<IssueReport | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [newStatus, setNewStatus] = useState<"open" | "in_progress" | "resolved">("open");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("issue_reports")
        .select("*, profiles(full_name, account_number, contact_number)")
        .order("created_at", { ascending: false });

      if (data) setIssues(data);
      setLoading(false);
    };
    fetchIssues();
  }, []);

  const openNoteModal = (issue: IssueReport) => {
    setNoteModal(issue);
    setAdminNote(issue.admin_notes || "");
    setNewStatus(issue.status);
  };

  const handleUpdate = async () => {
    if (!noteModal) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("issue_reports")
      .update({
        status: newStatus,
        admin_notes: adminNote || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteModal.id);

    if (!error) {
      setIssues((prev) =>
        prev.map((i) =>
          i.id === noteModal.id
            ? { ...i, status: newStatus, admin_notes: adminNote || null }
            : i
        )
      );
    }

    setSaving(false);
    setNoteModal(null);
  };

  const filtered = filter === "all" ? issues : issues.filter((i) => i.status === filter);

  const statusConfig = {
    open: { badge: "warning" as const, label: "Open" },
    in_progress: { badge: "info" as const, label: "In Progress" },
    resolved: { badge: "success" as const, label: "Resolved" },
  };

  const filterOptions: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            fontWeight: 900,
            color: "#1A0A2E",
            letterSpacing: "-0.02em",
          }}
        >
          Issue Reports
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(26,10,46,0.4)", marginTop: "4px" }}>
          {issues.length} total reports
        </p>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        <Filter style={{ width: "16px", height: "16px", color: "rgba(26,10,46,0.3)" }} />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              ...(filter === opt.value
                ? {
                    background: "linear-gradient(135deg, #FF8C00, #E91E8C, #6B21A8)",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(233,30,140,0.2)",
                  }
                : {
                    background: "rgba(26,10,46,0.06)",
                    color: "rgba(26,10,46,0.4)",
                  }),
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Issues list */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{ height: "100px", borderRadius: "16px", background: "rgba(255,255,255,0.6)" }}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((issue, index) => {
            const config = statusConfig[issue.status];
            const profile = issue.profiles;

            return (
              <div
                key={issue.id}
                className="animate-slide-up"
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "16px",
                  border: "1px solid rgba(26,10,46,0.06)",
                  boxShadow: "0 2px 12px rgba(26,10,46,0.06), 0 1px 3px rgba(26,10,46,0.04)",
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                {/* Top: modem + badge + date */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background:
                        issue.modem_status === "online"
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(239,68,68,0.15)",
                    }}
                  >
                    {issue.modem_status === "online" ? (
                      <Wifi style={{ width: "16px", height: "16px", color: "#16A34A" }} />
                    ) : (
                      <WifiOff style={{ width: "16px", height: "16px", color: "#DC2626" }} />
                    )}
                  </div>
                  <Badge variant={config.badge}>{config.label}</Badge>
                  <span style={{ fontSize: "11px", color: "rgba(26,10,46,0.25)", marginLeft: "auto" }}>
                    {formatDate(issue.created_at)}
                  </span>
                </div>

                {/* User + description */}
                <p style={{ fontWeight: 700, fontSize: "15px", color: "#1A0A2E" }}>
                  {profile?.full_name || "Unknown User"}
                </p>
                <p style={{ fontSize: "13px", marginTop: "6px", color: "rgba(26,10,46,0.5)", lineHeight: 1.5 }}>
                  {issue.description}
                </p>

                {/* Admin notes */}
                {issue.admin_notes && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "rgba(26,10,46,0.04)",
                    }}
                  >
                    <p style={{ fontSize: "12px", fontStyle: "italic", color: "rgba(26,10,46,0.5)" }}>
                      Note: {issue.admin_notes}
                    </p>
                  </div>
                )}

                {/* Respond button */}
                <div style={{ marginTop: "12px" }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openNoteModal(issue)}
                    style={{
                      color: "rgba(26,10,46,0.5)",
                      background: "rgba(26,10,46,0.06)",
                      borderRadius: "10px",
                      padding: "8px 14px",
                      fontSize: "13px",
                    }}
                  >
                    <MessageSquare style={{ width: "14px", height: "14px" }} />
                    Respond
                  </Button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontSize: "15px", color: "rgba(26,10,46,0.3)" }}>No issues found</p>
            </div>
          )}
        </div>
      )}

      {/* Update modal */}
      <Modal open={!!noteModal} onClose={() => setNoteModal(null)} title="Update Issue">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
              Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as typeof newStatus)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "2px solid rgba(26,10,46,0.1)",
                background: "#fff",
                color: "#1A0A2E",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#E91E8C";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(26,10,46,0.1)";
              }}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

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
              Admin Notes
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add notes for the customer..."
              rows={3}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "2px solid rgba(26,10,46,0.1)",
                background: "#fff",
                color: "#1A0A2E",
                fontSize: "14px",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#E91E8C";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(26,10,46,0.1)";
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setNoteModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} loading={saving}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
