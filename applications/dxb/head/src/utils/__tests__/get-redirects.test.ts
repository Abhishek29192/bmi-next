import fs from "fs";
import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const getRedirects = async (
  redirectsFileName: string,
  contentfulRedirectsFileUrl?: string
) =>
  await (
    await import("../get-redirects")
  ).getRedirects(redirectsFileName, contentfulRedirectsFileUrl);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.mockReset();
});

describe("getRedirects", () => {
  it("should get redirects from Contentful if available", async () => {
    const redirectsToml = `${__dirname}/resources/redirects_no.toml`;
    const contentfulRedirectsFileUrl = "//localhost:9000/redirects_no.toml";
    mockResponses(fetchMock, {
      url: `https:${contentfulRedirectsFileUrl}`,
      method: "GET",
      status: 200,
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      body: fs.readFileSync(redirectsToml),
      headers: {
        "Content-Type": "application/toml"
      }
    });

    const redirects = await getRedirects(
      redirectsToml,
      contentfulRedirectsFileUrl
    );

    expect(redirects).toEqual([
      {
        from: "/no/sxa/file/*",
        to: "/no/product-catalogues-brochures-folders/",
        force: true
      },
      {
        from: "/",
        to: "/no/",
        status: 301,
        force: true
      }
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      `https:${contentfulRedirectsFileUrl}`,
      undefined
    );
  });

  it("should get redirects from redirects file if file in Contentful is not a toml file", async () => {
    const redirectsToml = `${__dirname}/resources/redirects_no.toml`;
    const contentfulRedirectsFileUrl = "//localhost:9000/redirects_no.toml";
    mockResponses(fetchMock, {
      url: `https:${contentfulRedirectsFileUrl}`,
      method: "GET",
      status: 200,
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      body: fs.readFileSync(`${__dirname}/get-redirects.test.ts`),
      headers: {
        "Content-Type": "application/javascript"
      }
    });

    const redirects = await getRedirects(
      redirectsToml,
      contentfulRedirectsFileUrl
    );

    expect(redirects).toEqual([
      {
        from: "/no/sxa/file/*",
        to: "/no/product-catalogues-brochures-folders/",
        force: true
      },
      {
        from: "/",
        to: "/no/",
        status: 301,
        force: true
      }
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      `https:${contentfulRedirectsFileUrl}`,
      undefined
    );
  });

  it("should get redirects from redirects file if file in Contentful request returns a non 200 response", async () => {
    const redirectsToml = `${__dirname}/resources/redirects_no.toml`;
    const contentfulRedirectsFileUrl = "//localhost:9000/redirects_no.toml";
    mockResponses(fetchMock, {
      url: `https:${contentfulRedirectsFileUrl}`,
      method: "GET",
      status: 404
    });

    const redirects = await getRedirects(
      redirectsToml,
      contentfulRedirectsFileUrl
    );

    expect(redirects).toEqual([
      {
        from: "/no/sxa/file/*",
        to: "/no/product-catalogues-brochures-folders/",
        force: true
      },
      {
        from: "/",
        to: "/no/",
        status: 301,
        force: true
      }
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      `https:${contentfulRedirectsFileUrl}`,
      undefined
    );
  });

  it("should get redirects from redirects file if not in Contentful", async () => {
    const redirectsToml = `${__dirname}/resources/redirects_no.toml`;

    const redirects = await getRedirects(redirectsToml);

    expect(redirects).toEqual([
      {
        from: "/no/sxa/file/*",
        to: "/no/product-catalogues-brochures-folders/",
        force: true
      },
      {
        from: "/",
        to: "/no/",
        status: 301,
        force: true
      }
    ]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should return empty array if redirects file doesn't exist", async () => {
    const redirectsToml = "does-not-exist.toml";

    const redirects = await getRedirects(redirectsToml);

    expect(redirects).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should throw error if redirects file is not a toml file", async () => {
    const redirectsToml = `${__dirname}/get-redirects.test.ts`;

    try {
      await getRedirects(redirectsToml);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Expected "=" or [ \\t] but "f" found.'
      );
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
