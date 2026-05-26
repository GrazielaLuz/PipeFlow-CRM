'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { STAGE_CONFIG } from '@/components/kanban/stage-config'

export interface FunnelDataPoint {
  stage: string
  label: string
  count: number
  value: number
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload: FunnelDataPoint }>
  label?: string
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="mb-1 text-sm font-semibold">{label}</p>
      <p className="text-sm text-muted-foreground">
        {data.count} negócio{data.count !== 1 ? 's' : ''}
      </p>
      <p className="text-sm font-medium">{formatCurrency(data.value)}</p>
    </div>
  )
}

interface FunnelChartProps {
  data: FunnelDataPoint[]
}

export function FunnelChart({ data }: FunnelChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Negócios por Etapa</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={72}>
              {data.map((entry) => (
                <Cell
                  key={entry.stage}
                  fill={STAGE_CONFIG[entry.stage as keyof typeof STAGE_CONFIG]?.color ?? '#2563EB'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
