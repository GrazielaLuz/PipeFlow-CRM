# PipeFlow CRM — Plano de Execução

> Estratégia: **interface primeiro, backend depois.**
> Cada milestone entrega uma fatia vertical completa e testável: UI estática → conectada ao Supabase → regras de negócio aplicadas.
> Avance para o próximo milestone apenas após validar o atual no browser.

---

## Visão Geral dos Milestones

| # | Milestone | Branch | Foco |
|---|---|---|---|
| ~~M01~~ | ~~Fundação & Design System~~ | ~~`feat/foundation`~~ | ✅ Scaffold, layout, componentes base |
| ~~M02~~ | ~~Landing Page~~ | ~~`feat/landing-page`~~ | ✅ Página pública de marketing |
| ~~M03~~ | ~~Autenticação~~ | ~~`feat/auth`~~ | ✅ Login, signup, sessão, middleware |
| ~~M04~~ | ~~Onboarding~~ | ~~`feat/onboarding`~~ | ✅ Criação de workspace + primeiro lead |
| ~~M05~~ | ~~Gestão de Leads~~ | ~~`feat/leads`~~ | ✅ CRUD completo de leads |
| ~~M06~~ | ~~Pipeline Kanban~~ | ~~`feat/pipeline`~~ | ✅ Kanban com drag-and-drop |
| ~~M07~~ | ~~Atividades~~ | ~~`feat/activities`~~ | ✅ Timeline de atividades por lead |
| ~~M08~~ | ~~Dashboard~~ | ~~`feat/dashboard`~~ | ✅ Métricas, gráfico de funil |
| M09 | Multi-empresa | `feat/multi-workspace` | Workspaces, convites, permissões |
| M10 | Monetização | `feat/billing` | Stripe, planos, upgrade/downgrade |
| M11 | Deploy & Polish | `feat/deploy` | Vercel, performance, acessibilidade |

---

## M01 — Fundação & Design System

**Branch:** `feat/foundation`
**Objetivo:** Criar o scaffold do projeto com Next.js, Tailwind, shadcn/ui e o layout base do CRM (sidebar + shell). Nenhum dado real — tudo com mocks estáticos. Ao final, o layout navegável deve estar funcionando no browser.

### Entregas

**Setup do projeto**
- [ ] `npx create-next-app@latest pipeflow-crm` com TypeScript, Tailwind, App Router
- [ ] Configurar `tsconfig.json` em strict mode + path aliases (`@/`)
- [ ] Instalar e inicializar shadcn/ui (`npx shadcn@latest init`)
- [ ] Adicionar componentes base: `button`, `input`, `label`, `card`, `badge`, `avatar`, `dropdown-menu`, `dialog`, `sheet`, `separator`, `tooltip`, `skeleton`
- [ ] Configurar fonte Inter via `next/font/google`
- [ ] Definir CSS variables de brand (azul `blue-600` como primary) em `globals.css`
- [ ] Criar `types/index.ts` com interfaces: `Workspace`, `Lead`, `Deal`, `Activity`, `Member`, `Subscription`

**Layout base do CRM (mock estático)**
- [ ] `app/(app)/layout.tsx` — shell com sidebar fixa e área de conteúdo
- [ ] `components/shared/sidebar.tsx` — nav links: Dashboard, Leads, Pipeline, Atividades, Configurações
- [ ] `components/shared/workspace-switcher.tsx` — dropdown com workspace ativo (mock)
- [ ] `components/shared/user-menu.tsx` — avatar + dropdown com "Perfil" e "Sair"
- [ ] `components/shared/top-bar.tsx` — barra superior com título da página + ações contextuais
- [ ] Rotas stub (páginas vazias com `<h1>`): `/dashboard`, `/leads`, `/pipeline`, `/activities`, `/settings`

**Estrutura de pastas**
- [ ] Criar estrutura completa de pastas conforme `CLAUDE.md` (vazia, mas com `.gitkeep` onde necessário)
- [ ] `lib/supabase/client.ts`, `lib/supabase/server.ts` — stubs comentados
- [ ] `.env.local.example` com todas as variáveis do `CLAUDE.md`

**Commit final:** `feat: foundation — Next.js scaffold, design system, CRM shell layout`

---

## M02 — Landing Page

**Branch:** `feat/landing-page`
**Objetivo:** Página pública de marketing que apresenta o produto, funcionalidades e planos. 100% estática (sem dados do banco). Deve ser visualmente polida e responsiva.

### Entregas

**Estrutura**
- [ ] `app/(marketing)/page.tsx` — página raiz pública
- [ ] `app/(marketing)/layout.tsx` — layout sem sidebar (navbar + footer)
- [ ] `components/marketing/navbar.tsx` — logo + links + botão "Entrar" / "Começar grátis"

**Seções da landing**
- [ ] `components/marketing/hero.tsx` — headline, subheadline, CTA primário + screenshot/mockup do app
- [ ] `components/marketing/features.tsx` — grid de 6 funcionalidades com ícones (Lucide)
- [ ] `components/marketing/pipeline-preview.tsx` — preview visual do Kanban (mockup estático)
- [ ] `components/marketing/pricing.tsx` — cards Free vs Pro com comparativo de features e botão de upgrade
- [ ] `components/marketing/cta.tsx` — seção final de conversão
- [ ] `components/marketing/footer.tsx` — links e copyright

**Qualidade**
- [ ] Responsivo (mobile-first) em todas as seções
- [ ] Animações sutis de entrada com Tailwind (`animate-fade-in` ou similar)
- [ ] Meta tags em `app/(marketing)/layout.tsx` (title, description, og:image)

**Commit final:** `feat: landing page — hero, features, pricing, CTA sections`

---

## M03 — Autenticação

**Branch:** `feat/auth`
**Objetivo:** Login e signup funcionais com Supabase Auth. Middleware protegendo as rotas do CRM. Sessão persistida. Ao final, o fluxo completo login → app deve funcionar.

### Entregas

**Supabase**
- [ ] Criar projeto no Supabase e configurar `.env.local` com as chaves reais
- [ ] `lib/supabase/client.ts` — `createBrowserClient` do `@supabase/ssr`
- [ ] `lib/supabase/server.ts` — `createServerClient` com cookie helpers
- [ ] `middleware.ts` — refresh de sessão + redirect: `/login` se não autenticado em rotas `(app)/*`

**Páginas de autenticação**
- [ ] `app/(auth)/login/page.tsx` — formulário e-mail + senha + link para signup
- [ ] `app/(auth)/signup/page.tsx` — formulário nome + e-mail + senha
- [ ] `app/(auth)/callback/route.ts` — handler do Supabase Auth (OAuth + magic link)
- [ ] `components/auth/auth-form.tsx` — componente reutilizável de formulário

**Fluxo pós-login**
- [ ] Redirect para `/onboarding` se usuário não tem workspace
- [ ] Redirect para `/dashboard` se usuário já tem workspace ativo
- [ ] Botão "Sair" no `UserMenu` chama `supabase.auth.signOut()` + redirect para `/login`

**Commit final:** `feat: auth — Supabase login/signup, session middleware, route protection`

---

## M04 — Onboarding

**Branch:** `feat/onboarding`
**Objetivo:** Fluxo guiado para novos usuários: criar workspace → personalizar → criar primeiro lead. Ao final, usuário novo já entra no CRM com contexto mínimo configurado.

### Entregas

**Banco de dados**
- [x] Migration `0001_workspaces.sql` — tabelas `workspaces` e `workspace_members` com RLS básico
- [x] RLS policy: usuário só vê workspaces onde é membro

**UI do onboarding**
- [x] `app/(auth)/onboarding/page.tsx` — wizard de 3 passos
- [x] Passo 1 — "Crie seu workspace": campo nome da empresa + slug gerado automaticamente
- [x] Passo 2 — "Convide seu time" (opcional, pode pular): campo de e-mail + papel
- [x] Passo 3 — "Crie seu primeiro lead": formulário simplificado (nome + e-mail)
- [x] `components/onboarding/stepper.tsx` — indicador visual de progresso (Step 1 / 2 / 3)
- [x] `components/onboarding/workspace-form.tsx`
- [x] `components/onboarding/invite-form.tsx`

**Lógica**
- [ ] Server Action para criar workspace + inserir usuário como `admin` em `workspace_members` *(pendente — conexão com banco)*
- [ ] Armazenar `workspace_id` ativo em cookie após criação *(pendente — conexão com banco)*
- [ ] Middleware lê cookie `workspace_id` e injeta no contexto da sessão *(pendente — conexão com banco)*

**Commit final:** `feat: onboarding — wizard 3 passos, migration workspaces (stub UI, sem banco)` ✅ mergeado em main via PR #4

---

## M05 — Gestão de Leads

**Branch:** `feat/leads`
**Objetivo:** CRUD completo de leads com listagem paginada, busca, filtros e página de detalhe. Interface primeiro (dados mockados) → conectar ao Supabase → aplicar RLS.

### Entregas

**Banco de dados**
- [ ] Migration `0002_leads.sql` — tabela `leads` com RLS (leitura/escrita restrita ao workspace)
- [ ] Índices em `workspace_id`, `status`, `assignee_id`

**Listagem de leads**
- [ ] `app/(app)/leads/page.tsx` — Server Component com query dos leads do workspace
- [ ] `components/leads/lead-table.tsx` — tabela com colunas: nome, empresa, status, responsável, criado em
- [ ] `components/leads/lead-filters.tsx` — filtros por status, responsável, período (Client Component)
- [ ] `components/leads/lead-search.tsx` — busca por nome/e-mail com debounce
- [ ] Paginação (cursor-based ou offset) com `skeleton` durante loading

**Cadastro e edição**
- [ ] `components/leads/lead-form.tsx` — formulário com campos: nome, e-mail, telefone, empresa, cargo, status, responsável
- [ ] Dialog de criação de lead (botão "+ Novo Lead" na top bar)
- [ ] Dialog de edição ao clicar no lead na tabela
- [ ] Server Actions para `createLead`, `updateLead`, `deleteLead`
- [ ] Validação com `zod` no Server Action

**Página de detalhe**
- [ ] `app/(app)/leads/[id]/page.tsx` — perfil completo do lead
- [ ] `components/leads/lead-profile.tsx` — card com todos os campos + botão editar
- [ ] Placeholder para timeline de atividades (implementada no M07)
- [ ] Placeholder para negócios vinculados (implementado no M06)

**Commit final:** `feat: leads — CRUD completo, listagem com filtros, página de detalhe`

---

## M06 — Pipeline Kanban

**Branch:** `feat/pipeline`
**Objetivo:** Board Kanban com as 6 etapas de venda, drag-and-drop funcional e persistência no banco. Interface primeiro com mocks → conectar ao Supabase.

### Entregas

**Banco de dados**
- [x] Migration `0003_deals.sql` — tabela `deals` com RLS
- [x] Índices em `workspace_id`, `stage`, `assignee_id`

**Board Kanban**
- [x] `app/(app)/pipeline/page.tsx` — Server Component que carrega deals agrupados por stage
- [x] `components/kanban/board.tsx` — DndContext + SortableContext do @dnd-kit (Client Component)
- [x] `components/kanban/column.tsx` — coluna por etapa com header (nome + total de valor) + lista de cards
- [x] `components/kanban/deal-card.tsx` — card com: título, valor (R$), nome do lead, avatar do responsável, badge de prazo

**Lógica de drag-and-drop**
- [x] `onDragEnd` aplica update otimista imediato na UI
- [x] Server Action `updateDealStage(dealId, newStage)` persiste no banco
- [x] Rollback do estado local em caso de erro do servidor

**CRUD de negócios**
- [x] `components/kanban/deal-form.tsx` — formulário: título, valor, lead vinculado, responsável, prazo
- [x] Botão "+ Negócio" em cada coluna abre Dialog de criação
- [x] Click no card abre Sheet com detalhe + edição
- [x] Server Actions: `createDeal`, `updateDeal`, `deleteDeal`

**Commit final:** `feat: pipeline — Kanban board, drag-and-drop, deal CRUD` ✅ mergeado em main via PR #6

---

## M07 — Atividades

**Branch:** `feat/activities`
**Objetivo:** Registro de atividades (ligação, e-mail, reunião, nota) vinculadas a leads, com timeline cronológica na página de detalhe.

### Entregas

**Banco de dados**
- [x] Migration `0004_activities.sql` — tabela `activities` com RLS

**Timeline na página do lead**
- [x] `components/leads/activity-timeline.tsx` — lista cronológica de atividades com ícone por tipo
- [x] Integrar timeline em `app/(app)/leads/[id]/page.tsx`

**Registro de atividade**
- [x] `components/leads/activity-form.tsx` — formulário com: tipo (select), descrição (textarea), data
- [x] Botão "+ Registrar Atividade" na página de detalhe do lead
- [x] Server Action `createActivity` com validação zod
- [x] Revalidação da página após criação (`revalidatePath`)

**Página global de atividades**
- [x] `app/(app)/activities/page.tsx` — feed de todas as atividades do workspace (ordenadas por data)
- [x] Filtro por tipo e por lead
- [x] `components/activities/activity-feed.tsx`

**Commit final:** `feat: activities — activity timeline, registration form, global feed` ✅ mergeado em main via PR #7

---

## M08 — Dashboard

**Branch:** `feat/dashboard`
**Objetivo:** Dashboard com métricas de vendas em tempo real, gráfico de funil e lista de negócios com prazo próximo.

### Entregas

**Banco de dados**
- [ ] Views ou queries agregadas para métricas (sem migration nova — usa tabelas existentes)

**Metric cards**
- [ ] `components/dashboard/metric-card.tsx` — card genérico: label, valor, variação percentual, ícone
- [ ] Cards: Total de Leads, Negócios Abertos, Valor Total do Pipeline, Taxa de Conversão
- [ ] Dados carregados em paralelo com `Promise.all` no Server Component

**Gráfico de funil**
- [ ] `components/dashboard/funnel-chart.tsx` — gráfico de barras horizontal com Recharts (Client Component)
- [ ] Dados: contagem de deals por etapa do pipeline
- [ ] Tooltip com valor e quantidade

**Lista de prazos**
- [ ] `components/dashboard/deadline-list.tsx` — negócios do usuário logado com prazo nos próximos 7 dias
- [ ] Badge de urgência (vermelho = vencido, amarelo = hoje, verde = futuro)

**Layout do dashboard**
- [ ] `app/(app)/dashboard/page.tsx` — grid: 4 metric cards + funnel chart + deadline list
- [ ] Skeleton loading para cada seção independente

**Commit final:** `feat: dashboard — metric cards, funnel chart, deadline list` ✅ mergeado em main via PR #8

---

## M09 — Multi-empresa

**Branch:** `feat/multi-workspace`
**Objetivo:** Sistema completo de workspaces: criação, convite de membros por e-mail, alternância entre workspaces, papéis Admin/Membro, RLS completo em todas as tabelas.

### Entregas

**Banco de dados**
- [ ] Migration `0005_rls_complete.sql` — revisar e completar RLS em todas as tabelas com `workspace_id`
- [ ] Migration `0006_invites.sql` — tabela `invites` com token único e expiração
- [ ] Policy: Admin pode inserir/deletar membros; Membro só lê

**Convite de colaboradores**
- [ ] `app/api/invites/route.ts` — POST gera token + envia e-mail via Resend
- [ ] `lib/resend/emails.ts` — template de e-mail de convite
- [ ] `app/(auth)/invite/[token]/page.tsx` — página de aceite do convite
- [ ] Server Action para validar token + adicionar usuário ao workspace

**Gerenciamento de membros**
- [ ] `app/(app)/settings/workspace/page.tsx` — lista de membros com papel e opção de remover
- [ ] `components/settings/member-list.tsx`
- [ ] `components/settings/invite-member-form.tsx` — campo e-mail + select de papel
- [ ] Bloqueio Free plan: botão de convite desabilitado com tooltip de upgrade quando ≥ 2 membros

**Alternância de workspace**
- [ ] `WorkspaceSwitcher` totalmente funcional — lista workspaces do usuário, troca o cookie e recarrega
- [ ] `hooks/use-workspace.ts` — hook de contexto com workspace ativo
- [ ] Botão "Criar novo workspace" no switcher

**Commit final:** `feat: multi-workspace — invites, member management, workspace switching, RLS`

---

## M10 — Monetização

**Branch:** `feat/billing`
**Objetivo:** Integração completa com Stripe: planos Free/Pro, checkout, webhook, Customer Portal e bloqueio de limites do Free plan.

### Entregas

**Banco de dados**
- [ ] Migration `0007_subscriptions.sql` — tabela `subscriptions` com RLS

**Stripe setup**
- [ ] `lib/stripe/client.ts` — instância do Stripe SDK com chave secreta
- [ ] `lib/stripe/plans.ts` — constantes: `FREE_LIMITS`, `PRO_PRICE_ID`, `PLAN_FEATURES`
- [ ] Criar produto e preço no Stripe Dashboard (R$49/mês)

**Checkout**
- [ ] `app/api/billing/checkout/route.ts` — cria Stripe Checkout Session + redirect
- [ ] `app/api/billing/portal/route.ts` — cria Customer Portal Session + redirect
- [ ] `app/(app)/settings/billing/page.tsx` — exibe plano atual, uso (leads/membros), botão upgrade/gerenciar

**Webhook**
- [ ] `app/api/webhooks/stripe/route.ts` — valida assinatura + processa eventos:
  - `checkout.session.completed` → ativa Pro
  - `customer.subscription.updated` → atualiza status
  - `customer.subscription.deleted` → downgrade para Free

**Enforcement de limites**
- [ ] `hooks/use-subscription.ts` — retorna plano atual + uso + limites
- [ ] Server Actions de `createLead` e `inviteMember` verificam limites antes de inserir
- [ ] `components/shared/upgrade-dialog.tsx` — dialog de upgrade com CTA para checkout
- [ ] Exibir banner de limite atingido na listagem de leads e no settings de membros

**Commit final:** `feat: billing — Stripe checkout, webhook, plan enforcement, customer portal`

---

## M11 — Deploy & Polish

**Branch:** `feat/deploy`
**Objetivo:** Deploy em produção na Vercel + Supabase com domínio configurado, performance otimizada e acessibilidade verificada.

### Entregas

**Deploy**
- [ ] Criar projeto na Vercel e conectar ao repositório GitHub
- [ ] Configurar todas as env vars na Vercel (Supabase, Stripe, Resend, App URL)
- [ ] Configurar domínio customizado (se houver)
- [ ] Verificar build sem erros (`next build`)
- [ ] Testar webhook do Stripe com URL de produção

**Performance**
- [ ] Auditar com Lighthouse: target ≥ 90 em Performance e Accessibility
- [ ] Verificar bundle size: `@next/bundle-analyzer`
- [ ] Lazy load do Board Kanban e Recharts (dynamic imports)
- [ ] Adicionar `loading.tsx` em todas as rotas do `(app)/`
- [ ] Adicionar `error.tsx` em todas as rotas do `(app)/`

**Acessibilidade**
- [ ] Verificar contraste de cores (WCAG AA)
- [ ] Navegação por teclado no Kanban e nos formulários
- [ ] Labels acessíveis em todos os campos de formulário
- [ ] `aria-live` para notificações de ação (toast)

**Segurança**
- [ ] Confirmar que nenhuma `SUPABASE_SERVICE_ROLE_KEY` é exposta no client bundle
- [ ] Headers de segurança em `next.config.ts` (CSP, X-Frame-Options)
- [ ] Rate limiting no endpoint de convite por e-mail

**Polish final**
- [ ] Toast notifications para todas as ações CRUD (usando `sonner` ou `shadcn/ui toast`)
- [ ] Estado vazio (empty state) em todas as listagens: leads, pipeline, atividades
- [ ] Confirmação de deleção com Dialog em todos os deletes destrutivos
- [ ] Responsividade mobile verificada em todas as páginas do app

**Commit final:** `feat: deploy — production config, performance, accessibility, polish`

---

## Fluxo de Branches

```
main
 └── feat/foundation       → merge → main
      └── feat/landing-page → merge → main
           └── feat/auth         → merge → main
                └── feat/onboarding    → merge → main
                     └── feat/leads         → merge → main
                          └── feat/pipeline       → merge → main
                               └── feat/activities      → merge → main
                                    └── feat/dashboard        → merge → main
                                         └── feat/multi-workspace   → merge → main
                                              └── feat/billing            → merge → main
                                                   └── feat/deploy              → merge → main
```

Cada branch é criada a partir da `main` atualizada. Merge via PR com revisão antes de avançar.

---

## Checklist de Validação por Milestone

Antes de mergear cada milestone, verificar:

- [ ] `next build` passa sem erros de tipo ou build
- [ ] Fluxo principal da feature funciona no browser (não só no código)
- [ ] Nenhuma variável de ambiente hardcoded no código
- [ ] RLS testado no Supabase Studio (usuário A não vê dados do usuário B)
- [ ] Loading states e empty states implementados
- [ ] Sem `console.log` esquecidos

---

> **Referências:** [CLAUDE.md](../CLAUDE.md) · [PRD.md](./PRD.md)
