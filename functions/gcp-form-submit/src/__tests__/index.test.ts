import { IncomingHttpHeaders } from "http";
import { Request, Response } from "express";
import { protos } from "@google-cloud/secret-manager";
import mockConsole from "jest-mock-console";
import fetchMock from "jest-fetch-mock";

const validToken = "valid-token";
const locale = "nb-NO";

const mockRequest = (
  body: Object = {
    locale: locale,
    recipients: "email@email.com",
    values: { files: ["path/to/file"], a: "b" }
  },
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
accessSecretVersion.mockResolvedValue([
  {
    payload: { data: "access-token" }
  }
]);
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

let submit;

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.resetMocks();
  const index = require("../index");
  submit = index.submit;
});

describe("Making an OPTIONS request as part of CORS", () => {
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

  it("returns status code 500 when the recaptcha request fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    fetchMock.mockRejectOnce();

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(Error("Recaptcha request failed."));
  });

  it("returns status code 400 when the recaptcha request returns a non-ok response", async () => {
    const req = mockRequest();
    const res = mockResponse();

    fetchMock.mockResponse("{}", { status: 400 });

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledTimes(0);
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledTimes(0);
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE) - 0.1
      })
    );

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledTimes(0);
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=invalid-token`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(getSpace).toBeCalledTimes(0);
    expect(getEnvironment).toBeCalledTimes(0);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 500 when an error is returned from Secret Manager", async () => {
    const req = mockRequest();
    const res = mockResponse();

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    accessSecretVersion.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    getSpace.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    getEnvironment.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
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

  it("returns status code 500 when creating the asset in Contentful fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockResponses({
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    createAsset.mockRejectedValueOnce(Error("Expected Error"));

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    processForAllLocales.mockRejectedValueOnce(Error("Expected Error"));

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
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

  it("returns status code 500 when getting the sendGrid secret key fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    accessSecretVersion
      .mockResolvedValueOnce([
        {
          payload: { data: "access-token" }
        }
      ])
      .mockRejectedValueOnce(Error("Expected Error"));

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
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
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when sending the email request fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    send.mockRejectedValueOnce(Error("Expected Error"));

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
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
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith("access-token");
    expect(send).toBeCalledWith({
      to: "email@email.com",
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Website form submission",
      text: JSON.stringify({ a: "b", uploadedAssets: ["https://localhost"] }),
      html:
        '<ul><li><b>a</b>: "b"</li><li><b>uploadedAssets</b>: ["https://localhost"]</li></ul>'
    });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status 200 when successfully sends email", async () => {
    const req = mockRequest();
    const res = mockResponse();

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
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
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith("access-token");
    expect(send).toBeCalledWith({
      to: "email@email.com",
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Website form submission",
      text: JSON.stringify({ a: "b", uploadedAssets: ["https://localhost"] }),
      html:
        '<ul><li><b>a</b>: "b"</li><li><b>uploadedAssets</b>: ["https://localhost"]</li></ul>'
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
    expect(createAsset).toBeCalledTimes(0);
    expect(processForAllLocales).toBeCalledTimes(0);
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith("access-token");
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

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    processForAllLocales.mockResolvedValueOnce({
      fields: { file: { "en-UK": { url: "https://localhost" } } }
    });

    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
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
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith("access-token");
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

  it("only gets Contentful environment once regardless of number of requests", async () => {
    const req = mockRequest();
    const res = mockResponse();

    fetchMock.mockResponse(
      JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    );

    await submit(req, res);
    await submit(req, res);

    expect(
      fetchMock
    ).toBeCalledWith(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validToken}`,
      { method: "POST" }
    );
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
    });
    expect(getSpace).toBeCalledWith(process.env.CONTENTFUL_SPACE_ID);
    expect(getEnvironment).toBeCalledWith(process.env.CONTENTFUL_ENVIRONMENT);
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
    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    expect(setApiKey).toBeCalledWith("access-token");
    expect(send).toBeCalledWith({
      to: "email@email.com",
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Website form submission",
      text: JSON.stringify({ a: "b", uploadedAssets: ["https://localhost"] }),
      html:
        '<ul><li><b>a</b>: "b"</li><li><b>uploadedAssets</b>: ["https://localhost"]</li></ul>'
    });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.set).toBeCalledTimes(2);
    expect(res.sendStatus).toBeCalledWith(200);
    expect(res.sendStatus).toBeCalledTimes(2);
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
