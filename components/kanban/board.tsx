'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Deal, DealStage, Lead } from '@/types'
import { updateDealStage } from '@/app/(app)/pipeline/actions'
import { KanbanColumn } from './column'
import { KanbanDragOverlay } from './drag-overlay'
import { STAGE_ORDER } from './stage-config'

type DealsByStage = Record<DealStage, Deal[]>

type Props = {
  initialDeals: DealsByStage
  leads?: Pick<Lead, 'id' | 'name' | 'company'>[]
}

export function KanbanBoard({ initialDeals, leads = [] }: Props) {
  const [dealsByStage, setDealsByStage] = useState<DealsByStage>(initialDeals)
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const findDealStage = useCallback(
    (dealId: string): DealStage | undefined => {
      return STAGE_ORDER.find((stage) =>
        dealsByStage[stage].some((d) => d.id === dealId),
      )
    },
    [dealsByStage],
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const stage = findDealStage(String(active.id))
    if (!stage) return
    const deal = dealsByStage[stage].find((d) => d.id === active.id)
    setActiveDeal(deal ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDeal(null)

    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    const sourceStage = findDealStage(activeId)
    if (!sourceStage) return

    // Determine target stage: could be a stage id (column drop) or another deal id
    const targetStage = (STAGE_ORDER.includes(overId as DealStage)
      ? overId
      : findDealStage(overId)) as DealStage | undefined

    if (!targetStage) return

    // Snapshot for rollback
    const snapshot = { ...dealsByStage }

    if (sourceStage === targetStage) {
      // Reorder within same column
      const items = dealsByStage[sourceStage]
      const oldIndex = items.findIndex((d) => d.id === activeId)
      const newIndex = items.findIndex((d) => d.id === overId)
      if (oldIndex === newIndex) return

      setDealsByStage((prev) => ({
        ...prev,
        [sourceStage]: arrayMove(prev[sourceStage], oldIndex, newIndex),
      }))
    } else {
      // Move to different column — optimistic update
      const sourceDeal = dealsByStage[sourceStage].find((d) => d.id === activeId)!
      const updatedDeal: Deal = { ...sourceDeal, stage: targetStage }

      setDealsByStage((prev) => ({
        ...prev,
        [sourceStage]: prev[sourceStage].filter((d) => d.id !== activeId),
        [targetStage]: [...prev[targetStage], updatedDeal],
      }))

      // Persist to server
      const result = await updateDealStage(activeId, targetStage)
      if (result.error) {
        // Rollback
        setDealsByStage(snapshot)
      }
    }
  }

  function handleDeleteDeal(dealId: string) {
    setDealsByStage((prev) => {
      const stage = STAGE_ORDER.find((s) => prev[s].some((d) => d.id === dealId))
      if (!stage) return prev
      return { ...prev, [stage]: prev[stage].filter((d) => d.id !== dealId) }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-4 px-1">
        {STAGE_ORDER.map((stage, index) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            deals={dealsByStage[stage]}
            colIndex={index}
            leads={leads}
            onDeleteDeal={handleDeleteDeal}
          />
        ))}
      </div>
      <KanbanDragOverlay activeDeal={activeDeal} />
    </DndContext>
  )
}
