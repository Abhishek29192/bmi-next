ALTER TABLE market ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON market;
DROP POLICY IF EXISTS policy_market_admin ON market;
DROP POLICY IF EXISTS policy_company_admin ON market;
DROP POLICY IF EXISTS policy_installer ON market;
CREATE POLICY policy_super_admin ON market FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON market FOR ALL TO market_admin USING (current_market() = id) WITH CHECK (current_market() = id);
CREATE POLICY policy_company_admin ON market FOR SELECT TO company_admin USING (true);
CREATE POLICY policy_installer ON market FOR SELECT TO installer USING (true);



ALTER TABLE account ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON account;
DROP POLICY IF EXISTS policy_market_admin ON account;
DROP POLICY IF EXISTS policy_company_admin ON account;
DROP POLICY IF EXISTS policy_installer_select ON account;
DROP POLICY IF EXISTS policy_installer_update ON account;
CREATE POLICY policy_super_admin ON account FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON account FOR ALL TO market_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);
CREATE POLICY policy_company_admin ON account FOR ALL TO company_admin 
     USING (EXISTS(SELECT account_id FROM company_member WHERE account_id = id AND company_id = current_company())) 
WITH CHECK (EXISTS(SELECT account_id FROM company_member WHERE account_id = id AND company_id = current_company()));
CREATE POLICY policy_installer_select ON account FOR SELECT TO installer USING (current_account_id() = id OR current_account_email() = email);
CREATE POLICY policy_installer_update ON account FOR UPDATE TO installer USING (current_account_id() = id OR current_account_email() = email);


ALTER TABLE company ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON company;
DROP POLICY IF EXISTS policy_market_admin ON company;
DROP POLICY IF EXISTS policy_company_admin ON company;
DROP POLICY IF EXISTS policy_installer ON company;
CREATE POLICY policy_super_admin ON company FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON company FOR ALL TO market_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);
CREATE POLICY policy_company_admin ON company FOR ALL TO company_admin USING (current_company() = id);
CREATE POLICY policy_installer ON company FOR ALL TO installer USING (current_company() = id);


ALTER TABLE company_member ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON company_member;
DROP POLICY IF EXISTS policy_market_admin ON company_member;
DROP POLICY IF EXISTS policy_company_admin ON company_member;
DROP POLICY IF EXISTS policy_installer_select ON company_member;
DROP POLICY IF EXISTS policy_installer_delete ON company_member;
CREATE POLICY policy_super_admin ON company_member FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON company_member FOR ALL TO market_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);
CREATE POLICY policy_company_admin ON company_member FOR ALL TO company_admin USING (current_company() = company_id) WITH CHECK (current_company() = company_id);
CREATE POLICY policy_installer_select ON company_member FOR SELECT TO installer USING (
  current_account_id() = account_id
);
CREATE POLICY policy_installer_delete ON company_member FOR DELETE TO installer USING (
  current_account_id() = account_id
);


ALTER TABLE project ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON project;
DROP POLICY IF EXISTS policy_market_admin ON project;
DROP POLICY IF EXISTS policy_company_admin ON project;
DROP POLICY IF EXISTS policy_installer ON project;
CREATE POLICY policy_super_admin ON project FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON project FOR ALL TO market_admin USING (
  company_id IN (SELECT id FROM company WHERE market_id = current_market())
) WITH CHECK (
  company_id IN (SELECT id FROM company WHERE market_id = current_market())
);
CREATE POLICY policy_company_admin ON project FOR ALL TO company_admin USING (
  current_company() = company_id AND is_project_enabled_by_market()
) WITH CHECK (
  current_company() = company_id AND is_project_enabled_by_market()
);
CREATE POLICY policy_installer ON project FOR ALL TO installer USING (
  id IN (SELECT * FROM is_part_of_project())
);


ALTER TABLE product ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON product;
DROP POLICY IF EXISTS policy_market_admin ON product;
DROP POLICY IF EXISTS policy_company_admin_select ON product;
DROP POLICY IF EXISTS policy_installer_select ON product;
CREATE POLICY policy_super_admin ON product FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON product FOR ALL TO market_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);
CREATE POLICY policy_company_admin_select ON product FOR SELECT TO company_admin USING (current_market() = market_id);
CREATE POLICY policy_installer_select ON product FOR SELECT TO installer USING (current_market() = market_id);

ALTER TABLE notification ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON notification;
DROP POLICY IF EXISTS policy_market_admin ON notification;
DROP POLICY IF EXISTS policy_company_admin ON notification;
DROP POLICY IF EXISTS policy_installer ON notification;
CREATE POLICY policy_super_admin ON notification FOR ALL TO super_admin USING (current_account_id() = account_id) WITH CHECK (current_account_id() = account_id);
CREATE POLICY policy_market_admin ON notification FOR ALL TO market_admin USING (current_account_id() = account_id) WITH CHECK (current_account_id() = account_id);
CREATE POLICY policy_company_admin ON notification FOR ALL TO company_admin USING (current_account_id() = account_id) WITH CHECK (current_account_id() = account_id);
CREATE POLICY policy_installer ON notification FOR ALL TO installer USING (current_account_id() = account_id) WITH CHECK (current_account_id() = account_id);


-- TODO: create all RLS, there is already a pr for this
-- ALTER TABLE invitation ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS policy_super_admin ON invitation;
-- DROP POLICY IF EXISTS policy_market_admin ON invitation;
-- DROP POLICY IF EXISTS policy_company_admin ON invitation;
-- DROP POLICY IF EXISTS policy_installer_select ON invitation;
-- DROP POLICY IF EXISTS policy_installer_update ON invitation;
-- CREATE POLICY policy_super_admin ON invitation FOR ALL TO super_admin USING (true) WITH CHECK (true);
-- CREATE POLICY policy_market_admin ON invitation FOR ALL TO market_admin USING (current_account_id() = account_id) WITH CHECK (current_account_id() = account_id);
-- CREATE POLICY policy_company_admin ON invitation FOR ALL TO company_admin USING (current_account_id() = account_id) WITH CHECK (current_account_id() = account_id);
-- CREATE POLICY policy_installer_select ON invitation FOR SELECT TO installer USING (current_account_id() = account_id);
-- CREATE POLICY policy_installer_update ON invitation FOR UPDATE TO installer USING (current_account_id() = account_id) WITH CHECK (current_account_id() = account_id);
