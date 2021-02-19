
DROP TYPE IF EXISTS AccountStatus CASCADE;
CREATE TYPE AccountStatus  AS ENUM (
'NEW',
'ACTIVE',
'SUSPENDED'
);  
  
DROP TYPE IF EXISTS Role CASCADE;
CREATE TYPE Role  AS ENUM (
'SUPER-ADMIN',
'MARKET-ADMIN',
'INSTALLER',
'COMPANY-ADMIN',
'COMPANY-OWNER'
);  
  
DROP TYPE IF EXISTS Locale CASCADE;
CREATE TYPE Locale  AS ENUM (
'da-DK',
'no-NO',
'en-MY',
'en-IN',
'sv-SE',
'pt-PT',
'de-AT',
'nl-NL',
'sk-SK',
'fr-BE',
'nl-BE',
'fr-FR',
'pl-PL',
'es-ES',
'fi-FI',
'en-US',
'en-CA',
'fr-CA'
);  
  
DROP TYPE IF EXISTS MessageFormat CASCADE;
CREATE TYPE MessageFormat  AS ENUM (
'EMAIL',
'NOTIFICATION',
'ALL'
);  
  
DROP TYPE IF EXISTS RequestStatus CASCADE;
CREATE TYPE RequestStatus  AS ENUM (
'NEW',
'SUBMITTED',
'REVIEW',
'REJECTED',
'APPROVED'
);  
  
DROP TYPE IF EXISTS Technology CASCADE;
CREATE TYPE Technology  AS ENUM (
'FLAT',
'PITCHED',
'OTHER'
);  
  
DROP TYPE IF EXISTS InvitationType CASCADE;
CREATE TYPE InvitationType  AS ENUM (
'JOIN-COMPANY',
'BECOME-ADMIN',
'BECOME-OWNER'
);  
  

DROP TABLE IF EXISTS Account CASCADE;
CREATE TABLE Account (
Id SERIAL PRIMARY KEY,
CreatedBy int,
Status AccountStatus,
Market int,
Role Role,
Email text,
Firstname text,
Lastname text,
Created timestamp,
DoceboId int,
Photo text
);

DROP TABLE IF EXISTS Company CASCADE;
CREATE TABLE Company (
Id SERIAL PRIMARY KEY,
Market int,
Tier int,
Owner int,
Active boolean,
PrivateEmail text,
LmsGroup text,
Name text,
RegisteredAddressLine1 text,
RegisteredAddressLine2 text,
Town text,
Region text,
RegisteredZip text,
TradingAddressLine1 text,
TradingAddressLine2 text,
TradingTown text,
TradingRegion text,
TradingZip text,
Phone text,
Geolocation text,
AboutUs text,
LinkedIn text,
PublicEmail text,
Website text,
WebListing boolean,
ReferenceNumber text
);

DROP TABLE IF EXISTS CompanyMember CASCADE;
CREATE TABLE CompanyMember (
Id SERIAL PRIMARY KEY,
EndUser int,
Company int
);

DROP TABLE IF EXISTS ContactDetails CASCADE;
CREATE TABLE ContactDetails (
Id SERIAL PRIMARY KEY,
Market int,
Details text
);

DROP TABLE IF EXISTS EvidenceItem CASCADE;
CREATE TABLE EvidenceItem (
Id SERIAL PRIMARY KEY,
Category int,
Request int,
Name text,
Attachment text
);

DROP TABLE IF EXISTS Guarantee CASCADE;
CREATE TABLE Guarantee (
Id SERIAL PRIMARY KEY,
Pdf text,
Requestor int,
ResponsibleInstaller int,
Project int,
Type int,
System int,
Reviewer int,
Status RequestStatus,
StartDate timestamp,
Expiry timestamp,
IssueNumber text,
PurchaseDate timestamp
);

DROP TABLE IF EXISTS Invitation CASCADE;
CREATE TABLE Invitation (
Id SERIAL PRIMARY KEY,
Inviter int,
Type InvitationType,
Token text,
Invitee text,
Accepted boolean,
Generated timestamp,
Expires timestamp
);

DROP TABLE IF EXISTS Market CASCADE;
CREATE TABLE Market (
Id SERIAL PRIMARY KEY,
Locale Locale,
CountryCode text,
Name text,
SendName text,
SendMailbox text,
LmsBranch text,
LmsEnabled boolean,
ProjectsEnabled boolean,
RoofProEnabled boolean,
Live boolean,
Gtag text,
Polygon text,
Background text,
LmsPicture text,
OffsetTier1 int,
OffsetTier2 int,
OffsetTier3 int,
OffsetTier4 int
);

DROP TABLE IF EXISTS Note CASCADE;
CREATE TABLE Note (
Id SERIAL PRIMARY KEY,
Author int,
Project int,
Body text
);

DROP TABLE IF EXISTS Notification CASCADE;
CREATE TABLE Notification (
Id SERIAL PRIMARY KEY,
Recipient int,
Subject text,
SendDate timestamp,
Unread boolean,
Body text
);

DROP TABLE IF EXISTS Product CASCADE;
CREATE TABLE Product (
Id SERIAL PRIMARY KEY,
Market int,
Technology Technology,
Brand text,
Name text,
Description text,
Family text,
Published boolean,
Validity int
);

DROP TABLE IF EXISTS GuaranteedProduct CASCADE;
CREATE TABLE GuaranteedProduct (
Id SERIAL PRIMARY KEY,
Product int,
Guarantee int
);

DROP TABLE IF EXISTS Project CASCADE;
CREATE TABLE Project (
Id SERIAL PRIMARY KEY,
Company int,
Technology Technology,
Name text,
Hidden boolean,
RoofArea int,
BuildingOwnerMail text,
BuildingOwnerFirstName text,
BuildingOwnerLastName text,
BuildingOwnerCompany text,
BuildingOwnerAddressLine1 text,
BuildingOwnerAddressLIne2  text,
BuildingOwnerTown text,
BuildingOwnerRegion text,
BuildingOwnerPostcode text,
SiteAddressLine1 text,
SiteAddressLIne2  text,
SiteTown text,
SiteRegion text,
SitePostcode text,
StartDate timestamp,
EndDate timestamp
);

DROP TABLE IF EXISTS ProjectMember CASCADE;
CREATE TABLE ProjectMember (
Id SERIAL PRIMARY KEY,
Project int,
Member int,
Added timestamp,
Removed timestamp
);

DROP TABLE IF EXISTS System CASCADE;
CREATE TABLE System (
Id SERIAL PRIMARY KEY,
Market int,
Technology Technology,
Name text,
Description text,
MaximumValidity int
);

DROP TABLE IF EXISTS SystemMember CASCADE;
CREATE TABLE SystemMember (
Id SERIAL PRIMARY KEY,
System int,
Product int
);


TRUNCATE TABLE Account RESTART IDENTITY;
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('1',1,'ACTIVE',1,'SUPER-ADMIN','millyes0@jiathis.com','Mike','Illyes','2020-06-12 10:19:47',42507-498,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('2',1,'ACTIVE',1,'MARKET-ADMIN','fmcevoy1@yellowbook.com','Franny','McEvoy','2020-02-05 00:23:27',59779-981,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('3',1,'ACTIVE',2,'MARKET-ADMIN','ocastanaga2@bigcartel.com','Ogdon','Castanaga','2020-09-23 17:50:40',65197-300,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('4',1,'ACTIVE',2,'COMPANY-OWNER','jharkin3@cdbaby.com','Jessey','Harkin','2020-04-01 02:21:47',58165-032,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('5',1,'ACTIVE',1,'COMPANY-ADMIN','kpohls4@photobucket.com','Kort','Pohls','2020-02-20 01:18:43',42747-235,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('6',1,'ACTIVE',1,'COMPANY-OWNER','tmoores5@cyberchimps.com','Templeton','Moores','2020-07-29 10:17:22',54868-5935,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('7',1,'ACTIVE',2,'COMPANY-OWNER','jkemson6@cyberchimps.com','Jonathan','Kemson','2020-10-12 04:35:35',0169-7010,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('8',1,'ACTIVE',2,'COMPANY-ADMIN','rghio7@si.edu','Reine','Ghio','2020-12-04 21:18:47',34645-2325,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('9',1,'SUSPENDED',2,'COMPANY-ADMIN','qwinsiowiecki8@dropbox.com','Quintilla','Winsiowiecki','2020-06-17 23:27:45',68084-166,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('10',1,'ACTIVE',2,'INSTALLER','vcumberland9@zimbio.com','Verna','Cumberland','2020-09-04 11:32:48',60512-6025,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('11',1,'ACTIVE',1,'INSTALLER','tbisphama@theguardian.com','Torrence','Bispham','2020-08-09 22:56:17',47682-406,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('12',1,'ACTIVE',1,'INSTALLER','gshawcroftb@europa.eu','Gibbie','Shawcroft','2020-11-24 23:13:49',0143-9723,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('13',1,'ACTIVE',1,'INSTALLER','bhaironc@who.int','Bobbi','Hairon','2020-09-08 18:34:46',24385-549,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('14',1,'ACTIVE',1,'INSTALLER','adeclercd@delicious.com','Arlene','de Clerc','2020-06-11 19:38:17',47335-834,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('15',1,'ACTIVE',2,'INSTALLER','jkopische@ted.com','Juditha','Kopisch','2020-06-27 09:12:20',36987-2008,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('16',1,'ACTIVE',2,'INSTALLER','ccammf@a8.net','Claiborne','Camm','2020-04-22 00:12:02',63402-712,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('17',1,'NEW',2,'INSTALLER','jshanksterg@smh.com.au','Johnathon','Shankster','2020-02-19 19:54:49',65044-3518,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('18',1,'SUSPENDED',2,'INSTALLER','odooheyh@goodreads.com','Otto','Doohey','2020-08-16 20:47:27',48433-320,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('19',1,'ACTIVE',2,'INSTALLER','ashorlandi@imgur.com','Anselma','Shorland','2020-11-10 05:29:49',47781-266,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('20',1,'ACTIVE',2,'INSTALLER','mcopsj@odnoklassniki.ru','Mauricio','Cops','2020-08-26 16:30:41',63629-2796,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('21',1,'ACTIVE',2,'INSTALLER','mrobinettk@nba.com','Mateo','Robinett','2020-10-01 21:01:06',0677-1979,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('22',1,'ACTIVE',2,'INSTALLER','chatherleighl@foxnews.com','Cookie','Hatherleigh','2020-07-01 09:26:58',0268-6196,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('23',1,'ACTIVE',2,'INSTALLER','dpallisterm@toplist.cz','Dieter','Pallister','2020-01-27 02:38:03',0409-2308,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('24',1,'ACTIVE',2,'INSTALLER','sleafn@theguardian.com','Susette','Leaf','2020-10-13 23:58:03',0378-7155,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('25',1,'ACTIVE',2,'INSTALLER','bpepallo@cmu.edu','Brandyn','Pepall','2021-01-22 08:13:05',62175-446,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('26',1,'NEW',2,'INSTALLER','jlathep@amazon.de','Jenn','Lathe','2020-08-10 03:35:07',63323-763,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('27',1,'SUSPENDED',2,'INSTALLER','lplacideq@ftc.gov','Luigi','Placide','2020-03-28 05:19:50',68382-117,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('28',1,'ACTIVE',2,'INSTALLER','kstedallr@walmart.com','Konstantine','Stedall','2020-05-21 20:08:10',57896-396,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('29',1,'ACTIVE',2,'INSTALLER','drockwells@technorati.com','Dennis','Rockwell','2020-02-19 00:12:10',11523-7350,'https://thispersondoesnotexist.com/image');
INSERT INTO Account(Id,CreatedBy,Status,Market,Role,Email,Firstname,Lastname,Created,DoceboId,Photo)
VALUES ('30',1,'ACTIVE',2,'INSTALLER','ddanzigt@w3.org','Dalila','Danzig','2020-02-09 10:30:04',41250-424,'https://thispersondoesnotexist.com/image');

TRUNCATE TABLE Company RESTART IDENTITY;
INSERT INTO Company(Id,Market,Tier,Owner,Active,PrivateEmail,LmsGroup,Name,RegisteredAddressLine1,RegisteredAddressLine2,Town,Region,RegisteredZip,TradingAddressLine1,TradingAddressLine2,TradingTown,TradingRegion,TradingZip,Phone,Geolocation,AboutUs,LinkedIn,PublicEmail,Website,WebListing,ReferenceNumber)
VALUES ('1',2,7,3,TRUE,'twhorlton0@miibeian.gov.cn','Blue','Barrows, Legros and Kuhic','8','437 Mockingbird Alley','Florence','South Carolina','29505','18','89387 Coolidge Plaza','Sacramento','California','95823','843-985-4588','ChIJgUbEo8cfqokR5lP9','Compatible full-range architecture','https://sphinn.com','lfoskin0@paypal.com','https://kickstarter.com',FALSE,'0093-7392');
INSERT INTO Company(Id,Market,Tier,Owner,Active,PrivateEmail,LmsGroup,Name,RegisteredAddressLine1,RegisteredAddressLine2,Town,Region,RegisteredZip,TradingAddressLine1,TradingAddressLine2,TradingTown,TradingRegion,TradingZip,Phone,Geolocation,AboutUs,LinkedIn,PublicEmail,Website,WebListing,ReferenceNumber)
VALUES ('2',2,8,4,FALSE,'mbrosch1@go.com','Maroon','Lehner-Gislason','1','80221 Portage Drive','Norfolk','Virginia','23514','13','1971 Union Junction','Bridgeport','Connecticut','6606','757-208-9959','Wh_DaM','Innovative high-level intranet','https://oracle.com','ssnipe1@pen.io','http://topsy.com',FALSE,'64772-300');
INSERT INTO Company(Id,Market,Tier,Owner,Active,PrivateEmail,LmsGroup,Name,RegisteredAddressLine1,RegisteredAddressLine2,Town,Region,RegisteredZip,TradingAddressLine1,TradingAddressLine2,TradingTown,TradingRegion,TradingZip,Phone,Geolocation,AboutUs,LinkedIn,PublicEmail,Website,WebListing,ReferenceNumber)
VALUES ('3',1,8,4,FALSE,'dhechlin2@amazon.com','Goldenrod','Beahan, Little and Reynolds','1','643 Vahlen Point','Florence','South Carolina','29505','957','7 Melrose Terrace','Charlotte','North Carolina','28263','843-584-2619','GhIJQWDl0CIeQUARxks3icF8U8A','Multi-tiered holistic productivity','https://utexas.edu','liacovielli2@discovery.com','https://smh.com.au',FALSE,'0179-0110');

TRUNCATE TABLE CompanyMember RESTART IDENTITY;
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('1',5,1);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('2',6,1);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('3',7,2);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('4',8,3);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('5',9,3);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('6',10,3);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('7',11,3);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('8',12,3);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('9',13,3);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('10',14,3);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('11',15,1);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('12',16,1);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('13',17,3);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('14',18,3);
INSERT INTO CompanyMember(Id,EndUser,Company)
VALUES ('15',19,3);

TRUNCATE TABLE ContactDetails RESTART IDENTITY;
INSERT INTO ContactDetails(Id,Market,Details)
VALUES ('1',1,'Contact Flat Roof Transatlantia Helpline on 01010101');
INSERT INTO ContactDetails(Id,Market,Details)
VALUES ('2',1,'Contact Pitched Roof Transatlantia Helpline on 01010102');
INSERT INTO ContactDetails(Id,Market,Details)
VALUES ('3',2,'Contact Flat Roof Mapleland Helpline on 666999');
INSERT INTO ContactDetails(Id,Market,Details)
VALUES ('4',2,'Contact Pitched Roof Mapleland Helpline on 666999');

TRUNCATE TABLE EvidenceItem RESTART IDENTITY;
INSERT INTO EvidenceItem(Id,Category,Request,Name,Attachment)
VALUES ('1',4,3,'TRICLOSANxid.jpg','https://image.shutterstock.com/image-photo/roof-repairconstruction-worker-using-nail-600w-1744176230.jpg');
INSERT INTO EvidenceItem(Id,Category,Request,Name,Attachment)
VALUES ('2',5,3,'Clindamycin Hydrochloridexid.jpg','https://image.shutterstock.com/image-photo/dancing-friends-600w-717409222.jpg');
INSERT INTO EvidenceItem(Id,Category,Request,Name,Attachment)
VALUES ('3',5,3,'Nabumetonexid.jpg','https://image.shutterstock.com/shutterstock/photos/1518548357/display_1500/stock-photo-construction-worker-install-new-roof-roofing-tools-electric-drill-used-on-new-roofs-with-metal-1518548357.jpg');
INSERT INTO EvidenceItem(Id,Category,Request,Name,Attachment)
VALUES ('4',5,3,'cyclobenzaprine hydrochloridexid.jpg','https://image.shutterstock.com/shutterstock/photos/1518548357/display_1500/stock-photo-construction-worker-install-new-roof-roofing-tools-electric-drill-used-on-new-roofs-with-metal-1518548357.jpg');
INSERT INTO EvidenceItem(Id,Category,Request,Name,Attachment)
VALUES ('5',4,3,'ethyl alcoholxid.jpg','https://image.shutterstock.com/image-photo/dancing-friends-600w-717409222.jpg');
INSERT INTO EvidenceItem(Id,Category,Request,Name,Attachment)
VALUES ('6',3,3,'LATANOPROSTxid.jpg','https://image.shutterstock.com/shutterstock/photos/1518548357/display_1500/stock-photo-construction-worker-install-new-roof-roofing-tools-electric-drill-used-on-new-roofs-with-metal-1518548357.jpg');
INSERT INTO EvidenceItem(Id,Category,Request,Name,Attachment)
VALUES ('7',4,3,'morphine sulfatexid.jpg','https://image.shutterstock.com/image-photo/dancing-friends-600w-717409222.jpg');
INSERT INTO EvidenceItem(Id,Category,Request,Name,Attachment)
VALUES ('8',3,3,'OYSTER SHELL CALCIUM CARBONATE, CRUDExid.jpg','https://image.shutterstock.com/image-photo/dancing-friends-600w-717409222.jpg');
INSERT INTO EvidenceItem(Id,Category,Request,Name,Attachment)
VALUES ('9',5,3,'cladosporium cladosporioidesxid.jpg','https://image.shutterstock.com/image-photo/bboy-doing-some-stunts-street-600w-665795263.jpg');
INSERT INTO EvidenceItem(Id,Category,Request,Name,Attachment)
VALUES ('10',4,3,'atorvastatin calciumxid.jpg','https://image.shutterstock.com/image-photo/roof-repairconstruction-worker-using-nail-600w-1744176230.jpg');

TRUNCATE TABLE Guarantee RESTART IDENTITY;
INSERT INTO Guarantee(Id,Pdf,Requestor,ResponsibleInstaller,Project,Type,System,Reviewer,Status,StartDate,Expiry,IssueNumber,PurchaseDate)
VALUES ('1','http://www.africau.edu/images/default/sample.pdf',5,null,1,3,null,null,'APPROVED','2020-12-18 12:00:00','2050-12-18 12:00:00','61715-062','2020-10-18 12:00:00');
INSERT INTO Guarantee(Id,Pdf,Requestor,ResponsibleInstaller,Project,Type,System,Reviewer,Status,StartDate,Expiry,IssueNumber,PurchaseDate)
VALUES ('2','http://www.africau.edu/images/default/sample.pdf',6,null,3,7,1,null,'APPROVED','2020-12-18 12:00:00','2050-12-18 12:00:00','54868-5770','2020-10-18 12:00:00');
INSERT INTO Guarantee(Id,Pdf,Requestor,ResponsibleInstaller,Project,Type,System,Reviewer,Status,StartDate,Expiry,IssueNumber,PurchaseDate)
VALUES ('3','null',7,7,2,8,2,3,'SUBMITTED','2020-12-18 12:00:00','2020-12-18 12:00:00','36987-1846','2020-10-18 12:00:00');

TRUNCATE TABLE Invitation RESTART IDENTITY;
INSERT INTO Invitation(Id,Inviter,Type,Token,Invitee,Accepted,Generated,Expires)
VALUES ('1',3,'JOIN-COMPANY','1641763a-d1f3-4e94-90c9-cff03b08aebf','kim@digital-detox.co.uk',TRUE,'2020-04-27 08:47:30','2020-04-10 23:19:54');
INSERT INTO Invitation(Id,Inviter,Type,Token,Invitee,Accepted,Generated,Expires)
VALUES ('2',3,'BECOME-ADMIN','8aefdda6-b97a-4ea1-8b8b-15dadea0aa24','sam@digital-detox.co.uk',TRUE,'2020-02-19 23:15:44','2020-10-06 17:44:31');
INSERT INTO Invitation(Id,Inviter,Type,Token,Invitee,Accepted,Generated,Expires)
VALUES ('3',3,'BECOME-OWNER','7b7236f9-abab-4c57-b303-5f74573f7aed','donovan@digital-detox.co.uk',FALSE,'2020-09-08 05:26:50','2020-07-18 15:15:55');

TRUNCATE TABLE Market RESTART IDENTITY;
INSERT INTO Market(Id,Locale,CountryCode,Name,SendName,SendMailbox,LmsBranch,LmsEnabled,ProjectsEnabled,RoofProEnabled,Live,Gtag,Polygon,Background,LmsPicture,OffsetTier1,OffsetTier2,OffsetTier3,OffsetTier4)
VALUES ('1','en-US','US','Transatlantia','BMI Intouch Mapleland','transatlantia@intouch.bmigroup.com','tbc2',TRUE,TRUE,FALSE,TRUE,'tbc1','tbc2','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Clouds_background.jpg/640px-Clouds_background.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Clouds_background.jpg/640px-Clouds_background.jpg',0,0,0,0);
INSERT INTO Market(Id,Locale,CountryCode,Name,SendName,SendMailbox,LmsBranch,LmsEnabled,ProjectsEnabled,RoofProEnabled,Live,Gtag,Polygon,Background,LmsPicture,OffsetTier1,OffsetTier2,OffsetTier3,OffsetTier4)
VALUES ('2','en-CA','CA','Mapleland','BMI Intouch Mapleland','mapleland@intouch.bmigroup.com','tbc2',FALSE,TRUE,FALSE,TRUE,'tbc1','tbc1','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Clouds_background.jpg/640px-Clouds_background.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Clouds_background.jpg/640px-Clouds_background.jpg',0,0,0,0);

TRUNCATE TABLE Note RESTART IDENTITY;
INSERT INTO Note(Id,Author,Project,Body)
VALUES ('1',3,7,'That roof looks a bit like Sydney Opera house');
INSERT INTO Note(Id,Author,Project,Body)
VALUES ('2',3,8,'My favourite roof is St Pauls Cathedral');

TRUNCATE TABLE Notification RESTART IDENTITY;
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('1',15,'Namfix needs attention','2020-01-17 21:20:11',FALSE,'Dear user 15 eu mi nulla ac enim in tempor turpis nec euismod scelerisque yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('2',17,'Andalax needs attention','2020-10-12 22:57:43',TRUE,'Dear user 17 vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('3',22,'Flowdesk needs attention','2020-07-04 08:23:58',FALSE,'Dear user 22 et ultrices posuere cubilia curae mauris viverra diam vitae quam suspendisse potenti nullam porttitor lacus at yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('4',8,'Alphazap needs attention','2020-03-22 01:17:54',TRUE,'Dear user 8 morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed tristique in tempus yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('5',10,'Daltfresh needs attention','2020-08-27 17:07:55',FALSE,'Dear user 10 enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem duis aliquam convallis yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('6',11,'Quo Lux needs attention','2020-09-03 08:07:26',TRUE,'Dear user 11 porta volutpat quam pede lobortis ligula sit amet eleifend pede libero quis yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('7',14,'Fix San needs attention','2020-11-23 19:27:39',FALSE,'Dear user 14 vel ipsum praesent blandit lacinia erat vestibulum sed magna at nunc commodo placerat praesent yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('8',30,'Tresom needs attention','2020-04-22 14:53:50',FALSE,'Dear user 30 tellus semper interdum mauris ullamcorper purus sit amet nulla quisque arcu libero rutrum ac lobortis vel dapibus at yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('9',27,'Zaam-Dox needs attention','2020-08-03 00:53:56',FALSE,'Dear user 27 ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla ultrices aliquet maecenas yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('10',28,'Tin needs attention','2020-08-27 02:47:10',TRUE,'Dear user 28 id ligula suspendisse ornare consequat lectus in est risus auctor sed yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('11',28,'Stim needs attention','2020-03-01 05:08:09',TRUE,'Dear user 28 condimentum id luctus nec molestie sed justo pellentesque viverra pede ac diam yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('12',29,'Kanlam needs attention','2020-03-29 22:44:31',FALSE,'Dear user 29 velit eu est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('13',21,'Home Ing needs attention','2020-06-25 00:18:54',TRUE,'Dear user 21 phasellus id sapien in sapien iaculis congue vivamus metus arcu adipiscing yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('14',21,'Overhold needs attention','2020-03-15 02:19:15',FALSE,'Dear user 21 id sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('15',4,'Zontrax needs attention','2020-10-19 10:02:54',FALSE,'Dear user 4 ut blandit non interdum in ante vestibulum ante ipsum primis in faucibus orci luctus yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('16',27,'Namfix needs attention','2021-01-01 07:07:02',FALSE,'Dear user 27 et magnis dis parturient montes nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('17',20,'Span needs attention','2020-06-18 17:18:03',FALSE,'Dear user 20 lorem quisque ut erat curabitur gravida nisi at nibh in yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('18',30,'Konklab needs attention','2020-10-05 18:28:14',FALSE,'Dear user 30 duis consequat dui nec nisi volutpat eleifend donec ut dolor morbi vel lectus in quam fringilla rhoncus mauris enim yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('19',12,'Flexidy needs attention','2020-08-30 20:11:39',TRUE,'Dear user 12 arcu libero rutrum ac lobortis vel dapibus at diam nam tristique tortor yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('20',22,'Kanlam needs attention','2020-03-03 19:57:22',FALSE,'Dear user 22 orci vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('21',28,'Bytecard needs attention','2020-04-04 17:45:52',FALSE,'Dear user 28 praesent lectus vestibulum quam sapien varius ut blandit non interdum in ante vestibulum ante ipsum yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('22',25,'Cardify needs attention','2020-02-25 03:51:55',TRUE,'Dear user 25 nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti cras in purus eu magna vulputate yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('23',16,'Domainer needs attention','2020-07-27 00:49:01',TRUE,'Dear user 16 nunc viverra dapibus nulla suscipit ligula in lacus curabitur at ipsum ac tellus semper interdum mauris yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('24',17,'Fintone needs attention','2020-09-29 20:16:57',FALSE,'Dear user 17 vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('25',21,'Y-find needs attention','2020-09-10 03:37:38',TRUE,'Dear user 21 lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('26',9,'Span needs attention','2020-09-26 02:46:18',TRUE,'Dear user 9 commodo placerat praesent blandit nam nulla integer pede justo lacinia eget tincidunt eget tempus vel pede morbi porttitor lorem id yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('27',17,'Solarbreeze needs attention','2021-01-18 22:51:07',TRUE,'Dear user 17 molestie sed justo pellentesque viverra pede ac diam cras pellentesque volutpat dui maecenas yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('28',22,'Gembucket needs attention','2020-05-30 06:12:33',TRUE,'Dear user 22 sit amet consectetuer adipiscing elit proin risus praesent lectus vestibulum yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('29',25,'Zontrax needs attention','2021-01-09 08:44:13',FALSE,'Dear user 25 luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet yours truly BMI');
INSERT INTO Notification(Id,Recipient,Subject,SendDate,Unread,Body)
VALUES ('30',6,'Kanlam needs attention','2020-10-12 13:41:46',TRUE,'Dear user 6 quisque erat eros viverra eget congue eget semper rutrum nulla nunc purus phasellus in felis yours truly BMI');

TRUNCATE TABLE Product RESTART IDENTITY;
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('1',1,'PITCHED','Braas','BMI Braas Otcom Professional-1XL-1','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Asoka',TRUE,24);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('2',1,'PITCHED','Schiedel','BMI Schiedel Asoka Professional-2XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Viva',TRUE,21);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('3',1,'PITCHED','Monier','BMI Monier Temp Professional-3XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Lotstring',TRUE,30);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('4',1,'PITCHED','Cobert','BMI Cobert It Professional-4XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','It',TRUE,21);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('5',1,'PITCHED','Schiedel','BMI Schiedel Sonair Professional-5XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Alphazap',FALSE,21);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('6',1,'FLAT','Wierer','BMI Wierer Zathin Professional-6XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Tin',TRUE,26);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('7',2,'FLAT','Cobert','BMI Cobert Hatity Professional-7XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Home Ing',TRUE,26);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('8',2,'FLAT','Coverland','BMI Coverland Treeflex Professional-8XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Home Ing',TRUE,29);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('9',2,'PITCHED','Monier','BMI Monier Mat Lam Tam Professional-9XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Bytecard',TRUE,20);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('10',2,'FLAT','Schiedel','BMI Schiedel Sonsing Professional-10XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Konklab',FALSE,21);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('11',1,'PITCHED','Braas','BMI Braas Prodder Professional-11XL-1','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Stringtough',TRUE,20);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('12',2,'PITCHED','Schiedel','BMI Schiedel Aerified Professional-12XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Cardguard',TRUE,29);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('13',2,'PITCHED','Coverland','BMI Coverland Bitchip Professional-13XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Prodder',TRUE,28);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('14',2,'FLAT','Braas','BMI Braas Redhold Professional-14XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Veribet',TRUE,29);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('15',2,'FLAT','Monier','BMI Monier Namfix Professional-15XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Latlux',FALSE,27);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('16',2,'FLAT','Monier','BMI Monier It Professional-16XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Ronstring',TRUE,29);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('17',2,'PITCHED','Monier','BMI Monier Opela Professional-17XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Sonair',TRUE,24);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('18',2,'PITCHED','Wierer','BMI Wierer Rank Professional-18XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Zathin',TRUE,26);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('19',2,'PITCHED','Monier','BMI Monier Home Ing Professional-19XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Y-find',TRUE,29);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('20',2,'FLAT','Bramac','BMI Bramac Gembucket Professional-20XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Lotstring',FALSE,30);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('21',1,'PITCHED','Schiedel','BMI Schiedel Gembucket Professional-21XL-1','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Tempsoft',TRUE,24);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('22',2,'PITCHED','Bramac','BMI Bramac Ventosanzap Professional-22XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Andalax',TRUE,29);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('23',2,'FLAT','Schiedel','BMI Schiedel Cookley Professional-23XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Y-Solowarm',TRUE,23);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('24',2,'FLAT','Coverland','BMI Coverland Voyatouch Professional-24XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Alpha',TRUE,24);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('25',2,'FLAT','Braas','BMI Braas Zamit Professional-25XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Tresom',FALSE,30);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('26',2,'PITCHED','Bramac','BMI Bramac Hatity Professional-26XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Daltfresh',TRUE,27);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('27',2,'PITCHED','Schiedel','BMI Schiedel Lotstring Professional-27XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Andalax',TRUE,27);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('28',2,'PITCHED','Coverland','BMI Coverland Zaam-Dox Professional-28XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Lotstring',TRUE,25);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('29',2,'FLAT','Coverland','BMI Coverland Greenlam Professional-29XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Ronstring',TRUE,29);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('30',2,'PITCHED','Schiedel','BMI Schiedel Temp Professional-30XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Quo Lux',FALSE,26);

TRUNCATE TABLE GuaranteedProduct RESTART IDENTITY;
INSERT INTO GuaranteedProduct(Id,Product,Guarantee)
VALUES ('1',1,1);
INSERT INTO GuaranteedProduct(Id,Product,Guarantee)
VALUES ('2',2,1);
INSERT INTO GuaranteedProduct(Id,Product,Guarantee)
VALUES ('3',3,1);

TRUNCATE TABLE Project RESTART IDENTITY;
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('1',2,'FLAT','868 Sommers Crossing',TRUE,504,'ccardenoza0@sogou.com','Christie','Cardenoza','Devpoint','6190 Clemons Center','Columbia','Missouri','United States','65218','08918 Fairfield Point','Bronx','New York','United States','10454','2021-01-08 17:40:47','2020-11-11 00:40:39');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('2',2,'PITCHED','74 Kingsford Junction',TRUE,166,'achazelle1@statcounter.com','Andra','Chazelle','Bluezoom','63112 Cascade Junction','Pomona','California','United States','91797','05931 Stephen Center','San Diego','California','United States','92160','2020-05-19 12:35:43','2020-06-15 23:26:51');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('3',2,'FLAT','3 Straubel Street',TRUE,147,'jkirkpatrick2@unesco.org','Jeni','Kirkpatrick','Jamia','9 Donald Drive','Tampa','Florida','United States','33686','7 Delaware Trail','Chandler','Arizona','United States','85246','2020-10-06 18:14:00','2020-07-11 01:43:34');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('4',2,'PITCHED','5835 Harper Drive',FALSE,731,'kferrarini3@smugmug.com','Kalina','Ferrarini','Skinix','4780 Armistice Park','Los Angeles','California','United States','90081','3 Monica Way','Lansing','Michigan','United States','48912','2020-06-29 22:04:15','2020-07-03 15:58:44');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('5',2,'FLAT','055 Debs Parkway',FALSE,399,'sleppington4@census.gov','Sheba','Leppington','Tagcat','04 Carberry Center','North Little Rock','Arkansas','United States','72118','3 Kim Hill','Whittier','California','United States','90610','2020-10-30 20:55:40','2020-10-21 23:13:17');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('6',2,'PITCHED','56596 Huxley Avenue',FALSE,906,'klevane5@usatoday.com','Kizzee','Levane','Kamba','56997 Buhler Place','Modesto','California','United States','95397','9 Ruskin Parkway','Greeley','Colorado','United States','80638','2020-05-03 09:40:24','2020-12-15 07:11:28');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('7',2,'FLAT','44615 Browning Place',FALSE,867,'spopeley6@chronoengine.com','Stoddard','Popeley','Skiba','9 Lillian Point','Cheyenne','Wyoming','United States','82007','351 Judy Street','Daytona Beach','Florida','United States','32128','2020-09-01 15:23:49','2021-09-05 02:53:08');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('8',2,'PITCHED','49566 Morningstar Junction',TRUE,893,'bmeadley7@ted.com','Belle','Meadley','Shuffledrive','5248 Anthes Hill','Erie','Pennsylvania','United States','16550','15939 Hanover Street','Daytona Beach','Florida','United States','32128','2021-02-04 13:31:41','2020-05-06 11:48:16');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('9',2,'FLAT','737 Holmberg Junction',TRUE,764,'rcasaccia8@ox.ac.uk','Ramonda','Casaccia','Wordware','4521 Burrows Park','Akron','Ohio','United States','44315','7034 Almo Lane','Juneau','Alaska','United States','99812','2020-08-04 22:55:53','2021-03-03 22:31:12');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('10',2,'PITCHED','14268 Texas Avenue',TRUE,64,'wsaxby9@ocn.ne.jp','Wilona','Saxby','Wikivu','177 American Point','Racine','Wisconsin','United States','53405','16 Havey Point','Reading','Pennsylvania','United States','19605','2020-05-01 11:44:41','2021-01-02 02:26:17');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('11',2,'FLAT','54 Northport Center',FALSE,734,'mcavea@fda.gov','Maxie','Cave','Gabspot','69 Butterfield Terrace','Silver Spring','Maryland','United States','20904','3 Schiller Drive','Saint Louis','Missouri','United States','63136','2020-11-05 07:06:59','2020-12-26 04:18:29');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('12',2,'PITCHED','671 Hanover Court',FALSE,654,'dmerrikinb@wikispaces.com','Dulcia','Merrikin','Tavu','655 Arkansas Circle','Lawrenceville','Georgia','United States','30245','3422 Redwing Drive','Eugene','Oregon','United States','97405','2021-01-26 02:44:30','2020-12-20 17:09:32');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('13',2,'FLAT','2958 Springs Drive',TRUE,790,'jmarrowc@japanpost.jp','Janeta','Marrow','Avamba','68 Red Cloud Street','Sacramento','California','United States','95828','7 Muir Alley','Trenton','New Jersey','United States','8603','2020-01-27 12:24:09','2021-01-13 20:32:15');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('14',2,'PITCHED','29 Express Court',TRUE,317,'evigursd@omniture.com','Eartha','Vigurs','Flashdog','49859 Comanche Crossing','Littleton','Colorado','United States','80127','9 Mcguire Circle','Boston','Massachusetts','United States','2104','2020-04-11 03:31:01','2020-09-08 14:43:16');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('15',2,'FLAT','5 Barby Road',FALSE,983,'clamburne@ted.com','Christean','Lamburn','Twitterlist','6238 Bultman Parkway','Pittsburgh','Pennsylvania','United States','15220','23 Calypso Terrace','Columbus','Georgia','United States','31998','2020-09-10 17:53:10','2020-11-02 11:09:06');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('16',2,'PITCHED','9 Steensland Lane',FALSE,571,'dbourdonf@cam.ac.uk','Dione','Bourdon','Camido','40085 Stoughton Road','Inglewood','California','United States','90310','8691 Logan Place','Madison','Wisconsin','United States','53726','2020-03-05 09:04:55','2021-01-26 03:08:41');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('17',2,'FLAT','5883 Chive Plaza',TRUE,84,'bhalbardg@ibm.com','Bertha','Halbard','Twitterbeat','4746 Bashford Alley','Portland','Oregon','United States','97221','90 Meadow Ridge Parkway','Spartanburg','South Carolina','United States','29305','2021-01-20 06:12:18','2020-03-01 12:41:25');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('18',2,'PITCHED','93 Sugar Terrace',TRUE,584,'cmctrustieh@liveinternet.ru','Clareta','McTrustie','Oyoba','61 Hollow Ridge Drive','Fairfax','Virginia','United States','22036','8 Surrey Point','Washington','District of Columbia','United States','20067','2020-01-07 20:41:10','2021-01-05 04:48:37');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('19',2,'FLAT','21959 Caliangt Way',TRUE,131,'tdreheri@weibo.com','Tammy','Dreher','Browseblab','05659 Thackeray Park','Cleveland','Ohio','United States','44125','317 8th Parkway','Muskegon','Michigan','United States','49444','2020-06-29 18:56:42','2020-04-02 19:28:51');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('20',2,'PITCHED','1260 Lakewood Gardens Avenue',TRUE,905,'rdanilovichj@netlog.com','Rosmunda','Danilovich','Meejo','9 Melvin Court','San Antonio','Texas','United States','78205','10 Golf View Circle','Washington','District of Columbia','United States','20530','2020-03-06 13:51:39','2020-06-01 09:23:29');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('21',2,'FLAT','882 Fairfield Way',TRUE,699,'nbatthewk@dell.com','Nichole','Batthew','Skynoodle','1 Schlimgen Junction','Springfield','Illinois','United States','62718','13756 Quincy Parkway','Virginia Beach','Virginia','United States','23459','2020-07-04 01:34:23','2021-10-13 11:19:17');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('22',2,'PITCHED','6843 Farragut Hill',TRUE,337,'cmartinotl@mediafire.com','Chloette','Martinot','Demizz','1 Ludington Pass','Arvada','Colorado','United States','80005','4811 Oriole Court','Chula Vista','California','United States','91913','2020-02-15 07:52:20','2021-01-20 15:22:34');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('23',2,'FLAT','3 Tony Point',TRUE,705,'acurgenuerm@domainmarket.com','Ardelia','Curgenuer','Ooba','7 Darwin Court','Daytona Beach','Florida','United States','32118','77 Stoughton Avenue','Virginia Beach','Virginia','United States','23454','2020-12-11 07:17:57','2020-08-30 15:41:14');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('24',2,'PITCHED','138 Waubesa Drive',TRUE,684,'bjoutapaitisn@topsy.com','Barb','Joutapaitis','Mynte','747 Arizona Center','Miami','Florida','United States','33175','88025 Mosinee Center','Baton Rouge','Louisiana','United States','70820','2020-08-28 21:42:11','2021-02-13 17:14:13');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('25',2,'FLAT','065 Sullivan Plaza',TRUE,828,'rpleaceo@mail.ru','Ronda','Pleace','Yakijo','101 Graceland Trail','Denton','Texas','United States','76205','3213 Truax Pass','Annapolis','Maryland','United States','21405','2020-10-20 12:46:12','2020-12-06 17:12:55');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('26',2,'PITCHED','599 3rd Junction',FALSE,910,'ddallinderp@cornell.edu','Daphna','Dallinder','Quinu','888 Troy Lane','Washington','District of Columbia','United States','20436','0 Harbort Lane','Dallas','Texas','United States','75246','2021-01-19 13:11:28','2021-09-12 07:07:26');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('27',2,'FLAT','767 Debs Terrace',FALSE,655,'gbainesq@mtv.com','Gabbi','Baines','Dabvine','516 Schmedeman Park','Hollywood','Florida','United States','33023','18527 Walton Park','Monticello','Minnesota','United States','55590','2020-11-30 01:13:51','2021-10-16 04:45:59');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('28',2,'PITCHED','7530 John Wall Drive',FALSE,841,'mselleyr@independent.co.uk','Mirabelle','Selley','Zoonder','68893 Boyd Place','Lancaster','Pennsylvania','United States','17622','8300 Roth Alley','Raleigh','North Carolina','United States','27690','2020-01-02 09:01:22','2020-03-02 21:38:53');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('29',2,'FLAT','958 Carioca Road',TRUE,383,'iwhyberds@wp.com','Isabelita','Whyberd','Blogtags','83 Northport Lane','Cincinnati','Ohio','United States','45249','29137 Merrick Place','Santa Barbara','California','United States','93111','2020-03-09 15:50:11','2020-07-16 06:19:59');
INSERT INTO Project(Id,Company,Technology,Name,Hidden,RoofArea,BuildingOwnerMail,BuildingOwnerFirstName,BuildingOwnerLastName,BuildingOwnerCompany,BuildingOwnerAddressLine1,BuildingOwnerAddressLIne2 ,BuildingOwnerTown,BuildingOwnerRegion,BuildingOwnerPostcode,SiteAddressLine1,SiteAddressLIne2 ,SiteTown,SiteRegion,SitePostcode,StartDate,EndDate)
VALUES ('30',2,'PITCHED','0221 Lotheville Avenue',TRUE,107,'sastlest@ehow.com','Susi','Astles','Bluejam','308 East Avenue','Memphis','Tennessee','United States','38109','12823 Hudson Hill','Houston','Texas','United States','77240','2020-09-14 09:38:28','2021-01-31 23:15:04');

TRUNCATE TABLE ProjectMember RESTART IDENTITY;
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('1',1,21,'2021-01-23 02:11:39','2020-03-10 10:49:32');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('2',1,22,'2020-08-09 19:35:00','2021-01-17 07:10:18');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('3',1,23,'2020-10-25 19:49:35','2020-12-08 19:14:01');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('4',2,24,'2020-12-13 21:41:36','2020-08-11 07:06:31');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('5',2,25,'2020-10-16 11:02:17','2020-03-09 15:56:37');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('6',2,26,'2020-04-30 17:53:38','2020-08-19 15:48:01');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('7',3,27,'2020-06-04 13:34:25','2020-06-26 00:13:11');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('8',3,28,'2020-05-13 13:24:22','2020-04-25 21:54:17');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('9',3,29,'2020-09-16 02:25:18','2020-06-17 01:56:21');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('10',4,21,'2020-04-01 11:14:19','2020-04-17 01:11:23');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('11',4,22,'2020-11-05 01:02:38','2020-12-09 09:53:20');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('12',4,23,'2020-11-07 02:29:36','2020-09-17 14:55:15');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('13',5,24,'2020-09-29 12:29:34','2020-04-02 14:11:16');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('14',5,25,'2021-02-16 16:45:08','2020-08-09 09:49:40');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('15',5,26,'2020-03-15 18:36:33','2020-02-28 16:43:55');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('16',1,27,'2020-04-13 13:33:39','2021-02-07 13:42:59');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('17',1,28,'2020-11-04 19:25:35','2020-03-19 20:37:03');
INSERT INTO ProjectMember(Id,Project,Member,Added,Removed)
VALUES ('18',1,29,'2021-01-12 13:01:06','2021-01-13 11:54:24');

TRUNCATE TABLE System RESTART IDENTITY;
INSERT INTO System(Id,Market,Technology,Name,Description,MaximumValidity)
VALUES ('1',2,'FLAT','BMI Tarantula System X11 for Professionals','Uses BMI specific technology, the BMI Tarantula System X11 for Professionals system is best in class, intended for those who value Managed actuating parallelism',31);
INSERT INTO System(Id,Market,Technology,Name,Description,MaximumValidity)
VALUES ('2',2,'FLAT','BMI White stork System X12 for Professionals','Uses BMI specific technology, the BMI White stork System X12 for Professionals system is best in class, intended for those who value Right-sized contextually-based implementation',20);
INSERT INTO System(Id,Market,Technology,Name,Description,MaximumValidity)
VALUES ('3',2,'FLAT','BMI Urial System X13 for Professionals','Uses BMI specific technology, the BMI Urial System X13 for Professionals system is best in class, intended for those who value Reactive demand-driven function',31);
INSERT INTO System(Id,Market,Technology,Name,Description,MaximumValidity)
VALUES ('4',2,'PITCHED','BMI Asian lion System X24 for Professionals','Uses BMI specific technology, the BMI Asian lion System X24 for Professionals system is best in class, intended for those who value Front-line full-range system engine',30);
INSERT INTO System(Id,Market,Technology,Name,Description,MaximumValidity)
VALUES ('5',2,'PITCHED','BMI Striped skunk System X25 for Professionals','Uses BMI specific technology, the BMI Striped skunk System X25 for Professionals system is best in class, intended for those who value Multi-lateral motivating artificial intelligence',35);
INSERT INTO System(Id,Market,Technology,Name,Description,MaximumValidity)
VALUES ('6',2,'PITCHED','BMI Striped dolphin System X26 for Professionals','Uses BMI specific technology, the BMI Striped dolphin System X26 for Professionals system is best in class, intended for those who value Front-line mobile capacity',35);

TRUNCATE TABLE SystemMember RESTART IDENTITY;
INSERT INTO SystemMember(Id,System,Product)
VALUES ('1',1,1);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('2',1,2);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('3',1,3);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('4',2,1);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('5',2,2);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('6',2,4);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('7',3,1);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('8',3,2);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('9',3,3);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('10',3,4);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('11',4,1);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('12',4,2);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('13',4,4);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('14',4,6);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('15',4,8);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('16',5,9);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('17',5,10);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('18',5,11);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('19',6,12);
INSERT INTO SystemMember(Id,System,Product)
VALUES ('20',6,13);
ALTER TABLE Account ADD FOREIGN KEY (CreatedBy) REFERENCES Account(Id);

ALTER TABLE Account ADD FOREIGN KEY (Market) REFERENCES Market(Id);

ALTER TABLE Company ADD FOREIGN KEY (Market) REFERENCES Market(Id);

ALTER TABLE Company ADD FOREIGN KEY (Owner) REFERENCES Account(Id);

ALTER TABLE CompanyMember ADD FOREIGN KEY (EndUser) REFERENCES Account(Id);

ALTER TABLE CompanyMember ADD FOREIGN KEY (Company) REFERENCES Company(Id);

ALTER TABLE ContactDetails ADD FOREIGN KEY (Market) REFERENCES Market(Id);

ALTER TABLE EvidenceItem ADD FOREIGN KEY (Request) REFERENCES Guarantee(Id);

ALTER TABLE Guarantee ADD FOREIGN KEY (Requestor) REFERENCES Account(Id);

ALTER TABLE Guarantee ADD FOREIGN KEY (ResponsibleInstaller) REFERENCES Account(Id);

ALTER TABLE Guarantee ADD FOREIGN KEY (Project) REFERENCES Project(Id);

ALTER TABLE Guarantee ADD FOREIGN KEY (System) REFERENCES System(Id);

ALTER TABLE Guarantee ADD FOREIGN KEY (Reviewer) REFERENCES Account(Id);

ALTER TABLE Invitation ADD FOREIGN KEY (Inviter) REFERENCES Account(Id);

ALTER TABLE Note ADD FOREIGN KEY (Author) REFERENCES Account(Id);

ALTER TABLE Note ADD FOREIGN KEY (Project) REFERENCES Project(Id);

ALTER TABLE Notification ADD FOREIGN KEY (Recipient) REFERENCES Account(Id);

ALTER TABLE Product ADD FOREIGN KEY (Market) REFERENCES Market(Id);

ALTER TABLE GuaranteedProduct ADD FOREIGN KEY (Product) REFERENCES Product(Id);

ALTER TABLE GuaranteedProduct ADD FOREIGN KEY (Guarantee) REFERENCES Guarantee(Id);

ALTER TABLE Project ADD FOREIGN KEY (Company) REFERENCES Company(Id);

ALTER TABLE ProjectMember ADD FOREIGN KEY (Project) REFERENCES Project(Id);

ALTER TABLE ProjectMember ADD FOREIGN KEY (Member) REFERENCES Account(Id);

ALTER TABLE System ADD FOREIGN KEY (Market) REFERENCES Market(Id);

ALTER TABLE SystemMember ADD FOREIGN KEY (System) REFERENCES System(Id);

ALTER TABLE SystemMember ADD FOREIGN KEY (Product) REFERENCES Product(Id);

COMMENT ON TABLE Account IS 'An InTouch account';
COMMENT ON COLUMN Account.Id IS 'Primary key';
COMMENT ON COLUMN Account.CreatedBy IS 'fk';
COMMENT ON COLUMN Account.Status IS 'ek';
COMMENT ON COLUMN Account.Market IS 'fk';
COMMENT ON COLUMN Account.Role IS 'ek';
COMMENT ON COLUMN Account.Email IS 'The mail address associated with the account';
COMMENT ON COLUMN Account.Firstname IS 'First name';
COMMENT ON COLUMN Account.Lastname IS 'Last name';
COMMENT ON COLUMN Account.Created IS 'When the account was created';
COMMENT ON COLUMN Account.DoceboId IS 'User account in Docebo';
COMMENT ON COLUMN Account.Photo IS 'File reference or the file itself. A profile picture of the user';

COMMENT ON TABLE Company IS 'A company that has been registered in InTouch';
COMMENT ON COLUMN Company.Id IS 'Primary key';
COMMENT ON COLUMN Company.Market IS 'fk';
COMMENT ON COLUMN Company.Tier IS 'Tier';
COMMENT ON COLUMN Company.Owner IS 'fk';
COMMENT ON COLUMN Company.Active IS 'Whether Company is active.  This is important so that we can deactivate a Company, such that it cannot be used any more, does not appear in Find a Contractor, but the relationships with historical guarantees is preserved.';
COMMENT ON COLUMN Company.PrivateEmail IS 'The email address that BMI will use to contact the Company';
COMMENT ON COLUMN Company.LmsGroup IS 'The Group ID of the company in Docebo';
COMMENT ON COLUMN Company.Name IS 'The registered name of the Company';
COMMENT ON COLUMN Company.RegisteredAddressLine1 IS 'The Companys first address line';
COMMENT ON COLUMN Company.RegisteredAddressLine2 IS 'The Companys second address line';
COMMENT ON COLUMN Company.Town IS 'The Town';
COMMENT ON COLUMN Company.Region IS 'The Region';
COMMENT ON COLUMN Company.RegisteredZip IS 'The Companys Registered Address postcode';
COMMENT ON COLUMN Company.TradingAddressLine1 IS 'The Companys Trading Address first address line';
COMMENT ON COLUMN Company.TradingAddressLine2 IS 'The Companys Trading Address second address line.';
COMMENT ON COLUMN Company.TradingTown IS 'Town that the Company trading address is in';
COMMENT ON COLUMN Company.TradingRegion IS 'Companys trading region';
COMMENT ON COLUMN Company.TradingZip IS 'The Companys Trading Address postcode';
COMMENT ON COLUMN Company.Phone IS 'They Companys public phone number';
COMMENT ON COLUMN Company.Geolocation IS 'The companys GoogleMap address';
COMMENT ON COLUMN Company.AboutUs IS 'A bit of blurb to appear in Find a contractor';
COMMENT ON COLUMN Company.LinkedIn IS 'Their Company LinkedIn page URL';
COMMENT ON COLUMN Company.PublicEmail IS 'The email address that they can be contacted with by the public assuming they are listed.';
COMMENT ON COLUMN Company.Website IS 'The Company website URL';
COMMENT ON COLUMN Company.WebListing IS 'Whether Company and its details are retrievable from the API. Setting this to true wouldinclude the Company in Find a Contractor.  Somthing that a BMI admin should be able to do, but not the Company themselves.';
COMMENT ON COLUMN Company.ReferenceNumber IS 'A 6 digit reference number generated for all Companies and visible to Roofpro member Companies. (aka membership number)';

COMMENT ON TABLE CompanyMember IS 'A connection between a user and a company';
COMMENT ON COLUMN CompanyMember.Id IS 'Primary key';
COMMENT ON COLUMN CompanyMember.EndUser IS 'fk';
COMMENT ON COLUMN CompanyMember.Company IS 'fk';

COMMENT ON TABLE ContactDetails IS 'Contact details that appear in the Contact Carousel on the Company Page';
COMMENT ON COLUMN ContactDetails.Id IS 'Primary key';
COMMENT ON COLUMN ContactDetails.Market IS 'fk';
COMMENT ON COLUMN ContactDetails.Details IS 'Some markdown text telling you how to get in touch with BMI';

COMMENT ON TABLE EvidenceItem IS 'An item of evidence for a guarantee';
COMMENT ON COLUMN EvidenceItem.Id IS 'Primary key';
COMMENT ON COLUMN EvidenceItem.Category IS 'fk';
COMMENT ON COLUMN EvidenceItem.Request IS 'fk';
COMMENT ON COLUMN EvidenceItem.Name IS 'Short name for the item of evidence';
COMMENT ON COLUMN EvidenceItem.Attachment IS 'File reference or the file itself. Photo of the evidence';

COMMENT ON TABLE Guarantee IS 'Starts life as request for a gurantee and becomes an actual issued guarantee';
COMMENT ON COLUMN Guarantee.Id IS 'Primary key - starts at 6100';
COMMENT ON COLUMN Guarantee.Pdf IS 'The pdf file that is emailed out, or a reference to it, or reference to the service that will generate it on demand';
COMMENT ON COLUMN Guarantee.Requestor IS 'fk';
COMMENT ON COLUMN Guarantee.ResponsibleInstaller IS 'fk';
COMMENT ON COLUMN Guarantee.Project IS 'fk';
COMMENT ON COLUMN Guarantee.Type IS 'fk';
COMMENT ON COLUMN Guarantee.System IS 'fk';
COMMENT ON COLUMN Guarantee.Reviewer IS 'fk';
COMMENT ON COLUMN Guarantee.Status IS 'ek';
COMMENT ON COLUMN Guarantee.StartDate IS 'The date that the Guarantee is approved either automatically or manually.';
COMMENT ON COLUMN Guarantee.Expiry IS 'When the guarantee will expire.  This is dependent on the StartDate, the Validity of the Product or System and the ValidityOffset in this Tier';
COMMENT ON COLUMN Guarantee.IssueNumber IS 'This will be presented on the Guarantee pdf itself, if approved and is the primary reference for the Guarantees report. It is unique in the In the legacy system, the number is 3 sets of 4 digit numbers concatenated into one long number from the Company Id, Project Id and Request Id.';
COMMENT ON COLUMN Guarantee.PurchaseDate IS 'The date that the BMI merchanise was purchased';

COMMENT ON TABLE Invitation IS 'An invitation to join InTouch';
COMMENT ON COLUMN Invitation.Id IS 'Primary key';
COMMENT ON COLUMN Invitation.Inviter IS 'fk';
COMMENT ON COLUMN Invitation.Type IS 'ek';
COMMENT ON COLUMN Invitation.Token IS 'Unique token that was sent to the user in the email and or notification they were sent';
COMMENT ON COLUMN Invitation.Invitee IS 'An email address';
COMMENT ON COLUMN Invitation.Accepted IS 'Additional note if there is one';
COMMENT ON COLUMN Invitation.Generated IS 'When the invite was generated';
COMMENT ON COLUMN Invitation.Expires IS 'When this invitation will expire';

COMMENT ON TABLE Market IS 'A country that BMI operates in';
COMMENT ON COLUMN Market.Id IS 'Primary key';
COMMENT ON COLUMN Market.Locale IS 'ek';
COMMENT ON COLUMN Market.CountryCode IS 'The unique letters used to publicly identify the market, for example, in the URL of their website (uk for the UK, no for Norway, it for Italy etc)';
COMMENT ON COLUMN Market.Name IS 'A short name for the market, e.g. Italy, Norway, Netherlands';
COMMENT ON COLUMN Market.SendName IS 'The From name used when sending an email';
COMMENT ON COLUMN Market.SendMailbox IS 'The mailbox on intouch.bmigroup.com that emails will be sent from for this Market';
COMMENT ON COLUMN Market.LmsBranch IS 'The default branch in Docebo to use for listing training courses in this Market';
COMMENT ON COLUMN Market.LmsEnabled IS 'Whether the market is integrated with Docebo';
COMMENT ON COLUMN Market.ProjectsEnabled IS 'Whether the market supports Projects.  If so then the Project section is available.  Tier 0 can then be configured to support Guarantees in non-Roopro countries.  In Roofpro countries various Tier configurations become possible.';
COMMENT ON COLUMN Market.RoofProEnabled IS 'Whether the market is in Roofpro.  If so it supports configuring multiple Tiers with any types of Guarantee and has MediaTools available to Companies. ';
COMMENT ON COLUMN Market.Live IS 'Whether the market is live to the public or not';
COMMENT ON COLUMN Market.Gtag IS 'Reference to the Google Analytics tracking ID that is used for the Country GA reports';
COMMENT ON COLUMN Market.Polygon IS 'The geospatial shape defined by coordinates on GoogleMaps to outline the country. Probably JSON.';
COMMENT ON COLUMN Market.Background IS 'File reference or the file itself. The image that appears in the background of the login and registration pages';
COMMENT ON COLUMN Market.LmsPicture IS 'File reference or the file itself. The picture on the LMS cover page';
COMMENT ON COLUMN Market.OffsetTier1 IS 'The number of years to reduce guarantees by in Tier 1';
COMMENT ON COLUMN Market.OffsetTier2 IS 'The number of years to reduce guarantees by in Tier 2';
COMMENT ON COLUMN Market.OffsetTier3 IS 'The number of years to reduce guarantees by in Tier 3';
COMMENT ON COLUMN Market.OffsetTier4 IS 'The number of years to reduce guarantees by in Tier 4';

COMMENT ON TABLE Note IS 'Usually a note added by someone at BMI who has been asked to approve a Guarantee.  It is likely to be either a short note of approval, saying something like, Approved, or Good Job, or a note of rejection, saying  something like, The photographs of the roof are not clear enough. Could also be a note inserted into an invite to join InTouch.';
COMMENT ON COLUMN Note.Id IS 'Primary key';
COMMENT ON COLUMN Note.Author IS 'fk';
COMMENT ON COLUMN Note.Project IS 'fk';
COMMENT ON COLUMN Note.Body IS 'The body of the Note';

COMMENT ON TABLE Notification IS 'An internal notification available to an end user';
COMMENT ON COLUMN Notification.Id IS 'Primary key';
COMMENT ON COLUMN Notification.Recipient IS 'fk';
COMMENT ON COLUMN Notification.Subject IS 'This is no longer needed.  Please delete from datamodel.  Emails do have subjects but notifications do not.';
COMMENT ON COLUMN Notification.SendDate IS 'The datetime stamp for when the message was sent';
COMMENT ON COLUMN Notification.Unread IS 'Whether the message still needs to be read';
COMMENT ON COLUMN Notification.Body IS 'The body of the message';

COMMENT ON TABLE Product IS 'A product made by BMI';
COMMENT ON COLUMN Product.Id IS 'Primary key';
COMMENT ON COLUMN Product.Market IS 'fk';
COMMENT ON COLUMN Product.Technology IS 'ek';
COMMENT ON COLUMN Product.Brand IS 'The Products brand';
COMMENT ON COLUMN Product.Name IS 'Short name for the product';
COMMENT ON COLUMN Product.Description IS 'A description of the product';
COMMENT ON COLUMN Product.Family IS 'The family of Products this Product is in';
COMMENT ON COLUMN Product.Published IS 'Whether the product is avialable or not';
COMMENT ON COLUMN Product.Validity IS 'The numbe of years that this product can be guaranteed for';

COMMENT ON TABLE GuaranteedProduct IS 'A mapping of Products to Guarantees.  You can have more than one Product per Product Guarantee.';
COMMENT ON COLUMN GuaranteedProduct.Id IS 'Primary key';
COMMENT ON COLUMN GuaranteedProduct.Product IS 'fk';
COMMENT ON COLUMN GuaranteedProduct.Guarantee IS 'fk';

COMMENT ON TABLE Project IS 'A project that has been put into InTouch by a Company Administrator to represent a project being done by that company';
COMMENT ON COLUMN Project.Id IS 'Primary key';
COMMENT ON COLUMN Project.Company IS 'fk';
COMMENT ON COLUMN Project.Technology IS 'ek';
COMMENT ON COLUMN Project.Name IS 'Short name for the Project';
COMMENT ON COLUMN Project.Hidden IS 'If this is true then the Project should have been hidden from users';
COMMENT ON COLUMN Project.RoofArea IS 'The number of square meters of roof that this project covers';
COMMENT ON COLUMN Project.BuildingOwnerMail IS 'Email address of the person who owns the building that the roof is going on.  Not mandatory for a Project, but mandatory when the Company applies for a Guarantee related to the project.';
COMMENT ON COLUMN Project.BuildingOwnerFirstName IS 'Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued.';
COMMENT ON COLUMN Project.BuildingOwnerLastName IS 'Name of the Building Owner, seen on the Guarantee. Must be completed before a Guarantee is issued.';
COMMENT ON COLUMN Project.BuildingOwnerCompany IS 'Name of the Building Owners Company if they have one';
COMMENT ON COLUMN Project.BuildingOwnerAddressLine1 IS 'Building Owner Address field, perhaps unneccessary';
COMMENT ON COLUMN Project.BuildingOwnerAddressLIne2  IS 'Building Owner Address field, perhaps unneccessary';
COMMENT ON COLUMN Project.BuildingOwnerTown IS 'Building Owner Address field, perhaps unneccessary';
COMMENT ON COLUMN Project.BuildingOwnerRegion IS 'Building Owner Address field, perhaps unneccessary';
COMMENT ON COLUMN Project.BuildingOwnerPostcode IS 'Building Owner Address field, perhaps unneccessary';
COMMENT ON COLUMN Project.SiteAddressLine1 IS 'Building Owner Address field, perhaps unneccessary';
COMMENT ON COLUMN Project.SiteAddressLIne2  IS 'Building Owner Address field, perhaps unneccessary';
COMMENT ON COLUMN Project.SiteTown IS 'Building Owner Address field.  Important for reporting because the Name is arbitrary and often meaningless to the person reading it.';
COMMENT ON COLUMN Project.SiteRegion IS 'Building Owner Address field, perhaps unneccessary';
COMMENT ON COLUMN Project.SitePostcode IS 'Building Owner Address field, perhaps unneccessary';
COMMENT ON COLUMN Project.StartDate IS 'The date that the Project starts';
COMMENT ON COLUMN Project.EndDate IS 'The date that the Project expects to end.  ';

COMMENT ON TABLE ProjectMember IS 'A connection between a User and a Project. A connection between a user and a company. This relationship could be simplified as one to many at the moment, but there is already demand for a many to many relationship.';
COMMENT ON COLUMN ProjectMember.Id IS 'Primary key';
COMMENT ON COLUMN ProjectMember.Project IS 'fk';
COMMENT ON COLUMN ProjectMember.Member IS 'fk';
COMMENT ON COLUMN ProjectMember.Added IS 'When the user was assigned';
COMMENT ON COLUMN ProjectMember.Removed IS 'When the user was removed';

COMMENT ON TABLE System IS 'A collection of products that can be guaranteed as a system';
COMMENT ON COLUMN System.Id IS 'Primary key';
COMMENT ON COLUMN System.Market IS 'fk';
COMMENT ON COLUMN System.Technology IS 'ek';
COMMENT ON COLUMN System.Name IS 'Short name for the System';
COMMENT ON COLUMN System.Description IS 'A description for the System';
COMMENT ON COLUMN System.MaximumValidity IS 'The maximum number of years that this system can be guaranteed for.  Must be greater than 10.';

COMMENT ON TABLE SystemMember IS 'A system product pair';
COMMENT ON COLUMN SystemMember.Id IS 'Primary key';
COMMENT ON COLUMN SystemMember.System IS 'fk';
COMMENT ON COLUMN SystemMember.Product IS 'fk';
