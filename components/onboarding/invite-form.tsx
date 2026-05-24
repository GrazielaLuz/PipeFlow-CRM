'use client'

import { useState } from 'react'
import { UserPlus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Invite {
  email: string
  role: 'admin' | 'member'
}

interface InviteFormProps {
  invites: Invite[]
  onChange: (invites: Invite[]) => void
}

export function InviteForm({ invites, onChange }: InviteFormProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'member'>('member')

  function addInvite() {
    const trimmed = email.trim()
    if (!trimmed || invites.some((i) => i.email === trimmed)) return
    onChange([...invites, { email: trimmed, role }])
    setEmail('')
  }

  function removeInvite(index: number) {
    onChange(invites.filter((_, i) => i !== index))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addInvite()
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <UserPlus className="h-7 w-7 text-primary" />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="invite-email">E-mail do colaborador</Label>
          <Input
            id="invite-email"
            type="email"
            placeholder="colega@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="invite-role">Papel</Label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
            className="flex h-9 w-28 items-center rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="member">Membro</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="invisible">Adicionar</Label>
          <Button type="button" variant="outline" onClick={addInvite} disabled={!email.trim()}>
            Adicionar
          </Button>
        </div>
      </div>

      {invites.length > 0 && (
        <ul className="space-y-2">
          {invites.map((invite, index) => (
            <li
              key={invite.email}
              className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2"
            >
              <span className="text-sm">{invite.email}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {invite.role === 'admin' ? 'Admin' : 'Membro'}
                </Badge>
                <button
                  type="button"
                  onClick={() => removeInvite(index)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Remover ${invite.email}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {invites.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Nenhum colaborador adicionado ainda.{' '}
          <span className="text-xs">(você pode pular e convidar depois)</span>
        </p>
      )}
    </div>
  )
}
