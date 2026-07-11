import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teotia Shopprix for all | India's #1 Online Mega Store",
  description: "Experience modern, advanced online shopping across Electronics, Fashion, Grocery, Books, and Home Tech. Free Shopprix Express delivery and 100% purchase guarantee.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
