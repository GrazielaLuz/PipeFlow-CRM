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
