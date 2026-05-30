CREATE TABLE subscriptions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id            uuid NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_customer_id      text NOT NULL UNIQUE,
  stripe_subscription_id  text UNIQUE,
  plan                    text NOT NULL CHECK (plan IN ('free', 'pro')) DEFAULT 'free',
  status                  text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')) DEFAULT 'active',
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX subscriptions_workspace_id_idx ON subscriptions(workspace_id);
CREATE INDEX subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Membros do workspace podem ler a subscription
CREATE POLICY "workspace members read subscription"
  ON subscriptions
  FOR SELECT
  USING (
    workspace_id IN (SELECT get_my_workspace_ids())
  );

-- Apenas service role pode inserir/atualizar (via webhook)
-- Nenhuma policy de write para anon/authenticated — apenas admin client bypassa
