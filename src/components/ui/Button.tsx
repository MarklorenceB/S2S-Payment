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
  const sizes = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-2.5",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        sizes[size],
        className
      )}
      style={{
        fontFamily: "var(--font-display)",
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
