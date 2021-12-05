import {
  getDbPool,
  actAs,
  curryContext,
  insertOne as dbInsertOne,
  RLS_ERROR,
  PERMISSION_DENIED
} from "../test-utils/db";

let pool;

const initDb = async (pool, client) => {
  const context = {
    pool,
    client,
    cleanupBucket: {}
  };
  const insertOne = curryContext(context, dbInsertOne);
  const market = await insertOne("market", {
    domain: "da",
    language: "da"
  });

  const superAdmin = await insertOne("account", {
    role: "SUPER_ADMIN",
    email: "somemail2@email.com",
    market_id: market.id
  });

  const marketAdmin = await insertOne("account", {
    role: "MARKET_ADMIN",
    email: "somemail3@email.com",
    market_id: market.id
  });

  const address = await insertOne("address", {
    first_line: "First Line",
    postcode: "postcode"
  });

  const company = await insertOne("company", {
    name: "Name 2",
    market_id: market.id,
    registered_address_id: address.id,
    trading_address_id: address.id
  });

  const companyAdmin = await insertOne("account", {
    role: "COMPANY_ADMIN",
    email: "somemail4@email.com",
    market_id: market.id
  });

  const installer = await insertOne("account", {
    role: "INSTALLER",
    email: "somemail5@email.com",
    market_id: market.id
  });

  const otherAddress = await insertOne("address", {
    first_line: "First Line",
    postcode: "postcode"
  });

  const otherCompany = await insertOne("company", {
    name: "Name 1",
    market_id: market.id,
    registered_address_id: otherAddress.id,
    trading_address_id: otherAddress.id
  });

  const otherCompanyAdmin = await insertOne("account", {
    role: "COMPANY_ADMIN",
    email: "somemail6@email.com",
    market_id: market.id
  });

  const otherInstaller = await insertOne("account", {
    role: "INSTALLER",
    email: "somemail7@email.com",
    market_id: market.id
  });

  const installerSolo = await insertOne("account", {
    role: "INSTALLER",
    email: "somemail8@email.com",
    market_id: market.id
  });

  await insertOne("company_member", {
    market_id: market.id,
    company_id: company.id,
    account_id: companyAdmin.id
  });
  await insertOne("company_member", {
    market_id: market.id,
    company_id: company.id,
    account_id: installer.id
  });
  await insertOne("company_member", {
    market_id: market.id,
    company_id: otherCompany.id,
    account_id: otherCompanyAdmin.id
  });
  await insertOne("company_member", {
    market_id: market.id,
    company_id: otherCompany.id,
    account_id: otherInstaller.id
  });

  return {
    insertOne,
    superAdmin,
    marketAdmin,
    company,
    companyAdmin,
    installer,
    installerSolo,
    otherCompany,
    otherCompanyAdmin,
    address,
    otherAddress,
    otherInstaller
  };
};

describe("Company Address", () => {
  beforeAll(async () => {
    pool = await getDbPool();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Installer", () => {
    // it("shouldn't be able to add an address", async () => {
    //   const client = await pool.connect();
    //   await client.query("BEGIN");

    //   try {
    //     const { installer, insertOne } = await initDb(pool, client);

    //     await actAs(client, installer);

    //     await insertOne("address", {
    //       first_line: "First Line"
    //     });
    //   } catch (error) {
    //     expect(error.message).toEqual(PERMISSION_DENIED("address"));
    //   } finally {
    //     await client.query("ROLLBACK");
    //     client.release();
    //   }
    // });

    it("should be able to see addresses if in the company", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { address, installer } = await initDb(pool, client);
        await actAs(client, installer);

        const { rows } = await client.query(
          "SELECT * FROM address WHERE id = $1",
          [address.id]
        );
        expect(rows).toHaveLength(1);
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });

    // it("shouldn't be able to see addresses if not in the company", async () => {
    //   const client = await pool.connect();
    //   await client.query("BEGIN");

    //   try {
    //     const { address, installerSolo } = await initDb(pool, client);
    //     await actAs(client, installerSolo);

    //     const { rows } = await client.query(
    //       "SELECT * FROM address WHERE id = $1",
    //       [address.id]
    //     );
    //     expect(rows).toHaveLength(0);
    //   } finally {
    //     await client.query("ROLLBACK");
    //     client.release();
    //   }
    // });
  });

  describe("Company Admin", () => {
    it("should be able to add an address", async () => {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        const { companyAdmin, insertOne } = await initDb(pool, client);

        await actAs(client, companyAdmin);

        const address = await insertOne("address", {
          first_line: "First Line",
          postcode: "postcode"
        });

        expect(address).not.toBeNull();
      } finally {
        await client.query("ROLLBACK");
        client.release();
      }
    });
  });
});
