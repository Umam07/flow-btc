import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-title",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bitcoin ETF Flow Terminal | Institutional Market Intelligence",
  description:
    "Live net inflows, redemptions, and historical liquidity trends across all 11 US Spot Bitcoin ETFs. Clean, transparent, and effortlessly accessible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#F7F6F4] text-[#0E0E0E] antialiased selection:bg-[#FFB3C7] selection:text-[#0E0E0E]">
        {children}
      </body>
    </html>
  );
}
