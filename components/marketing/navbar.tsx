'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">PipeFlow</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Funcionalidades
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Preços
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: 'ghost' }))}
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              Começar grátis
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="space-y-1 border-t border-gray-200 py-4 md:hidden">
            <Link
              href="#features"
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              Funcionalidades
            </Link>
            <Link
              href="#pricing"
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              Preços
            </Link>
            <div className="flex flex-col gap-2 pt-3">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-center')}
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants({ variant: 'default' }), 'w-full justify-center')}
              >
                Começar grátis
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
