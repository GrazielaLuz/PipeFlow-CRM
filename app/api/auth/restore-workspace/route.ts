import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'))
  }

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .order('workspace_id')
    .limit(1)
    .single()

  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  if (!membership?.workspace_id) {
    return NextResponse.redirect(new URL('/onboarding', base))
  }

  const response = NextResponse.redirect(new URL('/dashboard', base))
  response.cookies.set('pipeflow-workspace-id', membership.workspace_id, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })
  return response
}
