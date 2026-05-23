import { KanbanSquare, Users, Activity, BarChart2, Building2, UserPlus } from 'lucide-react'

const features = [
  {
    icon: KanbanSquare,
    title: 'Pipeline Kanban',
    description:
      'Visualize todo o funil de vendas em um board Kanban. Mova negócios entre etapas com drag-and-drop intuitivo e persistência automática.',
  },
  {
    icon: Users,
    title: 'Gestão de Leads',
    description:
      'Cadastro completo de contatos: nome, empresa, cargo, e-mail e telefone. Busca rápida e filtros avançados por status e responsável.',
  },
  {
    icon: Activity,
    title: 'Timeline de Atividades',
    description:
      'Registre ligações, e-mails, reuniões e notas. Histórico completo de todas as interações cronológico por cliente.',
  },
  {
    icon: BarChart2,
    title: 'Dashboard de Métricas',
    description:
      'Acompanhe leads, negócios abertos, valor total do pipeline e taxa de conversão em tempo real com gráfico de funil.',
  },
  {
    icon: Building2,
    title: 'Multi-empresa',
    description:
      'Crie workspaces separados para cada empresa ou projeto. Dados 100% isolados e seguros por workspace com RLS.',
  },
  {
    icon: UserPlus,
    title: 'Colaboração em Time',
    description:
      'Convide colaboradores por e-mail e defina papéis: Admin com acesso total ou Membro para operações do dia a dia.',
  },
]

export function Features() {
  return (
    <section id="features" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Tudo que você precisa para vender mais
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Do primeiro contato ao fechamento, o PipeFlow organiza todo o seu processo comercial em
            um único lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
