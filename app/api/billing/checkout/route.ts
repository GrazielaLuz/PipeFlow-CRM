import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe/client'
import { PRO_PRICE_ID } from '@/lib/stripe/plans'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const cookieStore = await cookies()
  const workspaceId = cookieStore.get('pipeflow-workspace-id')?.value

  if (!workspaceId) {
    return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: workspace } = await admin
    .from('workspaces')
    .select('id, name, plan')
    .eq('id', workspaceId)
    .single()

  if (!workspace) {
    return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 404 })
  }

  if (workspace.plan === 'pro') {
    return NextResponse.json({ error: 'Workspace já está no plano Pro' }, { status: 400 })
  }

  const { data: existingSubscription } = await admin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('workspace_id', workspaceId)
    .single()

  let customerId = existingSubscription?.stripe_customer_id

  try {
    if (!customerId) {
      const customer = await stripe().customers.create({
        email: user.email,
        name: workspace.name,
        metadata: { workspace_id: workspaceId },
      })
      customerId = customer.id
    }

    if (!PRO_PRICE_ID) {
      return NextResponse.json({ error: 'STRIPE_PRO_PRICE_ID não configurada' }, { status: 500 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
      success_url: `${appUrl}/settings/billing?success=1`,
      cancel_url: `${appUrl}/settings/billing?canceled=1`,
      metadata: { workspace_id: workspaceId, user_id: user.id },
      subscription_data: {
        metadata: { workspace_id: workspaceId, user_id: user.id },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar sessão de pagamento'
    console.error('[checkout] Stripe error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
