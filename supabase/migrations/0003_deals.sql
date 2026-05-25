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
