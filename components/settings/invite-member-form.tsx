'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Props {
  workspaceId: string
  plan: 'free' | 'pro'
  memberCount: number
}

export function InviteMemberForm({ workspaceId, plan, memberCount }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'member' | 'admin'>('member')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const atLimit = plan === 'free' && memberCount >= 2

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (atLimit || loading) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    const res = await fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, workspaceId }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Erro ao enviar convite')
      return
    }

    setEmail('')
    setRole('member')
    setSuccess(true)
    router.refresh()
  }

  return (
    <div className="rounded-lg border bg-card px-6 py-5">
      <h2 className="text-sm font-semibold">Convidar membro</h2>
      <p className="text-xs text-muted-foreground mt-0.5 mb-4">
        Envie um convite por e-mail. O link expira em 7 dias.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="invite-email" className="text-xs font-medium">
              E-mail
            </Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colaborador@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={atLimit || loading}
              required
              className="mt-1"
            />
          </div>

          <div className="w-full sm:w-36">
            <Label htmlFor="invite-role" className="text-xs font-medium">
              Papel
            </Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as 'member' | 'admin')}
              disabled={atLimit || loading}
            >
              <SelectTrigger id="invite-role" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Membro</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="w-full sm:w-auto">
                  <Button
                    type="submit"
                    disabled={atLimit || loading}
                    className="w-full sm:w-auto"
                  >
                    {loading ? 'Enviando...' : 'Convidar'}
                  </Button>
                </span>
              </TooltipTrigger>
              {atLimit && (
                <TooltipContent>
                  Limite de 2 membros no plano Free. Faça upgrade para Pro.
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        {success && (
          <p className="mt-2 text-xs text-emerald-600">Convite enviado com sucesso!</p>
        )}
      </form>
    </div>
  )
}
