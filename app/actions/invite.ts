'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function acceptInviteAction(token: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?invite=${token}`)

  const admin = createAdminClient()

  const { data: invite, error } = await admin
    .from('invites')
    .select('*, workspaces(name)')
    .eq('token', token)
    .single()

  if (error || !invite) {
    return { error: 'Convite inválido ou não encontrado.' }
  }

  if (invite.accepted_at) {
    return { error: 'Este convite já foi aceito.' }
  }

  if (new Date(invite.expires_at) < new Date()) {
    return { error: 'Este convite expirou.' }
  }

  if (invite.email.toLowerCase() !== user.email?.toLowerCase()) {
    return { error: 'Este convite foi enviado para outro e-mail.' }
  }

  // Verificar se já é membro
  const { data: existing } = await admin
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', invite.workspace_id)
    .eq('user_id', user.id)
    .single()

  if (!existing) {
    const { error: memberError } = await admin.from('workspace_members').insert({
      workspace_id: invite.workspace_id,
      user_id: user.id,
      role: invite.role,
    })

    if (memberError) {
      return { error: 'Erro ao adicionar membro ao workspace.' }
    }
  }

  // Marcar convite como aceito
  await admin
    .from('invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  // Setar cookie do workspace ativo
  const cookieStore = await cookies()
  cookieStore.set('pipeflow-workspace-id', invite.workspace_id, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  redirect('/dashboard')
}
