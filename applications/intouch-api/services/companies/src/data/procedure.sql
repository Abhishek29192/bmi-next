-- Get the current account
CREATE OR REPLACE FUNCTION current_account ()
  RETURNS int
  AS $$
  SELECT nullif (current_setting('app.current_account', TRUE), '')::int;
$$
LANGUAGE sql
STABLE;

-- Get the current market
CREATE OR REPLACE FUNCTION current_market ()
  RETURNS int
  AS $$
  SELECT Market FROM Account WHERE id = current_account();
$$
LANGUAGE sql STABLE SECURITY DEFINER;

-- Get the current company
CREATE OR REPLACE FUNCTION current_company ()
  RETURNS int
  AS $$
  SELECT Company FROM CompanyMember WHERE EndUser = current_account();
$$
LANGUAGE sql STABLE;
