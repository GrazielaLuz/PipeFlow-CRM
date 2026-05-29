import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROTECTED_PREFIX = ['/dashboard', '/leads', '/pipeline', '/activities', '/settings']

function isProtected(pathname: string) {
  return PROTECTED_PREFIX.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function isAuthPage(pathname: string) {
  return pathname === '/login' || pathname === '/signup'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Invite pages always accessible
  if (pathname.startsWith('/invite/')) return NextResponse.next()

  const { supabaseResponse, user } = await updateSession(request)

  // Protected routes: must be authenticated
  if (isProtected(pathname)) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    // Authenticated but no active workspace → onboarding
    const workspaceId = request.cookies.get('pipeflow-workspace-id')?.value
    if (!workspaceId) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  // Login/signup: authenticated users get redirected
  if (isAuthPage(pathname) && user) {
    const workspaceId = request.cookies.get('pipeflow-workspace-id')?.value
    const url = request.nextUrl.clone()
    url.pathname = workspaceId ? '/dashboard' : '/onboarding'
    return NextResponse.redirect(url)
  }

  // Onboarding: must be authenticated
  if (pathname === '/onboarding' && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
