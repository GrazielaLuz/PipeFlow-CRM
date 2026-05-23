# PipeFlow CRM — Project Briefing for Claude Code

> SaaS CRM para pequenas e médias empresas, freelancers e times de vendas.
> Pipeline Kanban, gestão de leads, multi-empresa, monetização via Stripe.

Full PRD: [docs/PRD.md](docs/PRD.md)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 — App Router (RSC first) |
| UI | React 18 + Tailwind CSS + shadcn/ui |
| Language | TypeScript 5 (strict mode) |
| Database + Auth | Supabase — PostgreSQL + RLS + Auth |
| Payments | Stripe — Checkout + Webhooks + Customer Portal |
| Email | Resend |
| Drag-and-drop | @dnd-kit/core + @dnd-kit/sortable |
| Charts | Recharts |
| Deploy | Vercel (App Router preset) |

---

## Folder Structure

```
pipeflow-crm/
├── app/
│   ├── (marketing)/          # Public routes: landing page
│   │   └── page.tsx
│   ├── (auth)/               # Login, signup, invite accept
│   │   ├── login/
│   │   ├── signup/
│   │   └── invite/[token]/
│   ├── (app)/                # Protected: CRM shell (requires auth + workspace)
│   │   ├── layout.tsx        # Sidebar + workspace switcher
│   │   ├── dashboard/
│   │   ├── leads/
│   │   │   ├── page.tsx      # List with search + filters
│   │   │   └── [id]/page.tsx # Lead detail + activity timeline
│   │   ├── pipeline/
│   │   ├── activities/
│   │   └── settings/
│   │       ├── workspace/
│   │       └── billing/
│   └── api/
│       ├── webhooks/
│       │   └── stripe/route.ts
│       └── invites/route.ts
├── components/
│   ├── ui/                   # shadcn/ui primitives (do not edit manually)
│   ├── kanban/               # Board, Column, DealCard, DragOverlay
│   ├── leads/                # LeadTable, LeadForm, ActivityTimeline
│   ├── dashboard/            # MetricCard, FunnelChart, DeadlineList
│   └── shared/               # WorkspaceSwitcher, UserMenu, Sidebar
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser client (createBrowserClient)
│   │   ├── server.ts         # Server client (createServerClient + cookies)
│   │   └── middleware.ts     # Session refresh helper
│   ├── stripe/
│   │   ├── client.ts
│   │   └── plans.ts          # FREE / PRO limits + price IDs
│   └── resend/
│       └── emails.ts         # invite-email, welcome-email templates
├── types/
│   └── index.ts              # Workspace, Lead, Deal, Activity, Member, Subscription
├── hooks/
│   ├── use-workspace.ts      # Active workspace context
│   └── use-subscription.ts   # Plan + limits check
├── docs/
│   └── PRD.md
├── supabase/
│   └── migrations/           # SQL migration files (numbered)
├── middleware.ts              # Supabase session + route protection
└── CLAUDE.md
```

---

## Naming Conventions

- **Files/folders**: `kebab-case` (routes, components, utilities)
- **React components**: `PascalCase`
- **Functions/variables**: `camelCase`
- **DB tables/columns**: `snake_case` (Postgres convention)
- **Env vars**: `NEXT_PUBLIC_*` for client-safe values; no prefix for server-only

---

## Data Model (key tables)

```sql
workspaces        (id, name, slug, plan: free|pro, created_at)
workspace_members (workspace_id, user_id, role: admin|member)
leads             (id, workspace_id, name, email, phone, company, role, status, assignee_id, created_at)
deals             (id, workspace_id, title, value, stage, lead_id, assignee_id, deadline, created_at)
activities        (id, workspace_id, lead_id, type: call|email|meeting|note, author_id, description, date)
subscriptions     (id, workspace_id, stripe_customer_id, stripe_subscription_id, plan, status)
invites           (id, workspace_id, email, role, token, accepted_at, expires_at)
```

All tables have RLS policies enforcing `workspace_id` isolation.

---

## Business Rules

- **Free plan**: ≤ 2 workspace members, ≤ 50 leads
- **Pro plan**: unlimited members + leads (R$49/month)
- Stripe webhook at `/api/webhooks/stripe` activates/cancels Pro
- A user can belong to multiple workspaces; active workspace stored in cookie/context
- Invite flow: Admin sends email via Resend → unique token link → user accepts → joins workspace

---

## Key Patterns

### Server vs Client Components
- Default to **Server Components** for data fetching (no `"use client"`)
- Add `"use client"` only when you need hooks, event listeners, or browser APIs
- Pass serialisable props from Server → Client; never pass Supabase client instances

### Supabase Auth + RLS
- Use `createServerClient` (from `@supabase/ssr`) in Server Components, Route Handlers, and Middleware
- Use `createBrowserClient` in Client Components
- Every DB query is automatically scoped by RLS — never add manual `where workspace_id = ?` in app code unless bypassing RLS intentionally

### Stripe Integration
- Checkout Session created server-side in a Route Handler
- Webhook signature verified with `stripe.webhooks.constructEvent`
- `subscriptions` table updated on `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### Kanban Drag-and-Drop
- `@dnd-kit` for drag interactions (accessible, touch-friendly)
- Optimistic UI update on drop → server mutation to persist new `stage` in `deals`
- Rollback on error

### Plan Enforcement
- `use-subscription` hook (client) + server-side check in Route Handlers
- Hard block on lead creation when Free limit (50) is reached
- Show upgrade prompt via `shadcn/ui` Dialog

---

## Visual Identity

- **Inspiration**: HubSpot CRM + Pipedrive
- **Base**: shadcn/ui neutral palette
- **Primary**: Blue (`blue-600` / `#2563EB`) — trust, professionalism
- **Typography**: Inter (next/font/google)
- **Radius**: `rounded-lg` (8px) — modern but not bubbly
- **Tone**: clean, data-dense, no decorative noise
- **Dark mode**: optional (shadcn/ui class-based)

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Development Workflow

1. Each feature maps to a milestone in [docs/PRD.md](docs/PRD.md)
2. Write Supabase migration before writing app code
3. Test RLS policies in Supabase Studio before wiring UI
4. Use `npx shadcn@latest add <component>` — never hand-write primitives in `components/ui/`
5. Run `next build` locally before pushing to Vercel
