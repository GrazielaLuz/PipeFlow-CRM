'use client'

import { useState } from 'react'
import { TopBar } from '@/components/shared/top-bar'
import { Deal, DealStage } from '@/types'
import { KanbanBoard } from './board'
import { NewDealDialog } from './new-deal-dialog'
import { STAGE_ORDER, formatCurrency } from './stage-config'

type DealsByStage = Record<DealStage, Deal[]>

type Props = {
  initialDeals: DealsByStage
}

export function PipelineClient({ initialDeals }: Props) {
  const [deals, setDeals] = useState<DealsByStage>(initialDeals)

  const totalDeals = STAGE_ORDER.reduce((n, s) => n + deals[s].length, 0)
  const totalValue = STAGE_ORDER.reduce(
    (sum, s) => sum + deals[s].reduce((v, d) => v + d.value, 0),
    0,
  )

  function handleDealCreated(deal: Deal) {
    setDeals((prev) => ({
      ...prev,
      [deal.stage]: [...prev[deal.stage], deal],
    }))
  }

  function handleDealUpdated(updated: Deal) {
    setDeals((prev) => {
      const oldStage = STAGE_ORDER.find((s) => prev[s].some((d) => d.id === updated.id))
      if (!oldStage) return prev

      if (oldStage === updated.stage) {
        return {
          ...prev,
          [oldStage]: prev[oldStage].map((d) => (d.id === updated.id ? updated : d)),
        }
      }

      return {
        ...prev,
        [oldStage]: prev[oldStage].filter((d) => d.id !== updated.id),
        [updated.stage]: [...prev[updated.stage], updated],
      }
    })
  }

  function handleDealDeleted(dealId: string) {
    setDeals((prev) => {
      const stage = STAGE_ORDER.find((s) => prev[s].some((d) => d.id === dealId))
      if (!stage) return prev
      return { ...prev, [stage]: prev[stage].filter((d) => d.id !== dealId) }
    })
  }

  return (
    <>
      <TopBar
        title="Pipeline"
        subtitle={`${totalDeals} negócio${totalDeals !== 1 ? 's' : ''} · ${formatCurrency(totalValue)}`}
        actions={<NewDealDialog onDealCreated={handleDealCreated} />}
      />
      <div className="flex-1 overflow-auto p-6">
        <KanbanBoard
          initialDeals={deals}
          onDealCreated={handleDealCreated}
          onDealUpdated={handleDealUpdated}
          onDealDeleted={handleDealDeleted}
        />
      </div>
    </>
  )
}
