"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ padding: "0px 20px" }}>
      <div
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in",
          className
        )}
      >
        {title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 24px 8px",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#1A0A2E",
                fontFamily: "var(--font-display)",
              }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                padding: "8px",
                borderRadius: "50%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X style={{ width: "20px", height: "20px", color: "rgba(26,10,46,0.5)" }} />
            </button>
          </div>
        )}
        <div style={{ padding: "8px 34px 24px" }}>{children}</div>
      </div>
    </div>
  );
}
