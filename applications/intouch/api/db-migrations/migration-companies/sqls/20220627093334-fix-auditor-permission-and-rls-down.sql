-- evidence_item
DROP POLICY IF EXISTS policy_auditor ON evidence_item;

CREATE POLICY policy_auditor ON evidence_item FOR ALL TO auditor USING (current_market() = (
    SELECT market_id FROM company c JOIN project p ON p.company_id = c.id JOIN evidence_item e ON e.project_id = p.id WHERE c.id = e.project_id
  ));

-- account_certification
DROP POLICY IF EXISTS policy_auditor ON certification;

CREATE POLICY policy_auditor ON certification FOR SELECT TO auditor USING (current_market() = (
  SELECT market_id FROM account a JOIN certification c ON c.docebo_user_id = a.docebo_user_id
));

-- project_member
DROP POLICY IF EXISTS policy_auditor ON project_member;

CREATE POLICY policy_auditor ON project_member FOR SELECT TO auditor USING (project_id IN (
  SELECT p.id FROM project p JOIN company c ON p.company_id = c.id WHERE c.market_id = current_market() 
));

-- account
DROP POLICY IF EXISTS policy_auditor ON account;

CREATE POLICY policy_auditor ON account FOR ALL TO auditor USING (
  current_account_id() = id OR current_account_email() = email OR id IN (SELECT account_id FROM company_member WHERE company_id = current_company())
) WITH CHECK (
  current_account_id() = id OR current_account_email() = email
);
