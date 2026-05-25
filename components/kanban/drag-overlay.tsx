'use client'

import { DragOverlay as DndDragOverlay } from '@dnd-kit/core'
import { Deal } from '@/types'
import { DealCard } from './deal-card'

type Props = {
  activeDeal: Deal | null
}

export function KanbanDragOverlay({ activeDeal }: Props) {
  return (
    <DndDragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
      {activeDeal ? (
        <DealCard deal={activeDeal} overlay />
      ) : null}
    </DndDragOverlay>
  )
}
