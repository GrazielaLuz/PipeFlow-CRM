import { TopBar } from '@/components/shared/top-bar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function LeadsPage() {
  return (
    <>
      <TopBar
        title="Leads"
        actions={
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Novo Lead
          </Button>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <p className="mt-2 text-muted-foreground">Em breve: tabela de leads com filtros e busca.</p>
      </div>
    </>
  )
}
