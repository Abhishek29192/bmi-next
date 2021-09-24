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
DECLARE
  _market_id int;
  _account account % rowtype;
BEGIN
  
  SELECT * INTO _account FROM account WHERE id = current_account_id ();

  IF _account.role = 'SUPER_ADMIN' THEN
    SELECT nullif (current_setting('app.current_market', TRUE), '')::int INTO _market_id;
    return _market_id;
  ELSE
    RETURN _account.market_id;
  END IF;

END
$$
LANGUAGE 'plpgsql'
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
    invitee = current_account_email () AND status = 'NEW'
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
    INSERT INTO account ("email", "first_name", "last_name", "market_id", "role", "status")
      VALUES (account.email, account.first_name, account.last_name, market_id, account.role, 'ACTIVE')
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
CREATE OR REPLACE FUNCTION create_company (owner_fullname text, owner_email text, owner_phone text, business_type business_type, tier tier, status company_status, name text, tax_number text, phone text, about_us text, public_email text, website text, facebook text, linked_in text)
  RETURNS company
  AS $$
DECLARE
  _company company % rowtype;
  new_code text;
BEGIN
  UPDATE
    account
  SET
    ROLE = 'COMPANY_ADMIN'
  WHERE
    id = current_account_id ();
  INSERT INTO company ("market_id", "owner_fullname", "owner_email", "owner_phone", "business_type", "tier", "status", "name", "tax_number", "phone", "about_us", "public_email", "website", "facebook", "linked_in")
    VALUES (current_market (), owner_fullname, owner_email, owner_phone, business_type, tier, status, name, tax_number, phone, about_us, public_email, website, facebook, linked_in)
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

-- updating Tier & status cannot be done by company_admin
-- need to do this automatically when first editing company details with mandatory info
CREATE OR REPLACE FUNCTION activate_company (input_company_id int)
  RETURNS company
  AS $$
    UPDATE company
    SET tier = 'T1', status = 'ACTIVE'
      WHERE
        company.id = input_company_id
      RETURNING company.*;
  $$
LANGUAGE sql
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

-- This custom function bypasses RLS
-- We want to preserve RLS for companies (an installer/company_admin can see their company's certifications, but not other companies/markets certifications)
-- But we want to bypass RLS for user certifications (an installer can see company certifications, but not other users' certifications)
-- In order to preserve Company RLS, we omit this function from postgraphile (see postgraphile.tags.json5)
CREATE OR REPLACE FUNCTION get_company_certifications (input_company_id int)
    RETURNS setof text
    AS $$
    SELECT DISTINCT
      technology
    FROM
        certification
        JOIN account ON certification.docebo_user_id = account.docebo_user_id
        JOIN company_member ON account.id = company_member.account_id
    WHERE
        company_member.company_id = input_company_id
        AND certification.expiry_date > now();
$$
LANGUAGE sql
STABLE
SECURITY DEFINER;

-- Function to bulk insert project_member 
CREATE OR REPLACE FUNCTION project_members_add(members project_member[])
  RETURNS setof project_member
  AS $$
 
  insert into project_member(project_id,account_id)
    select m.project_id,m.account_id from unnest(members) as m
     RETURNING *;
$$ LANGUAGE sql STRICT VOLATILE;

-- Function to bulk insert evidence_items 
CREATE OR REPLACE FUNCTION evidence_items_add(evidences evidence_item[])
  RETURNS setof evidence_item
  AS $$
 
  insert into evidence_item(custom_evidence_category_key,project_id,guarantee_id,evidence_category_type,name,attachment)
    select e.custom_evidence_category_key,e.project_id,e.guarantee_id,e.evidence_category_type,e.name,e.attachment from unnest(evidences) as e
     RETURNING *;
$$ LANGUAGE sql STRICT VOLATILE;

CREATE OR REPLACE FUNCTION search_products (query text,technology technology)
    RETURNS setof product
    AS $$
    SELECT * from product
    WHERE
        product.published = true
        AND product.market_id =current_market ()
        and product.technology =search_products.technology
        and 
        (product.name ILIKE '%' || query || '%' or product.description ILIKE '%' || query || '%')
        order by product.name
$$
LANGUAGE sql
stable STRICT
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION search_systems (query text,technology technology)
    RETURNS setof system
    AS $$
    SELECT * from system
    WHERE
        system.published = true
        AND system.market_id =current_market ()
        and system.technology =search_systems.technology
        and 
        (system.name ILIKE '%' || query || '%' or system.description ILIKE '%' || query || '%')
        order by system.name
$$
LANGUAGE sql
stable STRICT
SECURITY DEFINER;
