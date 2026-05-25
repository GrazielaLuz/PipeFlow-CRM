'use client'

import { useState, useTransition } from 'react'
import { CalendarDays, Trash2, Building2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Deal, Lead } from '@/types'
import { deleteDeal } from '@/app/(app)/pipeline/actions'
import { DealForm } from './deal-form'
import { STAGE_CONFIG, formatCurrency, getDeadlineBadge } from './stage-config'

type Props = {
  deal: Deal | null
  leads?: Pick<Lead, 'id' | 'name' | 'company'>[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (dealId: string) => void
  onDealUpdated?: (deal: Deal) => void
}

export function DealSheet({ deal, leads = [], open, onOpenChange, onDelete, onDealUpdated }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!deal) return null

  const config = STAGE_CONFIG[deal.stage]
  const deadline = getDeadlineBadge(deal.deadline)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteDeal(deal!.id)
      if (!result.error) {
        onDelete?.(deal!.id)
        setConfirmDelete(false)
        onOpenChange(false)
      }
    })
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-[480px] overflow-y-auto">
          <SheetHeader className="mb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border mb-2"
                  style={{
                    color: config.textColor,
                    background: config.bg,
                    borderColor: config.border,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: config.color }}
                  />
                  {config.label}
                </span>
                <SheetTitle className="text-lg leading-tight">{deal.title}</SheetTitle>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xl font-bold text-foreground">
                  {formatCurrency(deal.value)}
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 mb-5 text-sm text-muted-foreground">
            {deal.lead && (
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                <span>{deal.lead.name}</span>
                {deal.lead.company && (
                  <>
                    <span className="text-border">·</span>
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{deal.lead.company}</span>
                  </>
                )}
              </div>
            )}
            {deadline && (
              <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded border ${deadline.className}`}>
                <CalendarDays className="h-3 w-3" />
                <span>{deadline.label}</span>
              </div>
            )}
          </div>

          <Separator className="mb-5" />

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
              Editar negócio
            </h3>
            <DealForm
              deal={deal}
              leads={leads}
              onSuccess={(updatedDeal) => {
                onOpenChange(false)
                onDealUpdated?.(updatedDeal)
              }}
            />
          </div>

          <Separator className="mb-4" />

          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4" />
            Excluir negócio
          </Button>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Excluir negócio?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            "{deal.title}" será excluído permanentemente. Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
