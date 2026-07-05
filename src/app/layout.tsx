import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RoadmapOS",
    template: "%s | RoadmapOS",
  },
  description:
    "A constraint-aware life roadmap system for career, money, health, discipline, and family goals.",
  applicationName: "RoadmapOS",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "RoadmapOS",
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
      <body className="min-h-full bg-[#f7f5ef] text-neutral-950 flex flex-col">
        {children}
      </body>
    </html>
  );
}
