import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isPublicPage = request.nextUrl.pathname === '/' || 
                       request.nextUrl.pathname.startsWith('/api/public')
  
  // In a real app, you'd check for a session token
  // For now, we'll just check if there's a current_user in cookies
  const hasAuth = request.cookies.has('malaria_auth')
  
  // Redirect to login if accessing protected routes without auth
  if (!isAuthPage && !isPublicPage && !hasAuth) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // Redirect to dashboard if accessing auth pages while logged in
  if (isAuthPage && hasAuth && !request.nextUrl.pathname.includes('logout')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/public).*)',
  ],
}