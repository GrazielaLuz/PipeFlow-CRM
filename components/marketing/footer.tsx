import Link from 'next/link'
import { Zap } from 'lucide-react'

const links = {
  Produto: [
    { label: 'Funcionalidades', href: '#features' },
    { label: 'Preços', href: '#pricing' },
  ],
  Empresa: [
    { label: 'Sobre', href: '#' },
    { label: 'Contato', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">PipeFlow</span>
            </Link>
            <p className="max-w-xs text-sm text-gray-500">
              CRM simples e poderoso para pequenas e médias empresas, freelancers e times de vendas.
            </p>
          </div>

          {/* Nav links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold text-white">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} PipeFlow CRM. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
