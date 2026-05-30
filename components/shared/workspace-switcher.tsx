'use client'

import { useRouter } from 'next/navigation'
import { ChevronsUpDown, Building2, Plus, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Plan } from '@/types'

interface WorkspaceOption {
  id: string
  name: string
  slug: string
  plan: Plan
}

interface WorkspaceSwitcherProps {
  activeWorkspace: WorkspaceOption
  workspaces: WorkspaceOption[]
}

export function WorkspaceSwitcher({ activeWorkspace, workspaces }: WorkspaceSwitcherProps) {
  const router = useRouter()

  function switchWorkspace(id: string) {
    document.cookie = `pipeflow-workspace-id=${id}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-lg px-3',
          'text-sm font-medium transition-colors',
          'hover:bg-sidebar-accent focus-visible:outline-none',
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
            <Building2 className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">{activeWorkspace.name}</span>
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Workspaces
          </DropdownMenuLabel>
          {workspaces.map((ws) => (
            <DropdownMenuItem
              key={ws.id}
              className="gap-2"
              onClick={() => switchWorkspace(ws.id)}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <span className="flex-1 truncate">{ws.name}</span>
              {ws.id === activeWorkspace.id && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="gap-2 text-muted-foreground"
            onClick={() => router.push('/onboarding')}
          >
            <Plus className="h-4 w-4" />
            Criar workspace
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
