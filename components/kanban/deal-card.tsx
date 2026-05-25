'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, Building2 } from 'lucide-react'
import { Deal, Lead } from '@/types'
import { DealSheet } from './deal-sheet'
import { STAGE_CONFIG, formatCurrency, getDeadlineBadge } from './stage-config'

type Props = {
  deal: Deal
  leads?: Pick<Lead, 'id' | 'name' | 'company'>[]
  onDelete?: (dealId: string) => void
  overlay?: boolean
}

export function DealCard({ deal, leads = [], onDelete, overlay = false }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id, data: { deal } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const config = STAGE_CONFIG[deal.stage]
  const deadline = getDeadlineBadge(deal.deadline)

  // Overlay: plain card without interactivity (shown while dragging)
  if (overlay) {
    return (
      <div
        className="bg-card border rounded-lg p-3 text-sm select-none shadow-xl scale-[1.02] opacity-90 rotate-1"
        style={{ borderLeftWidth: '3px', borderLeftColor: config.color }}
      >
        <p className="font-medium text-foreground leading-snug pr-5 mb-2 line-clamp-2">
          {deal.title}
        </p>
        <p className="text-base font-bold mb-2" style={{ color: config.color }}>
          {formatCurrency(deal.value)}
        </p>
        {deal.lead && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{deal.lead.company ?? deal.lead.name}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div ref={setNodeRef} style={style}>
        {/*
          listeners applied to the full card — activationConstraint distance:5
          means a short tap opens the sheet, a move > 5px starts the drag.
        */}
        <div
          {...attributes}
          {...listeners}
          className={[
            'group relative bg-card border rounded-lg p-3 text-sm select-none',
            'transition-all duration-200 cursor-grab active:cursor-grabbing',
            isDragging
              ? 'opacity-40 shadow-lg'
              : 'hover:-translate-y-0.5 hover:shadow-md',
            'kanban-card-animate',
          ].join(' ')}
          style={{
            borderLeftWidth: '3px',
            borderLeftColor: config.color,
          }}
          onClick={() => setSheetOpen(true)}
        >
          {/* Title */}
          <p className="font-medium text-foreground leading-snug pr-2 mb-2 line-clamp-2">
            {deal.title}
          </p>

          {/* Value */}
          <p className="text-base font-bold mb-2" style={{ color: config.color }}>
            {formatCurrency(deal.value)}
          </p>

          {/* Lead / Company */}
          {deal.lead && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
              <Building2 className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {deal.lead.company ?? deal.lead.name}
              </span>
            </div>
          )}

          {/* Deadline badge */}
          {deadline && (
            <div
              className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded border ${deadline.className}`}
            >
              <CalendarDays className="h-3 w-3" />
              {deadline.label}
            </div>
          )}
        </div>
      </div>

      <DealSheet
        deal={deal}
        leads={leads}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onDelete={onDelete}
      />
    </>
  )
}
