ALTER TABLE course
  ADD UNIQUE (course_id);

ALTER TABLE course_catalogue
  ADD UNIQUE (catalogue_id, course_id);

ALTER TABLE course_enrollment
  ADD UNIQUE (user_id, course_id);

ALTER TABLE course_sync_configuration
  ADD UNIQUE (config_name);

ALTER TABLE course_catalogue
  ADD FOREIGN KEY (course_id) REFERENCES course (course_id) ON DELETE CASCADE;

CREATE INDEX ON course_catalogue (course_id);

ALTER TABLE course_enrollment
  ADD FOREIGN KEY (course_id) REFERENCES course (course_id) ON DELETE CASCADE;

CREATE INDEX ON course_enrollment (course_id);

