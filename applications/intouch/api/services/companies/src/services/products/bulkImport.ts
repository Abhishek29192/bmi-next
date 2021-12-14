import * as csv from "fast-csv";
import pgFormat from "pg-format";
import camelcaseKeys from "camelcase-keys";
import { PostGraphileContext } from "../../types";
import { validateItems, validateProductsAndSystems } from "./validation";

const PRODUCTS_FILE = "products.csv";
const SYSTEMS_FILE = "systems.csv";
const SYSTEM_MEMBER_FILE = "system_member.csv";

export const singleImport = async (file) =>
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

const getProducts = async (market: string, pgClient: any) => {
  const { rows = [] } = await pgClient.query(
    "select * from product where market_id = $1",
    [market]
  );
  return rows.reduce(
    (result, item) => ({
      ...result,
      [item.bmi_ref]: item
    }),
    []
  );
};

const getSystems = async (market: string, pgClient: any) => {
  const { rows = [] } = await pgClient.query(
    "select * from system where market_id = $1",
    [market]
  );
  return rows.reduce(
    (result, item) => ({
      ...result,
      [item.bmi_ref]: item
    }),
    []
  );
};

export const bulkImport = async (args, context: PostGraphileContext) => {
  const { pgClient, user } = context;
  const { APP_ENV } = process.env;
  const { input } = args;
  const logger = context.logger("product:import");
  const files = await input.files;

  let products = [];
  let systems = [];
  let systemMember = [];

  const systemMemberToInsert = [];
  const systemsToInsert = [];
  const productsToInsert = [];
  const systemsToUpdate = [];
  const productsToUpdate = [];

  if (
    !user.can("import:products:market") &&
    !user.can("import:products:markets")
  ) {
    throw new Error("unauthorized");
  }

  for await (let file of files) {
    const { filename, ...f } = await file;

    const [env, marketCode, table] = filename.split("-");

    if (!env || !marketCode || !table) {
      throw new Error("filename_wrong_format");
    }

    if (env !== APP_ENV) {
      throw new Error(`wrong_env`);
    }

    if (
      user.can("import:products:market") &&
      !user.can("import:products:markets") &&
      marketCode !== user.market.domain
    ) {
      throw new Error("unauthorized");
    }

    const { rows } = await pgClient.query(
      "select id from market where domain = $1",
      [marketCode]
    );

    if (!rows.length) {
      throw new Error("market_not_found");
    }

    const marketId = rows[0].id;
    const parsedFile: any[] = await singleImport({ filename, ...f });

    if (filename.indexOf(SYSTEM_MEMBER_FILE) !== -1) {
      systemMember = parsedFile.map((item) => {
        const systemMember = {
          system_bmi_ref: item.system_bmi_ref,
          product_bmi_ref: item.product_bmi_ref,
          market_id: marketId
        };
        systemMemberToInsert.push(camelcaseKeys(systemMember));
        return systemMember;
      });
    } else if (filename.indexOf(SYSTEMS_FILE) !== -1) {
      const currentSystems = await getSystems(marketId, pgClient);

      systems = parsedFile.map((item) => {
        if (currentSystems[item.bmi_ref]) {
          systemsToUpdate.push(camelcaseKeys(item));
        } else {
          systemsToInsert.push(camelcaseKeys(item));
        }

        return {
          market_id: marketId,
          technology: item.technology,
          bmi_ref: item.bmi_ref,
          name: item.name,
          description: item.description,
          maximum_validity_years: parseInt(item.maximum_validity_years),
          published:
            item.published === true ||
            item.published?.toLowerCase() === "true" ||
            item.published === "1"
        };
      });
    } else if (filename.indexOf(PRODUCTS_FILE) !== -1) {
      const currentProducts = await getProducts(marketId, pgClient);

      products = parsedFile.map((item) => {
        if (currentProducts[item.bmi_ref]) {
          productsToUpdate.push(camelcaseKeys(item));
        } else {
          productsToInsert.push(camelcaseKeys(item));
        }

        return {
          market_id: marketId,
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

  const errorSystemsToUpdate = validateItems(systemsToUpdate, "SYSTEM");
  const errorSystemsToInsert = validateItems(systemsToInsert, "SYSTEM");
  const errorProductsToUpdate = validateItems(productsToUpdate, "PRODUCT");
  const errorProductsToInsert = validateItems(productsToInsert, "PRODUCT");
  const errorSystemMembersInsert = validateProductsAndSystems(
    systemMemberToInsert,
    productsToInsert,
    systemsToInsert
  );

  logger.info(
    `Importing ${systems.length} systems, ${products.length} products, and ${systemMember.length} system_member`
  );

  if (input.dryRun) {
    return {
      systemsToUpdate,
      systemsToInsert,
      productsToUpdate,
      productsToInsert,
      errorSystemsToUpdate,
      errorSystemsToInsert,
      errorProductsToUpdate,
      errorProductsToInsert,
      errorSystemMembersInsert
    };
  }

  await pgClient.query("SAVEPOINT graphql_mutation");

  // System
  try {
    const { rows } = await pgClient.query(
      pgFormat(
        `INSERT INTO system (market_id, technology, bmi_ref, name, description, maximum_validity_years, published) VALUES %L 
          ON CONFLICT (bmi_ref) DO UPDATE SET 
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
        `INSERT INTO product (market_id, technology, bmi_ref, brand, name, description, family, published, maximum_validity_years ) VALUES %L
          ON CONFLICT (bmi_ref) DO UPDATE SET
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
        `INSERT INTO system_member (system_bmi_ref, product_bmi_ref, market_id) VALUES %L
          ON CONFLICT (system_bmi_ref, product_bmi_ref, market_id) DO UPDATE SET
          market_id = excluded.market_id,
          system_bmi_ref = excluded.system_bmi_ref,
          product_bmi_ref = excluded.product_bmi_ref RETURNING *;
        `,
        systemMember.map((item) => Object.values(item))
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

  // TODO: decide what we want to return
  return {
    systemsToUpdate,
    systemsToInsert,
    productsToUpdate,
    productsToInsert,
    errorSystemsToUpdate,
    errorSystemsToInsert,
    errorProductsToUpdate,
    errorProductsToInsert,
    errorSystemMembersInsert
  };
};
