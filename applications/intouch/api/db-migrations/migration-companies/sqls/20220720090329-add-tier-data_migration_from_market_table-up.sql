DROP TABLE IF EXISTS docebo_tier CASCADE;

CREATE SEQUENCE docebo_tier_id_seq START 1;

CREATE TABLE IF NOT EXISTS public.docebo_tier
(
id integer NOT NULL DEFAULT nextval('docebo_tier_id_seq'::regclass),
market_id integer NOT NULL,
tier_code tier NOT NULL,
docebo_catalogue_id integer,
CONSTRAINT docebo_tier_pkey PRIMARY KEY (id),
CONSTRAINT docebo_tier_market_id_tier_code_docebo_catalogue_key UNIQUE (market_id, tier_code, docebo_catalogue_id)
);

ALTER TABLE docebo_tier OWNER to postgres;

INSERT INTO docebo_tier (market_id,tier_code,docebo_catalogue_id)
SELECT id as market_id,
       UNNEST(ARRAY ['T1', 'T2', 'T3','T4'])::TIER AS tier_code,
       UNNEST(ARRAY [T1, T2, T3,T4]) AS docebo_catalogue_id
FROM (SELECT id, docebo_catalogue_id as T1, docebo_catalogue_id_t2  as T2, docebo_catalogue_id_t3 as T3,docebo_catalogue_id_t4 as T4
from market) X 
