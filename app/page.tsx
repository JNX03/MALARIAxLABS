"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Microscope, 
  Activity, 
  Users, 
  Globe, 
  ArrowRight, 
  CheckCircle2,
  Zap,
  Shield,
  Clock,
  BarChart3,
  Download,
  Smartphone,
  Brain,
  FileText,
  MapPin,
  TrendingUp,
  Heart,
  ChevronRight,
  Star,
  Award,
  Target,
  Stethoscope,
  PlayCircle,
  Sparkles,
} from "lucide-react"
import { storage } from "@/lib/storage"
import { useApp } from "@/contexts/app-context"
import { useTranslation } from "@/lib/i18n"
import Navbar from "@/components/navbar-new"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const currentUser = storage.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      router.push('/dashboard')
    }
  }, [router])

  const stats = [
    { label: "Analyses Performed", value: "50,000+", icon: Activity },
    { label: "Healthcare Facilities", value: "200+", icon: Users },
    { label: "Countries Served", value: "15", icon: Globe },
    { label: "Accuracy Rate", value: "96%", icon: TrendingUp },
  ]

  const features = [
    {
      icon: Brain,
      title: t.features.aiDetection,
      description: t.features.aiDetectionDesc
    },
    {
      icon: Zap,
      title: t.features.instantResults,
      description: t.features.instantResultsDesc
    },
    {
      icon: Shield,
      title: t.features.offlineCapability,
      description: t.features.offlineCapabilityDesc
    },
    {
      icon: FileText,
      title: t.features.detailedReports,
      description: t.features.detailedReportsDesc
    },
    {
      icon: BarChart3,
      title: t.features.analytics,
      description: t.features.analyticsDesc
    },
    {
      icon: Smartphone,
      title: t.features.mobileReady,
      description: t.features.mobileReadyDesc
    }
  ]

  const useCases = [
    {
      title: "Rural Health Centers",
      description: "Enable accurate malaria diagnosis in remote areas without access to trained microscopists.",
      icon: MapPin
    },
    {
      title: "Emergency Departments",
      description: "Rapid screening for travelers and patients with fever of unknown origin.",
      icon: Clock
    },
    {
      title: "Research Institutions",
      description: "Standardized analysis for clinical trials and epidemiological studies.",
      icon: Microscope
    },
    {
      title: "Public Health Programs",
      description: "Monitor disease prevalence and track elimination progress.",
      icon: Heart
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-emerald-50/30 dark:from-background dark:via-blue-950/20 dark:to-emerald-950/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full animate-spin" style={{animationDuration: '30s'}} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-2">
              <Badge className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20 hover:border-primary/40 transition-all duration-300" variant="outline">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                Revolutionary AI Technology
                <Star className="h-3 w-3 text-yellow-500" />
              </Badge>
            </div>
            
            {/* Enhanced Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none">
                <span className="bg-gradient-to-r from-primary via-blue-600 to-emerald-600 bg-clip-text text-transparent animate-fade-in">
                  MalariaX
                </span>
                <br />
                <span className="text-foreground/90 text-4xl sm:text-5xl md:text-6xl">
                  Detect • Diagnose • Save Lives
                </span>
              </h1>
              
              <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-muted-foreground/80 font-light leading-relaxed">
                Revolutionary AI-powered malaria detection that works offline, provides instant results, 
                and helps healthcare workers make faster, life-saving diagnoses.
              </p>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto group relative overflow-hidden px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300">
                  <span className="relative z-10 flex items-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto group px-8 py-4 text-lg font-semibold border-2 hover:bg-primary/5 transition-all duration-300">
                  <PlayCircle className="mr-2 h-5 w-5 text-primary" />
                  Watch Demo
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-green-700 dark:text-green-400 font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 dark:text-blue-400 font-medium">Works Offline</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-purple-700 dark:text-purple-400 font-medium">HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">          
          {/* Feature highlights banner 
          <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-primary/5 via-blue-500/5 to-emerald-500/5 border border-primary/10">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Why Choose MalariaX?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Target className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="font-semibold">99.1% Sensitivity</p>
                  <p className="text-sm text-muted-foreground">Clinical validation</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-semibold">15 Second Analysis</p>
                  <p className="text-sm text-muted-foreground">Lightning fast results</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="font-semibold">Zero Internet Required</p>
                  <p className="text-sm text-muted-foreground">Works anywhere</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>*/}

      {/* Enhanced How It Works Section 
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-emerald-50/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-emerald-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="inline-flex items-center gap-1.5 px-3 py-1 mb-4" variant="outline">
              <Activity className="h-3 w-3" />
              How It Works
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-foreground">Simple</span>
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> 3-Step Process</span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-muted-foreground leading-relaxed">
              From microscopy image to accurate diagnosis in under 30 seconds. 
              No special equipment needed beyond a basic microscope.
            </p>
          </div>

          <div className="relative">*/}
            {/* Connection lines 
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30 -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: "1",
                  title: "Capture & Upload",
                  description: "Take a photo of the blood smear under any standard microscope or upload existing microscopy images",
                  icon: Smartphone,
                  color: "emerald"
                },
                {
                  step: "2", 
                  title: "AI Analysis",
                  description: "Our advanced AI instantly processes the image, identifying parasites, infected cells, and calculating parasite density",
                  icon: Brain,
                  color: "blue"
                },
                {
                  step: "3",
                  title: "Instant Results",
                  description: "Get comprehensive diagnosis with parasite species identification, load assessment, and clinical recommendations",
                  icon: FileText,
                  color: "purple"
                }
              ].map((item, index) => (
                <div key={index} className="text-center group relative">
                  <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardContent className="relative z-10 p-8">*/}
                      {/* Step number with enhanced styling */}
                      {/* <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <span className="text-3xl font-bold text-white">{item.step}</span>
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div> */}

                      {/* Icon */}
                      {/* <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                        item.color === 'emerald' ? 'from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30' :
                        item.color === 'blue' ? 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30' :
                        'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30'
                      } flex items-center justify-center mx-auto mb-4`}>
                        <item.icon className={`h-6 w-6 ${
                          item.color === 'emerald' ? 'text-emerald-600' :
                          item.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                        }`} />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-primary/90 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div> */}

          {/* Process timeline */}
          {/* <div className="mt-20 text-center">
            <div className="inline-flex items-center justify-center space-x-4 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Average processing time: 15-30 seconds</span>
              <Zap className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </section> */} 
    </div>
  )
}