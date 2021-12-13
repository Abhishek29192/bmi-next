ALTER TABLE company DROP CONSTRAINT IF EXISTS company_name_key;

ALTER TABLE company ADD UNIQUE (name);
