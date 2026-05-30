import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AcceptInviteCard } from '@/components/invite/accept-invite-card'

interface Props {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?invite=${token}`)
  }

  const admin = createAdminClient()
  const { data: invite } = await admin
    .from('invites')
    .select('id, email, role, accepted_at, expires_at, workspace_id, workspaces(name)')
    .eq('token', token)
    .single()

  if (!invite) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md w-full rounded-lg border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-destructive">Convite inválido</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Este link de convite não existe ou já foi removido.
          </p>
        </div>
      </div>
    )
  }

  if (invite.accepted_at) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md w-full rounded-lg border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Convite já aceito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Este convite já foi utilizado anteriormente.
          </p>
        </div>
      </div>
    )
  }

  if (new Date(invite.expires_at) < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md w-full rounded-lg border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-destructive">Convite expirado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Este link expirou. Peça ao administrador para enviar um novo convite.
          </p>
        </div>
      </div>
    )
  }

  const workspace = Array.isArray(invite.workspaces)
    ? invite.workspaces[0]
    : invite.workspaces

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AcceptInviteCard
        token={token}
        email={invite.email}
        role={invite.role as 'admin' | 'member'}
        workspaceName={(workspace as { name: string } | null)?.name ?? 'Workspace'}
        userEmail={user.email ?? ''}
      />
    </div>
  )
}
