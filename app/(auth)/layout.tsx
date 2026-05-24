import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Autenticação — PipeFlow CRM',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="flex h-14 items-center px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M3 3h18v4H3z" />
            <path d="M3 11h12v4H3z" />
            <path d="M3 19h6v2H3z" />
          </svg>
          PipeFlow
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PipeFlow CRM
      </footer>
    </div>
  )
}
