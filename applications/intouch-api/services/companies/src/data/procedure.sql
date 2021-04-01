-- Get the current account
CREATE OR REPLACE FUNCTION current_account ()
  RETURNS int
  AS $$
  SELECT
    nullif (current_setting('app.current_account', TRUE), '')::int;

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
    id = current_account ();

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
    account_id = current_account ()

$$
LANGUAGE sql
STABLE
SECURITY DEFINER;

-- Check if project are enabled
CREATE OR REPLACE FUNCTION is_project_enabled ()
  RETURNS boolean
  AS $$
  SELECT
    projects_enabled
  FROM
    market
    JOIN company ON market.id = company.market_id
  WHERE
    market.projects_enabled = TRUE
    AND company.id = current_company ();

$$
LANGUAGE sql
STABLE;

-- Check if project are enabled
CREATE OR REPLACE FUNCTION is_part_of_project ()
  RETURNS SETOF integer
  AS $$
  SELECT
    project_id
  FROM
    project_member
  WHERE
    account_id = current_account ();

$$
LANGUAGE sql
STABLE;
