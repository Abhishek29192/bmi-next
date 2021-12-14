CREATE TYPE account_status AS ENUM (
  'NEW',
  'ACTIVE',
  'SUSPENDED'
);

CREATE TYPE business_type AS ENUM (
  'CONTRACTOR',
  'ARCHITECT',
  'MERCHANT',
  'CORP_DEVELOPER'
);

CREATE TYPE company_status AS ENUM (
  'NEW',
  'ACTIVE',
  'DEACTIVATED'
);

CREATE TYPE custom_evidence_category_key AS ENUM (
  'PITCHED_DETAILS',
  'PITCHED_TILES',
  'PITCHED_BASE',
  'PITCHED_UNDERLAY',
  'PITCHED_VENTILATION',
  'PITCHED_PENETRATIONS',
  'PITCHED_FIXINGS',
  'PITCHED_INSULATION',
  'PITCHED_INSPECTION',
  'PITCHED_SAFETY',
  'PITCHED_PLAN',
  'FLAT_DETAILS',
  'FLAT_TOP',
  'FLAT_BASE',
  'FLAT_LAYER',
  'FLAT_VENTILATION',
  'FLAT_PENETRATIONS',
  'FLAT_FIXINGS',
  'FLAT_INSULATION',
  'FLAT_SAFETY',
  'FLAT_PLAN',
  'MISC_1',
  'MISC_2',
  'MISC_3',
  'MISC_4'
);

CREATE TYPE evidence_category_type AS ENUM (
  'PROOF_OF_PURCHASE',
  'MISCELLANEOUS',
  'CUSTOM'
);

CREATE TYPE guarantee_coverage AS ENUM (
  'PRODUCT',
  'SYSTEM',
  'SOLUTION'
);

CREATE TYPE guarantee_reference_code AS ENUM (
  'FLAT_PRODUCT',
  'FLAT_SYSTEM',
  'FLAT_SOLUTION',
  'PITCHED_PRODUCT',
  'PITCHED_SYSTEM',
  'PITCHED_SOLUTION'
);

CREATE TYPE invitation_status AS ENUM (
  'NEW',
  'ACCEPTED',
  'CANCELLED'
);

CREATE TYPE
LANGUAGE AS
ENUM (
  'da',
  'no',
  'en',
  'sv',
  'pt',
  'de',
  'nl',
  'sk',
  'fr',
  'pl',
  'es',
  'fi',
  'it'
);

CREATE TYPE message_format AS ENUM (
  'EMAIL',
  'NOTIFICATION',
  'ALL'
);

CREATE TYPE operation AS ENUM (
  'FLAT',
  'PITCHED',
  'SOLAR',
  'BITUMEN',
  'TILE',
  'COATER',
  'GREEN'
);

CREATE TYPE request_status AS ENUM (
  'NEW',
  'SUBMITTED',
  'REVIEW',
  'REJECTED',
  'APPROVED'
);

CREATE TYPE ROLE AS ENUM (
  'SUPER_ADMIN',
  'MARKET_ADMIN',
  'INSTALLER',
  'COMPANY_ADMIN'
);

CREATE TYPE technology AS ENUM (
  'FLAT',
  'PITCHED',
  'OTHER'
);

CREATE TYPE tier AS ENUM (
  'T1',
  'T2',
  'T3',
  'T4'
);

CREATE TABLE account (
  id serial PRIMARY KEY,
  status account_status,
  market_id int,
  ROLE ROLE,
  email text NOT NULL,
  phone text,
  first_name text,
  last_name text,
  created timestamp,
  docebo_user_id int,
  docebo_username text,
  photo text,
  migration_id text,
  migrated_to_auth0 boolean,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE address (
  id serial PRIMARY KEY,
  first_line text,
  second_line text,
  town text,
  region text,
  country text,
  postcode text,
  coordinates point,
  migration_id text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE certification (
  id serial PRIMARY KEY,
  docebo_user_id int,
  technology text,
  name text,
  expiry_date timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE company (
  id serial PRIMARY KEY,
  market_id int,
  registered_address_id int,
  trading_address_id int,
  owner_fullname text,
  owner_email text,
  owner_phone text,
  business_type business_type,
  tier tier,
  status company_status,
  registered_by text,
  registered_date timestamp,
  name text,
  tax_number text,
  phone text,
  about_us text,
  public_email text,
  website text,
  facebook text,
  linked_in text,
  reference_number serial,
  logo text,
  migration_id text,
  trading_address_migration_id text,
  registered_address_migration_id text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

ALTER SEQUENCE company_reference_number_seq
  RESTART WITH 1000000;

CREATE TABLE company_document (
  id serial PRIMARY KEY,
  company_id int,
  document text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE company_member (
  id serial PRIMARY KEY,
  market_id int NOT NULL,
  account_id int NOT NULL,
  company_id int NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE company_operation (
  id serial PRIMARY KEY,
  company int NOT NULL,
  operation operation NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE evidence_item (
  id serial PRIMARY KEY,
  custom_evidence_category_key custom_evidence_category_key,
  project_id int NOT NULL,
  guarantee_id int,
  evidence_category_type evidence_category_type,
  name text NOT NULL,
  attachment text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE guarantee (
  id serial PRIMARY KEY,
  file_storage_id text,
  requestor_account_id int,
  project_id int NOT NULL,
  guarantee_reference_code guarantee_reference_code NOT NULL,
  system_bmi_ref text,
  product_bmi_ref text,
  reviewer_account_id int,
  coverage guarantee_coverage,
  language_code
  LANGUAGE,
  status request_status,
  start_date timestamp,
  expiry_date timestamp,
  bmi_reference_id text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE invitation (
  id serial PRIMARY KEY,
  sender_account_id int,
  company_id int NOT NULL,
  status invitation_status NOT NULL,
  invitee text NOT NULL,
  personal_note text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE market (
  id serial PRIMARY KEY,
  LANGUAGE
  LANGUAGE NOT
  NULL,
  domain text NOT NULL,
  cms_space_id text,
  name text,
  send_name text,
  send_mailbox text,
  docebo_installers_branch_id text,
  docebo_company_admin_branch_id text,
  docebo_catalogue_id int,
  merchandising_url text,
  projects_enabled boolean,
  gtag text,
  geo_middle point,
  location_bias_radius_km int,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE note (
  id serial PRIMARY KEY,
  author_id int,
  project_id int NOT NULL,
  body text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE notification (
  id serial PRIMARY KEY,
  account_id int,
  send_date timestamp NOT NULL,
  read boolean NOT NULL DEFAULT FALSE,
  body text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE product (
  id serial PRIMARY KEY,
  market_id int NOT NULL,
  technology technology NOT NULL,
  bmi_ref text NOT NULL,
  brand text NOT NULL,
  name text NOT NULL,
  description text,
  family text NOT NULL,
  published boolean NOT NULL,
  maximum_validity_years int NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE project (
  id serial PRIMARY KEY,
  company_id int NOT NULL,
  site_address_id int,
  building_owner_address_id int,
  technology technology NOT NULL,
  name text NOT NULL,
  description text,
  hidden boolean DEFAULT FALSE,
  roof_area int NOT NULL,
  building_owner_mail text,
  building_owner_firstname text,
  building_owner_lastname text,
  building_owner_company text,
  start_date timestamp NOT NULL,
  end_date timestamp NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE project_member (
  id serial PRIMARY KEY,
  project_id int NOT NULL,
  account_id int,
  is_responsible_installer boolean,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE SYSTEM (
  id serial PRIMARY KEY,
  market_id int NOT NULL,
  technology technology NOT NULL,
  bmi_ref text NOT NULL,
  name text NOT NULL,
  description text,
  maximum_validity_years int NOT NULL,
  published boolean NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE system_member (
  id serial PRIMARY KEY,
  system_bmi_ref text NOT NULL,
  product_bmi_ref text NOT NULL,
  market_id int NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

COMMENT ON TABLE account IS 'An InTouch account';

COMMENT ON COLUMN account.id IS 'Primary key';

COMMENT ON COLUMN account.status IS 'ek';

COMMENT ON COLUMN account.market_id IS 'fk';

COMMENT ON COLUMN account.role IS 'ek';

COMMENT ON COLUMN account.email IS 'The email address associated with the account';

COMMENT ON COLUMN account.phone IS 'A phone number that can optionally be provided, and is useful for Company Admin people to provide';

COMMENT ON COLUMN account.first_name IS 'First name';

COMMENT ON COLUMN account.last_name IS 'Last name';

COMMENT ON COLUMN account.created IS 'When the account was created';

COMMENT ON COLUMN account.docebo_user_id IS 'User account in Docebo';

COMMENT ON COLUMN account.docebo_username IS 'Username in Docebo.  Needed to generate the SSO link';

COMMENT ON COLUMN account.photo IS 'File reference. A profile picture of the user';

COMMENT ON COLUMN account.migration_id IS 'Used for reference when importing data from the legacy system';

COMMENT ON COLUMN account.migrated_to_auth0 IS 'Use to know if the user it is been migrated in Auth0 (the reset password mail it is been sent)';

COMMENT ON TABLE address IS 'A generic address';

COMMENT ON COLUMN address.id IS 'Primary key';

COMMENT ON COLUMN address.first_line IS 'First line of this address';

COMMENT ON COLUMN address.second_line IS 'Second line of this address';

COMMENT ON COLUMN address.town IS 'The postal town';

COMMENT ON COLUMN address.region IS 'The region if relevant';

COMMENT ON COLUMN address.country IS 'The country for this address';

COMMENT ON COLUMN address.postcode IS 'The postcode for this address';

COMMENT ON COLUMN address.coordinates IS 'The coordinates on a map of the world';

COMMENT ON COLUMN address.migration_id IS 'Used for reference when importing data from the legacy system';

COMMENT ON TABLE certification IS 'A company that has been registered in InTouch';

COMMENT ON COLUMN certification.id IS 'Primary key';

COMMENT ON COLUMN certification.docebo_user_id IS 'fk';

COMMENT ON COLUMN certification.technology IS 'technology';

COMMENT ON COLUMN certification.name IS 'The name of the certification according to Docebo';

COMMENT ON COLUMN certification.expiry_date IS 'The last day that this certification is valid';

COMMENT ON TABLE company IS 'A company that has been registered in InTouch';

COMMENT ON COLUMN company.id IS 'Primary key';

COMMENT ON COLUMN company.market_id IS 'fk';

COMMENT ON COLUMN company.registered_address_id IS 'fk';

COMMENT ON COLUMN company.trading_address_id IS 'fk';

COMMENT ON COLUMN company.owner_fullname IS 'the name of the owner of the Company';

COMMENT ON COLUMN company.owner_email IS 'the email address to contact the owner';

COMMENT ON COLUMN company.owner_phone IS 'the phone number to contact the owner';

COMMENT ON COLUMN company.business_type IS 'ek';

COMMENT ON COLUMN company.tier IS 'ek';

COMMENT ON COLUMN company.status IS 'ek';

COMMENT ON COLUMN company.registered_by IS 'the email address of the person who filled out the company registration form';

COMMENT ON COLUMN company.registered_date IS 'the date that the Company registration form was submitted';

COMMENT ON COLUMN company.name IS 'The registered name of the Company';

COMMENT ON COLUMN company.tax_number IS 'The Tax number in that Market, such as the VAT number';

COMMENT ON COLUMN company.phone IS 'The Company public phone number';

COMMENT ON COLUMN company.about_us IS 'A descirption of the Company intended for Find a Roofer';

COMMENT ON COLUMN company.public_email IS 'The email address that they can be contacted with by the public assuming they are listed';

COMMENT ON COLUMN company.website IS 'The Company website URL';

COMMENT ON COLUMN company.facebook IS 'The Company facebook website';

COMMENT ON COLUMN company.linked_in IS 'Their Company LinkedIn page URL';

COMMENT ON COLUMN company.reference_number IS 'A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique.';

COMMENT ON COLUMN company.logo IS 'A reference to the logo image';

COMMENT ON COLUMN company.migration_id IS 'Used for reference when importing data from the legacy system';

COMMENT ON COLUMN company.trading_address_migration_id IS 'Used for reference when importing data from the legacy system';

COMMENT ON COLUMN company.registered_address_migration_id IS 'Used for reference when importing data from the legacy system';

COMMENT ON TABLE company_document IS 'A document uploaded by the Company to InTouch that appears on their Company Profile, for example an insurance certificate';

COMMENT ON COLUMN company_document.id IS 'Primary key';

COMMENT ON COLUMN company_document.company_id IS 'fk';

COMMENT ON COLUMN company_document.document IS 'The reference to the document';

COMMENT ON TABLE company_member IS 'A connection between a user and a company';

COMMENT ON COLUMN company_member.id IS 'Primary key';

COMMENT ON COLUMN company_member.market_id IS 'fk';

COMMENT ON COLUMN company_member.account_id IS 'fk';

COMMENT ON COLUMN company_member.company_id IS 'fk';

COMMENT ON TABLE company_operation IS 'The assignment of an operation type to a Company by the Market Admin.  A Company can be assigned multiple types from the allowed enums list.  The operation types that a Company has are sent to Find a Roofer.';

COMMENT ON COLUMN company_operation.id IS 'Primary key';

COMMENT ON COLUMN company_operation.company IS 'fk';

COMMENT ON COLUMN company_operation.operation IS 'ek';

COMMENT ON TABLE evidence_item IS 'A file uploaded to a project, usually as evidence to support a guarantee';

COMMENT ON COLUMN evidence_item.id IS 'Primary key';

COMMENT ON COLUMN evidence_item.custom_evidence_category_key IS 'ek';

COMMENT ON COLUMN evidence_item.project_id IS 'fk';

COMMENT ON COLUMN evidence_item.guarantee_id IS 'fk';

COMMENT ON COLUMN evidence_item.evidence_category_type IS 'ek';

COMMENT ON COLUMN evidence_item.name IS 'Short name for the item of evidence';

COMMENT ON COLUMN evidence_item.attachment IS 'File reference or the file itself. Photo of the evidence';

COMMENT ON TABLE guarantee IS 'Starts life as request for a gurantee and becomes an actual issued guarantee';

COMMENT ON COLUMN guarantee.id IS 'Primary key - starts at 6100';

COMMENT ON COLUMN guarantee.file_storage_id IS 'The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand';

COMMENT ON COLUMN guarantee.requestor_account_id IS 'fk';

COMMENT ON COLUMN guarantee.project_id IS 'fk';

COMMENT ON COLUMN guarantee.guarantee_reference_code IS 'ek';

COMMENT ON COLUMN guarantee.system_bmi_ref IS 'fk';

COMMENT ON COLUMN guarantee.product_bmi_ref IS 'fk';

COMMENT ON COLUMN guarantee.reviewer_account_id IS 'fk';

COMMENT ON COLUMN guarantee.coverage IS 'ek';

COMMENT ON COLUMN guarantee.language_code IS 'ek';

COMMENT ON COLUMN guarantee.status IS 'ek';

COMMENT ON COLUMN guarantee.start_date IS 'The date that the Guarantee is approved either automatically or manually. The date is stored in UTC.';

COMMENT ON COLUMN guarantee.expiry_date IS 'When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.
The date is stored in UTC.';

COMMENT ON COLUMN guarantee.bmi_reference_id IS 'This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Guarantee Id';

COMMENT ON TABLE invitation IS 'An invitation to join InTouch';

COMMENT ON COLUMN invitation.id IS 'Primary key';

COMMENT ON COLUMN invitation.sender_account_id IS 'fk';

COMMENT ON COLUMN invitation.company_id IS 'fk';

COMMENT ON COLUMN invitation.status IS 'ek';

COMMENT ON COLUMN invitation.invitee IS 'An email address';

COMMENT ON COLUMN invitation.personal_note IS 'An optional note that can be included in the invitation by the sender';

COMMENT ON TABLE market IS 'A country that BMI operates in';

COMMENT ON COLUMN market.id IS 'Primary key';

COMMENT ON COLUMN market.language IS 'ek';

COMMENT ON COLUMN market.domain IS 'the country code used for example as the subdomain';

COMMENT ON COLUMN market.cms_space_id IS 'The space in Contenful';

COMMENT ON COLUMN market.name IS 'A short name for the market, e.g. Italy, Norway, Netherlands';

COMMENT ON COLUMN market.send_name IS 'The From name used when sending an email';

COMMENT ON COLUMN market.send_mailbox IS 'The mailbox on intouch.bmigroup.com that emails will be sent from for this Market';

COMMENT ON COLUMN market.docebo_installers_branch_id IS 'The Docebo branch that new user are inserted into if they register as an installer.  Note that this never gets updated by InTouch.  Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach.';

COMMENT ON COLUMN market.docebo_company_admin_branch_id IS 'The Docebo branch that new user are inserted into if they register as a Company Admin. Note that this never gets updated by InTouch. Originally there was going to be a distinction between installer branches and admin branches in Docebo, but this is no longer the preferred approach.';

COMMENT ON COLUMN market.docebo_catalogue_id IS 'The default catalogue for the Market.  All users in the Market are able to see all courses in the default catalog from InTouch';

COMMENT ON COLUMN market.merchandising_url IS 'The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address';

COMMENT ON COLUMN market.projects_enabled IS 'Whether the market supports Projects.  If so then the Projects link should be available in th left hand navigation.';

COMMENT ON COLUMN market.gtag IS 'Reference to the Google Analytics tracking ID that is used for the Country GA reports';

COMMENT ON COLUMN market.geo_middle IS 'The coordinates of the middle of the Market on a map';

COMMENT ON COLUMN market.location_bias_radius_km IS 'The length of the radius in km (from the geo_middle lat/lng), for which the Google Places API biases the search results for address autocomplete. Locations outside of the radius will not be excluded.';

COMMENT ON TABLE note IS 'A note added by a BMI admin. It is likely to be either a short note regarding approval, saying something like, Approved, or Good Job, or a note explaining a rejection, saying  something like, The photographs of the roof are not clear enough.';

COMMENT ON COLUMN note.id IS 'Primary key';

COMMENT ON COLUMN note.author_id IS 'fk';

COMMENT ON COLUMN note.project_id IS 'fk';

COMMENT ON COLUMN note.body IS 'The body of the Note';

COMMENT ON TABLE notification IS 'An internal notification available to an end user';

COMMENT ON COLUMN notification.id IS 'Primary key';

COMMENT ON COLUMN notification.account_id IS 'fk';

COMMENT ON COLUMN notification.send_date IS 'The datetime stamp for when the message was sent';

COMMENT ON COLUMN notification.read IS 'Whether the message has been read';

COMMENT ON COLUMN notification.body IS 'The body of the message';

COMMENT ON TABLE product IS 'A product made by BMI';

COMMENT ON COLUMN product.id IS 'Primary key';

COMMENT ON COLUMN product.market_id IS 'fk';

COMMENT ON COLUMN product.technology IS 'ek';

COMMENT ON COLUMN product.bmi_ref IS 'A unique reference for the product known to BMI';

COMMENT ON COLUMN product.brand IS 'The Products brand';

COMMENT ON COLUMN product.name IS 'Short name for the Product';

COMMENT ON COLUMN product.description IS 'A description of the Product';

COMMENT ON COLUMN product.family IS 'The family of Products this Product is in';

COMMENT ON COLUMN product.published IS 'Whether the Product is avialable for new guarantees';

COMMENT ON COLUMN product.maximum_validity_years IS 'The number of years that this product can be guaranteed for';

COMMENT ON TABLE project IS 'A project that has been put into InTouch by a Company Administrator to represent a project being done by that company';

COMMENT ON COLUMN project.id IS 'Primary key';

COMMENT ON COLUMN project.company_id IS 'fk';

COMMENT ON COLUMN project.site_address_id IS 'fk';

COMMENT ON COLUMN project.building_owner_address_id IS 'fk';

COMMENT ON COLUMN project.technology IS 'ek';

COMMENT ON COLUMN project.name IS 'Short name for the Project';

COMMENT ON COLUMN project.description IS 'Short description of what the Project is about.  Sometimes useful to clarify some points to BMI';

COMMENT ON COLUMN project.hidden IS 'If this is true then the Project should be hidden from End Users';

COMMENT ON COLUMN project.roof_area IS 'The number of square meters of roof that this project covers';

COMMENT ON COLUMN project.building_owner_mail IS 'Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project.';

COMMENT ON COLUMN project.building_owner_firstname IS 'Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued.';

COMMENT ON COLUMN project.building_owner_lastname IS 'Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued.';

COMMENT ON COLUMN project.building_owner_company IS 'Name of the Building Owner company if there is such a thing.  Not the same as an InTouch Company.';

COMMENT ON COLUMN project.start_date IS 'The date that the Project officially starts or started';

COMMENT ON COLUMN project.end_date IS 'The date that the Project officially expects to end or ended';

COMMENT ON TABLE project_member IS 'People who are on a Project';

COMMENT ON COLUMN project_member.id IS 'Primary key';

COMMENT ON COLUMN project_member.project_id IS 'fk';

COMMENT ON COLUMN project_member.account_id IS 'fk';

COMMENT ON COLUMN project_member.is_responsible_installer IS 'The responsible installer';

COMMENT ON TABLE SYSTEM IS 'A collection of products that can be guaranteed as a system';

COMMENT ON COLUMN system.id IS 'Primary key';

COMMENT ON COLUMN system.market_id IS 'fk';

COMMENT ON COLUMN system.technology IS 'ek';

COMMENT ON COLUMN system.bmi_ref IS 'A unique reference for the system known to BMI';

COMMENT ON COLUMN system.name IS 'Short name for the System';

COMMENT ON COLUMN system.description IS 'A description for the System';

COMMENT ON COLUMN system.maximum_validity_years IS 'The maximum number of years that this system can be guaranteed for.  Must be greater than 10.';

COMMENT ON COLUMN system.published IS 'If true this system is available for users to select when applying for a system or solution guarantee';

COMMENT ON TABLE system_member IS 'A Products that make up a system';

COMMENT ON COLUMN system_member.id IS 'Primary key';

COMMENT ON COLUMN system_member.system_bmi_ref IS 'fk';

COMMENT ON COLUMN system_member.product_bmi_ref IS 'fk';

COMMENT ON COLUMN system_member.market_id IS 'fk';

CREATE OR REPLACE FUNCTION update_modified_column ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER set_account_updated_at
  BEFORE UPDATE ON account
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_address_updated_at
  BEFORE UPDATE ON address
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_certification_updated_at
  BEFORE UPDATE ON certification
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_company_updated_at
  BEFORE UPDATE ON company
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_company_document_updated_at
  BEFORE UPDATE ON company_document
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_company_member_updated_at
  BEFORE UPDATE ON company_member
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_company_operation_updated_at
  BEFORE UPDATE ON company_operation
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_evidence_item_updated_at
  BEFORE UPDATE ON evidence_item
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_guarantee_updated_at
  BEFORE UPDATE ON guarantee
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_invitation_updated_at
  BEFORE UPDATE ON invitation
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_market_updated_at
  BEFORE UPDATE ON market
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_note_updated_at
  BEFORE UPDATE ON note
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_notification_updated_at
  BEFORE UPDATE ON notification
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_product_updated_at
  BEFORE UPDATE ON product
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_project_updated_at
  BEFORE UPDATE ON project
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_project_member_updated_at
  BEFORE UPDATE ON project_member
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_system_updated_at
  BEFORE UPDATE ON SYSTEM
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE INDEX account_email_idx ON account USING btree (email);

CREATE INDEX certification_technology_idx ON certification USING btree (technology);

CREATE INDEX certification_expiry_date_idx ON certification USING btree (expiry_date);

CREATE INDEX invitation_status_idx ON invitation USING btree (status);

CREATE INDEX invitation_invitee_idx ON invitation USING btree (invitee);

CREATE INDEX market_domain_idx ON market USING btree (DOMAIN);

CREATE INDEX product_name_idx ON product USING btree (name);

CREATE INDEX project_member_is_responsible_installer_idx ON project_member USING btree (is_responsible_installer);

CREATE INDEX system_name_idx ON SYSTEM USING btree (name);

