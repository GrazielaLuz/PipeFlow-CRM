'use client'

// TODO M10: implement with real subscription data from Supabase
import { useState } from 'react'
import { FREE_LIMITS } from '@/lib/stripe/plans'
import type { Plan } from '@/types'

interface SubscriptionState {
  plan: Plan
  leadCount: number
  memberCount: number
  isAtLeadLimit: boolean
  isAtMemberLimit: boolean
}

export function useSubscription(): SubscriptionState {
  const [state] = useState<SubscriptionState>({
    plan: 'free',
    leadCount: 0,
    memberCount: 1,
    isAtLeadLimit: false,
    isAtMemberLimit: false,
  })

  return {
    ...state,
    isAtLeadLimit: state.plan === 'free' && state.leadCount >= FREE_LIMITS.leads,
    isAtMemberLimit: state.plan === 'free' && state.memberCount >= FREE_LIMITS.members,
  }
}
