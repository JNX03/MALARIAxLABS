"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import Navbar from "@/components/navbar-new"

// Dynamically import the map to avoid SSR issues
const MalariaMap = dynamic(() => import("@/components/malaria-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
})

export default function MapPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        <MalariaMap />
      </main>
    </div>
  )
}