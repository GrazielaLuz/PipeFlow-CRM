import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { MemberList } from '@/components/settings/member-list'
import { InviteMemberForm } from '@/components/settings/invite-member-form'
import { PendingInviteList } from '@/components/settings/pending-invite-list'
import { LimitBanner } from '@/components/shared/limit-banner'
import { FREE_LIMITS } from '@/lib/stripe/plans'
import type { MemberRow } from '@/components/settings/member-list'
import type { Invite } from '@/types'

export default async function WorkspaceSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const cookieStore = await cookies()
  const workspaceId = cookieStore.get('pipeflow-workspace-id')?.value

  if (!workspaceId) redirect('/onboarding')

  // Dados do workspace e membros em paralelo
  const [{ data: workspace }, { data: rawMembers }] = await Promise.all([
    supabase
      .from('workspaces')
      .select('id, name, plan')
      .eq('id', workspaceId)
      .single(),
    supabase
      .from('workspace_members')
      .select('user_id, role')
      .eq('workspace_id', workspaceId),
  ])

  if (!workspace || !rawMembers) redirect('/dashboard')

  // Papel do usuário atual
  const currentMembership = rawMembers.find((m) => m.user_id === user.id)
  const currentRole = (currentMembership?.role ?? 'member') as 'admin' | 'member'
  const isAdmin = currentRole === 'admin'

  // Buscar dados de usuários via admin client
  const admin = createAdminClient()
  const userIds = rawMembers.map((m) => m.user_id)

  const userDataMap: Record<string, { email: string; fullName?: string }> = {}
  await Promise.all(
    userIds.map(async (uid) => {
      const { data } = await admin.auth.admin.getUserById(uid)
      if (data?.user) {
        userDataMap[uid] = {
          email: data.user.email ?? uid,
          fullName: data.user.user_metadata?.full_name as string | undefined,
        }
      }
    })
  )

  const members: MemberRow[] = rawMembers.map((m) => ({
    userId: m.user_id,
    role: m.role as 'admin' | 'member',
    email: userDataMap[m.user_id]?.email ?? m.user_id,
    fullName: userDataMap[m.user_id]?.fullName,
  }))

  // Convites pendentes — apenas para admins (RLS bloqueia para membros)
  let pendingInvites: Invite[] = []
  if (isAdmin) {
    const { data: invites } = await admin
      .from('invites')
      .select('*')
      .eq('workspace_id', workspaceId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    pendingInvites = (invites ?? []) as Invite[]
  }

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {workspace.plan === 'free' && (
            <LimitBanner type="members" current={members.length} max={FREE_LIMITS.members} />
          )}
          <MemberList
            members={members}
            currentUserId={user.id}
            currentRole={currentRole}
            workspaceId={workspaceId}
          />

          {isAdmin && (
            <InviteMemberForm
              workspaceId={workspaceId}
              plan={workspace.plan as 'free' | 'pro'}
              memberCount={members.length}
            />
          )}

          {isAdmin && (
            <PendingInviteList invites={pendingInvites} isAdmin={isAdmin} />
          )}
        </div>
      </div>
    </>
  )
}
