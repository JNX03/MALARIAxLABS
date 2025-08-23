"use client"

import { useState, useEffect, useTransition, memo } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { 
  Menu, 
  X, 
  Microscope, 
  Globe, 
  Sun, 
  Moon, 
  Monitor,
  User,
  LogOut,
  MapPin,
  Home,
  BarChart3,
  History,
  Settings,
  ChevronDown
} from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useTranslation } from "@/lib/i18n"
import { storage } from "@/lib/storage"
import Image from "next/image"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme, user, setUser } = useApp()
  const { locale, setLocale, t } = useTranslation()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    storage.signOut()
    setUser(null)
    router.push('/')
  }

  const navigation = [
    { 
      name: t.common.dashboard, 
      href: '/dashboard', 
      icon: Home,
      protected: true 
    },
    { 
      name: t.common.analysis, 
      href: '/dashboard/analysis', 
      icon: Microscope,
      protected: true
    },
    { 
      name: t.common.history, 
      href: '/dashboard/history', 
      icon: History,
      protected: true
    },
    { 
      name: t.common.insights, 
      href: '/dashboard/insights', 
      icon: BarChart3,
      protected: true
    },
    { 
      name: t.common.map, 
      href: '/dashboard/map', 
      icon: MapPin,
      protected: true
    },
  ]

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  }

  const ThemeIcon = themeIcons[theme as keyof typeof themeIcons] || Monitor

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <nav className="fixed w-full z-50 bg-background/90 backdrop-blur-sm border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <div className="w-8 h-8 bg-primary/20 rounded" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                MalariaX
              </span>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border/40' 
          : 'bg-background/90 backdrop-blur-sm border-b border-border/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image
                src="/favicon.png"
                alt="MalariaX"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              MalariaX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              if (item.protected && !user) return null
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={true}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  {locale === 'en' ? 'EN' : 'ไทย'}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border-border/50">
                <DropdownMenuLabel className="text-foreground">{t.common.language}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  onClick={() => setLocale('en')}
                  className={`text-foreground hover:bg-muted/80 ${locale === 'en' ? 'bg-muted/60' : ''}`}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLocale('th')}
                  className={`text-foreground hover:bg-muted/80 ${locale === 'th' ? 'bg-muted/60' : ''}`}
                >
                  ภาษาไทย
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ThemeIcon className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border-border/50">
                <DropdownMenuLabel className="text-foreground">{t.common.theme}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className={`text-foreground hover:bg-muted/80 ${theme === 'light' ? 'bg-muted/60' : ''}`}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  {t.common.light}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className={`text-foreground hover:bg-muted/80 ${theme === 'dark' ? 'bg-muted/60' : ''}`}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  {t.common.dark}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className={`text-foreground hover:bg-muted/80 ${theme === 'system' ? 'bg-muted/60' : ''}`}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  {t.common.system}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border-border/50">
                  <DropdownMenuLabel className="text-foreground">
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={() => router.push('/settings')} className="text-foreground hover:bg-muted/80">
                    <Settings className="h-4 w-4 mr-2" />
                    {t.common.settings}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-foreground hover:bg-muted/80">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t.common.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    {t.common.signIn}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    {t.common.signUp}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted/80 text-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/40">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              if (item.protected && !user) return null
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={true}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted/80'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            <div className="pt-4 border-t border-border/40 space-y-2">
              {/* Mobile Language Selector */}
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-foreground">{t.common.language}</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={locale === 'en' ? 'default' : 'ghost'}
                    onClick={() => setLocale('en')}
                  >
                    EN
                  </Button>
                  <Button
                    size="sm"
                    variant={locale === 'th' ? 'default' : 'ghost'}
                    onClick={() => setLocale('th')}
                  >
                    ไทย
                  </Button>
                </div>
              </div>

              {/* Mobile Theme Selector */}
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-foreground">{t.common.theme}</span>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant={theme === 'light' ? 'default' : 'ghost'}
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={theme === 'dark' ? 'default' : 'ghost'}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={theme === 'system' ? 'default' : 'ghost'}
                    onClick={() => setTheme('system')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Auth */}
              {user ? (
                <div className="space-y-2 pt-2">
                  <div className="px-3 py-2 text-sm">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t.common.logout}
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2 pt-2">
                  <Link href="/auth/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      {t.common.signIn}
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="flex-1">
                    <Button size="sm" className="w-full">
                      {t.common.signUp}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default memo(Navbar)