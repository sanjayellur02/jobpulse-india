import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobPulse India - Live Unemployment Analytics",
  description: "India's largest live unemployment transparency platform. Track employment status and view real-time analytics.",
  keywords: ["unemployment", "employment", "analytics", "jobs", "India"],
  // Open Graph meta tags (Q9)
  openGraph: {
    title: "JobPulse India - Live Unemployment Analytics",
    description: "India's largest live unemployment transparency platform. Track employment status and view real-time analytics.",
    url: "https://jobpulse-india.vercel.app",
    siteName: "JobPulse India",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "JobPulse India",
      },
    ],
  },
  // Twitter Card meta tags (Q9)
  twitter: {
    card: "summary_large_image",
    title: "JobPulse India - Live Unemployment Analytics",
    description: "India's largest live unemployment transparency platform. Track employment status and view real-time analytics.",
    images: ["/logo.png"],
    creator: "@jobpulseindia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
