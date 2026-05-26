import { Card, CardContent } from '@/components/ui/card'
import { type LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  subtitle?: string
  icon: LucideIcon
}

export function MetricCard({ label, value, subtitle, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
