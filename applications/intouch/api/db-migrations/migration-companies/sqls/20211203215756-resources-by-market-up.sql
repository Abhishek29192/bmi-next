-- Get the current account
CREATE OR REPLACE FUNCTION projects_by_market (market int)
  RETURNS SETOF project
  AS $$
  SELECT
    project.*
  FROM
    project
    JOIN company ON company.id = project.company_id
  WHERE
    company.market_id = market_id;

$$
LANGUAGE sql
STABLE STRICT;

-- Get the current account
CREATE OR REPLACE FUNCTION guarantees_by_market (market int)
  RETURNS SETOF guarantee
  AS $$
  SELECT
    guarantee.*
  FROM
    guarantee
    JOIN project ON project.id = guarantee.project_id
    JOIN company ON company.id = project.company_id
  WHERE
    company.market_id = market
$$
LANGUAGE sql
STABLE STRICT;
