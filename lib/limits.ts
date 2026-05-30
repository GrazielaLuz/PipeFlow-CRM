import { createClient } from '@/lib/supabase/server'
import { FREE_LIMITS } from '@/lib/stripe/plans'

interface LimitResult {
  allowed: boolean
  reason?: string
}

export async function canAddLead(workspaceId: string): Promise<LimitResult> {
  const supabase = await createClient()

  const [{ data: workspace }, { count }] = await Promise.all([
    supabase.from('workspaces').select('plan').eq('id', workspaceId).single(),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),
  ])

  if (workspace?.plan !== 'free') return { allowed: true }

  if ((count ?? 0) >= FREE_LIMITS.leads) {
    return {
      allowed: false,
      reason: `Limite de ${FREE_LIMITS.leads} leads atingido no plano Free. Faça upgrade para Pro.`,
    }
  }

  return { allowed: true }
}

export async function canAddMember(workspaceId: string): Promise<LimitResult> {
  const supabase = await createClient()

  const [{ data: workspace }, { count }] = await Promise.all([
    supabase.from('workspaces').select('plan').eq('id', workspaceId).single(),
    supabase
      .from('workspace_members')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),
  ])

  if (workspace?.plan !== 'free') return { allowed: true }

  if ((count ?? 0) >= FREE_LIMITS.members) {
    return {
      allowed: false,
      reason: `Limite de ${FREE_LIMITS.members} membros atingido no plano Free. Faça upgrade para Pro.`,
    }
  }

  return { allowed: true }
}
