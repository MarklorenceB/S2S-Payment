"use client";

import { useEffect, useState } from "react";
import { Search, User, Hash, Phone, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          Users
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
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
            color: "rgba(255,255,255,0.3)",
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
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
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
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
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
                background: "rgba(255,255,255,0.04)",
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
                background: "rgba(255,255,255,0.06)",
                borderRadius: "16px",
                padding: "16px",
                border: "1px solid rgba(255,255,255,0.06)",
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
                      color: "#fff",
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
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{user.account_number}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone style={{ width: "13px", height: "13px", color: "#E91E8C", flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{user.contact_number}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Mail style={{ width: "13px", height: "13px", color: "#8B5CF6", flexShrink: 0 }} />
                      <span
                        style={{
                          fontSize: "13px",
                          color: "rgba(255,255,255,0.5)",
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
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.3)" }}>No users found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
