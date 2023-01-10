import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const verifyRecaptchaToken = async (
  token: string,
  recaptchaSecret: string,
  minimumScore: number
) =>
  (await import("../recaptcha")).default(token, recaptchaSecret, minimumScore);

const recaptchaSecret = "recaptcha-secret";
const validToken = "valid-token";
const minimumScore = 0.5;

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("verifyRecaptchaToken", () => {
  it("throws error when request to recaptcha throws an error", async () => {
    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      error: new Error("Expected error")
    });

    try {
      await verifyRecaptchaToken(validToken, recaptchaSecret, minimumScore);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Recaptcha request failed.");
    }

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
  });

  it("throws error when request to recaptcha returns an error response", async () => {
    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: "{}",
      status: 400
    });

    try {
      await verifyRecaptchaToken(validToken, recaptchaSecret, minimumScore);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Recaptcha check failed.");
    }

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
  });

  it("throws error when request to recaptcha check fails", async () => {
    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: false,
        score: minimumScore
      })
    });

    try {
      await verifyRecaptchaToken(validToken, recaptchaSecret, minimumScore);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Recaptcha check failed.");
    }

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
  });

  it("throws error when request to recaptcha check score is less than minimum score", async () => {
    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: minimumScore - 0.1
      })
    });

    try {
      await verifyRecaptchaToken(validToken, recaptchaSecret, minimumScore);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Recaptcha check failed.");
    }

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
  });

  it("does nothing when request to recaptcha check score is equal to minimum score", async () => {
    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: minimumScore
      })
    });

    await verifyRecaptchaToken(validToken, recaptchaSecret, minimumScore);

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
  });

  it("does nothing when request to recaptcha check score is greater than minimum score", async () => {
    mockResponses(fetchMock, {
      method: "POST",
      url: `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      body: JSON.stringify({
        success: true,
        score: minimumScore + 0.1
      })
    });

    await verifyRecaptchaToken(validToken, recaptchaSecret, minimumScore);

    expect(fetchMock).toHaveFetched(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${validToken}`,
      { method: "POST" }
    );
  });
});
