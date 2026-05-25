import { Badge } from '@/components/ui/badge'
import { LeadStatus } from '@/types'

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new:       { label: 'Novo',        className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' },
  contacted: { label: 'Contatado',   className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' },
  qualified: { label: 'Qualificado', className: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400' },
  lost:      { label: 'Perdido',     className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400' },
  won:       { label: 'Ganho',       className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' },
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const { label, className } = statusConfig[status] ?? statusConfig.new
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
