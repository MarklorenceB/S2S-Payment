"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ImageIcon, Clock, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { TopupRequest } from "@/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function AdminTopupsPage() {
  const [topups, setTopups] = useState<TopupRequest[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopups = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("topup_requests")
        .select("*, profiles(full_name, account_number, contact_number)")
        .order("created_at", { ascending: false });

      if (data) setTopups(data);
      setLoading(false);
    };
    fetchTopups();
  }, []);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    setUpdatingId(id);
    const supabase = createClient();

    const { error } = await supabase
      .from("topup_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setTopups((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );

      // Sync status update to Google Sheets (fire and forget)
      fetch("/api/sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          id,
          status,
        }),
      }).catch(() => {
        // Silent fail — Supabase is the source of truth
      });
    }
    setUpdatingId(null);
  };

  const filtered = filter === "all" ? topups : topups.filter((t) => t.status === filter);

  const statusConfig = {
    pending: { badge: "warning" as const, label: "Pending" },
    approved: { badge: "success" as const, label: "Approved" },
    rejected: { badge: "danger" as const, label: "Rejected" },
  };

  const filterOptions: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
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
          Top-up Requests
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(26,10,46,0.4)", marginTop: "4px" }}>
          {topups.length} total requests
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

      {/* Topup list */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{ height: "120px", borderRadius: "16px", background: "rgba(255,255,255,0.6)" }}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((topup, index) => {
            const config = statusConfig[topup.status];
            const profile = topup.profiles;

            return (
              <div
                key={topup.id}
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
                {/* Top: badge + date + screenshot btn */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Badge variant={config.badge}>{config.label}</Badge>
                    <span style={{ fontSize: "11px", color: "rgba(26,10,46,0.25)" }}>
                      {formatDate(topup.created_at)}
                    </span>
                  </div>
                  <button
                    onClick={() => setViewImage(topup.screenshot_url)}
                    style={{
                      padding: "8px",
                      borderRadius: "10px",
                      background: "rgba(26,10,46,0.06)",
                      border: "none",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <ImageIcon style={{ width: "16px", height: "16px", color: "rgba(26,10,46,0.5)" }} />
                  </button>
                </div>

                {/* User info */}
                <p style={{ fontWeight: 700, fontSize: "15px", color: "#1A0A2E" }}>
                  {profile?.full_name || "Unknown User"}
                </p>
                <p style={{ fontSize: "12px", marginTop: "4px", color: "rgba(26,10,46,0.4)" }}>
                  Acct: {topup.account_number} &bull; Tel: {topup.contact_number}
                </p>
                {topup.gcash_reference && (
                  <p style={{ fontSize: "12px", marginTop: "2px", color: "rgba(26,10,46,0.5)", fontWeight: 600 }}>
                    GCash Ref: {topup.gcash_reference}
                  </p>
                )}

                {/* Actions */}
                {topup.status === "pending" && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusUpdate(topup.id, "approved")}
                      loading={updatingId === topup.id}
                      style={{
                        color: "#16A34A",
                        background: "rgba(16,185,129,0.12)",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        fontSize: "13px",
                      }}
                    >
                      <CheckCircle2 style={{ width: "15px", height: "15px" }} />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusUpdate(topup.id, "rejected")}
                      loading={updatingId === topup.id}
                      style={{
                        color: "#DC2626",
                        background: "rgba(239,68,68,0.12)",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        fontSize: "13px",
                      }}
                    >
                      <XCircle style={{ width: "15px", height: "15px" }} />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <Clock
                style={{
                  width: "36px",
                  height: "36px",
                  color: "rgba(26,10,46,0.15)",
                  margin: "0 auto 12px",
                }}
              />
              <p style={{ fontSize: "15px", color: "rgba(26,10,46,0.3)" }}>No requests found</p>
            </div>
          )}
        </div>
      )}

      {/* Image modal */}
      <Modal open={!!viewImage} onClose={() => setViewImage(null)} title="Payment Screenshot">
        {viewImage && (
          <img
            src={viewImage}
            alt="Payment screenshot"
            style={{ width: "100%", borderRadius: "12px" }}
          />
        )}
      </Modal>
    </div>
  );
}
