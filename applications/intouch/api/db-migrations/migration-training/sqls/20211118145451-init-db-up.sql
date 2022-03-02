CREATE TABLE course (
  id serial PRIMARY KEY,
  course_id int,
  slug text,
  technology text,
  name text,
  image text,
  promoted boolean,
  training_type text,
  description text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE course_temp (
  id serial PRIMARY KEY,
  course_id int,
  slug text,
  technology text,
  name text,
  image text,
  promoted boolean,
  training_type text,
  description text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE course_catalogue (
  id serial PRIMARY KEY,
  catalogue_id int,
  course_id int,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE course_catalogue_temp (
  id serial PRIMARY KEY,
  catalogue_id int,
  course_id int,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE course_enrollment (
  id serial PRIMARY KEY,
  user_id int,
  course_id int,
  status text,
  url text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE course_enrollment_temp (
  id serial PRIMARY KEY,
  user_id int,
  course_id int,
  status text,
  url text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE course_sync_configuration (
  id serial PRIMARY KEY,
  config_name text,
  config_value text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

COMMENT ON TABLE course IS 'A training course that BMI offers in Docebo';

COMMENT ON COLUMN course.id IS 'Primary key';

COMMENT ON COLUMN course.course_id IS 'Docebo CourseId';

COMMENT ON COLUMN course.slug IS 'Course slug';

COMMENT ON COLUMN course.technology IS 'technology';

COMMENT ON COLUMN course.name IS 'A short name for the Course taken from Docebo';

COMMENT ON COLUMN course.image IS 'A reference to the image';

COMMENT ON COLUMN course.promoted IS 'Promoted courses a listed higher than others';

COMMENT ON COLUMN course.training_type IS 'Some text from Docebo indicating whether it is a webinar, classroom etc';

COMMENT ON COLUMN course.description IS 'Text description from Docebo';

COMMENT ON TABLE course_temp IS 'A temporary training course that BMI offers in Docebo. Courses are brought from Docebo into this table before being merged into the course table.';

COMMENT ON COLUMN course_temp.id IS 'Primary key';

COMMENT ON COLUMN course_temp.course_id IS 'Docebo CourseId';

COMMENT ON COLUMN course_temp.slug IS 'Course slug';

COMMENT ON COLUMN course_temp.technology IS 'technology';

COMMENT ON COLUMN course_temp.name IS 'A short name for the Course taken from Docebo';

COMMENT ON COLUMN course_temp.image IS 'A reference to the image';

COMMENT ON COLUMN course_temp.promoted IS 'Promoted courses are intended to be listed higher than others. At time of writing, this data could not practically be acquired from the Docebo API';

COMMENT ON COLUMN course_temp.training_type IS 'Some text from Docebo indicating whether it is a webinar, classroom etc';

COMMENT ON COLUMN course_temp.description IS 'Text description from Docebo';

COMMENT ON TABLE course_catalogue IS 'Course Catalog';

COMMENT ON COLUMN course_catalogue.id IS 'Primary key';

COMMENT ON COLUMN course_catalogue.catalogue_id IS 'market';

COMMENT ON COLUMN course_catalogue.course_id IS 'fk';

COMMENT ON TABLE course_catalogue_temp IS 'Course Catalog temp table.  The course cataloogues from docebo are pulled into here first, before being merged into the course_catalogue table.';

COMMENT ON COLUMN course_catalogue_temp.id IS 'Primary key';

COMMENT ON COLUMN course_catalogue_temp.catalogue_id IS 'catalogue';

COMMENT ON COLUMN course_catalogue_temp.course_id IS 'course';

COMMENT ON TABLE course_enrollment IS 'Course Enrollments';

COMMENT ON COLUMN course_enrollment.id IS 'Primary key';

COMMENT ON COLUMN course_enrollment.user_id IS 'account';

COMMENT ON COLUMN course_enrollment.course_id IS 'fk';

COMMENT ON COLUMN course_enrollment.status IS 'status';

COMMENT ON COLUMN course_enrollment.url IS 'url';

COMMENT ON TABLE course_enrollment_temp IS 'Course Enrollments temp table.  Enrollements are brought in here from Docebo first, before being merged into the course_enrollemnt table';

COMMENT ON COLUMN course_enrollment_temp.id IS 'Primary key';

COMMENT ON COLUMN course_enrollment_temp.user_id IS 'account';

COMMENT ON COLUMN course_enrollment_temp.course_id IS 'course';

COMMENT ON COLUMN course_enrollment_temp.status IS 'status';

COMMENT ON COLUMN course_enrollment_temp.url IS 'url';

COMMENT ON TABLE course_sync_configuration IS 'Course Sync Configuration';

COMMENT ON COLUMN course_sync_configuration.id IS 'Primary key';

COMMENT ON COLUMN course_sync_configuration.config_name IS 'account';

COMMENT ON COLUMN course_sync_configuration.config_value IS 'course';

CREATE OR REPLACE FUNCTION update_modified_column ()
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
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_course_temp_updated_at
  BEFORE UPDATE ON course_temp
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_course_catalogue_updated_at
  BEFORE UPDATE ON course_catalogue
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_course_catalogue_temp_updated_at
  BEFORE UPDATE ON course_catalogue_temp
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_course_enrollment_updated_at
  BEFORE UPDATE ON course_enrollment
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_course_enrollment_temp_updated_at
  BEFORE UPDATE ON course_enrollment_temp
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();

CREATE TRIGGER set_course_sync_configuration_updated_at
  BEFORE UPDATE ON course_sync_configuration
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column ();
