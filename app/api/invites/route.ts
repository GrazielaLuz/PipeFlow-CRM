import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendInviteEmail } from '@/lib/resend/emails'
import { canAddMember } from '@/lib/limits'

const inviteSchema = z.object({
  email: z.string().email('E-mail inválido'),
  role: z.enum(['admin', 'member']).default('member'),
  workspaceId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = inviteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { email, role, workspaceId } = parsed.data

  // Verificar que o usuário atual é admin do workspace
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'admin') {
    return NextResponse.json({ error: 'Apenas administradores podem convidar membros' }, { status: 403 })
  }

  // Verificar limite Free plan
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name, plan')
    .eq('id', workspaceId)
    .single()

  if (!workspace) {
    return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 404 })
  }

  const limit = await canAddMember(workspaceId)
  if (!limit.allowed) {
    return NextResponse.json({ error: limit.reason }, { status: 403 })
  }

  // Verificar se já é membro
  const { data: existingMember } = await supabase
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', workspaceId)
    .limit(1)

  // Checar se já existe convite pendente para esse e-mail
  const admin = createAdminClient()
  const { data: existingInvite } = await admin
    .from('invites')
    .select('id')
    .eq('workspace_id', workspaceId)
    .eq('email', email)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (existingInvite) {
    return NextResponse.json(
      { error: 'Já existe um convite pendente para este e-mail' },
      { status: 409 }
    )
  }

  // Criar convite
  const { data: invite, error: inviteError } = await admin
    .from('invites')
    .insert({ workspace_id: workspaceId, email, role })
    .select()
    .single()

  if (inviteError || !invite) {
    return NextResponse.json({ error: 'Erro ao criar convite' }, { status: 500 })
  }

  // Enviar e-mail
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const inviteUrl = `${appUrl}/invite/${invite.token}`

  try {
    await sendInviteEmail({ to: email, workspaceName: workspace.name, inviteUrl, role })
  } catch {
    // E-mail falhou mas convite foi criado — não bloquear
  }

  return NextResponse.json({ id: invite.id, email: invite.email, expires_at: invite.expires_at })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const inviteId = searchParams.get('id')
  if (!inviteId) {
    return NextResponse.json({ error: 'ID do convite obrigatório' }, { status: 400 })
  }

  // RLS garante que apenas admin do workspace pode deletar
  const { error } = await supabase.from('invites').delete().eq('id', inviteId)

  if (error) {
    return NextResponse.json({ error: 'Erro ao cancelar convite' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
