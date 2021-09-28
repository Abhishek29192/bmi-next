import { deleteCompanyMember } from "..";
import { sendMessageWithTemplate } from "../../../services/mailer";

jest.mock("../../../services/mailer", () => ({
  sendMessageWithTemplate: jest.fn()
}));

describe("Company", () => {
  let resolve = jest.fn();
  let source = {};
  let resolveInfo = {};
  let context;
  let args;
  let query = jest.fn();

  beforeEach(() => {
    context = {
      pubSub: {},
      logger: () => ({ info: jest.fn(), error: jest.fn() }),
      pgClient: {
        query
      },
      user: {
        role: "COMPANY_ADMIN"
      }
    };

    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("company member", () => {
    beforeEach(() => {
      args = {
        input: {
          id: 1
        }
      };
    });

    it("shouldn't remove the user if not a member", async () => {
      query.mockImplementationOnce(() => ({ rows: [] }));

      try {
        await deleteCompanyMember(resolve, source, args, context, resolveInfo);
      } catch (error) {
        expect(error.message).toEqual("user not in this company");
      }
    });

    it("shouldn't remove the user if company admin", async () => {
      query.mockImplementationOnce(() => ({
        rows: [
          {
            id: 1,
            company_id: 2,
            role: "COMPANY_ADMIN"
          }
        ]
      }));

      try {
        await deleteCompanyMember(resolve, source, args, context, resolveInfo);
      } catch (error) {
        expect(error.message).toEqual("you can remove only installers");
      }
    });

    it("should remove the user from the company and from the projects", async () => {
      query.mockImplementationOnce(() => ({
        rows: [
          {
            id: 1,
            company_id: 2,
            role: "INSTALLER"
          }
        ]
      }));

      await deleteCompanyMember(resolve, source, args, context, resolveInfo);

      expect(resolve).toBeCalledTimes(1);
      expect(sendMessageWithTemplate).toBeCalledTimes(1);
      expect(query.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "
            SELECT
              account.id,
              account.role,
              account.first_name,
              account.last_name,
              account.email,
              company_member.company_id AS company_id,
              company.name
            FROM
              account
              JOIN company_member ON account.id = company_member.account_id
              JOIN company ON company.id = company_member.company_id
            WHERE
              company_member.id = $1
            ",
            Array [
              1,
            ],
          ],
          Array [
            "SAVEPOINT graphql_mutation",
          ],
          Array [
            "delete from project_member where account_id = $1 returning *",
            Array [
              1,
            ],
          ],
          Array [
            "RELEASE SAVEPOINT graphql_mutation",
          ],
        ]
      `);
    });
  });
});
