'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const LeadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'lost', 'won']).default('new'),
  assignee_id: z.string().uuid().optional().nullable(),
})

export type LeadFormState = {
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

export async function createLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    company: formData.get('company') || undefined,
    role: formData.get('role') || undefined,
    status: formData.get('status') || 'new',
    assignee_id: formData.get('assignee_id') || null,
  }

  const parsed = LeadSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  if (!isSupabaseConfigured()) {
    return { error: 'Supabase não configurado. Configure as variáveis de ambiente.' }
  }

  const workspaceId = await getWorkspaceId()
  if (!workspaceId) {
    return { error: 'Workspace não encontrado. Faça login novamente.' }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  // Cheque de limite Free (50 leads)
  const { count } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('plan')
    .eq('id', workspaceId)
    .single()

  if (workspace?.plan === 'free' && (count ?? 0) >= 50) {
    return { error: 'Limite de 50 leads atingido no plano Free. Faça upgrade para Pro.' }
  }

  const { error } = await supabase.from('leads').insert({
    ...parsed.data,
    workspace_id: workspaceId,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/leads')
  return { success: true }
}

export async function updateLead(
  id: string,
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    company: formData.get('company') || undefined,
    role: formData.get('role') || undefined,
    status: formData.get('status') || 'new',
    assignee_id: formData.get('assignee_id') || null,
  }

  const parsed = LeadSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  if (!isSupabaseConfigured()) {
    return { error: 'Supabase não configurado.' }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { error } = await supabase
    .from('leads')
    .update(parsed.data)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/leads')
  revalidatePath(`/leads/${id}`)
  return { success: true }
}

export async function deleteLead(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  await supabase.from('leads').delete().eq('id', id)

  revalidatePath('/leads')
  redirect('/leads')
}
