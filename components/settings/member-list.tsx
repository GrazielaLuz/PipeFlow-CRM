'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { removeMemberAction } from '@/app/actions/workspace'
import type { WorkspaceMemberRole } from '@/types'

export interface MemberRow {
  userId: string
  role: WorkspaceMemberRole
  email: string
  fullName?: string
}

interface Props {
  members: MemberRow[]
  currentUserId: string
  currentRole: WorkspaceMemberRole
  workspaceId: string
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function RemoveMemberDialog({
  member,
  workspaceId,
  onRemoved,
}: {
  member: MemberRow
  workspaceId: string
  onRemoved: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleRemove() {
    startTransition(async () => {
      const result = await removeMemberAction({ workspaceId, userId: member.userId })
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
        onRemoved()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="text-destructive border-destructive/40 hover:bg-destructive/5" />}>
        Remover
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover membro</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover <strong>{member.fullName ?? member.email}</strong> do
            workspace? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleRemove} disabled={isPending}>
            {isPending ? 'Removendo...' : 'Remover'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function MemberList({ members, currentUserId, currentRole, workspaceId }: Props) {
  const router = useRouter()

  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b px-6 py-4">
        <h2 className="text-sm font-semibold">Membros</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {members.length} {members.length === 1 ? 'membro' : 'membros'} neste workspace
        </p>
      </div>
      {members.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
          Nenhum membro encontrado
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const displayName = member.fullName ?? member.email
              const isSelf = member.userId === currentUserId
              return (
                <TableRow key={member.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`text-xs font-semibold ${member.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-500 text-white'}`}>
                          {initials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{displayName}</p>
                        {member.fullName && (
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        member.role === 'admin'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }
                    >
                      {member.role === 'admin' ? 'Admin' : 'Membro'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {isSelf ? (
                      <span className="text-xs text-muted-foreground italic">Você</span>
                    ) : currentRole === 'admin' ? (
                      <RemoveMemberDialog
                        member={member}
                        workspaceId={workspaceId}
                        onRemoved={() => router.refresh()}
                      />
                    ) : null}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
