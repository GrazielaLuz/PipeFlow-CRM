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
