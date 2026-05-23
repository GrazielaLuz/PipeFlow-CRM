'use client'

// TODO M04: implement with real workspace context from cookie + Supabase
import { useState } from 'react'
import type { Workspace } from '@/types'

const mockWorkspace: Workspace = {
  id: '1',
  name: 'Acme Corp',
  slug: 'acme-corp',
  plan: 'free',
  created_at: new Date().toISOString(),
}

export function useWorkspace() {
  const [workspace] = useState<Workspace>(mockWorkspace)
  return { workspace }
}
