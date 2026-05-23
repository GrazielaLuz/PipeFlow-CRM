import { Zap } from 'lucide-react'
import { Sidebar } from '@/components/shared/sidebar'
import { WorkspaceSwitcher } from '@/components/shared/workspace-switcher'
import { UserMenu } from '@/components/shared/user-menu'

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
          <WorkspaceSwitcher />
        </div>

        <Sidebar />

        <div className="border-t p-3">
          <UserMenu />
        </div>
      </div>

      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
