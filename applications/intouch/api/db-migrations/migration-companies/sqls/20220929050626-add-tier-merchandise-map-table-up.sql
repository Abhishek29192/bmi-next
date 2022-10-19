DROP TABLE IF EXISTS merchandise_tier CASCADE;
DROP SEQUENCE IF EXISTS merchandise_tier_id_seq;

CREATE SEQUENCE IF NOT EXISTS merchandise_tier_id_seq START 1;
CREATE TABLE IF NOT EXISTS public.merchandise_tier
(
  id integer NOT NULL DEFAULT nextval('merchandise_tier_id_seq'::regclass),
  market_id integer NOT NULL,
  tier_code tier NOT NULL,
  merchandise_division_id integer,
  CONSTRAINT merchandise_tier_pkey PRIMARY KEY (id),
  CONSTRAINT merchandise_tier_market_id_tier_code_key UNIQUE (market_id, tier_code)
);

ALTER TABLE merchandise_tier OWNER to postgres;

grant usage, select ON SEQUENCE merchandise_tier_id_seq TO super_admin;
grant select, update, insert, delete on merchandise_tier to super_admin;
grant select on merchandise_tier to market_admin;
grant select on merchandise_tier to company_admin;
grant select on merchandise_tier to installer;
grant select on merchandise_tier to auditor;

ALTER TABLE merchandise_tier ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS policy_super_admin ON merchandise_tier;
CREATE POLICY policy_super_admin ON merchandise_tier FOR ALL TO super_admin USING (true);

DROP POLICY IF EXISTS policy_market_admin ON merchandise_tier;
CREATE POLICY policy_market_admin ON merchandise_tier FOR SELECT TO market_admin USING (current_market() = market_id);

DROP POLICY IF EXISTS policy_company_admin ON merchandise_tier;
CREATE POLICY policy_company_admin ON merchandise_tier FOR SELECT TO company_admin USING (current_market() = market_id);

DROP POLICY IF EXISTS policy_installer ON merchandise_tier;
CREATE POLICY policy_installer ON merchandise_tier FOR SELECT TO installer USING (current_market() = market_id);

DROP POLICY IF EXISTS policy_auditor ON merchandise_tier;
CREATE POLICY policy_auditor ON merchandise_tier FOR SELECT TO auditor USING (current_market() = market_id);
