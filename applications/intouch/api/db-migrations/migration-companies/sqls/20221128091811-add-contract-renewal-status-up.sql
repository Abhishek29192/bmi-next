ALTER TABLE company
  ADD COLUMN contract_status BOOLEAN DEFAULT FALSE;
ALTER TABLE company
  ADD COLUMN renewal_date TIMESTAMP without time zone NULL;
