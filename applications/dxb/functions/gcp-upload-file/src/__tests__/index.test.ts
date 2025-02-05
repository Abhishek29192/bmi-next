/* eslint-disable security/detect-non-literal-fs-filename */
import { readFileSync } from "fs";
import { IncomingHttpHeaders } from "http";
import path from "path";
import {
  mockRequest as fetchMockRequest,
  mockResponse
} from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const resourcesBasePath = `${path.resolve(__dirname)}/resources`;
const validToken = "valid-token";
const recaptchaSecret = "recaptcha-secret";

const verifyRecaptchaToken = jest.fn();
jest.mock("@bmi/functions-recaptcha", () => ({
  verifyRecaptchaToken: verifyRecaptchaToken
}));

const mockRequest = (
  body: Buffer | Record<string, unknown> = readFileSync(
    `${resourcesBasePath}/blank.jpeg`
  ),
  headers: IncomingHttpHeaders = { "X-Recaptcha-Token": validToken }
): Partial<Request> =>
  fetchMockRequest({ method: "POST", headers, url: "/", body });

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

const upload = async (request: Partial<Request>, response: Partial<Response>) =>
  (await import("../index")).upload(request as Request, response as Response);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("Making an OPTIONS request as part of CORS", () => {
  it("returns a 500 response if CONTENTFUL_SPACE_ID is not set", async () => {
    const originalContentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
    delete process.env.CONTENTFUL_SPACE_ID;

    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await upload(req, res);

    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toHaveBeenCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.CONTENTFUL_SPACE_ID = originalContentfulSpaceId;
  });

  it("returns a 500 response if CONTENTFUL_ENVIRONMENT is not set", async () => {
    const originalContentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;

    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await upload(req, res);

    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toHaveBeenCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.CONTENTFUL_ENVIRONMENT = originalContentfulEnvironment;
  });

  it("returns a 500 response if CONTENTFUL_MANAGEMENT_TOKEN is not set", async () => {
    const originalContentfulManagementTokenSecret =
      process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    delete process.env.CONTENTFUL_MANAGEMENT_TOKEN;

    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await upload(req, res);

    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toHaveBeenCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.CONTENTFUL_MANAGEMENT_TOKEN =
      originalContentfulManagementTokenSecret;
  });

  it("returns a 500 response if RECAPTCHA_KEY is not set", async () => {
    const originalRecaptchaSecretKey = process.env.RECAPTCHA_KEY;
    delete process.env.RECAPTCHA_KEY;

    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await upload(req, res);

    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toHaveBeenCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.RECAPTCHA_KEY = originalRecaptchaSecretKey;
  });

  it("returns a 204 response only allowing POST requests", async () => {
    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await upload(req, res);

    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "POST");
    expect(res.set).toBeCalledWith("Access-Control-Allow-Headers", [
      "Authorization",
      "Content-Type",
      "X-Recaptcha-Token"
    ]);
    expect(res.set).toBeCalledWith("Access-Control-Max-Age", "3600");
    expect(res.status).toBeCalledWith(204);
    expect(res.send).toBeCalledWith("");
  });
});

describe("Making a POST request", () => {
  it("returns status code 500 if CONTENTFUL_SPACE_ID has not been set", async () => {
    const originalContentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
    delete process.env.CONTENTFUL_SPACE_ID;

    const req = mockRequest();
    const res = mockResponse();

    await upload(req, res);

    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toHaveBeenCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.CONTENTFUL_SPACE_ID = originalContentfulSpaceId;
  });

  it("returns status code 500 if CONTENTFUL_ENVIRONMENT has not been set", async () => {
    const originalContentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;

    const req = mockRequest();
    const res = mockResponse();

    await upload(req, res);

    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toHaveBeenCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.CONTENTFUL_ENVIRONMENT = originalContentfulEnvironment;
  });

  it("returns status code 400 when the token is missing", async () => {
    const req = mockRequest(
      readFileSync(`${resourcesBasePath}/blank.jpeg`),
      {}
    );
    const res = mockResponse();

    await upload(req, res);

    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Token not provided."));
  });

  it("returns status code 400 when the body is not a Buffer", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await upload(req, res);

    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(
      Error("Endpoint only accepts file buffers")
    );
  });

  it("returns status code 400 when the recaptcha check fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    verifyRecaptchaToken.mockRejectedValueOnce(Error("Expected error"));

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 400 when the qaAuthToken is invalid", async () => {
    process.env.QA_AUTH_TOKEN = "qaAuthToken";
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.jpeg`), {
      "X-Recaptcha-Token": undefined,
      authorization: "Bearer qaAuthTokenFailed"
    });
    const res = mockResponse();

    await upload(req, res);

    expect(verifyRecaptchaToken).not.toBeCalled();
    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("QaAuthToken failed."));
    process.env.QA_AUTH_TOKEN = undefined;
  });

  it("returns status code 406 when the type of file to be uploaded is not allowed", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.gif`));
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(406);
    expect(res.send).toBeCalledWith(
      Error(`Cannot upload files of type image/gif`)
    );
  });

  it("returns status code 406 when the type of file to be uploaded is not allowed, even if filename is valid", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/not-png.png`));
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(getSpace).toHaveBeenCalledTimes(0);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(406);
    expect(res.send).toBeCalledWith(
      Error(`Cannot upload files of type undefined`)
    );
  });

  it("returns status code 500 when an error is returned trying to get the space from Contentful", async () => {
    const req = mockRequest();
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    getSpace.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toHaveBeenCalledTimes(0);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when an error is returned trying to get the environment from Contentful", async () => {
    const req = mockRequest();
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    getEnvironment.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toHaveBeenCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns upload status from request to Contentful for pdf", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.pdf`));
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);
  });

  it("returns upload status from request to Contentful for jpg", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.jpg`));
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);
  });

  it("returns upload status from request to Contentful for jpeg", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.jpeg`));
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);
  });

  it("returns upload status from request to Contentful for png", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.png`));
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);
  });

  it("returns upload status from request to Contentful for png, even if filename is different", async () => {
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank-png.txt`));
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
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

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);
  });

  it("returns status 200 and defaults RECAPTCHA_MINIMUM_SCORE to 1.0", async () => {
    const originalRecaptchaMinimumScore = process.env.RECAPTCHA_MINIMUM_SCORE;
    delete process.env.RECAPTCHA_MINIMUM_SCORE;

    const req = mockRequest();
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      1.0
    );
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);

    process.env.RECAPTCHA_MINIMUM_SCORE = originalRecaptchaMinimumScore;
  });

  it("only gets Contentful environment once regardless of number of requests", async () => {
    const req = mockRequest();
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);
    await upload(req, res);

    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getSpace).toHaveBeenCalledTimes(1);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(getEnvironment).toHaveBeenCalledTimes(1);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(createUpload).toHaveBeenCalledTimes(2);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.set).toHaveBeenCalledTimes(2);
    expect(res.send).toBeCalledWith(uploadResponse);
    expect(res.send).toHaveBeenCalledTimes(2);
  });

  it("returns status 200 when authorization header is used", async () => {
    process.env.QA_AUTH_TOKEN = "qaAuthToken";
    const req = mockRequest(readFileSync(`${resourcesBasePath}/blank.jpeg`), {
      "x-recaptcha-token": undefined,
      authorization: "Bearer qaAuthToken"
    });
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    const uploadResponse = {
      expected: "response"
    };
    createUpload.mockResolvedValueOnce(uploadResponse);

    await upload(req, res);

    expect(verifyRecaptchaToken).not.toBeCalled();
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createUpload).toBeCalledWith({ file: req.body });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith(uploadResponse);
  });
});
