interface BadgeProps {
  variant: "success" | "warning" | "danger" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, React.CSSProperties> = {
  success: { background: "#D1FAE5", color: "#047857", border: "1px solid #A7F3D0" },
  warning: { background: "#FEF3C7", color: "#B45309", border: "1px solid #FDE68A" },
  danger: { background: "#FEE2E2", color: "#B91C1C", border: "1px solid #FECACA" },
  info: { background: "#E0F2FE", color: "#0369A1", border: "1px solid #BAE6FD" },
  neutral: { background: "#F3F4F6", color: "#4B5563", border: "1px solid #E5E7EB" },
};

export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 12px",
        fontSize: "11px",
        fontWeight: 700,
        borderRadius: "9999px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontFamily: "var(--font-display)",
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
