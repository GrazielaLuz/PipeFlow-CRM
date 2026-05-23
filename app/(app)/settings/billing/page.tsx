import { TopBar } from '@/components/shared/top-bar'

export default function BillingPage() {
  return (
    <>
      <TopBar title="Plano & Faturamento" />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-semibold">Faturamento</h1>
        <p className="mt-2 text-muted-foreground">Em breve: plano atual, uso e upgrade para Pro.</p>
      </div>
    </>
  )
}
