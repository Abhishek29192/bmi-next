ALTER TYPE public."request_status" ADD VALUE IF NOT EXISTS 'DECLINED';
ALTER TYPE public."request_status" ADD VALUE IF NOT EXISTS 'ISSUED';
ALTER TYPE public."request_status" ADD VALUE IF NOT EXISTS 'EXPIRED';

DROP TABLE IF EXISTS double_acceptance CASCADE;
DROP SEQUENCE IF EXISTS double_acceptance_id_seq;

CREATE SEQUENCE IF NOT EXISTS double_acceptance_id_seq START 1;
CREATE TABLE IF NOT EXISTS double_acceptance (
  id integer NOT NULL DEFAULT nextval('double_acceptance_id_seq'::regclass),
  guarantee_id integer NOT NULL,
  signature text,
  acceptance boolean,
  acceptance_date timestamp,
  temp_token varchar(32) DEFAULT substring(md5(random()::text), 0, 32),
  expiry_date timestamp NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT double_acceptance_pkey PRIMARY KEY (id),
  CONSTRAINT temp_token_key UNIQUE (temp_token)
);

ALTER TABLE double_acceptance
  ADD FOREIGN KEY (guarantee_id) REFERENCES guarantee (id) ON DELETE CASCADE;

CREATE INDEX ON double_acceptance (guarantee_id);

ALTER TABLE double_acceptance OWNER to postgres;

GRANT USAGE, SELECT ON SEQUENCE double_acceptance_id_seq TO super_admin;
GRANT SELECT, INSERT, UPDATE on double_acceptance to super_admin;
GRANT SELECT on double_acceptance to market_admin;
GRANT SELECT on double_acceptance to installer;
GRANT SELECT on double_acceptance to auditor;

ALTER TABLE double_acceptance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS policy_super_admin ON double_acceptance;
CREATE POLICY policy_super_admin ON double_acceptance FOR ALL TO super_admin USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS policy_market_admin ON double_acceptance;
CREATE POLICY policy_market_admin ON double_acceptance FOR SELECT TO market_admin USING (true);

DROP POLICY IF EXISTS policy_company_admin ON double_acceptance;
CREATE POLICY policy_company_admin ON double_acceptance FOR SELECT TO company_admin USING (false);

DROP POLICY IF EXISTS policy_installer ON double_acceptance;
CREATE POLICY policy_installer ON double_acceptance FOR SELECT TO installer USING (true);

DROP POLICY IF EXISTS policy_auditor ON double_acceptance;
CREATE POLICY policy_auditor ON double_acceptance FOR SELECT TO auditor USING (true);
