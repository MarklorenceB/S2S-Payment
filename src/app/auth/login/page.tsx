"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Hash, Phone, Shield, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateSyntheticEmail } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skyline from "@/components/layout/Skyline";

export default function LoginPage() {
  const router = useRouter();
  const [isAdminMode, setIsAdminMode] = useState(false);
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
        setError(
          isAdminMode
            ? "Invalid account number or password."
            : "Invalid account number or contact number. Please try again."
        );
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

        if (isAdminMode && profile?.role !== "admin") {
          await supabase.auth.signOut();
          setError("This account does not have admin access.");
          setLoading(false);
          return;
        }

        if (profile?.role === "admin") {
          // Generate unique session token and save to DB + localStorage
          const token = crypto.randomUUID();
          await supabase
            .from("profiles")
            .update({ session_token: token })
            .eq("id", user.id);
          localStorage.setItem("admin_session_token", token);
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

  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
    setError("");
    setAccountNumber("");
    setContactNumber("");
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
          {/* Logo */}
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
            {isAdminMode ? (
              <Shield
                style={{
                  width: "28px",
                  height: "28px",
                  color: "#fff",
                }}
              />
            ) : (
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
            )}
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
            {isAdminMode ? "Admin Login" : "Welcome Back"}
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
            {isAdminMode
              ? "Sign in to the management panel"
              : "Sign in to your account"}
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
                  placeholder={isAdminMode ? "Enter admin account #" : "Enter your account #"}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  icon={<Hash style={{ width: "20px", height: "20px" }} />}
                  maxLength={50}
                  required
                />

                {isAdminMode ? (
                  <div className="w-full">
                    <label
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: "rgba(26,10,46,0.7)", fontFamily: "var(--font-display)" }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div
                        className="absolute left-4 top-1/2 flex items-center justify-center"
                        style={{
                          transform: "translateY(-50%)",
                          color: "rgba(233,30,140,0.5)",
                          zIndex: 1,
                        }}
                      >
                        <Lock style={{ width: "20px", height: "20px" }} />
                      </div>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        maxLength={50}
                        required
                        style={{
                          width: "100%",
                          padding: "14px 16px 14px 48px",
                          borderRadius: "12px",
                          border: "2px solid rgba(26,10,46,0.1)",
                          background: "rgba(255,255,255,0.8)",
                          color: "#1A0A2E",
                          fontSize: "16px",
                          fontFamily: "var(--font-body)",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#E91E8C";
                          e.target.style.boxShadow = "0 0 0 3px rgba(233,30,140,0.15)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(26,10,46,0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <Input
                    label="Contact Number"
                    placeholder="Enter your phone #"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    icon={<Phone style={{ width: "20px", height: "20px" }} />}
                    maxLength={20}
                    required
                  />
                )}

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
                  {isAdminMode ? "Sign In as Admin" : "Sign In"}
                </Button>
              </div>
            </form>

            {!isAdminMode && (
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
            )}
          </div>

          {/* Toggle Admin / User mode */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={toggleMode}
              className="cursor-pointer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                transition: "all 0.3s ease",
              }}
            >
              {isAdminMode ? (
                <>
                  <Phone style={{ width: "16px", height: "16px" }} />
                  Login as User
                </>
              ) : (
                <>
                  <Shield style={{ width: "16px", height: "16px" }} />
                  Login as Admin
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Skyline */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none" }}>
        <Skyline />
      </div>
    </div>
  );
}
