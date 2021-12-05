DROP POLICY policy_super_admin ON account;
CREATE POLICY policy_super_admin ON account FOR ALL TO super_admin USING (true) WITH CHECK (true);

-- new
ALTER TABLE address ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin  ON address;
CREATE POLICY policy_super_admin ON address FOR ALL TO super_admin USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS policy_market_admin  ON address;
CREATE POLICY policy_market_admin ON address FOR ALL TO market_admin USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS policy_company_admin  ON address;
CREATE POLICY policy_company_admin ON address FOR ALL TO company_admin USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS policy_installer  ON address;
CREATE POLICY policy_installer ON address FOR SELECT TO installer USING (true);

-- new
ALTER TABLE certification ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON certification;
CREATE POLICY policy_super_admin ON certification FOR ALL TO super_admin USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS policy_market_admin ON certification;
CREATE POLICY policy_market_admin ON certification FOR SELECT TO market_admin USING (EXISTS(
  SELECT * FROM company_member JOIN company ON company_member.company_id = company.id WHERE company.market_id = current_market()
));
DROP POLICY IF EXISTS policy_company_admin ON certification;
CREATE POLICY policy_company_admin ON certification FOR SELECT TO company_admin USING (EXISTS(
  SELECT * FROM company_member JOIN account ON company_member.account_id = account.id WHERE docebo_user_id = account.docebo_user_id
));
DROP POLICY IF EXISTS policy_installer ON certification;
CREATE POLICY policy_installer ON certification FOR SELECT TO installer USING (EXISTS(
  SELECT * FROM company_member JOIN account ON company_member.account_id = account.id WHERE docebo_user_id = account.docebo_user_id
));


DROP POLICY policy_super_admin ON company;
CREATE POLICY policy_super_admin ON company FOR ALL TO super_admin USING (true) WITH CHECK (true);


DROP POLICY policy_super_admin ON company_document;
CREATE POLICY policy_super_admin ON company_document FOR ALL TO super_admin USING (true) WITH CHECK (true);


DROP POLICY policy_super_admin ON company_member;
CREATE POLICY policy_super_admin ON company_member FOR ALL TO super_admin USING (true) WITH CHECK (true);


DROP POLICY policy_super_admin ON company_operation;
CREATE POLICY policy_super_admin ON company_operation FOR ALL TO super_admin USING (true) WITH CHECK (true);


DROP POLICY policy_super_admin ON evidence_item;
CREATE POLICY policy_super_admin ON evidence_item FOR ALL TO super_admin USING (true) WITH CHECK (true);


DROP POLICY policy_super_admin ON guarantee;
CREATE POLICY policy_super_admin ON guarantee FOR ALL TO super_admin USING (true) WITH CHECK (true);


DROP POLICY policy_super_admin ON invitation;
CREATE POLICY policy_super_admin ON invitation FOR ALL TO super_admin USING (true) WITH CHECK (true);

DROP POLICY policy_super_admin ON market;
CREATE POLICY policy_super_admin ON market FOR ALL TO super_admin USING (true) WITH CHECK (true);


DROP POLICY policy_super_admin ON note;
CREATE POLICY policy_super_admin ON note FOR ALL TO super_admin USING (true) WITH CHECK (true);


DROP POLICY policy_super_admin ON notification;
CREATE POLICY policy_super_admin ON notification FOR ALL TO super_admin USING (true) WITH CHECK (true);


DROP POLICY policy_super_admin ON product;
CREATE POLICY policy_super_admin ON product FOR ALL TO super_admin USING (true) WITH CHECK (true);


DROP POLICY policy_super_admin ON project;
CREATE POLICY policy_super_admin ON project FOR ALL TO super_admin USING (true) WITH CHECK (true);

DROP POLICY policy_super_admin ON project_member;
CREATE POLICY policy_super_admin ON project_member FOR ALL TO super_admin USING (true) WITH CHECK (true);

DROP POLICY policy_super_admin ON system;
CREATE POLICY policy_super_admin ON system FOR ALL TO super_admin USING (true) WITH CHECK (true);

DROP POLICY policy_super_admin ON system_member;
CREATE POLICY policy_super_admin ON system_member FOR ALL TO super_admin USING (true) WITH CHECK (true);
