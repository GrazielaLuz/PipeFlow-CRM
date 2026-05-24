import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: 'Criar conta — PipeFlow CRM',
}

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta grátis</h1>
        <p className="text-sm text-muted-foreground">
          Comece a gerenciar seus leads e pipeline hoje.
        </p>
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <AuthForm mode="signup" />
      </div>
    </div>
  )
}
