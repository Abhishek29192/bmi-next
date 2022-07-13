DROP FUNCTION IF EXISTS evidence_items_by_market;
ALTER TABLE evidence_item DROP COLUMN IF EXISTS uploader_account_id;
DROP INDEX IF EXISTS uploader_account_id;
