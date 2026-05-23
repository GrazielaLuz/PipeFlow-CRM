import { TopBar } from '@/components/shared/top-bar'

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <TopBar title="Detalhe do Lead" />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-semibold">Lead #{params.id}</h1>
        <p className="mt-2 text-muted-foreground">Em breve: perfil completo + timeline de atividades.</p>
      </div>
    </>
  )
}
