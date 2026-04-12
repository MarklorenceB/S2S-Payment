"use client";

import { useEffect, useState } from "react";
import { Search, User, Hash, Phone, Mail, KeyRound, Copy, Check, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/types";
import Modal from "@/components/ui/Modal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [resetModal, setResetModal] = useState(false);
  const [resetUser, setResetUser] = useState<Profile | null>(null);
  const [resetting, setResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "user")
        .order("created_at", { ascending: false });

      if (data) setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleResetPassword = async (user: Profile) => {
    setResetUser(user);
    setNewPassword("");
    setResetError("");
    setCopied(false);
    setShowPassword(false);
    setResetModal(true);
  };

  const confirmReset = async () => {
    if (!resetUser) return;
    setResetting(true);
    setResetError("");

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: resetUser.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResetError(data.error || "Failed to reset password.");
        return;
      }

      setNewPassword(data.newPassword);
    } catch {
      setResetError("Something went wrong.");
    } finally {
      setResetting(false);
    }
  };

  const copyPassword = async () => {
    if (!newPassword) return;
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.account_number.includes(search) ||
      u.contact_number.includes(search)
  );

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
          Users
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(26,10,46,0.4)", marginTop: "4px" }}>
          {users.length} registered users
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <Search
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "18px",
            height: "18px",
            color: "rgba(26,10,46,0.3)",
          }}
        />
        <input
          type="text"
          placeholder="Search by name, account #, or phone #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px 14px 44px",
            borderRadius: "14px",
            background: "#fff",
            border: "2px solid rgba(26,10,46,0.1)",
            color: "#1A0A2E",
            fontSize: "14px",
            outline: "none",
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

      {/* User list */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                height: "100px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.6)",
              }}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((user, index) => (
            <div
              key={user.id}
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
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  className="bg-brand-gradient"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <User style={{ width: "22px", height: "22px", color: "#fff" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#1A0A2E",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.full_name}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Hash style={{ width: "13px", height: "13px", color: "#FF8C00", flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: "rgba(26,10,46,0.5)" }}>{user.account_number}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone style={{ width: "13px", height: "13px", color: "#E91E8C", flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: "rgba(26,10,46,0.5)" }}>{user.contact_number}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Mail style={{ width: "13px", height: "13px", color: "#8B5CF6", flexShrink: 0 }} />
                      <span
                        style={{
                          fontSize: "13px",
                          color: "rgba(26,10,46,0.5)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.email || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset Password Button */}
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(26,10,46,0.06)" }}>
                <button
                  onClick={() => handleResetPassword(user)}
                  className="cursor-pointer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(26,10,46,0.1)",
                    background: "rgba(139,92,246,0.06)",
                    color: "#7C3AED",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <KeyRound style={{ width: "14px", height: "14px" }} />
                  Reset Password
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontSize: "15px", color: "rgba(26,10,46,0.3)" }}>No users found</p>
            </div>
          )}
        </div>
      )}

      {/* Reset Password Modal */}
      <Modal
        open={resetModal}
        onClose={() => {
          setResetModal(false);
          setNewPassword("");
          setResetError("");
        }}
        title="Reset Password"
      >
        {resetUser && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                padding: "14px",
                borderRadius: "14px",
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.1)",
              }}
            >
              <p style={{ fontSize: "13px", color: "rgba(26,10,46,0.5)", marginBottom: "4px" }}>
                Resetting password for
              </p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#1A0A2E" }}>
                {resetUser.full_name}
              </p>
              <p style={{ fontSize: "13px", color: "rgba(26,10,46,0.4)", marginTop: "2px" }}>
                Account: {resetUser.account_number}
              </p>
            </div>

            {!newPassword && !resetError && (
              <>
                <p style={{ fontSize: "13px", color: "rgba(26,10,46,0.5)", lineHeight: 1.6 }}>
                  This will generate a new random password for this user. Their current password will stop working immediately.
                </p>
                <button
                  onClick={confirmReset}
                  disabled={resetting}
                  className="cursor-pointer"
                  style={{
                    width: "100%",
                    padding: "14px 24px",
                    borderRadius: "14px",
                    background: resetting
                      ? "rgba(139,92,246,0.5)"
                      : "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "var(--font-display)",
                    border: "none",
                    cursor: resetting ? "not-allowed" : "pointer",
                    boxShadow: "0 8px 32px rgba(124,58,237,0.2)",
                  }}
                >
                  {resetting ? "Generating..." : "Generate New Password"}
                </button>
              </>
            )}

            {resetError && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "#FEF2F2",
                  color: "#EF4444",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "1px solid #FECACA",
                }}
              >
                {resetError}
              </div>
            )}

            {newPassword && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                  }}
                >
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#16A34A", marginBottom: "8px" }}>
                    NEW PASSWORD
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <code
                      style={{
                        flex: 1,
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#1A0A2E",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {showPassword ? newPassword : "••••••••"}
                    </code>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer"
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid rgba(26,10,46,0.1)",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {showPassword ? (
                        <EyeOff style={{ width: "16px", height: "16px", color: "rgba(26,10,46,0.4)" }} />
                      ) : (
                        <Eye style={{ width: "16px", height: "16px", color: "rgba(26,10,46,0.4)" }} />
                      )}
                    </button>
                    <button
                      onClick={copyPassword}
                      className="cursor-pointer"
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid rgba(26,10,46,0.1)",
                        background: copied ? "#16A34A" : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      {copied ? (
                        <Check style={{ width: "16px", height: "16px", color: "#fff" }} />
                      ) : (
                        <Copy style={{ width: "16px", height: "16px", color: "rgba(26,10,46,0.4)" }} />
                      )}
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: "12px", color: "rgba(26,10,46,0.4)", lineHeight: 1.5 }}>
                  Share this password with the user. They will use this as their new Contact Number to log in.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
