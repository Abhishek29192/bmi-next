import { TruncateAndInsertCertificationInput } from "@bmi/intouch-api-types";
import { truncateAndInsertCertification } from "../";

const formatSpy = jest.fn();
jest.mock("pg-format", () => {
  const original = jest.requireActual("pg-format");
  return {
    __esModule: true,
    ...original,
    default: (...params) => formatSpy(...params)
  };
});

describe("DoceboTier", () => {
  const mockQuery = jest.fn();
  const loggerError = jest.fn();
  const loggerInfo = jest.fn();
  const context: any = {
    pubSub: {},
    logger: jest.fn().mockReturnValue({
      error: loggerError,
      info: loggerInfo
    }),
    pgRootPool: null,
    pgClient: {
      query: mockQuery
    }
  };
  const certificate = (cert = {}) => ({
    userId: 1,
    code: "CUSTOM",
    title: "title",
    toNewIn: new Date("2023-03-31 23:00:00"),
    ...cert
  });
  const args = (cert = []): { input: TruncateAndInsertCertificationInput } => ({
    input: {
      certificates: [certificate(), ...cert]
    }
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updateDoceboTiersByMarket", () => {
    it("normal case", async () => {
      const input = args();
      const certs = [
        {
          docebo_user_id: 1,
          technology: "CUSTOM",
          name: "name",
          expiry_date: new Date("2023-03-31 23:00:00")
        }
      ];
      const message = `Certificate table has truncated and ${certs.length} certificates have been inserted`;
      formatSpy.mockImplementationOnce((...query) => query);
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => [
          {},
          {
            rows: certs
          }
        ]);
      const result = await truncateAndInsertCertification(
        null,
        input,
        context,
        {},
        {}
      );

      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        "SAVEPOINT graphql_truncate_and_insert_certification_mutation"
      );
      expect(formatSpy).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenNthCalledWith(2, [
        `TRUNCATE TABLE certification; INSERT INTO certification (docebo_user_id,technology,name,expiry_date) VALUES %L RETURNING *;`,
        input.input.certificates.map(({ userId, code, title, toNewIn }) => [
          userId,
          code,
          title,
          toNewIn
        ])
      ]);
      expect(mockQuery).toHaveBeenNthCalledWith(
        3,
        "RELEASE SAVEPOINT graphql_truncate_and_insert_certification_mutation"
      );
      expect(loggerInfo).toHaveBeenCalledWith({
        message
      });
      expect(result).toBe(message);
    });

    it("no certificate to be inserted", async () => {
      const input = { input: { certificates: [] } };
      const certs = [];
      const message = "No certificate to be inserted";
      formatSpy.mockImplementationOnce((...query) => query);
      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => [
          {},
          {
            rows: certs
          }
        ]);

      const result = await truncateAndInsertCertification(
        null,
        input,
        context,
        {},
        {}
      );

      expect(loggerInfo).toHaveBeenCalledWith({ message });
      expect(result).toBe(message);
    });

    it("throw error when insert into db", async () => {
      const input = args();
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      mockQuery.mockImplementationOnce(() => {}).mockRejectedValueOnce(error);

      await expect(
        truncateAndInsertCertification(null, input, context, {}, {})
      ).rejects.toThrowError(errorMessage);
      expect(loggerInfo).toHaveBeenCalledWith(
        "Failed to tuncate and insert certifications"
      );
      expect(mockQuery).toHaveBeenCalledWith(
        "ROLLBACK TO SAVEPOINT graphql_truncate_and_insert_certification_mutation"
      );
    });
  });
});
