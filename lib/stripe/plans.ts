export const FREE_LIMITS = {
  members: 2,
  leads: 50,
} as const

export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? ''

export const PLAN_FEATURES = {
  free: [
    'Até 2 membros',
    'Até 50 leads',
    'Pipeline Kanban',
    'Gestão de atividades',
  ],
  pro: [
    'Membros ilimitados',
    'Leads ilimitados',
    'Pipeline Kanban',
    'Gestão de atividades',
    'Dashboard analytics',
    'Suporte prioritário',
  ],
} as const
