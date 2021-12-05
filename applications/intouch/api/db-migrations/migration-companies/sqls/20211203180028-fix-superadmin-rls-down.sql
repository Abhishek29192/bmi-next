
DROP POLICY policy_super_admin_select ON account;
DROP POLICY policy_super_admin_update ON account;
DROP POLICY policy_super_admin_delete ON account;
DROP POLICY policy_super_admin_insert ON account;

-- new

DROP POLICY policy_super_admin_select ON address;
DROP POLICY policy_super_admin_update ON address;
DROP POLICY policy_super_admin_delete ON address;
DROP POLICY policy_super_admin_insert ON address;

-- new

DROP POLICY policy_super_admin_select ON certification;
DROP POLICY policy_super_admin_update ON certification;
DROP POLICY policy_super_admin_delete ON certification;
DROP POLICY policy_super_admin_insert ON certification;



DROP POLICY policy_super_admin_select ON company;
DROP POLICY policy_super_admin_update ON company;
DROP POLICY policy_super_admin_delete ON company;
DROP POLICY policy_super_admin_insert ON company;



DROP POLICY policy_super_admin_select ON company_document;
DROP POLICY policy_super_admin_update ON company_document;
DROP POLICY policy_super_admin_delete ON company_document;
DROP POLICY policy_super_admin_insert ON company_document;



DROP POLICY policy_super_admin_select ON company_member;
DROP POLICY policy_super_admin_update ON company_member;
DROP POLICY policy_super_admin_delete ON company_member;
DROP POLICY policy_super_admin_insert ON company_member;



DROP POLICY policy_super_admin_select ON company_operation;
DROP POLICY policy_super_admin_update ON company_operation;
DROP POLICY policy_super_admin_delete ON company_operation;
DROP POLICY policy_super_admin_insert ON company_operation;



DROP POLICY policy_super_admin_select ON evidence_item;
DROP POLICY policy_super_admin_update ON evidence_item;
DROP POLICY policy_super_admin_delete ON evidence_item;
DROP POLICY policy_super_admin_insert ON evidence_item;



DROP POLICY policy_super_admin_select ON guarantee;
DROP POLICY policy_super_admin_update ON guarantee;
DROP POLICY policy_super_admin_delete ON guarantee;
DROP POLICY policy_super_admin_insert ON guarantee;



DROP POLICY policy_super_admin_select ON invitation;
DROP POLICY policy_super_admin_update ON invitation;
DROP POLICY policy_super_admin_delete ON invitation;
DROP POLICY policy_super_admin_insert ON invitation;



DROP POLICY policy_super_admin_select ON market;
DROP POLICY policy_super_admin_update ON market;
DROP POLICY policy_super_admin_delete ON market;
DROP POLICY policy_super_admin_insert ON market;



DROP POLICY policy_super_admin ON note;



DROP POLICY policy_super_admin_select ON notification;
DROP POLICY policy_super_admin_update ON notification;
DROP POLICY policy_super_admin_delete ON notification;
DROP POLICY policy_super_admin_insert ON notification;



DROP POLICY policy_super_admin_select ON product;
DROP POLICY policy_super_admin_update ON product;
DROP POLICY policy_super_admin_delete ON product;
DROP POLICY policy_super_admin_insert ON product;



DROP POLICY policy_super_admin_select ON project;
DROP POLICY policy_super_admin_update ON project;
DROP POLICY policy_super_admin_delete ON project;
DROP POLICY policy_super_admin_insert ON project;



DROP POLICY policy_super_admin_select ON project_member;
DROP POLICY policy_super_admin_update ON project_member;
DROP POLICY policy_super_admin_delete ON project_member;
DROP POLICY policy_super_admin_insert ON project_member;



DROP POLICY policy_super_admin_select ON system;
DROP POLICY policy_super_admin_update ON system;
DROP POLICY policy_super_admin_delete ON system;
DROP POLICY policy_super_admin_insert ON system;



DROP POLICY policy_super_admin_select ON system_member;
DROP POLICY policy_super_admin_update ON system_member;
DROP POLICY policy_super_admin_delete ON system_member;
DROP POLICY policy_super_admin_insert ON system_member;









CREATE POLICY policy_super_admin ON market FOR ALL TO super_admin USING (true) WITH CHECK (true);


CREATE POLICY policy_super_admin ON account FOR ALL TO super_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);


CREATE POLICY policy_super_admin ON company FOR ALL TO super_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);


CREATE POLICY policy_super_admin ON company_member FOR ALL TO super_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);


CREATE POLICY policy_super_admin ON company_operation FOR ALL TO super_admin USING (
  company IN (SELECT id FROM company WHERE market_id = current_market()) 
) 
WITH CHECK ( 
  company IN (SELECT id FROM company WHERE market_id = current_market()) 
);


CREATE POLICY policy_super_admin ON project FOR ALL TO super_admin USING (
  company_id IN (SELECT id FROM company WHERE market_id = current_market()) 
  ) 
WITH CHECK ( 
  company_id IN (SELECT id FROM company WHERE market_id = current_market()) 
);


CREATE POLICY policy_super_admin ON project_member FOR ALL TO super_admin USING (
  project_id IN (SELECT id FROM project)
)
WITH CHECK (
  project_id IN (SELECT id FROM project)
);


CREATE POLICY policy_super_admin ON product FOR ALL TO super_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);


CREATE POLICY policy_super_admin ON system FOR ALL TO super_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);


CREATE POLICY policy_super_admin ON system_member FOR ALL TO super_admin USING (current_market() = market_id) WITH CHECK (current_market() = market_id);


CREATE POLICY policy_super_admin ON notification FOR ALL TO super_admin USING (current_market() = (SELECT market_id FROM account WHERE account.id = account_id));


CREATE POLICY policy_super_admin ON invitation FOR ALL TO super_admin USING (company_id IN (SELECT id FROM company WHERE market_id = current_market())) WITH CHECK (company_id IN (SELECT id FROM company WHERE market_id = current_market() AND is_project_enabled_by_market()));


CREATE POLICY policy_super_admin ON company_document FOR ALL TO super_admin USING (current_market() = (SELECT market_id FROM company where id = company_id));


CREATE POLICY policy_super_admin ON guarantee FOR ALL TO super_admin 
USING (
  current_market() = (
    SELECT market_id FROM company JOIN project ON project.company_id = company.id WHERE project.id = project_id
  )
) 
WITH CHECK ( 
   current_market() = (
    SELECT market_id FROM company JOIN project ON project.company_id = company.id WHERE project.id = project_id
  )
);


CREATE POLICY policy_super_admin ON evidence_item FOR ALL TO super_admin 
USING (
  current_market() = (
    SELECT market_id FROM company JOIN project ON project.company_id = company.id WHERE project.id = project_id
  )
);


CREATE POLICY policy_super_admin ON note FOR ALL TO super_admin USING (true) WITH CHECK (
    current_market() = (
    SELECT market_id FROM company JOIN project ON project.company_id = company.id WHERE project.id = project_id
  )
);
