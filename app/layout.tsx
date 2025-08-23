import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MalariaX Labs - AI-Powered Malaria Detection",
  description: "Revolutionary AI-powered malaria detection system that works offline, provides instant results, and helps healthcare workers make faster diagnoses.",
  keywords: "malaria, detection, AI, healthcare, diagnosis, blood smear, microscopy",
  authors: [{ name: "MalariaX Labs" }],
  openGraph: {
    title: "MalariaX Labs - AI-Powered Malaria Detection",
    description: "Detect malaria in seconds, save lives in minutes",
    type: "website",
    locale: "en_US",
    siteName: "MalariaX Labs",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <div className="relative min-h-screen">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}