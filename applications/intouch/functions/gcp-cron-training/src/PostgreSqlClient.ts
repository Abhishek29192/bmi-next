import { Pool } from "pg";

const executeQuery = async (query) => {
  const pool = new Pool();
  const { rows } = await pool.query(query);
  pool.end();

  return rows;
};

export const getLastUpdateDate = async () => {
  let query = `select config_value from course_sync_configuration where config_name='last_update_date'`;

  const [result] = await executeQuery(query);

  const last_update_date = new Date(+result.config_value)
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

  return last_update_date;
};
export const updateLastUpdateDate = async (lastUpdateDate) => {
  let query = `UPDATE course_sync_configuration 
  SET 
  config_value='${lastUpdateDate}'
  WHERE config_name='last_update_date'`;

  await executeQuery(query);
};
export const updateCources = async (courses) => {
  if (courses.length > 0) {
    await updateCourseTemp(courses);
    await updateCourse();
  }
};
export const updateEnrollments = async (enrollments) => {
  if (enrollments.length > 0) {
    await updateCourseEnrollmentTemp(enrollments);
    await updateCourseEnrollment();
  }
};
export const updateCatalogs = async (catalogs) => {
  if (catalogs.length > 0) {
    await updateCourseCatalogTemp(catalogs);
    await updateCourseCatalog();
  }
};

const updateCourseTemp = async (courses) => {
  const table_name = "course_temp";
  const fields = [
    "course_id",
    "technology",
    "name",
    "image",
    "promoted",
    "training_type",
    "description"
  ];

  let query = `TRUNCATE TABLE ${table_name}; 
    INSERT INTO ${table_name} (${fields.toString()}) VALUES
    `;

  query += courses
    .map(
      ({
        course_id,
        technology,
        name,
        image,
        promoted,
        training_type,
        description
      }) =>
        ` (${course_id},'${technology}',
        '${name}','${image}',
        '${promoted}','${training_type}',
        '${description.replace(/'/g, '"')}')`
    )
    .join(",\n");

  await executeQuery(query);
};
const updateCourse = async () => {
  const query = "SELECT public.course_update_by_temp()";
  await executeQuery(query);
};
const updateCourseEnrollmentTemp = async (enrollments) => {
  const table_name = "course_enrollment_temp";
  const fields = ["user_id", "course_id", "status", "url"];

  let query = `TRUNCATE TABLE ${table_name}; 
    INSERT INTO ${table_name} (${fields.toString()}) VALUES
    `;

  query += enrollments
    .map(
      ({ user_id, course_id, status, url }) =>
        ` (${user_id},${course_id},'${status}','${url}')`
    )
    .join(",\n");

  await executeQuery(query);
};
const updateCourseEnrollment = async () => {
  const query = "SELECT public.course_enrollment_update_by_temp()";
  await executeQuery(query);
};
const updateCourseCatalogTemp = async (catalogs) => {
  const table_name = "course_catalogue_temp";
  const fields = ["catalogue_id", "course_id"];

  let query = `TRUNCATE TABLE ${table_name}; 
    INSERT INTO ${table_name} (${fields.toString()}) VALUES
    `;

  query += catalogs
    .map(({ catalogue_id, course_id }) => ` (${catalogue_id},${course_id})`)
    .join(",\n");

  await executeQuery(query);
};
const updateCourseCatalog = async () => {
  const query = "SELECT public.course_catalogue_update_by_temp()";
  await executeQuery(query);
};
