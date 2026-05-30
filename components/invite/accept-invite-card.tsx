'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, UserCheck, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { acceptInviteAction } from '@/app/actions/invite'

interface Props {
  token: string
  email: string
  role: 'admin' | 'member'
  workspaceName: string
  userEmail: string
}

export function AcceptInviteCard({ token, email, role, workspaceName, userEmail }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const emailMismatch = email.toLowerCase() !== userEmail.toLowerCase()

  async function handleAccept() {
    setLoading(true)
    setError(null)
    const result = await acceptInviteAction(token)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full rounded-lg border bg-card p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Convite para</p>
          <p className="font-semibold">{workspaceName}</p>
        </div>
      </div>

      <h1 className="text-xl font-semibold mb-2">Aceitar convite</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Você foi convidado para participar de <strong>{workspaceName}</strong> como{' '}
        <strong>{role === 'admin' ? 'Administrador' : 'Membro'}</strong>.
      </p>

      {emailMismatch && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3 mb-4 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            Este convite foi enviado para <strong>{email}</strong>, mas você está logado como{' '}
            <strong>{userEmail}</strong>. Faça login com o e-mail correto para aceitar.
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 p-3 mb-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleAccept}
          disabled={loading || emailMismatch}
          className="flex-1 gap-2"
        >
          <UserCheck className="h-4 w-4" />
          {loading ? 'Aceitando...' : 'Aceitar convite'}
        </Button>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
