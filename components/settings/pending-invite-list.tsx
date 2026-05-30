'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Invite, WorkspaceMemberRole } from '@/types'

interface Props {
  invites: Invite[]
  isAdmin: boolean
}

function formatExpiry(expiresAt: string) {
  const date = new Date(expiresAt)
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const formatted = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })

  if (diffDays <= 0) return { label: `Expira hoje (${formatted})`, urgent: true }
  if (diffDays === 1) return { label: `Expira amanhã (${formatted})`, urgent: false }
  return { label: `Expira em ${diffDays} dias (${formatted})`, urgent: false }
}

function CancelButton({ inviteId }: { inviteId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleCancel() {
    startTransition(async () => {
      const res = await fetch(`/api/invites?id=${inviteId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Erro ao cancelar')
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCancel}
        disabled={isPending}
        className="text-xs"
      >
        {isPending ? 'Cancelando...' : 'Cancelar'}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}

export function PendingInviteList({ invites, isAdmin }: Props) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b px-6 py-4">
        <h2 className="text-sm font-semibold">Convites pendentes</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {invites.length === 0
            ? 'Nenhum convite aguardando resposta'
            : `${invites.length} ${invites.length === 1 ? 'convite aguardando' : 'convites aguardando'} resposta`}
        </p>
      </div>

      {invites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
          <Mail className="h-7 w-7 opacity-30" />
          <p className="text-sm">Nenhum convite pendente</p>
        </div>
      ) : (
        <div className="divide-y">
          {invites.map((invite) => {
            const expiry = formatExpiry(invite.expires_at)
            return (
              <div key={invite.id} className="flex items-center gap-3 px-6 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{invite.email}</p>
                  <p className={`text-xs ${expiry.urgent ? 'text-amber-500' : 'text-muted-foreground'}`}>
                    {expiry.label}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    invite.role === 'admin'
                      ? 'bg-blue-50 text-blue-700 border-blue-200 shrink-0'
                      : 'bg-slate-50 text-slate-600 border-slate-200 shrink-0'
                  }
                >
                  {invite.role === 'admin' ? 'Admin' : 'Membro'}
                </Badge>
                {isAdmin && <CancelButton inviteId={invite.id} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
