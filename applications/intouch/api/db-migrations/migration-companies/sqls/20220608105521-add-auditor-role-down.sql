UPDATE account SET role = 'INSTALLER' WHERE role = 'AUDITOR';

DELETE FROM pg_enum
WHERE enumlabel = 'AUDITOR'
AND enumtypid = (
  SELECT oid FROM pg_type WHERE typname = 'role'
);

REVOKE all on all sequences in schema public from auditor;
ALTER default privileges for user postgres in schema public REVOKE select on sequences from auditor;
REVOKE all on all functions in schema public from auditor;
REVOKE all on schema public from auditor;

-- market
REVOKE all on market from auditor;

-- company
REVOKE all on company from auditor;

-- company_member
REVOKE all on company_member from auditor;

-- company_operations
REVOKE all on company_operation from auditor;

-- account
REVOKE all on account from auditor;

-- address
REVOKE all on address from auditor;

-- company_document
REVOKE all on company_document from auditor;

-- project
REVOKE all on project from auditor;

-- project_member
REVOKE all on project_member from auditor;

-- notification
REVOKE all on notification from auditor;

-- invitation
REVOKE all on invitation from auditor;

-- guarantee
REVOKE all on guarantee from auditor;

-- account_certification
REVOKE all on certification from auditor;

-- evidence_item
REVOKE all on evidence_item from auditor;

-- product
REVOKE all on product from auditor;

-- note
REVOKE all on note from auditor;

-- system
REVOKE all on system from auditor;

-- system_member
REVOKE all on system_member from auditor;

-- views
REVOKE all on find_roofer from auditor;
REVOKE all on find_incomplete_company_profiles from auditor;

--RLS
-- market
DROP POLICY IF EXISTS policy_auditor ON market;

-- company
DROP POLICY IF EXISTS policy_auditor ON company;

-- company_member
DROP POLICY IF EXISTS policy_auditor ON company_member;

-- company_operation
DROP POLICY IF EXISTS policy_auditor ON company_operation;

-- account
DROP POLICY IF EXISTS policy_auditor ON account;

-- address
DROP POLICY IF EXISTS policy_auditor ON address;

-- company_document
DROP POLICY IF EXISTS policy_auditor ON company_document;

-- project
DROP POLICY IF EXISTS policy_auditor ON project;

-- project_member
DROP POLICY IF EXISTS policy_auditor ON project_member;

-- notification
DROP POLICY IF EXISTS policy_auditor ON notification;

-- invitation
DROP POLICY IF EXISTS policy_auditor ON invitation;

-- guarantee
DROP POLICY IF EXISTS policy_auditor ON guarantee;

-- account_certification
DROP POLICY IF EXISTS policy_auditor ON certification;

-- evidence_item
DROP POLICY IF EXISTS policy_auditor ON evidence_item;

-- product
DROP POLICY IF EXISTS policy_auditor ON product;

-- note
DROP POLICY IF EXISTS policy_auditor ON note;

-- system
DROP POLICY IF EXISTS policy_auditor ON system;

-- system_member
DROP POLICY IF EXISTS policy_auditor ON system_member;

DROP role if exists auditor;
