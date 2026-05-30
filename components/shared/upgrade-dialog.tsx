'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PLAN_FEATURES } from '@/lib/stripe/plans'

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason?: string
}

export function UpgradeDialog({ open, onOpenChange, reason }: UpgradeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpgrade() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Upgrade para Pro
          </DialogTitle>
          <DialogDescription>
            {reason ?? 'Você atingiu o limite do plano Free.'} Faça upgrade para continuar.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="mb-3 text-sm font-medium">Plano Pro inclui:</p>
          <ul className="space-y-1.5">
            {PLAN_FEATURES.pro.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                {feature}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-semibold text-foreground">R$49 / mês</p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpgrade} disabled={isLoading}>
            {isLoading ? 'Redirecionando...' : 'Fazer upgrade'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
