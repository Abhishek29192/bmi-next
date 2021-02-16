import fs from "fs";
import { Request, Response } from "express";
import mockConsole from "jest-mock-console";
import fetchMock from "jest-fetch-mock";

const mockRequest = (body?, headers = {}): Partial<Request> => {
  return {
    method: "POST",
    body: body,
    headers: headers
  };
};

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.send = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

const mockDocument = (
  href = `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
  name = "file.pdf"
) => ({
  href: href,
  name: name
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
const temporaryFile = "/tmp/gcp-download-zip.zip";

let download;

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.resetMocks();
  const index = require("../index");
  download = index.download;
});

afterEach(() => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.access(temporaryFile, (err) => err || fs.unlinkSync(temporaryFile));
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
    expect(res.set).toBeCalledWith(
      "Access-Control-Allow-Headers",
      "Content-Type"
    );
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
    const req = mockRequest();
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
    const req = mockRequest({});
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
    const req = mockRequest(
      { documents: [] },
      { "X-Recaptcha-Token": validToken }
    );
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
    const req = mockRequest({ documents: [mockDocument()] });
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
      {
        documents: [mockDocument("invalid-href")]
      },
      {
        "X-Recaptcha-Token": validToken
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

  it("returns status code 500 when the recaptcha request fails", async () => {
    const req = mockRequest(
      {
        documents: [mockDocument()]
      },
      {
        "X-Recaptcha-Token": validToken
      }
    );
    const res = mockResponse();

    fetchMock.mockRejectOnce();

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith("Recaptcha request failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when the recaptcha request returns a non-ok response", async () => {
    const req = mockRequest(
      {
        documents: [mockDocument()]
      },
      {
        "X-Recaptcha-Token": validToken
      }
    );
    const res = mockResponse();

    fetchMock.mockResponse("{}", { status: 400 });

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Recaptcha check failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when the recaptcha check fails", async () => {
    const req = mockRequest(
      {
        documents: [mockDocument()]
      },
      {
        "X-Recaptcha-Token": validToken
      }
    );
    const res = mockResponse();

    fetchMock.mockResponse(
      JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Recaptcha check failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when the recaptcha score is less than minimum score", async () => {
    const req = mockRequest(
      {
        documents: [mockDocument()]
      },
      {
        "X-Recaptcha-Token": validToken
      }
    );
    const res = mockResponse();

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE) - 0.1
      })
    );

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Recaptcha check failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 400 when the token is invalid", async () => {
    const req = mockRequest(
      {
        documents: [mockDocument()]
      },
      {
        "X-Recaptcha-Token": "invalid-token"
      }
    );
    const res = mockResponse();

    fetchMock.mockResponse(
      JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await download(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Recaptcha check failed.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file).toBeCalledTimes(0);
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=invalid-token`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledTimes(0);
    expect(createWriteStream).toBeCalledTimes(0);
    expect(publicUrl).toBeCalledTimes(0);
  });

  it("returns status code 500 when document fetch request fails", async () => {
    const req = mockRequest(
      {
        documents: [
          mockDocument(`https://${process.env.DXB_VALID_HOSTS}/file.pdf`)
        ]
      },
      {
        "X-Recaptcha-Token": validToken
      }
    );
    const res = mockResponse();

    mockResponses(
      {
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        }),
        status: 200
      },
      {
        url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
        body: JSON.stringify("Failed to get document"),
        error: true
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
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toBeCalledWith(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
  });

  it("returns status code 500 when document fetch request returns a non-ok response", async () => {
    const req = mockRequest(
      {
        documents: [
          mockDocument(`https://${process.env.DXB_VALID_HOSTS}/file.pdf`)
        ]
      },
      {
        "X-Recaptcha-Token": validToken
      }
    );
    const res = mockResponse();

    mockResponses(
      {
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        }),
        status: 200
      },
      {
        url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
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
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith("Failed to add a doument to the zip file.");
    expect(bucket).toBeCalledWith(process.env.GCS_NAME);
    expect(file.mock.calls[0][0].endsWith(".zip")).toBeTruthy();
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toBeCalledWith(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
  });

  it("returns status code 200 when successfully created zip file", async () => {
    const req = mockRequest(
      {
        documents: [mockDocument()]
      },
      {
        "X-Recaptcha-Token": validToken
      }
    );
    const res = mockResponse();

    mockResponses(
      {
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        }),
        status: 200
      },
      {
        url: `https://${process.env.DXB_VALID_HOSTS}/file.pdf`,
        body: "Some value",
        status: 200
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
    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.setHeader).toBeCalledWith("Content-type", "application/json");
    expect(createWriteStream).toBeCalledTimes(1);
    expect(fetchMock).toBeCalledWith(
      `https://${process.env.DXB_VALID_HOSTS}/file.pdf`
    );
    expect(publicUrl).toBeCalledTimes(1);
  });
});

interface MockedResponse {
  url: string;
  body: string;
  status?: number;
  error?: boolean;
}

const mockResponses = (...mockedResponses: MockedResponse[]) => {
  fetchMock.mockResponse((request) => {
    for (let mockedResponse of mockedResponses) {
      if (request.url === mockedResponse.url) {
        if (mockedResponse.error) {
          return Promise.reject(mockedResponse.body);
        }
        return Promise.resolve({
          body: mockedResponse.body,
          init: { status: mockedResponse.status }
        });
      }
    }
    return Promise.reject(new Error(`${request.url} has not been mocked`));
  });
};
