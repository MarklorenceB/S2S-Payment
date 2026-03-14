"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skyline from "@/components/layout/Skyline";

export default function SplashPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1600);
    const t4 = setTimeout(() => router.push("/auth/login"), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-brand-gradient-vertical relative overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative circles */}
      <div className="absolute top-20 -left-20 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(255,184,0,0.2)" }} />
      <div className="absolute bottom-40 -right-20 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(233,30,140,0.2)" }} />
      <div className="absolute top-1/3 right-10 w-40 h-40 rounded-full blur-2xl" style={{ background: "rgba(255,140,0,0.2)" }} />

      {/* Logo area */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8">
        <div
          className="transition-all duration-1000 ease-out"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1) rotate(0deg)" : "scale(0.3) rotate(-10deg)",
          }}
        >
          <div
            className="w-32 h-32 rounded-[2rem] flex items-center justify-center animate-pulse-glow"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}
          >
            <span className="text-5xl font-black text-white tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
              S2S
            </span>
          </div>
        </div>

        <div
          className="transition-all duration-700 ease-out text-center"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            S2S Payment
          </h1>
          <div className="h-1 w-24 mx-auto rounded-full" style={{ background: "#FFB800" }} />
        </div>

        <p
          className="transition-all duration-700 ease-out text-center text-lg font-medium max-w-xs"
          style={{
            color: "rgba(255,255,255,0.7)",
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(15px)",
          }}
        >
          Your Internet Service Portal
        </p>

        <div className="flex gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.5)",
                animation: phase >= 3 ? `float 1.5s ease-in-out ${i * 0.2}s infinite` : "none",
                opacity: phase >= 3 ? 1 : 0,
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <Skyline />
      </div>
    </div>
  );
}
