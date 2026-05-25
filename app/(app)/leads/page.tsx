import { Suspense } from 'react'
import { TopBar } from '@/components/shared/top-bar'
import { Skeleton } from '@/components/ui/skeleton'
import { LeadTable } from '@/components/leads/lead-table'
import { LeadFilters } from '@/components/leads/lead-filters'
import { LeadSearch } from '@/components/leads/lead-search'
import { LeadPagination } from '@/components/leads/lead-pagination'
import { NewLeadDialog } from '@/components/leads/new-lead-dialog'
import { Lead } from '@/types'

const PAGE_SIZE = 20

interface SearchParams {
  q?: string
  status?: string
  page?: string
}

async function fetchLeads(params: SearchParams): Promise<{ leads: Lead[]; total: number }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { leads: MOCK_LEADS, total: MOCK_LEADS.length }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { leads: [], total: 0 }

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .order('joined_at', { ascending: true })
    .limit(1)
    .single()

  if (!membership) return { leads: [], total: 0 }

  const page = Math.max(1, Number(params.page ?? 1))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('leads')
    .select('*, assignee:assignee_id(id, email, full_name, avatar_url)', { count: 'exact' })
    .eq('workspace_id', membership.workspace_id)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,email.ilike.%${params.q}%`)
  }
  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }

  const { data, count } = await query
  return { leads: (data as Lead[]) ?? [], total: count ?? 0 }
}

function LeadsTableSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}

async function LeadsContent({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, Number(searchParams.page ?? 1))
  const { leads, total } = await fetchLeads(searchParams)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-4">
      <LeadTable leads={leads} />
      <LeadPagination page={page} totalPages={totalPages} />
    </div>
  )
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <>
      <TopBar
        title="Leads"
        actions={<NewLeadDialog />}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Suspense>
              <LeadSearch />
            </Suspense>
            <Suspense>
              <LeadFilters />
            </Suspense>
          </div>
          <Suspense fallback={<LeadsTableSkeleton />}>
            <LeadsContent searchParams={params} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

// Mock para desenvolvimento sem Supabase
const MOCK_LEADS: Lead[] = [
  {
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
  {
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
  {
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
]
