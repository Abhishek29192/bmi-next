import { IncomingHttpHeaders } from "http";
import { Request, Response } from "express";
import { protos } from "@google-cloud/secret-manager";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
// Needed until we upgrade to yarn 2 or use an NPM registry - https://github.com/yarnpkg/yarn/issues/6323
import {
  mockRequest as fetchMockRequest,
  mockResponse,
  mockResponses
} from "../../../../../../libraries/fetch-mocks/src/index";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const validToken = "valid-token";
const locale = "nb-NO";
const recaptchaSecret = "recaptcha-secret";
const managementTokenSecret = "management-token-secret";
const sendGridSecret = "send-grid-secret";

const mockRequest = (
  body: Object = {
    locale: locale,
    recipients: "email@email.com",
    values: { files: ["path/to/file"], a: "b" }
  },
  headers: IncomingHttpHeaders = { "X-Recaptcha-Token": validToken }
): Partial<Request> => fetchMockRequest("POST", headers, "/", body);

const accessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

const getSpace = jest.fn();
const getEnvironment = jest.fn();
const createAsset = jest.fn();
const processForAllLocales = jest.fn();
processForAllLocales.mockResolvedValue({
  fields: { file: { [locale]: { url: "https://localhost" } } }
});
createAsset.mockResolvedValue({ processForAllLocales: processForAllLocales });
getEnvironment.mockResolvedValue({ createAsset: createAsset });
getSpace.mockResolvedValue({ getEnvironment: getEnvironment });
jest.mock("contentful-management", () => ({
  createClient: () => ({
    getSpace: getSpace
  })
}));

const setApiKey = jest.fn();
const send = jest.fn();
jest.mock("@sendgrid/mail", () => {
  const mMailService = jest.fn(() => ({
    setApiKey: setApiKey,
    send: send
  }));
  return { MailService: mMailService };
});

const submit = (request: Partial<Request>, response: Partial<Response>) =>
  require("../index").submit(request, response);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  process.env.CONTENTFUL_SPACE_ID = "TEST_CONTENTFUL_SPACE_ID";
  process.env.CONTENTFUL_ENVIRONMENT = "TEST_CONTENTFUL_ENVIRONMENT";
  process.env.SENDGRID_FROM_EMAIL = "TEST_SENDGRID_FROM_EMAIL";
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("Making an OPTIONS request as part of CORS", () => {
  it("returns a 500 response when CONTENTFUL_SPACE_ID is not set", async () => {
    const originalContentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
    delete process.env.CONTENTFUL_SPACE_ID;

    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.CONTENTFUL_SPACE_ID = originalContentfulSpaceId;
  });

  it("returns a 500 response when CONTENTFUL_ENVIRONMENT is not set", async () => {
    const originalContentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;

    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.CONTENTFUL_ENVIRONMENT = originalContentfulEnvironment;
  });

  it("returns a 500 response when SENDGRID_FROM_EMAIL is not set", async () => {
    const originalSendGridFromEmail = process.env.SENDGRID_FROM_EMAIL;
    delete process.env.SENDGRID_FROM_EMAIL;

    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.SENDGRID_FROM_EMAIL = originalSendGridFromEmail;
  });

  it("returns a 204 response only allowing POST requests", async () => {
    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "POST");
    expect(res.set).toBeCalledWith("Access-Control-Allow-Headers", [
      "Content-Type",
      "X-Recaptcha-Token"
    ]);
    expect(res.set).toBeCalledWith("Access-Control-Max-Age", "3600");
    expect(res.status).toBeCalledWith(204);
    expect(res.send).toBeCalledWith("");
  });
});

describe("Making a POST request", () => {
  it("returns status 500 when CONTENTFUL_SPACE_ID is not set", async () => {
    const originalContentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
    delete process.env.CONTENTFUL_SPACE_ID;

    const req = mockRequest();
    const res = mockResponse();

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(setApiKey).toBeCalledTimes(0);
    expect(send).toBeCalledTimes(0);
    expect(res.set).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.CONTENTFUL_SPACE_ID = originalContentfulSpaceId;
  });

  it("returns status 500 when CONTENTFUL_ENVIRONMENT is not set", async () => {
    const originalContentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;

    const req = mockRequest();
    const res = mockResponse();

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(setApiKey).toBeCalledTimes(0);
    expect(send).toBeCalledTimes(0);
    expect(res.set).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.CONTENTFUL_ENVIRONMENT = originalContentfulEnvironment;
  });

  it("returns status 500 when SENDGRID_FROM_EMAIL is not set", async () => {
    const originalSendGridFromEmail = process.env.SENDGRID_FROM_EMAIL;
    delete process.env.SENDGRID_FROM_EMAIL;

    const req = mockRequest();
    const res = mockResponse();

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(setApiKey).toBeCalledTimes(0);
    expect(send).toBeCalledTimes(0);
    expect(res.set).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.SENDGRID_FROM_EMAIL = originalSendGridFromEmail;
  });

  it("returns status code 400 when the token is missing", async () => {
    const req = mockRequest(
      {
        locale: "no",
        recipients: "email@email.com",
        values: { files: [], a: "b" }
      },
      {}
    );
    const res = mockResponse();

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Token not provided."));
  });

  it("returns status code 400 when the body is not provided", async () => {
    const req = {
      method: "POST",
      headers: { "X-Recaptcha-Token": validToken }
    };
    const res = mockResponse();

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Invalid request."));
  });

  it("returns status code 400 when the body has no 'fields'", async () => {
    const req = mockRequest({
      locale: "no",
      recipients: "email@email.com",
      values: { files: [] }
    });
    const res = mockResponse();

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Fields are empty."));
  });

  it("returns status code 500 when an error is returned from Secret Manager when getting recaptcha key", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(Error("Recaptcha request failed."));
  });

  it("returns status code 500 when the payload is undefined for ReCaptcha secret", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion.mockImplementationOnce(() => [{}]);

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(Error("Recaptcha request failed."));
  });

  it("returns status code 500 when the data is undefined for ReCaptcha secret", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion.mockImplementationOnce(() => [{ payload: {} }]);

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(Error("Recaptcha request failed."));
  });

  it("returns status code 500 when the recaptcha request fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      error: new Error("Expected error")
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(Error("Recaptcha request failed."));
  });

  it("returns status code 400 when the recaptcha returns non-ok response", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: "{}",
      status: 400
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 400 when the recaptcha check fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 400 when the recaptcha score is less than minimum score", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE) - 0.1
      })
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 400 when the token is invalid", async () => {
    const req = mockRequest(
      {
        locale: "nb-NO",
        recipients: "email@email.com",
        values: { files: [], a: "b" }
      },
      {
        "X-Recaptcha-Token": "invalid-token"
      }
    );
    const res = mockResponse();

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=invalid-token`,
      body: JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=invalid-token`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 500 when an error is returned from Secret Manager when getting contentful management token", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockImplementationOnce(() => {
        throw new Error("Expected Error");
      });

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when the payload is undefined for contentful management token secret", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{}]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when the data is undefined for contentful management token secret", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: {} }]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when an error is returned trying to get the space from Contentful", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockImplementationOnce(() => [
        { payload: { data: managementTokenSecret } }
      ]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    getSpace.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when an error is returned trying to get the environment from Contentful", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockImplementationOnce(() => [
        { payload: { data: managementTokenSecret } }
      ]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    getEnvironment.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when getting the sendGrid secret key fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockRejectedValueOnce(Error("Expected Error"));

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when the payload is undefined for sendGrid secret", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockResolvedValueOnce([{}]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when the data is undefined for sendGrid secret", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockResolvedValueOnce([{ payload: {} }]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when creating the asset in Contentful fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockResolvedValueOnce([{ payload: { data: sendGridSecret } }]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    createAsset.mockRejectedValueOnce(Error("Expected Error"));

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith(sendGridSecret);
    expect(createAsset).toBeCalledWith({
      fields: {
        title: {
          [locale]: expect.stringContaining("User upload ")
        },
        file: {
          [locale]: "path/to/file"
        }
      }
    });
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when processing the asset in Contentful for all locales fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockResolvedValueOnce([{ payload: { data: sendGridSecret } }]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    processForAllLocales.mockRejectedValueOnce(Error("Expected Error"));

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith(sendGridSecret);
    expect(createAsset).toBeCalledWith({
      fields: {
        title: {
          [locale]: expect.stringContaining("User upload ")
        },
        file: {
          [locale]: "path/to/file"
        }
      }
    });
    expect(processForAllLocales).toBeCalledTimes(1);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when sending the email request fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockResolvedValueOnce([{ payload: { data: sendGridSecret } }]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    send.mockRejectedValueOnce(Error("Expected Error"));

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith(sendGridSecret);
    expect(createAsset).toBeCalledWith({
      fields: {
        title: {
          [locale]: expect.stringContaining("User upload ")
        },
        file: {
          [locale]: "path/to/file"
        }
      }
    });
    expect(processForAllLocales).toBeCalledTimes(1);
    expect(send).toBeCalledWith({
      to: "email@email.com",
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Website form submission",
      text: JSON.stringify({ a: "b", uploadedAssets: ["https://localhost"] }),
      html: '<ul><li><b>a</b>: "b"</li><li><b>uploadedAssets</b>: ["https://localhost"]</li></ul>'
    });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status 200 when successfully sends email", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockResolvedValueOnce([{ payload: { data: sendGridSecret } }]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith(sendGridSecret);
    expect(createAsset).toBeCalledWith({
      fields: {
        title: {
          [locale]: expect.stringContaining("User upload ")
        },
        file: {
          [locale]: "path/to/file"
        }
      }
    });
    expect(processForAllLocales).toBeCalledTimes(1);
    expect(send).toBeCalledWith({
      to: "email@email.com",
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Website form submission",
      text: JSON.stringify({ a: "b", uploadedAssets: ["https://localhost"] }),
      html: '<ul><li><b>a</b>: "b"</li><li><b>uploadedAssets</b>: ["https://localhost"]</li></ul>'
    });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(200);
  });

  it("returns status 200 when successfully sends email when there are no files", async () => {
    const req = mockRequest({
      locale: locale,
      recipients: "email@email.com",
      values: { files: [], a: "b" }
    });
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockResolvedValueOnce([{ payload: { data: sendGridSecret } }]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith(sendGridSecret);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(send).toBeCalledWith({
      to: "email@email.com",
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Website form submission",
      text: JSON.stringify({ a: "b", uploadedAssets: [] }),
      html: '<ul><li><b>a</b>: "b"</li><li><b>uploadedAssets</b>: []</li></ul>'
    });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(200);
  });

  it("returns status 200 when successfully sends email when the file doesn't have the desired local", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockResolvedValueOnce([{ payload: { data: sendGridSecret } }]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    processForAllLocales.mockResolvedValueOnce({
      fields: { file: { "en-UK": { url: "https://localhost" } } }
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith(sendGridSecret);
    expect(createAsset).toBeCalledWith({
      fields: {
        title: {
          [locale]: expect.stringContaining("User upload ")
        },
        file: {
          [locale]: "path/to/file"
        }
      }
    });
    expect(processForAllLocales).toBeCalledTimes(1);
    expect(send).toBeCalledWith({
      to: "email@email.com",
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Website form submission",
      text: JSON.stringify({ a: "b", uploadedAssets: [] }),
      html: '<ul><li><b>a</b>: "b"</li><li><b>uploadedAssets</b>: []</li></ul>'
    });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(200);
  });

  it("returns status 200 when successfully sends email when the recaptcha header is lowercase", async () => {
    const req = mockRequest(
      {
        locale: locale,
        recipients: "email@email.com",
        values: { files: ["path/to/file"], a: "b" }
      },
      { "x-recaptcha-token": validToken }
    );
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockResolvedValueOnce([{ payload: { data: sendGridSecret } }]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    processForAllLocales.mockResolvedValueOnce({
      fields: { file: { "en-UK": { url: "https://localhost" } } }
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith(sendGridSecret);
    expect(createAsset).toBeCalledWith({
      fields: {
        title: {
          [locale]: expect.stringContaining("User upload ")
        },
        file: {
          [locale]: "path/to/file"
        }
      }
    });
    expect(processForAllLocales).toBeCalledTimes(1);
    expect(send).toBeCalledWith({
      to: "email@email.com",
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Website form submission",
      text: JSON.stringify({ a: "b", uploadedAssets: [] }),
      html: '<ul><li><b>a</b>: "b"</li><li><b>uploadedAssets</b>: []</li></ul>'
    });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(200);
  });

  it("defaults recaptcha minimum score to 1.0 and returns status 200 when successfully sends emai", async () => {
    const originalRecaptchMinimumScore = process.env.RECAPTCHA_MINIMUM_SCORE;
    delete process.env.RECAPTCHA_MINIMUM_SCORE;

    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockResolvedValueOnce([{ payload: { data: sendGridSecret } }]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: "1.0"
      })
    });

    processForAllLocales.mockResolvedValueOnce({
      fields: { file: { "en-UK": { url: "https://localhost" } } }
    });

    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith(sendGridSecret);
    expect(createAsset).toBeCalledWith({
      fields: {
        title: {
          [locale]: expect.stringContaining("User upload ")
        },
        file: {
          [locale]: "path/to/file"
        }
      }
    });
    expect(processForAllLocales).toBeCalledTimes(1);
    expect(send).toBeCalledWith({
      to: "email@email.com",
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Website form submission",
      text: JSON.stringify({ a: "b", uploadedAssets: [] }),
      html: '<ul><li><b>a</b>: "b"</li><li><b>uploadedAssets</b>: []</li></ul>'
    });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(200);

    process.env.RECAPTCHA_MINIMUM_SCORE = originalRecaptchMinimumScore;
  });

  it("only gets Recaptcha secret, Contentful environment and Send Grid secret once regardless of number of requests", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockResolvedValueOnce([{ payload: { data: managementTokenSecret } }])
      .mockResolvedValueOnce([{ payload: { data: sendGridSecret } }]);

    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await submit(req, res);
    await submit(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith(sendGridSecret);
    expect(createAsset).toBeCalledWith({
      fields: {
        title: {
          [locale]: expect.stringContaining("User upload ")
        },
        file: {
          [locale]: "path/to/file"
        }
      }
    });
    expect(processForAllLocales).toBeCalledTimes(2);
    expect(send).toBeCalledWith({
      to: "email@email.com",
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Website form submission",
      text: JSON.stringify({ a: "b", uploadedAssets: ["https://localhost"] }),
      html: '<ul><li><b>a</b>: "b"</li><li><b>uploadedAssets</b>: ["https://localhost"]</li></ul>'
    });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.set).toBeCalledTimes(2);
    expect(res.sendStatus).toBeCalledWith(200);
    expect(res.sendStatus).toBeCalledTimes(2);
    expect(accessSecretVersion).toBeCalledTimes(3);
  });
});
