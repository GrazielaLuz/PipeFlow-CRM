import { Activity, ActivityType } from '@/types'
import { Phone, Mail, Users, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const typeConfig: Record<
  ActivityType,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  call:    { label: 'Ligação',  icon: Phone,    color: 'text-blue-600',   bg: 'bg-blue-100 dark:bg-blue-900/30' },
  email:   { label: 'E-mail',   icon: Mail,     color: 'text-violet-600', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  meeting: { label: 'Reunião',  icon: Users,    color: 'text-amber-600',  bg: 'bg-amber-100 dark:bg-amber-900/30' },
  note:    { label: 'Nota',     icon: FileText, color: 'text-slate-600',  bg: 'bg-slate-100 dark:bg-slate-800' },
}

function formatRelativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 7) return `${days} dias atrás`
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(iso))
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        Nenhuma atividade registrada ainda.
      </p>
    )
  }

  return (
    <ol className="relative space-y-0">
      {activities.map((activity, index) => {
        const cfg = typeConfig[activity.type]
        const Icon = cfg.icon
        const isLast = index === activities.length - 1

        return (
          <li key={activity.id} className="flex gap-4">
            {/* Linha vertical + ícone */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  cfg.bg,
                )}
              >
                <Icon className={cn('h-4 w-4', cfg.color)} />
              </div>
              {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
            </div>

            {/* Conteúdo */}
            <div className={cn('min-w-0 pb-6', isLast && 'pb-0')}>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className={cn('text-xs font-semibold uppercase tracking-wide', cfg.color)}>
                  {cfg.label}
                </span>
                {activity.author?.full_name && (
                  <span className="text-xs text-muted-foreground">
                    por {activity.author.full_name}
                  </span>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatRelativeDate(activity.date)}
                </span>
              </div>
              <p className="mt-1 text-sm text-foreground/80 leading-relaxed">
                {activity.description}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
