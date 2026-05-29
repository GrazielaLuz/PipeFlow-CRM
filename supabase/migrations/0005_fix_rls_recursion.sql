-- Migration: 0005_fix_rls_recursion
-- Fix: infinite recursion in workspace_members RLS policies.
--
-- The original "members_can_read_workspace_members" policy queried workspace_members
-- from within a workspace_members policy, causing PostgreSQL to recurse infinitely.
-- Solution: security definer function that bypasses RLS for the membership check.

-- Drop recursive policies
drop policy if exists "members_can_read_workspace_members" on workspace_members;
drop policy if exists "members_can_read_own_workspaces" on workspaces;

-- Security definer function: returns workspace IDs the current user belongs to.
-- SECURITY DEFINER bypasses RLS on workspace_members, breaking the recursion.
create or replace function public.get_my_workspace_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select workspace_id from public.workspace_members where user_id = auth.uid()
$$;

-- Re-create workspaces read policy using the function (no recursion)
create policy "members_can_read_own_workspaces"
  on workspaces for select
  using (id = any(select public.get_my_workspace_ids()));

-- Re-create workspace_members read policy using the function (no recursion)
create policy "members_can_read_workspace_members"
  on workspace_members for select
  using (workspace_id = any(select public.get_my_workspace_ids()));
