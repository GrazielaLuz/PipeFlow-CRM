import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

async function upsertSubscription(
  workspaceId: string,
  data: {
    stripeCustomerId: string
    stripeSubscriptionId: string | null
    plan: 'free' | 'pro'
    status: 'active' | 'canceled' | 'past_due' | 'trialing'
  }
) {
  const admin = createAdminClient()
  await admin.from('subscriptions').upsert(
    {
      workspace_id: workspaceId,
      stripe_customer_id: data.stripeCustomerId,
      stripe_subscription_id: data.stripeSubscriptionId,
      plan: data.plan,
      status: data.status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'workspace_id' }
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Assinatura ausente' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 })
  }

  const admin = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const workspaceId = session.metadata?.workspace_id
      if (!workspaceId || session.mode !== 'subscription') break

      const subscriptionId = session.subscription as string
      const subscription = await stripe().subscriptions.retrieve(subscriptionId)

      await upsertSubscription(workspaceId, {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscriptionId,
        plan: 'pro',
        status: subscription.status as 'active' | 'past_due' | 'trialing',
      })

      await admin.from('workspaces').update({ plan: 'pro' }).eq('id', workspaceId)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const workspaceId = subscription.metadata?.workspace_id
      if (!workspaceId) break

      // past_due = Stripe ainda vai retentar; só rebaixa em canceled
      const isActive = ['active', 'trialing', 'past_due'].includes(subscription.status)
      const plan = isActive ? 'pro' : 'free'

      await upsertSubscription(workspaceId, {
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        plan,
        status: subscription.status as 'active' | 'canceled' | 'past_due' | 'trialing',
      })

      await admin.from('workspaces').update({ plan }).eq('id', workspaceId)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const workspaceId = subscription.metadata?.workspace_id
      if (!workspaceId) break

      await upsertSubscription(workspaceId, {
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        plan: 'free',
        status: 'canceled',
      })

      await admin.from('workspaces').update({ plan: 'free' }).eq('id', workspaceId)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null }
      const subscriptionId = invoice.subscription ?? null
      if (!subscriptionId) break

      const subscription = await stripe().subscriptions.retrieve(subscriptionId)
      const workspaceId = subscription.metadata?.workspace_id
      if (!workspaceId) break

      await admin
        .from('subscriptions')
        .update({ status: 'past_due', updated_at: new Date().toISOString() })
        .eq('workspace_id', workspaceId)

      // workspace_id e user_id disponíveis via subscription.metadata para futuros e-mails de notificação
      console.warn(`[webhook] invoice.payment_failed — workspace: ${workspaceId}, user: ${subscription.metadata?.user_id}`)
      break
    }
  }

  return NextResponse.json({ received: true })
}
