import { notFound } from 'next/navigation'
import { TopBar } from '@/components/shared/top-bar'
import { LeadProfile } from '@/components/leads/lead-profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft, Clock, Kanban } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Lead } from '@/types'

const MOCK_LEADS: Record<string, Lead> = {
  '1': {
    id: '1',
    workspace_id: 'ws1',
    name: 'Ana Oliveira',
    email: 'ana@acme.com',
    company: 'Acme Corp',
    role: 'Diretora Comercial',
    phone: '+55 11 91234-5678',
    status: 'qualified',
    assignee_id: undefined,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  '2': {
    id: '2',
    workspace_id: 'ws1',
    name: 'Bruno Santos',
    email: 'bruno@techco.io',
    company: 'TechCo',
    role: 'CEO',
    phone: '+55 21 99876-5432',
    status: 'contacted',
    assignee_id: undefined,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  '3': {
    id: '3',
    workspace_id: 'ws1',
    name: 'Carla Mendes',
    email: 'carla@fintech.com.br',
    company: 'FinTech SA',
    role: 'CFO',
    status: 'new',
    assignee_id: undefined,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
}

async function fetchLead(id: string): Promise<Lead | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return MOCK_LEADS[id] ?? null
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data } = await supabase
    .from('leads')
    .select('*, assignee:assignee_id(id, email, full_name, avatar_url)')
    .eq('id', id)
    .single()

  return (data as Lead) ?? null
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = await fetchLead(id)

  if (!lead) notFound()

  return (
    <>
      <TopBar
        title={lead.name}
        actions={
          <Link
            href="/leads"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Voltar
          </Link>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <LeadProfile lead={lead} />

          {/* Negócios vinculados — implementado no M06 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Kanban className="h-4 w-4" />
                Negócios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Os negócios vinculados a este lead aparecerão aqui após implementar o Pipeline (M06).
              </p>
            </CardContent>
          </Card>

          {/* Timeline de atividades — implementada no M07 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Atividades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                O histórico de atividades deste lead aparecerá aqui após implementar as Atividades (M07).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
