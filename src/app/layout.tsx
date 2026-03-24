import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IIFTA Portal - Next-Generation Finance Education",
  description: "Transform your career with industry-leading certification programs, hands-on AI accounting tools, and direct access to global opportunities.",
  keywords: ["IIFTA", "Finance Education", "FinTech", "AI Accounting", "Certification", "Career Development"],
  authors: [{ name: "IIFTA Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "IIFTA Portal - Next-Generation Finance Education",
    description: "Transform your career with industry-leading certification programs and AI-powered learning",
    url: "https://iifta.portal.com",
    siteName: "IIFTA Portal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IIFTA Portal",
    description: "Next-Generation Finance Education with AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
