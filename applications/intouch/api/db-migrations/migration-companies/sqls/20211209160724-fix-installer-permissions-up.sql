grant select,insert on evidence_item to installer;

DROP POLICY IF EXISTS policy_installer ON evidence_item;

CREATE POLICY policy_installer ON evidence_item FOR ALL TO installer 
  USING (
     project_id IN (SELECT * FROM is_part_of_project())
  )
  WITH CHECK (
    project_id IN (SELECT * FROM is_part_of_project())
  );
  