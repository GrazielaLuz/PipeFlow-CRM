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
