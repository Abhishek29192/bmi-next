ALTER TABLE evidence_item 
  ADD uploader_account_id int, 
  ADD FOREIGN KEY(uploader_account_id) REFERENCES account(id) ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX uploader_account_id ON evidence_item(uploader_account_id);

CREATE OR REPLACE FUNCTION evidence_items_by_market(market int)
  RETURNS SETOF evidence_item
  AS $$
  SELECT
    evidence_item.*
  FROM
    evidence_item
    JOIN project ON project.id = evidence_item.project_id
    JOIN company ON company.id = project.company_id
    LEFT JOIN account ON account.id = evidence_item.uploader_account_id
  WHERE
    company.market_id = market
$$
LANGUAGE sql
STABLE STRICT;

-- Update Function to bulk insert evidence_items 
CREATE OR REPLACE FUNCTION evidence_items_add(evidences evidence_item[])
  RETURNS setof evidence_item
  AS $$
 
  INSERT INTO evidence_item(custom_evidence_category_key,project_id,guarantee_id,evidence_category_type,name,attachment,uploader_account_id)
    select e.custom_evidence_category_key,e.project_id,e.guarantee_id,e.evidence_category_type,e.name,e.attachment,e.uploader_account_id from unnest(evidences) as e
     RETURNING *;
$$ 
LANGUAGE sql 
STRICT VOLATILE;
