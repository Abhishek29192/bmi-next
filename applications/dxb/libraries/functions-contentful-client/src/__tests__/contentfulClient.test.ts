const mockClient = jest.fn();
jest.mock("contentful", () => {
  return {
    createClient: function (...args: any[]) {
      return mockClient(...args);
    }
  };
});

beforeEach(() => {
  process.env.SPACE_ID = "space-id";
  process.env.CONTENTFUL_ENVIRONMENT = "contentful-environment";
  process.env.CONTENTFUL_DELIVERY_TOKEN = "contentful-delivery-token";

  jest.clearAllMocks();
  jest.resetModules();
});

const getContentfulClient = async () =>
  (await import("../contentfulClient")).getContentfulClient();

describe("getContentfulClient", () => {
  it("should error if SPACE_ID is not set", async () => {
    delete process.env.SPACE_ID;

    try {
      await getContentfulClient();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("SPACE_ID was not provided");
    }
  });

  it("should error if CONTENTFUL_ENVIRONMENT is not set", async () => {
    delete process.env.CONTENTFUL_ENVIRONMENT;

    try {
      await getContentfulClient();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "CONTENTFUL_ENVIRONMENT was not provided"
      );
    }
  });

  it("should error if CONTENTFUL_DELIVERY_TOKEN is not set", async () => {
    delete process.env.CONTENTFUL_DELIVERY_TOKEN;

    try {
      await getContentfulClient();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "CONTENTFUL_DELIVERY_TOKEN was not provided"
      );
    }
  });

  it("should return a new client", async () => {
    const expectedClient = {};
    mockClient.mockReturnValue(expectedClient);

    const contentfulClient = await getContentfulClient();

    expect(contentfulClient).toStrictEqual(expectedClient);
    expect(mockClient).toBeCalledWith({
      space: process.env.SPACE_ID!,
      environment: process.env.CONTENTFUL_ENVIRONMENT!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!
    });
  });

  it("should only create a new client once if called multiple times", async () => {
    const expectedClient = {};
    mockClient.mockReturnValue(expectedClient);

    await getContentfulClient();
    await getContentfulClient();

    expect(mockClient).toBeCalledTimes(1);
    expect(mockClient).toBeCalledWith({
      space: process.env.SPACE_ID!,
      environment: process.env.CONTENTFUL_ENVIRONMENT!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!
    });
  });
});
