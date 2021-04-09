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
const PERMISSION_DENIED = (table) => `permission denied for table ${table}`;
const RLS_ERROR = (table) =>
  `new row violates row-level security policy for table "${table}"`;

const INSTALLER_EMAIL = "installer@email.com";
const COMAPNY_ADMIN_EMAIL = "company@email.com";

const ROLE_INSTALLER = "installer";
const ROLE_COMPANY_ADMIN = "company_admin";
const ROLE_SUPER_ADMIN = "super_admin";

const COMPANY_MEMBER = 4;

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
  let installer_id;
  let company_admin_id;
  let company_id;
  afterAll(async () => {
    await transaction(
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

      it("should be able to create an account using the function create_user", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          null,
          "select * from create_user($1, $2, $3)",
          [INSTALLER_EMAIL, "name", "surname"]
        );
        expect(rows.length).toEqual(1);
        expect(rows[0].email).toEqual(INSTALLER_EMAIL);
        installer_id = rows[0].id;
      });
      it("shouldn't be able to see other accounts", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
          "select id from account",
          []
        );
        expect(rows.length).toEqual(1);
      });
    });
    describe("Company Admin", () => {
      it("should not be able to create an account directly", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          null,
          "insert into account (market_id, email) VALUES ($1, $2)",
          [1, COMAPNY_ADMIN_EMAIL]
        );
        expect(rows.length).toEqual(0);
      });
      it("should be able to create an account using the function create_user", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          null,
          "select * from create_user($1, $2, $3)",
          [COMAPNY_ADMIN_EMAIL, "name", "surname"]
        );
        expect(rows.length).toEqual(1);
        expect(rows[0].email).toEqual(COMAPNY_ADMIN_EMAIL);
      });
    });
  });

  describe("Company", () => {
    describe("Installer", () => {
      it("shouldn't be able to see any company if not member", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
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
      it("shouldn't be able to see a company if is a member", async () => {
        const USERID = 1;
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          USERID,
          ALL_COMPANIES,
          []
        );
        expect(rows.length).toEqual(0);
      });
      it("should be able to see a company if is a member", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          COMPANY_MEMBER,
          ALL_COMPANIES,
          []
        );
        expect(rows.length).toEqual(1);
        company_admin_id = rows[0].id;
      });
      it("should be able to create a company", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          COMPANY_MEMBER,
          "insert into company (name, market_id) VALUES ($1, $2) RETURNING *",
          ["My company name", 1]
        );
        expect(rows.length).toEqual(1);
        company_id = rows[0].id;
      });
    });
  });

  describe("CompanyMemebr", () => {
    describe("Installer", () => {
      it("shouldn't be able to add himself in a company", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into company_member (account_id, company_id, market_id) VALUES($1, $2, $3) RETURNING *",
            [installer_id, 1, 1]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("company_member"));
        }
      });
    });
    describe("Company Admin", () => {
      it("shouldn't be able to add a user to a company where is not a member", async () => {
        try {
          await transaction(
            ROLE_COMPANY_ADMIN,
            company_admin_id,
            "insert into company_member (account_id, company_id) VALUES($1, $2) RETURNING *",
            [installer_id, 1]
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("company_member"));
        }
      });
      it("should be able to add a user to a company where is a member", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          company_admin_id,
          "insert into company_member (account_id, company_id, market_id) VALUES($1, $2, $3) RETURNING *",
          [installer_id, company_id, 1]
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
