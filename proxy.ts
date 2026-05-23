import { NextResponse, type NextRequest } from 'next/server'

// TODO M03: replace with Supabase session refresh
// import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
