import * as csv from "fast-csv";
import pgFormat from "pg-format";

const singleImport = async (file) =>
  new Promise<any[]>((resolve, reject) => {
    const result = [];
    const { createReadStream } = file;

    const stream = createReadStream();

    stream
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => reject(error))
      .on("data", (row) => {
        result.push(row);
      })
      .on("end", () => {
        return resolve(result);
      });
  });

export const bulkImport = async (args, context) => {
  const { pgClient } = context;
  const logger = context.logger("product:import");

  const files = await args.files;

  let products = [];
  let systems = [];
  let system_member = [];

  for await (let file of files) {
    const { filename, ...f } = await file;
    const parsedFile: any[] = await singleImport({ filename, ...f });

    if (filename.indexOf("system_member.csv") !== -1) {
      system_member = parsedFile.map((item) => {
        return {
          // id: item.id,
          system_bmi_ref: item.system_bmi_ref,
          product_bmi_ref: item.product_bmi_ref
        };
      });
    } else if (filename.indexOf("systems.csv") !== -1) {
      systems = parsedFile.map((item) => {
        return {
          // id: parseInt(item.id) || undefined,
          // market_id: parseInt(item.market_id) || undefined,
          technology: item.technology,
          bmi_ref: item.bmi_ref,
          name: item.name,
          description: item.description,
          maximum_validity_years: parseInt(item.maximum_validity_years),
          published:
            item.published?.toLowerCase() === "true" || item.published === "1"
        };
      });
    } else if (filename.indexOf("products.csv") !== -1) {
      products = parsedFile.map((item) => {
        return {
          // id: item.id,
          // market_id: item.market_id,
          technology: item.technology,
          bmi_ref: item.bmi_ref,
          brand: item.brand,
          name: item.name,
          description: item.description,
          family: item.family,
          published: item.published,
          maximum_validity_years: item.maximum_validity_years
        };
      });
    }
  }

  logger.info(
    `Importing ${systems.length} systems, ${products.length} products, and ${system_member.length} system_member`
  );

  await pgClient.query("SAVEPOINT graphql_mutation");

  // System
  try {
    const { rows } = await pgClient.query(
      pgFormat(
        `INSERT INTO system (technology, bmi_ref, name, description, maximum_validity_years, published) VALUES %L 
          ON CONFLICT (id) DO UPDATE SET 
            technology = excluded.technology,
            bmi_ref = excluded.bmi_ref,
            name = excluded.name,
            description = excluded.description,
            maximum_validity_years = excluded.maximum_validity_years,
            published = excluded.published RETURNING *;
          `,
        systems.map((item) => Object.values(item))
      )
    );

    logger.info(`${rows.length} systems imported`);
  } catch (error) {
    logger.error("System import failed:", error.stack);
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw error;
  }

  // Products
  try {
    const { rows } = await pgClient.query(
      pgFormat(
        `INSERT INTO product ( technology, bmi_ref, brand, name, description, family, published, maximum_validity_years ) VALUES %L
          ON CONFLICT (id) DO UPDATE SET
          technology = excluded.technology,
          bmi_ref = excluded.bmi_ref,
          brand = excluded.brand,
          name = excluded.name,
          description = excluded.description,
          family = excluded.family,
          published = excluded.published,
          maximum_validity_years = excluded.maximum_validity_years RETURNING *;
          `,
        products.map((item) => Object.values(item))
      )
    );

    logger.info(`${rows.length} products imported`);
  } catch (error) {
    logger.error("Products import failed:", error.stack);
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw error;
  }

  try {
    const { rows } = await pgClient.query(
      pgFormat(
        `INSERT INTO system_member (system_bmi_ref, product_bmi_ref) VALUES %L
          ON CONFLICT (id) DO UPDATE SET
          system_bmi_ref = excluded.system_bmi_ref,
          product_bmi_ref = excluded.product_bmi_ref RETURNING *;
        `,
        system_member.map((item) => Object.values(item))
      )
    );

    logger.info(`${rows.length} system members imported`);
  } catch (error) {
    logger.error("System Members import failed:", error.stack);
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw error;
  }

  await pgClient.query("RELEASE SAVEPOINT graphql_mutation");

  logger.info(`Import finished`);

  return args.files;
};
