import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: 'Entrar — PipeFlow CRM',
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
        <p className="text-sm text-muted-foreground">
          Entre com seu e-mail e senha para acessar o CRM.
        </p>
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <AuthForm mode="login" />
      </div>
    </div>
  )
}
