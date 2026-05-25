import { DealStage } from '@/types'

export type StageConfig = {
  label: string
  color: string
  bg: string
  border: string
  textColor: string
}

export const STAGE_CONFIG: Record<DealStage, StageConfig> = {
  prospecting: {
    label: 'Novo Lead',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.3)',
    textColor: '#3B82F6',
  },
  qualification: {
    label: 'Contato',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.3)',
    textColor: '#06B6D4',
  },
  proposal: {
    label: 'Proposta',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
    textColor: '#F59E0B',
  },
  negotiation: {
    label: 'Negociação',
    color: '#F97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.3)',
    textColor: '#F97316',
  },
  closed_won: {
    label: 'Fechado Ganho',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.3)',
    textColor: '#22C55E',
  },
  closed_lost: {
    label: 'Fechado Perdido',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.3)',
    textColor: '#EF4444',
  },
}

export const STAGE_ORDER: DealStage[] = [
  'prospecting',
  'qualification',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost',
]

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function getDeadlineBadge(deadline?: string): {
  label: string
  className: string
} | null {
  if (!deadline) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(deadline + 'T00:00:00')
  const diffDays = Math.round((d.getTime() - today.getTime()) / 86_400_000)

  if (diffDays < 0) return { label: 'Vencido', className: 'text-red-600 bg-red-50 border-red-200' }
  if (diffDays === 0) return { label: 'Hoje', className: 'text-amber-600 bg-amber-50 border-amber-200' }
  if (diffDays <= 3) return { label: `${diffDays}d`, className: 'text-orange-600 bg-orange-50 border-orange-200' }
  if (diffDays <= 7) return { label: `${diffDays}d`, className: 'text-blue-600 bg-blue-50 border-blue-200' }
  return { label: `${diffDays}d`, className: 'text-muted-foreground bg-muted border-border' }
}
