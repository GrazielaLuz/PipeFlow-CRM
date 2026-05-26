import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CalendarCheck, Clock } from 'lucide-react'
import { Deal } from '@/types'
import { STAGE_CONFIG, getDeadlineBadge } from '@/components/kanban/stage-config'

function formatDate(deadline: string): string {
  const date = new Date(deadline + 'T00:00:00')
  const day = date.getDate()
  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  return `${day} ${month}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

interface DeadlineListProps {
  deadlines: Deal[]
}

export function DeadlineList({ deadlines }: DeadlineListProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Negócios com Prazo Próximo</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {deadlines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <CalendarCheck className="mb-2 h-8 w-8 opacity-40" />
            <p className="text-sm">Nenhum prazo próximo</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Negócio</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deadlines.map((deal) => {
                return (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell>
                      <p className="text-sm">{deal.lead?.name ?? '—'}</p>
                      {deal.lead?.company && (
                        <p className="text-xs text-muted-foreground">{deal.lead.company}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const cfg = STAGE_CONFIG[deal.stage]
                        return (
                          <Badge
                            variant="outline"
                            style={{ color: cfg.textColor, borderColor: cfg.border, backgroundColor: cfg.bg }}
                          >
                            {cfg.label}
                          </Badge>
                        )
                      })()}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const urgency = getDeadlineBadge(deal.deadline)
                        return (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDate(deal.deadline!)}
                            </span>
                            {urgency && (
                              <Badge variant="outline" className={urgency.className}>
                                {urgency.label}
                              </Badge>
                            )}
                          </div>
                        )
                      })()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(deal.value)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
