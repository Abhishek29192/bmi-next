ALTER TABLE company DROP CONSTRAINT IF EXISTS company_market_id_name_key;

ALTER TABLE company ADD UNIQUE (market_id,name);
