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
  'SOLAR',
  'BITUMEN',
  'TILE',
  'COATER',
  'GREEN'
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
  email text NOT NULL,
  phone text,
  first_name text NOT NULL,
  last_name text NOT NULL,
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
  first_line text NOT NULL,
  second_line text,
  town text,
  region text,
  country text,
  postcode text NOT NULL,
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
  project_id int,
  guarantee_id int,
  evidence_category_type evidence_category_type,
  name text NOT NULL,
  attachment text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS guarantee CASCADE;

CREATE TABLE guarantee (
  id serial PRIMARY KEY,
  file_storage_id text,
  requestor_account_id int,
  project_id int,
  guarantee_type_id text NOT NULL,
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
  invitee text NOT NULL,
  personal_note text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS market CASCADE;

CREATE TABLE market (
  id serial PRIMARY KEY,
  LANGUAGE
  LANGUAGE,
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
  send_date timestamp NOT NULL,
  read boolean NOT NULL DEFAULT FALSE,
  body text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS product CASCADE;

CREATE TABLE product (
  id serial PRIMARY KEY,
  market_id int,
  technology technology,
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

DROP TABLE IF EXISTS project CASCADE;

CREATE TABLE project (
  id serial PRIMARY KEY,
  company_id int,
  site_address_id int,
  building_owner_address_id int,
  technology technology,
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

DROP TABLE IF EXISTS project_member CASCADE;

CREATE TABLE project_member (
  id serial PRIMARY KEY,
  project_id int,
  account_id int,
  is_responsible_installer boolean,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS SYSTEM CASCADE;

CREATE TABLE SYSTEM (
  id serial PRIMARY KEY,
  market_id int,
  technology technology,
  bmi_ref text NOT NULL,
  name text NOT NULL,
  description text,
  maximum_validity_years int NOT NULL,
  published boolean NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS system_member CASCADE;

CREATE TABLE system_member (
  id serial PRIMARY KEY,
  system_bmi_ref text,
  product_bmi_ref text,
  market_id int,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

TRUNCATE TABLE account RESTART IDENTITY;

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('1', 'ACTIVE', NULL, 'SUPER_ADMIN', 'devs+1@digitaldetox.co.uk', '1234567', 'Chris', 'Evans', '2020-06-12 10:19:47', 13999, 'devs+1@digitaldetox.co.uk', 'https://media.spokesman.com/photos/2020/08/28/5f49c8a43a16d.hires.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('2', 'ACTIVE', 1, 'MARKET_ADMIN', 'devs+2@digitaldetox.co.uk', '1234567', 'Kim', 'Jong Un', '2020-06-12 10:19:47', 14000, 'devs+2@digitaldetox.co.uk', 'https://ichef.bbci.co.uk/news/1024/cpsprodpb/1244D/production/_117892847_tv066659879.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('3', 'ACTIVE', 1, 'COMPANY_ADMIN', 'devs+3@digitaldetox.co.uk', '1234567', 'Dom', 'Perignon', '2020-06-12 10:19:47', 13988, 'devs+3@digitaldetox.co.uk', 'https://vinepair.com/wp-content/uploads/2017/01/domperignon-internal.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('4', 'ACTIVE', 1, 'COMPANY_ADMIN', 'devs+4@digitaldetox.co.uk', '1234567', 'Ben', 'Afleck', '2020-06-12 10:19:47', 13989, 'devs+4@digitaldetox.co.uk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ben_Affleck_by_Gage_Skidmore_3.jpg/440px-Ben_Affleck_by_Gage_Skidmore_3.jpg', NULL);

INSERT INTO account (id, status, market_id, ROLE, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, photo, migration_id)
  VALUES ('5', 'ACTIVE', 1, 'COMPANY_ADMIN', 'devs+5@digitaldetox.co.uk', '1234567', 'Steve', 'Jobs', '2020-06-12 10:19:47', 13990, 'devs+5@digitaldetox.co.uk', 'https://i0.wp.com/9to5mac.com/wp-content/uploads/sites/6/2021/02/Tim-Cook-remembers-Steve-Jobs.jpg', NULL);

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
  VALUES ('1', 'Blue Star House', '234-244 Stockwell Road', 'Brixton', 'London', 'UK', 'SW9 9SP', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('2', 'Piazza di Trevi', NULL, 'Roma', NULL, 'Italy', '00187 Roma RM', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('3', '328 Coldharbour Lane', 'Brixton', 'London', NULL, 'UK', 'SW9 8QH', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('4', 'Nursery Rd', 'Brixton', 'London', NULL, 'UK', 'SW9 8BP', '(51.4632583,-0.1194107)', NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('5', 'Praça do Príncipe Real 23 24', 'Near the Castle', 'Lisbon', NULL, 'Portugal', '1250-096 Lisboa', '(38.7170416,-9.1510413)', NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('6', '39 Old Castle Rd', NULL, 'Weymouth', 'Wessex', 'UK', 'DT4 8QE', '(10.6971494,-72.2598689)', NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('7', '1 Brixton Hill', 'Brixton', 'London', 'London', 'UK', 'SW2 1RW', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('8', '49 Brixton Station Rd', 'Brixton', 'London', 'London', 'UK', 'SW9 8PQ', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('9', '211 Stockwell Rd', 'Brixton', 'London', 'London', 'UK', 'SW9 9SL', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('10', '103 Gaunt St', 'Lambeth', 'London', 'London', 'UK', 'SE1 6DP', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('11', '12 Alice Mansions', 'Soho', 'London', 'London', 'UK', 'UK W1A', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('12', '15 Bob Monk House', 'Covent Garden', 'London', 'London', 'UK', 'W1C8RJ', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('13', '23 Shakespeare House', 'Barbican', 'London', 'London', 'UK', 'EC1', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('14', '4 Oxford Street', NULL, 'London', 'London', 'UK', 'W1B 5LP', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('15', 'Next to Bluestar House', '234-244 Stockwell Road', 'Brixton', 'London', 'UK', 'SW9 9SP', NULL, NULL);

INSERT INTO address (id, first_line, second_line, town, region, country, postcode, coordinates, migration_id)
  VALUES ('16', '4 Oxford Street', NULL, 'London', 'London', 'UK', 'W1B 5LP', NULL, NULL);

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
  VALUES ('11', 13994, 'OTHER', 'BMI Contractor Health & Safety Certification (12 months)', '2023-12-18 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('12', 13998, 'FLAT', 'BMI Flat Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('13', 13998, 'PITCHED', NULL, '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('14', 13997, 'FLAT', 'BMI Flat Roof Technology Certification (12 months)', '2022-01-01 12:00:00');

INSERT INTO certification (id, docebo_user_id, technology, name, expiry_date)
  VALUES ('15', 13997, 'PITCHED', NULL, '2022-01-01 12:00:00');

TRUNCATE TABLE company RESTART IDENTITY;

INSERT INTO company (id, market_id, registered_address_id, trading_address_id, owner_fullname, owner_email, owner_phone, business_type, tier, status, registered_by, registered_date, name, tax_number, phone, about_us, public_email, website, facebook, linked_in, reference_number, logo, migration_id, trading_address_migration_id, registered_address_migration_id)
  VALUES ('1', 1, 1, 4, 'Don Cheadle', 'don@test.com', '1232123', 'CONTRACTOR', 'T2', 'ACTIVE', 'twhorlton0@miibeian.gov.cn', '2020-10-20 12:00:00', 'Integrated Solutions Inc', '63323-463', '8439854588', 'We put stuff together really quickly without any fuss', 'lfoskin0@paypal.com', 'https://sphinn.com', 'https://www.facebook.com/WhiteHouse/', 'https://www.linkedin.com/company/the-white-house', '0093-7392', 'https://upload.wikimedia.org/wikipedia/commons/6/63/Integrated_Engineering_Solutions.png', NULL, NULL, NULL);

INSERT INTO company (id, market_id, registered_address_id, trading_address_id, owner_fullname, owner_email, owner_phone, business_type, tier, status, registered_by, registered_date, name, tax_number, phone, about_us, public_email, website, facebook, linked_in, reference_number, logo, migration_id, trading_address_migration_id, registered_address_migration_id)
  VALUES ('2', 1, 2, 5, 'Liam Gallagher', 'liam@test.com', '234234', 'CONTRACTOR', 'T4', 'ACTIVE', 'mbrosch1@go.com', '2020-11-20 12:00:00', 'Pathfinder Construction Ltd', '0378-4094', '7572089959', 'We build really hard things that support everything else', 'ssnipe1@pen.io', 'https://oracle.com', 'https://www.facebook.com/europeanparliament', 'https://www.linkedin.com/company/eu', '64772-300', 'https://upload.wikimedia.org/wikipedia/commons/7/7d/A_Red_Star.png', NULL, NULL, NULL);

INSERT INTO company (id, market_id, registered_address_id, trading_address_id, owner_fullname, owner_email, owner_phone, business_type, tier, status, registered_by, registered_date, name, tax_number, phone, about_us, public_email, website, facebook, linked_in, reference_number, logo, migration_id, trading_address_migration_id, registered_address_migration_id)
  VALUES ('3', 1, 3, 6, 'Charlotte Church', 'charlotte@test.com', '345345', 'CONTRACTOR', 'T3', 'DEACTIVATED', 'dhechlin2@amazon.com', '2020-9-20 12:00:00', 'dXB Roofing PLC', '49738-530', '8435842619', 'We build stuff that looks great', 'liacovielli2@discovery.com', 'https://utexas.edu', 'https://www.facebook.com/Sony/', 'https://in.linkedin.com/company/sony', '0179-0110', 'https://upload.wikimedia.org/wikipedia/commons/3/33/StubMetal.png', NULL, NULL, NULL);

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

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('1', NULL, 1, 1, 'PROOF_OF_PURCHASE', 'stock-vector-realistic-paper-shop-receipt-with-barcode-vector-shop-terminal-768909406.jpg', 'https://image.shutterstock.com/z/stock-vector-realistic-paper-shop-receipt-with-barcode-vector-shop-terminal-768909406.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('2', NULL, 1, 2, 'PROOF_OF_PURCHASE', '450px-Interior_drain_replacement.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Interior_drain_replacement.jpg/450px-Interior_drain_replacement.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('3', NULL, 3, 3, 'PROOF_OF_PURCHASE', '450px-Interior_drain_replacement.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Interior_drain_replacement.jpg/450px-Interior_drain_replacement.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('4', '3ka17lbEy4ENxBKQC4CY4V', 3, 3, 'CUSTOM', 'gargoyle-images-manchester-600w-71247169.jpg', 'https://c7.alamy.com/comp/FK32Y4/st-matthews-church-in-brixton-hill-south-london-FK32Y4.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('5', '3ka17lbEy4ENxBKQC4CY4V', 3, 3, 'CUSTOM', 'gargoyle-fountain-detail-close-600w-499048789.jpg', 'https://image.shutterstock.com/image-photo/gargoyle-fountain-detail-close-600w-499048789.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('6', '7j0FaWCBSVanXJqaZrDyvP', 3, 3, 'CUSTOM', 'dancing-friends-600w-717409222.jpg', 'https://image.shutterstock.com/image-photo/dancing-friends-600w-717409222.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('7', '5FbxiRcMYuY6txgoVAnWJm', 3, 3, 'CUSTOM', 'Army_Photography_Contest_-_2007_-_FMWRC_-_Arts_and_Crafts_-_A_Plumpish_Proportion_%284930276154%29.jpg', 'https://image.shutterstock.com/image-photo/dramatic-picture-frozen-medieval-dragon-600w-131654306.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('8', '3ka17lbEy4ENxBKQC4CY4V', NULL, 4, 'CUSTOM', 'ministry-of-sound-24-1.jpg', 'https://paradise.london/wp-content/uploads/2019/08/ministry-of-sound-24-1.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('9', '3ka17lbEy4ENxBKQC4CY4V', 4, 4, 'CUSTOM', 'prague-czech-republic-august-172019-600w-1722304249.jpg', 'https://image.shutterstock.com/image-photo/prague-czech-republic-august-172019-600w-1722304249.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('10', '7j0FaWCBSVanXJqaZrDyvP', 4, 4, 'CUSTOM', 'rooftop-party.html', 'https://depositphotos.com/stock-photos/rooftop-party.html');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('11', '5FbxiRcMYuY6txgoVAnWJm', 4, 4, 'CUSTOM', 'Ceiling-leak.jpg', 'https://rennisonroofing.com/wp-content/uploads/2020/04/Ceiling-leak.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('12', NULL, 4, NULL, 'MISCELLANEOUS', '2880px-Dunvegan_Castle_in_the_mist01editcrop_2007-08-22.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Dunvegan_Castle_in_the_mist01editcrop_2007-08-22.jpg/2880px-Dunvegan_Castle_in_the_mist01editcrop_2007-08-22.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('13', NULL, 4, NULL, 'MISCELLANEOUS', '1920px-Eichenberg_01.JPG', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Eichenberg_01.JPG/1920px-Eichenberg_01.JPG');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('14', NULL, 2, NULL, 'MISCELLANEOUS', '1024px-Convento_Cristo_December_2008-2a.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Convento_Cristo_December_2008-2a.jpg/1024px-Convento_Cristo_December_2008-2a.jpg');

INSERT INTO evidence_item (id, custom_evidence_category_id, project_id, guarantee_id, evidence_category_type, name, attachment)
  VALUES ('15', NULL, 2, NULL, 'MISCELLANEOUS', '1920px-02.Trinidad_%2859%29.JPG', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/02.Trinidad_%2859%29.JPG/1920px-02.Trinidad_%2859%29.JPG');

TRUNCATE TABLE guarantee RESTART IDENTITY;

INSERT INTO guarantee (id, file_storage_id, requestor_account_id, project_id, guarantee_type_id, system_bmi_ref, product_bmi_ref, reviewer_account_id, guarantee_template_id, status, start_date, expiry_date, bmi_reference_id)
  VALUES ('1', 'http://www.africau.edu/images/default/sample.pdf', 3, 1, '6ivLobJgk2jd0Tm3fwA48u', NULL, 'BMI-NO-PROD-001', NULL, '1hkU39ASbE4oYoBREitkgV', 'APPROVED', '2021-04-20 12:00:00', '2061-04-20 12:00:00', 'C1P1G1');

INSERT INTO guarantee (id, file_storage_id, requestor_account_id, project_id, guarantee_type_id, system_bmi_ref, product_bmi_ref, reviewer_account_id, guarantee_template_id, status, start_date, expiry_date, bmi_reference_id)
  VALUES ('2', 'http://www.africau.edu/images/default/sample.pdf', 3, 1, '6ivLobJgk2jd0Tm3fwA48u', NULL, 'BMI-NO-PROD-002', NULL, '1hkU39ASbE4oYoBREitkgV', 'APPROVED', '2021-04-20 12:00:00', '2051-04-20 12:00:00', 'C1P2G2');

INSERT INTO guarantee (id, file_storage_id, requestor_account_id, project_id, guarantee_type_id, system_bmi_ref, product_bmi_ref, reviewer_account_id, guarantee_template_id, status, start_date, expiry_date, bmi_reference_id)
  VALUES ('3', 'http://www.africau.edu/images/default/sample.pdf', 7, 3, '54S9J770q5T2jPYxptah89', 'BMI-NO-PC21-01', NULL, NULL, '2cH694AWInJSZIdKHDKfJO', 'REJECTED', NULL, NULL, 'C2P3G3');

INSERT INTO guarantee (id, file_storage_id, requestor_account_id, project_id, guarantee_type_id, system_bmi_ref, product_bmi_ref, reviewer_account_id, guarantee_template_id, status, start_date, expiry_date, bmi_reference_id)
  VALUES ('4', 'http://www.africau.edu/images/default/sample.pdf', 13, 4, '54S9J770q5T2jPYxptah89', 'BMI-NO-PC21-02', NULL, 1, '2cH694AWInJSZIdKHDKfJO', 'APPROVED', '2020-12-29 12:00:00', '2050-12-29 12:00:00', 'C3P4G4');

TRUNCATE TABLE invitation RESTART IDENTITY;

INSERT INTO invitation (id, sender_account_id, company_id, status, invitee, personal_note)
  VALUES ('1', 3, 1, 'NEW', 'devs+13@digitaldetox.co.uk', 'Hi Alex, come and join the team');

INSERT INTO invitation (id, sender_account_id, company_id, status, invitee, personal_note)
  VALUES ('2', 3, 1, 'NEW', 'devs+14@digitaldetox.co.uk', 'Hi, come and join the team');

TRUNCATE TABLE market RESTART IDENTITY;

INSERT INTO market (id,
  LANGUAGE, DOMAIN, cms_space_id, name, send_name, send_mailbox, docebo_installers_branch_id, docebo_company_admin_branch_id, docebo_catalogue_id, merchandising_url, projects_enabled, gtag, geo_middle, location_bias_radius_km)
  VALUES ('1', 'en', 'en', 'opay6t6wwmup', 'Mapleland', 'BMI Intouch Mapleland', 'intouch@bmigroup.en', '7', '8', 37, 'https://italy.bmiroofpromerch.com/', TRUE, 'UA-141761217-2', '51.5014,-0.1419', 200);

INSERT INTO market (id,
  LANGUAGE, DOMAIN, cms_space_id, name, send_name, send_mailbox, docebo_installers_branch_id, docebo_company_admin_branch_id, docebo_catalogue_id, merchandising_url, projects_enabled, gtag, geo_middle, location_bias_radius_km)
  VALUES ('2', 'no', 'no', 'opay6t6wwmup', 'Transatlantia', 'BMI Intouch Mapleland', 'intouch@bmigroup.no', '7', '8', 38, 'https://italy.bmiroofpromerch.com/', TRUE, 'UA-141761217-6', '59.9139,10.7522', 100);

TRUNCATE TABLE note RESTART IDENTITY;

INSERT INTO note (id, author_id, project_id, body)
  VALUES ('1', 2, 4, 'Good job Alex');

INSERT INTO note (id, author_id, project_id, body)
  VALUES ('2', 1, 3, 'Please use compaitble buffing material');

TRUNCATE TABLE notification RESTART IDENTITY;

INSERT INTO notification (id, account_id, send_date, read, body)
  VALUES ('1', 3, '2021-08-17 23:20:11', TRUE, 'On a the M6 near Birmingham');

INSERT INTO notification (id, account_id, send_date, read, body)
  VALUES ('2', 3, '2021-08-17 23:20:11', FALSE, 'Cool wind in my hair. See project page on the [bbc website](https://bbc.co.uk)');

INSERT INTO notification (id, account_id, send_date, read, body)
  VALUES ('3', 3, '2021-08-13 21:20:11', TRUE, 'Warm smell of colitas rising up through the air');

INSERT INTO notification (id, account_id, send_date, read, body)
  VALUES ('4', 7, '2021-05-11 21:20:11', FALSE, 'and thence we issued forth to see again the stars');

INSERT INTO notification (id, account_id, send_date, read, body)
  VALUES ('5', 7, '2021-08-17 21:20:11', TRUE, 'All hope abandon, ye who enter here!');

INSERT INTO notification (id, account_id, send_date, read, body)
  VALUES ('6', 7, '2021-08-17 21:20:11', FALSE, 'The wisest are the most annoyed at the loss of time');

INSERT INTO notification (id, account_id, send_date, read, body)
  VALUES ('7', 3, '2021-05-17 21:20:11', TRUE, 'Warm smell of Morleys chicken rising up through the air');

TRUNCATE TABLE product RESTART IDENTITY;

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('1', 1, 'PITCHED', 'BMI-NO-PROD-001', 'Zanda', 'Zanda Vestland', 'Veldig bra', 'Betongtakstein', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('2', 1, 'PITCHED', 'BMI-NO-PROD-002', 'Zanda', 'Zanda Classic', 'Mye an en bra tak', 'Betongtakstein', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('3', 1, 'PITCHED', 'BMI-NO-PROD-003', 'Zanda', 'Zanda Protector', NULL, 'Betongtakstein', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('4', 1, 'PITCHED', 'BMI-NO-PROD-004', 'Zanda', 'Zanda Arktis', NULL, 'Betongtakstein', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('5', 1, 'PITCHED', 'BMI-NO-PROD-005', 'Zanda', 'Zanda Minster', NULL, 'Betongtakstein', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('6', 1, 'PITCHED', 'BMI-NO-PROD-006', 'Zanda', 'Zanda Evo', NULL, 'Betongtakstein', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('7', 1, 'PITCHED', 'BMI-NO-PROD-007', 'Monier', 'Turmalin', NULL, 'Tegltakstein', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('8', 1, 'PITCHED', 'BMI-NO-PROD-008', 'Monier', 'KDN VH', NULL, 'Tegltakstein', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('9', 1, 'PITCHED', 'BMI-NO-PROD-009', 'Monier', 'Hollander V', NULL, 'Tegltakstein', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('10', 1, 'PITCHED', 'BMI-NO-PROD-010', 'Monier', 'Nortegl', NULL, 'Tegltakstein', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('11', 1, 'PITCHED', 'BMI-NO-PROD-011', 'Monier', 'Nova', NULL, 'Tegltakstein', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('12', 1, 'PITCHED', 'BMI-NO-PROD-012', 'AeroDek', 'AeroDek Tradition Plus', NULL, 'Ståltakpanne', TRUE, 40);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('13', 1, 'PITCHED', 'BMI-NO-PROD-013', 'AeroDek', 'AeroDek Robust Plus', NULL, 'Ståltakpanne', TRUE, 40);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('14', 1, 'PITCHED', 'BMI-NO-PROD-014', 'AeroDek', 'AeroDek Unique Plus', NULL, 'Ståltakpanne', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('15', 1, 'PITCHED', 'BMI-NO-PROD-015', 'AeroDek', 'AeroDek Quadro Plus', NULL, 'Ståltakpanne', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('16', 1, 'PITCHED', 'BMI-NO-PROD-016', 'AeroDek', 'AeroDek Tradition', NULL, 'Ståltakpanne', TRUE, 30);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('17', 1, 'PITCHED', 'BMI-NO-PROD-017', 'Icopal', 'Icopal Super D', NULL, 'Undertak', TRUE, 2);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('18', 1, 'PITCHED', 'BMI-NO-PROD-018', 'Icopal', 'Icopal Ultra D', NULL, 'Undertak', TRUE, 2);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('19', 1, 'PITCHED', 'BMI-NO-PROD-019', 'BMI', 'BMI Ventex Supra', NULL, 'Undertak', TRUE, 2);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('20', 1, 'FLAT', 'BMI-NO-PROD-020', 'BMI', 'BMI Hemsedal Supra', 'God pa pitched', 'Undertak', TRUE, 10);

INSERT INTO product (id, market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years)
  VALUES ('21', 1, 'FLAT', 'BMI-NO-PROD-021', 'Icopal', 'Icopal Trysil D', 'God pa flat', 'Stein tak', TRUE, 10);

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

INSERT INTO project_member (id, project_id, account_id, is_responsible_installer)
  VALUES ('1', 1, 3, FALSE);

INSERT INTO project_member (id, project_id, account_id, is_responsible_installer)
  VALUES ('2', 1, 4, FALSE);

INSERT INTO project_member (id, project_id, account_id, is_responsible_installer)
  VALUES ('3', 1, 5, FALSE);

INSERT INTO project_member (id, project_id, account_id, is_responsible_installer)
  VALUES ('4', 2, 3, FALSE);

INSERT INTO project_member (id, project_id, account_id, is_responsible_installer)
  VALUES ('5', 2, 5, FALSE);

INSERT INTO project_member (id, project_id, account_id, is_responsible_installer)
  VALUES ('6', 2, 6, FALSE);

INSERT INTO project_member (id, project_id, account_id, is_responsible_installer)
  VALUES ('7', 3, 7, TRUE);

INSERT INTO project_member (id, project_id, account_id, is_responsible_installer)
  VALUES ('8', 3, 8, FALSE);

INSERT INTO project_member (id, project_id, account_id, is_responsible_installer)
  VALUES ('9', 3, 9, FALSE);

INSERT INTO project_member (id, project_id, account_id, is_responsible_installer)
  VALUES ('10', 4, 10, FALSE);

TRUNCATE TABLE SYSTEM RESTART IDENTITY;

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('1', 1, 'PITCHED', 'BMI-NO-PC21-01', 'Zanda Vestland + Icopal Super D', 'Zanda Vestland er en klassisk betongtakstein med ubehandlet overflate', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('2', 1, 'PITCHED', 'BMI-NO-PC21-02', 'Zanda Vestland + Icopal Ultra D', 'Zanda Vestland er en klassisk betongtakstein med ubehandlet overflate', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('3', 1, 'PITCHED', 'BMI-NO-PC21-03', 'Zanda Vestland + BMI Ventex Supra', 'Zanda Vestland er en klassisk betongtakstein med ubehandlet overflate', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('4', 1, 'PITCHED', 'BMI-NO-PC22-01', 'Zanda Classic + Icopal Super D', 'Zanda Classic er en prisgunstig takstein med en tradisjonell, behandlet overflate.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('5', 1, 'PITCHED', 'BMI-NO-PC22-02', 'Zanda Classic + Icopal Ultra D', 'Zanda Classic er en prisgunstig takstein med en tradisjonell, behandlet overflate.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('6', 1, 'PITCHED', 'BMI-NO-PC22-03', 'Zanda Classic + BMI Ventex Supra', 'Zanda Classic er en prisgunstig takstein med en tradisjonell, behandlet overflate.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('7', 1, 'PITCHED', 'BMI-NO-PC23-01', 'Zanda Protector + Icopal Super D', 'Zanda Protector har en blank overflate med et unikt overflatebelegg som beskytter mot tilgroing og UV-stråling.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('8', 1, 'PITCHED', 'BMI-NO-PC23-02', 'Zanda Protector + Icopal Ultra D', 'Zanda Protector har en blank overflate med et unikt overflatebelegg som beskytter mot tilgroing og UV-stråling.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('9', 1, 'PITCHED', 'BMI-NO-PC23-03', 'Zanda Protector + BMI Ventex Supra', 'Zanda Protector har en blank overflate med et unikt overflatebelegg som beskytter mot tilgroing og UV-stråling.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('10', 1, 'PITCHED', 'BMI-NO-PC24-01', 'Zanda Arktis + Icopal Super D', 'Zanda Arctic er vår mest holdbare betongtakstein med kvarts og fargepigmenter.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('11', 1, 'PITCHED', 'BMI-NO-PC24-02', 'Zanda Arktis + Icopal Ultra D', 'Zanda Arctic er vår mest holdbare betongtakstein med kvarts og fargepigmenter.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('12', 1, 'PITCHED', 'BMI-NO-PC24-03', 'Zanda Arktis + BMI Ventex Supra', 'Zanda Arctic er vår mest holdbare betongtakstein med kvarts og fargepigmenter.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('13', 1, 'PITCHED', 'BMI-NO-PC25-01', 'Zanda Minster + Icopal Super D', 'Zanda Minster er en trendy og flat takstein som ofte benyttes på moderne arkitektur.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('14', 1, 'PITCHED', 'BMI-NO-PC25-02', 'Zanda Minster + Icopal Ultra D', 'Zanda Minster er en trendy og flat takstein som ofte benyttes på moderne arkitektur.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('15', 1, 'PITCHED', 'BMI-NO-PC25-03', 'Zanda Minster + BMI Ventex Supra', 'Zanda Minster er en trendy og flat takstein som ofte benyttes på moderne arkitektur.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('16', 1, 'PITCHED', 'BMI-NO-PC26-01', 'Zanda Evo + Icopal Super D', 'Zanda Evo er en flat betongtakstein som fås i fargene sort og mørk grå.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('17', 1, 'PITCHED', 'BMI-NO-PC26-02', 'Zanda Evo + Icopal Ultra D', 'Zanda Evo er en flat betongtakstein som fås i fargene sort og mørk grå.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('18', 1, 'PITCHED', 'BMI-NO-PC26-03', 'Zanda Evo + BMI Ventex Supra', 'Zanda Evo er en flat betongtakstein som fås i fargene sort og mørk grå.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('19', 1, 'PITCHED', 'BMI-NO-PCL21-01', 'Turmalin + Icopal Super D', 'Turmalin er en moderne, flat teglstein, finnes i en rekke ulike farger og overflater.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('20', 1, 'PITCHED', 'BMI-NO-PCL21-02', 'Turmalin + Icopal Ultra D', 'Turmalin er en moderne, flat teglstein, finnes i en rekke ulike farger og overflater.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('21', 1, 'PITCHED', 'BMI-NO-PCL21-03', 'Turmalin + BMI Ventex Supra', 'Turmalin er en moderne, flat teglstein, finnes i en rekke ulike farger og overflater.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('22', 1, 'PITCHED', 'BMI-NO-PCL22-01', 'KDN VH + Icopal Super D', 'KDN tegltakstein er den originale hollandske glaserte taksteinen.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('23', 1, 'PITCHED', 'BMI-NO-PCL22-02', 'KDN VH + Icopal Ultra D', 'KDN tegltakstein er den originale hollandske glaserte taksteinen.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('24', 1, 'PITCHED', 'BMI-NO-PCL22-03', 'KDN VH + BMI Ventex Supra', 'KDN tegltakstein er den originale hollandske glaserte taksteinen.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('25', 1, 'PITCHED', 'BMI-NO-PCL23-01', 'Hollander V + Icopal Super D', 'Hollander-V er en formpresset takstein med én side- og én toppfals.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('26', 1, 'PITCHED', 'BMI-NO-PCL23-02', 'Hollander V + Icopal Ultra D', 'Hollander-V er en formpresset takstein med én side- og én toppfals.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('27', 1, 'PITCHED', 'BMI-NO-PCL23-03', 'Hollander V + BMI Ventex Supra', 'Hollander-V er en formpresset takstein med én side- og én toppfals.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('28', 1, 'PITCHED', 'BMI-NO-PCL24-01', 'Nortegl + Icopal Super D', 'Nortegl er en falset tegltakstein med klassisk, nordisk form.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('29', 1, 'PITCHED', 'BMI-NO-PCL24-02', 'Nortegl + Icopal Ultra D', 'Nortegl er en falset tegltakstein med klassisk, nordisk form.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('30', 1, 'PITCHED', 'BMI-NO-PCL24-03', 'Nortegl + BMI Ventex Supra', 'Nortegl er en falset tegltakstein med klassisk, nordisk form.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('31', 1, 'PITCHED', 'BMI-NO-PCL25-01', 'Nova + Icopal Super D', 'Nova er en rimelig, men teknisk avansert enkeltkrum tegltakstein med god passform.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('32', 1, 'PITCHED', 'BMI-NO-PCL25-02', 'Nova + Icopal Ultra D', 'Nova er en rimelig, men teknisk avansert enkeltkrum tegltakstein med god passform.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('33', 1, 'PITCHED', 'BMI-NO-PCL25-03', 'Nova + BMI Ventex Supra', 'Nova er en rimelig, men teknisk avansert enkeltkrum tegltakstein med god passform.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('34', 1, 'PITCHED', 'BMI-NO-PM21-01', 'AeroDek Tradition Plus + Icopal Super D', 'Tradition Plus er en råsterk, vakker og tidløs ståltakpanne.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('35', 1, 'PITCHED', 'BMI-NO-PM21-02', 'AeroDek Tradition Plus + Icopal Ultra D', 'Tradition Plus er en råsterk, vakker og tidløs ståltakpanne.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('36', 1, 'PITCHED', 'BMI-NO-PM21-03', 'AeroDek Tradition Plus + BMI Ventex Supra', 'Tradition Plus er en råsterk, vakker og tidløs ståltakpanne.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('37', 1, 'PITCHED', 'BMI-NO-PM22-01', 'AeroDek Robust Plus + Icopal Super D', 'Med Robust Plus får du takpanner med et unikt utseende som passer ekstra godt til hus og hytter.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('38', 1, 'PITCHED', 'BMI-NO-PM22-02', 'AeroDek Robust Plus + Icopal Ultra D', 'Med Robust Plus får du takpanner med et unikt utseende som passer ekstra godt til hus og hytter.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('39', 1, 'PITCHED', 'BMI-NO-PM22-03', 'AeroDek Robust Plus + BMI Ventex Supra', 'Med Robust Plus får du takpanner med et unikt utseende som passer ekstra godt til hus og hytter.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('40', 1, 'PITCHED', 'BMI-NO-PM23-01', 'AeroDek Unique Plus + Icopal Super D', 'Unique Plus har en høyglanset eller matt overflate av slagsterk pulverlakk, noe som gir den et eksklusivt og stilig utseende.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('41', 1, 'PITCHED', 'BMI-NO-PM23-02', 'AeroDek Unique Plus + Icopal Ultra D', 'Unique Plus har en høyglanset eller matt overflate av slagsterk pulverlakk, noe som gir den et eksklusivt og stilig utseende.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('42', 1, 'PITCHED', 'BMI-NO-PM23-03', 'AeroDek Unique Plus + BMI Ventex Supra', 'Unique Plus har en høyglanset eller matt overflate av slagsterk pulverlakk, noe som gir den et eksklusivt og stilig utseende.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('43', 1, 'PITCHED', 'BMI-NO-PM24-01', 'AeroDek Quadro Plus + Icopal Super D', 'Quadro Plus takstein har en flat profil, som er i stil med den moderne og minimalistiske byggestilen.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('44', 1, 'PITCHED', 'BMI-NO-PM24-02', 'AeroDek Quadro Plus + Icopal Ultra D', 'Quadro Plus takstein har en flat profil, som er i stil med den moderne og minimalistiske byggestilen.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('45', 1, 'PITCHED', 'BMI-NO-PM24-03', 'AeroDek Quadro Plus + BMI Ventex Supra', 'Quadro Plus takstein har en flat profil, som er i stil med den moderne og minimalistiske byggestilen.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('46', 1, 'PITCHED', 'BMI-NO-PM25-01', 'AeroDek Tradition + Icopal Super D', 'AeroDek Tradition er den prisgunstige varianten av Norges mest solgte ståltakpanner.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('47', 1, 'PITCHED', 'BMI-NO-PM25-02', 'AeroDek Tradition + Icopal Ultra D', 'AeroDek Tradition er den prisgunstige varianten av Norges mest solgte ståltakpanner.', 20, TRUE);

INSERT INTO SYSTEM (id, market_id, technology, bmi_ref, name, description, maximum_validity_years, published)
  VALUES ('48', 1, 'PITCHED', 'BMI-NO-PM25-03', 'AeroDek Tradition + BMI Ventex Supra', 'AeroDek Tradition er den prisgunstige varianten av Norges mest solgte ståltakpanner.', 20, TRUE);

TRUNCATE TABLE system_member RESTART IDENTITY;

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref, market_id)
  VALUES ('1', 'BMI-NO-PC21-01', 'BMI-NO-PROD-001', 1);

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref, market_id)
  VALUES ('2', 'BMI-NO-PC21-01', 'BMI-NO-PROD-017', 1);

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref, market_id)
  VALUES ('3', 'BMI-NO-PC21-02', 'BMI-NO-PROD-001', 1);

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref, market_id)
  VALUES ('4', 'BMI-NO-PC21-02', 'BMI-NO-PROD-018', 1);

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref, market_id)
  VALUES ('5', 'BMI-NO-PC21-03', 'BMI-NO-PROD-001', 1);

INSERT INTO system_member (id, system_bmi_ref, product_bmi_ref, market_id)
  VALUES ('6', 'BMI-NO-PC21-03', 'BMI-NO-PROD-019', 1);

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

COMMENT ON COLUMN company.reference_number IS 'A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. ';

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

COMMENT ON COLUMN evidence_item.custom_evidence_category_id IS 'a reference to the evidenceCategory sys id in Contentful';

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

COMMENT ON COLUMN guarantee.guarantee_type_id IS 'a reference to the guaranteeType sys id in Contentful';

COMMENT ON COLUMN guarantee.system_bmi_ref IS 'fk';

COMMENT ON COLUMN guarantee.product_bmi_ref IS 'fk';

COMMENT ON COLUMN guarantee.reviewer_account_id IS 'fk';

COMMENT ON COLUMN guarantee.guarantee_template_id IS 'a reference to the guaranteeType sys id in Contentful';

COMMENT ON COLUMN guarantee.status IS 'ek';

COMMENT ON COLUMN guarantee.start_date IS 'The date that the Guarantee is approved either automatically or manually';

COMMENT ON COLUMN guarantee.expiry_date IS 'When the guarantee will expire.  This should be calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier';

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

CREATE INDEX certification_technology_idx ON certification USING btree (technology);

CREATE INDEX certification_expiry_date_idx ON certification USING btree (expiry_date);

CREATE INDEX invitation_status_idx ON invitation USING btree (status);

CREATE INDEX invitation_invitee_idx ON invitation USING btree (invitee);

CREATE INDEX market_domain_idx ON market USING btree (DOMAIN);

CREATE INDEX product_name_idx ON product USING btree (name);

CREATE INDEX project_member_is_responsible_installer_idx ON project_member USING btree (is_responsible_installer);

CREATE INDEX system_name_idx ON SYSTEM USING btree (name);

