'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/settings/workspace', label: 'Workspace' },
  { href: '/settings/billing', label: 'Plano & Faturamento' },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="shrink-0 border-b bg-background px-6 pt-4">
        <h1 className="text-base font-semibold">Configurações</h1>
        <nav className="mt-3 flex gap-1">
          {tabs.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                pathname === href
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
