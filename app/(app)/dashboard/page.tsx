import { TopBar } from '@/components/shared/top-bar'

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Em breve: métricas, gráfico de funil e prazos.</p>
      </div>
    </>
  )
}
