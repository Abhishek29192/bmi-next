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

CREATE OR REPLACE FUNCTION invited_by_companies ()
  RETURNS setof int
  AS $$
  SELECT
    company_id
  FROM
    invitation
  WHERE
    invitee = current_account_email ()
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
  SELECT
    EXISTS (
      SELECT
        projects_enabled
      FROM
        market
        JOIN company ON market.id = company.market_id
      WHERE
        market.projects_enabled = TRUE
        AND company.id = current_company ());

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

-- Function to create a new account
CREATE OR REPLACE FUNCTION create_account (account account, market_code text)
  RETURNS account
  AS $$
DECLARE
  _account account % rowtype;
  market_id int;
BEGIN
  SELECT
    id
  FROM
    market
  WHERE
    domain = market_code INTO market_id;
  IF FOUND THEN
    INSERT INTO account ("email", "first_name", "last_name", "market_id", "role")
      VALUES (account.email, account.first_name, account.last_name, market_id, account.role)
    ON CONFLICT (email)
      DO UPDATE SET
        first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, ROLE = EXCLUDED.role
      RETURNING
        * INTO _account;
  ELSE
    RAISE EXCEPTION 'Market not found';
  END IF;
  RETURN _account;
END
$$
LANGUAGE 'plpgsql'
VOLATILE
SECURITY DEFINER;

-- Function to create a new company
CREATE OR REPLACE FUNCTION create_company ()
  RETURNS company
  AS $$
DECLARE
  _company company % rowtype;
BEGIN
  INSERT INTO company ("status", "market_id")
    VALUES ('NEW', current_market ())
  RETURNING
    * INTO _company;
  INSERT INTO company_member ("account_id", "market_id", "company_id")
    VALUES (current_account_id (), current_market (), _company.id);
  RETURN _company;
END
$$
LANGUAGE 'plpgsql'
VOLATILE
SECURITY DEFINER;

-- Function link an account to a company
CREATE OR REPLACE FUNCTION link_account_to_company (account_id int, company_id int)
  RETURNS company_member
  AS $$
  DECLARE
    _company_member company_member % rowtype;
  BEGIN
  INSERT INTO company_member ("account_id", "market_id", "company_id")
    VALUES (account_id, current_market (), company_id) RETURNING * INTO _company_member;
    RETURN _company_member;
END
$$
LANGUAGE 'plpgsql'
VOLATILE
SECURITY DEFINER;

