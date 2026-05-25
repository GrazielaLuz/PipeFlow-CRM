'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, Building2, GripVertical } from 'lucide-react'
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

  const cardContent = (
    <div
      className={[
        'group relative bg-card border rounded-lg p-3 text-sm select-none',
        'transition-all duration-200',
        isDragging ? 'opacity-40 shadow-lg' : 'opacity-100',
        overlay ? 'shadow-xl scale-[1.02] opacity-90 rotate-1' : '',
        !overlay && !isDragging
          ? 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer'
          : '',
        'kanban-card-animate',
      ].join(' ')}
      style={{
        '--stage-color': config.color,
        borderLeftWidth: '3px',
        borderLeftColor: config.color,
      } as React.CSSProperties}
      onClick={() => !overlay && setSheetOpen(true)}
    >
      {/* Drag handle */}
      {!overlay && (
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
          aria-label="Arrastar negócio"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Title */}
      <p className="font-medium text-foreground leading-snug pr-5 mb-2 line-clamp-2">
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
        <div className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded border ${deadline.className}`}>
          <CalendarDays className="h-3 w-3" />
          {deadline.label}
        </div>
      )}
    </div>
  )

  if (overlay) return cardContent

  return (
    <>
      <div ref={setNodeRef} style={style}>
        {cardContent}
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
