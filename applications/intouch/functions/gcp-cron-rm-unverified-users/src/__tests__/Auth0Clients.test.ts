import { userFactory } from "../lib/utils/tests/user";
import Auth0Client from "../Auth0Client";

process.env.GCP_SECRET_PROJECT = "GCP_SECRET_PROJECT";
process.env.AUTH0_MANAGEMENT_CLIENT_ID = "AUTH0_MANAGEMENT_CLIENT_ID";
process.env.AUTH0_ISSUER_BASE_URL = "AUTH0_ISSUER_BASE_URL";
process.env.AUTH0_AUDIENCE = "AUTH0_AUDIENCE";

const getSecretMock = jest.fn().mockReturnValue("gcp secret acquired");
jest.mock("../utils/secrets", () => ({
  getSecret: (...params) => getSecretMock(params)
}));
const axiosMock = jest.fn();
jest.mock("axios", () => {
  const original = jest.requireActual("axios");
  return {
    ...original,
    __esModule: true,
    default: (config) => axiosMock(config)
  };
});
const consoleLogSpy = jest.fn();
global.console = {
  ...console,
  log: (...params) => consoleLogSpy(...params)
};

describe("Auth0Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("private function", () => {
    describe("errorLogger", () => {
      it("log response data message", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "data message: fetch token error";
        const erorrObject = new Error("default message");
        (erorrObject as any).response = {
          data: { message: errorMessage, error: "data error" }
        };

        axiosMock.mockRejectedValueOnce(erorrObject);

        await expect(auth0.getUnverifiedUser()).rejects.toThrow(erorrObject);

        expect(consoleLogSpy).toHaveBeenNthCalledWith(
          1,
          "Error fetching token:",
          errorMessage
        );
        expect(consoleLogSpy).toHaveBeenNthCalledWith(
          2,
          "Error fetching unverified users:",
          errorMessage
        );
      });

      it("log response data error when no data message", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "data error: fetch token error";
        const erorrObject = new Error("default message");
        (erorrObject as any).response = { data: { error: errorMessage } };

        axiosMock.mockRejectedValueOnce(erorrObject);

        await expect(auth0.getUnverifiedUser()).rejects.toThrow(erorrObject);

        expect(consoleLogSpy).toHaveBeenNthCalledWith(
          1,
          "Error fetching token:",
          errorMessage
        );
        expect(consoleLogSpy).toHaveBeenNthCalledWith(
          2,
          "Error fetching unverified users:",
          errorMessage
        );
      });

      it("log error message", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "data error: fetch token error";
        const erorrObject = new Error("default message");
        (erorrObject as any).message = errorMessage;

        axiosMock.mockRejectedValueOnce(erorrObject);

        await expect(auth0.getUnverifiedUser()).rejects.toThrow(erorrObject);

        expect(consoleLogSpy).toHaveBeenNthCalledWith(
          1,
          "Error fetching token:",
          errorMessage
        );
        expect(consoleLogSpy).toHaveBeenNthCalledWith(
          2,
          "Error fetching unverified users:",
          errorMessage
        );
      });

      it("log whole error when contains no response and messsgae", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "plain error: fetch token error";

        axiosMock.mockRejectedValueOnce(errorMessage);

        try {
          await auth0.getUnverifiedUser();
        } catch (error) {
          expect(error).toBe(errorMessage);
        }

        expect(consoleLogSpy).toHaveBeenNthCalledWith(
          1,
          "Error fetching token:",
          errorMessage
        );
        expect(consoleLogSpy).toHaveBeenNthCalledWith(
          2,
          "Error fetching unverified users:",
          errorMessage
        );
      });
    });

    describe("getManagementToken", () => {
      const token = "managementToken";
      const users = [userFactory()];

      it("normal case", async () => {
        const auth0 = new Auth0Client();
        axiosMock
          .mockReturnValueOnce({ data: { access_token: token } })
          .mockReturnValueOnce({ data: users });

        await auth0.getUnverifiedUser();

        expect(getSecretMock).toHaveBeenCalledWith([
          process.env.GCP_SECRET_PROJECT,
          "AUTH0_API_CLIENT_SECRET"
        ]);
        expect(axiosMock).toHaveBeenNthCalledWith(1, {
          method: "POST",
          url: `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
          headers: {
            "content-type": "application/json"
          },
          data: {
            grant_type: "client_credentials",
            client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
            client_secret: "gcp secret acquired",
            audience: process.env.AUTH0_AUDIENCE
          }
        });
      });

      it("throw error when fails to fetch token", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "fetch token error";
        axiosMock.mockRejectedValueOnce(new Error(errorMessage));

        await expect(auth0.getUnverifiedUser()).rejects.toThrow(errorMessage);

        expect(consoleLogSpy).toHaveBeenNthCalledWith(
          1,
          "Error fetching token:",
          errorMessage
        );
        expect(consoleLogSpy).toHaveBeenNthCalledWith(
          2,
          "Error fetching unverified users:",
          errorMessage
        );
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
        axiosMock
          .mockReturnValueOnce({ data: { access_token: token } })
          .mockReturnValueOnce({ data: users });

        const result = await auth0.getUnverifiedUser();

        expect(result).toBe(users);
        expect(axiosMock).toHaveBeenNthCalledWith(2, {
          method: "GET",
          url: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users?q=email_verified:false&per_page=100&include_totals=true&page=0`,
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
      });

      it("throw error when fails to fetch token", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "failed to fetch token";
        axiosMock.mockRejectedValueOnce(new Error(errorMessage));

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
        axiosMock
          .mockReturnValueOnce({ data: { access_token: token } })
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
      const token = "managementToken";
      const email = "test@test.com";

      it("normal case", async () => {
        const auth0 = new Auth0Client();
        axiosMock.mockReturnValueOnce({ data: { access_token: token } });

        await auth0.deleteUser({ id: "1", email });

        expect(axiosMock).toHaveBeenNthCalledWith(2, {
          method: "DELETE",
          url: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/1`,
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
      });

      it("throw error when fails to fetch token", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "failed to fetch token";
        axiosMock.mockRejectedValueOnce(new Error(errorMessage));

        await expect(auth0.deleteUser({ id: "1", email })).rejects.toThrowError(
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
          `Error deleting user with ${email}:`
        );
      });

      it("throw error when fails to delete user", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "failed to delete user";
        axiosMock
          .mockReturnValueOnce({ data: { access_token: token } })
          .mockRejectedValueOnce(new Error(errorMessage));

        await expect(auth0.deleteUser({ id: "1", email })).rejects.toThrowError(
          errorMessage
        );
        expect(errorLoggerSpy).toHaveBeenNthCalledWith(
          1,
          new Error(errorMessage),
          `Error deleting user with ${email}:`
        );
      });

      it("request token when error status is 429", async () => {
        const auth0 = new Auth0Client();
        const errorMessage = "failed to delete user";
        const errorObject = new Error(errorMessage);
        const resultMessage = "result";
        (errorObject as any).data = { statusCode: 429 };
        axiosMock
          .mockReturnValueOnce({ data: { access_token: token } })
          .mockRejectedValueOnce(errorObject)
          .mockReturnValueOnce({ data: { access_token: token } })
          .mockReturnValueOnce(resultMessage);

        const result = await auth0.deleteUser({ id: "1", email });

        expect(axiosMock).toHaveBeenCalledTimes(4);
        expect(errorLoggerSpy).toHaveBeenCalledTimes(0);
        expect(result).toBe(resultMessage);
      });
    });
  });
});
