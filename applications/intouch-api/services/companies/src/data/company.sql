
DROP TYPE IF EXISTS account_status CASCADE;
CREATE TYPE account_status  AS ENUM (
'NEW',
'ACTIVE',
'SUSPENDED'
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
  
DROP TYPE IF EXISTS role CASCADE;
CREATE TYPE role  AS ENUM (
'SUPER_ADMIN',
'MARKET_ADMIN',
'INSTALLER',
'COMPANY_ADMIN'
);  
  
DROP TYPE IF EXISTS locale CASCADE;
CREATE TYPE locale  AS ENUM (
'da_DK',
'no_NO',
'en_MY',
'en_IN',
'sv_SE',
'pt_PT',
'de_AT',
'nl_NL',
'sk_SK',
'fr_BE',
'nl_BE',
'fr_FR',
'pl_PL',
'es_ES',
'fi_FI',
'en_US',
'en_CA',
'fr_CA'
);  
  
DROP TYPE IF EXISTS message_format CASCADE;
CREATE TYPE message_format  AS ENUM (
'EMAIL',
'NOTIFICATION',
'ALL'
);  
  
DROP TYPE IF EXISTS request_status CASCADE;
CREATE TYPE request_status  AS ENUM (
'NEW',
'SUBMITTED',
'REVIEW',
'REJECTED',
'APPROVED'
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
  
DROP TYPE IF EXISTS invitation_type CASCADE;
CREATE TYPE invitation_type  AS ENUM (
'JOIN_COMPANY',
'BECOME_ADMIN',
'BECOME_OWNER'
);  
  

DROP TABLE IF EXISTS account CASCADE;
CREATE TABLE account (
id SERIAL PRIMARY KEY,
created_by int,
status account_status,
market_id int,
role role,
email text,
phone text,
first_name text,
last_name text,
created timestamp,
docebo_id text,
photo text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address (
id SERIAL PRIMARY KEY,
first_line text,
second_line text,
town text,
country text,
postcode text,
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
registered_address_id int,
trading_address_id int,
business_type business_type,
tier tier,
status company_status,
registered_by text,
registered_date timestamp,
lms_group text,
name text,
tax_number text,
phone text,
coordinates text,
about_us text,
public_email text,
website text,
facebook text,
linked_in text,
reference_number text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS company_document CASCADE;
CREATE TABLE company_document (
id SERIAL PRIMARY KEY,
company_id int,
name text,
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

DROP TABLE IF EXISTS evidence_item CASCADE;
CREATE TABLE evidence_item (
id SERIAL PRIMARY KEY,
evidence_category_id int,
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
guarantee_type_id int,
system_id int,
reviewer_account_id int,
status request_status,
start_date timestamp,
expiry timestamp,
issue_number text,
purchase_date timestamp,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS invitation CASCADE;
CREATE TABLE invitation (
id SERIAL PRIMARY KEY,
account_id int,
type invitation_type,
invitee text,
accepted boolean,
generated timestamp,
expires timestamp,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS market CASCADE;
CREATE TABLE market (
id SERIAL PRIMARY KEY,
locale locale,
cms_space_id text,
name text,
send_name text,
send_mailbox text,
lms_branch text,
lms_owner_branch text,
projects_enabled boolean,
news text,
live boolean,
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
brand text,
name text,
description text,
family text,
published boolean,
validity int,
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

DROP TABLE IF EXISTS project CASCADE;
CREATE TABLE project (
id SERIAL PRIMARY KEY,
company_id int,
building_owner_address_id int,
site_address_id int,
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
name text,
description text,
maximum_validity int,
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

DROP TABLE IF EXISTS tier_offset CASCADE;
CREATE TABLE tier_offset (
id SERIAL PRIMARY KEY,
market_id int,
tier tier,
validity_offset int,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);


TRUNCATE TABLE account RESTART IDENTITY;
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('1',1,'ACTIVE',1,'SUPER_ADMIN','millyes0@jiathis.com','34144','Mike','Illyes','2020-06-12 10:19:47','42507-498','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('2',1,'ACTIVE',1,'MARKET_ADMIN','fmcevoy1@yellowbook.com','324234','Franny','McEvoy','2020-02-05 00:23:27','59779-981','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('3',1,'ACTIVE',2,'MARKET_ADMIN','ocastanaga2@bigcartel.com','33332','Ogdon','Castanaga','2020-09-23 17:50:40','65197-300','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('4',1,'ACTIVE',2,'COMPANY_ADMIN','jharkin3@cdbaby.com','23566','Jessey','Harkin','2020-04-01 02:21:47','58165-032','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('5',1,'ACTIVE',2,'COMPANY_ADMIN','kpohls4@photobucket.com','6644664','Kort','Pohls','2020-02-20 01:18:43','42747-235','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('6',1,'ACTIVE',1,'COMPANY_ADMIN','tmoores5@cyberchimps.com','32322','Templeton','Moores','2020-07-29 10:17:22','54868-5935','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('7',1,'ACTIVE',2,'COMPANY_ADMIN','jkemson6@cyberchimps.com','34144','Jonathan','Kemson','2020-10-12 04:35:35','0169-7010','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('8',1,'ACTIVE',1,'COMPANY_ADMIN','rghio7@si.edu','324234','Reine','Ghio','2020-12-04 21:18:47','34645-2325','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('9',1,'SUSPENDED',2,'COMPANY_ADMIN','qwinsiowiecki8@dropbox.com','33332','Quintilla','Winsiowiecki','2020-06-17 23:27:45','68084-166','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('10',1,'ACTIVE',2,'INSTALLER','vcumberland9@zimbio.com','23566','Verna','Cumberland','2020-09-04 11:32:48','60512-6025','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('11',1,'ACTIVE',1,'INSTALLER','tbisphama@theguardian.com','6644664','Torrence','Bispham','2020-08-09 22:56:17','47682-406','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('12',1,'ACTIVE',1,'INSTALLER','gshawcroftb@europa.eu','32322','Gibbie','Shawcroft','2020-11-24 23:13:49','0143-9723','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('13',1,'ACTIVE',1,'INSTALLER','bhaironc@who.int','34144','Bobbi','Hairon','2020-09-08 18:34:46','24385-549','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('14',1,'ACTIVE',1,'INSTALLER','adeclercd@delicious.com','324234','Arlene','de Clerc','2020-06-11 19:38:17','47335-834','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('15',1,'ACTIVE',2,'INSTALLER','jkopische@ted.com','33332','Juditha','Kopisch','2020-06-27 09:12:20','36987-2008','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('16',1,'ACTIVE',2,'INSTALLER','ccammf@a8.net','23566','Claiborne','Camm','2020-04-22 00:12:02','63402-712','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('17',1,'NEW',2,'INSTALLER','jshanksterg@smh.com.au','6644664','Johnathon','Shankster','2020-02-19 19:54:49','65044-3518','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('18',1,'SUSPENDED',2,'INSTALLER','odooheyh@goodreads.com','32322','Otto','Doohey','2020-08-16 20:47:27','48433-320','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('19',1,'ACTIVE',2,'INSTALLER','ashorlandi@imgur.com','34144','Anselma','Shorland','2020-11-10 05:29:49','47781-266','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('20',1,'ACTIVE',2,'INSTALLER','mcopsj@odnoklassniki.ru','324234','Mauricio','Cops','2020-08-26 16:30:41','63629-2796','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('21',1,'ACTIVE',2,'INSTALLER','mrobinettk@nba.com','33332','Mateo','Robinett','2020-10-01 21:01:06','0677-1979','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('22',1,'ACTIVE',2,'INSTALLER','chatherleighl@foxnews.com','23566','Cookie','Hatherleigh','2020-07-01 09:26:58','0268-6196','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('23',1,'ACTIVE',2,'INSTALLER','dpallisterm@toplist.cz','6644664','Dieter','Pallister','2020-01-27 02:38:03','0409-2308','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('24',1,'ACTIVE',2,'INSTALLER','sleafn@theguardian.com','34144','Susette','Leaf','2020-10-13 23:58:03','0378-7155','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('25',1,'ACTIVE',2,'INSTALLER','bpepallo@cmu.edu','324234','Brandyn','Pepall','2021-01-22 08:13:05','62175-446','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('26',1,'NEW',2,'INSTALLER','jlathep@amazon.de','33332','Jenn','Lathe','2020-08-10 03:35:07','63323-763','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('27',1,'SUSPENDED',2,'INSTALLER','lplacideq@ftc.gov','23566','Luigi','Placide','2020-03-28 05:19:50','68382-117','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('28',1,'ACTIVE',2,'INSTALLER','kstedallr@walmart.com','6644664','Konstantine','Stedall','2020-05-21 20:08:10','57896-396','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('29',1,'ACTIVE',2,'INSTALLER','drockwells@technorati.com','32322','Dennis','Rockwell','2020-02-19 00:12:10','11523-7350','https://thispersondoesnotexist.com/image');
INSERT INTO account(id,created_by,status,market_id,role,email,phone,first_name,last_name,created,docebo_id,photo)
VALUES ('30',1,'ACTIVE',2,'INSTALLER','ddanzigt@w3.org','22222','Dalila','Danzig','2020-02-09 10:30:04','41250-424','https://thispersondoesnotexist.com/image');

TRUNCATE TABLE address RESTART IDENTITY;
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('1','349 Dixon Drive','Blaine','Cential','Portugal','3070-085');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('2','403 Barnett Drive','Thompson','Porto Calvo','Brazil','57900-000');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('3','60 Mandrake Avenue','Heath','Annecy-le-Vieux','France','74944 CEDEX');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('4','5 Cordelia Plaza','Hazelcrest','Muriaé','Brazil','36880-000');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('5','6593 Basil Terrace','Towne','Mniszków','Poland','26-341');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('6','31 Elka Drive','Pearson','Huyang','China','5139');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('7','867 Birchwood Pass','Melby','Marull','Argentina','57900-000');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('8','146 Almo Lane','Schmedeman','Youfang','China','74944 CEDEX');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('9','7 Farwell Road','Jenifer','Karangampel','Indonesia','74944 CEDEX');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('10','22 Leroy Street','Becker','Mahābād','Iran','36880-000');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('11','94 Butternut Court','Hagan','Lodoyo','Indonesia','26-341');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('12','8941 Mockingbird Way','Waxwing','Alverca do Ribatejo','Portugal','2615-009');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('13','00904 Green Point','Ronald Regan','Khāndbāri','Nepal',null);
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('14','5624 Rigney Avenue','Algoma','Morez','France','39409 CEDEX');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('15','56244 Birchwood Junction','Autumn Leaf','Thai Charoen','Thailand','55000');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('16','18869 Ridge Oak Trail','Jana','Tīrān','Iran','5139');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('17','20863 Cordelia Crossing','Montana','Itaí','Brazil','57900-000');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('18','56054 Arrowood Avenue','Dryden','Cihua','China','74944 CEDEX');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('19','2 Bellgrove Park','Village','Sabadell','Spain','8204');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('20','5 Fulton Road','Hintze','Rongcheng','China','5139');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('21','615 Quincy Pass','Alpine','Hongde','China','57900-000');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('22','021 Kingsford Circle','Tennessee','San Isidro','Philippines','74944 CEDEX');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('23','291 Rusk Court','Katie','Songshan','China','39409 CEDEX');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('24','140 Lake View Hill','Brickson Park','Béthune','France','55000');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('25','354 Eagle Crest Place','Russell','Severo-Zadonsk','Russia','5139');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('26','3 Waywood Trail','Mayer','Solnechnyy','Russia','57900-000');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('27','1 Killdeer Junction','Emmet','Geshan','China','74944 CEDEX');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('28','51 Dunning Terrace','Schmedeman','Novoye Leushino','Russia','8204');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('29','67 Spenser Lane','Boyd','Paris 19','France','5139');
INSERT INTO address(id,first_line,second_line,town,country,postcode)
VALUES ('30','997 Mariners Cove Center','Independence','Yongqin','China','5139');

TRUNCATE TABLE company RESTART IDENTITY;
INSERT INTO company(id,market_id,owner_fullname,owner_email,owner_phone,registered_address_id,trading_address_id,business_type,tier,status,registered_by,registered_date,lms_group,name,tax_number,phone,coordinates,about_us,public_email,website,facebook,linked_in,reference_number)
VALUES ('1',2,'James Marshall Hendrix','jimi@test.com','1232123',1,4,'CONTRACTOR','T1','ACTIVE','twhorlton0@miibeian.gov.cn','2020-10-20 12:00:00','Blue','Barrows, Legros and Kuhic','63323-463','843-985-4588','27.9139,-82.7157','Compatible full-range architecture','https://sphinn.com','lfoskin0@paypal.com','https://www.facebook.com/WhiteHouse/','https://www.linkedin.com/company/the-white-house','0093-7392');
INSERT INTO company(id,market_id,owner_fullname,owner_email,owner_phone,registered_address_id,trading_address_id,business_type,tier,status,registered_by,registered_date,lms_group,name,tax_number,phone,coordinates,about_us,public_email,website,facebook,linked_in,reference_number)
VALUES ('2',2,'Harry Webb','harry@test.com','234234',2,5,'CONTRACTOR','T4','ACTIVE','mbrosch1@go.com','2020-11-20 12:00:00','Maroon','Lehner-Gislason','0378-4094','757-208-9959','42.7684,-78.8871','Innovative high-level intranet','https://oracle.com','ssnipe1@pen.io','https://www.facebook.com/europeanparliament','https://www.linkedin.com/company/eu','64772-300');
INSERT INTO company(id,market_id,owner_fullname,owner_email,owner_phone,registered_address_id,trading_address_id,business_type,tier,status,registered_by,registered_date,lms_group,name,tax_number,phone,coordinates,about_us,public_email,website,facebook,linked_in,reference_number)
VALUES ('3',1,'Robert Zimmerman','bob@test.com','345345',3,6,'CONTRACTOR','T1','ACTIVE','dhechlin2@amazon.com','2020-9-20 12:00:00','Goldenrod','Beahan, Little and Reynolds','49738-530','843-584-2619','47.6151','Multi-tiered holistic productivity','https://utexas.edu','liacovielli2@discovery.com','https://www.facebook.com/Sony/','https://in.linkedin.com/company/sony','0179-0110');

TRUNCATE TABLE company_document RESTART IDENTITY;
INSERT INTO company_document(id,company_id,name,document)
VALUES ('1',1,'Company registration document','http://www.africau.edu/images/default/sample.pdf');
INSERT INTO company_document(id,company_id,name,document)
VALUES ('2',1,'Licence to Operate','http://www.africau.edu/images/default/sample.pdf');
INSERT INTO company_document(id,company_id,name,document)
VALUES ('3',2,'Licence to operate','http://www.africau.edu/images/default/sample.pdf');

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

TRUNCATE TABLE evidence_item RESTART IDENTITY;
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('1',4,3,'TRICLOSANxid.jpg','https://image.shutterstock.com/image-photo/roof-repairconstruction-worker-using-nail-600w-1744176230.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('2',5,3,'Clindamycin Hydrochloridexid.jpg','https://image.shutterstock.com/image-photo/dancing-friends-600w-717409222.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('3',5,3,'Nabumetonexid.jpg','https://image.shutterstock.com/shutterstock/photos/1518548357/display_1500/stock-photo-construction-worker-install-new-roof-roofing-tools-electric-drill-used-on-new-roofs-with-metal-1518548357.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('4',5,3,'cyclobenzaprine hydrochloridexid.jpg','https://image.shutterstock.com/shutterstock/photos/1518548357/display_1500/stock-photo-construction-worker-install-new-roof-roofing-tools-electric-drill-used-on-new-roofs-with-metal-1518548357.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('5',4,3,'ethyl alcoholxid.jpg','https://image.shutterstock.com/image-photo/dancing-friends-600w-717409222.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('6',3,3,'LATANOPROSTxid.jpg','https://image.shutterstock.com/shutterstock/photos/1518548357/display_1500/stock-photo-construction-worker-install-new-roof-roofing-tools-electric-drill-used-on-new-roofs-with-metal-1518548357.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('7',4,3,'morphine sulfatexid.jpg','https://image.shutterstock.com/image-photo/dancing-friends-600w-717409222.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('8',3,3,'OYSTER SHELL CALCIUM CARBONATE, CRUDExid.jpg','https://image.shutterstock.com/image-photo/dancing-friends-600w-717409222.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('9',5,3,'cladosporium cladosporioidesxid.jpg','https://image.shutterstock.com/image-photo/bboy-doing-some-stunts-street-600w-665795263.jpg');
INSERT INTO evidence_item(id,evidence_category_id,guarantee_id,name,attachment)
VALUES ('10',4,3,'atorvastatin calciumxid.jpg','https://image.shutterstock.com/image-photo/roof-repairconstruction-worker-using-nail-600w-1744176230.jpg');

TRUNCATE TABLE guarantee RESTART IDENTITY;
INSERT INTO guarantee(id,pdf,requestor_account_id,responsible_installer_account_id,project_id,guarantee_type_id,system_id,reviewer_account_id,status,start_date,expiry,issue_number,purchase_date)
VALUES ('1','http://www.africau.edu/images/default/sample.pdf',5,null,1,3,null,null,'APPROVED','2020-12-18 12:00:00','2050-12-18 12:00:00','61715-062','2020-10-18 12:00:00');
INSERT INTO guarantee(id,pdf,requestor_account_id,responsible_installer_account_id,project_id,guarantee_type_id,system_id,reviewer_account_id,status,start_date,expiry,issue_number,purchase_date)
VALUES ('2','http://www.africau.edu/images/default/sample.pdf',6,null,3,7,1,null,'APPROVED','2020-12-18 12:00:00','2050-12-18 12:00:00','54868-5770','2020-10-18 12:00:00');
INSERT INTO guarantee(id,pdf,requestor_account_id,responsible_installer_account_id,project_id,guarantee_type_id,system_id,reviewer_account_id,status,start_date,expiry,issue_number,purchase_date)
VALUES ('3','null',7,7,2,8,2,3,'SUBMITTED','2020-12-18 12:00:00','2020-12-18 12:00:00','36987-1846','2020-10-18 12:00:00');

TRUNCATE TABLE invitation RESTART IDENTITY;
INSERT INTO invitation(id,account_id,type,invitee,accepted,generated,expires)
VALUES ('1',3,'JOIN_COMPANY','kim@digital-detox.co.uk',TRUE,'2020-04-27 08:47:30','2020-04-10 23:19:54');
INSERT INTO invitation(id,account_id,type,invitee,accepted,generated,expires)
VALUES ('2',3,'BECOME_ADMIN','sam@digital-detox.co.uk',TRUE,'2020-02-19 23:15:44','2020-10-06 17:44:31');
INSERT INTO invitation(id,account_id,type,invitee,accepted,generated,expires)
VALUES ('3',3,'BECOME_OWNER','donovan@digital-detox.co.uk',FALSE,'2020-09-08 05:26:50','2020-07-18 15:15:55');

TRUNCATE TABLE market RESTART IDENTITY;
INSERT INTO market(id,locale,cms_space_id,name,send_name,send_mailbox,lms_branch,lms_owner_branch,projects_enabled,news,live,gtag,geo_middle)
VALUES ('1','en_US','opay6t6wwmup','Transatlantia','BMI Intouch Mapleland','transatlantia@intouch.bmigroup.com','tbc2','tbc2',TRUE,'https://www.linkedin.com/embed/feed/update/urn:li:share:6570506659070910465',TRUE,'tbc1','27.9139,-82.7157');
INSERT INTO market(id,locale,cms_space_id,name,send_name,send_mailbox,lms_branch,lms_owner_branch,projects_enabled,news,live,gtag,geo_middle)
VALUES ('2','en_CA','opay6t6wwmup','Mapleland','BMI Intouch Mapleland','mapleland@intouch.bmigroup.com','tbc2','tbc2',TRUE,'https://www.linkedin.com/embed/feed/update/urn:li:share:6570506659070910465',TRUE,'tbc1','42.7684,-78.8871');

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
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('1',1,'PITCHED','Braas','BMI Braas Otcom Professional-1XL-1','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Asoka',TRUE,24);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('2',1,'PITCHED','Schiedel','BMI Schiedel Asoka Professional-2XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Viva',TRUE,21);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('3',1,'PITCHED','Monier','BMI Monier Temp Professional-3XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Lotstring',TRUE,30);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('4',1,'PITCHED','Cobert','BMI Cobert It Professional-4XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','It',TRUE,21);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('5',1,'PITCHED','Schiedel','BMI Schiedel Sonair Professional-5XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Alphazap',FALSE,21);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('6',1,'FLAT','Wierer','BMI Wierer Zathin Professional-6XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Tin',TRUE,26);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('7',2,'FLAT','Cobert','BMI Cobert Hatity Professional-7XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Home Ing',TRUE,26);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('8',2,'FLAT','Coverland','BMI Coverland Treeflex Professional-8XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Home Ing',TRUE,29);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('9',2,'PITCHED','Monier','BMI Monier Mat Lam Tam Professional-9XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Bytecard',TRUE,20);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('10',2,'FLAT','Schiedel','BMI Schiedel Sonsing Professional-10XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Konklab',FALSE,21);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('11',1,'PITCHED','Braas','BMI Braas Prodder Professional-11XL-1','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Stringtough',TRUE,20);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('12',2,'PITCHED','Schiedel','BMI Schiedel Aerified Professional-12XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Cardguard',TRUE,29);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('13',2,'PITCHED','Coverland','BMI Coverland Bitchip Professional-13XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Prodder',TRUE,28);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('14',2,'FLAT','Braas','BMI Braas Redhold Professional-14XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Veribet',TRUE,29);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('15',2,'FLAT','Monier','BMI Monier Namfix Professional-15XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Latlux',FALSE,27);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('16',2,'FLAT','Monier','BMI Monier It Professional-16XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Ronstring',TRUE,29);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('17',2,'PITCHED','Monier','BMI Monier Opela Professional-17XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Sonair',TRUE,24);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('18',2,'PITCHED','Wierer','BMI Wierer Rank Professional-18XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Zathin',TRUE,26);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('19',2,'PITCHED','Monier','BMI Monier Home Ing Professional-19XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Y-find',TRUE,29);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('20',2,'FLAT','Bramac','BMI Bramac Gembucket Professional-20XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Lotstring',FALSE,30);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('21',1,'PITCHED','Schiedel','BMI Schiedel Gembucket Professional-21XL-1','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Tempsoft',TRUE,24);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('22',2,'PITCHED','Bramac','BMI Bramac Ventosanzap Professional-22XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Andalax',TRUE,29);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('23',2,'FLAT','Schiedel','BMI Schiedel Cookley Professional-23XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Y-Solowarm',TRUE,23);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('24',2,'FLAT','Coverland','BMI Coverland Voyatouch Professional-24XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Alpha',TRUE,24);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('25',2,'FLAT','Braas','BMI Braas Zamit Professional-25XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Tresom',FALSE,30);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('26',2,'PITCHED','Bramac','BMI Bramac Hatity Professional-26XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Daltfresh',TRUE,27);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('27',2,'PITCHED','Schiedel','BMI Schiedel Lotstring Professional-27XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Andalax',TRUE,27);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('28',2,'PITCHED','Coverland','BMI Coverland Zaam-Dox Professional-28XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Lotstring',TRUE,25);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('29',2,'FLAT','Coverland','BMI Coverland Greenlam Professional-29XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Ronstring',TRUE,29);
INSERT INTO product(id,market_id,technology,brand,name,description,family,published,validity)
VALUES ('30',2,'PITCHED','Schiedel','BMI Schiedel Temp Professional-30XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Quo Lux',FALSE,26);

TRUNCATE TABLE guaranteed_product RESTART IDENTITY;
INSERT INTO guaranteed_product(id,product_id,guarantee_id)
VALUES ('1',1,1);
INSERT INTO guaranteed_product(id,product_id,guarantee_id)
VALUES ('2',2,1);
INSERT INTO guaranteed_product(id,product_id,guarantee_id)
VALUES ('3',3,1);

TRUNCATE TABLE project RESTART IDENTITY;
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('1',2,7,11,'FLAT','868 Sommers Crossing','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,504,'ccardenoza0@sogou.com','Christie','Cardenoza','Devpoint','2021-01-08 17:40:47','2020-11-11 00:40:39');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('2',2,8,12,'PITCHED','74 Kingsford Junction','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,166,'achazelle1@statcounter.com','Andra','Chazelle','Bluezoom','2020-05-19 12:35:43','2020-06-15 23:26:51');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('3',2,9,13,'FLAT','3 Straubel Street','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,147,'jkirkpatrick2@unesco.org','Jeni','Kirkpatrick','Jamia','2020-10-06 18:14:00','2020-07-11 01:43:34');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('4',2,10,14,'PITCHED','5835 Harper Drive','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,731,'kferrarini3@smugmug.com','Kalina','Ferrarini','Skinix','2020-06-29 22:04:15','2020-07-03 15:58:44');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('5',2,7,15,'FLAT','055 Debs Parkway','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,399,'sleppington4@census.gov','Sheba','Leppington','Tagcat','2020-10-30 20:55:40','2020-10-21 23:13:17');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('6',2,7,16,'PITCHED','56596 Huxley Avenue','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,906,'klevane5@usatoday.com','Kizzee','Levane','Kamba','2020-05-03 09:40:24','2020-12-15 07:11:28');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('7',2,8,17,'FLAT','44615 Browning Place','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,867,'spopeley6@chronoengine.com','Stoddard','Popeley','Skiba','2020-09-01 15:23:49','2021-09-05 02:53:08');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('8',2,9,18,'PITCHED','49566 Morningstar Junction','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,893,'bmeadley7@ted.com','Belle','Meadley','Shuffledrive','2021-02-04 13:31:41','2020-05-06 11:48:16');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('9',2,10,19,'FLAT','737 Holmberg Junction','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,764,'rcasaccia8@ox.ac.uk','Ramonda','Casaccia','Wordware','2020-08-04 22:55:53','2021-03-03 22:31:12');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('10',2,7,20,'PITCHED','14268 Texas Avenue','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,64,'wsaxby9@ocn.ne.jp','Wilona','Saxby','Wikivu','2020-05-01 11:44:41','2021-01-02 02:26:17');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('11',2,8,21,'FLAT','54 Northport Center','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,734,'mcavea@fda.gov','Maxie','Cave','Gabspot','2020-11-05 07:06:59','2020-12-26 04:18:29');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('12',2,9,22,'PITCHED','671 Hanover Court','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,654,'dmerrikinb@wikispaces.com','Dulcia','Merrikin','Tavu','2021-01-26 02:44:30','2020-12-20 17:09:32');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('13',2,10,23,'FLAT','2958 Springs Drive','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,790,'jmarrowc@japanpost.jp','Janeta','Marrow','Avamba','2020-01-27 12:24:09','2021-01-13 20:32:15');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('14',2,7,24,'PITCHED','29 Express Court','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,317,'evigursd@omniture.com','Eartha','Vigurs','Flashdog','2020-04-11 03:31:01','2020-09-08 14:43:16');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('15',2,8,25,'FLAT','5 Barby Road','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,983,'clamburne@ted.com','Christean','Lamburn','Twitterlist','2020-09-10 17:53:10','2020-11-02 11:09:06');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('16',2,9,26,'PITCHED','9 Steensland Lane','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,571,'dbourdonf@cam.ac.uk','Dione','Bourdon','Camido','2020-03-05 09:04:55','2021-01-26 03:08:41');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('17',2,10,27,'FLAT','5883 Chive Plaza','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,84,'bhalbardg@ibm.com','Bertha','Halbard','Twitterbeat','2021-01-20 06:12:18','2020-03-01 12:41:25');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('18',2,7,28,'PITCHED','93 Sugar Terrace','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,584,'cmctrustieh@liveinternet.ru','Clareta','McTrustie','Oyoba','2020-01-07 20:41:10','2021-01-05 04:48:37');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('19',2,8,29,'FLAT','21959 Caliangt Way','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,131,'tdreheri@weibo.com','Tammy','Dreher','Browseblab','2020-06-29 18:56:42','2020-04-02 19:28:51');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('20',2,9,7,'PITCHED','1260 Lakewood Gardens Avenue','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,905,'rdanilovichj@netlog.com','Rosmunda','Danilovich','Meejo','2020-03-06 13:51:39','2020-06-01 09:23:29');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('21',2,10,8,'FLAT','882 Fairfield Way','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,699,'nbatthewk@dell.com','Nichole','Batthew','Skynoodle','2020-07-04 01:34:23','2021-10-13 11:19:17');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('22',2,7,9,'PITCHED','6843 Farragut Hill','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,337,'cmartinotl@mediafire.com','Chloette','Martinot','Demizz','2020-02-15 07:52:20','2021-01-20 15:22:34');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('23',2,8,10,'FLAT','3 Tony Point','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,705,'acurgenuerm@domainmarket.com','Ardelia','Curgenuer','Ooba','2020-12-11 07:17:57','2020-08-30 15:41:14');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('24',2,9,7,'PITCHED','138 Waubesa Drive','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,684,'bjoutapaitisn@topsy.com','Barb','Joutapaitis','Mynte','2020-08-28 21:42:11','2021-02-13 17:14:13');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('25',2,10,8,'FLAT','065 Sullivan Plaza','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,828,'rpleaceo@mail.ru','Ronda','Pleace','Yakijo','2020-10-20 12:46:12','2020-12-06 17:12:55');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('26',1,7,9,'PITCHED','599 3rd Junction','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,910,'ddallinderp@cornell.edu','Daphna','Dallinder','Quinu','2021-01-19 13:11:28','2021-09-12 07:07:26');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('27',1,8,10,'FLAT','767 Debs Terrace','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,655,'gbainesq@mtv.com','Gabbi','Baines','Dabvine','2020-11-30 01:13:51','2021-10-16 04:45:59');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('28',1,9,7,'PITCHED','7530 John Wall Drive','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',FALSE,841,'mselleyr@independent.co.uk','Mirabelle','Selley','Zoonder','2020-01-02 09:01:22','2020-03-02 21:38:53');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('29',1,10,8,'FLAT','958 Carioca Road','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,383,'iwhyberds@wp.com','Isabelita','Whyberd','Blogtags','2020-03-09 15:50:11','2020-07-16 06:19:59');
INSERT INTO project(id,company_id,building_owner_address_id,site_address_id,technology,name,description,hidden,roof_area,building_owner_mail,building_owner_firstname,building_owner_lastname,building_owner_company,start_date,end_date)
VALUES ('30',1,7,9,'PITCHED','0221 Lotheville Avenue','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados',TRUE,107,'sastlest@ehow.com','Susi','Astles','Bluejam','2020-09-14 09:38:28','2021-01-31 23:15:04');

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
INSERT INTO system(id,market_id,technology,name,description,maximum_validity)
VALUES ('1',2,'FLAT','BMI Tarantula System X11 for Professionals','Uses BMI specific technology, the BMI Tarantula System X11 for Professionals system is best in class, intended for those who value Managed actuating parallelism',31);
INSERT INTO system(id,market_id,technology,name,description,maximum_validity)
VALUES ('2',2,'FLAT','BMI White stork System X12 for Professionals','Uses BMI specific technology, the BMI White stork System X12 for Professionals system is best in class, intended for those who value Right-sized contextually-based implementation',20);
INSERT INTO system(id,market_id,technology,name,description,maximum_validity)
VALUES ('3',2,'FLAT','BMI Urial System X13 for Professionals','Uses BMI specific technology, the BMI Urial System X13 for Professionals system is best in class, intended for those who value Reactive demand-driven function',31);
INSERT INTO system(id,market_id,technology,name,description,maximum_validity)
VALUES ('4',2,'PITCHED','BMI Asian lion System X24 for Professionals','Uses BMI specific technology, the BMI Asian lion System X24 for Professionals system is best in class, intended for those who value Front-line full-range system engine',30);
INSERT INTO system(id,market_id,technology,name,description,maximum_validity)
VALUES ('5',2,'PITCHED','BMI Striped skunk System X25 for Professionals','Uses BMI specific technology, the BMI Striped skunk System X25 for Professionals system is best in class, intended for those who value Multi-lateral motivating artificial intelligence',35);
INSERT INTO system(id,market_id,technology,name,description,maximum_validity)
VALUES ('6',2,'PITCHED','BMI Striped dolphin System X26 for Professionals','Uses BMI specific technology, the BMI Striped dolphin System X26 for Professionals system is best in class, intended for those who value Front-line mobile capacity',35);

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

TRUNCATE TABLE tier_offset RESTART IDENTITY;
INSERT INTO tier_offset(id,market_id,tier,validity_offset)
VALUES ('1',1,'T1',5);
INSERT INTO tier_offset(id,market_id,tier,validity_offset)
VALUES ('2',2,'T1',5);
INSERT INTO tier_offset(id,market_id,tier,validity_offset)
VALUES ('3',2,'T2',4);
INSERT INTO tier_offset(id,market_id,tier,validity_offset)
VALUES ('4',2,'T3',3);
ALTER TABLE account ADD FOREIGN KEY (created_by) REFERENCES account(Id);
CREATE INDEX ON account (created_by);

ALTER TABLE account ADD FOREIGN KEY (market_id) REFERENCES market(Id);
CREATE INDEX ON account (market_id);

ALTER TABLE company ADD FOREIGN KEY (market_id) REFERENCES market(Id);
CREATE INDEX ON company (market_id);

ALTER TABLE company ADD FOREIGN KEY (registered_address_id) REFERENCES address(Id);
CREATE INDEX ON company (registered_address_id);

ALTER TABLE company ADD FOREIGN KEY (trading_address_id) REFERENCES address(Id);
CREATE INDEX ON company (trading_address_id);

ALTER TABLE company_document ADD FOREIGN KEY (company_id) REFERENCES company(Id);
CREATE INDEX ON company_document (company_id);

ALTER TABLE company_member ADD FOREIGN KEY (market_id) REFERENCES market(Id);
CREATE INDEX ON company_member (market_id);

ALTER TABLE company_member ADD FOREIGN KEY (account_id) REFERENCES account(Id);
CREATE INDEX ON company_member (account_id);

ALTER TABLE company_member ADD FOREIGN KEY (company_id) REFERENCES company(Id);
CREATE INDEX ON company_member (company_id);

ALTER TABLE evidence_item ADD FOREIGN KEY (guarantee_id) REFERENCES guarantee(Id);
CREATE INDEX ON evidence_item (guarantee_id);

ALTER TABLE guarantee ADD FOREIGN KEY (requestor_account_id) REFERENCES account(Id);
CREATE INDEX ON guarantee (requestor_account_id);

ALTER TABLE guarantee ADD FOREIGN KEY (responsible_installer_account_id) REFERENCES account(Id);
CREATE INDEX ON guarantee (responsible_installer_account_id);

ALTER TABLE guarantee ADD FOREIGN KEY (project_id) REFERENCES project(Id);
CREATE INDEX ON guarantee (project_id);

ALTER TABLE guarantee ADD FOREIGN KEY (system_id) REFERENCES system(Id);
CREATE INDEX ON guarantee (system_id);

ALTER TABLE guarantee ADD FOREIGN KEY (reviewer_account_id) REFERENCES account(Id);
CREATE INDEX ON guarantee (reviewer_account_id);

ALTER TABLE invitation ADD FOREIGN KEY (account_id) REFERENCES account(Id);
CREATE INDEX ON invitation (account_id);

ALTER TABLE note ADD FOREIGN KEY (author_id) REFERENCES account(Id);
CREATE INDEX ON note (author_id);

ALTER TABLE note ADD FOREIGN KEY (project_id) REFERENCES project(Id);
CREATE INDEX ON note (project_id);

ALTER TABLE notification ADD FOREIGN KEY (account_id) REFERENCES account(Id);
CREATE INDEX ON notification (account_id);

ALTER TABLE product ADD FOREIGN KEY (market_id) REFERENCES market(Id);
CREATE INDEX ON product (market_id);

ALTER TABLE guaranteed_product ADD FOREIGN KEY (product_id) REFERENCES product(Id);
CREATE INDEX ON guaranteed_product (product_id);

ALTER TABLE guaranteed_product ADD FOREIGN KEY (guarantee_id) REFERENCES guarantee(Id);
CREATE INDEX ON guaranteed_product (guarantee_id);

ALTER TABLE project ADD FOREIGN KEY (company_id) REFERENCES company(Id);
CREATE INDEX ON project (company_id);

ALTER TABLE project ADD FOREIGN KEY (building_owner_address_id) REFERENCES address(Id);
CREATE INDEX ON project (building_owner_address_id);

ALTER TABLE project ADD FOREIGN KEY (site_address_id) REFERENCES address(Id);
CREATE INDEX ON project (site_address_id);

ALTER TABLE project_member ADD FOREIGN KEY (project_id) REFERENCES project(Id);
CREATE INDEX ON project_member (project_id);

ALTER TABLE project_member ADD FOREIGN KEY (account_id) REFERENCES account(Id);
CREATE INDEX ON project_member (account_id);

ALTER TABLE system ADD FOREIGN KEY (market_id) REFERENCES market(Id);
CREATE INDEX ON system (market_id);

ALTER TABLE system_member ADD FOREIGN KEY (system_id) REFERENCES system(Id);
CREATE INDEX ON system_member (system_id);

ALTER TABLE system_member ADD FOREIGN KEY (product_id) REFERENCES product(Id);
CREATE INDEX ON system_member (product_id);

ALTER TABLE tier_offset ADD FOREIGN KEY (market_id) REFERENCES market(Id);
CREATE INDEX ON tier_offset (market_id);

COMMENT ON TABLE account IS 'An InTouch account';
COMMENT ON COLUMN account.id IS 'Primary key';
COMMENT ON COLUMN account.created_by IS 'fk';
COMMENT ON COLUMN account.status IS 'ek';
COMMENT ON COLUMN account.market_id IS 'fk';
COMMENT ON COLUMN account.role IS 'ek';
COMMENT ON COLUMN account.email IS 'The mail address associated with the account';
COMMENT ON COLUMN account.phone IS 'A phone number that can optionally be provided, and is useful for Company Admin people to provide';
COMMENT ON COLUMN account.first_name IS 'First name';
COMMENT ON COLUMN account.last_name IS 'Last name';
COMMENT ON COLUMN account.created IS 'When the account was created';
COMMENT ON COLUMN account.docebo_id IS 'User account in Docebo';
COMMENT ON COLUMN account.photo IS 'File reference or the file itself. A profile picture of the user';

COMMENT ON TABLE address IS 'A generic address';
COMMENT ON COLUMN address.id IS 'Primary key';
COMMENT ON COLUMN address.first_line IS 'First line of this address';
COMMENT ON COLUMN address.second_line IS 'Second line of this address';
COMMENT ON COLUMN address.town IS 'The postal town';
COMMENT ON COLUMN address.country IS 'The country for this address';
COMMENT ON COLUMN address.postcode IS 'The postcode for this address';

COMMENT ON TABLE company IS 'A company that has been registered in InTouch';
COMMENT ON COLUMN company.id IS 'Primary key';
COMMENT ON COLUMN company.market_id IS 'fk';
COMMENT ON COLUMN company.owner_fullname IS 'the name of the owner of the Company';
COMMENT ON COLUMN company.owner_email IS 'the email address to contact the owner';
COMMENT ON COLUMN company.owner_phone IS 'the phone number to contact the owner';
COMMENT ON COLUMN company.registered_address_id IS 'fk';
COMMENT ON COLUMN company.trading_address_id IS 'fk';
COMMENT ON COLUMN company.business_type IS 'ek';
COMMENT ON COLUMN company.tier IS 'ek';
COMMENT ON COLUMN company.status IS 'ek';
COMMENT ON COLUMN company.registered_by IS 'the email address of the person who filled out the company registration form';
COMMENT ON COLUMN company.registered_date IS 'the date that the Company registration form was submitted';
COMMENT ON COLUMN company.lms_group IS 'The Group ID of the company in Docebo';
COMMENT ON COLUMN company.name IS 'The registered name of the Company';
COMMENT ON COLUMN company.tax_number IS 'The Tax number in that number, such as the VAT number';
COMMENT ON COLUMN company.phone IS 'They Companys public phone number';
COMMENT ON COLUMN company.coordinates IS 'The companys GoogleMap address';
COMMENT ON COLUMN company.about_us IS 'A bit of blurb to appear in Find a contractor';
COMMENT ON COLUMN company.public_email IS 'The email address that they can be contacted with by the public assuming they are listed.';
COMMENT ON COLUMN company.website IS 'The Company website URL';
COMMENT ON COLUMN company.facebook IS 'The Company facebook website';
COMMENT ON COLUMN company.linked_in IS 'Their Company LinkedIn page URL';
COMMENT ON COLUMN company.reference_number IS 'A 6 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number).  Should be unique. ';

COMMENT ON TABLE company_document IS 'A document uploaded by the Company to InTouch that appears on their Company Profile, for example an insurance certificate';
COMMENT ON COLUMN company_document.id IS 'Primary key';
COMMENT ON COLUMN company_document.company_id IS 'fk';
COMMENT ON COLUMN company_document.name IS 'The name of the document';
COMMENT ON COLUMN company_document.document IS 'The document itself or the path to it';

COMMENT ON TABLE company_member IS 'A connection between a user and a company';
COMMENT ON COLUMN company_member.id IS 'Primary key';
COMMENT ON COLUMN company_member.market_id IS 'fk';
COMMENT ON COLUMN company_member.account_id IS 'fk';
COMMENT ON COLUMN company_member.company_id IS 'fk';

COMMENT ON TABLE evidence_item IS 'An item of evidence for a guarantee';
COMMENT ON COLUMN evidence_item.id IS 'Primary key';
COMMENT ON COLUMN evidence_item.evidence_category_id IS 'fk';
COMMENT ON COLUMN evidence_item.guarantee_id IS 'fk';
COMMENT ON COLUMN evidence_item.name IS 'Short name for the item of evidence';
COMMENT ON COLUMN evidence_item.attachment IS 'File reference or the file itself. Photo of the evidence';

COMMENT ON TABLE guarantee IS 'Starts life as request for a gurantee and becomes an actual issued guarantee';
COMMENT ON COLUMN guarantee.id IS 'Primary key - starts at 6100';
COMMENT ON COLUMN guarantee.pdf IS 'The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand';
COMMENT ON COLUMN guarantee.requestor_account_id IS 'fk';
COMMENT ON COLUMN guarantee.responsible_installer_account_id IS 'fk';
COMMENT ON COLUMN guarantee.project_id IS 'fk';
COMMENT ON COLUMN guarantee.guarantee_type_id IS 'fk';
COMMENT ON COLUMN guarantee.system_id IS 'fk';
COMMENT ON COLUMN guarantee.reviewer_account_id IS 'fk';
COMMENT ON COLUMN guarantee.status IS 'ek';
COMMENT ON COLUMN guarantee.start_date IS 'The date that the Guarantee is approved either automatically or manually.';
COMMENT ON COLUMN guarantee.expiry IS 'When the guarantee will expire.  This is dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier';
COMMENT ON COLUMN guarantee.issue_number IS 'This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Request Id.';
COMMENT ON COLUMN guarantee.purchase_date IS 'The date that the BMI merchanise was purchased';

COMMENT ON TABLE invitation IS 'An invitation to join InTouch';
COMMENT ON COLUMN invitation.id IS 'Primary key';
COMMENT ON COLUMN invitation.account_id IS 'fk';
COMMENT ON COLUMN invitation.type IS 'ek';
COMMENT ON COLUMN invitation.invitee IS 'An email address';
COMMENT ON COLUMN invitation.accepted IS 'if the invitation has been accepted';
COMMENT ON COLUMN invitation.generated IS 'When the invite was generated';
COMMENT ON COLUMN invitation.expires IS 'When this invitation will expire';

COMMENT ON TABLE market IS 'A country that BMI operates in';
COMMENT ON COLUMN market.id IS 'Primary key';
COMMENT ON COLUMN market.locale IS 'ek';
COMMENT ON COLUMN market.cms_space_id IS 'The space in Contenful';
COMMENT ON COLUMN market.name IS 'A short name for the market, e.g. Italy, Norway, Netherlands';
COMMENT ON COLUMN market.send_name IS 'The From name used when sending an email';
COMMENT ON COLUMN market.send_mailbox IS 'The mailbox on intouch.bmigroup.com that emails will be sent from for this Market';
COMMENT ON COLUMN market.lms_branch IS 'The default branch in Docebo that installers go into';
COMMENT ON COLUMN market.lms_owner_branch IS 'The branch in Docebo that company admins go into';
COMMENT ON COLUMN market.projects_enabled IS 'Whether the market supports Projects.  If so then the Project section is available.  Tier 0 can then be configured to support Guarantees in non-Roopro countries.  In Roofpro countries various Tier configurations become possible.';
COMMENT ON COLUMN market.news IS 'A reference to a linkedin news item';
COMMENT ON COLUMN market.live IS 'Whether the market is live to the public or not';
COMMENT ON COLUMN market.gtag IS 'Reference to the Google Analytics tracking ID that is used for the Country GA reports';
COMMENT ON COLUMN market.geo_middle IS 'The coordinates of the middle of the country on a map';

COMMENT ON TABLE note IS 'Usually a note added by someone at BMI who has been asked to approve a Guarantee.  It is likely to be either a short note of approval, saying something like, Approved, or Good Job, or a note of rejection, saying  something like, The photographs of the roof are not clear enough. Could also be a note inserted into an invite to join InTouch.';
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
COMMENT ON COLUMN product.brand IS 'The Products brand';
COMMENT ON COLUMN product.name IS 'Short name for the product';
COMMENT ON COLUMN product.description IS 'A description of the product';
COMMENT ON COLUMN product.family IS 'The family of Products this Product is in';
COMMENT ON COLUMN product.published IS 'Whether the product is avialable or not';
COMMENT ON COLUMN product.validity IS 'The numbe of years that this product can be guaranteed for';

COMMENT ON TABLE guaranteed_product IS 'A mapping of Products to Guarantees.  You can have more than one Product per Product Guarantee.';
COMMENT ON COLUMN guaranteed_product.id IS 'Primary key';
COMMENT ON COLUMN guaranteed_product.product_id IS 'fk';
COMMENT ON COLUMN guaranteed_product.guarantee_id IS 'fk';

COMMENT ON TABLE project IS 'A project that has been put into InTouch by a Company Administrator to represent a project being done by that company';
COMMENT ON COLUMN project.id IS 'Primary key';
COMMENT ON COLUMN project.company_id IS 'fk';
COMMENT ON COLUMN project.building_owner_address_id IS 'fk';
COMMENT ON COLUMN project.site_address_id IS 'fk';
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
COMMENT ON COLUMN system.name IS 'Short name for the System';
COMMENT ON COLUMN system.description IS 'A description for the System';
COMMENT ON COLUMN system.maximum_validity IS 'The maximum number of years that this system can be guaranteed for.  Must be greater than 10.';

COMMENT ON TABLE system_member IS 'A system product pair';
COMMENT ON COLUMN system_member.id IS 'Primary key';
COMMENT ON COLUMN system_member.system_id IS 'fk';
COMMENT ON COLUMN system_member.product_id IS 'fk';

COMMENT ON TABLE tier_offset IS 'A value needed, if present, to calculate the validity of a guarantee for a particular tier.  In some Tiers, the guarantee validity will be reduced, which is what we mean by offset, by more than others, so that the more premium Tier members have the benefit of longer guarantees.';
COMMENT ON COLUMN tier_offset.id IS 'Primary key';
COMMENT ON COLUMN tier_offset.market_id IS 'fk';
COMMENT ON COLUMN tier_offset.tier IS 'ek';
COMMENT ON COLUMN tier_offset.validity_offset IS 'The number of years to reduce guarantee validities by in this Tier for this Market.  Must be 10 or less than 10.';

SELECT SETVAL('account_id_seq', (select MAX(ID) from account));
SELECT SETVAL('address_id_seq', (select MAX(ID) from address));
SELECT SETVAL('company_id_seq', (select MAX(ID) from company));
SELECT SETVAL('company_document_id_seq', (select MAX(ID) from company_document));
SELECT SETVAL('company_member_id_seq', (select MAX(ID) from company_member));
SELECT SETVAL('evidence_item_id_seq', (select MAX(ID) from evidence_item));
SELECT SETVAL('guarantee_id_seq', (select MAX(ID) from guarantee));
SELECT SETVAL('invitation_id_seq', (select MAX(ID) from invitation));
SELECT SETVAL('market_id_seq', (select MAX(ID) from market));
SELECT SETVAL('note_id_seq', (select MAX(ID) from note));
SELECT SETVAL('notification_id_seq', (select MAX(ID) from notification));
SELECT SETVAL('product_id_seq', (select MAX(ID) from product));
SELECT SETVAL('guaranteed_product_id_seq', (select MAX(ID) from guaranteed_product));
SELECT SETVAL('project_id_seq', (select MAX(ID) from project));
SELECT SETVAL('project_member_id_seq', (select MAX(ID) from project_member));
SELECT SETVAL('system_id_seq', (select MAX(ID) from system));
SELECT SETVAL('system_member_id_seq', (select MAX(ID) from system_member));
SELECT SETVAL('tier_offset_id_seq', (select MAX(ID) from tier_offset));

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

CREATE TRIGGER set_evidence_item_updated_at 
BEFORE UPDATE ON evidence_item 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_guarantee_updated_at 
BEFORE UPDATE ON guarantee 
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

CREATE TRIGGER set_guaranteed_product_updated_at 
BEFORE UPDATE ON guaranteed_product 
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

CREATE TRIGGER set_system_member_updated_at 
BEFORE UPDATE ON system_member 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_tier_offset_updated_at 
BEFORE UPDATE ON tier_offset 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();
