import fs from "fs";
import os from "os";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { protos } from "@google-cloud/secret-manager";
import { mockRequest, mockResponse, mockResponses } from "@bmi/fetch-mocks";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const mockDocument = (
  href = `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
  name = "file.pdf"
) => ({ href, name });

const recaptchaSecret = "recaptcha-secret";

const accessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

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
const temporaryFile = `${os.tmpdir()}/gcp-download-zip.zip`;

const download = (req: Partial<Request>, res: Partial<Response>) =>
  require("../index").download(req, res);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

afterEach(() => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.existsSync(temporaryFile) &&
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.unlinkSync(temporaryFile);
});

describe("Invalid environment variables", () => {
  it("should return 500 if GCS_NAME is not set", async () => {
    const gcsName = process.env.GCS_NAME;
    delete process.env.GCS_NAME;

    const req = mockRequest("POST");
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);
    expect(bucket).toBeCalledTimes(0);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);

    process.env.GCS_NAME = gcsName;
  });
});

describe("Making an OPTIONS request as part of CORS", () => {
  it("returns a 204 response only allowing POST requests", async () => {
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
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });
});

describe("Making a POST request", () => {
  it("returns status code 400 when the body is not sent", async () => {
    const req = mockRequest("POST");
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Invalid request.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when the body is empty", async () => {
    const req = mockRequest("POST", {}, "/", {});
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("List of documents not provided.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when the documents list is empty", async () => {
    const req = mockRequest("POST", { "X-Recaptcha-Token": validToken }, "/", {
      documents: []
    });
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("List of documents not provided.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when the token is missing", async () => {
    const req = mockRequest("POST", {}, "/", { documents: [mockDocument()] });
    const res = mockResponse();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Token not provided.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when a document provided is from an invalid URL", async () => {
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
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when a document provided is missing name", async () => {
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
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when a document provided is missing href", async () => {
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
    expect(file).toBeCalledTimes(0);
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 500 when an error is returned from Secret Manager when getting recaptcha key", async () => {
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

    accessSecretVersion.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith("Recaptcha request failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 500 when response is missing payload when getting recaptcha key", async () => {
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

    accessSecretVersion.mockImplementationOnce(() => [{}]);

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith("Recaptcha request failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 500 when response is missing data when getting recaptcha key", async () => {
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

    accessSecretVersion.mockImplementationOnce(() => [{ payload: {} }]);

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith("Recaptcha request failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toBeCalledTimes(0);
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 500 when the recaptcha request fails", async () => {
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

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      method: "POST",
      body: "{}",
      error: new Error("Expected Error")
    });

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith("Recaptcha request failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when the recaptcha request returns a non-ok response", async () => {
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

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      method: "POST",
      body: "{}",
      status: 400
    });

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Recaptcha check failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when the recaptcha check fails", async () => {
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

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      method: "POST",
      body: JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Recaptcha check failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when the recaptcha score is less than minimum score", async () => {
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

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      method: "POST",
      body: JSON.stringify({
        success: true,
        score: parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!) - 0.1
      })
    });

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Recaptcha check failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when the token is invalid", async () => {
    const req = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": "invalid-token"
      },
      "/",
      {
        documents: [mockDocument()]
      }
    );
    const res = mockResponse();

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=invalid-token`,
      method: "POST",
      body: JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Recaptcha check failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=invalid-token`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 500 when document fetch request fails", async () => {
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

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(
      fetchMock,
      {
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        method: "POST",
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        }),
        status: 200
      },
      {
        url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
        method: "GET",
        body: JSON.stringify("Failed to get document"),
        error: new Error("Expected Error")
      }
    );
    createWriteStream.mockImplementation(() =>
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.createWriteStream(temporaryFile)
    );
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith("Failed to add a doument to the zip file.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
  });

  it("returns status code 500 when creating write stream throws error", async () => {
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

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(
      fetchMock,
      {
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        method: "POST",
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
        method: "GET",
        body: JSON.stringify(""),
        status: 400
      }
    );
    createWriteStream.mockImplementation(() => {
      throw Error("Expected error");
    });
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(Error("Expected error"));
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetchedTimes(1);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 200 when document fetch request returns a non-ok response", async () => {
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

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(
      fetchMock,
      {
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        method: "POST",
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
        method: "GET",
        body: JSON.stringify(""),
        status: 400
      }
    );
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
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
  });

  it("returns status code 200 when successfully created zip file when lowercase recaptcha header is used", async () => {
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

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(
      fetchMock,
      {
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        method: "POST",
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
        method: "GET",
        body: "Some value"
      }
    );
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
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
  });

  it("defaults RECAPTCHA_MINIMUM_SCORE to 1.0 and returns status code 200 when successfully created zip file", async () => {
    const recaptchaMinimumScore = process.env.RECAPTCHA_MINIMUM_SCORE;
    delete process.env.RECAPTCHA_MINIMUM_SCORE;

    const failReq = mockRequest(
      "POST",
      {
        "X-Recaptcha-Token": `${validToken}0.9`
      },
      "/",
      {
        documents: [mockDocument()]
      }
    );
    const res = mockResponse();

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(
      fetchMock,
      {
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}0.9`,
        method: "POST",
        body: JSON.stringify({
          success: true,
          score: 0.9
        })
      },
      {
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}1.0`,
        method: "POST",
        body: JSON.stringify({
          success: true,
          score: 1.0
        })
      },
      {
        url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
        method: "GET",
        body: "Some value"
      }
    );
    createWriteStream.mockImplementation(() =>
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.createWriteStream(temporaryFile)
    );
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(failReq, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Recaptcha check failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}0.9`,
      { method: "POST" }
    );

    const passReq = mockRequest(
      failReq.method!,
      {
        "X-Recaptcha-Token": `${validToken}1.0`
      },
      failReq.url,
      failReq.body
    );

    await download(passReq, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.send).toBeCalledWith({ url: "https://somewhere/file.zip" });
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}1.0`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);

    process.env.RECAPTCHA_MINIMUM_SCORE = recaptchaMinimumScore;
  });

  it("returns status code 200 when successfully created zip file", async () => {
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

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(
      fetchMock,
      {
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        method: "POST",
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
        method: "GET",
        body: "Some value"
      }
    );
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
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
  });

  it("only gets Recaptcha secret once regardless of number of requests", async () => {
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

    accessSecretVersion.mockResolvedValueOnce([
      { payload: { data: recaptchaSecret } }
    ]);

    mockResponses(
      fetchMock,
      {
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        method: "POST",
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
        method: "GET",
        body: "Some value"
      }
    );
    createWriteStream.mockImplementation(() =>
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.createWriteStream(temporaryFile)
    );
    publicUrl.mockImplementation(() => "https://somewhere/file.zip");

    await download(req, res);
    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledTimes(0);
    expect(res.send).toBeCalledWith({ url: "https://somewhere/file.zip" });
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.RECAPTCHA_SECRET_KEY}/versions/latest`
    });
    expect(accessSecretVersion).toBeCalledTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(2);
    expect(fetchMock).toHaveFetched(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(2);
  });
});
