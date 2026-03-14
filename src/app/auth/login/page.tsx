"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Hash, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateSyntheticEmail } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skyline from "@/components/layout/Skyline";

export default function LoginPage() {
  const router = useRouter();
  const [accountNumber, setAccountNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const email = generateSyntheticEmail(accountNumber);

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: contactNumber,
      });

      if (authError) {
        setError("Invalid account number or contact number. Please try again.");
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
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
          top: "40px",
          right: "-80px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          filter: "blur(48px)",
          background: "rgba(255,184,0,0.15)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "160px",
          left: "-64px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          filter: "blur(48px)",
          background: "rgba(233,30,140,0.2)",
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
          padding: "48px 24px",
        }}
      >
        {/* Logo + Header */}
        <div
          className="animate-slide-up"
          style={{
            textAlign: "center",
            marginBottom: "32px",
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
            Welcome Back
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
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
            <form onSubmit={handleLogin}>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <Input
                  label="Account Number"
                  placeholder="Enter your account #"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  icon={<Hash style={{ width: "20px", height: "20px" }} />}
                  required
                />

                <Input
                  label="Contact Number"
                  placeholder="Enter your phone #"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  icon={<Phone style={{ width: "20px", height: "20px" }} />}
                  required
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
                  Sign In
                </Button>
              </div>
            </form>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "rgba(26,10,46,0.5)" }}>
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  style={{
                    fontWeight: 700,
                    color: "#E91E8C",
                    textDecoration: "none",
                  }}
                >
                  Sign Up
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
