import { Badge } from '@/components/ui/badge'
import { LeadStatus } from '@/types'

const statusConfig: Record<LeadStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  new:        { label: 'Novo',       variant: 'secondary' },
  contacted:  { label: 'Contatado',  variant: 'default' },
  qualified:  { label: 'Qualificado', variant: 'default' },
  lost:       { label: 'Perdido',    variant: 'destructive' },
  won:        { label: 'Ganho',      variant: 'outline' },
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const { label, variant } = statusConfig[status] ?? statusConfig.new
  return <Badge variant={variant}>{label}</Badge>
}
