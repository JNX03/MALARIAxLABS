import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "@/contexts/app-context"
import { I18nProvider } from "@/lib/i18n"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MalariaX - AI-Powered Malaria Detection",
  description: "Revolutionary AI-powered malaria detection system that works offline, provides instant results, and helps healthcare workers make faster diagnoses.",
  keywords: "malaria, detection, AI, healthcare, diagnosis, blood smear, microscopy",
  authors: [{ name: "MalariaX" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "MalariaX - AI-Powered Malaria Detection",
    description: "Detect malaria in seconds, save lives in minutes",
    type: "website",
    locale: "en_US",
    siteName: "MalariaX",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <I18nProvider>
            <AppProvider>
              <div className="relative min-h-screen bg-background text-foreground">
                {children}
              </div>
              <Toaster />
            </AppProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}