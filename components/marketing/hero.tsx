import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const sidebarItems = [
  { label: 'Dashboard', active: false },
  { label: 'Leads', active: false },
  { label: 'Pipeline', active: true },
  { label: 'Atividades', active: false },
  { label: 'Configurações', active: false },
]

const kanbanColumns = [
  {
    label: 'Novo Lead',
    dot: 'bg-blue-500',
    cards: [
      { title: 'Empresa ABC', value: 'R$ 12k', lead: 'Ana L.' },
      { title: 'João Silva LTDA', value: 'R$ 8k', lead: 'Pedro C.' },
    ],
  },
  {
    label: 'Proposta',
    dot: 'bg-purple-500',
    cards: [{ title: 'Tech Solutions', value: 'R$ 45k', lead: 'Maria S.' }],
  },
  {
    label: 'Negociação',
    dot: 'bg-orange-500',
    cards: [
      { title: 'StartupXYZ', value: 'R$ 22k', lead: 'Carlos M.' },
      { title: 'Grupo Delta', value: 'R$ 67k', lead: 'Laura S.' },
    ],
  },
  {
    label: 'Fechado',
    dot: 'bg-green-500',
    cards: [{ title: 'Holding Alfa', value: 'R$ 120k', lead: 'Roberto L.' }],
  },
]

function AppMockup() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="mx-4 flex-1 rounded border border-gray-200 bg-white px-3 py-1 text-xs text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500">
          app.pipeflow.com.br/pipeline
        </div>
      </div>

      {/* App interface */}
      <div className="flex h-64">
        {/* Sidebar */}
        <div className="w-40 flex-shrink-0 border-r border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2 px-1">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-600">
              <div className="h-2.5 w-2.5 rounded-sm bg-white" />
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">PipeFlow</span>
          </div>
          {sidebarItems.map(({ label, active }) => (
            <div
              key={label}
              className={`mb-0.5 rounded-md px-2 py-1.5 text-[11px] font-medium ${
                active
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'text-gray-500 dark:text-gray-500'
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Kanban area */}
        <div className="flex-1 overflow-hidden bg-gray-50/50 p-3 dark:bg-gray-900/50">
          <div className="flex h-full gap-2">
            {kanbanColumns.map((col) => (
              <div key={col.label} className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-1.5">
                  <div className={`h-2 w-2 flex-shrink-0 rounded-full ${col.dot}`} />
                  <span className="truncate text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                    {col.label}
                  </span>
                </div>
                {col.cards.map((card) => (
                  <div
                    key={card.title}
                    className="mb-1.5 rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  >
                    <p className="truncate text-[10px] font-semibold text-gray-800 dark:text-gray-200">
                      {card.title}
                    </p>
                    <p className="mt-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      {card.value}
                    </p>
                    <p className="mt-1 text-[9px] text-gray-400 dark:text-gray-500">{card.lead}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-16 dark:bg-gray-950">
      {/* Background gradient */}
      <div
        className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-50/60 to-white dark:from-blue-950/20 dark:to-gray-950"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-20 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/5 blur-3xl dark:bg-blue-600/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Text side */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Star className="h-3.5 w-3.5 fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400" />
              Grátis para começar — sem cartão de crédito
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl">
              Gerencie seus leads e{' '}
              <span className="text-blue-600 dark:text-blue-400">feche mais negócios</span>
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-gray-600 dark:text-gray-400">
              Pipeline visual Kanban, gestão de contatos e métricas em tempo real. Simples para
              pequenas empresas, poderoso para times de vendas.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'gap-2 px-6 text-base'
                )}
              >
                Começar grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'px-6 text-base'
                )}
              >
                Ver funcionalidades
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-600">
              Sem cartão de crédito · Plano gratuito para sempre (até 50 leads)
            </p>
          </div>

          {/* Mockup side */}
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 blur-2xl dark:from-blue-600/20 dark:to-indigo-600/20"
              aria-hidden="true"
            />
            <div className="relative">
              <AppMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
