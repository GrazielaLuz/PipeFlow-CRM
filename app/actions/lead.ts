'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const createLeadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  workspaceId: z.string().uuid(),
})

export async function createFirstLeadAction(input: {
  name: string
  email: string
  workspaceId: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const parsed = createLeadSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      workspace_id: parsed.data.workspaceId,
      name: parsed.data.name,
      email: parsed.data.email || `placeholder-${Date.now()}@noemail.com`,
      assignee_id: user.id,
    })
    .select()
    .single()

  if (error) return { error: 'Erro ao criar lead. Tente novamente.' }

  return { lead }
}
