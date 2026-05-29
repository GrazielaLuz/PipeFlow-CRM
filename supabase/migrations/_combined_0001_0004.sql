-- =============================================================
-- PipeFlow CRM — Migrations 0001 a 0004
-- Cole este script no SQL Editor do Supabase Studio e execute.
-- =============================================================

-- Migration: 0001_workspaces
-- Tabelas: workspaces, workspace_members
-- RLS: usuário só acessa workspaces onde é membro

-- Habilitar extensão para UUIDs (já ativa no Supabase por padrão)
-- create extension if not exists "pgcrypto";

create table if not exists workspaces (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  plan       text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now()
);

create table if not exists workspace_members (
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null default 'member' check (role in ('admin', 'member')),
  joined_at    timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

-- Índices
create index if not exists workspace_members_user_id_idx on workspace_members(user_id);

-- RLS
alter table workspaces enable row level security;
alter table workspace_members enable row level security;

-- Políticas para workspaces
create policy "members_can_read_own_workspaces"
  on workspaces for select
  using (
    id in (
      select workspace_id from workspace_members
      where user_id = auth.uid()
    )
  );

create policy "members_can_update_workspace"
  on workspaces for update
  using (
    id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Políticas para workspace_members
create policy "members_can_read_own_membership"
  on workspace_members for select
  using (user_id = auth.uid());

create policy "members_can_read_workspace_members"
  on workspace_members for select
  using (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid()
    )
  );

create policy "admin_can_insert_members"
  on workspace_members for insert
  with check (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "admin_can_delete_members"
  on workspace_members for delete
  using (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Migration: 0002_leads
-- Tabela: leads
-- RLS: leitura e escrita restritas ao workspace do usuário

create table if not exists leads (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name         text not null,
  email        text not null,
  phone        text,
  company      text,
  role         text,
  status       text not null default 'new'
                 check (status in ('new', 'contacted', 'qualified', 'lost', 'won')),
  assignee_id  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Índices
create index if not exists leads_workspace_id_idx  on leads(workspace_id);
create index if not exists leads_status_idx        on leads(workspace_id, status);
create index if not exists leads_assignee_id_idx   on leads(workspace_id, assignee_id);
create index if not exists leads_created_at_idx    on leads(workspace_id, created_at desc);

-- Atualiza updated_at automaticamente
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
  before update on leads
  for each row execute procedure set_updated_at();

-- RLS
alter table leads enable row level security;

create policy "workspace_members_can_read_leads"
  on leads for select
  using (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid()
    )
  );

create policy "workspace_members_can_insert_leads"
  on leads for insert
  with check (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid()
    )
  );

create policy "workspace_members_can_update_leads"
  on leads for update
  using (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid()
    )
  );

create policy "workspace_members_can_delete_leads"
  on leads for delete
  using (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid()
    )
  );

-- Migration: 0003_deals
-- Creates the deals table with RLS policies for workspace isolation

create type deal_stage as enum (
  'prospecting',
  'qualification',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost'
);

create table if not exists deals (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  title         text not null,
  value         numeric(12, 2) not null default 0,
  stage         deal_stage not null default 'prospecting',
  lead_id       uuid references leads(id) on delete set null,
  assignee_id   uuid references auth.users(id) on delete set null,
  deadline      date,
  created_at    timestamptz not null default now()
);

-- Indexes
create index deals_workspace_id_idx  on deals(workspace_id);
create index deals_stage_idx         on deals(workspace_id, stage);
create index deals_assignee_id_idx   on deals(workspace_id, assignee_id);

-- Enable RLS
alter table deals enable row level security;

-- Policy: workspace members can read deals
create policy "workspace members can read deals"
  on deals for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = deals.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

-- Policy: workspace members can insert deals
create policy "workspace members can insert deals"
  on deals for insert
  with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = deals.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

-- Policy: workspace members can update deals
create policy "workspace members can update deals"
  on deals for update
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = deals.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

-- Policy: workspace members can delete deals
create policy "workspace members can delete deals"
  on deals for delete
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = deals.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

-- Migration: 0004_activities
-- Tabela de atividades vinculadas a leads (ligações, e-mails, reuniões, notas)

create table if not exists activities (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  lead_id       uuid not null references leads(id) on delete cascade,
  type          text not null check (type in ('call', 'email', 'meeting', 'note')),
  author_id     uuid not null references auth.users(id) on delete set null,
  description   text not null,
  date          timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

-- Índices para queries frequentes
create index if not exists activities_workspace_id_idx on activities(workspace_id);
create index if not exists activities_lead_id_idx       on activities(lead_id);
create index if not exists activities_author_id_idx     on activities(author_id);
create index if not exists activities_date_idx          on activities(date desc);

-- RLS
alter table activities enable row level security;

-- Membros do workspace podem ler atividades do próprio workspace
create policy "workspace members can read activities"
  on activities for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = activities.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

-- Membros podem criar atividades no próprio workspace
create policy "workspace members can create activities"
  on activities for insert
  with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = activities.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

-- Apenas o autor pode atualizar
create policy "author can update own activity"
  on activities for update
  using (author_id = auth.uid());

-- Apenas o autor pode deletar
create policy "author can delete own activity"
  on activities for delete
  using (author_id = auth.uid());
