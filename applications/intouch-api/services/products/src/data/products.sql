
DROP TYPE IF EXISTS ProductTechnology CASCADE;
CREATE TYPE ProductTechnology  AS ENUM (
'FLAT',
'PITCHED',
'OTHER'
);  
  

DROP TABLE IF EXISTS Product CASCADE;
CREATE TABLE Product (
Id SERIAL PRIMARY KEY,
Market int,
Technology ProductTechnology,
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

DROP TABLE IF EXISTS System CASCADE;
CREATE TABLE System (
Id SERIAL PRIMARY KEY,
Market int,
Technology ProductTechnology,
Name text,
Description text,
MaximumValidity int
);

DROP TABLE IF EXISTS SystemMembership CASCADE;
CREATE TABLE SystemMembership (
Id SERIAL PRIMARY KEY,
System int,
Product int
);


TRUNCATE TABLE Product RESTART IDENTITY;
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('1',1,'PITCHED','Braas','BMI Braas Otcom Professional-1XL-1','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Asoka',TRUE,24);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('2',2,'PITCHED','Schiedel','BMI Schiedel Asoka Professional-2XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Viva',TRUE,21);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('3',2,'FLAT','Monier','BMI Monier Temp Professional-3XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Lotstring',TRUE,30);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('4',2,'PITCHED','Cobert','BMI Cobert It Professional-4XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','It',TRUE,21);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('5',2,'FLAT','Schiedel','BMI Schiedel Sonair Professional-5XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Alphazap',FALSE,21);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('6',2,'PITCHED','Wierer','BMI Wierer Zathin Professional-6XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Tin',TRUE,26);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('7',2,'PITCHED','Cobert','BMI Cobert Hatity Professional-7XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Home Ing',TRUE,26);
INSERT INTO Product(Id,Market,Technology,Brand,Name,Description,Family,Published,Validity)
VALUES ('8',2,'PITCHED','Coverland','BMI Coverland Treeflex Professional-8XL-2','Lorem ipsum per ardua ad astra cum initiae mendo notoriatum roofus dufus texas inclinados','Home Ing',TRUE,29);
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

TRUNCATE TABLE SystemMembership RESTART IDENTITY;
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('1',1,1);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('2',1,2);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('3',1,3);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('4',2,1);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('5',2,2);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('6',2,4);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('7',3,1);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('8',3,2);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('9',3,3);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('10',3,4);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('11',4,1);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('12',4,2);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('13',4,4);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('14',4,6);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('15',4,8);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('16',5,9);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('17',5,10);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('18',5,11);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('19',6,12);
INSERT INTO SystemMembership(Id,System,Product)
VALUES ('20',6,13);
ALTER TABLE GuaranteedProduct ADD FOREIGN KEY (Product) REFERENCES Product(Id);

ALTER TABLE SystemMembership ADD FOREIGN KEY (System) REFERENCES System(Id);

ALTER TABLE SystemMembership ADD FOREIGN KEY (Product) REFERENCES Product(Id);

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

COMMENT ON TABLE GuaranteedProduct IS 'A mapping of Products to Guarantees.  You can have more than one Product per Guarantee if its a Product Guarantee.';
COMMENT ON COLUMN GuaranteedProduct.Id IS 'Primary key';
COMMENT ON COLUMN GuaranteedProduct.Product IS 'fk';
COMMENT ON COLUMN GuaranteedProduct.Guarantee IS 'fk';

COMMENT ON TABLE System IS 'A collection of products that can be guaranteed as a system';
COMMENT ON COLUMN System.Id IS 'Primary key';
COMMENT ON COLUMN System.Market IS 'fk';
COMMENT ON COLUMN System.Technology IS 'ek';
COMMENT ON COLUMN System.Name IS 'Short name for the System';
COMMENT ON COLUMN System.Description IS 'A description for the System';
COMMENT ON COLUMN System.MaximumValidity IS 'The maximum number of years that this system can be guaranteed for.  Must be greater than 10.';

COMMENT ON TABLE SystemMembership IS 'A system product pair';
COMMENT ON COLUMN SystemMembership.Id IS 'Primary key';
COMMENT ON COLUMN SystemMembership.System IS 'fk';
COMMENT ON COLUMN SystemMembership.Product IS 'fk';

