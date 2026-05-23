import { TopBar } from '@/components/shared/top-bar'

export default function ActivitiesPage() {
  return (
    <>
      <TopBar title="Atividades" />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-semibold">Atividades</h1>
        <p className="mt-2 text-muted-foreground">Em breve: feed de atividades do workspace.</p>
      </div>
    </>
  )
}
