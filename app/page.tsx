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
  Cloud,
  Brain,
  FileText,
  MapPin,
  TrendingUp,
  Award,
  Heart,
  ChevronRight,
  Menu,
  X
} from "lucide-react"
import { storage } from "@/lib/storage"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = storage.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      router.push('/dashboard')
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms trained on thousands of blood smear images for accurate malaria parasite detection."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get diagnostic results in seconds, not hours. Enable rapid treatment decisions in critical situations."
    },
    {
      icon: Shield,
      title: "Offline Capability",
      description: "Works without internet connection. All processing happens locally on your device for maximum privacy."
    },
    {
      icon: FileText,
      title: "Detailed Reports",
      description: "Generate comprehensive reports with parasite counts, species identification, and treatment recommendations."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track trends, monitor outbreaks, and make data-driven decisions with powerful analytics tools."
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Access from any device - desktop, tablet, or smartphone. Optimized for field use in remote areas."
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Microscope className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">MalariaX Labs</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
              </Link>
              <Link href="#use-cases" className="text-sm font-medium hover:text-primary transition-colors">
                Use Cases
              </Link>
              <Link href="#stats" className="text-sm font-medium hover:text-primary transition-colors">
                Impact
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t">
            <div className="px-4 py-4 space-y-2">
              <Link href="#features" className="block py-2 text-sm font-medium hover:text-primary">
                Features
              </Link>
              <Link href="#how-it-works" className="block py-2 text-sm font-medium hover:text-primary">
                How It Works
              </Link>
              <Link href="#use-cases" className="block py-2 text-sm font-medium hover:text-primary">
                Use Cases
              </Link>
              <Link href="#stats" className="block py-2 text-sm font-medium hover:text-primary">
                Impact
              </Link>
              <div className="pt-4 space-y-2">
                <Link href="/auth/login" className="block">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link href="/auth/signup" className="block">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <Badge className="inline-flex" variant="secondary">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Malaria Detection
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Detect Malaria in
              <span className="text-primary"> Seconds</span>
              <br />
              Save Lives in
              <span className="text-primary"> Minutes</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Revolutionary AI-powered malaria detection system that works offline, 
              provides instant results, and helps healthcare workers make faster, 
              more accurate diagnoses in resource-limited settings.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Demo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required • Works offline • HIPAA compliant
            </p>
          </div>

          {/* Hero Image/Animation */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Microscope className="h-24 w-24 mx-auto text-primary/50" />
                  <p className="text-xl font-semibold text-muted-foreground">
                    AI-Powered Blood Sample Analysis
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for Malaria Detection
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Comprehensive tools designed for healthcare professionals in any setting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple 3-Step Process
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              From sample to diagnosis in under a minute
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
              <p className="text-muted-foreground">
                Take a photo of the blood smear under a microscope or upload an existing image
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI instantly analyzes the image, identifying parasites and infected cells
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-muted-foreground">
                Receive detailed diagnosis with parasite count, species, and treatment recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for Every Healthcare Setting
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              From rural clinics to research laboratories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <useCase.icon className="h-8 w-8 text-primary" />
                    <CardTitle>{useCase.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Malaria Detection?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of healthcare facilities already using MalariaX Labs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download Brochure
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
              30-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Microscope className="h-6 w-6 text-primary" />
                <span className="font-bold">MalariaX Labs</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered malaria detection for better healthcare outcomes worldwide.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-primary">How It Works</Link></li>
                <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary">API Access</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Documentation</Link></li>
                <li><Link href="#" className="hover:text-primary">Research Papers</Link></li>
                <li><Link href="#" className="hover:text-primary">Case Studies</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 MalariaX Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}