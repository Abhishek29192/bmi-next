import { transaction, getDbPool } from "../test-utils/db";

const PERMISSION_DENIED = (table) => `permission denied for table ${table}`;
const RLS_ERROR = (table) =>
  `new row violates row-level security policy for table "${table}"`;

const INSTALLER_EMAIL = "installer@email.com";
const COMPANY_ADMIN_EMAIL = "company@email.com";
const SUPER_ADMIN_EMAIL = "company@email.com";
const MARKET_ADMIN_EMAIL = "company@email.com";

const ROLE_INSTALLER = "installer";
const ROLE_COMPANY_ADMIN = "company_admin";
const ROLE_SUPER_ADMIN = "super_admin";
const ROLE_MARKET_ADMIN = "market_admin";

let MARKET_ID;

const ALL_COMPANIES = `SELECT * FROM company`;

describe("Database permissions", () => {
  let pool;
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

  // NOTE: These functions help to workaround the interdependency issues with these tests
  // TODO: Refactor
  const DELETE_GLOBAL_PROJECT = async () => {
    await pool.query("delete from project where id = $1", [project_id]);
  };

  const RE_CREATE_GLOBAL_PROJECT = async () => {
    const { rows: projects } = await transaction(
      pool,
      {
        role: ROLE_COMPANY_ADMIN,
        accountUuid: company_admin_id,
        accountEmail: COMPANY_ADMIN_EMAIL
      },
      "insert into project (company_id, name, roof_area, building_owner_firstname, building_owner_lastname, start_date, end_date) values ($1, $2, $3, $4, $5, $6, $7) returning *",
      [
        company_id,
        "Project name",
        100,
        "Joe",
        "Doe",
        "2021-01-01",
        "2021-01-02"
      ]
    );
    project_id = projects[0].id;
  };

  const RE_CREATE_PROJECT_MEMBER = async () => {
    const { rows } = await transaction(
      pool,
      {
        role: ROLE_COMPANY_ADMIN,
        accountUuid: company_admin_id,
        accountEmail: COMPANY_ADMIN_EMAIL
      },
      "insert into project_member (project_id, account_id) values ($1, $2) returning *",
      [project_id, installer_id]
    );
    expect(rows.length).toEqual(1);
  };

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

  beforeAll(async () => {
    pool = await getDbPool();
    const { rows: markets } = await transaction(
      pool,
      {
        role: ROLE_SUPER_ADMIN,
        accountUuid: 0,
        accountEmail: SUPER_ADMIN_EMAIL
      },
      "insert into market (name, domain, projects_enabled) VALUES ($1, $2, $3) ON CONFLICT (domain) DO UPDATE SET name = excluded.name RETURNING *",
      ["English market", "en", true]
    );
    MARKET_ID = markets[0].id;
    const { rows: marketAdmin } = await transaction(
      pool,
      {
        role: ROLE_SUPER_ADMIN,
        accountUuid: 0,
        accountEmail: SUPER_ADMIN_EMAIL
      },
      "insert into account (market_id, role, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING RETURNING id",
      [MARKET_ID, "MARKET_ADMIN", "Market", "Admin", SUPER_ADMIN_EMAIL]
    );
    market_admin_id = marketAdmin[0].id;
  });

  afterAll(async () => {
    await cleanDbFromTests();
    await pool.end();
  });

  describe("Account", () => {
    describe("Installer", () => {
      it("should be able to create an account using the function create_account", async () => {
        const tuple = `null, 'NEW', null, 'INSTALLER', '${INSTALLER_EMAIL}', 'abc', 'abc', 'abc', '2021-06-10 00:00:39.348475', 5, 'abc', 'abc', 'abc', '2021-06-10 00:00:39.348475', '2021-06-10 00:00:39.348475'`;
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_INSTALLER,
            accountUuid: null,
            accountEmail: INSTALLER_EMAIL
          },
          `select * from create_account((${tuple}), $1)`,
          ["en"]
        );
        expect(rows.length).toEqual(1);
        expect(rows[0].email).toEqual(INSTALLER_EMAIL);
        installer_id = rows[0].id;
      });

      it("shouldn't be able to see other accounts", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_INSTALLER,
            accountUuid: installer_id,
            accountEmail: INSTALLER_EMAIL
          },
          "select * from account",
          []
        );
        expect(rows.length).toEqual(1);
      });
    });
    describe("Company admin", () => {
      it("should be able to create an account using the function create_account", async () => {
        const tuple = `null, 'NEW', null, 'COMPANY_ADMIN', '${COMPANY_ADMIN_EMAIL}', 'abc', 'abc', 'abc', '2021-06-10 00:00:39.348475', 5, 'abc', 'abc', 'abc', '2021-06-10 00:00:39.348475', '2021-06-10 00:00:39.348475'`;
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_COMPANY_ADMIN,
            accountUuid: null,
            accountEmail: COMPANY_ADMIN_EMAIL
          },
          `select * from create_account((${tuple}), $1)`,
          ["en"]
        );
        expect(rows.length).toEqual(1);
        expect(rows[0].email).toEqual(COMPANY_ADMIN_EMAIL);
        company_admin_id = rows[0].id;
      });
    });
  });

  describe("Company", () => {
    describe("Installer", () => {
      it("shouldn't be able to see any company if not member", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_INSTALLER,
            accountUuid: installer_id,
            accountEmail: INSTALLER_EMAIL
          },
          ALL_COMPANIES,
          []
        );
        expect(rows.length).toEqual(0);
      });
    });
    describe("Company Admin", () => {
      it("shouldn't be able to see a company if is not a member", async () => {
        const USERID = 1;
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_COMPANY_ADMIN,
            accountUuid: USERID,
            accountEmail: COMPANY_ADMIN_EMAIL
          },
          ALL_COMPANIES,
          []
        );
        expect(rows.length).toEqual(0);
      });
      it("should be able to create a company", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_COMPANY_ADMIN,
            accountUuid: company_admin_id,
            accountEmail: COMPANY_ADMIN_EMAIL
          },
          "SELECT * FROM create_company($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
          ["", "", "", null, null, "NEW", "", "", "", "", "", "", "", ""]
        );
        company_id = rows[0].id;
        expect(rows.length).toEqual(1);
      });
    });

    describe("Company Member", () => {
      describe("Installer", () => {
        it("shouldn't be able to add himself in a company if not invited", async () => {
          try {
            await transaction(
              pool,
              {
                role: ROLE_INSTALLER,
                accountUuid: installer_id,
                accountEmail: INSTALLER_EMAIL
              },
              "insert into company_member (account_id, company_id, market_id) VALUES($1, $2, $3) RETURNING *",
              [installer_id, 1, MARKET_ID]
            );
          } catch (error) {
            expect(error.message).toEqual(RLS_ERROR("company_member"));
          }
        });
      });
      describe("Company Admin", () => {
        it("shouldn't be able to add a user to a company where is not a member", async () => {
          try {
            await transaction(
              pool,
              {
                role: ROLE_COMPANY_ADMIN,
                accountUuid: company_admin_id,
                accountEmail: COMPANY_ADMIN_EMAIL
              },
              "insert into company_member (account_id, company_id) VALUES($1, $2) RETURNING *",
              [installer_id, 1]
            );
          } catch (error) {
            expect(error.message).toEqual(RLS_ERROR("company_member"));
          }
        });
        it("should be able to add an invitation", async () => {
          const { rows } = await transaction(
            pool,
            {
              role: ROLE_COMPANY_ADMIN,
              accountUuid: company_admin_id,
              accountEmail: COMPANY_ADMIN_EMAIL
            },
            "insert into invitation (sender_account_id, invitee, company_id) VALUES($1, $2, $3) RETURNING *",
            [company_admin_id, INSTALLER_EMAIL, company_id]
          );
          expect(rows.length).toEqual(1);
        });

        it("a user with an invitation should be able to join a company", async () => {
          const { rows } = await transaction(
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
            "select * from link_account_to_company($1,$2)",
            [installer_id, company_id]
          );
          expect(rows.length).toEqual(1);
        });
      });
    });
  });

  describe("Company Address", () => {
    describe("Installer", () => {
      it("shouldn't be able to add an address", async () => {
        try {
          await transaction(
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
            "insert into address (first_line) VALUES($1) RETURNING *",
            ["First line"]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("address"));
        }
      });
    });
  });

  describe("Company Document", () => {
    describe("Company Admin", () => {
      it("shouldn't be able to add a document to another company", async () => {
        try {
          await transaction(
            pool,
            {
              role: ROLE_COMPANY_ADMIN,
              accountUuid: 0,
              accountEmail: COMPANY_ADMIN_EMAIL
            },
            "insert into company_document (company_id) VALUES($1) RETURNING *",
            [1]
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("company_document"));
        }
      });
      it("should be able to add a document to his company", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_COMPANY_ADMIN,
            accountUuid: company_admin_id,
            accountEmail: COMPANY_ADMIN_EMAIL
          },
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
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
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
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
            "select * from company_document",
            []
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("company_document"));
        }
      });
      it("should be able to read a certification of his company", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_INSTALLER,
            accountUuid: installer_id,
            accountEmail: INSTALLER_EMAIL
          },
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
          pool,
          {
            role: ROLE_COMPANY_ADMIN,
            accountUuid: company_admin_id,
            accountEmail: COMPANY_ADMIN_EMAIL
          },
          "insert into project (company_id, name, roof_area, building_owner_firstname, building_owner_lastname, start_date, end_date) values ($1, $2, $3, $4, $5, $6, $7) returning *",
          [
            company_id,
            "Project name",
            100,
            "Joe",
            "Doe",
            "2021-01-01",
            "2021-01-02"
          ]
        );
        expect(rows.length).toEqual(1);
        project_id = rows[0].id;
      });
      it("should not be able to see a hidden project", async () => {
        await DELETE_GLOBAL_PROJECT();

        const superAdminConfig = {
          role: ROLE_SUPER_ADMIN,
          accountUuid: 0,
          accountEmail: SUPER_ADMIN_EMAIL
        };

        const { rows: createdProject } = await transaction(
          pool,
          superAdminConfig,
          "insert into project (company_id, name, roof_area, building_owner_firstname, building_owner_lastname, start_date, end_date, hidden) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *",
          [
            company_id,
            "Project name",
            100,
            "Joe",
            "Doe",
            "2021-01-01",
            "2021-01-02",
            true
          ]
        );
        expect(createdProject.length).toEqual(1);

        const { rows: projectMember } = await transaction(
          pool,
          superAdminConfig,
          "insert into project_member (project_id, account_id) values ($1, $2) returning *",
          [createdProject[0].id, company_admin_id]
        );
        expect(projectMember.length).toEqual(1);

        const { rows: projects } = await transaction(
          pool,
          {
            role: ROLE_COMPANY_ADMIN,
            accountUuid: company_admin_id,
            accountEmail: COMPANY_ADMIN_EMAIL
          },
          "select * from project",
          []
        );
        expect(projects.length).toEqual(0);

        // CLEANUP
        await pool.query("delete from project where id = $1", [
          createdProject[0].id
        ]);
        await pool.query("delete from project_member where project_id = $1", [
          createdProject[0].id
        ]);
        await RE_CREATE_GLOBAL_PROJECT();
      });
      it("shouldn't be able to add a project to another company", async () => {
        try {
          await transaction(
            pool,
            {
              role: ROLE_COMPANY_ADMIN,
              accountUuid: company_admin_id,
              accountEmail: COMPANY_ADMIN_EMAIL
            },
            "insert into project (company_id, name, roof_area, building_owner_firstname, building_owner_lastname, start_date, end_date) values ($1, $2, $3, $4, $5, $6, $7) returning *",
            [1, "Project name", 100, "Joe", "Doe", "2021-01-01", "2021-01-02"]
          );
        } catch (error) {
          expect(error.message).toEqual(RLS_ERROR("project"));
        }
      });
      it("should be able to add an installer to the project", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_COMPANY_ADMIN,
            accountUuid: company_admin_id,
            accountEmail: COMPANY_ADMIN_EMAIL
          },
          "insert into project_member (project_id, account_id) values ($1, $2) returning *",
          [project_id, installer_id]
        );
        expect(rows.length).toEqual(1);
      });
    });
    describe("Installer", () => {
      it("shouldn't be able to see projects of other companies", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_INSTALLER,
            accountUuid: installer_id,
            accountEmail: INSTALLER_EMAIL
          },
          "select * from project where company_id != (select * from current_company())",
          []
        );
        expect(rows.length).toEqual(0);
      });

      it("shouldn't be able to see hidden project", async () => {
        await DELETE_GLOBAL_PROJECT();

        const superAdminConfig = {
          role: ROLE_SUPER_ADMIN,
          accountUuid: 0,
          accountEmail: SUPER_ADMIN_EMAIL
        };

        const createdProjects = await transaction(
          pool,
          superAdminConfig,
          "insert into project (company_id, name, roof_area, building_owner_firstname, building_owner_lastname, start_date, end_date, hidden) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *",
          [
            company_id,
            "Project name",
            100,
            "Joe",
            "Doe",
            "2021-01-01",
            "2021-01-02",
            true
          ]
        );
        expect(createdProjects.rows.length).toEqual(1);

        const createdProjectMembers = await transaction(
          pool,
          superAdminConfig,
          "insert into project_member (project_id, account_id) values ($1, $2) returning *",
          [createdProjects.rows[0].id, installer_id]
        );
        expect(createdProjectMembers.rows.length).toEqual(1);

        const { rows: projects } = await transaction(
          pool,
          {
            role: ROLE_INSTALLER,
            accountUuid: installer_id,
            accountEmail: INSTALLER_EMAIL
          },
          "select * from project",
          []
        );
        expect(projects.length).toEqual(0);

        // CLEANUP
        await pool.query("delete from project where id = $1", [
          createdProjects.rows[0].id
        ]);
        await pool.query("delete from project_member where project_id = $1", [
          createdProjects.rows[0].id
        ]);

        await RE_CREATE_GLOBAL_PROJECT();
        await RE_CREATE_PROJECT_MEMBER();
      });

      it("shouldn't be able to add an installer to the project", async () => {
        try {
          await transaction(
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
            "insert into project_member (project_id, account_id) values ($1, $2) returning *",
            [project_id, installer_id]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("project_member"));
        }
      });

      it("should be able to remove himself from the project", async () => {
        const { rows: deletedRows } = await transaction(
          pool,
          {
            role: ROLE_INSTALLER,
            accountUuid: installer_id,
            accountEmail: INSTALLER_EMAIL
          },
          "delete from project_member where account_id = $1 returning id",
          [installer_id]
        );
        expect(deletedRows.length).toEqual(1);

        // Recrete the user for next tests
        await RE_CREATE_PROJECT_MEMBER();
      });
    });
  });

  describe("Guarantee", () => {
    describe("Company admin", () => {
      it("should be able to add a guarantee", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_COMPANY_ADMIN,
            accountUuid: company_admin_id,
            accountEmail: COMPANY_ADMIN_EMAIL
          },
          "insert into guarantee (requestor_account_id, project_id, guarantee_type_id) VALUES($1, $2, $3) RETURNING *",
          [company_admin_id, project_id, "randomGuaranteeTypeId"]
        );
        expect(rows.length).toEqual(1);
        guarantee_id = rows[0].id;
      });
    });
    describe("Installer", () => {
      it("shouldn't be able to create any guarantee", async () => {
        try {
          await transaction(
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
            "insert into guarantee (requestor_account_id, project_id, guarantee_type_id) VALUES($1, $2, $3)",
            [installer_id, 1, "randomGuaranteeTypeId"]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("guarantee"));
        }
      });
      it("should be able to select a guarantee of his company", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_INSTALLER,
            accountUuid: installer_id,
            accountEmail: INSTALLER_EMAIL
          },
          "select * from guarantee",
          []
        );
        expect(rows.length).toEqual(1);
      });
    });
  });

  // TODO fix it
  // describe("Evidence Items", () => {
  //   describe("Company admin", () => {
  //     it("should be able to add an evidence item", async () => {
  //       const { rows } = await transaction(pool,
  //         {
  //           role: ROLE_COMPANY_ADMIN,
  //           accountUuid: company_admin_id,
  //           accountEmail: COMPANY_ADMIN_EMAIL
  //         },
  //         "insert into evidence_item (guarantee_id, name) VALUES($1, $2) RETURNING *",
  //         [guarantee_id, "Name"]
  //       );
  //       expect(rows.length).toEqual(1);
  //       evicence_item_id = rows[0].id;
  //     });
  //   });
  //   describe("Installer", () => {
  //     it("shouldn't be able to create any guarantee", async () => {
  //       try {
  //         await transaction(pool,
  //           {
  //             role: ROLE_INSTALLER,
  //             accountUuid: installer_id,
  //             accountEmail: INSTALLER_EMAIL
  //           },
  //           "insert into evidence_item (guarantee_id, name) VALUES($1, $2) RETURNING *",
  //           [evicence_item_id, "Name"]
  //         );
  //       } catch (error) {
  //         expect(error.message).toEqual(PERMISSION_DENIED("evidence_item"));
  //       }
  //     });
  // it("should be able to select an evidence item if member of a project", async () => {
  //   const { rows } = await transaction(pool,
  //     {
  //       role: ROLE_INSTALLER,
  //       accountUuid: installer_id,
  //       accountEmail: INSTALLER_EMAIL
  //     },
  //     "select * from evidence_item",
  //     []
  //   );
  //   expect(rows.length).toEqual(1);
  // });
  //     it("shouldn't be able to select an evidence item if not member of a project", async () => {
  //       try {
  //         await transaction(pool,
  //           {
  //             role: ROLE_INSTALLER,
  //             accountUuid: 0,
  //             accountEmail: INSTALLER_EMAIL
  //           },
  //           "select * from evidence_item",
  //           []
  //         );
  //       } catch (error) {
  //         expect(error.message).toEqual(RLS_ERROR("evidence_item"));
  //       }
  //     });
  //   });
  // });

  describe("Market", () => {
    describe("Super Admin", () => {
      it("should be able to create and read a market", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_SUPER_ADMIN,
            accountUuid: 0,
            accountEmail: SUPER_ADMIN_EMAIL
          },
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
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
            "insert into market (name) VALUES ($1)",
            ["Name"]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("market"));
        }
      });
      it("should be able to read his market", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_INSTALLER,
            accountUuid: installer_id,
            accountEmail: INSTALLER_EMAIL
          },
          "select * from market where id = $1",
          [MARKET_ID]
        );
        expect(rows.length).toEqual(1);
      });
      it("shouldn't be able to read a market if not registered in that market", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_INSTALLER,
            accountUuid: installer_id,
            accountEmail: INSTALLER_EMAIL
          },
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
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
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
            pool,
            {
              role: ROLE_MARKET_ADMIN,
              accountUuid: 0,
              accountEmail: MARKET_ADMIN_EMAIL
            },
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
          pool,
          {
            role: ROLE_MARKET_ADMIN,
            accountUuid: market_admin_id,
            accountEmail: MARKET_ADMIN_EMAIL
          },
          "insert into product (name, market_id, bmi_ref, brand, family, published, maximum_validity_years) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
          [
            "Name",
            MARKET_ID,
            "test_bmi_ref",
            "test_brand",
            "test_family",
            true,
            1
          ]
        );
        expect(rows.length).toEqual(1);
        product_id = rows[0].id;
        await pool.query("delete from product where id = $1", [product_id]);
      });
      it("shouldn't be able to create and read a product", async () => {
        try {
          await transaction(
            pool,
            {
              role: ROLE_MARKET_ADMIN,
              accountUuid: market_admin_id,
              accountEmail: MARKET_ADMIN_EMAIL
            },
            "insert into product (name, market_id, bmi_ref, brand, family, published, maximum_validity_years) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            ["Name", 2, "test_bmi_ref", "test_brand", "test_family", true, 1]
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
          pool,
          {
            role: ROLE_SUPER_ADMIN,
            accountUuid: 0,
            accountEmail: SUPER_ADMIN_EMAIL
          },
          "insert into system (name, market_id, bmi_ref, maximum_validity_years, published) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          ["Name", MARKET_ID, "test_bmi_ref", 1, true]
        );
        expect(rows.length).toEqual(1);
        system_id = rows[0].id;
        await pool.query("delete from system where id = $1", [system_id]);
      });
    });
    describe("Installer", () => {
      it("shouldn't be able to add a new market", async () => {
        try {
          await transaction(
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
            "insert into market (name) VALUES ($1)",
            ["Name"]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("market"));
        }
      });
    });
  });

  describe("Notification", () => {
    beforeAll(async () => {
      await pool.query(
        "insert into notification (account_id, send_date, read, body) VALUES ($1, $2, $3, $4) RETURNING *",
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
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
            "insert into notification (account_id, send_date, read, body) VALUES ($1, $2, $3, $4) RETURNING *",
            [
              installer_id,
              new Date(),
              false,
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
            ]
          );
        } catch (error) {
          expect(error.message).toEqual(PERMISSION_DENIED("notification"));
        }
      });
      it("should be able to read notifications", async () => {
        const { rows } = await transaction(
          pool,
          {
            role: ROLE_INSTALLER,
            accountUuid: installer_id,
            accountEmail: INSTALLER_EMAIL
          },
          "update notification set read=$2 where account_id=$1 RETURNING *",
          [installer_id, true]
        );
        expect(rows[0].read).toEqual(true);
      });
    });
  });

  describe("Invitation", () => {
    describe("Installer", () => {
      it("shouldn't be able to send an invitation", async () => {
        try {
          await transaction(
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
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
          pool,
          {
            role: ROLE_MARKET_ADMIN,
            accountUuid: market_admin_id,
            accountEmail: MARKET_ADMIN_EMAIL
          },
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
            pool,
            {
              role: ROLE_COMPANY_ADMIN,
              accountUuid: company_admin_id,
              accountEmail: MARKET_ADMIN_EMAIL
            },
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
            pool,
            {
              role: ROLE_INSTALLER,
              accountUuid: installer_id,
              accountEmail: INSTALLER_EMAIL
            },
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
