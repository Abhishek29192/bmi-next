import { resolve } from "path";
import { config } from "dotenv";
import { Pool } from "pg";

config({
  path: resolve(__dirname, "../../.env")
});

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
const COMPANY_ADMIN_EMAIL = "company@email.com";

const ROLE_INSTALLER = "installer";
const ROLE_COMPANY_ADMIN = "company_admin";
const ROLE_SUPER_ADMIN = "super_admin";
const ROLE_MARKET_ADMIN = "market_admin";

const MARKET_ID = 1;

const transaction = async (
  role: string,
  accountUuid: number,
  query: string,
  params: any = []
) => {
  await pool.query("BEGIN");
  if (accountUuid) {
    await pool.query(`SET LOCAL app.current_account_id TO '${accountUuid}'`);
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
  let evicence_item_id;
  let market_id;
  let system_id;
  let product_id;
  let market_admin_id;

  const cleanDbFromTests = async () => {
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
        COMPANY_ADMIN_EMAIL
      ]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("error", error.message);
    }
  };

  afterAll(async () => {
    // await cleanDbFromTests();
    pool.end();
  });

  beforeAll(async () => {
    await transaction(
      ROLE_SUPER_ADMIN,
      0,
      "insert into market (name) VALUES ($1) RETURNING *",
      ["Name"]
    );
    const { rows: marketAdmin } = await transaction(
      ROLE_SUPER_ADMIN,
      0,
      "insert into account (market_id, role, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id",
      [MARKET_ID, "MARKET_ADMIN", "Market", "Admin"]
    );

    market_admin_id = marketAdmin[0].id;
  });

  describe("Account", () => {
    describe("Installer", () => {
      it("should not be able to create an account directly", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            null,
            "insert into account (market_id, email) VALUES ($1, $2)",
            [MARKET_ID, INSTALLER_EMAIL]
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("account"));
        }
      });

      it("should be able to create an account using the function create_account", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          null,
          "select * from create_account($1, $2, $3, $4, $5)",
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
          "select * from account",
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
            [MARKET_ID, COMPANY_ADMIN_EMAIL]
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("account"));
        }
      });
      it("should be able to create an account and a company using the function create_account", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          null,
          "select * from create_account($1, $2, $3, $4, $5)",
          [COMPANY_ADMIN_EMAIL, "name", "surname", 1, "COMPANY_ADMIN"]
        );

        expect(rows.length).toEqual(1);
        expect(rows[0].email).toEqual(COMPANY_ADMIN_EMAIL);

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

  describe("Company Address", () => {
    describe("Installer", () => {
      it("shouldn't be able to add an address", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into address (company_id, first_line) VALUES($1, $2) RETURNING *",
            [company_id, "First line"]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("address"));
        }
      });
    });
    describe("Company Admin", () => {
      it("should be able to add an address to his company", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          installer_id,
          "insert into address (company_id, first_line) VALUES($1, $2) RETURNING *",
          [company_id, "First line"]
        );
        expect(rows.length).toEqual(1);
      });
      it("shouldn't be able to add an address to another company", async () => {
        try {
          await transaction(
            ROLE_COMPANY_ADMIN,
            installer_id,
            "insert into address (company_id, first_line) VALUES($1, $2) RETURNING *",
            [1, "First line"]
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("address"));
        }
      });
    });
  });

  describe("Company Member", () => {
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

  describe("Company Document", () => {
    describe("Company Admin", () => {
      it("shouldn't be able to add a company to another company", async () => {
        try {
          await transaction(
            ROLE_COMPANY_ADMIN,
            installer_id,
            "insert into company_document (company_id) VALUES($1) RETURNING *",
            [1]
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("company_document"));
        }
      });
      it("should be able to add a company to his company", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          installer_id,
          "insert into company_document (company_id) VALUES($1) RETURNING *",
          [company_id]
        );
        expect(rows.length).toEqual(1);
      });
    });

    describe("Installer", () => {
      it("shouldn't be able to create a certification", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into company_document (company_id) VALUES($1) RETURNING *",
            [company_id]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("company_document"));
        }
      });
      it("shouldn't be able to read a certification of another company", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "select * from company_document",
            []
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("company_document"));
        }
      });
      it("should be able to read a certification of his company", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
          "select * from company_document",
          []
        );

        expect(rows.length).toEqual(1);
      });
    });
  });

  describe("Project", () => {
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
      it("should be able to add an installer to the project", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          company_admin_id,
          "insert into project_member (project_id, account_id) values ($1, $2) returning *",
          [project_id, installer_id]
        );
        expect(rows.length).toEqual(1);
      });
    });
    describe("Installer", () => {
      it("shouldn't be able to see any project", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
          "select * from project where company_id != (select * from current_company())",
          []
        );
        expect(rows.length).toEqual(0);
      });

      it("shouldn't be able to add an installer to the project", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into project_member (project_id, account_id) values ($1, $2) returning *",
            [project_id, installer_id]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("project_member"));
        }
      });

      it("should be able to remove himself from the project", async () => {
        const { rows: deletedRows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
          "delete from project_member where account_id = $1 returning id",
          [installer_id]
        );
        expect(deletedRows.length).toEqual(1);

        // Recrete the user for next tests
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          company_admin_id,
          "insert into project_member (project_id, account_id) values ($1, $2) returning *",
          [project_id, installer_id]
        );
        expect(rows.length).toEqual(1);
      });
    });
  });

  describe("Guarantee", () => {
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
    describe("Installer", () => {
      it("shouldn't be able to create any guarantee", async () => {
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
      it("should be able to select a guarantee of his company", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
          "select * from guarantee",
          []
        );
        expect(rows.length).toEqual(1);
      });
    });
  });

  describe("Evidence Items", () => {
    describe("Company admin", () => {
      it("should be able to add an evidence item", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          company_admin_id,
          "insert into evidence_item (guarantee_id, name) VALUES($1, $2) RETURNING *",
          [guarantee_id, "Name"]
        );
        expect(rows.length).toEqual(1);
        evicence_item_id = rows[0].id;
      });
    });
    describe("Installer", () => {
      it("shouldn't be able to create any guarantee", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into evidence_item (guarantee_id, name) VALUES($1, $2) RETURNING *",
            [evicence_item_id, "Name"]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("evidence_item"));
        }
      });
      it("should be able to select an evidence item if member of a project", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
          "select * from evidence_item",
          []
        );
        expect(rows.length).toEqual(1);
      });
      it("shouldn't be able to select an evidence item if not member of a project", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            1,
            "select * from evidence_item",
            []
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("evidence_item"));
        }
      });
    });
  });

  describe("Guarantee Product", () => {
    describe("Company admin", () => {
      it("should be able to add a product", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          company_admin_id,
          "insert into guaranteed_product (guarantee_id) VALUES($1) RETURNING *",
          [guarantee_id]
        );
        expect(rows.length).toEqual(1);
        evicence_item_id = rows[0].id;
      });
    });
    describe("Installer", () => {
      it("shouldn't be able to create a product", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into guaranteed_product (guarantee_id) VALUES($1) RETURNING *",
            [evicence_item_id]
          );
        } catch (error) {
          expect(error.message).toEqual(
            PERMISSION_DENIED("guaranteed_product")
          );
        }
      });
      it("should be able to select a product if member of a project", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
          "select * from guaranteed_product",
          []
        );
        expect(rows.length).toEqual(1);
      });
      it("shouldn't be able to select a product item if not member of a project", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            1,
            "select * from guaranteed_product",
            []
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("guaranteed_product"));
        }
      });
    });
  });

  describe("Market", () => {
    describe("Super Admin", () => {
      it("should be able to create and read a market", async () => {
        const { rows } = await transaction(
          ROLE_SUPER_ADMIN,
          0,
          "insert into market (name) VALUES ($1) RETURNING *",
          ["Name"]
        );
        expect(rows.length).toEqual(1);
        market_id = rows[0].id;
      });
    });
    describe("Installer", () => {
      it("shouldn't be able to add a new market", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into market (name) VALUES ($1)",
            ["Name"]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("market"));
        }
      });
      it("should be able to read his market", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
          "select * from market where id = $1",
          [MARKET_ID]
        );
        expect(rows.length).toEqual(1);
      });
      it("shouldn't be able to read a market if not registered in that market", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
          "select * from market where id = $1",
          [market_id]
        );
        expect(rows.length).toEqual(0);
      });
    });

    describe("Company Admin", () => {
      it("shouldn't be able to add a new market", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into market (name) VALUES ($1)",
            ["Name"]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("market"));
        }
      });
    });
    describe("Market Admin", () => {
      it("shouldn't be able to add a new market", async () => {
        try {
          await transaction(
            ROLE_MARKET_ADMIN,
            0,
            "insert into market (name) VALUES ($1)",
            ["Name"]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("market"));
        }
      });
    });
  });

  describe("Product", () => {
    describe("Market Admin", () => {
      it("should be able to create and read a product", async () => {
        const { rows } = await transaction(
          ROLE_MARKET_ADMIN,
          market_admin_id,
          "insert into product (name, market_id) VALUES ($1, $2) RETURNING *",
          ["Name", MARKET_ID]
        );
        expect(rows.length).toEqual(1);
        product_id = rows[0].id;
      });
      it("shouldn't be able to create and read a product", async () => {
        try {
          await transaction(
            ROLE_MARKET_ADMIN,
            market_admin_id,
            "insert into product (name, market_id) VALUES ($1, $2) RETURNING *",
            ["Name", 2]
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("product"));
        }
      });
    });
  });

  describe("System", () => {
    describe("Super Admin", () => {
      it("should be able to create and read a system", async () => {
        const { rows } = await transaction(
          ROLE_SUPER_ADMIN,
          0,
          "insert into system (name, market_id) VALUES ($1, $2) RETURNING *",
          ["Name", MARKET_ID]
        );
        expect(rows.length).toEqual(1);
        system_id = rows[0].id;
      });
    });
    describe("Installer", () => {
      it("shouldn't be able to add a new market", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into market (name) VALUES ($1)",
            ["Name"]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("market"));
        }
      });
    });
  });

  describe("System Member", () => {
    describe("Market Admin", () => {
      it("should be able to create and read a system_member", async () => {
        const { rows } = await transaction(
          ROLE_SUPER_ADMIN,
          0,
          "insert into system_member (system_id, product_id) VALUES ($1, $2) RETURNING *",
          [system_id, product_id]
        );
        expect(rows.length).toEqual(1);
      });
    });
  });

  describe("Notification", () => {
    beforeAll(async () => {
      await pool.query(
        "insert into notification (account_id, send_date, unread, body) VALUES ($1, $2, $3, $4) RETURNING *",
        [
          installer_id,
          new Date(),
          true,
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
        ]
      );
    });

    describe("Installer", () => {
      it("should not be able to add notifications", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into notification (account_id, send_date, unread, body) VALUES ($1, $2, $3, $4) RETURNING *",
            [
              installer_id,
              new Date(),
              true,
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
            ]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("notification"));
        }
      });
      it("should be able to read notifications", async () => {
        const { rows } = await transaction(
          ROLE_INSTALLER,
          installer_id,
          "update notification set unread=$2 where account_id=$1 RETURNING *",
          [installer_id, false]
        );
        expect(rows[0].unread).toEqual(false);
      });
    });
  });

  describe("Invitation", () => {
    describe("Company Admin", () => {
      it("should be able to send an invitation", async () => {
        const { rows } = await transaction(
          ROLE_COMPANY_ADMIN,
          company_admin_id,
          "insert into invitation (sender_account_id, invitee, personal_note) VALUES ($1, $2, $3) RETURNING *",
          [
            company_admin_id,
            "email@email.com",
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
          ]
        );

        expect(rows.length).toEqual(1);
      });
    });
    describe("Installer", () => {
      it("shouldn't be able to send an invitation", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into invitation (sender_account_id, invitee, personal_note) VALUES ($1, $2, $3) RETURNING *",
            [
              installer_id,
              "email@email.com",
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
            ]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("invitation"));
        }
      });
    });
  });

  describe("Note", () => {
    describe("Market Admin", () => {
      it("should be able to add a note", async () => {
        const { rows } = await transaction(
          ROLE_MARKET_ADMIN,
          market_admin_id,
          "insert into note (body, author_id, project_id) VALUES ($1, $2, $3) RETURNING *",
          [
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
            market_admin_id,
            project_id
          ]
        );
        expect(rows.length).toEqual(1);
      });
    });
    describe("Company Admin", () => {
      it("shouldn't be able to add a note", async () => {
        try {
          await transaction(
            ROLE_COMPANY_ADMIN,
            company_admin_id,
            "insert into note (body, author_id, project_id) VALUES ($1, $2, $3) RETURNING *",
            [
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
              company_admin_id,
              project_id
            ]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("note"));
        }
      });
    });
    describe("Installer", () => {
      it("shouldn't be able to add a note", async () => {
        try {
          await transaction(
            ROLE_INSTALLER,
            installer_id,
            "insert into note (body, author_id, project_id) VALUES ($1, $2, $3) RETURNING *",
            [
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
              installer_id,
              project_id
            ]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("note"));
        }
      });
    });
  });
});
