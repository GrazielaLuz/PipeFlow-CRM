'use client'

import { useState } from 'react'
import { AlertTriangle, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LimitBannerProps {
  type: 'leads' | 'members'
  current: number
  max: number
}

export function LimitBanner({ type, current, max }: LimitBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (dismissed || current < max) return null

  const label = type === 'leads' ? 'leads' : 'membros'

  async function handleUpgrade() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
      <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
      <span className="flex-1 text-destructive">
        Limite de <strong>{max} {label}</strong> atingido no plano Free.
      </span>
      <Button size="sm" onClick={handleUpgrade} disabled={isLoading} className="h-7 gap-1.5 text-xs">
        <Zap className="h-3 w-3" />
        {isLoading ? 'Aguarde...' : 'Fazer upgrade'}
      </Button>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Fechar aviso"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
