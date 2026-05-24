'use client'

import { useEffect } from 'react'
import { Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface WorkspaceData {
  name: string
  slug: string
}

interface WorkspaceFormProps {
  data: WorkspaceData
  onChange: (data: WorkspaceData) => void
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function WorkspaceForm({ data, onChange }: WorkspaceFormProps) {
  useEffect(() => {
    if (data.name) {
      onChange({ ...data, slug: toSlug(data.name) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.name])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-7 w-7 text-primary" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="workspace-name">Nome da empresa</Label>
        <Input
          id="workspace-name"
          name="workspace-name"
          placeholder="Acme Ltda."
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          autoFocus
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="workspace-slug">
          Identificador (slug)
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">gerado automaticamente</span>
        </Label>
        <div className="flex items-center rounded-lg border bg-muted/50 px-3 py-2 text-sm">
          <span className="text-muted-foreground">pipeflow.app/</span>
          <span className="font-medium text-foreground">{data.slug || 'seu-workspace'}</span>
        </div>
      </div>
    </div>
  )
}
