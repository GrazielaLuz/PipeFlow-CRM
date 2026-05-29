CREATE TABLE invites (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email         text NOT NULL,
  role          text NOT NULL CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  token         text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  accepted_at   timestamptz,
  expires_at    timestamptz NOT NULL DEFAULT now() + interval '7 days',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX invites_workspace_id_idx ON invites(workspace_id);
CREATE INDEX invites_token_idx ON invites(token);

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Admins do workspace podem criar, ler e deletar convites
CREATE POLICY "workspace admins manage invites"
  ON invites
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = invites.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = invites.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = 'admin'
    )
  );
