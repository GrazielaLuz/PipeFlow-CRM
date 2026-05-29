'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
})

export async function createWorkspaceAction(input: { name: string; slug: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const parsed = createWorkspaceSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { data: workspace, error } = await supabase
    .from('workspaces')
    .insert({ name: parsed.data.name, slug: parsed.data.slug })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Esse slug já está em uso. Escolha outro.' }
    return { error: 'Erro ao criar workspace. Tente novamente.' }
  }

  const { error: memberError } = await supabase.from('workspace_members').insert({
    workspace_id: workspace.id,
    user_id: user.id,
    role: 'admin',
  })

  if (memberError) return { error: 'Erro ao configurar permissões do workspace.' }

  const cookieStore = await cookies()
  cookieStore.set('pipeflow-workspace-id', workspace.id, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  return { workspace }
}
