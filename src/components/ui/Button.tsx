"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #FF8C00 0%, #E91E8C 50%, #6B21A8 100%)",
    color: "#fff",
    boxShadow: "0 8px 32px rgba(233,30,140,0.2), 0 2px 8px rgba(255,140,0,0.1)",
  },
  secondary: {
    background: "#1A0A2E",
    color: "#fff",
  },
  outline: {
    background: "transparent",
    color: "#E91E8C",
    border: "2px solid #E91E8C",
  },
  ghost: {
    background: "transparent",
    color: "#1A0A2E",
  },
  danger: {
    background: "#EF4444",
    color: "#fff",
  },
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "8px 16px", fontSize: "14px", gap: "6px" },
    md: { padding: "12px 24px", fontSize: "16px", gap: "8px" },
    lg: { padding: "16px 32px", fontSize: "18px", gap: "10px" },
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        className
      )}
      style={{
        fontFamily: "var(--font-display)",
        borderRadius: "16px",
        border: "none",
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
