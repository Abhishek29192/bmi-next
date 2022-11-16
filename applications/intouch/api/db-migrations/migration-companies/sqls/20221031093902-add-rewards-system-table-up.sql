-- Create reward_tier table
DROP TABLE IF EXISTS reward_tier CASCADE;
DROP SEQUENCE IF EXISTS reward_tier_id_seq;

CREATE SEQUENCE IF NOT EXISTS reward_tier_id_seq START 1;
CREATE TABLE IF NOT EXISTS reward_tier (
  id integer NOT NULL DEFAULT nextval('reward_tier_id_seq'::regclass),
  market_id integer NOT NULL,
  tier_code tier NOT NULL,
  reward_category text NOT NULL,
  reward_point integer NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT reward_tier_pkey PRIMARY KEY (id),
  CONSTRAINT reward_tier_tier_market_id_code_reward_category_key UNIQUE (market_id, tier_code, reward_category)
);

ALTER TABLE reward_tier OWNER to postgres;
ALTER TABLE reward_tier ADD FOREIGN KEY (market_id) REFERENCES market (id) ON DELETE CASCADE;
CREATE INDEX ON reward_tier (market_id);
CREATE INDEX ON reward_tier (tier_code);
CREATE INDEX ON reward_tier (reward_category);

GRANT USAGE, SELECT ON SEQUENCE reward_tier_id_seq TO super_admin;
GRANT USAGE, SELECT ON SEQUENCE reward_tier_id_seq TO market_admin;
GRANT SELECT, INSERT, UPDATE on reward_tier to super_admin;
GRANT SELECT, INSERT on reward_tier to market_admin;
GRANT SELECT on reward_tier to company_admin;
GRANT SELECT on reward_tier to installer;
GRANT SELECT on reward_tier to auditor;

ALTER TABLE reward_tier ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS policy_super_admin ON reward_tier;
CREATE POLICY policy_super_admin ON reward_tier FOR ALL TO super_admin USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS policy_market_admin ON reward_tier;
CREATE POLICY policy_market_admin ON reward_tier FOR ALL TO market_admin USING (current_market() = market_id);

DROP POLICY IF EXISTS policy_company_admin ON reward_tier;
CREATE POLICY policy_company_admin ON reward_tier FOR SELECT TO company_admin USING (current_market() = market_id);

DROP POLICY IF EXISTS policy_installer ON reward_tier;
CREATE POLICY policy_installer ON reward_tier FOR SELECT TO installer USING (current_market() = market_id);

DROP POLICY IF EXISTS policy_auditor ON reward_tier;
CREATE POLICY policy_auditor ON reward_tier FOR SELECT TO auditor USING (current_market() = market_id);

-- Create reward_record table
DROP TABLE IF EXISTS reward_record CASCADE;
DROP SEQUENCE IF EXISTS reward_record_id_seq;

CREATE SEQUENCE IF NOT EXISTS reward_record_id_seq START 1;
CREATE TABLE IF NOT EXISTS reward_record (
  id integer NOT NULL DEFAULT nextval('reward_record_id_seq'::regclass),
  market_id integer NOT NULL,
  account_id integer NOT NULL,
  company_id integer NOT NULL,
  reward_tier integer NOT NULL,
  reward_point integer NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT reward_record_pkey PRIMARY KEY (id)
);

ALTER TABLE reward_record OWNER to postgres;
ALTER TABLE reward_record ADD FOREIGN KEY (market_id) REFERENCES market (id) ON DELETE CASCADE;
ALTER TABLE reward_record ADD FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE;
ALTER TABLE reward_record ADD FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE;
ALTER TABLE reward_record ADD FOREIGN KEY (reward_tier) REFERENCES reward_tier (id) ON DELETE CASCADE;
CREATE INDEX ON reward_record (market_id);
CREATE INDEX ON reward_record (account_id);
CREATE INDEX ON reward_record (company_id);
CREATE INDEX ON reward_record (reward_tier);

GRANT USAGE, SELECT ON SEQUENCE reward_record_id_seq TO super_admin;
GRANT USAGE, SELECT ON SEQUENCE reward_record_id_seq TO company_admin;
GRANT USAGE, SELECT ON SEQUENCE reward_record_id_seq TO installer;
GRANT SELECT, INSERT, UPDATE on reward_record to super_admin;
GRANT SELECT on reward_record to market_admin;
GRANT SELECT, INSERT on reward_record to company_admin;
GRANT SELECT, INSERT on reward_record to installer;
GRANT SELECT on reward_record to auditor;

ALTER TABLE reward_record ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS policy_super_admin ON reward_record;
CREATE POLICY policy_super_admin ON reward_record FOR ALL TO super_admin USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS policy_market_admin ON reward_record;
CREATE POLICY policy_market_admin ON reward_record FOR SELECT TO market_admin USING (current_market() = market_id);

DROP POLICY IF EXISTS policy_company_admin ON reward_record;
CREATE POLICY policy_company_admin ON reward_record FOR ALL TO company_admin USING (current_company() = company_id);

DROP POLICY IF EXISTS policy_installer ON reward_record;
CREATE POLICY policy_installer ON reward_record FOR ALL TO installer USING (current_company() = company_id);

DROP POLICY IF EXISTS policy_auditor ON reward_record;
CREATE POLICY policy_auditor ON reward_record FOR SELECT TO auditor USING (current_market() = market_id);

-- Create reward_request table
DROP TABLE IF EXISTS reward_request CASCADE;
DROP SEQUENCE IF EXISTS reward_request_id_seq;

CREATE SEQUENCE IF NOT EXISTS reward_request_id_seq START 1;
CREATE TABLE IF NOT EXISTS reward_request (
  id integer NOT NULL DEFAULT nextval('reward_request_id_seq'::regclass),
  market_id integer NOT NULL,
  account_id integer NOT NULL,
  company_id integer NOT NULL,
  redemption_code varchar(32) DEFAULT substring(md5(random()::text), 0, 32) NOT NULL,
  reward_point integer NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT reward_request_pkey PRIMARY KEY (id),
  CONSTRAINT reward_request_redemption_code_key UNIQUE (redemption_code)
);

ALTER TABLE reward_request OWNER to postgres;
ALTER TABLE reward_request ADD FOREIGN KEY (market_id) REFERENCES market (id) ON DELETE CASCADE;
ALTER TABLE reward_request ADD FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE;
ALTER TABLE reward_request ADD FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE;
CREATE INDEX ON reward_request (market_id);
CREATE INDEX ON reward_request (account_id);
CREATE INDEX ON reward_request (company_id);
CREATE INDEX ON reward_request (redemption_code);

GRANT USAGE, SELECT ON SEQUENCE reward_request_id_seq TO super_admin;
GRANT USAGE, SELECT ON SEQUENCE reward_request_id_seq TO company_admin;
GRANT SELECT, INSERT, UPDATE on reward_request to super_admin;
GRANT SELECT on reward_request to market_admin;
GRANT SELECT, INSERT on reward_request to company_admin;
GRANT SELECT on reward_request to installer;
GRANT SELECT on reward_request to auditor;

ALTER TABLE reward_request ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS policy_super_admin ON reward_request;
CREATE POLICY policy_super_admin ON reward_request FOR ALL TO super_admin USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS policy_market_admin ON reward_request;
CREATE POLICY policy_market_admin ON reward_request FOR SELECT TO market_admin USING (current_market() = market_id);

DROP POLICY IF EXISTS policy_company_admin ON reward_request;
CREATE POLICY policy_company_admin ON reward_request FOR ALL TO company_admin USING (current_company() = company_id) WITH CHECK (current_company() = company_id);

DROP POLICY IF EXISTS policy_installer ON reward_request;
CREATE POLICY policy_installer ON reward_request FOR SELECT TO installer USING (false);

DROP POLICY IF EXISTS policy_auditor ON reward_request;
CREATE POLICY policy_auditor ON reward_request FOR SELECT TO auditor USING (current_market() = market_id);

-- Add reward_effective_date
ALTER TABLE market ADD reward_effective_date timestamp;

