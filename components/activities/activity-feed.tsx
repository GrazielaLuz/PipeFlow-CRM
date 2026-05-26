'use client'

import { useState, useMemo } from 'react'
import { Phone, Mail, Users, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Activity, ActivityType, Lead } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const typeConfig: Record<
  ActivityType,
  { label: string; icon: React.ElementType; color: string; bg: string; badgeClass: string }
> = {
  call:    { label: 'Ligação',  icon: Phone,    color: 'text-blue-600',   bg: 'bg-blue-100 dark:bg-blue-900/30',     badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  email:   { label: 'E-mail',   icon: Mail,     color: 'text-violet-600', bg: 'bg-violet-100 dark:bg-violet-900/30', badgeClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  meeting: { label: 'Reunião',  icon: Users,    color: 'text-amber-600',  bg: 'bg-amber-100 dark:bg-amber-900/30',   badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  note:    { label: 'Nota',     icon: FileText, color: 'text-slate-600',  bg: 'bg-slate-100 dark:bg-slate-800',      badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso))
}

interface ActivityFeedProps {
  activities: (Activity & { lead?: Pick<Lead, 'id' | 'name' | 'company'> | null })[]
  leads: Pick<Lead, 'id' | 'name'>[]
}

export function ActivityFeed({ activities, leads }: ActivityFeedProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [leadFilter, setLeadFilter] = useState<string>('all')

  const filtered = useMemo(
    () =>
      activities
        .filter((a) => typeFilter === 'all' || a.type === typeFilter)
        .filter((a) => leadFilter === 'all' || a.lead_id === leadFilter),
    [activities, typeFilter, leadFilter],
  )

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? 'all')}>
          <SelectTrigger className="w-44">
            <SelectValue>
              {typeFilter === 'all' ? 'Todos os tipos' : typeConfig[typeFilter as ActivityType]?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {Object.entries(typeConfig).map(([value, { label }]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={leadFilter} onValueChange={(v) => setLeadFilter(v ?? 'all')}>
          <SelectTrigger className="w-52">
            <SelectValue>
              {leadFilter === 'all'
                ? 'Todos os leads'
                : leads.find((l) => l.id === leadFilter)?.name ?? leadFilter}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os leads</SelectItem>
            {leads.map((lead) => (
              <SelectItem key={lead.id} value={lead.id}>{lead.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma atividade encontrada.</p>
        </div>
      ) : (
        <ol className="relative space-y-0">
          {filtered.map((activity, index) => {
            const cfg = typeConfig[activity.type]
            const Icon = cfg.icon
            const isLast = index === filtered.length - 1

            return (
              <li key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', cfg.bg)}>
                    <Icon className={cn('h-4 w-4', cfg.color)} />
                  </div>
                  {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
                </div>

                <div className={cn('min-w-0 pb-6', isLast && 'pb-0')}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={cn('border-0 text-xs font-semibold', cfg.badgeClass)}>
                      {cfg.label}
                    </Badge>
                    {activity.lead?.name && (
                      <span className="text-sm font-medium">{activity.lead.name}</span>
                    )}
                    {activity.lead?.company && (
                      <span className="text-xs text-muted-foreground">· {activity.lead.company}</span>
                    )}
                    {activity.author?.full_name && (
                      <span className="text-xs text-muted-foreground">por {activity.author.full_name}</span>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
