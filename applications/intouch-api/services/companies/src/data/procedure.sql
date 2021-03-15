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
    Market
  FROM
    Account
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
    Company
  FROM
    CompanyMember
  WHERE
    EndUser = current_account ();

$$
LANGUAGE sql
STABLE;

-- Check if project are enabled
CREATE OR REPLACE FUNCTION is_project_enabled ()
  RETURNS boolean
  AS $$
  SELECT
    ProjectsEnabled
  FROM
    Market
    JOIN Company ON Market.id = Company.market
  WHERE
    Market.ProjectsEnabled = TRUE
    AND Company.Id = current_company ();

$$
LANGUAGE sql
STABLE;

-- Check if project are enabled
CREATE OR REPLACE FUNCTION is_part_of_project ()
  RETURNS SETOF integer
  AS $$
  SELECT
    Project
  FROM
    ProjectMember
  WHERE
    Member = current_account ();

$$
LANGUAGE sql
STABLE;
