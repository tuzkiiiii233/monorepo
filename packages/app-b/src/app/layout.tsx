import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "App B",
  description: "Monorepo Demo - App B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
