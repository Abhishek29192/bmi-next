DROP TYPE IF EXISTS account_status CASCADE;

CREATE TYPE account_status AS ENUM (
  'NEW',
  'ACTIVE',
  'SUSPENDED'
);

DROP TYPE IF EXISTS business_type CASCADE;

CREATE TYPE business_type AS ENUM (
  'CONTRACTOR',
  'ARCHITECT',
  'MERCHANT',
  'CORP_DEVELOPER'
);

DROP TYPE IF EXISTS company_status CASCADE;

CREATE TYPE company_status AS ENUM (
  'NEW',
  'ACTIVE',
  'DEACTIVATED'
);

DROP TYPE IF EXISTS evidence_category_type CASCADE;

CREATE TYPE evidence_category_type AS ENUM (
  'PROOF_OF_PURCHASE',
  'MISCELLANEOUS',
  'CUSTOM'
);

DROP TYPE IF EXISTS invitation_status CASCADE;

CREATE TYPE invitation_status AS ENUM (
  'NEW',
  'ACCEPTED',
  'CANCELLED'
);

DROP TYPE IF EXISTS LANGUAGE CASCADE;

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
  'fi'
);

DROP TYPE IF EXISTS message_format CASCADE;

CREATE TYPE message_format AS ENUM (
  'EMAIL',
  'NOTIFICATION',
  'ALL'
);

DROP TYPE IF EXISTS operation CASCADE;

CREATE TYPE operation AS ENUM (
  'FLAT',
  'PITCHED',
  'SOLAR'
);

DROP TYPE IF EXISTS request_status CASCADE;

CREATE TYPE request_status AS ENUM (
  'NEW',
  'SUBMITTED',
  'REVIEW',
  'REJECTED',
  'APPROVED'
);

DROP TYPE IF EXISTS ROLE CASCADE;

CREATE TYPE ROLE AS ENUM (
  'SUPER_ADMIN',
  'MARKET_ADMIN',
  'INSTALLER',
  'COMPANY_ADMIN'
);

DROP TYPE IF EXISTS technology CASCADE;

CREATE TYPE technology AS ENUM (
  'FLAT',
  'PITCHED',
  'OTHER'
);

DROP TYPE IF EXISTS tier CASCADE;

CREATE TYPE tier AS ENUM (
  'T1',
  'T2',
  'T3',
  'T4'
);

DROP TABLE IF EXISTS account CASCADE;

CREATE TABLE account (
  id serial PRIMARY KEY,
  status account_status,
  market_id int,
  ROLE ROLE,
  email text,
  phone text,
  first_name text,
  last_name text,
  created timestamp,
  docebo_user_id int,
  docebo_username text,
  photo text,
  migration_id text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS address CASCADE;

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

DROP TABLE IF EXISTS certification CASCADE;

CREATE TABLE certification (
  id serial PRIMARY KEY,
  docebo_user_id int,
  technology text,
  name text,
  expiry_date timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS company CASCADE;

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
  docebo_group_id text,
  name text,
  tax_number text,
  phone text,
  about_us text,
  public_email text,
  website text,
  facebook text,
  linked_in text,
  reference_number text,
  logo text,
  migration_id text,
  trading_address_migration_id text,
  registered_address_migration_id text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS company_document CASCADE;

CREATE TABLE company_document (
  id serial PRIMARY KEY,
  company_id int,
  document text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS company_member CASCADE;

CREATE TABLE company_member (
  id serial PRIMARY KEY,
  market_id int,
  account_id int,
  company_id int,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS company_operation CASCADE;

CREATE TABLE company_operation (
  id serial PRIMARY KEY,
  company int,
  operation operation,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS evidence_item CASCADE;

CREATE TABLE evidence_item (
  id serial PRIMARY KEY,
  custom_evidence_category_id text,
  guarantee_id int,
  evidence_category_type evidence_category_type,
  name text,
  attachment text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS guarantee CASCADE;

CREATE TABLE guarantee (
  id serial PRIMARY KEY,
  file_storage_id text,
  requestor_account_id int,
  responsible_installer_account_id int,
  project_id int,
  guarantee_type_id text,
  system_bmi_ref text,
  product_bmi_ref text,
  reviewer_account_id int,
  guarantee_template_id text,
  status request_status,
  start_date timestamp,
  expiry_date timestamp,
  bmi_reference_id text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS invitation CASCADE;

CREATE TABLE invitation (
  id serial PRIMARY KEY,
  sender_account_id int,
  company_id int,
  status invitation_status,
  invitee text,
  personal_note text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS market CASCADE;

CREATE TABLE market (
  id serial PRIMARY KEY,
  LANGUAGE
  LANGUAGE,
  domain text,
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
  geo_middle text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS note CASCADE;

CREATE TABLE note (
  id serial PRIMARY KEY,
  author_id int,
  project_id int,
  body text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS notification CASCADE;

CREATE TABLE notification (
  id serial PRIMARY KEY,
  account_id int,
  send_date timestamp,
  unread boolean,
  body text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS product CASCADE;

CREATE TABLE product (
  id serial PRIMARY KEY,
  market_id int,
  technology technology,
  bmi_ref text,
  brand text,
  name text,
  description text,
  family text,
  published boolean,
  maximum_validity_years int,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS project CASCADE;

CREATE TABLE project (
  id serial PRIMARY KEY,
  company_id int,
  site_address_id int,
  building_owner_address_id int,
  technology technology,
  name text,
  description text,
  hidden boolean,
  roof_area int,
  building_owner_mail text,
  building_owner_firstname text,
  building_owner_lastname text,
  building_owner_company text,
  start_date timestamp,
  end_date timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS project_member CASCADE;

CREATE TABLE project_member (
  id serial PRIMARY KEY,
  project_id int,
  account_id int,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS SYSTEM CASCADE;

CREATE TABLE SYSTEM (
  id serial PRIMARY KEY,
  market_id int,
  technology technology,
  bmi_ref text,
  name text,
  description text,
  maximum_validity_years int,
  published boolean,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS system_member CASCADE;

CREATE TABLE system_member (
  id serial PRIMARY KEY,
  system_bmi_ref text,
  product_bmi_ref text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

TRUNCATE TABLE account RESTART IDENTITY;

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('1', 'ACTIVE', 1, 'SUPER_ADMIN', 'devs+1@digitaldetox.co.uk', '1234567', 'Chris', 'Evans', '2020-06-12 10:19:47', 13999, 'devs+1@digitaldetox.co.uk', 'https://media.spokesman.com/photos/2020/08/28/5f49c8a43a16d.hires.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('2', 'ACTIVE', 1, 'MARKET_ADMIN', 'devs+2@digitaldetox.co.uk', '1234567', 'Kim', 'Jong Un', '2020-06-12 10:19:47', 14000, 'devs+2@digitaldetox.co.uk', 'https://ichef.bbci.co.uk/news/1024/cpsprodpb/1244D/production/_117892847_tv066659879.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('3', 'ACTIVE', 1, 'COMPANY_ADMIN', 'devs+3@digitaldetox.co.uk', '1234567', 'Dom', 'Perignon', '2020-06-12 10:19:47', 13988, 'devs+3@digitaldetox.co.uk', 'https://vinepair.com/wp-content/uploads/2017/01/domperignon-internal.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('4', 'ACTIVE', 1, 'INSTALLER', 'devs+4@digitaldetox.co.uk', '1234567', 'Ben', 'Affleck', '2020-06-12 10:19:47', 13989, 'devs+4@digitaldetox.co.uk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ben_Affleck_by_Gage_Skidmore_3.jpg/440px-Ben_Affleck_by_Gage_Skidmore_3.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('5', 'ACTIVE', 1, 'INSTALLER', 'devs+5@digitaldetox.co.uk', '1234567', 'Steve', 'Jobs', '2020-06-12 10:19:47', 13990, 'devs+5@digitaldetox.co.uk', 'https://i0.wp.com/9to5mac.com/wp-content/uploads/sites/6/2021/02/Tim-Cook-remembers-Steve-Jobs.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('6', 'ACTIVE', 1, 'INSTALLER', 'devs+6@digitaldetox.co.uk', '1234567', 'Umit', 'Davala', '2020-06-12 10:19:47', 13991, 'devs+6@digitaldetox.co.uk', 'https://www.bdfutbol.com/i/j/92223b.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('7', 'ACTIVE', 1, 'COMPANY_ADMIN', 'devs+7@digitaldetox.co.uk', '1234567', 'Franz', 'Ferdinand', '2020-06-12 10:19:47', 13992, 'devs+7@digitaldetox.co.uk', 'https://images.findagrave.com/photos250/photos/2004/347/7019333_110295165370.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('8', 'ACTIVE', 1, 'INSTALLER', 'devs+8@digitaldetox.co.uk', '1234567', 'Chicho', 'Ibañez Serrador', '2020-06-12 10:19:47', 13993, 'devs+8@digitaldetox.co.uk', 'https://i2-prod.mirror.co.uk/incoming/article3775968.ece/ALTERNATES/s615b/Archduke-Franz-Ferdinand-of-Austria.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('9', 'ACTIVE', 1, 'INSTALLER', 'devs+9@digitaldetox.co.uk', '1234567', 'Nicky', 'Lauder', '2020-06-12 10:19:47', 13994, 'devs+9@digitaldetox.co.uk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Niki_Lauda_helmet_Museo_Ferrari.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('10', 'ACTIVE', 1, 'INSTALLER', 'devs+10@digitaldetox.co.uk', '1234567', 'Ian', 'McKellen', '2020-06-12 10:19:47', 13997, 'devs+10@digitaldetox.co.uk', 'https://upload.wikimedia.org/wikipedia/commons/1/15/SDCC13_-_Ian_McKellen.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('11', 'ACTIVE', 1, 'INSTALLER', 'devs+11@digitaldetox.co.uk', '1234567', 'Simon', 'Pegg', '2020-06-12 10:19:47', 13995, 'devs+11@digitaldetox.co.uk', 'https://www.onthisday.com/images/people/simon-pegg-medium.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('12', 'SUSPENDED', 1, 'INSTALLER', 'devs+12@digitaldetox.co.uk', '1234567', 'Sam', 'Smith', '2020-06-12 10:19:47', 13996, 'devs+12@digitaldetox.co.uk', 'https://cdn.britannica.com/65/187865-050-6A95231B/Sam-Smith-British.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('13', 'ACTIVE', 1, 'INSTALLER', 'devs+13@digitaldetox.co.uk', '1234567', 'Alessandro', 'Del Piero', '2020-06-12 10:19:47', 13998, 'devs+13@digitaldetox.co.uk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Alessandro_Del_Piero_in_2014.jpg', NULL);

TRUNCATE TABLE address RESTART IDENTITY;

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('1', 'Blue Star House', '234-244 Stockwell Road, Brixton, London. SW9 9SP', 'Brixton', 'London', 'UK', 'SW9 9SP', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('2', 'Piazza di Trevi', NULL, 'Rome', NULL, 'Italy', '00187 Roma RM', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('3', '328 Coldharbour Lane', 'Brixton', 'London', NULL, 'UK', 'SW9 8QH', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('4', 'Nursery Rd', 'Brixton', 'London', NULL, 'UK', 'SW9 8BP', '(51.4632583,-0.1194107)', NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('5', 'Praça do Príncipe Real 23 24', 'Near the Castle', 'Lisbon', NULL, 'Portugal', '1250-096 Lisboa', '(38.7170416,-9.1510413)', NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('6', '39 Old Castle Rd, Weymouth DT4 8QE', NULL, 'Weymouth', 'Wessex', 'UK', 'DT4 8QE', '(10.6971494,-72.2598689)', NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('7', '1 Brixton Hill', 'Brixton', NULL, 'London', 'UK', 'SW2 1RW', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('8', '49 Brixton Station Rd', 'Brixton', NULL, 'London', 'UK', 'SW9 8PQ', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('9', '211 Stockwell Rd', 'Brixton', NULL, 'London', 'UK', 'SW9 9SL', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('10', '103 Gaunt St', 'Lambeth', NULL, 'London', 'UK', 'London SE1 6DP', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('11', '12 Alice Mansions', 'Soho', NULL, 'London', 'UK', 'UK W1A', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('12', '15 Bob Monk House', 'Covent Garden', NULL, 'London', 'UK', 'W1C8RJ', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('13', '23 Shakespeare House', 'Barbican', NULL, 'London', 'UK', 'EC1', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('14', '4 Oxford Street', NULL, NULL, 'London', 'UK', 'W1B 5LP', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('15', 'Next to Bluestar House', '234-244 Stockwell Road, Brixton, London. SW9 9SP', 'Brixton', 'London', 'UK', 'SW9 9SP', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('16', '4 Oxford Street', NULL, NULL, 'London', 'UK', 'W1B 5LP', NULL, NULL);

TRUNCATE TABLE certification RESTART IDENTITY;

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('1', 13988, 'FLAT', 'BMI Flat Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('2', 13991, 'FLAT', 'BMI Flat Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('3', 13992, 'FLAT', 'BMI Flat Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('4', 13993, 'FLAT', 'BMI Flat Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('5', 13988, 'PITCHED', 'Slope Master Certified', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('6', 13992, 'PITCHED', 'BMI Pitched Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('7', 13993, 'PITCHED', 'BMI Pitched Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('8', 13989, 'PITCHED', 'BMI Pitched Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('9', 13990, 'PITCHED', 'BMI Pitched Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('10', 13991, 'PITCHED', 'BMI Pitched Roof Technology Certification (12 months)', '2021-05-28 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('11', 13994, 'Other', 'BMI Contractor Health & Safety Certification (12 months)', '2023-12-18 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('12', 13998, 'FLAT', 'BMI Flat Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('13', 13998, 'PITCHED', NULL, '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('14', 13997, 'FLAT', 'BMI Flat Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('15', 13997, 'PITCHED', NULL, '2022-01-01 12:00:00');

TRUNCATE TABLE company RESTART IDENTITY;

INSERT INTO company (id, market_id, registered_address_id, trading_address_id, owner_fullname, owner_email, owner_phone, business_type, tier, status, registered_by, registered_date, docebo_group_id, name, tax_number, phone, about_us, public_email, website, facebook, linked_in, reference_number, logo, migration_id, trading_address_migration_id, registered_address_migration_id)
  VALUES ('1', 1, 1, 4, 'Don Cheadle', 'don@test.com', '1232123', 'CONTRACTOR', 'T2', 'ACTIVE', 'twhorlton0@miibeian.gov.cn', '2020-10-20 12:00:00', '142214', 'Integrated Solutions Inc', '63323-463', '843-985-4588', 'We put stuff together really quickly without any fuss', 'lfoskin0@paypal.com', 'https://sphinn.com', 'https://www.facebook.com/WhiteHouse/', 'https://www.linkedin.com/company/the-white-house', '0093-7392', 'https://favpng.com/png_view/the-railcar-wikimedia-commonssnowman-buttons-cliparts-creative-commons-license-share-alike-escape-artistry-png/G2phAUt6', NULL, NULL, NULL);

INSERT INTO company (id, market_id, registered_address_id, trading_address_id, owner_fullname, owner_email, owner_phone, business_type, tier, status, registered_by, registered_date, docebo_group_id, name, tax_number, phone, about_us, public_email, website, facebook, linked_in, reference_number, logo, migration_id, trading_address_migration_id, registered_address_migration_id)
  VALUES ('2', 1, 2, 5, 'Liam Gallagher', 'liam@test.com', '234234', 'CONTRACTOR', 'T4', 'ACTIVE', 'mbrosch1@go.com', '2020-11-20 12:00:00', '52355', 'Pathfinder Construction Ltd', '0378-4094', '757-208-9959', 'We build really hard things that support everything else', 'ssnipe1@pen.io', 'https://oracle.com', 'https://www.facebook.com/europeanparliament', 'https://www.linkedin.com/company/eu', '64772-300', 'https://favpng.com/png_view/file-ussr-star-wikimedia-commons-russia-soviet-union-red-star-png/WEtg4eiw', NULL, NULL, NULL);

INSERT INTO company (id, market_id, registered_address_id, trading_address_id, owner_fullname, owner_email, owner_phone, business_type, tier, status, registered_by, registered_date, docebo_group_id, name, tax_number, phone, about_us, public_email, website, facebook, linked_in, reference_number, logo, migration_id, trading_address_migration_id, registered_address_migration_id)
  VALUES ('3', 1, 3, 6, 'Charlotte Church', 'charlotte@test.com', '345345', 'CONTRACTOR', 'T3', 'DEACTIVATED', 'dhechlin2@amazon.com', '2020-9-20 12:00:00', '4666', 'dXB Roofing PLC', '49738-530', '843-584-2619', 'We build stuff that looks great', 'liacovielli2@discovery.com', 'https://utexas.edu', 'https://www.facebook.com/Sony/', 'https://in.linkedin.com/company/sony', '0179-0110', 'https://favpng.com/png_view/lotus-wikimedia-commons-clip-art-png/10vQG4nP', NULL, NULL, NULL);

TRUNCATE TABLE company_document RESTART IDENTITY;

INSERT INTO company_document (id, company_id, document)
  VALUES ('1', 1, 'http://www.africau.edu/images/default/sample.pdf');

TRUNCATE TABLE company_member RESTART IDENTITY;

INSERT INTO company_member (id, market_id, account_id, company_id)
  VALUES ('1', 1, 3, 1);

INSERT INTO company_member (id, market_id, account_id, company_id)
  VALUES ('2', 1, 4, 1);

INSERT INTO company_member (id, market_id, account_id, company_id)
  VALUES ('3', 1, 5, 1);

INSERT INTO company_member (id, market_id, account_id, company_id)
  VALUES ('4', 1, 6, 1);

INSERT INTO company_member (id, market_id, account_id, company_id)
  VALUES ('5', 1, 7, 2);

INSERT INTO company_member (id, market_id, account_id, company_id)
  VALUES ('6', 1, 8, 2);

INSERT INTO company_member (id, market_id, account_id, company_id)
  VALUES ('7', 1, 9, 2);

INSERT INTO company_member (id, market_id, account_id, company_id)
  VALUES ('8', 1, 10, 3);

TRUNCATE TABLE company_operation RESTART IDENTITY;

INSERT INTO company_operation (id, company, operation)
  VALUES ('1', 1, 'PITCHED');

INSERT INTO company_operation (id, company, operation)
  VALUES ('2', 1, 'FLAT');

INSERT INTO company_operation (id, company, operation)
  VALUES ('3', 2, 'FLAT');

INSERT INTO company_operation (id, company, operation)
  VALUES ('4', 3, 'PITCHED');

INSERT INTO company_operation (id, company, operation)
  VALUES ('5', 3, 'FLAT');

INSERT INTO company_operation (id, company, operation)
  VALUES ('6', 3, 'SOLAR');

TRUNCATE TABLE evidence_item RESTART IDENTITY;

INSERT INTO evidence_item (id, custom_evidence_category_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('1', NULL, 1, 'PROOF_OF_PURCHASE', 'stock-vector-realistic-paper-shop-receipt-with-barcode-vector-shop-terminal-768909406.jpg', 'https://image.shutterstock.com/z/stock-vector-realistic-paper-shop-receipt-with-barcode-vector-shop-terminal-768909406.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('2', NULL, 2, 'PROOF_OF_PURCHASE', '450px-Interior_drain_replacement.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Interior_drain_replacement.jpg/450px-Interior_drain_replacement.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('3', NULL, 3, 'PROOF_OF_PURCHASE', '450px-Interior_drain_replacement.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Interior_drain_replacement.jpg/450px-Interior_drain_replacement.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('4', '3ka17lbEy4ENxBKQC4CY4V', 3, 'CUSTOM', 'gargoyle-images-manchester-600w-71247169.jpg', 'https://c7.alamy.com/comp/FK32Y4/st-matthews-church-in-brixton-hill-south-london-FK32Y4.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('5', '3ka17lbEy4ENxBKQC4CY4V', 3, 'CUSTOM', 'gargoyle-fountain-detail-close-600w-499048789.jpg', 'https://image.shutterstock.com/image-photo/gargoyle-fountain-detail-close-600w-499048789.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('6', '7j0FaWCBSVanXJqaZrDyvP', 3, 'CUSTOM', 'dancing-friends-600w-717409222.jpg', 'https://image.shutterstock.com/image-photo/dancing-friends-600w-717409222.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('7', '5FbxiRcMYuY6txgoVAnWJm', 3, 'CUSTOM', 'Army_Photography_Contest_-_2007_-_FMWRC_-_Arts_and_Crafts_-_A_Plumpish_Proportion_%284930276154%29.jpg', 'https://image.shutterstock.com/image-photo/dramatic-picture-frozen-medieval-dragon-600w-131654306.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('8', '3ka17lbEy4ENxBKQC4CY4V', 4, 'CUSTOM', 'ministry-of-sound-24-1.jpg', 'https://paradise.london/wp-content/uploads/2019/08/ministry-of-sound-24-1.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('9', '3ka17lbEy4ENxBKQC4CY4V', 4, 'CUSTOM', 'prague-czech-republic-august-172019-600w-1722304249.jpg', 'https://image.shutterstock.com/image-photo/prague-czech-republic-august-172019-600w-1722304249.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('10', '7j0FaWCBSVanXJqaZrDyvP', 4, 'CUSTOM', 'rooftop-party.html', 'https://depositphotos.com/stock-photos/rooftop-party.html');

INSERT INTO evidence_item (id, custom_evidence_category_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('11', '5FbxiRcMYuY6txgoVAnWJm', 4, 'CUSTOM', 'Ceiling-leak.jpg', 'https://rennisonroofing.com/wp-content/uploads/2020/04/Ceiling-leak.jpg');

TRUNCATE TABLE guarantee RESTART IDENTITY;

INSERT INTO guarantee (id, file_storage_id, requestor_account_id, responsible_installer_account_id, project_id, guarantee_type_id, system_bmi_ref, product_bmi_ref, reviewer_account_id, guarantee_template_id, status, start_date, expiry_date, bmi_reference_id)
  VALUES ('1', 'http://www.africau.edu/images/default/sample.pdf', 3, NULL, 1, '6ivLobJgk2jd0Tm3fwA48u', NULL, 'P1', NULL, '1hkU39ASbE4oYoBREitkgV', 'APPROVED', '2021-04-20 12:00:00', '2061-04-20 12:00:00', 'C1P1G1');

INSERT INTO guarantee (id, file_storage_id, requestor_account_id, responsible_installer_account_id, project_id, guarantee_type_id, system_bmi_ref, product_bmi_ref, reviewer_account_id, guarantee_template_id, status, start_date, expiry_date, bmi_reference_id)
  VALUES ('2', 'http://www.africau.edu/images/default/sample.pdf', 3, NULL, 1, '6ivLobJgk2jd0Tm3fwA48u', NULL, 'P3', NULL, '1hkU39ASbE4oYoBREitkgV', 'APPROVED', '2021-04-20 12:00:00', '2051-04-20 12:00:00', 'C1P2G2');

INSERT INTO guarantee (id, file_storage_id, requestor_account_id, responsible_installer_account_id, project_id, guarantee_type_id, system_bmi_ref, product_bmi_ref, reviewer_account_id, guarantee_template_id, status, start_date, expiry_date, bmi_reference_id)
  VALUES ('3', 'http://www.africau.edu/images/default/sample.pdf', 7, 7, 3, '54S9J770q5T2jPYxptah89', 'S3', NULL, NULL, '2cH694AWInJSZIdKHDKfJO', 'REJECTED', NULL, NULL, 'C2P3G3');

INSERT INTO guarantee (id, file_storage_id, requestor_account_id, responsible_installer_account_id, project_id, guarantee_type_id, system_bmi_ref, product_bmi_ref, reviewer_account_id, guarantee_template_id, status, start_date, expiry_date, bmi_reference_id)
  VALUES ('4', 'http://www.africau.edu/images/default/sample.pdf', 13, NULL, 4, '54S9J770q5T2jPYxptah89', 'S3', NULL, 1, '2cH694AWInJSZIdKHDKfJO', 'APPROVED', '2020-12-29 12:00:00', '2050-12-29 12:00:00', 'C3P4G4');

TRUNCATE TABLE invitation RESTART IDENTITY;

INSERT INTO invitation (id, sender_account_id, company_id, status, invitee, personal_note)
  VALUES ('1', 3, 1, 'NEW', 'devs+13@digitaldetox.co.uk', 'Hi Alex, come and join the team');

INSERT INTO invitation (id, sender_account_id, company_id, status, invitee, personal_note)
  VALUES ('2', 3, 1, 'NEW', 'devs+14@digitaldetox.co.uk', 'Hi, come and join the team');

TRUNCATE TABLE market RESTART IDENTITY;

INSERT INTO market (id,
  LANGUAGE, DOMAIN, cms_space_id, name, send_name, send_mailbox, docebo_installers_branch_id, docebo_company_admin_branch_id, docebo_catalogue_id, merchandising_url, projects_enabled, gtag, geo_middle)
  VALUES ('1', 'en', 'mp', 'opay6t6wwmup', 'Mapleland', 'BMI Intouch Mapleland', 'mapleland@intouch.bmigroup.com', '41', '41', 345, 'tbc2', TRUE, 'tbc1', '42.7684,-78.8871');

INSERT INTO market (id,
  LANGUAGE, DOMAIN, cms_space_id, name, send_name, send_mailbox, docebo_installers_branch_id, docebo_company_admin_branch_id, docebo_catalogue_id, merchandising_url, projects_enabled, gtag, geo_middle)
  VALUES ('2', 'en', 'tra', 'opay6t6wwmup', 'Transatlantia', 'BMI Intouch Mapleland', 'transatlantia@intouch.bmigroup.com', '41', '41', 123, 'tbc2', TRUE, 'tbc1', '27.9139,-82.7157');

TRUNCATE TABLE note RESTART IDENTITY;

INSERT INTO note (id, author_id, project_id, body)
  VALUES ('1', 2, 4, 'Good job Alex');

INSERT INTO note (id, author_id, project_id, body)
  VALUES ('2', 1, 3, 'Please use compaitble buffing material');

TRUNCATE TABLE notification RESTART IDENTITY;

INSERT INTO notification (id, account_id, send_date, unread, body)
  VALUES ('1', 3, '2021-05-17 21:20:11', FALSE, 'On a dark desert highway');

INSERT INTO notification (id, account_id, send_date, unread, body)
  VALUES ('2', 3, '2021-05-16 21:20:11', TRUE, 'Cool wind in my hair');

INSERT INTO notification (id, account_id, send_date, unread, body)
  VALUES ('3', 3, '2021-05-15 21:20:11', FALSE, 'Warm smell of colitas rising up through the air');

INSERT INTO notification (id, account_id, send_date, unread, body)
  VALUES ('4', 7, '2021-05-11 21:20:11', TRUE, 'and thence we issued forth to see again the stars');

INSERT INTO notification (id, account_id, send_date, unread, body)
  VALUES ('5', 7, '2021-05-12 21:20:11', FALSE, 'All hope abandon, ye who enter here!');

INSERT INTO notification (id, account_id, send_date, unread, body)
  VALUES ('6', 7, '2021-05-13 21:20:11', TRUE, 'The wisest are the most annoyed at the loss of time');

TRUNCATE TABLE product RESTART IDENTITY;

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('1', 1, 'PITCHED', 'P1', 'Braas', 'Super Tile', 'The best tile in the business. Lasts for years', 'Asoka', TRUE, 40);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('2', 1, 'PITCHED', 'P2', 'Braas', 'Super Slate', 'For a really heavy duty pitched roof you need this little beauty', 'Asoka', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('3', 1, 'PITCHED', 'P3', 'Braas', 'Dryfit Membrane', 'Roll it out and its done. Bish bash bosh.', 'Asoka', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('4', 1, 'FLAT', 'P4', 'Monier', 'Funny Felt', 'Does this tickle your fancy.  How about the hardest shingling known to science...', 'Alphazap', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('5', 1, 'FLAT', 'P5', 'Cobert', 'Licorice Bitumen', 'Black and gooey.  That is all you need to know.  And it sticks.', 'Alphazap', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('6', 1, 'FLAT', 'P6', 'Cobert', 'Oozomatic Bitumen', 'Black and gooey.  That is all you need to know.  And it sticks.', 'Alphazap', FALSE, 30);

TRUNCATE TABLE project RESTART IDENTITY;

INSERT INTO project (id, company_id, site_address_id, building_owner_address_id, technology, name, description, hidden, roof_area, building_owner_mail, building_owner_firstname, building_owner_lastname, building_owner_company, start_date, end_date)
  VALUES ('1', 1, 7, 11, 'PITCHED', 'St Matthews Church', 'Fix the roof', FALSE, 504, 'ccardenoza0@sogou.com', 'Alice', 'Malice', 'Alice in Cheam', '2021-01-01 08:23:58', '2021-01-04 08:23:58');

INSERT INTO project (id, company_id, site_address_id, building_owner_address_id, technology, name, description, hidden, roof_area, building_owner_mail, building_owner_firstname, building_owner_lastname, building_owner_company, start_date, end_date)
  VALUES ('2', 1, 8, 12, 'FLAT', 'Pop Brixton', 'Replace the roof', FALSE, 166, 'achazelle1@statcounter.com', 'Bob', 'Bigwick', NULL, '2021-07-01 08:23:58', '2021-11-04 08:23:58');

INSERT INTO project (id, company_id, site_address_id, building_owner_address_id, technology, name, description, hidden, roof_area, building_owner_mail, building_owner_firstname, building_owner_lastname, building_owner_company, start_date, end_date)
  VALUES ('3', 2, 9, 13, 'FLAT', 'Brixton Academy', 'Do up the roof', FALSE, 147, 'jkirkpatrick2@unesco.org', 'Charlie', 'Wright', 'Wright Brothers', '2021-01-02 08:23:58', '2021-02-04 08:23:58');

INSERT INTO project (id, company_id, site_address_id, building_owner_address_id, technology, name, description, hidden, roof_area, building_owner_mail, building_owner_firstname, building_owner_lastname, building_owner_company, start_date, end_date)
  VALUES ('4', 3, 10, 14, 'FLAT', 'Ministry of Sound', 'Waterproof old roof', TRUE, 731, 'kferrarini3@smugmug.com', 'Dave', 'Le Rave', NULL, '2020-11-04 08:23:58', '2020-12-04 08:23:58');

INSERT INTO project (id, company_id, site_address_id, building_owner_address_id, technology, name, description, hidden, roof_area, building_owner_mail, building_owner_firstname, building_owner_lastname, building_owner_company, start_date, end_date)
  VALUES ('5', 2, 15, 16, 'FLAT', 'Nandos', 'Put in outdoor seating area', FALSE, 50, 'kferrarini3@smugmug.com', 'Dave', 'Le Rave', NULL, '2021-02-04 08:23:58', '2021-12-04 08:23:58');

TRUNCATE TABLE project_member RESTART IDENTITY;

INSERT INTO project_member (id, project_id, account_id)
  VALUES ('1', 1, 3);

INSERT INTO project_member (id, project_id, account_id)
  VALUES ('2', 1, 4);

INSERT INTO project_member (id, project_id, account_id)
  VALUES ('3', 1, 5);

INSERT INTO project_member (id, project_id, account_id)
  VALUES ('4', 2, 3);

INSERT INTO project_member (id, project_id, account_id)
  VALUES ('5', 2, 5);

INSERT INTO project_member (id, project_id, account_id)
  VALUES ('6', 2, 6);

INSERT INTO project_member (id, project_id, account_id)
  VALUES ('7', 3, 7);

INSERT INTO project_member (id, project_id, account_id)
  VALUES ('8', 3, 8);

INSERT INTO project_member (id, project_id, account_id)
  VALUES ('9', 3, 9);

INSERT INTO project_member (id, project_id, account_id)
  VALUES ('10', 4, 10);

TRUNCATE TABLE SYSTEM RESTART IDENTITY;

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('1', 1, 'PITCHED', 'S1', 'Aphazap Total Tile', 'For the perfect pitched roof', 30, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('2', 1, 'PITCHED', 'S2', 'Aphazap Total Slate', 'For the perfect pitched roof', 30, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('3', 1, 'FLAT', 'S3', 'BMI Flat Pack', 'A bag of roofing goodness', 30, TRUE);

TRUNCATE TABLE system_member RESTART IDENTITY;

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref)
  VALUES ('1', 'S1', 'P1');

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref)
  VALUES ('2', 'S1', 'P3');

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref)
  VALUES ('3', 'S2', 'P2');

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref)
  VALUES ('4', 'S2', 'P3');

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref)
  VALUES ('5', 'S3', 'P4');

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref)
  VALUES ('6', 'S3', 'P5');

ALTER TABLE account
  ADD UNIQUE (docebo_user_id);

ALTER TABLE market
  ADD UNIQUE (DOMAIN);

ALTER TABLE market
  ADD UNIQUE (docebo_catalogue_id);

ALTER TABLE product
  ADD UNIQUE (bmi_ref);

ALTER TABLE SYSTEM
  ADD UNIQUE (bmi_ref);

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
  ADD FOREIGN KEY (guarantee_id) REFERENCES guarantee (id) ON DELETE CASCADE;

CREATE INDEX ON evidence_item (guarantee_id);

ALTER TABLE guarantee
  ADD FOREIGN KEY (requestor_account_id) REFERENCES account (id) ON DELETE CASCADE;

CREATE INDEX ON guarantee (requestor_account_id);

ALTER TABLE guarantee
  ADD FOREIGN KEY (responsible_installer_account_id) REFERENCES account (id) ON DELETE CASCADE;

CREATE INDEX ON guarantee (responsible_installer_account_id);

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

COMMENT ON TABLE account IS 'An InTouch account';

COMMENT ON COLUMN account.id IS 'Primary key';

COMMENT ON COLUMN account.status IS 'ek';

COMMENT ON COLUMN account.market_id IS 'fk';

COMMENT ON COLUMN account.role IS 'ek';

COMMENT ON COLUMN account.email IS 'The mail address associated with the account';

COMMENT ON COLUMN account.phone IS 'A phone number that can optionally be provided, and is useful for Company Admin people to provide';

COMMENT ON COLUMN account.first_name IS 'First name';

COMMENT ON COLUMN account.last_name IS 'Last name';

COMMENT ON COLUMN account.created IS 'When the account was created';

COMMENT ON COLUMN account.docebo_user_id IS 'User account in Docebo';

COMMENT ON COLUMN account.docebo_username IS 'Username in Docebo.  Needed to generate the SSO link';

COMMENT ON COLUMN account.photo IS 'File reference. A profile picture of the user';

COMMENT ON COLUMN account.migration_id IS 'Used for reference when importing data from the legacy system';

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

COMMENT ON COLUMN company.docebo_group_id IS 'The Group ID of the company in Docebo';

COMMENT ON COLUMN company.name IS 'The registered name of the Company';

COMMENT ON COLUMN company.tax_number IS 'The Tax number in that Market, such as the VAT number';

COMMENT ON COLUMN company.phone IS 'They Company public phone number';

COMMENT ON COLUMN company.about_us IS 'A bit of blurb to appear in Find a contractor';

COMMENT ON COLUMN company.public_email IS 'The email address that they can be contacted with by the public assuming they are listed';

COMMENT ON COLUMN company.website IS 'The Company website URL';

COMMENT ON COLUMN company.facebook IS 'The Company facebook website';

COMMENT ON COLUMN company.linked_in IS 'Their Company LinkedIn page URL';

COMMENT ON COLUMN company.reference_number IS 'A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. ';

COMMENT ON COLUMN company.logo IS 'A reference to the logo';

COMMENT ON COLUMN company.migration_id IS 'Used for reference when importing data from the legacy system';

COMMENT ON COLUMN company.trading_address_migration_id IS 'Used for reference when importing data from the legacy system';

COMMENT ON COLUMN company.registered_address_migration_id IS 'Used for reference when importing data from the legacy system';

COMMENT ON TABLE company_document IS 'A document uploaded by the Company to InTouch that appears on their Company Profile, for example an insurance certificate';

COMMENT ON COLUMN company_document.id IS 'Primary key';

COMMENT ON COLUMN company_document.company_id IS 'fk';

COMMENT ON COLUMN company_document.document IS 'The document itself or the path to it';

COMMENT ON TABLE company_member IS 'A connection between a user and a company';

COMMENT ON COLUMN company_member.id IS 'Primary key';

COMMENT ON COLUMN company_member.market_id IS 'fk';

COMMENT ON COLUMN company_member.account_id IS 'fk';

COMMENT ON COLUMN company_member.company_id IS 'fk';

COMMENT ON TABLE company_operation IS 'The assignment of an operation type to a Company by the Market Admin.  A Company can be assigned multiple types from the allowed enums list.  The operation types that a Company has are sent to Find a Roofer.';

COMMENT ON COLUMN company_operation.id IS 'Primary key';

COMMENT ON COLUMN company_operation.company IS 'fk';

COMMENT ON COLUMN company_operation.operation IS 'ek';

COMMENT ON TABLE evidence_item IS 'An file uploaded to a project, usually as evidence to support a guarantee';

COMMENT ON COLUMN evidence_item.id IS 'Primary key';

COMMENT ON COLUMN evidence_item.custom_evidence_category_id IS 'a reference to the evidenceCategory sys id in Contentful';

COMMENT ON COLUMN evidence_item.guarantee_id IS 'fk';

COMMENT ON COLUMN evidence_item.evidence_category_type IS 'ek';

COMMENT ON COLUMN evidence_item.name IS 'Short name for the item of evidence';

COMMENT ON COLUMN evidence_item.attachment IS 'File reference or the file itself. Photo of the evidence';

COMMENT ON TABLE guarantee IS 'Starts life as request for a gurantee and becomes an actual issued guarantee';

COMMENT ON COLUMN guarantee.id IS 'Primary key - starts at 6100';

COMMENT ON COLUMN guarantee.file_storage_id IS 'The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand';

COMMENT ON COLUMN guarantee.requestor_account_id IS 'fk';

COMMENT ON COLUMN guarantee.responsible_installer_account_id IS 'fk';

COMMENT ON COLUMN guarantee.project_id IS 'fk';

COMMENT ON COLUMN guarantee.guarantee_type_id IS 'a reference to the guaranteeType sys id in Contentful';

COMMENT ON COLUMN guarantee.system_bmi_ref IS 'fk';

COMMENT ON COLUMN guarantee.product_bmi_ref IS 'fk';

COMMENT ON COLUMN guarantee.reviewer_account_id IS 'fk';

COMMENT ON COLUMN guarantee.guarantee_template_id IS 'a reference to the guaranteeType sys id in Contentful';

COMMENT ON COLUMN guarantee.status IS 'ek';

COMMENT ON COLUMN guarantee.start_date IS 'The date that the Guarantee is approved either automatically or manually';

COMMENT ON COLUMN guarantee.expiry_date IS 'When the guarantee will expire.  This is calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier';

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

COMMENT ON COLUMN market.docebo_installers_branch_id IS 'The default branch in Docebo that installers go into';

COMMENT ON COLUMN market.docebo_company_admin_branch_id IS 'The branch in Docebo that company admins go into';

COMMENT ON COLUMN market.docebo_catalogue_id IS 'The default catalogue for the market.  All users in the market are able to see all courses in the default catalog from InTouch';

COMMENT ON COLUMN market.merchandising_url IS 'The address of the merchandising site for the market.  CTAs of the MERCHANDISING type will link to this address';

COMMENT ON COLUMN market.projects_enabled IS 'Whether the market supports Projects.  If so then the Project section is available.';

COMMENT ON COLUMN market.gtag IS 'Reference to the Google Analytics tracking ID that is used for the Country GA reports';

COMMENT ON COLUMN market.geo_middle IS 'The coordinates of the middle of the Market on a map';

COMMENT ON TABLE note IS 'Usually a note added by someone at BMI who has been asked to approve a Guarantee.  It is likely to be either a short note of approval, saying something like, Approved, or Good Job, or a note of rejection, saying  something like, The photographs of the roof are not clear enough.';

COMMENT ON COLUMN note.id IS 'Primary key';

COMMENT ON COLUMN note.author_id IS 'fk';

COMMENT ON COLUMN note.project_id IS 'fk';

COMMENT ON COLUMN note.body IS 'The body of the Note';

COMMENT ON TABLE notification IS 'An internal notification available to an end user';

COMMENT ON COLUMN notification.id IS 'Primary key';

COMMENT ON COLUMN notification.account_id IS 'fk';

COMMENT ON COLUMN notification.send_date IS 'The datetime stamp for when the message was sent';

COMMENT ON COLUMN notification.unread IS 'Whether the message still needs to be read';

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

COMMENT ON COLUMN project.building_owner_company IS 'Name of the Building Owners Company if it is known';

COMMENT ON COLUMN project.start_date IS 'The date that the Project starts';

COMMENT ON COLUMN project.end_date IS 'The date that the Project expects to end';

COMMENT ON TABLE project_member IS 'People who are on a Project';

COMMENT ON COLUMN project_member.id IS 'Primary key';

COMMENT ON COLUMN project_member.project_id IS 'fk';

COMMENT ON COLUMN project_member.account_id IS 'fk';

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

SELECT
  SETVAL('account_id_seq', (
      SELECT
        MAX(ID)
      FROM account));

SELECT
  SETVAL('address_id_seq', (
      SELECT
        MAX(ID)
      FROM address));

SELECT
  SETVAL('certification_id_seq', (
      SELECT
        MAX(ID)
      FROM certification));

SELECT
  SETVAL('company_id_seq', (
      SELECT
        MAX(ID)
      FROM company));

SELECT
  SETVAL('company_document_id_seq', (
      SELECT
        MAX(ID)
      FROM company_document));

SELECT
  SETVAL('company_member_id_seq', (
      SELECT
        MAX(ID)
      FROM company_member));

SELECT
  SETVAL('company_operation_id_seq', (
      SELECT
        MAX(ID)
      FROM company_operation));

SELECT
  SETVAL('evidence_item_id_seq', (
      SELECT
        MAX(ID)
      FROM evidence_item));

SELECT
  SETVAL('guarantee_id_seq', (
      SELECT
        MAX(ID)
      FROM guarantee));

SELECT
  SETVAL('invitation_id_seq', (
      SELECT
        MAX(ID)
      FROM invitation));

SELECT
  SETVAL('market_id_seq', (
      SELECT
        MAX(ID)
      FROM market));

SELECT
  SETVAL('note_id_seq', (
      SELECT
        MAX(ID)
      FROM note));

SELECT
  SETVAL('notification_id_seq', (
      SELECT
        MAX(ID)
      FROM notification));

SELECT
  SETVAL('product_id_seq', (
      SELECT
        MAX(ID)
      FROM product));

SELECT
  SETVAL('project_id_seq', (
      SELECT
        MAX(ID)
      FROM project));

SELECT
  SETVAL('project_member_id_seq', (
      SELECT
        MAX(ID)
      FROM project_member));

SELECT
  SETVAL('system_id_seq', (
      SELECT
        MAX(ID)
      FROM SYSTEM));

SELECT
  SETVAL('system_member_id_seq', (
      SELECT
        MAX(ID)
      FROM system_member));

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

CREATE INDEX invitation_invitee_idx ON invitation USING btree (invitee);

CREATE INDEX market_domain_idx ON market USING btree (DOMAIN);

