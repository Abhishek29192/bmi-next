process.env.PGUSER = "PGUSER";
process.env.PGDATABASE = "PGDATABASE";
process.env.PGHOST = "PGHOST";
process.env.PGPASSWORD = "PGPASSWORD";
process.env.PGPORT = "PGPORT";
process.env.PG_SSL_HOST = "PG_SSL_HOST";
process.env.NODE_ENV = "local";

import { getSecretSpy } from "../../__mocks__";
import { insertCertification } from "../PostgreSqlClient";
import { generateReportRecordFactory, dbDoceboUsersFactory } from "./helper";

const poolSpy = jest.fn();
const querySpy = jest.fn();
const endSpy = jest.fn();
jest.mock("pg", () => {
  const original = jest.requireActual("pg");
  return {
    ...original,
    Pool: jest.fn().mockImplementation((config: any) => poolSpy(config))
  };
});
poolSpy.mockImplementation(() => ({
  query: querySpy,
  end: endSpy
}));

const pgFormatSpy = jest.fn();
jest.mock("pg-format", () => {
  const original = jest.requireActual("pg-format");
  return {
    ...original,
    __esModule: true,
    default: (...query: any) => pgFormatSpy(query)
  };
});

describe("DoceboClient", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...OLD_ENV };
    getSecretSpy
      .mockReturnValueOnce("PG_SSL_CLIENT_KEY")
      .mockReturnValueOnce("PG_SSL_CLIENT_CERT")
      .mockReturnValueOnce("PG_SSL_SERVER_CA")
      .mockReturnValueOnce("COMPANIES_DB_PASSWORD")
      .mockReturnValueOnce("COMPANIES_DB_HOST");
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe("getCertificationsReport", () => {
    const { PGHOST, PGPORT, PGUSER, PGDATABASE, PGPASSWORD } = process.env;

    it("normal case", async () => {
      const users = dbDoceboUsersFactory();
      const query =
        "INSERT INTO certification (docebo_user_id,technology,name,expiry_date) VALUES %L ;";

      querySpy.mockReturnValueOnce(users).mockReturnValueOnce({ rows: [] });
      pgFormatSpy.mockReturnValueOnce(query);
      const records = generateReportRecordFactory();
      const config = {
        host: PGHOST,
        port: parseInt(PGPORT as string),
        user: PGUSER,
        database: PGDATABASE,
        password: PGPASSWORD
      };
      const response = await insertCertification([
        { ...records, userId: users.rows[0].docebo_user_id.toString() }
      ]);

      expect(poolSpy).toHaveBeenCalledWith(config);
      expect(poolSpy).toHaveBeenCalledTimes(2);
      expect(querySpy).toHaveBeenNthCalledWith(
        1,
        "select docebo_user_id from account where docebo_user_id is not null"
      );
      expect(pgFormatSpy).toHaveBeenCalledWith([
        query,
        [records].map(({ userId, code, title, to_renew_in }) => [
          userId,
          code,
          title,
          to_renew_in
        ])
      ]);
      expect(querySpy).toHaveBeenNthCalledWith(
        2,
        `TRUNCATE TABLE certification; ${query}`
      );
      expect(endSpy).toHaveBeenCalledTimes(2);
      expect(response).toBe(
        `Certificate table has truncated and ${users.rows.length} certificates have been inserted`
      );
    });

    it("No matched certificate", async () => {
      const query =
        "INSERT INTO certification (docebo_user_id,technology,name,expiry_date) VALUES %L ;";

      querySpy.mockReturnValueOnce({ rows: [] });
      pgFormatSpy.mockReturnValueOnce(query);
      const records = generateReportRecordFactory();
      const response = await insertCertification([records]);

      expect(poolSpy).toHaveBeenCalledTimes(1);
      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(endSpy).toHaveBeenCalledTimes(1);
      expect(response).toBe(`No certificate to be inserted`);
    });

    it("NODE_ENV not equal local", async () => {
      process.env.NODE_ENV = "dev";
      const users = dbDoceboUsersFactory();
      const query =
        "INSERT INTO certification (docebo_user_id,technology,name,expiry_date) VALUES %L ;";

      querySpy.mockReturnValueOnce(users).mockReturnValueOnce({ rows: [] });
      pgFormatSpy.mockReturnValueOnce(query);
      const records = generateReportRecordFactory();
      const config = {
        host: "COMPANIES_DB_HOST",
        port: parseInt(PGPORT as string),
        user: PGUSER,
        database: PGDATABASE,
        password: "COMPANIES_DB_PASSWORD",
        ssl: {
          rejectUnauthorized: true,
          ca: "PG_SSL_SERVER_CA",
          key: "PG_SSL_CLIENT_KEY",
          cert: "PG_SSL_CLIENT_CERT",
          host: "PG_SSL_HOST"
        }
      };
      const response = await insertCertification([
        { ...records, userId: users.rows[0].docebo_user_id.toString() }
      ]);

      expect(poolSpy).toHaveBeenCalledWith(config);
      expect(poolSpy).toHaveBeenCalledTimes(2);
      expect(endSpy).toHaveBeenCalledTimes(2);
      expect(response).toBe(
        `Certificate table has truncated and ${users.rows.length} certificates have been inserted`
      );
    });
  });
});
