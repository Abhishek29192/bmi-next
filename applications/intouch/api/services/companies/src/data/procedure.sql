-- Get the current account
CREATE OR REPLACE FUNCTION current_account_id ()
  RETURNS int
  AS $$
  SELECT
    nullif (current_setting('app.current_account_id', TRUE), '')::int;

$$
LANGUAGE sql
STABLE;

-- Get the current account
CREATE OR REPLACE FUNCTION current_account_email ()
  RETURNS text
  AS $$
  SELECT
    nullif (current_setting('app.current_account_email', TRUE), '')::text;

$$
LANGUAGE sql
STABLE;


-- Get the current market
CREATE OR REPLACE FUNCTION current_market ()
  RETURNS int
  AS $$
  SELECT
    market_id
  FROM
    account
  WHERE
    id = current_account_id ();

$$
LANGUAGE sql
STABLE
SECURITY DEFINER;

-- Get the current company
CREATE OR REPLACE FUNCTION current_company ()
  RETURNS int
  AS $$
  SELECT
    company_id
  FROM
    company_member
  WHERE
    account_id = current_account_id ()

$$
LANGUAGE sql
STABLE
SECURITY DEFINER;

-- Check if project are enabled
CREATE OR REPLACE FUNCTION is_project_enabled_by_market ()
  RETURNS boolean
  AS $$
  SELECT EXISTS(
    SELECT
      projects_enabled
    FROM
      market
      JOIN company ON market.id = company.market_id
    WHERE
      market.projects_enabled = TRUE
      AND company.id = current_company ()
  );

$$
LANGUAGE sql
STABLE
SECURITY DEFINER;

-- Check if project are enabled
CREATE OR REPLACE FUNCTION is_part_of_project ()
  RETURNS SETOF integer
  AS $$
  SELECT
    project_id
  FROM
    project_member
  WHERE
    account_id = current_account_id ();

$$
LANGUAGE sql
STABLE
SECURITY DEFINER;


CREATE OR REPLACE FUNCTION market_id_by_domain (domain text)
  RETURNS integer
  AS $$
  SELECT
    id
  FROM
    market
  WHERE
    domain = domain;

$$
LANGUAGE sql
STABLE
SECURITY DEFINER;

