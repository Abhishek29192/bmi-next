ALTER TABLE account
  ADD UNIQUE (email);

ALTER TABLE account
  ADD UNIQUE (docebo_user_id);

ALTER TABLE company
  ADD UNIQUE (name);

ALTER TABLE company
  ADD UNIQUE (reference_number);

ALTER TABLE company_member
  ADD UNIQUE (market_id, account_id, company_id);

ALTER TABLE guarantee
  ADD UNIQUE (bmi_reference_id);

ALTER TABLE market
  ADD UNIQUE (DOMAIN);

ALTER TABLE market
  ADD UNIQUE (docebo_catalogue_id);

ALTER TABLE product
  ADD UNIQUE (bmi_ref);

ALTER TABLE SYSTEM
  ADD UNIQUE (bmi_ref);

ALTER TABLE system_member
  ADD UNIQUE (system_bmi_ref, product_bmi_ref, market_id);

ALTER TABLE account
  ADD FOREIGN KEY (market_id) REFERENCES market (id) ON DELETE CASCADE;

CREATE INDEX ON account (market_id);

ALTER TABLE certification
  ADD FOREIGN KEY (docebo_user_id) REFERENCES account (docebo_user_id) ON DELETE CASCADE;

CREATE INDEX ON certification (docebo_user_id);

ALTER TABLE company
  ADD FOREIGN KEY (market_id) REFERENCES market (id) ON DELETE CASCADE;

CREATE INDEX ON company (market_id);

ALTER TABLE company
  ADD FOREIGN KEY (registered_address_id) REFERENCES address (id) ON DELETE CASCADE;

CREATE INDEX ON company (registered_address_id);

ALTER TABLE company
  ADD FOREIGN KEY (trading_address_id) REFERENCES address (id) ON DELETE CASCADE;

CREATE INDEX ON company (trading_address_id);

ALTER TABLE company_document
  ADD FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE;

CREATE INDEX ON company_document (company_id);

ALTER TABLE company_member
  ADD FOREIGN KEY (market_id) REFERENCES market (id) ON DELETE CASCADE;

CREATE INDEX ON company_member (market_id);

ALTER TABLE company_member
  ADD FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE;

CREATE INDEX ON company_member (account_id);

ALTER TABLE company_member
  ADD FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE;

CREATE INDEX ON company_member (company_id);

ALTER TABLE company_operation
  ADD FOREIGN KEY (company) REFERENCES company (id) ON DELETE CASCADE;

CREATE INDEX ON company_operation (company);

ALTER TABLE evidence_item
  ADD FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE;

CREATE INDEX ON evidence_item (project_id);

ALTER TABLE evidence_item
  ADD FOREIGN KEY (guarantee_id) REFERENCES guarantee (id) ON DELETE CASCADE;

CREATE INDEX ON evidence_item (guarantee_id);

ALTER TABLE guarantee
  ADD FOREIGN KEY (requestor_account_id) REFERENCES account (id) ON DELETE CASCADE;

CREATE INDEX ON guarantee (requestor_account_id);

ALTER TABLE guarantee
  ADD FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE;

CREATE INDEX ON guarantee (project_id);

ALTER TABLE guarantee
  ADD FOREIGN KEY (system_bmi_ref) REFERENCES SYSTEM (bmi_ref) ON DELETE CASCADE;

CREATE INDEX ON guarantee (system_bmi_ref);

ALTER TABLE guarantee
  ADD FOREIGN KEY (product_bmi_ref) REFERENCES product (bmi_ref) ON DELETE CASCADE;

CREATE INDEX ON guarantee (product_bmi_ref);

ALTER TABLE guarantee
  ADD FOREIGN KEY (reviewer_account_id) REFERENCES account (id) ON DELETE CASCADE;

CREATE INDEX ON guarantee (reviewer_account_id);

ALTER TABLE invitation
  ADD FOREIGN KEY (sender_account_id) REFERENCES account (id) ON DELETE CASCADE;

CREATE INDEX ON invitation (sender_account_id);

ALTER TABLE invitation
  ADD FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE;

CREATE INDEX ON invitation (company_id);

ALTER TABLE note
  ADD FOREIGN KEY (author_id) REFERENCES account (id) ON DELETE CASCADE;

CREATE INDEX ON note (author_id);

ALTER TABLE note
  ADD FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE;

CREATE INDEX ON note (project_id);

ALTER TABLE notification
  ADD FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE;

CREATE INDEX ON notification (account_id);

ALTER TABLE product
  ADD FOREIGN KEY (market_id) REFERENCES market (id) ON DELETE CASCADE;

CREATE INDEX ON product (market_id);

ALTER TABLE project
  ADD FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE;

CREATE INDEX ON project (company_id);

ALTER TABLE project
  ADD FOREIGN KEY (site_address_id) REFERENCES address (id) ON DELETE CASCADE;

CREATE INDEX ON project (site_address_id);

ALTER TABLE project
  ADD FOREIGN KEY (building_owner_address_id) REFERENCES address (id) ON DELETE CASCADE;

CREATE INDEX ON project (building_owner_address_id);

ALTER TABLE project_member
  ADD FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE;

CREATE INDEX ON project_member (project_id);

ALTER TABLE project_member
  ADD FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE;

CREATE INDEX ON project_member (account_id);

ALTER TABLE SYSTEM
  ADD FOREIGN KEY (market_id) REFERENCES market (id) ON DELETE CASCADE;

CREATE INDEX ON SYSTEM (market_id);

ALTER TABLE system_member
  ADD FOREIGN KEY (system_bmi_ref) REFERENCES SYSTEM (bmi_ref) ON DELETE CASCADE;

CREATE INDEX ON system_member (system_bmi_ref);

ALTER TABLE system_member
  ADD FOREIGN KEY (product_bmi_ref) REFERENCES product (bmi_ref) ON DELETE CASCADE;

CREATE INDEX ON system_member (product_bmi_ref);

ALTER TABLE system_member
  ADD FOREIGN KEY (market_id) REFERENCES market (id) ON DELETE CASCADE;

CREATE INDEX ON system_member (market_id);

