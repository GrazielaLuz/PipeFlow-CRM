import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CheckCircle, Users, UserCheck } from 'lucide-react'
import { TopBar } from '@/components/shared/top-bar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BillingActions } from '@/components/billing/billing-actions'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { FREE_LIMITS, PLAN_FEATURES } from '@/lib/stripe/plans'
import type { Plan } from '@/types'

export default async function BillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const cookieStore = await cookies()
  const workspaceId = cookieStore.get('pipeflow-workspace-id')?.value
  if (!workspaceId) redirect('/onboarding')

  const admin = createAdminClient()

  const [{ data: workspace }, { count: leadCount }, { count: memberCount }, { data: subscription }] =
    await Promise.all([
      admin.from('workspaces').select('id, name, plan').eq('id', workspaceId).single(),
      admin.from('leads').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
      admin.from('workspace_members').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
      admin.from('subscriptions').select('stripe_customer_id, status').eq('workspace_id', workspaceId).maybeSingle(),
    ])

  if (!workspace) redirect('/dashboard')

  const plan = workspace.plan as Plan
  const leads = leadCount ?? 0
  const members = memberCount ?? 0
  const hasSubscription = !!subscription?.stripe_customer_id

  return (
    <>
      <TopBar title="Plano & Faturamento" />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Plano atual
                  <Badge
                    variant={plan === 'pro' ? 'default' : 'secondary'}
                    className={plan === 'pro' ? 'bg-blue-600' : ''}
                  >
                    {plan === 'pro' ? 'Pro' : 'Free'}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  {plan === 'pro'
                    ? 'Acesso completo a todos os recursos.'
                    : 'Plano gratuito com recursos limitados.'}
                </CardDescription>
              </div>
              <BillingActions plan={plan} hasSubscription={hasSubscription} />
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uso do workspace</CardTitle>
              <CardDescription>Consumo atual em relação aos limites do plano.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <UsageBar
                icon={<UserCheck className="h-4 w-4" />}
                label="Leads"
                current={leads}
                max={plan === 'pro' ? null : FREE_LIMITS.leads}
              />
              <Separator />
              <UsageBar
                icon={<Users className="h-4 w-4" />}
                label="Membros"
                current={members}
                max={plan === 'pro' ? null : FREE_LIMITS.members}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <PlanCard
              title="Free"
              price="R$0"
              features={PLAN_FEATURES.free}
              isCurrent={plan === 'free'}
            />
            <PlanCard
              title="Pro"
              price="R$49/mês"
              features={PLAN_FEATURES.pro}
              isCurrent={plan === 'pro'}
              highlighted
            />
          </div>

        </div>
      </div>
    </>
  )
}

function UsageBar({
  icon,
  label,
  current,
  max,
}: {
  icon: React.ReactNode
  label: string
  current: number
  max: number | null
}) {
  const percentage = max ? Math.min((current / max) * 100, 100) : 0
  const isNearLimit = max ? percentage >= 80 : false
  const isAtLimit = max ? current >= max : false

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium">
          {icon}
          {label}
        </span>
        <span className={isAtLimit ? 'font-semibold text-destructive' : 'text-muted-foreground'}>
          {current}
          {max ? ` / ${max}` : ' / ilimitados'}
        </span>
      </div>
      {max && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${
              isAtLimit ? 'bg-destructive' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-600'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  )
}

function PlanCard({
  title,
  price,
  features,
  isCurrent,
  highlighted,
}: {
  title: string
  price: string
  features: readonly string[]
  isCurrent: boolean
  highlighted?: boolean
}) {
  return (
    <Card className={highlighted ? 'border-blue-600 shadow-sm' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {isCurrent && (
            <Badge variant="outline" className="text-xs">
              Plano atual
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold">{price}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 shrink-0 text-blue-600" />
              {f}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
