import { TopBar } from '@/components/shared/top-bar'
import { MetricCard } from '@/components/dashboard/metric-card'
import { FunnelChart, type FunnelDataPoint } from '@/components/dashboard/funnel-chart'
import { DeadlineList } from '@/components/dashboard/deadline-list'
import { Users, TrendingUp, DollarSign, Percent } from 'lucide-react'
import { getMockDashboardMetrics, getMockFunnelData, getMockDeadlines } from '@/lib/mock-data'
import { Deal, DealStage } from '@/types'

interface DashboardMetrics {
  totalLeads: number
  openDeals: number
  pipelineValue: number
  conversionRate: number
}

interface DashboardData {
  metrics: DashboardMetrics
  funnelData: FunnelDataPoint[]
  deadlines: Deal[]
}

async function getDashboardData(): Promise<DashboardData> {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isSupabaseConfigured) {
    return {
      metrics: getMockDashboardMetrics(),
      funnelData: getMockFunnelData(),
      deadlines: getMockDeadlines(),
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return {
        metrics: getMockDashboardMetrics(),
        funnelData: getMockFunnelData(),
        deadlines: getMockDeadlines(),
      }
    }

    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: true })
      .limit(1)
      .single()

    if (!member) {
      return {
        metrics: getMockDashboardMetrics(),
        funnelData: getMockFunnelData(),
        deadlines: getMockDeadlines(),
      }
    }

    const workspaceId = member.workspace_id

    const [{ count: totalLeads }, { data: deals }, { data: deadlineDeals }] =
      await Promise.all([
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspaceId),
        supabase
          .from('deals')
          .select('*, lead:leads(id,name,company)')
          .eq('workspace_id', workspaceId),
        supabase
          .from('deals')
          .select('*, lead:leads(id,name,company)')
          .eq('workspace_id', workspaceId)
          .not('deadline', 'is', null)
          .order('deadline', { ascending: true })
          .limit(8),
      ])

    const allDeals = (deals ?? []) as Deal[]
    const openDeals = allDeals.filter(
      (d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost',
    )
    const closedWon = allDeals.filter((d) => d.stage === 'closed_won').length
    const closedLost = allDeals.filter((d) => d.stage === 'closed_lost').length
    const closedTotal = closedWon + closedLost

    const stageOrder: DealStage[] = [
      'prospecting',
      'qualification',
      'proposal',
      'negotiation',
      'closed_won',
      'closed_lost',
    ]
    const stageLabels: Record<DealStage, string> = {
      prospecting: 'Prospecção',
      qualification: 'Qualificação',
      proposal: 'Proposta',
      negotiation: 'Negociação',
      closed_won: 'Ganho',
      closed_lost: 'Perdido',
    }
    const funnelData: FunnelDataPoint[] = stageOrder.map((stage) => {
      const stageDeals = allDeals.filter((d) => d.stage === stage)
      return {
        stage,
        label: stageLabels[stage],
        count: stageDeals.length,
        value: stageDeals.reduce((sum, d) => sum + (d.value ?? 0), 0),
      }
    })

    return {
      metrics: {
        totalLeads: totalLeads ?? 0,
        openDeals: openDeals.length,
        pipelineValue: openDeals.reduce((sum, d) => sum + (d.value ?? 0), 0),
        conversionRate: closedTotal > 0 ? (closedWon / closedTotal) * 100 : 0,
      },
      funnelData,
      deadlines: (deadlineDeals ?? []) as Deal[],
    }
  } catch {
    return {
      metrics: getMockDashboardMetrics(),
      funnelData: getMockFunnelData(),
      deadlines: getMockDeadlines(),
    }
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function DashboardPage() {
  const { metrics, funnelData, deadlines } = await getDashboardData()

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total de Leads"
            value={String(metrics.totalLeads)}
            subtitle="cadastros no workspace"
            icon={Users}
          />
          <MetricCard
            label="Negócios Abertos"
            value={String(metrics.openDeals)}
            subtitle="em andamento"
            icon={TrendingUp}
          />
          <MetricCard
            label="Valor do Pipeline"
            value={formatCurrency(metrics.pipelineValue)}
            subtitle="oportunidades abertas"
            icon={DollarSign}
          />
          <MetricCard
            label="Taxa de Conversão"
            value={`${metrics.conversionRate.toFixed(0)}%`}
            subtitle="ganhos / (ganhos + perdidos)"
            icon={Percent}
          />
        </div>

        {/* Chart */}
        <FunnelChart data={funnelData} />

        {/* Deadline table */}
        <DeadlineList deadlines={deadlines} />
      </div>
    </>
  )
}
