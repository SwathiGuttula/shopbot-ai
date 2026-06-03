import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopBot AI — Smart Shopping Assistant",
  description: "AI-powered shopping concierge for modern e-commerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
