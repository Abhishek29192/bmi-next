import { IncomingHttpHeaders } from "http";
import { escape } from "querystring";
import {
  mockRequest as fetchMockRequest,
  mockResponse,
  mockResponses
} from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const validToken = "valid-token";
const recaptchaSecret = "recaptcha-secret";
const apsisClientSecret = "apsis-client-secret";

const mockRequest = (
  body: Record<string, unknown> = {
    email: "a@a.com",
    gdpr_1: true,
    gdpr_2: true
  },
  headers: IncomingHttpHeaders = { "X-Recaptcha-Token": validToken }
): Partial<Request> => fetchMockRequest("POST", headers, "/", body);

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

const optInEmailMarketing = async (
  request: Partial<Request>,
  response: Partial<Response>
) =>
  (await import("../index")).optInEmailMarketing(
    request as Request,
    response as Response
  );

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("Invalid environment variables", () => {
  it("should return 500 if APSIS_OAUTH_CLIENT_SECRET is not set", async () => {
    const apsisClientSecret = process.env.APSIS_OAUTH_CLIENT_SECRET;
    delete process.env.APSIS_OAUTH_CLIENT_SECRET;

    const res = mockResponse();

    await optInEmailMarketing(mockRequest(), res);

    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.APSIS_OAUTH_CLIENT_SECRET = apsisClientSecret;
  });
  it("should return 500 if APSIS_TARGET_EMAIL_ATTRIBUTE_ID is not set", async () => {
    const apsisTargetEmailAttributeId =
      process.env.APSIS_TARGET_EMAIL_ATTRIBUTE_ID;
    delete process.env.APSIS_TARGET_EMAIL_ATTRIBUTE_ID;

    const res = mockResponse();

    await optInEmailMarketing(mockRequest(), res);

    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.APSIS_TARGET_EMAIL_ATTRIBUTE_ID = apsisTargetEmailAttributeId;
  });

  it("should return 500 if APSIS_TARGET_GDPR_1_ATTRIBUTE_ID is not set", async () => {
    const apsisTargetGdpr1AttributeId =
      process.env.APSIS_TARGET_GDPR_1_ATTRIBUTE_ID;
    delete process.env.APSIS_TARGET_GDPR_1_ATTRIBUTE_ID;

    const res = mockResponse();

    await optInEmailMarketing(mockRequest(), res);

    expect(fetchMock).toHaveFetchedTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.APSIS_TARGET_GDPR_1_ATTRIBUTE_ID = apsisTargetGdpr1AttributeId;
  });

  it("should return 500 if APSIS_TARGET_GDPR_2_ATTRIBUTE_ID is not set", async () => {
    const apsisTargetGdpr2AttributeId =
      process.env.APSIS_TARGET_GDPR_2_ATTRIBUTE_ID;
    delete process.env.APSIS_TARGET_GDPR_2_ATTRIBUTE_ID;

    const res = mockResponse();

    await optInEmailMarketing(mockRequest(), res);

    expect(fetchMock).toHaveFetchedTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.APSIS_TARGET_GDPR_2_ATTRIBUTE_ID = apsisTargetGdpr2AttributeId;
  });

  it("should return 500 if RECAPTCHA_KEY is not set", async () => {
    const recaptchaSecretKey = process.env.RECAPTCHA_KEY;
    delete process.env.RECAPTCHA_KEY;

    const res = mockResponse();

    await optInEmailMarketing(mockRequest(), res);

    expect(fetchMock).toHaveFetchedTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.sendStatus).toBeCalledWith(500);

    process.env.RECAPTCHA_KEY = recaptchaSecretKey;
  });
});

describe("Making an OPTIONS request as part of CORS", () => {
  it("returns a 204 response only allowing POST requests", async () => {
    const req: Partial<Request> = {
      method: "OPTIONS"
    };
    const res = mockResponse();

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "POST");
    expect(res.set).toBeCalledWith("Access-Control-Allow-Headers", [
      "Content-Type",
      "X-Recaptcha-Token"
    ]);
    expect(res.set).toBeCalledWith("Access-Control-Max-Age", "3600");
    expect(res.sendStatus).toBeCalledWith(204);
  });
});

describe("Making a POST request", () => {
  it("returns status code 400 when the email address format is invalid", async () => {
    const req = mockRequest({
      email: "invalid_email",
      gdpr_1: true,
      gdpr_2: true
    });
    const res = mockResponse();

    await optInEmailMarketing(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Invalid input received."));
  });

  it("returns status code 400 when the gdpr_1 is false", async () => {
    const req = mockRequest({
      email: "test@test.com",
      gdpr_1: false,
      gdpr_2: true
    });
    const res = mockResponse();

    await optInEmailMarketing(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Invalid input received."));
  });

  it("returns status code 400 when the gdpr_2 is false", async () => {
    const req = mockRequest({
      email: "test@test.com",
      gdpr_1: true,
      gdpr_2: false
    });
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      method: "POST",
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await optInEmailMarketing(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Invalid input received."));
  });

  it("returns status code 400 when both gdpr fields are false", async () => {
    const req = mockRequest({
      email: "test@test.com",
      gdpr_1: false,
      gdpr_2: false
    });
    const res = mockResponse();

    await optInEmailMarketing(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Invalid input received."));
  });

  it("returns status code 400 when the token is missing", async () => {
    const req = mockRequest(
      { email: "a@a.com", gdpr_1: true, gdpr_2: true },
      {}
    );
    const res = mockResponse();

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Token not provided."));
  });

  it("returns status code 500 when the recaptcha request fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      method: "POST",
      error: new Error("Expected Error")
    });

    await optInEmailMarketing(req, res);

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(Error("Recaptcha request failed."));
  });

  it("returns status code 400 when the recaptcha request returns a non-ok response", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      method: "POST",
      body: "{}",
      status: 400
    });

    await optInEmailMarketing(req, res);

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 400 when the recaptcha check fails", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      method: "POST",
      body: JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await optInEmailMarketing(req, res);

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 400 when the recaptcha score is less than minimum score", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      method: "POST",
      body: JSON.stringify({
        success: true,
        score: parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!) - 0.1
      })
    });

    await optInEmailMarketing(req, res);

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 400 when the token is invalid", async () => {
    const req = mockRequest(
      { email: "a@a.com", gdpr_1: true, gdpr_2: true },
      {
        "X-Recaptcha-Token": "invalid-token"
      }
    );
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=invalid-token`,
      method: "POST",
      body: JSON.stringify({
        success: false,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await optInEmailMarketing(req, res);

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=invalid-token`,
      { method: "POST" }
    );
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
  });

  it("returns status code 400 when the qaAuthToken is invalid", async () => {
    process.env.QA_AUTH_TOKEN = "qaAuthToken";
    const req = mockRequest(
      { email: "a@a.com", gdpr_1: true, gdpr_2: true },
      {
        "X-Recaptcha-Token": undefined,
        authorization: "Bearer qaAuthTokenFailed"
      }
    );
    const res = mockResponse();

    await optInEmailMarketing(req, res);

    expect(fetchMock).not.toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=undefined`,
      { method: "POST" }
    );
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("QaAuthToken failed."));
  });

  it("returns status code 500 when an error is returned from Secret Manager", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockResponses(fetchMock, {
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      method: "POST",
      body: JSON.stringify({
        success: true,
        score: process.env.RECAPTCHA_MINIMUM_SCORE
      })
    });

    await optInEmailMarketing(req, res);

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
  });

  it("returns status code 500 when an error is returned from Oauth", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        method: "POST",
        url: oAuthEndpoint,
        body: "",
        status: 500
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
    expect(fetchMock).toHaveFetchedTimes(2);
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(oAuthEndpoint, {
      body: {
        client_id: process.env.APSIS_CLIENT_ID,
        client_secret: apsisClientSecret,
        grant_type: "client_credentials"
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
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
      fetchMock,
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        method: "POST",
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        })
      },
      {
        method: "PATCH",
        url: getCreateProfileEndpoint(payloadEmail),
        body: "",
        status: 500
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
    expect(fetchMock).toHaveFetchedTimes(3);
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(oAuthEndpoint, {
      body: {
        client_id: process.env.APSIS_CLIENT_ID,
        client_secret: apsisClientSecret,
        grant_type: "client_credentials"
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(getCreateProfileEndpoint(payloadEmail), {
      body: { "9820534": "a@a.com", "312460234": true, "312461234": true },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
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
      fetchMock,
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        method: "POST",
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        })
      },
      {
        method: "PATCH",
        url: getCreateProfileEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateConsentEndpoint(payloadEmail),
        body: "",
        status: 500
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
    expect(fetchMock).toHaveFetchedTimes(4);
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(oAuthEndpoint, {
      body: {
        client_id: process.env.APSIS_CLIENT_ID,
        client_secret: apsisClientSecret,
        grant_type: "client_credentials"
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(getCreateProfileEndpoint(payloadEmail), {
      body: { "9820534": "a@a.com", "312460234": true, "312461234": true },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
    expect(fetchMock).toHaveFetched(getCreateConsentEndpoint(payloadEmail), {
      body: {
        section_discriminator: "usercreated.sections.fulq3a5aou",
        consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
        topic_discriminator:
          "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24",
        type: "opt-in"
      },
      headers: {
        Accept: "application/json",
        Authorization: "Bearer fdfdsfsdfdfdadsfdsfafsafds",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
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
      fetchMock,
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        method: "POST",
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        })
      },
      {
        method: "PATCH",
        url: getCreateProfileEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateConsentEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateSubscriptionEndpoint(payloadEmail),
        body: "",
        status: 500
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
    expect(fetchMock).toHaveFetchedTimes(5);
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(oAuthEndpoint, {
      body: {
        client_id: process.env.APSIS_CLIENT_ID,
        client_secret: apsisClientSecret,
        grant_type: "client_credentials"
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(getCreateProfileEndpoint(payloadEmail), {
      body: { "9820534": "a@a.com", "312460234": true, "312461234": true },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
    expect(fetchMock).toHaveFetched(getCreateConsentEndpoint(payloadEmail), {
      body: {
        section_discriminator: "usercreated.sections.fulq3a5aou",
        consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
        topic_discriminator:
          "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24",
        type: "opt-in"
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(
      getCreateSubscriptionEndpoint(payloadEmail),
      {
        body: {
          consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
          topic_discriminator:
            "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24"
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${oAuthToken}`,
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );
  });

  it("returns status code 500 when a subscription response is not returned from createSubscription", async () => {
    const payloadEmail = "a@a.com";
    const oAuthToken = "fdfdsfsdfdfdadsfdsfafsafds";
    const req = mockRequest({
      email: payloadEmail,
      gdpr_1: true,
      gdpr_2: true
    });
    const res = mockResponse();

    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        method: "POST",
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        })
      },
      {
        method: "PATCH",
        url: getCreateProfileEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateConsentEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateSubscriptionEndpoint(payloadEmail)
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
    expect(fetchMock).toHaveFetchedTimes(5);
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(oAuthEndpoint, {
      body: {
        client_id: process.env.APSIS_CLIENT_ID,
        client_secret: apsisClientSecret,
        grant_type: "client_credentials"
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(getCreateProfileEndpoint(payloadEmail), {
      body: { "9820534": "a@a.com", "312460234": true, "312461234": true },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
    expect(fetchMock).toHaveFetched(getCreateConsentEndpoint(payloadEmail), {
      body: {
        section_discriminator: "usercreated.sections.fulq3a5aou",
        consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
        topic_discriminator:
          "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24",
        type: "opt-in"
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(
      getCreateSubscriptionEndpoint(payloadEmail),
      {
        body: {
          consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
          topic_discriminator:
            "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24"
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${oAuthToken}`,
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );
  });

  it("returns status code 500 when a subscription ID is not returned from createSubscription", async () => {
    const payloadEmail = "a@a.com";
    const oAuthToken = "fdfdsfsdfdfdadsfdsfafsafds";
    const req = mockRequest({
      email: payloadEmail,
      gdpr_1: true,
      gdpr_2: true
    });
    const res = mockResponse();

    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        method: "POST",
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        })
      },
      {
        method: "PATCH",
        url: getCreateProfileEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateConsentEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateSubscriptionEndpoint(payloadEmail),
        body: "{}"
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(500);
    expect(fetchMock).toHaveFetchedTimes(5);
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(oAuthEndpoint, {
      body: {
        client_id: process.env.APSIS_CLIENT_ID,
        client_secret: apsisClientSecret,
        grant_type: "client_credentials"
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(getCreateProfileEndpoint(payloadEmail), {
      body: { "9820534": "a@a.com", "312460234": true, "312461234": true },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
    expect(fetchMock).toHaveFetched(getCreateConsentEndpoint(payloadEmail), {
      body: {
        section_discriminator: "usercreated.sections.fulq3a5aou",
        consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
        topic_discriminator:
          "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24",
        type: "opt-in"
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(
      getCreateSubscriptionEndpoint(payloadEmail),
      {
        body: {
          consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
          topic_discriminator:
            "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24"
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${oAuthToken}`,
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );
  });

  it("returns status code 200 when ALL api calls succeed with lowercase recaptcha header", async () => {
    const payloadEmail = "a@a.com";
    const oAuthToken = "fdfdsfsdfdfdadsfdsfafsafds";
    const req = mockRequest(
      {
        email: payloadEmail,
        gdpr_1: true,
        gdpr_2: true
      },
      { "x-recaptcha-token": validToken }
    );
    const res = mockResponse();

    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        method: "POST",
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        })
      },
      {
        method: "PATCH",
        url: getCreateProfileEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateConsentEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateSubscriptionEndpoint(payloadEmail),
        body: JSON.stringify({ id: "abcdafsdfsfsdfsdf" })
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(200);
    expect(fetchMock).toHaveFetchedTimes(5);
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(oAuthEndpoint, {
      body: {
        client_id: process.env.APSIS_CLIENT_ID,
        client_secret: apsisClientSecret,
        grant_type: "client_credentials"
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(getCreateProfileEndpoint(payloadEmail), {
      body: { "9820534": "a@a.com", "312460234": true, "312461234": true },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
    expect(fetchMock).toHaveFetched(getCreateConsentEndpoint(payloadEmail), {
      body: {
        section_discriminator: "usercreated.sections.fulq3a5aou",
        consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
        topic_discriminator:
          "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24",
        type: "opt-in"
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(
      getCreateSubscriptionEndpoint(payloadEmail),
      {
        body: {
          consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
          topic_discriminator:
            "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24"
        },
        headers: {
          Accept: "application/json",
          Authorization: "Bearer fdfdsfsdfdfdadsfdsfafsafds",
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );
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
      fetchMock,
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        method: "POST",
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        })
      },
      {
        method: "PATCH",
        url: getCreateProfileEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateConsentEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateSubscriptionEndpoint(payloadEmail),
        body: JSON.stringify({ id: "abcdafsdfsfsdfsdf" })
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(200);
    expect(fetchMock).toHaveFetchedTimes(5);
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(oAuthEndpoint, {
      body: {
        client_id: process.env.APSIS_CLIENT_ID,
        client_secret: apsisClientSecret,
        grant_type: "client_credentials"
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(getCreateProfileEndpoint(payloadEmail), {
      body: { "9820534": "a@a.com", "312460234": true, "312461234": true },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
    expect(fetchMock).toHaveFetched(getCreateConsentEndpoint(payloadEmail), {
      body: {
        section_discriminator: "usercreated.sections.fulq3a5aou",
        consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
        topic_discriminator:
          "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24",
        type: "opt-in"
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(
      getCreateSubscriptionEndpoint(payloadEmail),
      {
        body: {
          consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
          topic_discriminator:
            "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24"
        },
        headers: {
          Accept: "application/json",
          Authorization: "Bearer fdfdsfsdfdfdadsfdsfafsafds",
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );
  });

  it("defaults RECAPTCHA_MINIMUM_SCORE to 1.0 and returns status code 200 when ALL api calls succeed", async () => {
    const recaptchaMinimumScore = process.env.RECAPTCHA_MINIMUM_SCORE;
    delete process.env.RECAPTCHA_MINIMUM_SCORE;

    const payloadEmail = "a@a.com";
    const oAuthToken = "fdfdsfsdfdfdadsfdsfafsafds";
    const failReq = mockRequest(
      {
        email: payloadEmail,
        gdpr_1: true,
        gdpr_2: true
      },
      { "X-Recaptcha-Token": `${validToken}0.9` }
    );
    const res = mockResponse();

    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}0.9`,
        body: JSON.stringify({
          success: true,
          score: 0.9
        })
      },
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}1.0`,
        body: JSON.stringify({
          success: true,
          score: 1.0
        })
      },
      {
        method: "POST",
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        })
      },
      {
        method: "PATCH",
        url: getCreateProfileEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateConsentEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateSubscriptionEndpoint(payloadEmail),
        body: JSON.stringify({ id: "abcdafsdfsfsdfsdf" })
      }
    );

    await optInEmailMarketing(failReq, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
    expect(fetchMock).toHaveFetchedTimes(1);
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}0.9`,
      { method: "POST" }
    );

    const passReq = mockRequest(failReq.body, {
      "X-Recaptcha-Token": `${validToken}1.0`
    });

    await optInEmailMarketing(passReq, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(200);
    expect(fetchMock).toHaveFetchedTimes(6);
    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}1.0`,
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(oAuthEndpoint, {
      body: {
        client_id: process.env.APSIS_CLIENT_ID,
        client_secret: apsisClientSecret,
        grant_type: "client_credentials"
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(getCreateProfileEndpoint(payloadEmail), {
      body: { "9820534": "a@a.com", "312460234": true, "312461234": true },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
    expect(fetchMock).toHaveFetched(getCreateConsentEndpoint(payloadEmail), {
      body: {
        section_discriminator: "usercreated.sections.fulq3a5aou",
        consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
        topic_discriminator:
          "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24",
        type: "opt-in"
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(
      getCreateSubscriptionEndpoint(payloadEmail),
      {
        body: {
          consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
          topic_discriminator:
            "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24"
        },
        headers: {
          Accept: "application/json",
          Authorization: "Bearer fdfdsfsdfdfdadsfdsfafsafds",
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );

    process.env.RECAPTCHA_MINIMUM_SCORE = recaptchaMinimumScore;
  });

  it("sends first name attribute to apsis profile if name is posted in payload", async () => {
    const payloadName = "My Name";
    const payloadEmail = "test@test.com";
    const oAuthToken = "some_token";
    const req = mockRequest({
      email: payloadEmail,
      gdpr_1: true,
      gdpr_2: true,
      name: payloadName
    });
    const res = mockResponse();

    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        method: "POST",
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        })
      },
      {
        method: "PATCH",
        url: getCreateProfileEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateConsentEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateSubscriptionEndpoint(payloadEmail),
        body: JSON.stringify({ id: "abcdafsdfsfsdfsdf" })
      }
    );

    await optInEmailMarketing(req, res);

    expect(fetchMock).toHaveFetched(getCreateProfileEndpoint(payloadEmail), {
      body: {
        "9820534": "test@test.com",
        "312460234": true,
        "312461234": true,
        "312462234": "My Name"
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
  });

  it("It does not send first name attribute to apsis profile if name is not posted in payload", async () => {
    const payloadEmail = "test@test.com";
    const oAuthToken = "some_token";
    const req = mockRequest({
      email: payloadEmail,
      gdpr_1: true,
      gdpr_2: true
    });
    const res = mockResponse();

    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=recaptcha-secret&response=valid-token`,
        body: JSON.stringify({
          success: true,
          score: process.env.RECAPTCHA_MINIMUM_SCORE
        })
      },
      {
        method: "POST",
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        })
      },
      {
        method: "PATCH",
        url: getCreateProfileEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateConsentEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateSubscriptionEndpoint(payloadEmail),
        body: JSON.stringify({ id: "abcdafsdfsfsdfsdf" })
      }
    );

    await optInEmailMarketing(req, res);

    expect(fetchMock).toHaveFetched(getCreateProfileEndpoint(payloadEmail), {
      body: {
        "9820534": "test@test.com",
        "312460234": true,
        "312461234": true
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
  });

  it("returns status code 200 when ALL api calls succeed when the authorization header is used", async () => {
    process.env.QA_AUTH_TOKEN = "qaAuthToken";
    const payloadEmail = "a@a.com";
    const oAuthToken = "fdfdsfsdfdfdadsfdsfafsafds";
    const req = mockRequest(
      {
        email: payloadEmail,
        gdpr_1: true,
        gdpr_2: true
      },
      { "x-recaptcha-token": undefined, authorization: "Bearer qaAuthToken" }
    );
    const res = mockResponse();

    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: oAuthEndpoint,
        body: JSON.stringify({
          access_token: oAuthToken
        })
      },
      {
        method: "PATCH",
        url: getCreateProfileEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateConsentEndpoint(payloadEmail),
        body: ""
      },
      {
        method: "POST",
        url: getCreateSubscriptionEndpoint(payloadEmail),
        body: JSON.stringify({ id: "abcdafsdfsfsdfsdf" })
      }
    );

    await optInEmailMarketing(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.sendStatus).toBeCalledWith(200);
    expect(fetchMock).toHaveFetchedTimes(4);
    expect(fetchMock).not.toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=undefined`,
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(oAuthEndpoint, {
      body: {
        client_id: process.env.APSIS_CLIENT_ID,
        client_secret: apsisClientSecret,
        grant_type: "client_credentials"
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(getCreateProfileEndpoint(payloadEmail), {
      body: { "9820534": "a@a.com", "312460234": true, "312461234": true },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
    expect(fetchMock).toHaveFetched(getCreateConsentEndpoint(payloadEmail), {
      body: {
        section_discriminator: "usercreated.sections.fulq3a5aou",
        consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
        topic_discriminator:
          "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24",
        type: "opt-in"
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${oAuthToken}`,
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(fetchMock).toHaveFetched(
      getCreateSubscriptionEndpoint(payloadEmail),
      {
        body: {
          consent_list_discriminator: "usercreated.targets.ylbz9hz52c",
          topic_discriminator:
            "usercreated.topics.nyhetsbrev_-_nettside-rg4kf3kt24"
        },
        headers: {
          Accept: "application/json",
          Authorization: "Bearer fdfdsfsdfdfdadsfdsfafsafds",
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );
  });
});
