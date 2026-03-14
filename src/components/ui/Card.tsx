import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  variant?: "glass" | "solid" | "gradient";
  style?: React.CSSProperties;
}

const variantStyles: Record<string, React.CSSProperties> = {
  glass: {
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 4px 24px rgba(26,10,46,0.08), 0 1px 4px rgba(26,10,46,0.04)",
  },
  solid: {
    background: "#fff",
    boxShadow: "0 4px 24px rgba(26,10,46,0.08), 0 1px 4px rgba(26,10,46,0.04)",
  },
  gradient: {
    background: "linear-gradient(135deg, #FFF5E6 0%, #FFE0F0 50%, #E8D5F5 100%)",
    boxShadow: "0 4px 24px rgba(26,10,46,0.08), 0 1px 4px rgba(26,10,46,0.04)",
  },
};

export default function Card({ className, children, variant = "glass", style }: CardProps) {
  return (
    <div
      className={cn("rounded-3xl p-6", className)}
      style={{
        border: "1px solid rgba(255,255,255,0.2)",
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
