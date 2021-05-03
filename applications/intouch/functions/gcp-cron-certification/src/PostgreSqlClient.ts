import { Pool } from "pg";

const executeQuery = async (query) => {
  const pool = new Pool();
  const { rows } = await pool.query(query);
  pool.end();

  return rows;
};
const getDoceboUsers = async () => {
  const query =
    "select docebo_user_id from account where docebo_user_id is not null";
  const doceboUserIds = await executeQuery(query);
  return doceboUserIds.map((doceboUser) => `${doceboUser.docebo_user_id}`);
};
export const insertCertification = async (certifications) => {
  const table = "certification";

  const accountDoceboUserIds = await getDoceboUsers();

  //filter certifications by accountDoceboUserIds
  const insertScript = certifications
    .filter(({ userId }) => accountDoceboUserIds.includes(userId))
    .map(
      ({ userId, code, title, to_renew_in }) =>
        `INSERT INTO ${table} (docebo_user_id,technology,name,expiry_date) VALUES (${userId},'${code}','${title}','${to_renew_in}');`
    )
    .join("\n");

  if (insertScript) {
    const query = `TRUNCATE TABLE ${table}; ${insertScript}`;
    executeQuery(query);
  }
};
