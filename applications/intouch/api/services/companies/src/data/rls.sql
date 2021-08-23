ALTER TABLE market ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON market;
DROP POLICY IF EXISTS policy_market_admin ON market;
DROP POLICY IF EXISTS policy_company_admin ON market;
DROP POLICY IF EXISTS policy_installer ON market;
CREATE POLICY policy_super_admin ON market FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON market FOR ALL TO market_admin USING (current_market() = id) WITH CHECK (current_market() = id);
CREATE POLICY policy_company_admin ON market FOR SELECT TO company_admin USING (current_market() = id);
CREATE POLICY policy_installer ON market FOR SELECT TO installer USING (current_market() = id);



ALTER TABLE account ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON account;
DROP POLICY IF EXISTS policy_market_admin ON account;
DROP POLICY IF EXISTS policy_company_admin ON account;
DROP POLICY IF EXISTS policy_installer ON account;
CREATE POLICY policy_super_admin ON account FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON account FOR ALL TO market_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);
CREATE POLICY policy_company_admin ON account FOR ALL TO company_admin 
  USING (
    current_account_id() = id OR current_account_email() = email OR id IN (SELECT account_id FROM company_member WHERE company_id = current_company())
  )
  WITH CHECK (
    current_account_id() = id OR current_account_email() = email OR id IN (SELECT account_id FROM company_member WHERE company_id = current_company())
  );
CREATE POLICY policy_installer ON account FOR ALL TO installer USING (
  current_account_id() = id OR current_account_email() = email OR id IN (SELECT account_id FROM company_member WHERE company_id = current_company())
) WITH CHECK (
  current_account_id() = id OR current_account_email() = email
);



ALTER TABLE company ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON company;
DROP POLICY IF EXISTS policy_market_admin ON company;
DROP POLICY IF EXISTS policy_company_admin ON company;
DROP POLICY IF EXISTS policy_installer ON company;
CREATE POLICY policy_super_admin ON company FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON company FOR ALL TO market_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);
CREATE POLICY policy_company_admin ON company FOR ALL TO company_admin USING (current_company() = id) WITH CHECK(true);
CREATE POLICY policy_installer ON company FOR ALL TO installer USING (
  current_company() = id OR id IN (SELECT * FROM invited_by_companies())
) WITH CHECK(true);




ALTER TABLE company_member ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON company_member;
DROP POLICY IF EXISTS policy_market_admin ON company_member;
DROP POLICY IF EXISTS policy_company_admin ON company_member;
DROP POLICY IF EXISTS policy_installer ON company_member;
DROP POLICY IF EXISTS policy_installer_delete ON company_member;
CREATE POLICY policy_super_admin ON company_member FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON company_member FOR ALL TO market_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);
CREATE POLICY policy_company_admin ON company_member FOR ALL TO company_admin USING (
  current_company() = company_id
);
CREATE POLICY policy_installer ON company_member FOR SELECT TO installer USING ( 
  company_id IN (SELECT * FROM invited_by_companies()) OR current_company() = company_id
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
CREATE POLICY policy_market_admin ON project FOR ALL TO market_admin 
USING (
  company_id IN (SELECT id FROM company WHERE market_id = current_market()) 
  ) 
WITH CHECK ( 
  company_id IN (SELECT id FROM company WHERE market_id = current_market() AND is_project_enabled_by_market()) 
);

CREATE POLICY policy_company_admin ON project FOR ALL TO company_admin USING (
  current_company() = company_id AND hidden != TRUE
) WITH CHECK (
  current_company() = company_id AND is_project_enabled_by_market()
);

CREATE POLICY policy_installer ON project FOR ALL TO installer USING (id IN (SELECT * FROM is_part_of_project() WHERE hidden != TRUE));



ALTER TABLE project_member ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON project_member;
DROP POLICY IF EXISTS policy_market_admin ON project_member;
DROP POLICY IF EXISTS policy_company_admin ON project_member;
DROP POLICY IF EXISTS policy_installer ON project_member;
CREATE POLICY policy_super_admin ON project_member FOR ALL TO super_admin USING (true) WITH CHECK (true);

-- Project visibility cascades via policies on `project`
CREATE POLICY policy_market_admin ON project_member FOR ALL TO market_admin
USING (
  project_id IN (SELECT id FROM project)
  )
WITH CHECK (
  project_id IN (SELECT id FROM project)
);

CREATE POLICY policy_company_admin ON project_member FOR ALL TO company_admin 
USING ( 
  project_id IN (select id from project)
) 
WITH CHECK ( 
  project_id IN (select id from project)
);
CREATE POLICY policy_installer ON project_member FOR ALL TO installer USING (account_id = current_account_id());







ALTER TABLE product ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON product;
DROP POLICY IF EXISTS policy_market_admin ON product;
DROP POLICY IF EXISTS policy_company_admin_select ON product;
DROP POLICY IF EXISTS policy_installer_select ON product;
CREATE POLICY policy_super_admin ON product FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON product FOR ALL TO market_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);
CREATE POLICY policy_company_admin_select ON product FOR SELECT TO company_admin USING (current_market() = market_id);
CREATE POLICY policy_installer_select ON product FOR SELECT TO installer USING (current_market() = market_id);

ALTER TABLE system ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON system;
DROP POLICY IF EXISTS policy_market_admin ON system;
DROP POLICY IF EXISTS policy_company_admin ON system;
DROP POLICY IF EXISTS policy_installer_select ON system;
CREATE POLICY policy_super_admin ON system FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON system FOR ALL TO market_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);
CREATE POLICY policy_company_admin ON system FOR SELECT TO company_admin USING (true);
CREATE POLICY policy_installer_select ON system FOR SELECT TO installer USING (true);

ALTER TABLE system_member ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON system_member;
DROP POLICY IF EXISTS policy_market_admin ON system_member;
DROP POLICY IF EXISTS policy_company_admin ON system_member;
DROP POLICY IF EXISTS policy_installer_select ON system_member;
CREATE POLICY policy_super_admin ON system_member FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON system_member FOR ALL TO market_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);
CREATE POLICY policy_company_admin ON system_member FOR SELECT TO company_admin USING (true);
CREATE POLICY policy_installer_select ON system_member FOR SELECT TO installer USING (true);

ALTER TABLE notification ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON notification;
DROP POLICY IF EXISTS policy_market_admin ON notification;
DROP POLICY IF EXISTS policy_company_admin ON notification;
DROP POLICY IF EXISTS policy_installer ON notification;
CREATE POLICY policy_super_admin ON notification FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON notification FOR ALL TO market_admin USING (current_account_id() = account_id);
CREATE POLICY policy_company_admin ON notification FOR ALL TO company_admin USING (current_account_id() = account_id);
CREATE POLICY policy_installer ON notification FOR ALL TO installer USING (current_account_id() = account_id);

ALTER TABLE invitation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON invitation;
DROP POLICY IF EXISTS policy_company_admin ON invitation;
DROP POLICY IF EXISTS policy_installer ON invitation;
CREATE POLICY policy_super_admin ON invitation FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_company_admin ON invitation FOR ALL TO company_admin USING (current_account_id() = sender_account_id) WITH CHECK (current_account_id() = sender_account_id);
CREATE POLICY policy_installer ON invitation FOR ALL TO installer USING (current_account_email() = invitee);

ALTER TABLE company_document ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON company_document;
DROP POLICY IF EXISTS policy_market_admin ON company_document;
DROP POLICY IF EXISTS policy_company_admin ON company_document;
DROP POLICY IF EXISTS policy_installer_select ON company_document;
CREATE POLICY policy_super_admin ON company_document FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON company_document FOR ALL TO market_admin USING (current_market() = (SELECT market_id FROM company where id = company_id));
CREATE POLICY policy_company_admin ON company_document FOR ALL TO company_admin USING (current_company() = company_id) WITH CHECK (current_company() = company_id);
CREATE POLICY policy_installer_select ON company_document FOR SELECT TO installer USING (current_company() = company_id);



ALTER TABLE guarantee ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON guarantee;
DROP POLICY IF EXISTS policy_market_admin ON guarantee;
DROP POLICY IF EXISTS policy_company_admin ON guarantee;
DROP POLICY IF EXISTS policy_installer_select ON guarantee;
CREATE POLICY policy_super_admin ON guarantee FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_company_admin ON guarantee FOR ALL TO company_admin USING (
  current_company() = (SELECT company_id FROM project WHERE project.id = project_id)
) WITH CHECK (
  current_company() = (SELECT company_id FROM project WHERE project.id = project_id)
);

CREATE POLICY policy_installer_select ON guarantee FOR SELECT TO installer USING (
  project_id IN (SELECT * FROM is_part_of_project())
);

ALTER TABLE evidence_item ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON evidence_item;
DROP POLICY IF EXISTS policy_market_admin ON evidence_item;
DROP POLICY IF EXISTS policy_company_admin ON evidence_item;
DROP POLICY IF EXISTS policy_installer_select ON evidence_item;
CREATE POLICY policy_super_admin ON evidence_item FOR ALL TO super_admin USING (true) WITH CHECK (true);

CREATE POLICY policy_company_admin ON evidence_item FOR ALL TO company_admin 
  USING (
     current_company() IN (SELECT company_id FROM project WHERE project.id = project_id)
  )
  WITH CHECK (
    current_company() IN (SELECT company_id FROM project WHERE project.id = project_id)
  );

CREATE POLICY policy_installer_select ON evidence_item FOR SELECT TO installer USING (
  current_company() = (SELECT company_id FROM project WHERE project.id = project_id)
);

ALTER TABLE note ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_super_admin ON note;
DROP POLICY IF EXISTS policy_market_admin ON note;
DROP POLICY IF EXISTS policy_company_admin ON note;
DROP POLICY IF EXISTS policy_installer ON note;
CREATE POLICY policy_super_admin ON note FOR ALL TO super_admin USING (true) WITH CHECK (true);
CREATE POLICY policy_market_admin ON note FOR ALL TO market_admin USING (true) WITH CHECK (
  current_market() = (
    SELECT market_id FROM company JOIN project ON project.company_id = company.id WHERE project.id = project_id
  )
);
CREATE POLICY policy_company_admin ON note FOR SELECT TO company_admin USING (true);
CREATE POLICY policy_installer ON note FOR SELECT TO installer USING (true);
