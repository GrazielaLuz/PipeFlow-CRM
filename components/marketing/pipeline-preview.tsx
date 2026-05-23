const stages = [
  {
    name: 'Novo Lead',
    dot: 'bg-blue-500',
    count: 3,
    cards: [
      { title: 'Empresa ABC', value: 'R$ 12.000', lead: 'Ana Lima', deadline: '30 mai' },
      { title: 'João Silva LTDA', value: 'R$ 8.500', lead: 'Pedro Costa', deadline: '2 jun' },
    ],
  },
  {
    name: 'Contato Realizado',
    dot: 'bg-indigo-500',
    count: 2,
    cards: [
      { title: 'Tech Solutions', value: 'R$ 45.000', lead: 'Maria Santos', deadline: '28 mai' },
    ],
  },
  {
    name: 'Proposta Enviada',
    dot: 'bg-purple-500',
    count: 2,
    cards: [
      { title: 'StartupXYZ', value: 'R$ 22.000', lead: 'Carlos Mendes', deadline: '25 mai' },
      { title: 'Grupo Delta', value: 'R$ 67.000', lead: 'Laura Silva', deadline: '1 jun' },
    ],
  },
  {
    name: 'Negociação',
    dot: 'bg-orange-500',
    count: 1,
    cards: [
      { title: 'Holding Alfa', value: 'R$ 120.000', lead: 'Roberto Luz', deadline: '22 mai' },
    ],
  },
  {
    name: 'Fechado Ganho',
    dot: 'bg-green-500',
    count: 4,
    cards: [
      { title: 'Comércio Beta', value: 'R$ 18.000', lead: 'Fernanda Kim', deadline: '20 mai' },
    ],
  },
]

export function PipelinePreview() {
  return (
    <section className="overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Pipeline visual em tempo real
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Todas as etapas do funil de vendas na mesma tela. Arraste os cards para atualizar o
            progresso instantaneamente.
          </p>
        </div>

        <div className="relative">
          {/* Glow background */}
          <div
            className="absolute -inset-6 rounded-3xl bg-gradient-to-b from-blue-50 to-white"
            aria-hidden="true"
          />

          {/* Board mockup */}
          <div className="relative overflow-x-auto rounded-2xl border border-gray-200 bg-gray-100 p-4 shadow-inner">
            <div className="flex min-w-max gap-3 pb-2">
              {stages.map((stage) => (
                <div key={stage.name} className="w-52 flex-shrink-0">
                  {/* Column header */}
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${stage.dot}`} />
                      <span className="text-xs font-semibold text-gray-700">{stage.name}</span>
                    </div>
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                      {stage.count}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {stage.cards.map((card) => (
                      <div
                        key={card.title}
                        className="cursor-default rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <p className="text-xs font-semibold text-gray-800">{card.title}</p>
                        <p className="mt-1 text-sm font-bold text-blue-600">{card.value}</p>
                        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
                          <span className="text-[10px] text-gray-500">{card.lead}</span>
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-400">
                            {card.deadline}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Add button (decorative) */}
                    <div className="w-full cursor-default rounded-lg border border-dashed border-gray-300 py-2 text-center text-xs text-gray-400">
                      + Novo negócio
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
