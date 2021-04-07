import { config } from "dotenv";
import { Pool } from "pg";

config();

const { PG_USER, PASSWORD, HOST, DATABASE, PG_PORT } = process.env;

const pool = new Pool({
  user: PG_USER,
  password: PASSWORD,
  port: +PG_PORT,
  host: HOST,
  database: DATABASE
});

const INSTALLER_EMAIL = "installer@email.com";
const COMAPNY_ADMIN_EMAIL = "company@email.com";

const ROLE_INSTALLER = "installer";
const ROLE_COMPANY_ADMIN = "company_admin";
const ROLE_SUPER_ADMIN = "super_admin";

const COMPANY_MEMBER = 4;

const rlsError = (table) =>
  `new row violates row-level security policy for table "${table}"`;

const transaction = async (
  role: string,
  accountUuid: number,
  query: string,
  params: any = []
) => {
  await pool.query("BEGIN");
  if (accountUuid) {
    await pool.query(`SET LOCAL app.current_account TO '${accountUuid}'`);
  }
  await pool.query(`SET LOCAL ROLE TO '${role}'`);
  const res = await pool.query(query, params);
  await pool.query("COMMIT");
  return res;
};

const ALL_COMPANIES = `SELECT * FROM company`;

describe("Database permissions", () => {
  afterAll(async () => {
    const { rows } = await transaction(
      ROLE_SUPER_ADMIN,
      null,
      "delete from account where email = $1 OR email = $2",
      [INSTALLER_EMAIL, COMAPNY_ADMIN_EMAIL]
    );
    pool.end();
  });

  describe("Account", () => {
    describe("Installer", () => {
      it("should not be able to create an account directly", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          null,
          "insert into account (market_id, email) VALUES ($1, $2)",
          [1, INSTALLER_EMAIL]
        );
        expect(rows.length).toEqual(0);
      });
      it("should be able to create an account", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          null,
          "select * from create_user($1, $2)",
          [INSTALLER_EMAIL, "name", "surname"]
        );
        expect(rows.length).toEqual(0);
      });
      it("shouldn't be able to see other accounts", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          null,
          "select id from account",
          []
        );
        expect(rows.length).toEqual(1);
        expect(rows[0].email).toEqual(INSTALLER_EMAIL);
      });
    });
    describe("Company Admin", () => {
      it("should not be able to create an account directly", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          null,
          "select * from create_user($1, $2)",
          [INSTALLER_EMAIL, "name", "surname"]
        );
        expect(rows.length).toEqual(0);
      });
    });
  });

  describe("Company", () => {
    describe("Installer", () => {
      it("shouldn't be able to see any company if not member", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          1,
          ALL_COMPANIES,
          []
        );
        expect(rows.length).toEqual(0);
      });
      it("should be able to see any company if member", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          COMPANY_MEMBER,
          ALL_COMPANIES,
          []
        );
        expect(rows.length).toEqual(1);
      });
    });

    describe("Company Admin", () => {
      it("should'nt be able to see a company it is a member", async () => {
        const USERID = 1;
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          USERID,
          ALL_COMPANIES,
          []
        );
        expect(rows.length).toEqual(0);
      });
      it("should be able to see a company it is a member", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          COMPANY_MEMBER,
          ALL_COMPANIES,
          []
        );
        expect(rows.length).toEqual(1);
      });
    });
  });

  // describe("Product", () => {
  //   const ALL_PRODUCTS = `SELECT * FROM company`;
  //   describe("Installer", () => {
  //     it("should be able to the products of his market", async () => {
  //       const { rows } = await transaction(
  //         ROLE_INSTALLER,
  //         COMPANY_MEMBER,
  //         ALL_PRODUCTS,
  //         []
  //       );
  //       expect(rows.length).toEqual(1);
  //     });
  //   });
  // });
});
