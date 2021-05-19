

DROP TABLE IF EXISTS course CASCADE;
CREATE TABLE course (
id SERIAL PRIMARY KEY,
course_id int,
technology text,
name text,
image text,
promoted boolean,
training_type text,
description text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS course_catalog CASCADE;
CREATE TABLE course_catalog (
id SERIAL PRIMARY KEY,
catalog_id int,
course_id int,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS course_enrollment CASCADE;
CREATE TABLE course_enrollment (
id SERIAL PRIMARY KEY,
user_id int,
course_id int,
status text,
url text,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);


TRUNCATE TABLE course RESTART IDENTITY;
INSERT INTO course(id,course_id,technology,name,image,promoted,training_type,description)
VALUES ('1',123,'OTHER','Echo roofing methodology','https://picsum.photos/274/206',TRUE,'classroom','Learn about the Echo roofing methodology in our fantastic Swindon training centre supported by Advanced empowering workforce techniques');
INSERT INTO course(id,course_id,technology,name,image,promoted,training_type,description)
VALUES ('2',124,'PITCHED','I roofing methodology','https://picsum.photos/274/206',FALSE,'classroom','Learn about the I roofing methodology in our fantastic Swindon training centre supported by Reduced composite algorithm techniques');
INSERT INTO course(id,course_id,technology,name,image,promoted,training_type,description)
VALUES ('3',125,'FLAT','XG350 roofing methodology','https://picsum.photos/274/206',FALSE,'classroom','Learn about the XG350 roofing methodology in our fantastic Swindon training centre supported by Extended global frame techniques');
INSERT INTO course(id,course_id,technology,name,image,promoted,training_type,description)
VALUES ('4',126,'PITCHED','LeMans roofing methodology','https://picsum.photos/274/206',FALSE,'classroom','Learn about the LeMans roofing methodology in our fantastic Swindon training centre supported by Pre-emptive optimizing task-force techniques');
INSERT INTO course(id,course_id,technology,name,image,promoted,training_type,description)
VALUES ('5',127,'PITCHED','Express 2500 roofing methodology','https://picsum.photos/274/206',FALSE,'classroom','Learn about the Express 2500 roofing methodology in our fantastic Swindon training centre supported by Customizable static budgetary management techniques');
INSERT INTO course(id,course_id,technology,name,image,promoted,training_type,description)
VALUES ('6',128,'OTHER','Legend roofing methodology','https://picsum.photos/274/206',FALSE,'elearning','Learn about the Legend roofing methodology in our fantastic Swindon training centre supported by Grass-roots discrete policy techniques');
INSERT INTO course(id,course_id,technology,name,image,promoted,training_type,description)
VALUES ('7',129,'OTHER','X5 roofing methodology','https://picsum.photos/274/206',FALSE,'elearning','Learn about the X5 roofing methodology in our fantastic Swindon training centre supported by Multi-lateral impactful hub techniques');
INSERT INTO course(id,course_id,technology,name,image,promoted,training_type,description)
VALUES ('8',130,'OTHER','Grand Cherokee roofing methodology','https://picsum.photos/274/206',FALSE,'elearning','Learn about the Grand Cherokee roofing methodology in our fantastic Swindon training centre supported by Open-source systemic capability techniques');
INSERT INTO course(id,course_id,technology,name,image,promoted,training_type,description)
VALUES ('9',131,'OTHER','Passat roofing methodology','https://picsum.photos/274/206',FALSE,'elearning','Learn about the Passat roofing methodology in our fantastic Swindon training centre supported by Digitized intermediate benchmark techniques');


TRUNCATE TABLE course_catalog RESTART IDENTITY;
INSERT INTO course_catalog(id,catalog_id,course_id)
VALUES ('1',345,123);


TRUNCATE TABLE course_enrollment RESTART IDENTITY;
INSERT INTO course_enrollment(id,user_id,course_id,status,url)
VALUES ('1',987,123,'enrolled','url');

ALTER TABLE course ADD UNIQUE (course_id);

ALTER TABLE course_catalog ADD FOREIGN KEY (course_id) REFERENCES course(course_id);
CREATE INDEX ON course_catalog (course_id);

ALTER TABLE course_enrollment ADD FOREIGN KEY (course_id) REFERENCES course(course_id);
CREATE INDEX ON course_enrollment (course_id);

COMMENT ON TABLE course IS 'A training course that BMI offers in Docebo';
COMMENT ON COLUMN course.id IS 'Primary key';
COMMENT ON COLUMN course.course_id IS 'Docebo CourseId';
COMMENT ON COLUMN course.technology IS 'technology';
COMMENT ON COLUMN course.name IS 'A short name for the Course taken from Docebo';
COMMENT ON COLUMN course.image IS 'A reference to the image';
COMMENT ON COLUMN course.promoted IS 'Promoted courses a listed higher than others';
COMMENT ON COLUMN course.training_type IS 'Some text from Docebo indicating whether it is a webinar, classroom etc';
COMMENT ON COLUMN course.description IS 'Text description from Docebo';

COMMENT ON TABLE course_catalog IS 'Course Catalog';
COMMENT ON COLUMN course_catalog.id IS 'Primary key';
COMMENT ON COLUMN course_catalog.catalog_id IS 'fk';
COMMENT ON COLUMN course_catalog.course_id IS 'fk';

COMMENT ON TABLE course_enrollment IS 'Course Enrollments';
COMMENT ON COLUMN course_enrollment.id IS 'Primary key';
COMMENT ON COLUMN course_enrollment.user_id IS 'fk';
COMMENT ON COLUMN course_enrollment.course_id IS 'fk';
COMMENT ON COLUMN course_enrollment.status IS 'status';
COMMENT ON COLUMN course_enrollment.url IS 'url';

SELECT SETVAL('course_id_seq', (select MAX(ID) from course));
SELECT SETVAL('course_catalog_id_seq', (select MAX(ID) from course_catalog));
SELECT SETVAL('course_enrollment_id_seq', (select MAX(ID) from course_enrollment));

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER
AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER set_course_updated_at 
BEFORE UPDATE ON course 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_course_catalog_updated_at 
BEFORE UPDATE ON course_catalog 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_course_enrollment_updated_at 
BEFORE UPDATE ON course_enrollment 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

