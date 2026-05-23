export type Plan = 'free' | 'pro'

export type WorkspaceMemberRole = 'admin' | 'member'

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'won'

export type DealStage =
  | 'prospecting'
  | 'qualification'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'

export type ActivityType = 'call' | 'email' | 'meeting' | 'note'

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'

export interface Workspace {
  id: string
  name: string
  slug: string
  plan: Plan
  created_at: string
}

export interface Member {
  workspace_id: string
  user_id: string
  role: WorkspaceMemberRole
  user?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
}

export interface Lead {
  id: string
  workspace_id: string
  name: string
  email: string
  phone?: string
  company?: string
  role?: string
  status: LeadStatus
  assignee_id?: string
  created_at: string
  assignee?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
}

export interface Deal {
  id: string
  workspace_id: string
  title: string
  value: number
  stage: DealStage
  lead_id?: string
  assignee_id?: string
  deadline?: string
  created_at: string
  lead?: Pick<Lead, 'id' | 'name' | 'company'>
  assignee?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
}

export interface Activity {
  id: string
  workspace_id: string
  lead_id: string
  type: ActivityType
  author_id: string
  description: string
  date: string
  author?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
}

export interface Subscription {
  id: string
  workspace_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  plan: Plan
  status: SubscriptionStatus
}

export interface Invite {
  id: string
  workspace_id: string
  email: string
  role: WorkspaceMemberRole
  token: string
  accepted_at?: string
  expires_at: string
}
