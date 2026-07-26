import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cierra Reynolds | Healthcare Analytics Portfolio",
  description:
    "Healthcare analytics portfolio featuring complete revenue cycle, claims denial, pharmacy operations, and prior authorization case studies.",
  keywords: [
    "Cierra Reynolds",
    "healthcare analytics",
    "revenue cycle",
    "pharmacy operations",
    "prior authorization",
    "SQL",
    "Excel",
  ],
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
