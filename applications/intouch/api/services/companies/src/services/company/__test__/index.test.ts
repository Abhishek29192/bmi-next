import { createCompany } from "../index";

describe("Company service", () => {
  const resolve = () => ({
    data: {
      $company_id: 2
    }
  });
  const source = {};
  const context = {
    pgClient: { query: jest.mock },
    user: jest.mock
  };
  const resolveInfo = {};
  it("it should create the relations between user and company", async () => {
    const args = {
      user: {
        id: 10
      }
    };

    await createCompany(resolve, source, args, context, resolveInfo);

    expect(
      context.pgClient.query
    ).toHaveBeenLastCalledWith(
      "INSERT INTO company_member (account_id, company_id) VALUES($1,$2) RETURNING id",
      [12, 2]
    );
  });
});
