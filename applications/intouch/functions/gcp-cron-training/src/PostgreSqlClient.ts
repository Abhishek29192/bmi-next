import { Pool } from "pg";

const executeQuery = async (query) => {
  const pool = new Pool();
  const { rows } = await pool.query(query);
  pool.end();

  return rows;
};

export const getLastUpdateDate = async () => {
  //TODO: We nee to store this information
  return "2021-05-19 00:00:00";
};

export const insertCoursesToTempTable = async (courses) => {
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

  executeQuery(query);
};

export const updateCourse = async () => {
  const query = "SELECT public.course_update_by_temp()";
  executeQuery(query);
};
