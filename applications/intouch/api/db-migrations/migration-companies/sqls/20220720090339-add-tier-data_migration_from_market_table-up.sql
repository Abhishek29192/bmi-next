DROP TABLE IF EXISTS docebo_tier CASCADE;
DROP SEQUENCE IF EXISTS docebo_tier_id_seq;

CREATE SEQUENCE IF NOT EXISTS docebo_tier_id_seq START 1;
CREATE TABLE IF NOT EXISTS public.docebo_tier
(
id integer NOT NULL DEFAULT nextval('docebo_tier_id_seq'::regclass),
market_id integer NOT NULL,
tier_code tier NOT NULL,
docebo_catalogue_id integer,
CONSTRAINT docebo_tier_pkey PRIMARY KEY (id),
CONSTRAINT docebo_tier_market_id_tier_code_key UNIQUE (market_id, tier_code)
);

ALTER TABLE docebo_tier OWNER to postgres;

grant usage, select ON SEQUENCE docebo_tier_id_seq TO super_admin;
grant select, update, insert, delete on docebo_tier to super_admin;
grant select on docebo_tier to market_admin;
grant select on docebo_tier to company_admin;
grant select on docebo_tier to installer;
grant select on docebo_tier to auditor;

ALTER TABLE docebo_tier ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS policy_super_admin ON docebo_tier;
CREATE POLICY policy_super_admin ON docebo_tier FOR ALL TO super_admin USING (true);

DROP POLICY IF EXISTS policy_market_admin ON docebo_tier;
CREATE POLICY policy_market_admin ON docebo_tier FOR SELECT TO market_admin USING (current_market() = market_id);

DROP POLICY IF EXISTS policy_company_admin ON docebo_tier;
CREATE POLICY policy_company_admin ON docebo_tier FOR SELECT TO company_admin USING (current_market() = market_id);

DROP POLICY IF EXISTS policy_installer ON docebo_tier;
CREATE POLICY policy_installer ON docebo_tier FOR SELECT TO installer USING (current_market() = market_id);

DROP POLICY IF EXISTS policy_auditor ON docebo_tier;
CREATE POLICY policy_auditor ON docebo_tier FOR SELECT TO auditor USING (current_market() = market_id);

alter type public."tier" ADD VALUE 'T5';
alter type public."tier" ADD VALUE 'T6';
alter type public."tier" ADD VALUE 'T7';

INSERT INTO docebo_tier (market_id,tier_code,docebo_catalogue_id)
SELECT id as market_id,
       UNNEST(ARRAY ['T1', 'T2', 'T3','T4','T5','T6','T7'])::TIER AS tier_code,
       UNNEST(ARRAY [T1, T2, T3, T4, T5, T6, T7]) AS docebo_catalogue_id
FROM (SELECT id, docebo_catalogue_id as T1, docebo_catalogue_id_t2  as T2, docebo_catalogue_id_t3 as T3,docebo_catalogue_id_t4 as T4, docebo_catalogue_id_t4 AS T5, docebo_catalogue_id_t4 AS T6, docebo_catalogue_id_t4 AS T7
from market) X
