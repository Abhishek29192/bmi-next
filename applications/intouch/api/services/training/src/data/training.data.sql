TRUNCATE TABLE course RESTART IDENTITY;

INSERT INTO course (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('1', 123, 'slug-1', 'PITCHED', 'Flexbox roofing methodology', 'https://picsum.photos/274/206', TRUE, 'classroom', 'Learn about the Echo roofing methodology in our fantastic Swindon training centre supported by Advanced empowering workforce techniques');

INSERT INTO course (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('2', 124, 'slug-2', 'FLAT', 'Sequel roofing methodology', 'https://picsum.photos/274/206', FALSE, 'classroom', 'Learn about the I roofing methodology in our fantastic Swindon training centre supported by Reduced composite algorithm techniques');

INSERT INTO course (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('3', 125, 'slug-3', 'OTHER', 'GCP roofing methodology', 'https://picsum.photos/274/206', FALSE, 'classroom', 'Learn about the XG350 roofing methodology in our fantastic Swindon training centre supported by Extended global frame techniques');

INSERT INTO course (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('4', 126, 'slug-4', 'PITCHED', 'LeMans roofing methodology', 'https://picsum.photos/274/206', FALSE, 'classroom', 'Learn about the LeMans roofing methodology in our fantastic Swindon training centre supported by Pre-emptive optimizing task-force techniques');

INSERT INTO course (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('5', 127, 'alug-5', 'PITCHED', 'Express 2500 roofing methodology', 'https://picsum.photos/274/206', FALSE, 'classroom', 'Learn about the Express 2500 roofing methodology in our fantastic Swindon training centre supported by Customizable static budgetary management techniques');

INSERT INTO course (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('6', 128, 'slug-6', 'OTHER', 'Legend roofing methodology', 'https://picsum.photos/274/206', FALSE, 'elearning', 'Learn about the Legend roofing methodology in our fantastic Swindon training centre supported by Grass-roots discrete policy techniques');

INSERT INTO course (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('7', 129, 'slug-7', 'OTHER', 'X5 roofing methodology', 'https://picsum.photos/274/206', FALSE, 'elearning', 'Learn about the X5 roofing methodology in our fantastic Swindon training centre supported by Multi-lateral impactful hub techniques');

INSERT INTO course (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('8', 130, 'slug-8', 'OTHER', 'Grand Cherokee roofing methodology', 'https://picsum.photos/274/206', FALSE, 'elearning', 'Learn about the Grand Cherokee roofing methodology in our fantastic Swindon training centre supported by Open-source systemic capability techniques');

INSERT INTO course (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('9', 131, 'slug-9', 'OTHER', 'Passat roofing methodology', 'https://picsum.photos/274/206', FALSE, 'elearning', 'Learn about the Passat roofing methodology in our fantastic Swindon training centre supported by Digitized intermediate benchmark techniques');

TRUNCATE TABLE course_temp RESTART IDENTITY;

INSERT INTO course_temp (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('1', 123, 'slug-1', 'PITCHED', 'Flexbox roofing methodology', 'https://picsum.photos/274/206', TRUE, 'classroom', 'Learn about the Echo roofing methodology in our fantastic Swindon training centre supported by Advanced empowering workforce techniques');

INSERT INTO course_temp (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('2', 124, 'slug-2', 'FLAT', 'Sequel roofing methodology', 'https://picsum.photos/274/206', FALSE, 'classroom', 'Learn about the I roofing methodology in our fantastic Swindon training centre supported by Reduced composite algorithm techniques');

INSERT INTO course_temp (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('3', 125, 'slug-3', 'OTHER', 'GCP roofing methodology', 'https://picsum.photos/274/206', FALSE, 'classroom', 'Learn about the XG350 roofing methodology in our fantastic Swindon training centre supported by Extended global frame techniques');

INSERT INTO course_temp (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('4', 126, 'slug-4', 'PITCHED', 'LeMans roofing methodology', 'https://picsum.photos/274/206', FALSE, 'classroom', 'Learn about the LeMans roofing methodology in our fantastic Swindon training centre supported by Pre-emptive optimizing task-force techniques');

INSERT INTO course_temp (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('5', 127, 'alug-5', 'PITCHED', 'Express 2500 roofing methodology', 'https://picsum.photos/274/206', FALSE, 'classroom', 'Learn about the Express 2500 roofing methodology in our fantastic Swindon training centre supported by Customizable static budgetary management techniques');

INSERT INTO course_temp (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('6', 128, 'slug-6', 'OTHER', 'Legend roofing methodology', 'https://picsum.photos/274/206', FALSE, 'elearning', 'Learn about the Legend roofing methodology in our fantastic Swindon training centre supported by Grass-roots discrete policy techniques');

INSERT INTO course_temp (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('7', 129, 'slug-7', 'OTHER', 'X5 roofing methodology', 'https://picsum.photos/274/206', FALSE, 'elearning', 'Learn about the X5 roofing methodology in our fantastic Swindon training centre supported by Multi-lateral impactful hub techniques');

INSERT INTO course_temp (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('8', 130, 'slug-8', 'OTHER', 'Grand Cherokee roofing methodology', 'https://picsum.photos/274/206', FALSE, 'elearning', 'Learn about the Grand Cherokee roofing methodology in our fantastic Swindon training centre supported by Open-source systemic capability techniques');

INSERT INTO course_temp (id, course_id, slug, technology, name, image, promoted, training_type, description)
  VALUES ('9', 131, 'slug-9', 'OTHER', 'Passat roofing methodology', 'https://picsum.photos/274/206', FALSE, 'elearning', 'Learn about the Passat roofing methodology in our fantastic Swindon training centre supported by Digitized intermediate benchmark techniques');

TRUNCATE TABLE course_catalogue RESTART IDENTITY;

INSERT INTO course_catalogue (id, catalogue_id, course_id)
  VALUES ('1', 345, 123);

TRUNCATE TABLE course_catalogue_temp RESTART IDENTITY;

INSERT INTO course_catalogue_temp (id, catalogue_id, course_id)
  VALUES ('1', 987, 123);

TRUNCATE TABLE course_enrollment RESTART IDENTITY;

INSERT INTO course_enrollment (id, user_id, course_id, status, url)
  VALUES ('1', 987, 123, 'enrolled', 'url');

TRUNCATE TABLE course_enrollment_temp RESTART IDENTITY;

TRUNCATE TABLE course_sync_configuration RESTART IDENTITY;

INSERT INTO course_sync_configuration (id, config_name, config_value)
  VALUES ('1', 'last_update_date', '1578492981760');

SELECT
  SETVAL('course_id_seq', (
      SELECT
        MAX(ID)
      FROM course));

SELECT
  SETVAL('course_temp_id_seq', (
      SELECT
        MAX(ID)
      FROM course_temp));

SELECT
  SETVAL('course_catalogue_id_seq', (
      SELECT
        MAX(ID)
      FROM course_catalogue));

SELECT
  SETVAL('course_catalogue_temp_id_seq', (
      SELECT
        MAX(ID)
      FROM course_catalogue_temp));

SELECT
  SETVAL('course_enrollment_id_seq', (
      SELECT
        MAX(ID)
      FROM course_enrollment));

SELECT
  SETVAL('course_enrollment_temp_id_seq', (
      SELECT
        MAX(ID)
      FROM course_enrollment_temp));

SELECT
  SETVAL('course_sync_configuration_id_seq', (
      SELECT
        MAX(ID)
      FROM course_sync_configuration));

