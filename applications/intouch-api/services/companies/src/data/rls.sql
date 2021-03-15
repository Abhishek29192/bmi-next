ALTER TABLE Account ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Account;
DROP POLICY IF EXISTS policy_market_admin ON Account;
DROP POLICY IF EXISTS policy_company_admin ON Account;
CREATE POLICY policy_super_admin ON Account FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Account FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_admin ON Account FOR ALL TO company_admin 
     USING (EXISTS(SELECT EndUser FROM CompanyMember WHERE EndUser = id AND Company = current_company())) 
WITH CHECK (EXISTS(SELECT EndUser FROM CompanyMember WHERE EndUser = id AND Company = current_company()));


ALTER TABLE Company ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Company;
DROP POLICY IF EXISTS policy_market_admin ON Company;
DROP POLICY IF EXISTS policy_company_admin ON Company;
CREATE POLICY policy_super_admin ON Company FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Company FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_admin ON Company FOR ALL TO company_admin USING (current_company() = id) WITH CHECK (current_company() = id);


ALTER TABLE CompanyMember ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON CompanyMember;
DROP POLICY IF EXISTS policy_market_admin ON CompanyMember;
DROP POLICY IF EXISTS policy_company_admin ON CompanyMember;
DROP POLICY IF EXISTS policy_installer_select ON CompanyMember;
DROP POLICY IF EXISTS policy_installer_delete ON CompanyMember;
CREATE POLICY policy_super_admin ON CompanyMember FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON CompanyMember FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_admin ON CompanyMember FOR ALL TO company_admin USING (current_company() = id) WITH CHECK (current_company() = id);
CREATE POLICY policy_installer_select ON CompanyMember FOR SELECT TO installer USING (
  current_account() = EndUser
);
CREATE POLICY policy_installer_delete ON CompanyMember FOR DELETE TO installer USING (
  current_account() = EndUser
);


ALTER TABLE Project ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Project;
DROP POLICY IF EXISTS policy_market_admin ON Project;
DROP POLICY IF EXISTS policy_company_admin ON Project;
DROP POLICY IF EXISTS policy_installer ON Project;
CREATE POLICY policy_super_admin ON Project FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Project FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_admin ON Project FOR ALL TO company_admin USING (
  current_company() = Company AND is_project_enabled()
) WITH CHECK (
  current_company() = Company AND is_project_enabled()
);
CREATE POLICY policy_installer ON Project FOR ALL TO installer USING (
  Id IN (SELECT * FROM is_part_of_project())
);






ALTER TABLE Product ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Product;
DROP POLICY IF EXISTS policy_market_admin ON Product;
DROP POLICY IF EXISTS policy_company_admin ON Product;
CREATE POLICY policy_super_admin ON Product FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Product FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_admin ON Product FOR ALL TO company_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);

ALTER TABLE Notification ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Notification;
DROP POLICY IF EXISTS policy_market_admin ON Notification;
DROP POLICY IF EXISTS policy_company_admin ON Notification;
CREATE POLICY policy_super_admin ON Notification FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Notification FOR ALL TO market_admin USING (current_account() = Recipient) WITH CHECK (current_account() = Recipient);
CREATE POLICY policy_company_admin ON Notification FOR ALL TO company_admin USING (current_account() = Recipient) WITH CHECK (current_account() = Recipient);

ALTER TABLE Invitation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON Invitation;
DROP POLICY IF EXISTS policy_market_admin ON Invitation;
DROP POLICY IF EXISTS policy_company_admin ON Invitation;
CREATE POLICY policy_super_admin ON Invitation FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON Invitation FOR ALL TO market_admin USING (current_account() = Inviter) WITH CHECK (current_account() = Inviter);
CREATE POLICY policy_company_admin ON Invitation FOR ALL TO company_admin USING (current_account() = Inviter) WITH CHECK (current_account() = Inviter);