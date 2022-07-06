-- evidence_item
DROP POLICY IF EXISTS policy_auditor ON evidence_item;

CREATE POLICY policy_auditor ON evidence_item FOR ALL TO auditor USING (current_market() = (
    SELECT market_id FROM company JOIN project ON project.company_id = company.id WHERE project.id = project_id
  ));

-- account_certification
DROP POLICY IF EXISTS policy_auditor ON certification;

CREATE POLICY policy_auditor ON certification FOR SELECT TO auditor USING (docebo_user_id IN (
  SELECT docebo_user_id FROM account WHERE market_id = current_market()
));

-- project_member
DROP POLICY IF EXISTS policy_auditor ON project_member;

CREATE POLICY policy_auditor ON project_member FOR SELECT TO auditor USING (account_id IN (
  SELECT id FROM account WHERE market_id = current_market() 
));

-- account
DROP POLICY IF EXISTS policy_auditor ON account;

CREATE POLICY policy_auditor ON account FOR ALL TO auditor USING (
  current_market() = market_id
) WITH CHECK (
  current_account_id() = id OR current_account_email() = email
);
