DROP POLICY IF EXISTS policy_installer_select ON evidence_item;

CREATE POLICY policy_installer_select ON evidence_item FOR SELECT TO installer USING (
  current_company() = (SELECT company_id FROM project WHERE project.id = project_id)
);
