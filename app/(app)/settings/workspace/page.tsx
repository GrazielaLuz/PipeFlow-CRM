import { TopBar } from '@/components/shared/top-bar'

export default function WorkspaceSettingsPage() {
  return (
    <>
      <TopBar title="Configurações do Workspace" />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-semibold">Workspace</h1>
        <p className="mt-2 text-muted-foreground">Em breve: membros, convites e configurações gerais.</p>
      </div>
    </>
  )
}
