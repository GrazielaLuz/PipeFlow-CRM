'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FREE_LIMITS } from '@/lib/stripe/plans'
import type { Plan } from '@/types'

function getWorkspaceIdFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)pipeflow-workspace-id=([^;]+)/)
  return match ? match[1] : null
}

interface SubscriptionState {
  plan: Plan
  leadCount: number
  memberCount: number
  isAtLeadLimit: boolean
  isAtMemberLimit: boolean
  isLoading: boolean
}

export function useSubscription(): SubscriptionState {
  const [plan, setPlan] = useState<Plan>('free')
  const [leadCount, setLeadCount] = useState(0)
  const [memberCount, setMemberCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const workspaceId = getWorkspaceIdFromCookie()
    if (!workspaceId) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    Promise.all([
      supabase.from('workspaces').select('plan').eq('id', workspaceId).single(),
      supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId),
      supabase
        .from('workspace_members')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId),
    ]).then(([{ data: ws }, { count: leads }, { count: members }]) => {
      if (ws) setPlan(ws.plan as Plan)
      setLeadCount(leads ?? 0)
      setMemberCount(members ?? 0)
      setIsLoading(false)
    })
  }, [])

  return {
    plan,
    leadCount,
    memberCount,
    isAtLeadLimit: plan === 'free' && leadCount >= FREE_LIMITS.leads,
    isAtMemberLimit: plan === 'free' && memberCount >= FREE_LIMITS.members,
    isLoading,
  }
}
