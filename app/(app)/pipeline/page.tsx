import { TopBar } from '@/components/shared/top-bar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function PipelinePage() {
  return (
    <>
      <TopBar
        title="Pipeline"
        actions={
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Novo Negócio
          </Button>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-semibold">Pipeline</h1>
        <p className="mt-2 text-muted-foreground">Em breve: Kanban com drag-and-drop.</p>
      </div>
    </>
  )
}
