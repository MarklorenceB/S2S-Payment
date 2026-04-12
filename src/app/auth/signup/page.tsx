"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Hash, Phone, User, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateSyntheticEmail } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skyline from "@/components/layout/Skyline";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    accountNumber: "",
    fullName: "",
    contactNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountNumber: form.accountNumber,
          fullName: form.fullName,
          contactNumber: form.contactNumber,
          email: form.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed.");
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const syntheticEmail = generateSyntheticEmail(form.accountNumber);

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: syntheticEmail,
        password: form.contactNumber,
      });

      if (loginError) {
        setError("Account created but auto-login failed. Please sign in manually.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-brand-gradient-vertical"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blurs */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: "-80px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          filter: "blur(48px)",
          background: "rgba(255,184,0,0.15)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "240px",
          right: "-64px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          filter: "blur(48px)",
          background: "rgba(255,140,0,0.15)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        {/* Logo + Header */}
        <div
          className="animate-slide-up"
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          {/* S2S Logo */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              S2S
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: "6px",
            }}
          >
            Create Account
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
            Join S2S Payment portal
          </p>
        </div>

        {/* Signup Card */}
        <div
          className="animate-slide-up"
          style={{
            width: "100%",
            maxWidth: "380px",
            animationDelay: "0.15s",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: "24px",
              padding: "28px 24px",
              boxShadow: "0 20px 60px rgba(26,10,46,0.15), 0 4px 12px rgba(26,10,46,0.08)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            <form onSubmit={handleSignup}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Input
                  label="Account Number"
                  placeholder="Your ISP account #"
                  value={form.accountNumber}
                  onChange={(e) => updateField("accountNumber", e.target.value)}
                  icon={<Hash style={{ width: "20px", height: "20px" }} />}
                  maxLength={50}
                  required
                />

                <Input
                  label="Full Name"
                  placeholder="Juan Dela Cruz"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  icon={<User style={{ width: "20px", height: "20px" }} />}
                  maxLength={100}
                  required
                />

                <Input
                  label="Contact Number"
                  placeholder="09XX XXX XXXX"
                  value={form.contactNumber}
                  onChange={(e) => updateField("contactNumber", e.target.value)}
                  icon={<Phone style={{ width: "20px", height: "20px" }} />}
                  maxLength={20}
                  required
                />

                <Input
                  label="Email Address (optional)"
                  placeholder="email@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  icon={<Mail style={{ width: "20px", height: "20px" }} />}
                  maxLength={100}
                />

                {error && (
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "#FEF2F2",
                      color: "#EF4444",
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
                  Create Account
                </Button>
              </div>
            </form>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "rgba(26,10,46,0.5)" }}>
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  style={{
                    fontWeight: 700,
                    color: "#E91E8C",
                    textDecoration: "none",
                  }}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skyline */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <Skyline />
      </div>
    </div>
  );
}
