'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Workspace } from '@/types'

function getWorkspaceIdFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)pipeflow-workspace-id=([^;]+)/)
  return match ? match[1] : null
}

export function useWorkspace() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const workspaceId = getWorkspaceIdFromCookie()
    if (!workspaceId) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    supabase
      .from('workspaces')
      .select('id, name, slug, plan, created_at')
      .eq('id', workspaceId)
      .single()
      .then(({ data }) => {
        setWorkspace(data as Workspace | null)
        setIsLoading(false)
      })
  }, [])

  return { workspace, isLoading }
}
