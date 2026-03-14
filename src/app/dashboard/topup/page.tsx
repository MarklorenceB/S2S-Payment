"use client";

import { useEffect, useState, useRef } from "react";
import { Hash, Phone, Upload, ImageIcon, CheckCircle2, Clock, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { TopupRequest } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

export default function TopupPage() {
  const [topups, setTopups] = useState<TopupRequest[]>([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [viewImage, setViewImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setAccountNumber(profileData.account_number);
        setContactNumber(profileData.contact_number);
      }

      const { data: topupData } = await supabase
        .from("topup_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (topupData) setTopups(topupData);
    };
    init();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) {
      setError("Please upload a payment screenshot.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = screenshot.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(fileName, screenshot);

      if (uploadError) {
        setError("Failed to upload screenshot. Please try again.");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("payment-screenshots")
        .getPublicUrl(fileName);

      const { data: topup, error: insertError } = await supabase
        .from("topup_requests")
        .insert({
          user_id: user.id,
          account_number: accountNumber,
          contact_number: contactNumber,
          screenshot_url: urlData.publicUrl,
          status: "pending",
        })
        .select()
        .single();

      if (insertError) {
        setError("Failed to submit request. Please try again.");
        setLoading(false);
        return;
      }

      if (topup) {
        setTopups((prev) => [topup, ...prev]);
      }

      setSuccess(true);
      setScreenshot(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";

      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending: { badge: "warning" as const, icon: Clock, label: "Pending" },
    approved: { badge: "success" as const, icon: CheckCircle2, label: "Approved" },
    rejected: { badge: "danger" as const, icon: XCircle, label: "Rejected" },
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
        Load / Top Up
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
            Top-up request submitted successfully! Waiting for admin approval.
          </p>
        </div>
      )}

      {/* Form card */}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input
              label="Account Number"
              placeholder="Your account #"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              icon={<Hash style={{ width: "20px", height: "20px" }} />}
              required
            />

            <Input
              label="Cellphone Number"
              placeholder="Your contact #"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              icon={<Phone style={{ width: "20px", height: "20px" }} />}
              required
            />

            {/* Screenshot upload */}
            <div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: "rgba(26,10,46,0.7)",
                  marginBottom: "8px",
                }}
              >
                Payment Screenshot
              </p>
              <input
                ref={fileRef}
                id="screenshot-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  margin: "-1px",
                  overflow: "hidden",
                  clip: "rect(0,0,0,0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              />
              <label
                htmlFor="screenshot-upload"
                style={{
                  display: "block",
                  borderRadius: "16px",
                  padding: "24px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: "2px dashed rgba(233,30,140,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(233,30,140,0.6)";
                  e.currentTarget.style.background = "rgba(233,30,140,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(233,30,140,0.3)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {preview ? (
                  <div>
                    <img
                      src={preview}
                      alt="Payment screenshot"
                      style={{ maxHeight: "200px", margin: "0 auto", borderRadius: "12px", objectFit: "contain" }}
                    />
                    <p style={{ fontSize: "13px", marginTop: "8px", color: "rgba(26,10,46,0.5)" }}>Tap to change</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(233,30,140,0.1)",
                      }}
                    >
                      <Upload style={{ width: "22px", height: "22px", color: "#E91E8C" }} />
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(26,10,46,0.5)" }}>
                      Tap to upload screenshot
                    </p>
                    <p style={{ fontSize: "11px", color: "rgba(26,10,46,0.3)" }}>
                      JPG, PNG, or GIF up to 10MB
                    </p>
                  </div>
                )}
              </label>
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
              Submit Top-up Request
            </Button>
          </div>
        </form>
      </div>

      {/* Request history */}
      {topups.length > 0 && (
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
            Recent Requests
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {topups.map((topup, index) => {
              const config = statusConfig[topup.status];
              return (
                <div
                  key={topup.id}
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
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <Badge variant={config.badge}>{config.label}</Badge>
                      </div>
                      <p style={{ fontSize: "11px", color: "rgba(26,10,46,0.4)", marginTop: "4px" }}>
                        {formatDate(topup.created_at)}
                      </p>
                      {topup.admin_notes && (
                        <p style={{ fontSize: "13px", marginTop: "8px", fontStyle: "italic", color: "rgba(26,10,46,0.6)" }}>
                          &ldquo;{topup.admin_notes}&rdquo;
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setViewImage(topup.screenshot_url)}
                      style={{
                        padding: "8px",
                        borderRadius: "10px",
                        background: "rgba(233,30,140,0.1)",
                        border: "none",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(233,30,140,0.2)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(233,30,140,0.1)"; }}
                    >
                      <ImageIcon style={{ width: "18px", height: "18px", color: "#E91E8C" }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Image preview modal */}
      <Modal open={!!viewImage} onClose={() => setViewImage(null)} title="Payment Screenshot">
        {viewImage && (
          <img
            src={viewImage}
            alt="Payment screenshot"
            className="w-full rounded-xl"
          />
        )}
      </Modal>
    </div>
  );
}
