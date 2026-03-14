import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "S2S Payment - Internet Service Portal",
  description: "Manage your internet service, top-up, and report issues",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
