
DROP TYPE IF EXISTS account_status CASCADE;
CREATE TYPE account_status  AS ENUM (
'NEW',
'ACTIVE',
'SUSPENDED'
);  
  
DROP TYPE IF EXISTS address_type CASCADE;
CREATE TYPE address_type  AS ENUM (
'REGISTERED',
'TRADING',
'BUILDING_OWNER',
'SITE'
);  
  
DROP TYPE IF EXISTS business_type CASCADE;
CREATE TYPE business_type  AS ENUM (
'CONTRACTOR',
'ARCHITECT',
'MERCHANT',
'CORP_DEVELOPER'
);  
  
DROP TYPE IF EXISTS company_status CASCADE;
CREATE TYPE company_status  AS ENUM (
'NEW',
'ACTIVE',
'DEACTIVATED'
);  
  
DROP TYPE IF EXISTS invitation_status CASCADE;
CREATE TYPE invitation_status  AS ENUM (
'NEW',
'ACCEPTED',
'CANCELLED'
);  
  
DROP TYPE IF EXISTS language CASCADE;
CREATE TYPE language  AS ENUM (
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
CREATE TYPE message_format  AS ENUM (
'EMAIL',
'NOTIFICATION',
'ALL'
);  
  
DROP TYPE IF EXISTS operation CASCADE;
CREATE TYPE operation  AS ENUM (
'FLAT',
'PITCHED',
'SOLAR'
);  
  
DROP TYPE IF EXISTS request_status CASCADE;
CREATE TYPE request_status  AS ENUM (
'NEW',
'SUBMITTED',
'REVIEW',
'REJECTED',
'APPROVED'
);  
  
DROP TYPE IF EXISTS role CASCADE;
CREATE TYPE role  AS ENUM (
'SUPER_ADMIN',
'MARKET_ADMIN',
'INSTALLER',
'COMPANY_ADMIN'
);  
  
DROP TYPE IF EXISTS technology CASCADE;
CREATE TYPE technology  AS ENUM (
'FLAT',
'PITCHED',
'OTHER'
);  
  
DROP TYPE IF EXISTS tier CASCADE;
CREATE TYPE tier  AS ENUM (
'T1',
'T2',
'T3',
'T4'
);  
  

DROP TABLE IF EXISTS account CASCADE;
CREATE TABLE account (
id SERIAL PRIMARY KEY,
status account_status,
market_id int,
role role,
email text,
phone text,
first_name text,
last_name text,
created timestamp,
docebo_user_id int,
docebo_username text,
photo text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address (
id SERIAL PRIMARY KEY,
project_id int,
company_id int,
address_type address_type,
first_line text,
second_line text,
town text,
country text,
postcode text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS certification CASCADE;
CREATE TABLE certification (
id SERIAL PRIMARY KEY,
docebo_user_id int,
technology text,
name text,
expiry_date timestamp,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS company CASCADE;
CREATE TABLE company (
id SERIAL PRIMARY KEY,
market_id int,
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
coordinates point,
about_us text,
public_email text,
website text,
facebook text,
linked_in text,
reference_number text,
logo text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS company_document CASCADE;
CREATE TABLE company_document (
id SERIAL PRIMARY KEY,
company_id int,
document text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS company_member CASCADE;
CREATE TABLE company_member (
id SERIAL PRIMARY KEY,
market_id int,
account_id int,
company_id int,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS company_operation CASCADE;
CREATE TABLE company_operation (
id SERIAL PRIMARY KEY,
company int,
operation operation,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS evidence_item CASCADE;
CREATE TABLE evidence_item (
id SERIAL PRIMARY KEY,
evidence_category_id text,
guarantee_id int,
name text,
attachment text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS guarantee CASCADE;
CREATE TABLE guarantee (
id SERIAL PRIMARY KEY,
pdf text,
requestor_account_id int,
responsible_installer_account_id int,
project_id int,
guarantee_type_id text,
system_id int,
reviewer_account_id int,
guarantee_template_id text,
status request_status,
start_date timestamp,
expiry_date timestamp,
issue_number text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS guaranteed_product CASCADE;
CREATE TABLE guaranteed_product (
id SERIAL PRIMARY KEY,
product_id int,
guarantee_id int,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS invitation CASCADE;
CREATE TABLE invitation (
id SERIAL PRIMARY KEY,
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
id SERIAL PRIMARY KEY,
language language,
domain text,
cms_space_id text,
name text,
send_name text,
send_mailbox text,
docebo_installers_branch_id text,
docebo_company_admin_branch_id text,
docebo_catalogue_id text,
merchandising_url text,
projects_enabled boolean,
gtag text,
geo_middle text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS note CASCADE;
CREATE TABLE note (
id SERIAL PRIMARY KEY,
author_id int,
project_id int,
body text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS notification CASCADE;
CREATE TABLE notification (
id SERIAL PRIMARY KEY,
account_id int,
send_date timestamp,
unread boolean,
body text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS product CASCADE;
CREATE TABLE product (
id SERIAL PRIMARY KEY,
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
id SERIAL PRIMARY KEY,
company_id int,
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
id SERIAL PRIMARY KEY,
project_id int,
account_id int,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS system CASCADE;
CREATE TABLE system (
id SERIAL PRIMARY KEY,
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
id SERIAL PRIMARY KEY,
system_id int,
product_id int,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);


TRUNCATE TABLE account RESTART IDENTITY;
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('1','ACTIVE',1,'SUPER_ADMIN','kim@digital-detox.co.uk','34144','Kim','Nobay','2020-06-12 10:19:47',13970,'kim@digital-detox.co.uk','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('2','ACTIVE',1,'MARKET_ADMIN','chris.phippen@bmigroup.com','324234','Chris','Phippen','2020-02-05 00:23:27',13194,'chris.phippen@bmigroup.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('3','ACTIVE',2,'MARKET_ADMIN','umit.karaogul@bmigroup.com       ','33332','Umit','Karaogul','2020-09-23 17:50:40',13718,'umit.karaogul@bmigroup.com       ','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('4','ACTIVE',2,'COMPANY_ADMIN','francesco.moro@bmigroup.com','23566','Jessey','Harkin','2020-04-01 02:21:47',13717,'francesco.moro@bmigroup.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('5','ACTIVE',2,'COMPANY_ADMIN','chris.phippen+98@bmigroup.com       ','6644664','Kort','Pohls','2020-02-20 01:18:43',13270,'chris.phippen+98@bmigroup.com       ','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('6','ACTIVE',1,'COMPANY_ADMIN','chris.phippen+66@bmigroup.com','32322','Templeton','Moores','2020-07-29 10:17:22',13524,'chris.phippen+66@bmigroup.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('7','ACTIVE',2,'COMPANY_ADMIN','chris.phippen+567@bmigroup.com','34144','Jonathan','Kemson','2020-10-12 04:35:35',13651,'chris.phippen+567@bmigroup.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('8','ACTIVE',1,'COMPANY_ADMIN','chris.phippen+18@bmigroup.com       ','324234','Reine','Ghio','2020-12-04 21:18:47',13509,'chris.phippen+18@bmigroup.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('9','SUSPENDED',2,'COMPANY_ADMIN','chris.phippen+17@bmigroup.com       ','33332','Quintilla','Winsiowiecki','2020-06-17 23:27:45',13403,'chris.phippen+17@bmigroup.com       ','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('10','ACTIVE',2,'INSTALLER','chris.phippen+102@bmigroup.com','23566','Verna','Cumberland','2020-09-04 11:32:48',13887,'chris.phippen+102@bmigroup.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('11','ACTIVE',1,'INSTALLER','chris.phippen+101@bmigroup.com','6644664','Torrence','Bispham','2020-08-09 22:56:17',13273,'chris.phippen+101@bmigroup.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('12','ACTIVE',1,'INSTALLER','chris.phippen+1@bmigroup.com','32322','Gibbie','Shawcroft','2020-11-24 23:13:49',13542,'chris.phippen+1@bmigroup.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('13','ACTIVE',1,'INSTALLER','bhaironc@who.int','34144','Bobbi','Hairon','2020-09-08 18:34:46',13543,'bhaironc@who.int','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('14','ACTIVE',1,'INSTALLER','adeclercd@delicious.com','324234','Arlene','de Clerc','2020-06-11 19:38:17',13544,'adeclercd@delicious.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('15','ACTIVE',2,'INSTALLER','jkopische@ted.com','33332','Juditha','Kopisch','2020-06-27 09:12:20',13545,'jkopische@ted.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('16','ACTIVE',2,'INSTALLER','ccammf@a8.net','23566','Claiborne','Camm','2020-04-22 00:12:02',13546,'ccammf@a8.net','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('17','NEW',2,'INSTALLER','jshanksterg@smh.com.au','6644664','Johnathon','Shankster','2020-02-19 19:54:49',13547,'jshanksterg@smh.com.au','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('18','SUSPENDED',2,'INSTALLER','odooheyh@goodreads.com','32322','Otto','Doohey','2020-08-16 20:47:27',13548,'odooheyh@goodreads.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('19','ACTIVE',2,'INSTALLER','ashorlandi@imgur.com','34144','Anselma','Shorland','2020-11-10 05:29:49',13549,'ashorlandi@imgur.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('20','ACTIVE',2,'INSTALLER','mcopsj@odnoklassniki.ru','324234','Mauricio','Cops','2020-08-26 16:30:41',13550,'mcopsj@odnoklassniki.ru','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('21','ACTIVE',2,'INSTALLER','mrobinettk@nba.com','33332','Mateo','Robinett','2020-10-01 21:01:06',13551,'mrobinettk@nba.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('22','ACTIVE',2,'INSTALLER','chatherleighl@foxnews.com','23566','Cookie','Hatherleigh','2020-07-01 09:26:58',13552,'chatherleighl@foxnews.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('23','ACTIVE',2,'INSTALLER','dpallisterm@toplist.cz','6644664','Dieter','Pallister','2020-01-27 02:38:03',13553,'dpallisterm@toplist.cz','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('24','ACTIVE',2,'INSTALLER','sleafn@theguardian.com','34144','Susette','Leaf','2020-10-13 23:58:03',13554,'sleafn@theguardian.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('25','ACTIVE',2,'INSTALLER','bpepallo@cmu.edu','324234','Brandyn','Pepall','2021-01-22 08:13:05',13555,'bpepallo@cmu.edu','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('26','NEW',2,'INSTALLER','jlathep@amazon.de','33332','Jenn','Lathe','2020-08-10 03:35:07',13556,'jlathep@amazon.de','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('27','SUSPENDED',2,'INSTALLER','lplacideq@ftc.gov','23566','Luigi','Placide','2020-03-28 05:19:50',13557,'lplacideq@ftc.gov','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('28','ACTIVE',2,'INSTALLER','kstedallr@walmart.com','6644664','Konstantine','Stedall','2020-05-21 20:08:10',13558,'kstedallr@walmart.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('29','ACTIVE',2,'INSTALLER','drockwells@technorati.com','32322','Dennis','Rockwell','2020-02-19 00:12:10',13559,'drockwells@technorati.com','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,status,market_id,role,email,phone,first_name,last_name,created,docebo_user_id,docebo_username,photo)
VALUES ('30','ACTIVE',2,'INSTALLER','ddanzigt@w3.org','22222','Dalila','Danzig','2020-02-09 10:30:04',13561,'ddanzigt@w3.org','https://thispersondoesnotexist.com/image');


TRUNCATE TABLE address RESTART IDENTITY;
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('1',null,1,'REGISTERED','349 Dixon Drive','Blaine','Cential','Portugal','3070-085');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('2',null,2,'REGISTERED','579 Hintze Terrace','Independence','Regente Feijó','Brazil','19570-000');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('3',null,3,'REGISTERED','4 Carberry Park','Meadow Ridge','Qal‘ah-ye Shāhī','Afghanistan','19570-001');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('4',null,1,'TRADING','0629 Macpherson Drive','Buhler','Đắk Glei','Vietnam','19570-002');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('5',null,2,'TRADING','607 Clarendon Plaza','Mockingbird','Purral','Costa Rica','19570-003');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('6',null,3,'TRADING','62250 Fuller Pass','Melby','Jomsom','Nepal','19570-004');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('7',1,null,'SITE','4719 Farwell Road','Tennyson','Losino-Petrovskiy','Russia','19570-005');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('8',2,null,'SITE','8753 Lakewood Gardens Plaza','Burrows','Zhangshi','China','19570-006');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('9',3,null,'SITE','87 Starling Plaza','Kinsman','Marilao','Philippines','19570-007');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('10',4,null,'SITE','480 Meadow Valley Parkway','Moland','Xiqi','China','19570-008');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('11',5,null,'SITE','44 Sauthoff Court','Eagan','Roberval','Canada','19570-009');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('12',6,null,'SITE','4263 Cody Drive','Mallard','Melíssia','Greece','19570-010');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('13',7,null,'SITE','4805 Alpine Street','Forest','San Agustín','Colombia','19570-011');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('14',8,null,'SITE','2 Prairieview Lane','Brentwood','Bangluo','China','19570-012');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('15',9,null,'SITE','72 Westridge Plaza','Mayfield','Kedungasem','Indonesia','19570-013');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('16',10,null,'SITE','97 Bowman Place','Warbler','Kirovgrad','Russia','19570-014');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('17',11,null,'SITE','278 Derek Crossing','Shoshone','Pedaringan','Indonesia','19570-015');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('18',12,null,'SITE','7 Jana Terrace','Jenna','Liqiao','China','19570-016');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('19',13,null,'SITE','3 Kingsford Circle','Kensington','Jeleuk','Indonesia','19570-017');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('20',14,null,'SITE','82 Lyons Court','Ridge Oak','Douane','Tunisia','19570-018');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('21',15,null,'SITE','53 Ridgeway Center','Mandrake','Valença do Piauí','Brazil','19570-019');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('22',16,null,'SITE','9 Westend Hill','Autumn Leaf','Tall aḑ Ḑamān','Syria','19570-020');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('23',17,null,'SITE','04 Logan Road','Reindahl','Lanling','China','19570-021');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('24',18,null,'SITE','97604 Crowley Point','Heath','Raychikhinsk','Russia','19570-022');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('25',19,null,'SITE','86 Jay Point','Oxford','Fergana','Uzbekistan','19570-023');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('26',20,null,'SITE','04 Scofield Street','Ronald Regan','Kongjiafang','China','19570-024');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('27',21,null,'SITE','6079 Valley Edge Lane','Miller','Changxing','China','19570-025');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('28',22,null,'SITE','603 Dexter Parkway','Lotheville','Hushan','China','19570-026');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('29',23,null,'SITE','46 Basil Crossing','Sunbrook','Jianshe','China','19570-027');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('30',24,null,'SITE','54 Dovetail Street','Cody','Kitimat','Canada','19570-028');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('31',25,null,'SITE','66466 Schmedeman Lane','Mandrake','Lanchyn','Ukraine','19570-029');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('32',26,null,'SITE','1635 Lunder Pass','Dapin','Weitang','China','19570-030');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('33',27,null,'SITE','229 Stang Crossing','Center','Koubia','Guinea','19570-031');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('34',28,null,'SITE','16718 Pond Circle','Hanover','Kortkeros','Russia','19570-032');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('35',29,null,'SITE','85 Barby Parkway','Starling','Nanshi','China','19570-033');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('36',30,null,'SITE','285 Vidon Circle','Atwood','Xitianwei','China','19570-034');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('37',1,null,null,'8 Boyd Terrace','Ohio','Flórina','Greece','19570-035');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('38',2,null,null,'102 Gale Plaza','Saint Paul','Shengli','China','19570-036');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('39',3,null,null,'94872 Goodland Alley','Chive','Tripoli','Lebanon','19570-037');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('40',4,null,null,'336 Hallows Circle','Gulseth','Murindó','Colombia','19570-038');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('41',5,null,null,'310 Amoth Way','Browning','Coaldale','Canada','19570-039');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('42',6,null,null,'43953 Browning Avenue','Laurel','Xiaolin','China','19570-040');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('43',7,null,null,'08 Morning Trail','Miller','Koatas Lao','Indonesia','19570-041');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('44',8,null,null,'795 Sunbrook Lane','Elmside','Kalāt-e Nāderī','Iran','19570-042');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('45',9,null,null,'1 Eagle Crest Place','Melby','Sainte-Anne-des-Plaines','Canada','19570-043');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('46',10,null,null,'43706 Continental Junction','Colorado','Patani','Nigeria','19570-044');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('47',11,null,null,'54 Graedel Way','Bonner','Baganhilir','Indonesia','19570-045');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('48',12,null,null,'50356 Acker Circle','Sunnyside','Port Moody','Canada','V3H');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('49',13,null,null,'0 Warner Plaza','Annamark','Kamenka','Russia','V3H');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('50',14,null,null,'79832 Fordem Lane','Anderson','Fria','Guinea','V3H');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('51',15,null,null,'75406 Reindahl Plaza','Spenser','Llipa','Peru','V3H');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('52',16,null,null,'50 Summer Ridge Court','Memorial','Las Carreras','Bolivia','V3H');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('53',17,null,null,'27887 4th Avenue','Surrey','Palmital','Brazil','48-313');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('54',18,null,null,'07 Jana Lane','Corscot','Baota','China','48-314');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('55',19,null,null,'434 Mandrake Place','Old Gate','Brinkmann','Argentina','48-315');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('56',20,null,null,'81 Rowland Drive','Heffernan','Clondalkin','Ireland','48-316');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('57',21,null,null,'6 Kinsman Place','Swallow','Wuqishan','China','48-317');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('58',22,null,null,'531 Gateway Plaza','Hansons','Bocana de Paiwas','Nicaragua','48-318');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('59',23,null,null,'58 Montana Parkway','Shelley','Uruobo-Okija','Nigeria','48-319');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('60',24,null,null,'55 High Crossing Street','Manley','Skoroszyce','Poland','48-320');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('61',25,null,null,'396 Lakeland Junction','Corry','Itajubá','Brazil','37500-000');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('62',26,null,null,'872 Rusk Place','Fairfield','Annacotty','Ireland','E45');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('63',27,null,null,'05 Nelson Park','American Ash','Serra','Brazil','E46');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('64',28,null,null,'82833 Fulton Park','Harper','Budagovo','Russia','E47');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('65',29,null,null,'7 Dakota Pass','Sommers','Camingawan','Philippines','E48');
INSERT INTO address(id,project_id,company_id,address_type,first_line,second_line,town,country,postcode)
VALUES ('66',30,null,null,'39 Hintze Street','Farwell','Soubré','Ivory Coast','E49');


TRUNCATE TABLE certification RESTART IDENTITY;
INSERT INTO certification(id,docebo_user_id,technology,name,expiry_date)
VALUES ('1',13970,'FLAT','Pancake Master Certified','2022-12-18 12:00:00');
INSERT INTO certification(id,docebo_user_id,technology,name,expiry_date)
VALUES ('2',13194,'FLAT','Pancake Master Certified','2023-12-18 12:00:00');
INSERT INTO certification(id,docebo_user_id,technology,name,expiry_date)
VALUES ('3',13718,'FLAT','Pancake Master Certified','2023-11-18 12:00:00');
INSERT INTO certification(id,docebo_user_id,technology,name,expiry_date)
VALUES ('4',13970,'PITCHED','Slope Style Specialist','2021-10-18 12:00:00');
INSERT INTO certification(id,docebo_user_id,technology,name,expiry_date)
VALUES ('5',13970,'PITCHED','Slope Style Specialist 2000','2020-12-18 12:00:00');


TRUNCATE TABLE company RESTART IDENTITY;
INSERT INTO company(id,market_id,owner_fullname,owner_email,owner_phone,business_type,tier,status,registered_by,registered_date,docebo_group_id,name,tax_number,phone,coordinates,about_us,public_email,website,facebook,linked_in,reference_number,logo)
VALUES ('1',2,'James Marshall Hendrix','jimi@test.com','1232123','CONTRACTOR','T1','ACTIVE','twhorlton0@miibeian.gov.cn','2020-10-20 12:00:00','Blue','Barrows, Legros and Kuhic','63323-463','843-985-4588','(51.528308,-0.3817765)','Compatible full-range architecture','https://sphinn.com','lfoskin0@paypal.com','https://www.facebook.com/WhiteHouse/','https://www.linkedin.com/company/the-white-house','0093-7392','https://favpng.com/png_view/the-railcar-wikimedia-commonssnowman-buttons-cliparts-creative-commons-license-share-alike-escape-artistry-png/G2phAUt6');
INSERT INTO company(id,market_id,owner_fullname,owner_email,owner_phone,business_type,tier,status,registered_by,registered_date,docebo_group_id,name,tax_number,phone,coordinates,about_us,public_email,website,facebook,linked_in,reference_number,logo)
VALUES ('2',2,'Harry Webb','harry@test.com','234234','CONTRACTOR','T4','ACTIVE','mbrosch1@go.com','2020-11-20 12:00:00','Maroon','Lehner-Gislason','0378-4094','757-208-9959','(40.6971494,-74.2598689)','Innovative high-level intranet','https://oracle.com','ssnipe1@pen.io','https://www.facebook.com/europeanparliament','https://www.linkedin.com/company/eu','64772-300','https://favpng.com/png_view/file-ussr-star-wikimedia-commons-russia-soviet-union-red-star-png/WEtg4eiw');
INSERT INTO company(id,market_id,owner_fullname,owner_email,owner_phone,business_type,tier,status,registered_by,registered_date,docebo_group_id,name,tax_number,phone,coordinates,about_us,public_email,website,facebook,linked_in,reference_number,logo)
VALUES ('3',1,'Robert Zimmerman','bob@test.com','345345','CONTRACTOR','T1','ACTIVE','dhechlin2@amazon.com','2020-9-20 12:00:00','Goldenrod','Beahan, Little and Reynolds','49738-530','843-584-2619','(10.6971494,-72.2598689)','Multi-tiered holistic productivity','https://utexas.edu','liacovielli2@discovery.com','https://www.facebook.com/Sony/','https://in.linkedin.com/company/sony','0179-0110','https://favpng.com/png_view/lotus-wikimedia-commons-clip-art-png/10vQG4nP');


TRUNCATE TABLE company_document RESTART IDENTITY;
INSERT INTO company_document(id,company_id,document)
VALUES ('1',1,'http://www.africau.edu/images/default/sample.pdf');
INSERT INTO company_document(id,company_id,document)
VALUES ('2',1,'http://www.africau.edu/images/default/sample.pdf');
INSERT INTO company_document(id,company_id,document)
VALUES ('3',2,'http://www.africau.edu/images/default/sample.pdf');


TRUNCATE TABLE company_member RESTART IDENTITY;
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('1',2,5,1);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('2',2,4,1);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('3',2,7,2);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('4',1,8,3);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('5',2,28,2);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('6',1,10,3);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('7',1,11,3);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('8',1,12,3);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('9',1,13,3);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('10',1,14,3);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('11',2,15,1);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('12',2,16,1);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('13',1,17,3);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('14',1,18,3);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('15',1,19,3);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('16',1,6,3);
INSERT INTO company_member(id,market_id,account_id,company_id)
VALUES ('17',2,7,2);


TRUNCATE TABLE company_operation RESTART IDENTITY;
INSERT INTO company_operation(id,company,operation)
VALUES ('1',2,'PITCHED');
INSERT INTO company_operation(id,company,operation)
VALUES ('2',2,'FLAT');
INSERT INTO company_operation(id,company,operation)
VALUES ('3',3,'FLAT');


TRUNCATE TABLE evidence_item RESTART IDENTITY;
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('1','7l2982ONQRjTjw0rswqdWr',3,'stock-vector-realistic-paper-shop-receipt-with-barcode-vector-shop-terminal-768909406.jpg','https://image.shutterstock.com/z/stock-vector-realistic-paper-shop-receipt-with-barcode-vector-shop-terminal-768909406.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('2','3ka17lbEy4ENxBKQC4CY4V',3,'450px-Interior_drain_replacement.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Interior_drain_replacement.jpg/450px-Interior_drain_replacement.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('3','3ka17lbEy4ENxBKQC4CY4V',3,'gargoyle-urban-water-feature-city-260nw-1402690979.jpg','https://image.shutterstock.com/image-photo/gargoyle-urban-water-feature-city-260nw-1402690979.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('4','3ka17lbEy4ENxBKQC4CY4V',3,'gargoyle-images-manchester-600w-71247169.jpg','https://image.shutterstock.com/image-photo/gargoyle-images-manchester-600w-71247169.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('5','3ka17lbEy4ENxBKQC4CY4V',3,'gargoyle-fountain-detail-close-600w-499048789.jpg','https://image.shutterstock.com/image-photo/gargoyle-fountain-detail-close-600w-499048789.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('6','3ka17lbEy4ENxBKQC4CY4V',3,'authentic-downspout-shape-gargoyle-vertical-600w-1911664036.jpg','https://image.shutterstock.com/image-photo/authentic-downspout-shape-gargoyle-vertical-600w-1911664036.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('7','3ka17lbEy4ENxBKQC4CY4V',3,'dramatic-picture-frozen-medieval-dragon-600w-131654306.jpg','https://image.shutterstock.com/image-photo/dramatic-picture-frozen-medieval-dragon-600w-131654306.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('8','3ka17lbEy4ENxBKQC4CY4V',3,'water-fountain-gargoyle-260nw-73730416.jpg','https://image.shutterstock.com/image-photo/water-fountain-gargoyle-260nw-73730416.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('9','7j0FaWCBSVanXJqaZrDyvP',3,'prague-czech-republic-august-172019-600w-1722304249.jpg','https://image.shutterstock.com/image-photo/prague-czech-republic-august-172019-600w-1722304249.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('10','7j0FaWCBSVanXJqaZrDyvP',3,'dancing-friends-600w-717409222.jpg','https://image.shutterstock.com/image-photo/dancing-friends-600w-717409222.jpg');


TRUNCATE TABLE guarantee RESTART IDENTITY;
INSERT INTO guarantee(id,pdf,requestor_account_id,responsible_installer_account_id,project_id,guarantee_type_id,system_id,reviewer_account_id,guarantee_template_id,status,start_date,expiry_date,issue_number)
VALUES ('1','http://www.africau.edu/images/default/sample.pdf',5,null,1,'7uSy0NeVTgPiJbOiVYW4DX',null,null,'4cDQT8Au0RrtmzKAdZbAcx','APPROVED','2020-12-18 12:00:00','2050-12-18 12:00:00','61715-062');
INSERT INTO guarantee(id,pdf,requestor_account_id,responsible_installer_account_id,project_id,guarantee_type_id,system_id,reviewer_account_id,guarantee_template_id,status,start_date,expiry_date,issue_number)
VALUES ('2','http://www.africau.edu/images/default/sample.pdf',6,null,3,'54S9J770q5T2jPYxptah89',1,null,'71k4T9LgthbOricwbUvQey','APPROVED','2020-12-18 12:00:00','2050-12-18 12:00:00','54868-5770');
INSERT INTO guarantee(id,pdf,requestor_account_id,responsible_installer_account_id,project_id,guarantee_type_id,system_id,reviewer_account_id,guarantee_template_id,status,start_date,expiry_date,issue_number)
VALUES ('3','null',7,7,2,'2weKEYQ8xXZ56FM0ZtiGXO',2,3,'3N6SohZMuQrKc3U99skZ9N','SUBMITTED','2020-12-18 12:00:00','2020-12-18 12:00:00','36987-1846');


TRUNCATE TABLE guaranteed_product RESTART IDENTITY;
INSERT INTO guaranteed_product(id,product_id,guarantee_id)
VALUES ('1',1,1);
INSERT INTO guaranteed_product(id,product_id,guarantee_id)
VALUES ('2',2,1);
INSERT INTO guaranteed_product(id,product_id,guarantee_id)
VALUES ('3',3,1);


TRUNCATE TABLE invitation RESTART IDENTITY;
INSERT INTO invitation(id,sender_account_id,company_id,status,invitee,personal_note)
VALUES ('1',5,3,'NEW','kim@digital-detox.co.uk','hey come and join us');
INSERT INTO invitation(id,sender_account_id,company_id,status,invitee,personal_note)
VALUES ('2',5,3,'NEW','sam@digital-detox.co.uk','do you wanna be in my gang?');
INSERT INTO invitation(id,sender_account_id,company_id,status,invitee,personal_note)
VALUES ('3',5,3,'NEW','donovan@digital-detox.co.uk','this is that website i told you about');


TRUNCATE TABLE market RESTART IDENTITY;
INSERT INTO market(id,language,domain,cms_space_id,name,send_name,send_mailbox,docebo_installers_branch_id,docebo_company_admin_branch_id,docebo_catalogue_id,merchandising_url,projects_enabled,gtag,geo_middle)
VALUES ('1','en','tra','opay6t6wwmup','Transatlantia','BMI Intouch Mapleland','transatlantia@intouch.bmigroup.com','tbc2','tbc2','tbc2','tbc2',TRUE,'tbc1','27.9139,-82.7157');
INSERT INTO market(id,language,domain,cms_space_id,name,send_name,send_mailbox,docebo_installers_branch_id,docebo_company_admin_branch_id,docebo_catalogue_id,merchandising_url,projects_enabled,gtag,geo_middle)
VALUES ('2','en','mp','opay6t6wwmup','Mapleland','BMI Intouch Mapleland','mapleland@intouch.bmigroup.com','tbc2','tbc2','tbc2','tbc2',TRUE,'tbc1','42.7684,-78.8871');


TRUNCATE TABLE note RESTART IDENTITY;
INSERT INTO note(id,author_id,project_id,body)
VALUES ('1',3,7,'That roof looks a bit like Sydney Opera house');
INSERT INTO note(id,author_id,project_id,body)
VALUES ('2',3,8,'My favourite roof is St Pauls Cathedral');


TRUNCATE TABLE notification RESTART IDENTITY;
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('1',15,'2020-01-17 21:20:11',FALSE,'Dear user 15 eu mi nulla ac enim in tempor turpis nec euismod scelerisque yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('2',17,'2020-10-12 22:57:43',TRUE,'Dear user 17 vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('3',22,'2020-07-04 08:23:58',FALSE,'Dear user 22 et ultrices posuere cubilia curae mauris viverra diam vitae quam suspendisse potenti nullam porttitor lacus at yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('4',8,'2020-03-22 01:17:54',TRUE,'Dear user 8 morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed tristique in tempus yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('5',10,'2020-08-27 17:07:55',FALSE,'Dear user 10 enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem duis aliquam convallis yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('6',11,'2020-09-03 08:07:26',TRUE,'Dear user 11 porta volutpat quam pede lobortis ligula sit amet eleifend pede libero quis yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('7',14,'2020-11-23 19:27:39',FALSE,'Dear user 14 vel ipsum praesent blandit lacinia erat vestibulum sed magna at nunc commodo placerat praesent yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('8',30,'2020-04-22 14:53:50',FALSE,'Dear user 30 tellus semper interdum mauris ullamcorper purus sit amet nulla quisque arcu libero rutrum ac lobortis vel dapibus at yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('9',27,'2020-08-03 00:53:56',FALSE,'Dear user 27 ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla ultrices aliquet maecenas yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('10',28,'2020-08-27 02:47:10',TRUE,'Dear user 28 id ligula suspendisse ornare consequat lectus in est risus auctor sed yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('11',28,'2020-03-01 05:08:09',TRUE,'Dear user 28 condimentum id luctus nec molestie sed justo pellentesque viverra pede ac diam yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('12',29,'2020-03-29 22:44:31',FALSE,'Dear user 29 velit eu est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('13',21,'2020-06-25 00:18:54',TRUE,'Dear user 21 phasellus id sapien in sapien iaculis congue vivamus metus arcu adipiscing yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('14',21,'2020-03-15 02:19:15',FALSE,'Dear user 21 id sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('15',4,'2020-10-19 10:02:54',FALSE,'Dear user 4 ut blandit non interdum in ante vestibulum ante ipsum primis in faucibus orci luctus yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('16',27,'2021-01-01 07:07:02',FALSE,'Dear user 27 et magnis dis parturient montes nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('17',20,'2020-06-18 17:18:03',FALSE,'Dear user 20 lorem quisque ut erat curabitur gravida nisi at nibh in yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('18',30,'2020-10-05 18:28:14',FALSE,'Dear user 30 duis consequat dui nec nisi volutpat eleifend donec ut dolor morbi vel lectus in quam fringilla rhoncus mauris enim yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('19',12,'2020-08-30 20:11:39',TRUE,'Dear user 12 arcu libero rutrum ac lobortis vel dapibus at diam nam tristique tortor yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('20',22,'2020-03-03 19:57:22',FALSE,'Dear user 22 orci vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('21',28,'2020-04-04 17:45:52',FALSE,'Dear user 28 praesent lectus vestibulum quam sapien varius ut blandit non interdum in ante vestibulum ante ipsum yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('22',25,'2020-02-25 03:51:55',TRUE,'Dear user 25 nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti cras in purus eu magna vulputate yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('23',16,'2020-07-27 00:49:01',TRUE,'Dear user 16 nunc viverra dapibus nulla suscipit ligula in lacus curabitur at ipsum ac tellus semper interdum mauris yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('24',17,'2020-09-29 20:16:57',FALSE,'Dear user 17 vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('25',21,'2020-09-10 03:37:38',TRUE,'Dear user 21 lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('26',9,'2020-09-26 02:46:18',TRUE,'Dear user 9 commodo placerat praesent blandit nam nulla integer pede justo lacinia eget tincidunt eget tempus vel pede morbi porttitor lorem id yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('27',17,'2021-01-18 22:51:07',TRUE,'Dear user 17 molestie sed justo pellentesque viverra pede ac diam cras pellentesque volutpat dui maecenas yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('28',22,'2020-05-30 06:12:33',TRUE,'Dear user 22 sit amet consectetuer adipiscing elit proin risus praesent lectus vestibulum yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('29',25,'2021-01-09 08:44:13',FALSE,'Dear user 25 luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet yours truly BMI');
INSERT INTO notification(id,account_id,send_date,unread,body)
VALUES ('30',6,'2020-10-12 13:41:46',TRUE,'Dear user 6 quisque erat eros viverra eget congue eget semper rutrum nulla nunc purus phasellus in felis yours truly BMI');


TRUNCATE TABLE product RESTART IDENTITY;
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('1',1,'PITCHED','123','Braas','BMI Braas Otcom Professional-1XL-1','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Asoka',TRUE,24);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('2',1,'PITCHED','124','Schiedel','BMI Schiedel Asoka Professional-2XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Viva',TRUE,21);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('3',1,'PITCHED','125','Monier','BMI Monier Temp Professional-3XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Lotstring',TRUE,30);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('4',1,'PITCHED','126','Cobert','BMI Cobert It Professional-4XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','It',TRUE,21);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('5',1,'PITCHED','127','Schiedel','BMI Schiedel Sonair Professional-5XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Alphazap',FALSE,21);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('6',1,'FLAT','128','Wierer','BMI Wierer Zathin Professional-6XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Tin',TRUE,26);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('7',2,'FLAT','129','Cobert','BMI Cobert Hatity Professional-7XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Home Ing',TRUE,26);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('8',2,'FLAT','130','Coverland','BMI Coverland Treeflex Professional-8XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Home Ing',TRUE,29);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('9',2,'PITCHED','131','Monier','BMI Monier Mat Lam Tam Professional-9XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Bytecard',TRUE,20);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('10',2,'FLAT','132','Schiedel','BMI Schiedel Sonsing Professional-10XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Konklab',FALSE,21);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('11',1,'PITCHED','133','Braas','BMI Braas Prodder Professional-11XL-1','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Stringtough',TRUE,20);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('12',2,'PITCHED','134','Schiedel','BMI Schiedel Aerified Professional-12XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Cardguard',TRUE,29);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('13',2,'PITCHED','135','Coverland','BMI Coverland Bitchip Professional-13XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Prodder',TRUE,28);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('14',2,'FLAT','136','Braas','BMI Braas Redhold Professional-14XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Veribet',TRUE,29);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('15',2,'FLAT','137','Monier','BMI Monier Namfix Professional-15XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Latlux',FALSE,27);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('16',2,'FLAT','138','Monier','BMI Monier It Professional-16XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Ronstring',TRUE,29);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('17',2,'PITCHED','139','Monier','BMI Monier Opela Professional-17XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Sonair',TRUE,24);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('18',2,'PITCHED','140','Wierer','BMI Wierer Rank Professional-18XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Zathin',TRUE,26);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('19',2,'PITCHED','141','Monier','BMI Monier Home Ing Professional-19XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Y-find',TRUE,29);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('20',2,'FLAT','142','Bramac','BMI Bramac Gembucket Professional-20XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Lotstring',FALSE,30);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('21',1,'PITCHED','143','Schiedel','BMI Schiedel Gembucket Professional-21XL-1','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Tempsoft',TRUE,24);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('22',2,'PITCHED','144','Bramac','BMI Bramac Ventosanzap Professional-22XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Andalax',TRUE,29);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('23',2,'FLAT','145','Schiedel','BMI Schiedel Cookley Professional-23XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Y-Solowarm',TRUE,23);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('24',2,'FLAT','146','Coverland','BMI Coverland Voyatouch Professional-24XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Alpha',TRUE,24);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('25',2,'FLAT','147','Braas','BMI Braas Zamit Professional-25XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Tresom',FALSE,30);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('26',2,'PITCHED','148','Bramac','BMI Bramac Hatity Professional-26XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Daltfresh',TRUE,27);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('27',2,'PITCHED','149','Schiedel','BMI Schiedel Lotstring Professional-27XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Andalax',TRUE,27);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('28',2,'PITCHED','150','Coverland','BMI Coverland Zaam-Dox Professional-28XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Lotstring',TRUE,25);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('29',2,'FLAT','151','Coverland','BMI Coverland Greenlam Professional-29XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Ronstring',TRUE,29);
INSERT INTO product(id,market_id,technology,bmi_ref,brand,name,description,family,published,maximum_validity_years)
VALUES ('30',2,'PITCHED','152','Schiedel','BMI Schiedel Temp Professional-30XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Quo Lux',FALSE,26);


TRUNCATE TABLE project RESTART IDENTITY;
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('1',2,'FLAT','868 Sommers Crossing','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,504,'ccardenoza0@sogou.com','Christie','Cardenoza','Devpoint','2021-01-08 17:40:47','2020-11-11 00:40:39');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('2',2,'PITCHED','74 Kingsford Junction','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,166,'achazelle1@statcounter.com','Andra','Chazelle','Bluezoom','2020-05-19 12:35:43','2020-06-15 23:26:51');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('3',2,'FLAT','3 Straubel Street','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,147,'jkirkpatrick2@unesco.org','Jeni','Kirkpatrick','Jamia','2020-10-06 18:14:00','2020-07-11 01:43:34');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('4',2,'PITCHED','5835 Harper Drive','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,731,'kferrarini3@smugmug.com','Kalina','Ferrarini','Skinix','2020-06-29 22:04:15','2020-07-03 15:58:44');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('5',2,'FLAT','055 Debs Parkway','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,399,'sleppington4@census.gov','Sheba','Leppington','Tagcat','2020-10-30 20:55:40','2020-10-21 23:13:17');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('6',2,'PITCHED','56596 Huxley Avenue','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,906,'klevane5@usatoday.com','Kizzee','Levane','Kamba','2020-05-03 09:40:24','2020-12-15 07:11:28');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('7',2,'FLAT','44615 Browning Place','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,867,'spopeley6@chronoengine.com','Stoddard','Popeley','Skiba','2020-09-01 15:23:49','2021-09-05 02:53:08');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('8',2,'PITCHED','49566 Morningstar Junction','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,893,'bmeadley7@ted.com','Belle','Meadley','Shuffledrive','2021-02-04 13:31:41','2020-05-06 11:48:16');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('9',2,'FLAT','737 Holmberg Junction','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,764,'rcasaccia8@ox.ac.uk','Ramonda','Casaccia','Wordware','2020-08-04 22:55:53','2021-03-03 22:31:12');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('10',2,'PITCHED','14268 Texas Avenue','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,64,'wsaxby9@ocn.ne.jp','Wilona','Saxby','Wikivu','2020-05-01 11:44:41','2021-01-02 02:26:17');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('11',2,'FLAT','54 Northport Center','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,734,'mcavea@fda.gov','Maxie','Cave','Gabspot','2020-11-05 07:06:59','2020-12-26 04:18:29');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('12',2,'PITCHED','671 Hanover Court','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,654,'dmerrikinb@wikispaces.com','Dulcia','Merrikin','Tavu','2021-01-26 02:44:30','2020-12-20 17:09:32');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('13',2,'FLAT','2958 Springs Drive','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,790,'jmarrowc@japanpost.jp','Janeta','Marrow','Avamba','2020-01-27 12:24:09','2021-01-13 20:32:15');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('14',2,'PITCHED','29 Express Court','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,317,'evigursd@omniture.com','Eartha','Vigurs','Flashdog','2020-04-11 03:31:01','2020-09-08 14:43:16');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('15',2,'FLAT','5 Barby Road','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,983,'clamburne@ted.com','Christean','Lamburn','Twitterlist','2020-09-10 17:53:10','2020-11-02 11:09:06');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('16',2,'PITCHED','9 Steensland Lane','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,571,'dbourdonf@cam.ac.uk','Dione','Bourdon','Camido','2020-03-05 09:04:55','2021-01-26 03:08:41');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('17',2,'FLAT','5883 Chive Plaza','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,84,'bhalbardg@ibm.com','Bertha','Halbard','Twitterbeat','2021-01-20 06:12:18','2020-03-01 12:41:25');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('18',2,'PITCHED','93 Sugar Terrace','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,584,'cmctrustieh@liveinternet.ru','Clareta','McTrustie','Oyoba','2020-01-07 20:41:10','2021-01-05 04:48:37');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('19',2,'FLAT','21959 Caliangt Way','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,131,'tdreheri@weibo.com','Tammy','Dreher','Browseblab','2020-06-29 18:56:42','2020-04-02 19:28:51');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('20',2,'PITCHED','1260 Lakewood Gardens Avenue','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,905,'rdanilovichj@netlog.com','Rosmunda','Danilovich','Meejo','2020-03-06 13:51:39','2020-06-01 09:23:29');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('21',2,'FLAT','882 Fairfield Way','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,699,'nbatthewk@dell.com','Nichole','Batthew','Skynoodle','2020-07-04 01:34:23','2021-10-13 11:19:17');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('22',2,'PITCHED','6843 Farragut Hill','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,337,'cmartinotl@mediafire.com','Chloette','Martinot','Demizz','2020-02-15 07:52:20','2021-01-20 15:22:34');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('23',2,'FLAT','3 Tony Point','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,705,'acurgenuerm@domainmarket.com','Ardelia','Curgenuer','Ooba','2020-12-11 07:17:57','2020-08-30 15:41:14');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('24',2,'PITCHED','138 Waubesa Drive','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,684,'bjoutapaitisn@topsy.com','Barb','Joutapaitis','Mynte','2020-08-28 21:42:11','2021-02-13 17:14:13');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('25',2,'FLAT','065 Sullivan Plaza','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,828,'rpleaceo@mail.ru','Ronda','Pleace','Yakijo','2020-10-20 12:46:12','2020-12-06 17:12:55');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('26',1,'PITCHED','599 3rd Junction','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,910,'ddallinderp@cornell.edu','Daphna','Dallinder','Quinu','2021-01-19 13:11:28','2021-09-12 07:07:26');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('27',1,'FLAT','767 Debs Terrace','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,655,'gbainesq@mtv.com','Gabbi','Baines','Dabvine','2020-11-30 01:13:51','2021-10-16 04:45:59');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('28',1,'PITCHED','7530 John Wall Drive','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,841,'mselleyr@independent.co.uk','Mirabelle','Selley','Zoonder','2020-01-02 09:01:22','2020-03-02 21:38:53');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('29',1,'FLAT','958 Carioca Road','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,383,'iwhyberds@wp.com','Isabelita','Whyberd','Blogtags','2020-03-09 15:50:11','2020-07-16 06:19:59');
INSERT INTO project(id,company_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('30',1,'PITCHED','0221 Lotheville Avenue','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,107,'sastlest@ehow.com','Susi','Astles','Bluejam','2020-09-14 09:38:28','2021-01-31 23:15:04');


TRUNCATE TABLE project_member RESTART IDENTITY;
INSERT INTO project_member(id,project_id,account_id)
VALUES ('1',1,21);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('2',1,22);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('3',1,23);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('4',2,24);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('5',2,25);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('6',2,26);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('7',3,27);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('8',3,28);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('9',3,29);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('10',4,21);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('11',4,22);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('12',4,23);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('13',5,24);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('14',5,25);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('15',5,26);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('16',1,27);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('17',1,28);
INSERT INTO project_member(id,project_id,account_id)
VALUES ('18',1,29);


TRUNCATE TABLE system RESTART IDENTITY;
INSERT INTO system(id,market_id,technology,bmi_ref,name,description,maximum_validity_years,published)
VALUES ('1',2,'FLAT','234','BMI Tarantula System X11 for Professionals','Uses BMI specific technology, the BMI Tarantula System X11 for Professionals system is best in class, intended for those who value Managed actuating parallelism',31,TRUE);
INSERT INTO system(id,market_id,technology,bmi_ref,name,description,maximum_validity_years,published)
VALUES ('2',2,'FLAT','235','BMI White stork System X12 for Professionals','Uses BMI specific technology, the BMI White stork System X12 for Professionals system is best in class, intended for those who value Right-sized contextually-based implementation',20,TRUE);
INSERT INTO system(id,market_id,technology,bmi_ref,name,description,maximum_validity_years,published)
VALUES ('3',2,'FLAT','236','BMI Urial System X13 for Professionals','Uses BMI specific technology, the BMI Urial System X13 for Professionals system is best in class, intended for those who value Reactive demand-driven function',31,TRUE);
INSERT INTO system(id,market_id,technology,bmi_ref,name,description,maximum_validity_years,published)
VALUES ('4',2,'PITCHED','237','BMI Asian lion System X24 for Professionals','Uses BMI specific technology, the BMI Asian lion System X24 for Professionals system is best in class, intended for those who value Front-line full-range system engine',30,TRUE);
INSERT INTO system(id,market_id,technology,bmi_ref,name,description,maximum_validity_years,published)
VALUES ('5',2,'PITCHED','238','BMI Striped skunk System X25 for Professionals','Uses BMI specific technology, the BMI Striped skunk System X25 for Professionals system is best in class, intended for those who value Multi-lateral motivating artificial intelligence',35,TRUE);
INSERT INTO system(id,market_id,technology,bmi_ref,name,description,maximum_validity_years,published)
VALUES ('6',2,'PITCHED','239','BMI Striped dolphin System X26 for Professionals','Uses BMI specific technology, the BMI Striped dolphin System X26 for Professionals system is best in class, intended for those who value Front-line mobile capacity',35,FALSE);


TRUNCATE TABLE system_member RESTART IDENTITY;
INSERT INTO system_member(id,system_id,product_id)
VALUES ('1',1,1);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('2',1,2);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('3',1,3);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('4',2,1);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('5',2,2);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('6',2,4);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('7',3,1);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('8',3,2);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('9',3,3);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('10',3,4);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('11',4,1);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('12',4,2);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('13',4,4);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('14',4,6);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('15',4,8);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('16',5,9);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('17',5,10);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('18',5,11);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('19',6,12);
INSERT INTO system_member(id,system_id,product_id)
VALUES ('20',6,13);

ALTER TABLE account ADD UNIQUE (docebo_user_id);

ALTER TABLE account ADD FOREIGN KEY (market_id) REFERENCES market(id);
CREATE INDEX ON account (market_id);

ALTER TABLE address ADD FOREIGN KEY (project_id) REFERENCES project(id);
CREATE INDEX ON address (project_id);

ALTER TABLE address ADD FOREIGN KEY (company_id) REFERENCES company(id);
CREATE INDEX ON address (company_id);

ALTER TABLE certification ADD FOREIGN KEY (docebo_user_id) REFERENCES account(docebo_user_id);
CREATE INDEX ON certification (docebo_user_id);

ALTER TABLE company ADD FOREIGN KEY (market_id) REFERENCES market(id);
CREATE INDEX ON company (market_id);

ALTER TABLE company_document ADD FOREIGN KEY (company_id) REFERENCES company(id);
CREATE INDEX ON company_document (company_id);

ALTER TABLE company_member ADD FOREIGN KEY (market_id) REFERENCES market(id);
CREATE INDEX ON company_member (market_id);

ALTER TABLE company_member ADD FOREIGN KEY (account_id) REFERENCES account(id);
CREATE INDEX ON company_member (account_id);

ALTER TABLE company_member ADD FOREIGN KEY (company_id) REFERENCES company(id);
CREATE INDEX ON company_member (company_id);

ALTER TABLE company_operation ADD FOREIGN KEY (company) REFERENCES company(id);
CREATE INDEX ON company_operation (company);

ALTER TABLE evidence_item ADD FOREIGN KEY (guarantee_id) REFERENCES guarantee(id);
CREATE INDEX ON evidence_item (guarantee_id);

ALTER TABLE guarantee ADD FOREIGN KEY (requestor_account_id) REFERENCES account(id);
CREATE INDEX ON guarantee (requestor_account_id);

ALTER TABLE guarantee ADD FOREIGN KEY (responsible_installer_account_id) REFERENCES account(id);
CREATE INDEX ON guarantee (responsible_installer_account_id);

ALTER TABLE guarantee ADD FOREIGN KEY (project_id) REFERENCES project(id);
CREATE INDEX ON guarantee (project_id);

ALTER TABLE guarantee ADD FOREIGN KEY (system_id) REFERENCES system(id);
CREATE INDEX ON guarantee (system_id);

ALTER TABLE guarantee ADD FOREIGN KEY (reviewer_account_id) REFERENCES account(id);
CREATE INDEX ON guarantee (reviewer_account_id);

ALTER TABLE guaranteed_product ADD FOREIGN KEY (product_id) REFERENCES product(id);
CREATE INDEX ON guaranteed_product (product_id);

ALTER TABLE guaranteed_product ADD FOREIGN KEY (guarantee_id) REFERENCES guarantee(id);
CREATE INDEX ON guaranteed_product (guarantee_id);

ALTER TABLE invitation ADD FOREIGN KEY (sender_account_id) REFERENCES account(id);
CREATE INDEX ON invitation (sender_account_id);

ALTER TABLE invitation ADD FOREIGN KEY (company_id) REFERENCES company(id);
CREATE INDEX ON invitation (company_id);

ALTER TABLE note ADD FOREIGN KEY (author_id) REFERENCES account(id);
CREATE INDEX ON note (author_id);

ALTER TABLE note ADD FOREIGN KEY (project_id) REFERENCES project(id);
CREATE INDEX ON note (project_id);

ALTER TABLE notification ADD FOREIGN KEY (account_id) REFERENCES account(id);
CREATE INDEX ON notification (account_id);

ALTER TABLE product ADD FOREIGN KEY (market_id) REFERENCES market(id);
CREATE INDEX ON product (market_id);

ALTER TABLE project ADD FOREIGN KEY (company_id) REFERENCES company(id);
CREATE INDEX ON project (company_id);

ALTER TABLE project_member ADD FOREIGN KEY (project_id) REFERENCES project(id);
CREATE INDEX ON project_member (project_id);

ALTER TABLE project_member ADD FOREIGN KEY (account_id) REFERENCES account(id);
CREATE INDEX ON project_member (account_id);

ALTER TABLE system ADD FOREIGN KEY (market_id) REFERENCES market(id);
CREATE INDEX ON system (market_id);

ALTER TABLE system_member ADD FOREIGN KEY (system_id) REFERENCES system(id);
CREATE INDEX ON system_member (system_id);

ALTER TABLE system_member ADD FOREIGN KEY (product_id) REFERENCES product(id);
CREATE INDEX ON system_member (product_id);

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
COMMENT ON COLUMN account.photo IS 'File reference or the file itself. A profile picture of the user';

COMMENT ON TABLE address IS 'A generic address';
COMMENT ON COLUMN address.id IS 'Primary key';
COMMENT ON COLUMN address.project_id IS 'fk';
COMMENT ON COLUMN address.company_id IS 'fk';
COMMENT ON COLUMN address.address_type IS 'ek';
COMMENT ON COLUMN address.first_line IS 'First line of this address';
COMMENT ON COLUMN address.second_line IS 'Second line of this address';
COMMENT ON COLUMN address.town IS 'The postal town';
COMMENT ON COLUMN address.country IS 'The country for this address';
COMMENT ON COLUMN address.postcode IS 'The postcode for this address';

COMMENT ON TABLE certification IS 'A company that has been registered in InTouch';
COMMENT ON COLUMN certification.id IS 'Primary key';
COMMENT ON COLUMN certification.docebo_user_id IS 'fk';
COMMENT ON COLUMN certification.technology IS 'technology';
COMMENT ON COLUMN certification.name IS 'The name of the certification according to Docebo';
COMMENT ON COLUMN certification.expiry_date IS 'The last day that this certification is valid';

COMMENT ON TABLE company IS 'A company that has been registered in InTouch';
COMMENT ON COLUMN company.id IS 'Primary key';
COMMENT ON COLUMN company.market_id IS 'fk';
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
COMMENT ON COLUMN company.tax_number IS 'The Tax number in that number, such as the VAT number';
COMMENT ON COLUMN company.phone IS 'They Companys public phone number';
COMMENT ON COLUMN company.coordinates IS 'The companys GoogleMap address';
COMMENT ON COLUMN company.about_us IS 'A bit of blurb to appear in Find a contractor';
COMMENT ON COLUMN company.public_email IS 'The email address that they can be contacted with by the public assuming they are listed.';
COMMENT ON COLUMN company.website IS 'The Company website URL';
COMMENT ON COLUMN company.facebook IS 'The Company facebook website';
COMMENT ON COLUMN company.linked_in IS 'Their Company LinkedIn page URL';
COMMENT ON COLUMN company.reference_number IS 'A 7 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. ';
COMMENT ON COLUMN company.logo IS 'A reference to the logo';

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

COMMENT ON TABLE evidence_item IS 'An item of evidence for a guarantee';
COMMENT ON COLUMN evidence_item.id IS 'Primary key';
COMMENT ON COLUMN evidence_item.evidence_category_id IS 'a reference to the evidenceCategory sys id in Contentful';
COMMENT ON COLUMN evidence_item.guarantee_id IS 'fk';
COMMENT ON COLUMN evidence_item.name IS 'Short name for the item of evidence';
COMMENT ON COLUMN evidence_item.attachment IS 'File reference or the file itself. Photo of the evidence';

COMMENT ON TABLE guarantee IS 'Starts life as request for a gurantee and becomes an actual issued guarantee';
COMMENT ON COLUMN guarantee.id IS 'Primary key - starts at 6100';
COMMENT ON COLUMN guarantee.pdf IS 'The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand';
COMMENT ON COLUMN guarantee.requestor_account_id IS 'fk';
COMMENT ON COLUMN guarantee.responsible_installer_account_id IS 'fk';
COMMENT ON COLUMN guarantee.project_id IS 'fk';
COMMENT ON COLUMN guarantee.guarantee_type_id IS 'a reference to the guaranteeType sys id in Contentful';
COMMENT ON COLUMN guarantee.system_id IS 'fk';
COMMENT ON COLUMN guarantee.reviewer_account_id IS 'fk';
COMMENT ON COLUMN guarantee.guarantee_template_id IS 'a reference to the guaranteeType sys id in Contentful';
COMMENT ON COLUMN guarantee.status IS 'ek';
COMMENT ON COLUMN guarantee.start_date IS 'The date that the Guarantee is approved either automatically or manually.';
COMMENT ON COLUMN guarantee.expiry_date IS 'When the guarantee will expire.  This is calculated when the request_status becomes APPROVED. dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier.';
COMMENT ON COLUMN guarantee.issue_number IS 'This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Request Id.';

COMMENT ON TABLE guaranteed_product IS 'A mapping of Products to Guarantees.  Needed because uou can have more than one Product per Product Guarantee.';
COMMENT ON COLUMN guaranteed_product.id IS 'Primary key';
COMMENT ON COLUMN guaranteed_product.product_id IS 'fk';
COMMENT ON COLUMN guaranteed_product.guarantee_id IS 'fk';

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
COMMENT ON COLUMN market.projects_enabled IS 'Whether the market supports Projects.  If so then the Project section is available.  Tier 0 can then be configured to support Guarantees in non-Roopro countries.  In Roofpro countries various Tier configurations become possible.';
COMMENT ON COLUMN market.gtag IS 'Reference to the Google Analytics tracking ID that is used for the Country GA reports';
COMMENT ON COLUMN market.geo_middle IS 'The coordinates of the middle of the country on a map';

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
COMMENT ON COLUMN product.name IS 'Short name for the product';
COMMENT ON COLUMN product.description IS 'A description of the product';
COMMENT ON COLUMN product.family IS 'The family of Products this Product is in';
COMMENT ON COLUMN product.published IS 'Whether the product is avialable when being selected or not';
COMMENT ON COLUMN product.maximum_validity_years IS 'The number of years that this product can be guaranteed for';

COMMENT ON TABLE project IS 'A project that has been put into InTouch by a Company Administrator to represent a project being done by that company';
COMMENT ON COLUMN project.id IS 'Primary key';
COMMENT ON COLUMN project.company_id IS 'fk';
COMMENT ON COLUMN project.technology IS 'ek';
COMMENT ON COLUMN project.name IS 'Short name for the Project';
COMMENT ON COLUMN project.description IS 'Short description of what the Project is about.  Sometimes useful to clarify some points to BMI';
COMMENT ON COLUMN project.hidden IS 'If this is true then the Project should have been hidden from users';
COMMENT ON COLUMN project.roof_area IS 'The number of square meters of roof that this project covers';
COMMENT ON COLUMN project.building_owner_mail IS 'Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project.';
COMMENT ON COLUMN project.building_owner_firstname IS 'Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued.';
COMMENT ON COLUMN project.building_owner_lastname IS 'Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued.';
COMMENT ON COLUMN project.building_owner_company IS 'Name of the Building Owners Company if they have one';
COMMENT ON COLUMN project.start_date IS 'The date that the Project starts';
COMMENT ON COLUMN project.end_date IS 'The date that the Project expects to end.  ';

COMMENT ON TABLE project_member IS 'A connection between a User and a Project. A connection between a user and a company. This relationship could be simplified as one to many at the moment, but there is already demand for a many to many relationship.';
COMMENT ON COLUMN project_member.id IS 'Primary key';
COMMENT ON COLUMN project_member.project_id IS 'fk';
COMMENT ON COLUMN project_member.account_id IS 'fk';

COMMENT ON TABLE system IS 'A collection of products that can be guaranteed as a system';
COMMENT ON COLUMN system.id IS 'Primary key';
COMMENT ON COLUMN system.market_id IS 'fk';
COMMENT ON COLUMN system.technology IS 'ek';
COMMENT ON COLUMN system.bmi_ref IS 'A unique reference for the system known to BMI';
COMMENT ON COLUMN system.name IS 'Short name for the System';
COMMENT ON COLUMN system.description IS 'A description for the System';
COMMENT ON COLUMN system.maximum_validity_years IS 'The maximum number of years that this system can be guaranteed for.  Must be greater than 10.';
COMMENT ON COLUMN system.published IS 'If true this system is on that is available for users to select when applying for a system or solution guarantee';

COMMENT ON TABLE system_member IS 'A system product pair';
COMMENT ON COLUMN system_member.id IS 'Primary key';
COMMENT ON COLUMN system_member.system_id IS 'fk';
COMMENT ON COLUMN system_member.product_id IS 'fk';

SELECT SETVAL('account_id_seq', (select MAX(ID) from account));
SELECT SETVAL('address_id_seq', (select MAX(ID) from address));
SELECT SETVAL('certification_id_seq', (select MAX(ID) from certification));
SELECT SETVAL('company_id_seq', (select MAX(ID) from company));
SELECT SETVAL('company_document_id_seq', (select MAX(ID) from company_document));
SELECT SETVAL('company_member_id_seq', (select MAX(ID) from company_member));
SELECT SETVAL('company_operation_id_seq', (select MAX(ID) from company_operation));
SELECT SETVAL('evidence_item_id_seq', (select MAX(ID) from evidence_item));
SELECT SETVAL('guarantee_id_seq', (select MAX(ID) from guarantee));
SELECT SETVAL('guaranteed_product_id_seq', (select MAX(ID) from guaranteed_product));
SELECT SETVAL('invitation_id_seq', (select MAX(ID) from invitation));
SELECT SETVAL('market_id_seq', (select MAX(ID) from market));
SELECT SETVAL('note_id_seq', (select MAX(ID) from note));
SELECT SETVAL('notification_id_seq', (select MAX(ID) from notification));
SELECT SETVAL('product_id_seq', (select MAX(ID) from product));
SELECT SETVAL('project_id_seq', (select MAX(ID) from project));
SELECT SETVAL('project_member_id_seq', (select MAX(ID) from project_member));
SELECT SETVAL('system_id_seq', (select MAX(ID) from system));
SELECT SETVAL('system_member_id_seq', (select MAX(ID) from system_member));

CREATE OR REPLACE FUNCTION update_modified_column()
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
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_address_updated_at 
BEFORE UPDATE ON address 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_certification_updated_at 
BEFORE UPDATE ON certification 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_company_updated_at 
BEFORE UPDATE ON company 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_company_document_updated_at 
BEFORE UPDATE ON company_document 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_company_member_updated_at 
BEFORE UPDATE ON company_member 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_company_operation_updated_at 
BEFORE UPDATE ON company_operation 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_evidence_item_updated_at 
BEFORE UPDATE ON evidence_item 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_guarantee_updated_at 
BEFORE UPDATE ON guarantee 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_guaranteed_product_updated_at 
BEFORE UPDATE ON guaranteed_product 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_invitation_updated_at 
BEFORE UPDATE ON invitation 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_market_updated_at 
BEFORE UPDATE ON market 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_note_updated_at 
BEFORE UPDATE ON note 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_notification_updated_at 
BEFORE UPDATE ON notification 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_product_updated_at 
BEFORE UPDATE ON product 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_project_updated_at 
BEFORE UPDATE ON project 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_project_member_updated_at 
BEFORE UPDATE ON project_member 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_system_updated_at 
BEFORE UPDATE ON system 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

