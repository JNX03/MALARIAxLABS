"use client"

import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// Dynamically import the map to avoid SSR issues
const MalariaMap = dynamic(() => import("@/components/malaria-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8 min-h-[400px]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading interactive map...</p>
      </div>
    </div>
  )
})

export default function MapPage() {
  return (
    <Card className="border-border/40 overflow-hidden">
      <CardContent className="p-0">
        <MalariaMap />
      </CardContent>
    </Card>
  )
}