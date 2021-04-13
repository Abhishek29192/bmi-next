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

const MARKET_ID = 1;

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
  let project_id;
  let guarantee_id;
  afterAll(async () => {
    try {
      await pool.query("delete from guarantee where id = $1", [guarantee_id]);
      await pool.query("delete from project where id = $1", [project_id]);
      await pool.query(
        "delete from company_member where account_id = $1 OR account_id=$2",
        [installer_id, company_admin_id]
      );
      await pool.query("delete from company where id = $1", [company_id]);
      await pool.query("delete from account where email = $1 OR email = $2", [
        INSTALLER_EMAIL,
        COMAPNY_ADMIN_EMAIL
      ]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("error", error.message);
    }
    pool.end();
  });

  describe("Account", () => {
    describe("Installer", () => {
      it("should not be able to create an account directly", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            null,
            "insert into account (market_id, email) VALUES ($1, $2)",
            [1, INSTALLER_EMAIL]
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("account"));
        }
      });

      it("should be able to create an account using the function create_user", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          null,
          "select * from create_user($1, $2, $3, $4, $5)",
          [INSTALLER_EMAIL, "name", "surname", 1, "INSTALLER"]
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
        try {
          await transaction(
            ROLE_COMPANY_ADMIN,
            null,
            "insert into account (market_id, email) VALUES ($1, $2)",
            [1, COMAPNY_ADMIN_EMAIL]
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("account"));
        }
      });
      it("should be able to create an account and a company using the function create_user", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          null,
          "select * from create_user($1, $2, $3, $4, $5)",
          [COMAPNY_ADMIN_EMAIL, "name", "surname", 1, "COMPANY_ADMIN"]
        );

        expect(rows.length).toEqual(1);
        expect(rows[0].email).toEqual(COMAPNY_ADMIN_EMAIL);

        company_admin_id = rows[0].id;

        const { rows: companies } = await transaction(
          ROLE_COMPANY_ADMIN,
          rows[0].id,
          "select * from company",
          []
        );
        expect(companies.length).toEqual(1);

        company_id = companies[0].id;

        const { rows: companiesMembers } = await transaction(
          ROLE_COMPANY_ADMIN,
          rows[0].id,
          "select * from company_member WHERE account_id = $1 AND company_id = $2",
          [company_admin_id, company_id]
        );
        expect(companiesMembers.length).toEqual(1);
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
      it("should be able to see a company if member", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          company_admin_id,
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
          company_admin_id,
          ALL_COMPANIES,
          []
        );
        expect(rows.length).toEqual(1);
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
            [installer_id, 1, MARKET_ID]
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
          [installer_id, company_id, MARKET_ID]
        );

        expect(rows.length).toEqual(1);
      });
    });
  });

  describe("Project", () => {
    describe("Installer", () => {
      it("shouldn't be able to any project", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
          "select * from project",
          []
        );
        expect(rows.length).toEqual(0);
      });
    });
    describe("Company admin", () => {
      it("should be able to add a project", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          company_admin_id,
          "insert into project (company_id, name) values ($1, $2) returning *",
          [company_id, "Project name"]
        );
        expect(rows.length).toEqual(1);
        project_id = rows[0].id;
      });
      it("shouldn't be able to add a project to another company", async () => {
        try {
          await transaction(
            ROLE_COMPANY_ADMIN,
            company_admin_id,
            "insert into project (company_id, name) values ($1, $2) returning *",
            [1, "Project name"]
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("project"));
        }
      });
    });
  });

  describe("Guarantee", () => {
    describe("Installer", () => {
      it("shouldn't be able to any guarantee", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into guarantee (requestor_account_id) VALUES($1)",
            [installer_id]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("guarantee"));
        }
      });
    });
    describe("Company admin", () => {
      it("should be able to add a guarantee", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          company_admin_id,
          "insert into guarantee (requestor_account_id, project_id) VALUES($1, $2) RETURNING *",
          [company_admin_id, project_id]
        );
        expect(rows.length).toEqual(1);
        guarantee_id = rows[0].id;
      });
      it("shouldn't be able to add a guarantee if included pdf", async () => {
        try {
          await transaction(
            ROLE_COMPANY_ADMIN,
            company_admin_id,
            "insert into guarantee (requestor_account_id, pdf, project_id) VALUES($1, $2, $3) RETURNING *",
            [company_admin_id, "my-pdf-url", project_id]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("guarantee"));
        }
      });
    });
  });
});
