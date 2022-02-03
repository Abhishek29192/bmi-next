const getPathWithCountryCode = async (
  countryCode: string,
  path?: string | null,
  ignoreCC?: boolean
) =>
  (await import("../path")).getPathWithCountryCode(countryCode, path, ignoreCC);

beforeEach(() => {
  delete process.env.GATSBY_DONT_USE_COUNTRY_CODE;
  jest.resetModules();
});

describe("getPathWithCountryCode", () => {
  it("should return just the provided country code if path is not provided", async () => {
    const countryCode = "no";

    const pathWithCountryCode = await getPathWithCountryCode(countryCode);

    expect(pathWithCountryCode).toStrictEqual("/no");
  });

  it("should return just the provided country code if null is passed into path", async () => {
    const countryCode = "no";

    const pathWithCountryCode = await getPathWithCountryCode(countryCode, null);

    expect(pathWithCountryCode).toStrictEqual("/no");
  });

  it("should prepend the path with the provided country code", async () => {
    const countryCode = "no";
    const path = "/some/page";

    const pathWithCountryCode = await getPathWithCountryCode(countryCode, path);

    expect(pathWithCountryCode).toStrictEqual("/no/some/page");
  });

  it("should prepend the relative path with the provided country code", async () => {
    const countryCode = "no";
    const path = "some/page";

    const pathWithCountryCode = await getPathWithCountryCode(countryCode, path);

    expect(pathWithCountryCode).toStrictEqual("/no/some/page");
  });

  it("should return the root path if path is not provided and GATSBY_DONT_USE_COUNTRY_CODE is true", async () => {
    process.env.GATSBY_DONT_USE_COUNTRY_CODE = "true";
    const countryCode = "no";

    const pathWithCountryCode = await getPathWithCountryCode(countryCode);

    expect(pathWithCountryCode).toStrictEqual("/");
  });

  it("should return the root path if path is null and GATSBY_DONT_USE_COUNTRY_CODE is true", async () => {
    process.env.GATSBY_DONT_USE_COUNTRY_CODE = "true";
    const countryCode = "no";

    const pathWithCountryCode = await getPathWithCountryCode(countryCode, null);

    expect(pathWithCountryCode).toStrictEqual("/");
  });

  it("should not prepend the path with the provided country code if GATSBY_DONT_USE_COUNTRY_CODE is true", async () => {
    process.env.GATSBY_DONT_USE_COUNTRY_CODE = "true";
    const countryCode = "no";
    const path = "/some/page";

    const pathWithCountryCode = await getPathWithCountryCode(countryCode, path);

    expect(pathWithCountryCode).toStrictEqual("/some/page");
  });

  it("should not prepend the relative path with the provided country code if GATSBY_DONT_USE_COUNTRY_CODE is true", async () => {
    process.env.GATSBY_DONT_USE_COUNTRY_CODE = "true";
    const countryCode = "no";
    const path = "/some/page";

    const pathWithCountryCode = await getPathWithCountryCode(countryCode, path);

    expect(pathWithCountryCode).toStrictEqual("/some/page");
  });
});
