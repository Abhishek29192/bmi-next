ALTER TABLE Account ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Account;
DROP POLICY IF EXISTS policy_market_admin ON Account;
DROP POLICY IF EXISTS policy_company_owner_admin ON Account;
CREATE POLICY policy_super_admin ON Account FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Account FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_owner_admin ON Account FOR ALL TO company_owner, company_admin 
     USING (EXISTS(SELECT EndUser FROM CompanyMember WHERE EndUser = id AND Company = current_company())) 
WITH CHECK (EXISTS(SELECT EndUser FROM CompanyMember WHERE EndUser = id AND Company = current_company()));

ALTER TABLE Company ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Company;
DROP POLICY IF EXISTS policy_market_admin ON Company;
DROP POLICY IF EXISTS policy_company_owner_admin ON Company;
CREATE POLICY policy_super_admin ON Company FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Company FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_owner_admin ON Company FOR ALL TO company_owner, company_admin USING (current_company() = id) WITH CHECK (current_company() = id);

ALTER TABLE Project ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Project;
DROP POLICY IF EXISTS policy_market_admin ON Project;
DROP POLICY IF EXISTS policy_company_owner_admin ON Project;
CREATE POLICY policy_super_admin ON Project FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Project FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_owner_admin ON Project FOR ALL TO company_owner, company_admin USING (current_company() = Company) WITH CHECK (current_company() = Company);

ALTER TABLE Product ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Product;
DROP POLICY IF EXISTS policy_market_admin ON Product;
DROP POLICY IF EXISTS policy_company_owner_admin ON Product;
CREATE POLICY policy_super_admin ON Product FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Product FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_owner_admin ON Product FOR ALL TO company_owner, company_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);

ALTER TABLE Notification ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Notification;
DROP POLICY IF EXISTS policy_market_admin ON Notification;
DROP POLICY IF EXISTS policy_company_owner_admin ON Notification;
CREATE POLICY policy_super_admin ON Notification FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Notification FOR ALL TO market_admin USING (current_account() = Recipient) WITH CHECK (current_account() = Recipient);
CREATE POLICY policy_company_owner_admin ON Notification FOR ALL TO company_owner, company_admin USING (current_account() = Recipient) WITH CHECK (current_account() = Recipient);

ALTER TABLE Invitation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Invitation;
DROP POLICY IF EXISTS policy_market_admin ON Invitation;
DROP POLICY IF EXISTS policy_company_owner_admin ON Invitation;
CREATE POLICY policy_super_admin ON Invitation FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Invitation FOR ALL TO market_admin USING (current_account() = Inviter) WITH CHECK (current_account() = Inviter);
CREATE POLICY policy_company_owner_admin ON Invitation FOR ALL TO company_owner, company_admin USING (current_account() = Inviter) WITH CHECK (current_account() = Inviter);