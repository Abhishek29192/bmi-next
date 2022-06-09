ALTER TYPE ROLE ADD VALUE 'AUDITOR';

DROP role if exists auditor;
CREATE role auditor nologin;
GRANT auditor to postgres;
-- GRANT usage, SELECT on all sequences in schema public to auditor;
-- ALTER default privileges for user postgres in schema public grant select on sequences to auditor;
-- REVOKE execute on FUNCTION create_account from auditor;
-- GRANT execute on all functions in schema public to auditor;
-- REVOKE execute on FUNCTION create_company from auditor;

-- Permission
-- Grant on schema
-- grant usage on schema public to auditor;

-- market
grant select on market to auditor;

-- company
grant select on company to auditor;

-- company_member
grant select on company_member to auditor;

-- company_operations
grant select on company_operation to auditor;

-- account
grant select, update (email, phone, first_name, last_name, docebo_user_id, docebo_username, photo) on account to auditor;

-- address
grant select on address to auditor;

-- -- company_document
-- grant select on company_document to auditor;

-- project
grant select on project to auditor;

-- project_member
grant select on project_member to auditor;

-- notification
grant select on notification to auditor;

-- -- invitation
-- grant select on invitation to auditor;

-- guarantee
grant select on guarantee to auditor;

-- account_certification
grant select on certification to auditor;

-- evidence_item
grant select on evidence_item to auditor;

-- product
grant select on product to auditor;

-- note
grant select on note to auditor;

-- system
grant select on system to auditor;

-- system_member
grant select on system_member to auditor;

-- views
grant select on find_roofer to auditor;
grant select on find_incomplete_company_profiles to auditor;

-- RLS
-- market
CREATE POLICY policy_auditor ON market FOR SELECT TO auditor USING (current_market() = id);

-- company
CREATE POLICY policy_auditor ON company FOR SELECT TO auditor USING (current_market() = market_id);

-- company_member
CREATE POLICY policy_auditor ON company_member FOR SELECT TO auditor USING (false);

-- company_operation
CREATE POLICY policy_auditor ON company_operation FOR SELECT TO auditor USING (false);

-- account
CREATE POLICY policy_auditor ON account FOR ALL TO auditor USING (
  current_account_id() = id OR current_account_email() = email OR id IN (SELECT account_id FROM company_member WHERE company_id = current_company())
) WITH CHECK (
  current_account_id() = id OR current_account_email() = email
);

-- address
CREATE POLICY policy_auditor ON address FOR SELECT TO auditor USING (true);

-- -- company_document
-- grant select on company_document to auditor;

-- project
CREATE POLICY policy_auditor ON project FOR SELECT TO auditor USING (company_id IN (
  SELECT id FROM company WHERE market_id = current_market()
));

-- project_member
CREATE POLICY policy_auditor ON project_member FOR SELECT TO auditor USING (project_id IN (
  SELECT p.id FROM project p JOIN company c ON p.company_id = c.id WHERE c.market_id = current_market() 
));

-- notification
CREATE POLICY policy_auditor ON notification FOR SELECT TO auditor USING (false);

-- -- invitation
-- grant select on invitation to auditor;

-- guarantee
CREATE POLICY policy_auditor ON guarantee FOR SELECT TO auditor USING (project_id IN (
   SELECT p.id FROM project p JOIN company c ON p.company_id = c.id WHERE c.market_id = current_market() 
));

-- account_certification
CREATE POLICY policy_auditor ON certification FOR SELECT TO auditor USING (current_market() = (
  SELECT market_id FROM account a JOIN certification c ON c.docebo_user_id = a.docebo_user_id
));

-- evidence_item
CREATE POLICY policy_auditor ON evidence_item FOR ALL TO auditor USING (current_market() = (
    SELECT market_id FROM company c JOIN project p ON p.company_id = c.id JOIN evidence_item e ON e.project_id = p.id WHERE c.id = e.project_id
  ));

-- product
CREATE POLICY policy_auditor ON product FOR SELECT TO auditor USING (current_market() = market_id);

-- note
CREATE POLICY policy_auditor ON note FOR SELECT TO auditor USING (project_id IN (
    SELECT p.id FROM project p JOIN company c ON p.company_id = c.id WHERE c.market_id = current_market() 
  ));

-- system
CREATE POLICY policy_auditor ON system FOR SELECT TO auditor USING (current_market() = market_id);

-- system_member
CREATE POLICY policy_auditor ON system_member FOR SELECT TO auditor USING (current_market() = market_id);
