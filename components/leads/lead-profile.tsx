import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Building2, Mail, Phone, User, Briefcase } from 'lucide-react'
import { Lead } from '@/types'
import { LeadStatusBadge } from './lead-status-badge'
import { EditLeadDialog } from './edit-lead-dialog'
import { DeleteLeadDialog } from './delete-lead-dialog'

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(
    new Date(iso),
  )
}

export function LeadProfile({ lead }: { lead: Lead }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg font-semibold">
              {initials(lead.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{lead.name}</CardTitle>
            {lead.role && lead.company && (
              <p className="text-sm text-muted-foreground">
                {lead.role} · {lead.company}
              </p>
            )}
            <div className="mt-1.5">
              <LeadStatusBadge status={lead.status} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <EditLeadDialog lead={lead} />
          <DeleteLeadDialog id={lead.id} name={lead.name} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">E-mail</p>
            <a
              href={`mailto:${lead.email}`}
              className="text-sm font-medium hover:underline"
            >
              {lead.email}
            </a>
          </div>
        </div>

        {lead.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Telefone</p>
              <a
                href={`tel:${lead.phone}`}
                className="text-sm font-medium hover:underline"
              >
                {lead.phone}
              </a>
            </div>
          </div>
        )}

        {lead.company && (
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Empresa</p>
              <p className="text-sm font-medium">{lead.company}</p>
            </div>
          </div>
        )}

        {lead.role && (
          <div className="flex items-center gap-3">
            <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Cargo</p>
              <p className="text-sm font-medium">{lead.role}</p>
            </div>
          </div>
        )}

        {lead.assignee && (
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Responsável</p>
              <p className="text-sm font-medium">
                {lead.assignee.full_name ?? lead.assignee.email}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="h-4 w-4 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Criado em</p>
            <p className="text-sm font-medium">{formatDate(lead.created_at)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
