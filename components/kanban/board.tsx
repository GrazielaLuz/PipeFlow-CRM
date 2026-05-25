'use client'

import { useState, useRef } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Deal, DealStage, Lead } from '@/types'
import { updateDealStage } from '@/app/(app)/pipeline/actions'
import { KanbanColumn } from './column'
import { DealCard } from './deal-card'
import { STAGE_ORDER } from './stage-config'

type DealsByStage = Record<DealStage, Deal[]>

type Props = {
  initialDeals: DealsByStage
  leads?: Pick<Lead, 'id' | 'name' | 'company'>[]
}

function findStageOf(dealId: string, state: DealsByStage): DealStage | undefined {
  return STAGE_ORDER.find((s) => state[s].some((d) => d.id === dealId))
}

export function KanbanBoard({ initialDeals, leads = [] }: Props) {
  const [dealsByStage, setDealsByStage] = useState<DealsByStage>(initialDeals)
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null)

  // Refs for rollback and server-sync — avoids stale closure issues
  const snapshotRef = useRef<DealsByStage | null>(null)
  const originalStageRef = useRef<DealStage | null>(null)
  const finalStageRef = useRef<DealStage | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  )

  // ── drag start ──────────────────────────────────────────────────────────
  function handleDragStart({ active }: DragStartEvent) {
    const activeId = String(active.id)
    const stage = findStageOf(activeId, dealsByStage)
    if (!stage) return

    snapshotRef.current = JSON.parse(JSON.stringify(dealsByStage))
    originalStageRef.current = stage
    finalStageRef.current = stage

    setActiveDeal(dealsByStage[stage].find((d) => d.id === activeId) ?? null)
  }

  // ── drag over — moves card between columns during drag ──────────────────
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    setDealsByStage((prev) => {
      const sourceStage = findStageOf(activeId, prev)
      if (!sourceStage) return prev

      const targetStage: DealStage | undefined = STAGE_ORDER.includes(overId as DealStage)
        ? (overId as DealStage)
        : findStageOf(overId, prev)

      if (!targetStage || sourceStage === targetStage) return prev

      const deal = prev[sourceStage].find((d) => d.id === activeId)
      if (!deal) return prev

      finalStageRef.current = targetStage

      return {
        ...prev,
        [sourceStage]: prev[sourceStage].filter((d) => d.id !== activeId),
        [targetStage]: [...prev[targetStage], { ...deal, stage: targetStage }],
      }
    })
  }

  // ── drag end — reorder within column + persist stage change ────────────
  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveDeal(null)

    const snapshot = snapshotRef.current
    const originalStage = originalStageRef.current
    const movedToStage = finalStageRef.current

    snapshotRef.current = null
    originalStageRef.current = null
    finalStageRef.current = null

    if (!over) {
      if (snapshot) setDealsByStage(snapshot)
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)

    // Reorder within same column when dropped on a sibling card
    const isOverCard = !STAGE_ORDER.includes(overId as DealStage)
    if (isOverCard) {
      setDealsByStage((prev) => {
        const stage = findStageOf(activeId, prev)
        const overStage = findStageOf(overId, prev)
        if (!stage || stage !== overStage) return prev

        const items = prev[stage]
        const oldIdx = items.findIndex((d) => d.id === activeId)
        const newIdx = items.findIndex((d) => d.id === overId)
        if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return prev

        return { ...prev, [stage]: arrayMove(items, oldIdx, newIdx) }
      })
    }

    // Persist to server if card moved to a different column
    if (originalStage && movedToStage && originalStage !== movedToStage) {
      const result = await updateDealStage(activeId, movedToStage)
      if (result.error && snapshot) {
        setDealsByStage(snapshot)
      }
    }
  }

  // ── delete ──────────────────────────────────────────────────────────────
  function handleDeleteDeal(dealId: string) {
    setDealsByStage((prev) => {
      const stage = findStageOf(dealId, prev)
      if (!stage) return prev
      return { ...prev, [stage]: prev[stage].filter((d) => d.id !== dealId) }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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

      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
        {activeDeal ? <DealCard deal={activeDeal} overlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
