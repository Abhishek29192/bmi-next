import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const generateGoogleSignedIdToken = async (audience: string) =>
  (await import("../gcpAuth")).generateGoogleSignedIdToken(audience);

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("generateGoogleSignedIdToken", () => {
  it("generates the token", async () => {
    const url = "https://some-function";
    const authToken = "secret";
    mockResponses(fetchMock, {
      url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${url}`,
      method: "GET",
      headers: { "Metadata-Flavor": "Google" },
      body: authToken
    });

    const response = await generateGoogleSignedIdToken(url);

    expect(response).toEqual(authToken);
  });

  it("Returns undefined on error", async () => {
    const url = "https://some-function";
    const authToken = "secret";
    fetchMock.mock(
      `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${url}`,
      { throws: new Error("error") }
    );
    mockResponses(fetchMock, {
      url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${url}`,
      method: "GET",
      headers: { "Metadata-Flavor": "Google" },
      body: authToken,
      status: 500
    });

    const response = await generateGoogleSignedIdToken(url);

    expect(response).toEqual(undefined);
  });
});
