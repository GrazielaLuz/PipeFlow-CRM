import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const freeFeatures = [
  { label: 'Até 2 colaboradores', included: true },
  { label: 'Até 50 leads', included: true },
  { label: 'Pipeline Kanban completo', included: true },
  { label: 'Registro de atividades', included: true },
  { label: 'Dashboard de métricas', included: true },
  { label: 'Múltiplos workspaces', included: false },
  { label: 'Convite de time por e-mail', included: false },
  { label: 'Suporte prioritário', included: false },
]

const proFeatures = [
  { label: 'Colaboradores ilimitados', included: true },
  { label: 'Leads ilimitados', included: true },
  { label: 'Pipeline Kanban completo', included: true },
  { label: 'Registro de atividades', included: true },
  { label: 'Dashboard de métricas', included: true },
  { label: 'Múltiplos workspaces', included: true },
  { label: 'Convite de time por e-mail', included: true },
  { label: 'Suporte prioritário', included: true },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Planos simples e transparentes
          </h2>
          <p className="text-lg text-gray-600">
            Comece grátis. Faça upgrade quando precisar crescer.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="mb-1 text-lg font-semibold text-gray-900">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">R$ 0</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Para freelancers e times pequenos começando.
              </p>
            </div>

            <Link
              href="/signup"
              className={cn(buttonVariants({ variant: 'outline' }), 'mb-8 w-full justify-center')}
            >
              Começar grátis
            </Link>

            <ul className="flex-1 space-y-3">
              {freeFeatures.map((f) => (
                <li key={f.label} className="flex items-start gap-3 text-sm">
                  {f.included ? (
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300" />
                  )}
                  <span className={f.included ? 'text-gray-700' : 'text-gray-400'}>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col rounded-2xl border border-blue-600 bg-blue-600 p-8 shadow-xl">
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                Mais popular
              </span>
            </div>

            <div className="mb-6">
              <h3 className="mb-1 text-lg font-semibold text-white">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">R$ 49</span>
                <span className="text-blue-200">/mês</span>
              </div>
              <p className="mt-2 text-sm text-blue-200">
                Para times de vendas que precisam escalar.
              </p>
            </div>

            <Link
              href="/signup"
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                'mb-8 w-full justify-center bg-white text-blue-700 hover:bg-blue-50'
              )}
            >
              Assinar Pro
            </Link>

            <ul className="flex-1 space-y-3">
              {proFeatures.map((f) => (
                <li key={f.label} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-200" />
                  <span className="text-white">{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
