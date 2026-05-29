import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/shared/sidebar'
import { WorkspaceSwitcher } from '@/components/shared/workspace-switcher'
import { UserMenu } from '@/components/shared/user-menu'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const cookieStore = await cookies()
  const workspaceId = cookieStore.get('pipeflow-workspace-id')?.value

  if (!workspaceId) redirect('/onboarding')

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, name, slug, plan')
    .eq('id', workspaceId)
    .single()

  if (!workspace) redirect('/onboarding')

  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id, name, slug, plan')
    .order('name')

  const userName = (user.user_metadata?.full_name as string | undefined) ?? user.email?.split('@')[0] ?? 'Usuário'
  const userEmail = user.email ?? ''
  const avatarUrl = (user.user_metadata?.avatar_url as string | undefined) ?? ''

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex h-full w-60 shrink-0 flex-col border-r bg-sidebar">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">PipeFlow</span>
        </div>

        <div className="border-b p-3">
          <WorkspaceSwitcher
            activeWorkspace={workspace}
            workspaces={workspaces ?? []}
          />
        </div>

        <Sidebar />

        <div className="border-t p-3">
          <UserMenu name={userName} email={userEmail} avatarUrl={avatarUrl} />
        </div>
      </div>

      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
