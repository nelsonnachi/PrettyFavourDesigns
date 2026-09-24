import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SHOPPFD",
  description: "Your all in one place for everything bags",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${cormorant.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClerkProvider>
          <QueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
