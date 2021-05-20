
-- Function to update courses by temp table
CREATE OR REPLACE FUNCTION course_update_by_temp()
  RETURNS int
  AS $$
  
  UPDATE course
SET 
    technology=subquery.technology,
    name=subquery.name,
    image=subquery.image,
    promoted=subquery.promoted,
    training_type=subquery.description
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
volatile
