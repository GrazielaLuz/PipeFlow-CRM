import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function Cta() {
  return (
    <section className="bg-blue-600 py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Pronto para organizar suas vendas?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
          Junte-se a times de vendas que já usam o PipeFlow para fechar mais negócios. Grátis para
          começar, sem cartão de crédito.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'lg' }),
              'gap-2 bg-white text-base text-blue-700 hover:bg-blue-50 px-8'
            )}
          >
            Criar conta grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'lg' }),
              'border border-white/30 text-base text-white hover:bg-white/10 hover:text-white px-8'
            )}
          >
            Ver funcionalidades
          </Link>
        </div>
      </div>
    </section>
  )
}
