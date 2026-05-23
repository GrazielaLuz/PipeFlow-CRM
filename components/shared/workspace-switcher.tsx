'use client'

import { ChevronsUpDown, Building2, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const mockWorkspaces = [
  { id: '1', name: 'Acme Corp', slug: 'acme-corp', plan: 'pro' as const },
  { id: '2', name: 'Startup XYZ', slug: 'startup-xyz', plan: 'free' as const },
]

export function WorkspaceSwitcher() {
  const active = mockWorkspaces[0]

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
          <span className="truncate">{active.name}</span>
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Workspaces
        </DropdownMenuLabel>
        {mockWorkspaces.map((ws) => (
          <DropdownMenuItem key={ws.id} className="gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <span className="truncate">{ws.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-muted-foreground">
          <Plus className="h-4 w-4" />
          Criar workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
