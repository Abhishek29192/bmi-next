import fs, { PathLike } from "fs";
import os from "os";
import path from "path";
import {
  mockRequest,
  mockResponse,
  mockResponses
} from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const mockDocument = (
  href = `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
  name = "file.pdf"
) => ({ href, name });

const recaptchaSecret = "recaptcha-secret";

const verifyRecaptchaToken = jest.fn();
jest.mock("@bmi/functions-recaptcha", () => ({
  verifyRecaptchaToken: verifyRecaptchaToken
}));

const createWriteStream = jest.fn();
const publicUrl = jest.fn();
const file = jest.fn().mockImplementation(() => ({
  createWriteStream: createWriteStream,
  publicUrl: publicUrl
}));
const bucket = jest.fn().mockImplementation(() => ({
  file: file
}));
jest.mock("@google-cloud/storage", () => {
  const mStorage = jest.fn(() => ({
    bucket: (bucketName: string) => bucket(bucketName)
  }));
  return { Storage: mStorage };
});

const validToken = "valid-token";

const download = async (req: Partial<Request>, res: Partial<Response>) =>
  (await import("../index")).download(req as Request, res as Response);

const createTemporaryFilename = () =>
  `${fs.mkdtempSync(path.join(os.tmpdir(), "test-"))}/gcp-download-zip.zip`;

const temporaryFileContents = (temporaryFile: PathLike) =>
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.existsSync(temporaryFile)
    ? // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.readFileSync(temporaryFile).toString()
    : undefined;

const deleteTemporaryFile = (temporaryFile: PathLike) =>
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.existsSync(temporaryFile) && fs.unlinkSync(temporaryFile);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("Invalid environment variables", () => {
  it("should return 500 if GCS_NAME is not set", async () => {
    const gcsName = process.env.GCS_NAME;
    delete process.env.GCS_NAME;
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest("POST");
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(bucket).toBeCalledTimes(0);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
    process.env.GCS_NAME = gcsName;
  });

  it("should return 500 if RECAPTCHA_KEY is not set", async () => {
    const recaptchaSecretKey = process.env.RECAPTCHA_KEY;
    delete process.env.RECAPTCHA_KEY;
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest("POST");
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
    process.env.RECAPTCHA_KEY = recaptchaSecretKey;
  });
});

describe("Making an OPTIONS request as part of CORS", () => {
  it("returns a 204 response only allowing POST requests", async () => {
    const temporaryFile = createTemporaryFilename();

    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "POST");
    expect(res.set).toBeCalledWith("Access-Control-Allow-Headers", [
      "Content-Type",
      "X-Recaptcha-Token"
    ]);
    expect(res.set).toBeCalledWith("Access-Control-Max-Age", "3600");
    expect(res.status).toBeCalledWith(204);
    expect(res.send).toBeCalledWith("");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
  });
});

describe("Making a POST request", () => {
  it("returns status code 400 when the body is not sent", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest("POST");
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Invalid request.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
  });

  it("returns status code 400 when the body is empty", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest("POST", {}, "/", {});
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("List of documents not provided.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
  });

  it("returns status code 400 when the documents list is empty", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest("POST", { "X-Recaptcha-Token": validToken }, "/", {
      documents: []
    });
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("List of documents not provided.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
  });

  it("returns status code 400 when the token is missing", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest("POST", {}, "/", { documents: [mockDocument()] });
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Token not provided.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
  });

  it("returns status code 400 when a document provided is from an invalid URL", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": validToken
      },
      "/",
      {
        documents: [mockDocument("invalid-href")]
      }
    );
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Invalid host(s).");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
  });

  it("returns status code 400 when a document provided is missing name", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": validToken
      },
      "/",
      {
        documents: [{ href: `https://${process.env.DXB_VALID_HOSTS}/file.pdf` }]
      }
    );
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing name(s).");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
  });

  it("returns status code 400 when a document provided is missing href", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": validToken
      },
      "/",
      {
        documents: [{ name: "file.pdf" }]
      }
    );
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing HREF(s).");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
  });

  it("returns status code 400 when the recaptcha check fails", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": validToken
      },
      "/",
      {
        documents: [mockDocument()]
      }
    );
    const res = mockResponse();

    verifyRecaptchaToken.mockRejectedValueOnce(Error("Expected error"));

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Recaptcha check failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
  });

  it("returns status code 400 when the qaAuthToken is invalid", async () => {
    const temporaryFile = createTemporaryFilename();
    process.env.QA_AUTH_TOKEN = "qaAuthToken";

    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": undefined,
        authorization: "Bearer qaAuthTokenFailed"
      },
      "/",
      {
        documents: [mockDocument()]
      }
    );
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("QaAuthToken failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(file).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
    process.env.QA_AUTH_TOKEN = undefined;
  });

  it("returns status code 500 when document fetch request fails", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": validToken
      },
      "/",
      {
        documents: [
          mockDocument(`https://${process.env.DXB_VALID_HOSTS}/file.pdf`)
        ]
      }
    );
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    mockResponses(fetchMock, {
      url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
      method: "GET",
      body: JSON.stringify("Failed to get document"),
      error: new Error("Expected Error")
    });
    createWriteStream.mockImplementation(() =>
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.createWriteStream(temporaryFile)
    );
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(
      "Failed to add a document to the zip file."
    );
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual("");

    deleteTemporaryFile(temporaryFile);
  });

  it("returns status code 500 when creating write stream throws error", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": validToken
      },
      "/",
      {
        documents: [
          mockDocument(`https://${process.env.DXB_VALID_HOSTS}/file.pdf`)
        ]
      }
    );
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    mockResponses(fetchMock, {
      url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
      method: "GET",
      body: JSON.stringify(""),
      status: 400
    });
    createWriteStream.mockImplementation(() => {
      throw Error("Expected error");
    });
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(Error("Expected error"));
    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
    expect(temporaryFileContents(temporaryFile)).toStrictEqual(undefined);

    deleteTemporaryFile(temporaryFile);
  });

  it("returns status code 200 when document fetch request returns a non-ok response", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": validToken
      },
      "/",
      {
        documents: [
          mockDocument(`https://${process.env.DXB_VALID_HOSTS}/file.pdf`)
        ]
      }
    );
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    mockResponses(fetchMock, {
      url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
      method: "GET",
      body: "",
      status: 400
    });

    createWriteStream.mockImplementation(() =>
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.createWriteStream(temporaryFile)
    );
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledTimes(0);
    expect(res.send).toBeCalledWith({ url: "https://somewhere/file.zip" });
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
    expect(temporaryFileContents(temporaryFile)!.length).toBeGreaterThan(0);

    deleteTemporaryFile(temporaryFile);
  });

  it("returns status code 200 when successfully created zip file when lowercase recaptcha header is used", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest(
      "POST",
      {
        "x-recaptcha-token": validToken
      },
      "/",
      {
        documents: [mockDocument()]
      }
    );
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    mockResponses(fetchMock, {
      url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
      method: "GET",
      body: "Some value"
    });
    createWriteStream.mockImplementation(() =>
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.createWriteStream(temporaryFile)
    );
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledTimes(0);
    expect(res.send).toBeCalledWith({ url: "https://somewhere/file.zip" });
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
    expect(temporaryFileContents(temporaryFile)!.length).toBeGreaterThan(0);

    deleteTemporaryFile(temporaryFile);
  });

  it("defaults RECAPTCHA_MINIMUM_SCORE to 1.0 and returns status code 200 when successfully created zip file", async () => {
    const recaptchaMinimumScore = process.env.RECAPTCHA_MINIMUM_SCORE;
    delete process.env.RECAPTCHA_MINIMUM_SCORE;
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": validToken
      },
      "/",
      {
        documents: [mockDocument()]
      }
    );
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    mockResponses(fetchMock, {
      url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
      method: "GET",
      body: "Some value"
    });

    createWriteStream.mockImplementation(() =>
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.createWriteStream(temporaryFile)
    );
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith({ url: "https://somewhere/file.zip" });
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      1.0
    );
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
    expect(temporaryFileContents(temporaryFile)!.length).toBeGreaterThan(0);

    deleteTemporaryFile(temporaryFile);
    process.env.RECAPTCHA_MINIMUM_SCORE = recaptchaMinimumScore;
  });

  it("returns status code 200 when successfully created zip file", async () => {
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": validToken
      },
      "/",
      {
        documents: [mockDocument()]
      }
    );
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValue(undefined);

    mockResponses(fetchMock, {
      url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
      method: "GET",
      body: "Some value"
    });
    createWriteStream.mockImplementation(() =>
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.createWriteStream(temporaryFile)
    );
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledTimes(0);
    expect(res.send).toBeCalledWith({ url: "https://somewhere/file.zip" });
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
    expect(temporaryFileContents(temporaryFile)!.length).toBeGreaterThan(0);

    deleteTemporaryFile(temporaryFile);
  });

  it("allows all hosts when DXB_VALID_HOSTS is not provided", async () => {
    const dxbValidHosts = process.env.DXB_VALID_HOSTS;
    delete process.env.DXB_VALID_HOSTS;
    const temporaryFile = createTemporaryFilename();

    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": validToken
      },
      "/",
      {
        documents: [mockDocument("https://somewhere/file.pdf")]
      }
    );
    const res = mockResponse();

    verifyRecaptchaToken.mockResolvedValueOnce(undefined);

    mockResponses(fetchMock, {
      url: "https://somewhere/file.pdf",
      method: "GET",
      body: "Some value"
    });
    createWriteStream.mockImplementation(() =>
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.createWriteStream(temporaryFile)
    );
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledTimes(0);
    expect(res.send).toBeCalledWith({ url: "https://somewhere/file.zip" });
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledWith(
      validToken,
      recaptchaSecret,
      parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!)
    );
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched("https://somewhere/file.pdf");
    expect(publicUrl).toBeCalledTimes(1);
    expect(temporaryFileContents(temporaryFile)!.length).toBeGreaterThan(0);

    deleteTemporaryFile(temporaryFile);
    process.env.DXB_VALID_HOSTS = dxbValidHosts;
  });

  it("returns status code 200 when successfully created zip file when authorization header is used", async () => {
    const temporaryFile = createTemporaryFilename();
    process.env.QA_AUTH_TOKEN = "qaAuthToken";

    const req = mockRequest(
      "POST",
      {
        "x-recaptcha-token": undefined,
        authorization: "Bearer qaAuthToken"
      },
      "/",
      {
        documents: [mockDocument()]
      }
    );
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
      method: "GET",
      body: "Some value"
    });
    createWriteStream.mockImplementation(() =>
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.createWriteStream(temporaryFile)
    );
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledTimes(0);
    expect(res.send).toBeCalledWith({ url: "https://somewhere/file.zip" });
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(verifyRecaptchaToken).toBeCalledTimes(0);
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
    expect(temporaryFileContents(temporaryFile)!.length).toBeGreaterThan(0);

    deleteTemporaryFile(temporaryFile);
    process.env.QA_AUTH_TOKEN = undefined;
  });
});
