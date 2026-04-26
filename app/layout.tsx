import type { Metadata } from "next";
import { Sora, Lora } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans"
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "AI Business Manager",
  description: "Full-stack dashboard for micro-entrepreneur business data"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${lora.variable}`}>{children}</body>
    </html>
  );
}
