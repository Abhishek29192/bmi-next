import { readFileSync } from "fs";
import { IncomingHttpHeaders } from "http";
import { Request, Response } from "express";
import { protos } from "@google-cloud/secret-manager";
import mockConsole from "jest-mock-console";
import fetchMock from "jest-fetch-mock";

const resourcesBasePath = "functions/gcp-upload-file/src/__tests__/resources";
const validToken = "valid-token";
const recaptchaSecret = "recaptcha-secret";
const managementTokenSecret = "management-token-secret";

const mockRequest = (
  body: Buffer | Object = readFileSync(`${resourcesBasePath}/blank.jpeg`),
  headers: IncomingHttpHeaders = { "X-Recaptcha-Token": validToken }
): Partial<Request> => {
  return {
    method: "POST",
    body: body,
    headers: headers
  };
};

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  return res;
};

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
const createUpload = jest.fn();
getSpace.mockImplementation(() => ({
  getEnvironment: getEnvironment
}));
getEnvironment.mockImplementation(() => ({ createUpload: createUpload }));
jest.mock("contentful-management", () => ({
  createClient: () => ({
    getSpace: getSpace
  })
}));
let upload;

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  const index = require("../index");
  upload = index.upload;
});

describe("Making an OPTIONS request as part of CORS", () => {
  it("returns a 204 response only allowing POST requests", async () => {
    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
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
  it("returns status code 400 when the token is missing", async () => {
    const req = mockRequest(
      readFileSync(`${resourcesBasePath}/blank.jpeg`),
      {}
    );
    const res = mockResponse();

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Token not provided."));
  });

  it("returns status code 400 when the body is not a Buffer", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(
      Error("Endpoint only accepts file buffers")
    );
  });

  it("returns status code 500 when an error is returned from Secret Manager when getting recaptcha key", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
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
    fetchMock.mockRejectOnce();

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(Error("Recaptcha request failed."));
  });

  it("returns status code 400 when the recaptcha request returns a non-ok response", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);
    fetchMock.mockResponse("{}", { status: 400 });

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE) - 0.1
      })
    );

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 400 when the token is invalid", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.jpeg`), {
      "X-Recaptcha-Token": "invalid-token"
    });
    const res = mockResponse();

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    fetchMock.mockResponse(
      JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=invalid-token`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 406 when the type of file to be uploaded is not allowed", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.gif`));
    const res = mockResponse();

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(406);
    expect(res.send).toBeCalledWith(
      Error(`Cannot upload files of type image/gif`)
    );
  });

  it("returns status code 406 when the type of file to be uploaded is not allowed, even if filename is valid", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/not-png.png`));
    const res = mockResponse();

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(406);
    expect(res.send).toBeCalledWith(
      Error(`Cannot upload files of type undefined`)
    );
  });

  it("returns status code 500 when an error is returned from Secret Manager when getting contentful management token", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockImplementationOnce(() => {
        throw new Error("Expected Error");
      });

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    getSpace.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createUpload).toBeCalledTimes(0);
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    getEnvironment.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns upload status from request to Contentful for pdf", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.pdf`));
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockImplementationOnce(() => [
        { payload: { data: managementTokenSecret } }
      ]);

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);
  });

  it("returns upload status from request to Contentful for jpg", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.jpg`));
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockImplementationOnce(() => [
        { payload: { data: managementTokenSecret } }
      ]);

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);
  });

  it("returns upload status from request to Contentful for jpeg", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.jpeg`));
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockImplementationOnce(() => [
        { payload: { data: managementTokenSecret } }
      ]);

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);
  });

  it("returns upload status from request to Contentful for png", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.png`));
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockImplementationOnce(() => [
        { payload: { data: managementTokenSecret } }
      ]);

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);
  });

  it("returns upload status from request to Contentful for png, even if filename is different", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank-png.txt`));
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockImplementationOnce(() => [
        { payload: { data: managementTokenSecret } }
      ]);

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);
  });

  it("returns status 200 with lowercase recaptcha header", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.jpeg`), {
      "x-recaptcha-token": validToken
    });
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockImplementationOnce(() => [
        { payload: { data: managementTokenSecret } }
      ]);

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);
    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(accessSecretVersion).toBeCalledTimes(2);
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getSpace).toBeCalledTimes(1);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(getEnvironment).toBeCalledTimes(1);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(createUpload).toBeCalledTimes(2);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.set).toBeCalledTimes(2);
    expect(res.send).toBeCalledWith(uploadResponse);
    expect(res.send).toBeCalledTimes(2);
  });

  it("only gets Recaptcha secret and Contentful environment once regardless of number of requests", async () => {
    const req = mockRequest();
    const res = mockResponse();

    accessSecretVersion
      .mockResolvedValueOnce([{ payload: { data: recaptchaSecret } }])
      .mockImplementationOnce(() => [
        { payload: { data: managementTokenSecret } }
      ]);

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);
    await upload(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(accessSecretVersion).toBeCalledTimes(2);
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getSpace).toBeCalledTimes(1);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(getEnvironment).toBeCalledTimes(1);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(createUpload).toBeCalledTimes(2);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.set).toBeCalledTimes(2);
    expect(res.send).toBeCalledWith(uploadResponse);
    expect(res.send).toBeCalledTimes(2);
  });
});
