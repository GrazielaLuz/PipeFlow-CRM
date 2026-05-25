import { Suspense } from 'react'
import { TopBar } from '@/components/shared/top-bar'
import { Skeleton } from '@/components/ui/skeleton'
import { LeadTable } from '@/components/leads/lead-table'
import { LeadFilters } from '@/components/leads/lead-filters'
import { LeadSearch } from '@/components/leads/lead-search'
import { LeadPagination } from '@/components/leads/lead-pagination'
import { NewLeadDialog } from '@/components/leads/new-lead-dialog'
import { filterMockLeads } from '@/lib/mock-data'
import { Lead } from '@/types'

const PAGE_SIZE = 20

interface SearchParams {
  q?: string
  status?: string
  page?: string
}

async function fetchLeads(params: SearchParams): Promise<{ leads: Lead[]; total: number }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return filterMockLeads({
      q: params.q,
      status: params.status,
      page: Number(params.page ?? 1),
      pageSize: PAGE_SIZE,
    })
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
    query = query.or(
      `name.ilike.%${params.q}%,email.ilike.%${params.q}%,company.ilike.%${params.q}%`,
    )
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
      {Array.from({ length: 8 }).map((_, i) => (
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
      <TopBar title="Leads" actions={<NewLeadDialog />} />
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
