import { TopBar } from '@/components/shared/top-bar'
import { ActivityFeed } from '@/components/activities/activity-feed'
import { getAllMockActivities, MOCK_LEADS } from '@/lib/mock-data'
import { Activity, Lead } from '@/types'

type ActivityWithLead = Activity & {
  lead?: Pick<Lead, 'id' | 'name' | 'company'> | null
}

async function fetchActivitiesWithLeads(): Promise<{
  activities: ActivityWithLead[]
  leads: Pick<Lead, 'id' | 'name'>[]
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const activities = getAllMockActivities().map((a) => {
      const lead = MOCK_LEADS.find((l) => l.id === a.lead_id)
      return { ...a, lead: lead ? { id: lead.id, name: lead.name, company: lead.company } : null }
    })
    const leads = MOCK_LEADS.map((l) => ({ id: l.id, name: l.name }))
    return { activities, leads }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const [{ data: activitiesData }, { data: leadsData }] = await Promise.all([
    supabase
      .from('activities')
      .select('*, author:author_id(id, email, full_name, avatar_url), lead:lead_id(id, name, company)')
      .order('date', { ascending: false }),
    supabase.from('leads').select('id, name').order('name'),
  ])

  return {
    activities: (activitiesData ?? []) as ActivityWithLead[],
    leads: (leadsData ?? []) as Pick<Lead, 'id' | 'name'>[],
  }
}

export default async function ActivitiesPage() {
  const { activities, leads } = await fetchActivitiesWithLeads()

  return (
    <>
      <TopBar title="Atividades" />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Feed de Atividades</h2>
            <p className="text-sm text-muted-foreground">
              Todas as atividades do workspace, ordenadas por data.
            </p>
          </div>
          <ActivityFeed activities={activities} leads={leads} />
        </div>
      </div>
    </>
  )
}
