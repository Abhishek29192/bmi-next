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
const addRewardRecordSpy = jest.fn();
jest.mock("../../rewardRecord", () => ({
  addRewardRecord: (...args) => addRewardRecordSpy(...args)
}));

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

  describe("certification", () => {
    describe("truncateAndInsertCertification", () => {
      const accounts = [
        { id: 1, docebo_user_id: 1, companyId: 1 },
        { id: 2, docebo_user_id: 2, companyId: 1 }
      ];

      it("normal case", async () => {
        const input = args([certificate({ userId: 2 })]);
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
          .mockImplementationOnce(() => {})
          .mockImplementationOnce(() => ({
            rows: certs
          }))
          .mockImplementationOnce(() => ({
            rows: accounts
          }))
          .mockImplementationOnce(() => {})
          .mockImplementationOnce(() => [
            {},
            {
              rows: certs
            }
          ]);
        addRewardRecordSpy.mockImplementationOnce(() => ({
          status: "fulfilled",
          value: accounts
        }));
        const result = await truncateAndInsertCertification(
          null,
          input,
          context,
          {},
          {}
        );

        expect(mockQuery).toHaveBeenCalledWith(
          "SAVEPOINT graphql_truncate_and_insert_certification_mutation"
        );
        expect(formatSpy).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(
          `SELECT * FROM account WHERE docebo_user_id in (${input.input.certificates.map(
            (_, id) => `$${id + 1}`
          )})`,
          input.input.certificates.map(({ userId }) => userId)
        );
        expect(mockQuery).toHaveBeenCalledWith([
          `TRUNCATE TABLE certification; INSERT INTO certification (docebo_user_id,technology,name,expiry_date) VALUES %L RETURNING *;`,
          input.input.certificates.map(({ userId, code, title, toNewIn }) => [
            userId,
            code,
            title,
            toNewIn
          ])
        ]);
        expect(mockQuery).toHaveBeenCalledWith(
          "RELEASE SAVEPOINT graphql_truncate_and_insert_certification_mutation"
        );
        expect(loggerInfo).toHaveBeenCalledWith({
          message
        });
        expect(result).toBe(message);
        expect(addRewardRecordSpy).toHaveBeenCalledWith(
          null,
          {
            input: {
              accountId: 1,
              rewardCategory: "rc2"
            }
          },
          context
        );
      });

      it("no certificate to be inserted", async () => {
        const input = { input: { certificates: [] } };
        const certs = [];
        const message = "No certificate to be inserted";
        formatSpy.mockImplementationOnce((...query) => query);
        mockQuery
          .mockImplementationOnce(() => {})
          .mockImplementationOnce(() => {})
          .mockImplementationOnce(() => ({
            rows: certs
          }))
          .mockImplementationOnce(() => ({
            rows: accounts
          }))
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
        expect(addRewardRecordSpy).toHaveBeenCalledTimes(0);
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

      it("log error when failed to addRewardPoint", async () => {
        const input = args();
        const certs = [
          {
            docebo_user_id: 1,
            technology: "CUSTOM",
            name: "name",
            expiry_date: new Date("2023-03-31 23:00:00")
          }
        ];
        const message = "error Message";
        const error = new Error(message);
        formatSpy.mockImplementationOnce((...query) => query);
        mockQuery
          .mockImplementationOnce(() => {})
          .mockImplementationOnce(() => {})
          .mockImplementationOnce(() => ({
            rows: certs
          }))
          .mockImplementationOnce(() => ({
            rows: accounts
          }))
          .mockImplementationOnce(() => {})
          .mockImplementationOnce(() => [
            {},
            {
              rows: certs
            }
          ]);
        addRewardRecordSpy.mockImplementationOnce(() => Promise.reject(error));
        await truncateAndInsertCertification(null, input, context, {}, {});

        expect(loggerError).toHaveBeenCalledWith({
          message: `Failed to add reward point, ${error}`
        });
      });
    });
  });
});
