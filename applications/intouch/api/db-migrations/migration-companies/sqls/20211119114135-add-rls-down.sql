ALTER TABLE market DISABLE ROW LEVEL SECURITY;
ALTER TABLE account DISABLE ROW LEVEL SECURITY;
ALTER TABLE company DISABLE ROW LEVEL SECURITY;
ALTER TABLE company_member DISABLE ROW LEVEL SECURITY;
ALTER TABLE company_operation DISABLE ROW LEVEL SECURITY;
ALTER TABLE project DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_member DISABLE ROW LEVEL SECURITY;
ALTER TABLE product DISABLE ROW LEVEL SECURITY;
ALTER TABLE system DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_member DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification DISABLE ROW LEVEL SECURITY;
ALTER TABLE invitation DISABLE ROW LEVEL SECURITY;
ALTER TABLE company_document DISABLE ROW LEVEL SECURITY;
ALTER TABLE guarantee DISABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_item DISABLE ROW LEVEL SECURITY;
ALTER TABLE note DISABLE ROW LEVEL SECURITY;


DROP POLICY IF EXISTS policy_super_admin ON market;
DROP POLICY IF EXISTS policy_market_admin ON market;
DROP POLICY IF EXISTS policy_company_admin ON market;
DROP POLICY IF EXISTS policy_installer ON market;
DROP POLICY IF EXISTS policy_super_admin ON account;
DROP POLICY IF EXISTS policy_market_admin ON account;
DROP POLICY IF EXISTS policy_company_admin ON account;
DROP POLICY IF EXISTS policy_installer ON account;
DROP POLICY IF EXISTS policy_super_admin ON company;
DROP POLICY IF EXISTS policy_market_admin ON company;
DROP POLICY IF EXISTS policy_company_admin ON company;
DROP POLICY IF EXISTS policy_installer ON company;
DROP POLICY IF EXISTS policy_super_admin ON company_member;
DROP POLICY IF EXISTS policy_market_admin ON company_member;
DROP POLICY IF EXISTS policy_company_admin ON company_member;
DROP POLICY IF EXISTS policy_installer ON company_member;
DROP POLICY IF EXISTS policy_installer_delete ON company_member;
DROP POLICY IF EXISTS policy_super_admin ON company_operation;
DROP POLICY IF EXISTS policy_market_admin ON company_operation;
DROP POLICY IF EXISTS policy_company_admin ON company_operation;
DROP POLICY IF EXISTS policy_installer ON company_operation;
DROP POLICY IF EXISTS policy_super_admin ON project;
DROP POLICY IF EXISTS policy_market_admin ON project;
DROP POLICY IF EXISTS policy_company_admin ON project;
DROP POLICY IF EXISTS policy_installer ON project;
DROP POLICY IF EXISTS policy_super_admin ON project_member;
DROP POLICY IF EXISTS policy_market_admin ON project_member;
DROP POLICY IF EXISTS policy_company_admin ON project_member;
DROP POLICY IF EXISTS policy_installer ON project_member;
DROP POLICY IF EXISTS policy_super_admin ON product;
DROP POLICY IF EXISTS policy_market_admin ON product;
DROP POLICY IF EXISTS policy_company_admin_select ON product;
DROP POLICY IF EXISTS policy_installer_select ON product;
DROP POLICY IF EXISTS policy_super_admin ON system;
DROP POLICY IF EXISTS policy_market_admin ON system;
DROP POLICY IF EXISTS policy_company_admin ON system;
DROP POLICY IF EXISTS policy_installer_select ON system;
DROP POLICY IF EXISTS policy_super_admin ON system_member;
DROP POLICY IF EXISTS policy_market_admin ON system_member;
DROP POLICY IF EXISTS policy_company_admin ON system_member;
DROP POLICY IF EXISTS policy_installer_select ON system_member;
DROP POLICY IF EXISTS policy_super_admin ON notification;
DROP POLICY IF EXISTS policy_market_admin ON notification;
DROP POLICY IF EXISTS policy_company_admin ON notification;
DROP POLICY IF EXISTS policy_installer ON notification;
DROP POLICY IF EXISTS policy_super_admin ON invitation;
DROP POLICY IF EXISTS policy_market_admin ON invitation;
DROP POLICY IF EXISTS policy_company_admin ON invitation;
DROP POLICY IF EXISTS policy_installer ON invitation;
DROP POLICY IF EXISTS policy_super_admin ON company_document;
DROP POLICY IF EXISTS policy_market_admin ON company_document;
DROP POLICY IF EXISTS policy_company_admin ON company_document;
DROP POLICY IF EXISTS policy_installer_select ON company_document;
DROP POLICY IF EXISTS policy_super_admin ON guarantee;
DROP POLICY IF EXISTS policy_market_admin ON guarantee;
DROP POLICY IF EXISTS policy_company_admin ON guarantee;
DROP POLICY IF EXISTS policy_installer_select ON guarantee;
DROP POLICY IF EXISTS policy_super_admin ON evidence_item;
DROP POLICY IF EXISTS policy_market_admin ON evidence_item;
DROP POLICY IF EXISTS policy_company_admin ON evidence_item;
DROP POLICY IF EXISTS policy_installer_select ON evidence_item;
DROP POLICY IF EXISTS policy_super_admin ON note;
DROP POLICY IF EXISTS policy_market_admin ON note;
DROP POLICY IF EXISTS policy_company_admin ON note;
DROP POLICY IF EXISTS policy_installer ON note;
