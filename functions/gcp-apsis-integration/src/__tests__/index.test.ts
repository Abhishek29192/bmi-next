import { escape } from "querystring";
import { Request, Response } from "express";
import { protos } from "@google-cloud/secret-manager";
import mockConsole from "jest-mock-console";
import fetchMock from "jest-fetch-mock";

const mockRequest = (body?): Partial<Request> => {
  return {
    method: "POST",
    body: body
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

const oAuthEndpoint = `${process.env.APSIS_API_BASE_URL}/oauth/token`;

const getCreateProfileEndpoint = (payloadEmail: string): string => {
  return `${process.env.APSIS_API_BASE_URL}/audience/keyspaces/${
    process.env.APSIS_TARGET_KEYSPACE
  }/profiles/${escape(payloadEmail)}/sections/${
    process.env.APSIS_TARGET_SECTION
  }/attributes`;
};

const getCreateConsentEndpoint = (payloadEmail: string): string => {
  return `${process.env.APSIS_API_BASE_URL}/audience/channels/${
    process.env.APSIS_TARGET_CHANNEL
  }/addresses/${escape(payloadEmail)}/consents`;
};

const getCreateSubscriptionEndpoint = (payloadEmail: string): string => {
  return `${process.env.APSIS_API_BASE_URL}/audience/keyspaces/${
    process.env.APSIS_TARGET_KEYSPACE
  }/profiles/${escape(payloadEmail)}/sections/${
    process.env.APSIS_TARGET_SECTION
  }/subscriptions`;
};

let optInEmailMarketing;

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.resetMocks();
  const index = require("../index");
  optInEmailMarketing = index.optInEmailMarketing;
});

describe("Making an OPTIONS request as part of CORS", () => {
  it("returns a 204 response only allowing POST requests", async () => {
    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await optInEmailMarketing(req, res);

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "POST");
    expect(res.set).toBeCalledWith(
      "Access-Control-Allow-Headers",
      "Content-Type"
    );
    expect(res.set).toBeCalledWith("Access-Control-Max-Age", "3600");
    expect(res.status).toBeCalledWith(204);
    expect(res.send).toBeCalledWith("");
  });
});

describe("Making a POST request", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  it("returns status code 500 when an error is returned from Secret Manager", async () => {
    const req = mockRequest({ email: "a@a.com", gdpr_1: true, gdpr_2: true });
    const res = mockResponse();
    accessSecretVersion.mockImplementationOnce(() => {
      throw new Error("Expected Error");
    });

    await optInEmailMarketing(req, res);

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${process.env.APSIS_CLIENT_SECRET}/versions/latest`
    });
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when an error is returned from Oauth", async () => {
    const req = mockRequest({ email: "a@a.com", gdpr_1: true, gdpr_2: true });
    const res = mockResponse();

    mockResponses({
      url: oAuthEndpoint,
      body: "",
      status: 500
    });

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
    expect(fetchMock).toBeCalledTimes(1);
    expect(fetchMock).toBeCalledWith("https://api.apsis.one/oauth/token", {
      body:
        '{"client_id":"","client_secret":"access-token","grant_type":"client_credentials"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      redirect: "follow"
    });
  });

  it("returns status code 500 when an error is returned from createProfile", async () => {
    const payloadEmail = "a@a.com";
    const oAuthToken = "fdfdsfsdfdfdadsfdsfafsafds";
    const req = mockRequest({
      email: payloadEmail,
      gdpr_1: true,
      gdpr_2: true
    });
    const res = mockResponse();

    mockResponses(
      {
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        }),
        status: 200
      },
      {
        url: getCreateProfileEndpoint(payloadEmail),
        body: "",
        status: 500
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(fetchMock).toBeCalledTimes(2);
    expect(fetchMock).toBeCalledWith("https://api.apsis.one/oauth/token", {
      body:
        '{"client_id":"","client_secret":"access-token","grant_type":"client_credentials"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      redirect: "follow"
    });

    expect(fetchMock).toBeCalledWith(
      "https://api.apsis.one/audience/keyspaces/com.keyspaces.email/profiles/a%40a.com/sections/usercreated.sections.fulq3a5aou/attributes",
      {
        body: '{"9820534":"a@a.com","312460234":true,"312461234":true}',
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${oAuthToken}`,
          "Content-Type": "application/json"
        },
        method: "PATCH"
      }
    );

    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when an error is returned from createConsent", async () => {
    const payloadEmail = "a@a.com";
    const oAuthToken = "fdfdsfsdfdfdadsfdsfafsafds";
    const req = mockRequest({
      email: payloadEmail,
      gdpr_1: true,
      gdpr_2: true
    });
    const res = mockResponse();

    mockResponses(
      {
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        }),
        status: 200
      },
      {
        url: getCreateProfileEndpoint(payloadEmail),
        body: "",
        status: 200
      },
      {
        url: getCreateConsentEndpoint(payloadEmail),
        body: "",
        status: 500
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(fetchMock).toBeCalledTimes(3);
    expect(fetchMock).toBeCalledWith("https://api.apsis.one/oauth/token", {
      body:
        '{"client_id":"","client_secret":"access-token","grant_type":"client_credentials"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      redirect: "follow"
    });

    expect(fetchMock).toBeCalledWith(
      "https://api.apsis.one/audience/keyspaces/com.keyspaces.email/profiles/a%40a.com/sections/usercreated.sections.fulq3a5aou/attributes",
      {
        body: '{"9820534":"a@a.com","312460234":true,"312461234":true}',
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${oAuthToken}`,
          "Content-Type": "application/json"
        },
        method: "PATCH"
      }
    );
    expect(fetchMock).toBeCalledWith(
      "https://api.apsis.one/audience/channels/com.channels.email/addresses/a%40a.com/consents",
      {
        body:
          '{"section_discriminator":"usercreated.sections.fulq3a5aou","consent_list_discriminator":"usercreated.targets.ylbz9hz52c","topic_discriminator":"usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24","type":"opt-in"}',
        headers: {
          Accept: "application/json",
          Authorization: "Bearer fdfdsfsdfdfdadsfdsfafsafds",
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );

    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when an error is returned from createSubscription", async () => {
    const payloadEmail = "a@a.com";
    const oAuthToken = "fdfdsfsdfdfdadsfdsfafsafds";
    const req = mockRequest({
      email: payloadEmail,
      gdpr_1: true,
      gdpr_2: true
    });
    const res = mockResponse();

    mockResponses(
      {
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        }),
        status: 200
      },
      {
        url: getCreateProfileEndpoint(payloadEmail),
        body: "",
        status: 200
      },
      {
        url: getCreateConsentEndpoint(payloadEmail),
        body: "",
        status: 200
      },
      {
        url: getCreateSubscriptionEndpoint(payloadEmail),
        body: "",
        status: 500
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(fetchMock).toBeCalledTimes(4);
    expect(fetchMock).toBeCalledWith("https://api.apsis.one/oauth/token", {
      body:
        '{"client_id":"","client_secret":"access-token","grant_type":"client_credentials"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      redirect: "follow"
    });

    expect(fetchMock).toBeCalledWith(
      "https://api.apsis.one/audience/keyspaces/com.keyspaces.email/profiles/a%40a.com/sections/usercreated.sections.fulq3a5aou/attributes",
      {
        body: '{"9820534":"a@a.com","312460234":true,"312461234":true}',
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${oAuthToken}`,
          "Content-Type": "application/json"
        },
        method: "PATCH"
      }
    );
    expect(fetchMock).toBeCalledWith(
      "https://api.apsis.one/audience/channels/com.channels.email/addresses/a%40a.com/consents",
      {
        body:
          '{"section_discriminator":"usercreated.sections.fulq3a5aou","consent_list_discriminator":"usercreated.targets.ylbz9hz52c","topic_discriminator":"usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24","type":"opt-in"}',
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${oAuthToken}`,
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );

    expect(fetchMock).toBeCalledWith(
      "https://api.apsis.one/audience/keyspaces/com.keyspaces.email/profiles/a%40a.com/sections/usercreated.sections.fulq3a5aou/subscriptions",
      {
        body:
          '{"consent_list_discriminator":"usercreated.targets.ylbz9hz52c","topic_discriminator":"usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24"}',
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${oAuthToken}`,
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );

    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 200 when ALL api calls succeed", async () => {
    const payloadEmail = "a@a.com";
    const oAuthToken = "fdfdsfsdfdfdadsfdsfafsafds";
    const req = mockRequest({
      email: payloadEmail,
      gdpr_1: true,
      gdpr_2: true
    });
    const res = mockResponse();

    mockResponses(
      {
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        }),
        status: 200
      },
      {
        url: getCreateProfileEndpoint(payloadEmail),
        body: "",
        status: 200
      },
      {
        url: getCreateConsentEndpoint(payloadEmail),
        body: "",
        status: 200
      },
      {
        url: getCreateSubscriptionEndpoint(payloadEmail),
        body: JSON.stringify({ id: "abcdafsdfsfsdfsdf" }),
        status: 200
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(fetchMock).toBeCalledTimes(4);
    expect(fetchMock).toBeCalledWith("https://api.apsis.one/oauth/token", {
      body:
        '{"client_id":"","client_secret":"access-token","grant_type":"client_credentials"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      redirect: "follow"
    });

    expect(fetchMock).toBeCalledWith(
      "https://api.apsis.one/audience/keyspaces/com.keyspaces.email/profiles/a%40a.com/sections/usercreated.sections.fulq3a5aou/attributes",
      {
        body: '{"9820534":"a@a.com","312460234":true,"312461234":true}',
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${oAuthToken}`,
          "Content-Type": "application/json"
        },
        method: "PATCH"
      }
    );
    expect(fetchMock).toBeCalledWith(
      "https://api.apsis.one/audience/channels/com.channels.email/addresses/a%40a.com/consents",
      {
        body:
          '{"section_discriminator":"usercreated.sections.fulq3a5aou","consent_list_discriminator":"usercreated.targets.ylbz9hz52c","topic_discriminator":"usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24","type":"opt-in"}',
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${oAuthToken}`,
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );

    expect(fetchMock).toBeCalledWith(
      "https://api.apsis.one/audience/keyspaces/com.keyspaces.email/profiles/a%40a.com/sections/usercreated.sections.fulq3a5aou/subscriptions",
      {
        body:
          '{"consent_list_discriminator":"usercreated.targets.ylbz9hz52c","topic_discriminator":"usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24"}',
        headers: {
          Accept: "application/json",
          Authorization: "Bearer fdfdsfsdfdfdadsfdsfafsafds",
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );

    expect(res.sendStatus).toBeCalledWith(200);
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
