import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Tasarım kaynağı: app_seng src/theme.ts
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin", "latin-ext"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "KOU SENG - Web Sitesi",
  description: "Kocaeli Üniversitesi Yazılım Kulübü'nün web sitesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${pressStart.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
