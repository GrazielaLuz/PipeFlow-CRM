import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TopBar } from '@/components/shared/top-bar'
import { LeadProfile } from '@/components/leads/lead-profile'
import { ActivityTimeline } from '@/components/leads/activity-timeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft, Clock, Kanban } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getMockLead, getMockActivities } from '@/lib/mock-data'
import { Lead, Activity } from '@/types'

async function fetchLead(id: string): Promise<Lead | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return getMockLead(id) ?? null
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

async function fetchActivities(leadId: string): Promise<Activity[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return getMockActivities(leadId)
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data } = await supabase
    .from('activities')
    .select('*, author:author_id(id, email, full_name, avatar_url)')
    .eq('lead_id', leadId)
    .order('date', { ascending: false })

  return (data as Activity[]) ?? []
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [lead, activities] = await Promise.all([fetchLead(id), fetchActivities(id)])

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
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Kanban className="h-4 w-4 text-muted-foreground" />
                Negócios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Os negócios vinculados a este lead aparecerão aqui após implementar o Pipeline (M06).
              </p>
            </CardContent>
          </Card>

          {/* Timeline de atividades */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Histórico de Atividades
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ActivityTimeline activities={activities} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
