import Auth0Client from "../Auth0Client";
import { userFactory } from "./utils/user";

process.env.GCP_SECRET_PROJECT = "GCP_SECRET_PROJECT";
process.env.AUTH0_MANAGEMENT_CLIENT_ID = "AUTH0_MANAGEMENT_CLIENT_ID";
process.env.AUTH0_ISSUER_BASE_URL = "AUTH0_ISSUER_BASE_URL";
process.env.AUTH0_AUDIENCE = "AUTH0_AUDIENCE";
process.env.FRONTEND_BASE_URL = "FRONTEND_BASE_URL";
process.env.AUTH0_API_CLIENT_SECRET = "AUTH0_API_CLIENT_SECRET";

const fetchMock = jest.fn();
jest.mock("node-fetch", () => {
  const original = jest.requireActual("node-fetch");
  return {
    ...original,
    __esModule: true,
    default: (...config: any) => fetchMock(...config)
  };
});
const loggerError = jest.fn();
const loggerInfo = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  error: (message: any) => loggerError(message),
  info: (message: any) => loggerInfo(message)
}));

describe("Auth0Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fetchResponseFactory = (response: any, config = {}) => ({
    ok: true,
    json: () => response,
    ...config
  });

  describe("private function", () => {
    describe("errorLogger", () => {
      it("log error message", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "data message: fetch token error";
        const erorrObject = new Error(errorMessage);

        fetchMock.mockRejectedValueOnce(erorrObject);

        await expect(auth0.getUnverifiedUser()).rejects.toThrow(erorrObject);

        expect(loggerError).toHaveBeenNthCalledWith(1, {
          message: `Error fetching token: ${errorMessage}`
        });
        expect(loggerError).toHaveBeenNthCalledWith(2, {
          message: `Error fetching unverified users: ${errorMessage}`
        });
      });

      it("log error when on message", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "data message: fetch token error";

        fetchMock.mockRejectedValueOnce(errorMessage);

        // await expect(auth0.getUnverifiedUser()).rejects.toThrow(errorMessage);
        try {
          await auth0.getUnverifiedUser();
        } catch (error) {
          expect(error).toBe(errorMessage);
        }

        expect(loggerError).toHaveBeenNthCalledWith(1, {
          message: `Error fetching token: ${errorMessage}`
        });
        expect(loggerError).toHaveBeenNthCalledWith(2, {
          message: `Error fetching unverified users: ${errorMessage}`
        });
      });
    });

    describe("getManagementToken", () => {
      const token = "managementToken";
      const users = [userFactory()];

      it("normal case", async () => {
        const auth0 = new Auth0Client();
        fetchMock
          .mockReturnValueOnce(fetchResponseFactory({ access_token: token }))
          .mockReturnValueOnce(fetchResponseFactory({ users }));

        await auth0.getUnverifiedUser();

        expect(fetchMock).toHaveBeenNthCalledWith(
          1,
          `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({
              grant_type: "client_credentials",
              client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
              client_secret: "AUTH0_API_CLIENT_SECRET",
              audience: process.env.AUTH0_AUDIENCE
            })
          }
        );
      });

      it("throw error when fails to fetch token", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "fetch token error";
        const errorObject = new Error(errorMessage);
        (errorObject as any).statusText = errorMessage;
        fetchMock.mockRejectedValueOnce(errorObject);

        await expect(auth0.getUnverifiedUser()).rejects.toThrow(errorMessage);

        expect(loggerError).toHaveBeenNthCalledWith(1, {
          message: `Error fetching token: ${errorMessage}`
        });
        expect(loggerError).toHaveBeenNthCalledWith(2, {
          message: `Error fetching unverified users: ${errorMessage}`
        });
      });

      it("throw error when getManagementToken api return not ok", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "fetch token error";
        const errorObject = new Error(errorMessage);
        const fetchResponse = fetchResponseFactory(errorObject, {
          ok: false,
          statusText: errorMessage
        });
        fetchMock.mockReturnValueOnce(fetchResponse);

        try {
          await auth0.getUnverifiedUser();
        } catch (error) {
          expect((error as any).message).toBe(errorMessage);
        }
        expect(loggerError).toHaveBeenNthCalledWith(1, {
          message: `Error fetching token: ${errorMessage}`
        });
        expect(loggerError).toHaveBeenNthCalledWith(2, {
          message: `Error fetching unverified users: ${errorMessage}`
        });
      });

      it("throw error when getUnverified api return not ok", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "fetch token error";
        const errorObject = new Error(errorMessage);
        const fetchResponse = fetchResponseFactory(errorObject, {
          ok: false,
          statusText: errorMessage
        });
        fetchMock
          .mockReturnValueOnce(fetchResponseFactory({ access_token: token }))
          .mockReturnValueOnce(fetchResponse);

        try {
          await auth0.getUnverifiedUser();
        } catch (error) {
          expect((error as any).message).toBe(errorMessage);
        }
        expect(loggerError).toHaveBeenNthCalledWith(1, {
          message: `Error fetching unverified users: ${errorMessage}`
        });
      });
    });
  });

  describe("public function", () => {
    const errorLoggerSpy = jest.spyOn(
      Auth0Client.prototype as any,
      "errorLogger"
    );

    describe("getUnverifiedUser", () => {
      const token = "managementToken";
      const users = [userFactory()];

      it("normal case", async () => {
        const auth0 = new Auth0Client();
        const userResponse = { users, length: 1, total: 1 };
        fetchMock
          .mockReturnValueOnce(fetchResponseFactory({ access_token: token }))
          .mockReturnValueOnce(fetchResponseFactory(userResponse));

        const result = await auth0.getUnverifiedUser();

        expect(result).toBe(userResponse);
        expect(fetchMock).toHaveBeenNthCalledWith(
          2,
          `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users?q=email_verified:false&per_page=100&include_totals=true&page=0`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );
      });

      it("throw error when fails to fetch token", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "failed to fetch token";
        fetchMock.mockRejectedValueOnce(new Error(errorMessage));

        await expect(auth0.getUnverifiedUser()).rejects.toThrowError(
          errorMessage
        );
        expect(errorLoggerSpy).toHaveBeenNthCalledWith(
          1,
          new Error(errorMessage),
          "Error fetching token:"
        );
        expect(errorLoggerSpy).toHaveBeenNthCalledWith(
          2,
          new Error(errorMessage),
          "Error fetching unverified users:"
        );
      });

      it("throw error when fails to fetch user", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "failed to fetch user";
        fetchMock
          .mockReturnValueOnce(fetchResponseFactory({ access_token: token }))
          .mockRejectedValueOnce(new Error(errorMessage));

        await expect(auth0.getUnverifiedUser()).rejects.toThrowError(
          errorMessage
        );
        expect(errorLoggerSpy).toHaveBeenNthCalledWith(
          1,
          new Error(errorMessage),
          "Error fetching unverified users:"
        );
      });
    });

    describe("deleteUser", () => {
      const email = "test@test.com";

      it("normal case", async () => {
        const auth0 = new Auth0Client();
        fetchMock.mockReturnValueOnce(
          fetchResponseFactory(fetchResponseFactory({}))
        );

        await auth0.deleteUser({ email });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenNthCalledWith(
          1,
          `${process.env.FRONTEND_BASE_URL}/api/confirm-signup`,
          {
            method: "POST",
            headers: {
              "content-type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              email
            })
          }
        );
      });

      it("throw error when fails to delete user", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "failed to delete user";
        const errorObject = new Error(errorMessage);
        const response = fetchResponseFactory(errorObject, {
          ok: false,
          statusText: errorMessage
        });
        fetchMock.mockReturnValueOnce(response);

        try {
          await auth0.deleteUser({ email });
        } catch (error) {
          expect((error as any).message).toBe(errorMessage);
        }
        expect(errorLoggerSpy).toHaveBeenNthCalledWith(
          1,
          errorObject,
          `Error deleting user with ${email}:`
        );
      });

      it("call api again when error status is 429", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "failed to delete user";
        const errorObject = new Error(errorMessage);
        const resultMessage = "result";
        const resultObject = fetchResponseFactory(resultMessage);
        fetchMock
          .mockReturnValueOnce(
            fetchResponseFactory(errorObject, {
              ok: false,
              status: 429
            })
          )
          .mockReturnValueOnce(resultObject);

        const result = await auth0.deleteUser({ email });

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(errorLoggerSpy).toHaveBeenCalledTimes(0);
        expect(result).toBe(resultObject);
      });
    });
  });
});
