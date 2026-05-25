import { Lead, Activity, ActivityType, LeadStatus } from '@/types'

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString()
}

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    workspace_id: 'ws1',
    name: 'Ana Paula Oliveira',
    email: 'ana.oliveira@acmecorp.com.br',
    phone: '+55 11 91234-5678',
    company: 'Acme Corp',
    role: 'Diretora Comercial',
    status: 'qualified',
    assignee_id: undefined,
    created_at: daysAgo(2),
  },
  {
    id: '2',
    workspace_id: 'ws1',
    name: 'Bruno Henrique Santos',
    email: 'bruno.santos@techco.io',
    phone: '+55 21 99876-5432',
    company: 'TechCo',
    role: 'CEO',
    status: 'contacted',
    assignee_id: undefined,
    created_at: daysAgo(5),
  },
  {
    id: '3',
    workspace_id: 'ws1',
    name: 'Carla Mendes Ferreira',
    email: 'carla.mendes@fintechsa.com.br',
    phone: '+55 31 98765-4321',
    company: 'FinTech SA',
    role: 'CFO',
    status: 'new',
    assignee_id: undefined,
    created_at: daysAgo(10),
  },
  {
    id: '4',
    workspace_id: 'ws1',
    name: 'Diego Almeida Costa',
    email: 'diego@startupbr.com',
    phone: '+55 51 97654-3210',
    company: 'StartupBR',
    role: 'CTO',
    status: 'won',
    assignee_id: undefined,
    created_at: daysAgo(30),
  },
  {
    id: '5',
    workspace_id: 'ws1',
    name: 'Fernanda Lima Rodrigues',
    email: 'fernanda.lima@grupologos.com.br',
    phone: '+55 85 96543-2109',
    company: 'Grupo Logos',
    role: 'Gerente de Compras',
    status: 'lost',
    assignee_id: undefined,
    created_at: daysAgo(45),
  },
  {
    id: '6',
    workspace_id: 'ws1',
    name: 'Gabriel Torres Neto',
    email: 'gabriel.torres@construtoranova.com.br',
    phone: '+55 62 95432-1098',
    company: 'Construtora Nova',
    role: 'Diretor de Operações',
    status: 'qualified',
    assignee_id: undefined,
    created_at: daysAgo(7),
  },
  {
    id: '7',
    workspace_id: 'ws1',
    name: 'Helena Vieira Souza',
    email: 'helena@medicaresaude.com.br',
    phone: '+55 41 94321-0987',
    company: 'Medicare Saúde',
    role: 'Coordenadora Administrativa',
    status: 'contacted',
    assignee_id: undefined,
    created_at: daysAgo(12),
  },
  {
    id: '8',
    workspace_id: 'ws1',
    name: 'Igor Cardoso Pinto',
    email: 'igor.cardoso@agenciapulse.com.br',
    phone: '+55 71 93210-9876',
    company: 'Agência Pulse',
    role: 'Sócio-Fundador',
    status: 'new',
    assignee_id: undefined,
    created_at: daysAgo(1),
  },
  {
    id: '9',
    workspace_id: 'ws1',
    name: 'Juliana Barbosa Martins',
    email: 'juliana@distribuidoramax.com.br',
    phone: '+55 11 92109-8765',
    company: 'Distribuidora Max',
    role: 'Gerente Regional',
    status: 'qualified',
    assignee_id: undefined,
    created_at: daysAgo(20),
  },
  {
    id: '10',
    workspace_id: 'ws1',
    name: 'Leonardo Gomes Araújo',
    email: 'leo.araujo@logisticaexpressa.com.br',
    phone: '+55 19 91098-7654',
    company: 'Logística Expressa',
    role: 'Supervisor de TI',
    status: 'contacted',
    assignee_id: undefined,
    created_at: daysAgo(8),
  },
  {
    id: '11',
    workspace_id: 'ws1',
    name: 'Mariana Ramos Pereira',
    email: 'mariana.ramos@educafacil.com.br',
    phone: '+55 48 90987-6543',
    company: 'EducaFácil',
    role: 'Diretora Pedagógica',
    status: 'won',
    assignee_id: undefined,
    created_at: daysAgo(60),
  },
  {
    id: '12',
    workspace_id: 'ws1',
    name: 'Nicolas Farias Cunha',
    email: 'nicolas@varejo360.com.br',
    phone: '+55 27 98765-1234',
    company: 'Varejo 360',
    role: 'Head de Marketing',
    status: 'lost',
    assignee_id: undefined,
    created_at: daysAgo(35),
  },
  {
    id: '13',
    workspace_id: 'ws1',
    name: 'Patrícia Nascimento Silva',
    email: 'patricia.ns@industria3.com.br',
    phone: '+55 11 97654-8765',
    company: 'Indústria 3.0',
    role: 'Engenheira de Processos',
    status: 'new',
    assignee_id: undefined,
    created_at: daysAgo(3),
  },
  {
    id: '14',
    workspace_id: 'ws1',
    name: 'Rafael Moura Braga',
    email: 'rafael.moura@imobiliariaprime.com.br',
    phone: '+55 61 96543-7654',
    company: 'Imobiliária Prime',
    role: 'Gerente de Vendas',
    status: 'qualified',
    assignee_id: undefined,
    created_at: daysAgo(15),
  },
]

type MockActivity = Activity & { lead_name?: string }

export const MOCK_ACTIVITIES: Record<string, MockActivity[]> = {
  '1': [
    {
      id: 'a1',
      workspace_id: 'ws1',
      lead_id: '1',
      type: 'meeting',
      author_id: 'u1',
      description: 'Reunião de apresentação da plataforma. Cliente demonstrou interesse em módulos de automação e pediu proposta formal.',
      date: daysAgo(1),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
    {
      id: 'a2',
      workspace_id: 'ws1',
      lead_id: '1',
      type: 'email',
      author_id: 'u1',
      description: 'Enviei proposta comercial com valores e condições de pagamento. Aguardando retorno até sexta.',
      date: daysAgo(3),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
    {
      id: 'a3',
      workspace_id: 'ws1',
      lead_id: '1',
      type: 'call',
      author_id: 'u1',
      description: 'Primeiro contato. Apresentei os serviços e marquei reunião para a semana seguinte.',
      date: daysAgo(10),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
  ],
  '2': [
    {
      id: 'a4',
      workspace_id: 'ws1',
      lead_id: '2',
      type: 'call',
      author_id: 'u1',
      description: 'Liguei para qualificar o lead. Confirmou que estão em processo de avaliação de fornecedores.',
      date: daysAgo(2),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
    {
      id: 'a5',
      workspace_id: 'ws1',
      lead_id: '2',
      type: 'note',
      author_id: 'u1',
      description: 'Lead veio via indicação do cliente TechCo. Budget disponível por volta de R$80k/ano. Decisão em 60 dias.',
      date: daysAgo(5),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
  ],
  '4': [
    {
      id: 'a6',
      workspace_id: 'ws1',
      lead_id: '4',
      type: 'meeting',
      author_id: 'u1',
      description: 'Reunião de kick-off pós-fechamento. Contrato assinado, implementação agendada para próxima semana.',
      date: daysAgo(5),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
    {
      id: 'a7',
      workspace_id: 'ws1',
      lead_id: '4',
      type: 'call',
      author_id: 'u1',
      description: 'Negociação finalizada. Cliente aceitou proposta com 10% de desconto no plano anual.',
      date: daysAgo(12),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
    {
      id: 'a8',
      workspace_id: 'ws1',
      lead_id: '4',
      type: 'email',
      author_id: 'u1',
      description: 'Enviei contrato para assinatura via DocuSign.',
      date: daysAgo(15),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
    {
      id: 'a9',
      workspace_id: 'ws1',
      lead_id: '4',
      type: 'meeting',
      author_id: 'u1',
      description: 'Demo técnica com time de engenharia. Muito positivo.',
      date: daysAgo(25),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
  ],
  '6': [
    {
      id: 'a10',
      workspace_id: 'ws1',
      lead_id: '6',
      type: 'email',
      author_id: 'u1',
      description: 'Enviado material técnico com cases do setor de construção civil.',
      date: daysAgo(1),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
    {
      id: 'a11',
      workspace_id: 'ws1',
      lead_id: '6',
      type: 'call',
      author_id: 'u1',
      description: 'Conversa inicial. Cliente tem interesse em automatizar gestão de contratos e orçamentos.',
      date: daysAgo(7),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
  ],
  '9': [
    {
      id: 'a12',
      workspace_id: 'ws1',
      lead_id: '9',
      type: 'meeting',
      author_id: 'u1',
      description: 'Reunião de qualificação técnica. Precisa de integração com ERP Totvs.',
      date: daysAgo(3),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
    {
      id: 'a13',
      workspace_id: 'ws1',
      lead_id: '9',
      type: 'note',
      author_id: 'u1',
      description: 'Competidor: Salesforce. Nosso diferencial: preço e suporte em português.',
      date: daysAgo(8),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
  ],
  '14': [
    {
      id: 'a14',
      workspace_id: 'ws1',
      lead_id: '14',
      type: 'call',
      author_id: 'u1',
      description: 'Follow-up pós-proposta. Pediu ajuste no número de usuários incluídos.',
      date: daysAgo(2),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
    {
      id: 'a15',
      workspace_id: 'ws1',
      lead_id: '14',
      type: 'email',
      author_id: 'u1',
      description: 'Proposta revisada enviada. Incluímos onboarding gratuito como diferencial.',
      date: daysAgo(10),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
    {
      id: 'a16',
      workspace_id: 'ws1',
      lead_id: '14',
      type: 'meeting',
      author_id: 'u1',
      description: 'Reunião de apresentação com time de vendas do cliente. Muito engajados.',
      date: daysAgo(15),
      author: { id: 'u1', email: 'voce@empresa.com', full_name: 'Você' },
    },
  ],
}

export function getMockLead(id: string): Lead | undefined {
  return MOCK_LEADS.find((l) => l.id === id)
}

export function getMockActivities(leadId: string): MockActivity[] {
  return MOCK_ACTIVITIES[leadId] ?? []
}

export function filterMockLeads(params: {
  q?: string
  status?: string
  page?: number
  pageSize?: number
}): { leads: Lead[]; total: number } {
  const { q, status, page = 1, pageSize = 20 } = params
  let results = [...MOCK_LEADS]

  if (q) {
    const term = q.toLowerCase()
    results = results.filter(
      (l) =>
        l.name.toLowerCase().includes(term) ||
        l.email.toLowerCase().includes(term) ||
        l.company?.toLowerCase().includes(term),
    )
  }

  if (status && status !== 'all') {
    results = results.filter((l) => l.status === status)
  }

  const total = results.length
  const from = (page - 1) * pageSize
  return { leads: results.slice(from, from + pageSize), total }
}
