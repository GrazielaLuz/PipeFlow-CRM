'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, ExternalLink } from 'lucide-react'

interface BillingActionsProps {
  plan: 'free' | 'pro'
  hasSubscription: boolean
}

export function BillingActions({ plan, hasSubscription }: BillingActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleCheckout() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' })
      const text = await res.text()
      let data: { url?: string; error?: string } = {}
      try { data = JSON.parse(text) } catch { /* empty body */ }
      if (!res.ok || data.error) {
        alert(data.error ?? `Erro ${res.status} ao iniciar pagamento`)
        return
      }
      if (data.url) window.location.href = data.url
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePortal() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const text = await res.text()
      let data: { url?: string; error?: string } = {}
      try { data = JSON.parse(text) } catch { /* empty body */ }
      if (!res.ok || data.error) {
        alert(data.error ?? `Erro ${res.status} ao abrir portal`)
        return
      }
      if (data.url) window.location.href = data.url
    } finally {
      setIsLoading(false)
    }
  }

  if (plan === 'pro' && hasSubscription) {
    return (
      <Button variant="outline" onClick={handlePortal} disabled={isLoading}>
        <ExternalLink className="mr-2 h-4 w-4" />
        {isLoading ? 'Redirecionando...' : 'Gerenciar assinatura'}
      </Button>
    )
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading}>
      <Zap className="mr-2 h-4 w-4" />
      {isLoading ? 'Redirecionando...' : 'Fazer upgrade para Pro — R$49/mês'}
    </Button>
  )
}
