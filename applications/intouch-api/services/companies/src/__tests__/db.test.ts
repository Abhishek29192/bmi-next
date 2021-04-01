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

const USER_EMAIL = "email@email.com";
const ROLE_INSTALLER = "installer";
const ROLE_COMPANY_ADMIN = "company_admin";
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
  afterAll(async () => pool.end());

  describe("Account", () => {
    describe("Installer", () => {
      it("should be able to create an account", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          null,
          "insert into account (market_id, email) VALUES ($1, $2) returning id",
          [1, USER_EMAIL]
        );
        expect(rows.length).toEqual(1);
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

  describe("Company Document", () => {
    describe("Installer", () => {
      it("should be able to see any company if member", async () => {
        // const { rows } = await transaction(
        //   ROLE_INSTALLER,
        //   COMPANY_MEMBER,
        //   ALL_COMPANIES,
        //   []
        // );
        // expect(rows.length).toEqual(1);
      });
    });
  });
});
