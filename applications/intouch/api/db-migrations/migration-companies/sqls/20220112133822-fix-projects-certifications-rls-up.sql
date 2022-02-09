CREATE OR REPLACE FUNCTION current_account_docebo_id ()
  RETURNS int
  AS $$
  SELECT
    docebo_user_id
  FROM
    account
  WHERE
    id = current_account_id ();

$$
LANGUAGE sql
STABLE;

DROP POLICY IF EXISTS policy_installer ON certification;

CREATE POLICY policy_installer ON certification
  FOR SELECT TO installer
    USING (EXISTS (
      SELECT
        *
      FROM
        company_member
        JOIN account ON company_member.account_id = account.id
      WHERE
        docebo_user_id = account.docebo_user_id)
        OR current_account_docebo_id () = docebo_user_id);

GRANT SELECT, INSERT, UPDATE ON project TO market_admin;

DROP POLICY IF EXISTS policy_market_admin ON project;

CREATE POLICY policy_market_admin ON project
  FOR ALL TO market_admin
    USING (company_id IN (
      SELECT
        id
      FROM
        company
      WHERE
        market_id = current_market ()))
      WITH CHECK (company_id IN (
        SELECT
          id
        FROM
          company
        WHERE
          market_id = current_market ()));

