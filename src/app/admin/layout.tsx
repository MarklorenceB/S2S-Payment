"use client";

import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(160deg, #FFF5E6 0%, #FFE0F0 50%, #E8D5F5 100%)",
      }}
    >
      <AdminSidebar />
      <main style={{ flex: 1 }}>
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "20px 20px 40px",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
