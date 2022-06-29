ALTER TABLE project
  ADD COLUMN inspection BOOLEAN DEFAULT TRUE;
ALTER TABLE project
  ADD COLUMN inspected_at TIMESTAMP without time zone NULL;
ALTER TABLE guarantee
  ADD COLUMN approved_at TIMESTAMP without time zone NULL;
