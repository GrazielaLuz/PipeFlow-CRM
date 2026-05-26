'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ActivityType } from '@/types'

const ActivitySchema = z.object({
  lead_id: z.string().uuid('Lead inválido'),
  type: z.enum(['call', 'email', 'meeting', 'note'] as const),
  description: z.string().min(1, 'Descrição é obrigatória'),
  date: z.string().min(1, 'Data é obrigatória'),
})

export type ActivityFormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
}

function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function createActivity(
  _prev: ActivityFormState,
  formData: FormData,
): Promise<ActivityFormState> {
  const raw = {
    lead_id:     formData.get('lead_id'),
    type:        formData.get('type'),
    description: formData.get('description'),
    date:        formData.get('date'),
  }

  const parsed = ActivitySchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  if (!isSupabaseConfigured()) {
    // Mock mode — sem persistência real
    revalidatePath(`/leads/${parsed.data.lead_id}`)
    revalidatePath('/activities')
    return { success: true }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado.' }

  // Descobre workspace_id via lead (respeitando RLS)
  const { data: lead } = await supabase
    .from('leads')
    .select('workspace_id')
    .eq('id', parsed.data.lead_id)
    .single()

  if (!lead) return { error: 'Lead não encontrado.' }

  const { error } = await supabase.from('activities').insert({
    workspace_id: lead.workspace_id,
    lead_id:      parsed.data.lead_id,
    type:         parsed.data.type as ActivityType,
    description:  parsed.data.description,
    date:         parsed.data.date,
    author_id:    user.id,
  })

  if (error) return { error: 'Erro ao registrar atividade. Tente novamente.' }

  revalidatePath(`/leads/${parsed.data.lead_id}`)
  revalidatePath('/activities')
  return { success: true }
}
