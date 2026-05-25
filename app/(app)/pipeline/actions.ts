'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Deal, DealStage } from '@/types'

const DEAL_STAGES: [DealStage, ...DealStage[]] = [
  'prospecting',
  'qualification',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost',
]

const DealSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  value: z.coerce.number().min(0, 'Valor deve ser positivo').default(0),
  stage: z.enum(DEAL_STAGES).default('prospecting'),
  lead_id: z.string().uuid().optional().nullable(),
  assignee_id: z.string().uuid().optional().nullable(),
  deadline: z.string().optional().nullable(),
})

export type DealFormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
  deal?: Deal
}

function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

async function getWorkspaceId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .order('joined_at', { ascending: true })
    .limit(1)
    .single()

  return data?.workspace_id ?? null
}

export async function createDeal(
  _prev: DealFormState,
  formData: FormData,
): Promise<DealFormState> {
  const raw = {
    title: formData.get('title'),
    value: formData.get('value') || 0,
    stage: formData.get('stage') || 'prospecting',
    lead_id: formData.get('lead_id') || null,
    assignee_id: formData.get('assignee_id') || null,
    deadline: formData.get('deadline') || null,
  }

  const parsed = DealSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  if (!isSupabaseConfigured()) {
    const deal: Deal = {
      id: `mock-${Date.now()}`,
      workspace_id: 'ws1',
      title: parsed.data.title,
      value: parsed.data.value,
      stage: parsed.data.stage,
      lead_id: parsed.data.lead_id ?? undefined,
      assignee_id: parsed.data.assignee_id ?? undefined,
      deadline: parsed.data.deadline ?? undefined,
      created_at: new Date().toISOString(),
    }
    return { success: true, deal }
  }

  const workspaceId = await getWorkspaceId()
  if (!workspaceId) {
    return { error: 'Workspace não encontrado. Faça login novamente.' }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deals')
    .insert({ ...parsed.data, workspace_id: workspaceId })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/pipeline')
  return { success: true, deal: data as Deal }
}

export async function updateDeal(
  id: string,
  _prev: DealFormState,
  formData: FormData,
): Promise<DealFormState> {
  const raw = {
    title: formData.get('title'),
    value: formData.get('value') || 0,
    stage: formData.get('stage') || 'prospecting',
    lead_id: formData.get('lead_id') || null,
    assignee_id: formData.get('assignee_id') || null,
    deadline: formData.get('deadline') || null,
  }

  const parsed = DealSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  if (!isSupabaseConfigured()) {
    const deal: Deal = {
      id,
      workspace_id: 'ws1',
      title: parsed.data.title,
      value: parsed.data.value,
      stage: parsed.data.stage,
      lead_id: parsed.data.lead_id ?? undefined,
      assignee_id: parsed.data.assignee_id ?? undefined,
      deadline: parsed.data.deadline ?? undefined,
      created_at: new Date().toISOString(),
    }
    return { success: true, deal }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deals')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/pipeline')
  return { success: true, deal: data as Deal }
}

export async function deleteDeal(id: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) return {}

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { error } = await supabase.from('deals').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/pipeline')
  return {}
}

export async function updateDealStage(
  dealId: string,
  newStage: DealStage,
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) return {}

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { error } = await supabase
    .from('deals')
    .update({ stage: newStage })
    .eq('id', dealId)

  if (error) return { error: error.message }

  revalidatePath('/pipeline')
  return {}
}
