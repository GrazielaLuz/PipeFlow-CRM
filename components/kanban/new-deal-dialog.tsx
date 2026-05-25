'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Deal, DealStage, Lead } from '@/types'
import { DealForm } from './deal-form'

type Props = {
  defaultStage?: DealStage
  leads?: Pick<Lead, 'id' | 'name' | 'company'>[]
  variant?: 'default' | 'ghost-sm'
  onDealCreated?: (deal: Deal) => void
}

export function NewDealDialog({ defaultStage = 'prospecting', leads = [], variant = 'default', onDealCreated }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {variant === 'ghost-sm' ? (
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground gap-1.5 h-8 text-xs"
            />
          }
        >
          <Plus className="h-3.5 w-3.5" />
          Negócio
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button size="sm" />}>
          <Plus className="h-4 w-4 mr-1.5" />
          Novo Negócio
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Novo Negócio</DialogTitle>
        </DialogHeader>
        <DealForm
          defaultStage={defaultStage}
          leads={leads}
          onSuccess={(deal) => {
            setOpen(false)
            onDealCreated?.(deal)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
