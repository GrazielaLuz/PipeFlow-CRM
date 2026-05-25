import { TopBar } from '@/components/shared/top-bar'
import { KanbanBoard } from '@/components/kanban/board'
import { NewDealDialog } from '@/components/kanban/new-deal-dialog'
import { getMockDealsByStage } from '@/lib/mock-data'
import { Deal, DealStage } from '@/types'

async function getDealsByStage(): Promise<Record<DealStage, Deal[]>> {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isSupabaseConfigured) {
    return getMockDealsByStage()
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return getMockDealsByStage()

    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: true })
      .limit(1)
      .single()

    if (!member) return getMockDealsByStage()

    const { data: deals } = await supabase
      .from('deals')
      .select(`
        *,
        lead:leads(id, name, company),
        assignee:assignee_id(id, email, full_name, avatar_url)
      `)
      .eq('workspace_id', member.workspace_id)
      .order('created_at', { ascending: true })

    const grouped: Record<DealStage, Deal[]> = {
      prospecting: [],
      qualification: [],
      proposal: [],
      negotiation: [],
      closed_won: [],
      closed_lost: [],
    }

    for (const deal of deals ?? []) {
      if (deal.stage in grouped) {
        grouped[deal.stage as DealStage].push(deal as Deal)
      }
    }

    return grouped
  } catch {
    return getMockDealsByStage()
  }
}

export default async function PipelinePage() {
  const dealsByStage = await getDealsByStage()

  const totalDeals = Object.values(dealsByStage).reduce(
    (sum, arr) => sum + arr.length,
    0,
  )
  const totalValue = Object.values(dealsByStage).reduce(
    (sum, arr) => sum + arr.reduce((s, d) => s + d.value, 0),
    0,
  )

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalValue)

  return (
    <>
      <TopBar
        title="Pipeline"
        subtitle={`${totalDeals} negócios · ${formattedTotal} em pipeline`}
        actions={<NewDealDialog />}
      />
      <div className="flex-1 overflow-auto p-6">
        <KanbanBoard initialDeals={dealsByStage} />
      </div>
    </>
  )
}
