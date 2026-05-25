'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Deal, DealStage, Lead } from '@/types'
import { DealCard } from './deal-card'
import { NewDealDialog } from './new-deal-dialog'
import { STAGE_CONFIG, formatCurrency } from './stage-config'

type Props = {
  stage: DealStage
  deals: Deal[]
  colIndex: number
  leads?: Pick<Lead, 'id' | 'name' | 'company'>[]
  onDeleteDeal?: (dealId: string) => void
  onDealCreated?: (deal: Deal) => void
  onDealUpdated?: (deal: Deal) => void
}

export function KanbanColumn({ stage, deals, colIndex, leads = [], onDeleteDeal, onDealCreated, onDealUpdated }: Props) {
  const config = STAGE_CONFIG[stage]
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
  const dealIds = deals.map((d) => d.id)

  const { setNodeRef, isOver } = useDroppable({ id: stage })

  return (
    <div
      className="kanban-col-animate flex flex-col w-[280px] min-w-[280px] flex-shrink-0"
      style={{ '--col-index': colIndex } as React.CSSProperties}
    >
      {/* Column header */}
      <div
        className="rounded-t-lg border border-b-0 px-3 py-2.5"
        style={{
          borderTopColor: config.color,
          borderTopWidth: '3px',
          borderLeftColor: config.border,
          borderRightColor: config.border,
          background: config.bg,
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: config.color }}
            />
            <span className="text-sm font-semibold text-foreground truncate">
              {config.label}
            </span>
          </div>
          <span
            className="text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded-full"
            style={{
              color: config.textColor,
              background: `${config.color}22`,
            }}
          >
            {deals.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground pl-4 font-medium">
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Drop area */}
      <SortableContext items={dealIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={[
            'flex-1 flex flex-col gap-2 p-2 rounded-b-lg border border-t-0 min-h-[200px]',
            'transition-colors duration-150',
            isOver ? 'bg-primary/5 border-primary/30' : 'bg-muted/30',
          ].join(' ')}
          style={{
            borderLeftColor: config.border,
            borderRightColor: config.border,
            borderBottomColor: config.border,
          }}
        >
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              leads={leads}
              onDelete={onDeleteDeal}
              onDealUpdated={onDealUpdated}
            />
          ))}

          {deals.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-muted-foreground/60 italic">
                Nenhum negócio
              </p>
            </div>
          )}
        </div>
      </SortableContext>

      {/* Add deal button */}
      <div
        className="border border-t-0 rounded-b-lg px-2 pb-2 pt-1"
        style={{
          borderLeftColor: config.border,
          borderRightColor: config.border,
          borderBottomColor: config.border,
          background: config.bg,
        }}
      >
        <NewDealDialog
          defaultStage={stage}
          leads={leads}
          variant="ghost-sm"
          onDealCreated={onDealCreated}
        />
      </div>
    </div>
  )
}
