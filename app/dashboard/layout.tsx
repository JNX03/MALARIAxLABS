"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import Navbar from "@/components/navbar-new"
import Loading from "@/components/loading"
import { useTranslation } from "@/lib/i18n"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useApp()
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <Loading message="Authenticating..." />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Router will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-background to-primary/5 border border-border/40">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
              {t.dashboard.welcome}{user?.name ? `, ${user.name}` : ''}!
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Monitor your malaria detection activities and insights
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  )
}