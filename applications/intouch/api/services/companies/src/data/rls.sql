ALTER TABLE account ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON account;
DROP POLICY IF EXISTS policy_market_admin ON account;
DROP POLICY IF EXISTS policy_company_admin ON account;
CREATE POLICY policy_super_admin ON account FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON account FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_admin ON account FOR ALL TO company_admin 
     USING (EXISTS(SELECT EndUser FROM CompanyMember WHERE EndUser = id AND Company = current_company())) 
WITH CHECK (EXISTS(SELECT EndUser FROM CompanyMember WHERE EndUser = id AND Company = current_company()));
CREATE POLICY policy_installer ON account FOR ALL TO installer USING (current_account() = Id) WITH CHECK (current_account() = Id);


ALTER TABLE company ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON company;
DROP POLICY IF EXISTS policy_market_admin ON company;
DROP POLICY IF EXISTS policy_company_admin ON company;
CREATE POLICY policy_super_admin ON company FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON company FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_admin ON company FOR ALL TO company_admin USING (current_company() = id) WITH CHECK (current_company() = id);


ALTER TABLE company_member ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON company_member;
DROP POLICY IF EXISTS policy_market_admin ON company_member;
DROP POLICY IF EXISTS policy_company_admin ON company_member;
DROP POLICY IF EXISTS policy_installer_select ON company_member;
DROP POLICY IF EXISTS policy_installer_delete ON company_member;
CREATE POLICY policy_super_admin ON company_member FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON company_member FOR ALL TO market_admin USING (current_market() = Market) WITH CHECK (current_market() = Market);
CREATE POLICY policy_company_admin ON company_member FOR ALL TO company_admin USING (current_company() = id) WITH CHECK (current_company() = id);
CREATE POLICY policy_installer_select ON company_member FOR SELECT TO installer USING (
  current_account() = user
);
CREATE POLICY policy_installer_delete ON company_member FOR DELETE TO installer USING (
  current_account() = end_user
);


ALTER TABLE project ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON project;
DROP POLICY IF EXISTS policy_market_admin ON project;
DROP POLICY IF EXISTS policy_company_admin ON project;
DROP POLICY IF EXISTS policy_installer ON project;
CREATE POLICY policy_super_admin ON project FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON project FOR ALL TO market_admin USING (current_market() = market) WITH CHECK (current_market() = market);
CREATE POLICY policy_company_admin ON project FOR ALL TO company_admin USING (
  current_company() = Company AND is_project_enabled()
) WITH CHECK (
  current_company() = Company AND is_project_enabled()
);
CREATE POLICY policy_installer ON project FOR ALL TO installer USING (
  Id IN (SELECT * FROM is_part_of_project())
);






ALTER TABLE product ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON product;
DROP POLICY IF EXISTS policy_market_admin ON product;
DROP POLICY IF EXISTS policy_company_admin ON product;
CREATE POLICY policy_super_admin ON product FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON product FOR ALL TO market_admin USING (current_market() = market) WITH CHECK (current_market() = market);
CREATE POLICY policy_company_admin ON product FOR ALL TO company_admin USING (current_market() = market) WITH CHECK (current_market() = market);

ALTER TABLE notification ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON notification;
DROP POLICY IF EXISTS policy_market_admin ON notification;
DROP POLICY IF EXISTS policy_company_admin ON notification;
CREATE POLICY policy_super_admin ON notification FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON notification FOR ALL TO market_admin USING (current_account() = recipient) WITH CHECK (current_account() = recipient);
CREATE POLICY policy_company_admin ON notification FOR ALL TO company_admin USING (current_account() = recipient) WITH CHECK (current_account() = recipient);

ALTER TABLE invitation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON invitation;
DROP POLICY IF EXISTS policy_market_admin ON invitation;
DROP POLICY IF EXISTS policy_company_admin ON invitation;
CREATE POLICY policy_super_admin ON invitation FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON invitation FOR ALL TO market_admin USING (current_account() = inviter) WITH CHECK (current_account() = inviter);
CREATE POLICY policy_company_admin ON invitation FOR ALL TO company_admin USING (current_account() = inviter) WITH CHECK (current_account() = inviter);