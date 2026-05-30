import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const workspaceId = searchParams.get('id')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!workspaceId) {
    return NextResponse.redirect(`${origin}/onboarding`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/login`)
  }

  // Confirma que o usuário realmente é membro desse workspace
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return NextResponse.redirect(`${origin}/onboarding`)
  }

  const response = NextResponse.redirect(`${origin}${next}`)
  response.cookies.set('pipeflow-workspace-id', workspaceId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    sameSite: 'lax',
  })
  return response
}
