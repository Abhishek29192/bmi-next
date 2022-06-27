import {
  deleteRow,
  Context,
  getDbPool,
  actAs,
  insertOne,
  cleanup
} from "../db";

process.env.PG_USER = "PG_USER";
process.env.PG_DATABASE = "PG_DATABASE";
process.env.PG_PORT = "0000";
process.env.PG_PASSWORD = "PG_PASSWORD";
process.env.PG_HOST = "PG_HOST";

const poolSpy = jest.fn();
const querySpy = jest.fn();
jest.mock("pg", () => {
  const original = jest.requireActual("pg");
  return {
    ...original,
    Pool: jest.fn().mockImplementation((config) => {
      return poolSpy(config);
    })
  };
});

describe("db", () => {
  const clientQuerySpy = jest.fn();
  const context = {
    client: {
      query: clientQuerySpy.mockImplementation(() =>
        Promise.resolve({ rows: ["any"] })
      )
    },
    pool: {
      query: jest
        .fn()
        .mockImplementation((query, parameters) => querySpy(query, parameters))
    }
  } as unknown as Context;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getDbPool", () => {
    const { PG_USER, PG_DATABASE, PG_PORT, PG_PASSWORD, PG_HOST } = process.env;

    getDbPool();

    expect(poolSpy).toHaveBeenCalledWith({
      host: PG_HOST,
      port: parseInt(PG_PORT),
      user: PG_USER,
      database: PG_DATABASE,
      password: PG_PASSWORD
    });
  });

  describe("actAs", () => {
    const accountFactory = (config = {}) => ({
      id: 1,
      email: "test@test.com",
      role: "SUPER_ADMIN",
      market_id: 2,
      ...config
    });

    it("normal case", async () => {
      const account = accountFactory();
      await actAs(context.client, account);

      expect(context.client.query).toHaveBeenCalledTimes(4);
      expect(context.client.query).toHaveBeenNthCalledWith(
        1,
        `SET LOCAL app.current_account_id TO '${account.id}'`
      );
      expect(context.client.query).toHaveBeenNthCalledWith(
        2,
        `SET LOCAL app.current_account_email TO '${account.email}'`
      );
      expect(context.client.query).toHaveBeenNthCalledWith(
        3,
        `SET LOCAL ROLE TO '${account.role.toLowerCase()}'`
      );
      expect(context.client.query).toHaveBeenNthCalledWith(
        4,
        `SET LOCAL app.current_market TO '${account.market_id}'`
      );
    });

    it("non super admin account", async () => {
      const account = accountFactory({ role: "INSTALLER" });
      await actAs(context.client, account);

      expect(context.client.query).toHaveBeenCalledTimes(3);
    });

    describe("retrun error log when", () => {
      it("account not contain id", async () => {
        const account = accountFactory();
        delete account.id;
        try {
          await actAs(context.client, account);
        } catch (error) {
          expect(error.message).toBe(
            "Need account `id`, `email`, and `role` to act as the account."
          );
        }
      });

      it("account not contain email", async () => {
        const account = accountFactory();
        delete account.email;
        try {
          await actAs(context.client, account);
        } catch (error) {
          expect(error.message).toBe(
            "Need account `id`, `email`, and `role` to act as the account."
          );
        }
      });

      it("account not contain role", async () => {
        const account = accountFactory();
        delete account.role;
        try {
          await actAs(context.client, account);
        } catch (error) {
          expect(error.message).toBe(
            "Need account `id`, `email`, and `role` to act as the account."
          );
        }
      });
    });
  });

  describe("insertOne", () => {
    const tableName = "table";
    const record = { test: "test" };
    it("normal case", async () => {
      const response = await insertOne({ ...context }, tableName, record);

      expect(context.client.query).toHaveBeenCalledWith(
        `INSERT into ${tableName} (test) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *`,
        ["test"]
      );
      expect(response).toBe("any");
    });

    it("table matches requiredFields project", async () => {
      await insertOne({ ...context }, "project", record);

      expect(context.client.query).toHaveBeenCalledWith(
        `INSERT into project (name, roof_area, technology, start_date, end_date, test) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING RETURNING *`,
        ["name", 1, "PITCHED", "2020-01-01", "2020-01-01", "test"]
      );
    });

    it("table matches requiredFields account", async () => {
      await insertOne({ ...context }, "account", record);

      expect(context.client.query).toHaveBeenCalledWith(
        `INSERT into account (first_name, last_name, email, test) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING *`,
        ["Joe", "Doe", "joe@email.invalid", "test"]
      );
    });
  });

  describe("deleteRow", () => {
    it("1 condition", async () => {
      const tableName = "table";
      const result = await deleteRow(context, tableName, { test: "test" });

      expect(result).toBe(true);
      expect(clientQuerySpy).toHaveBeenCalledWith(
        `DELETE FROM ${tableName} WHERE test = 'test'`
      );
    });

    it("multiple condition", async () => {
      const tableName = "table";
      const result = await deleteRow(context, tableName, {
        test: "test",
        test2: "test2"
      });

      expect(result).toBe(true);
      expect(clientQuerySpy).toHaveBeenCalledWith(
        `DELETE FROM ${tableName} WHERE test = 'test' AND test2 = 'test2'`
      );
    });
  });

  describe("cleanup", () => {
    it("normal case", async () => {
      const tableName = "table";
      const record = { id: "1" };
      await cleanup({
        ...context,
        cleanupBucket: {
          [tableName]: [record]
        }
      });

      expect(querySpy).toHaveBeenCalledWith(
        `DELETE from ${tableName} WHERE id = ANY($1)`,
        [[record.id]]
      );
    });
  });
});
