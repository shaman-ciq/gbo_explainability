import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GBO Explainability — Chat prototypes",
  description:
    "Three directional variants for chat-based GBO explainability: pane, tab, and inline.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
