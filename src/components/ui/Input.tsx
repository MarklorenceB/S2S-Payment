"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label
          className="block text-sm font-semibold mb-1.5"
          style={{ color: "rgba(26,10,46,0.7)", fontFamily: "var(--font-display)" }}
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div
              className="absolute left-4 top-1/2 flex items-center justify-center"
              style={{ transform: "translateY(-50%)", color: "rgba(233,30,140,0.5)", zIndex: 1 }}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={className}
            style={{
              width: "100%",
              padding: icon ? "14px 16px 14px 48px" : "14px 16px",
              borderRadius: "12px",
              border: error ? "2px solid #EF4444" : "2px solid rgba(26,10,46,0.1)",
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
              e.target.style.borderColor = error ? "#EF4444" : "rgba(26,10,46,0.1)";
              e.target.style.boxShadow = "none";
            }}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm font-medium" style={{ color: "#EF4444" }}>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
