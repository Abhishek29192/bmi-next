
-- Function to update courses by temp table
CREATE OR REPLACE FUNCTION course_update_by_temp()
  RETURNS bigint
  AS $$
  
  UPDATE course
SET 
    technology=subquery.technology,
    name=subquery.name,
    image=subquery.image,
    promoted=subquery.promoted,
    training_type=subquery.training_type,
    description=subquery.description,
FROM (SELECT 
course_id,technology,name,image,promoted,training_type,description 
FROM  course_temp) AS subquery
WHERE course.course_id=subquery.course_id;

INSERT INTO course(course_id,technology,name,image,promoted,training_type,description)
SELECT 
ct.course_id,ct.technology,ct.name,ct.image,ct.promoted,ct.training_type,ct.description 
FROM  course_temp ct  
LEFT OUTER JOIN course c ON (c.course_id = ct.course_id)
WHERE c.course_id IS NULL;

select count(*) as course_count from course_temp;

$$
LANGUAGE sql
volatile;

-- Function to update course enrollments by temp table
CREATE OR REPLACE FUNCTION course_enrollment_update_by_temp()
  RETURNS bigint
  AS $$
  
  UPDATE course_enrollment
SET 
    user_id=subquery.user_id,
    course_id=subquery.course_id,
    status=subquery.status,
    url=subquery.url
FROM (SELECT 
user_id,course_id,status,url
FROM  course_enrollment_temp) AS subquery
WHERE (course_enrollment.user_id = subquery.user_id and course_enrollment.course_id = subquery.course_id);

INSERT INTO course_enrollment(user_id,course_id,status,url)
SELECT 
ct.user_id,ct.course_id,ct.status,ct.url
FROM  course_enrollment_temp ct  
LEFT OUTER JOIN course_enrollment c ON (c.user_id = ct.user_id and c.course_id = ct.course_id)
WHERE c.course_id IS NULL;

select count(*) as course_enrollment_count from course_enrollment_temp;

$$
LANGUAGE sql
volatile;

CREATE OR REPLACE FUNCTION course_catalogue_update_by_temp()
  RETURNS bigint
  AS $$
  
  DELETE FROM course_catalogue c
WHERE not EXISTS
  (SELECT 1
    FROM course_catalogue_temp ct
    WHERE (c.catalogue_id = ct.catalogue_id and c.course_id = ct.course_id)
     );
  
INSERT INTO course_catalogue(catalogue_id,course_id)
SELECT 
ct.catalogue_id,ct.course_id
FROM  course_catalogue_temp ct  
LEFT OUTER JOIN course_catalogue c ON (c.catalogue_id = ct.catalogue_id and c.course_id = ct.course_id)
WHERE c.course_id IS NULL;

select count(*) as course_enrollment_count from course_catalogue_temp;

$$
LANGUAGE sql
volatile;
