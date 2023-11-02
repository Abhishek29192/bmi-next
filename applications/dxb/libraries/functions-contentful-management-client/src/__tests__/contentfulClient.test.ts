import type { ClientAPI, createClient } from "contentful-management";

type ClientOptions = Parameters<typeof createClient>[0];

const mockClient = jest.fn();
jest.mock("contentful-management", () => {
  return {
    createClient: (clientOptions: ClientOptions) => mockClient(clientOptions)
  };
});

beforeEach(() => {
  process.env.MANAGEMENT_ACCESS_TOKEN = "management-access-token";

  jest.clearAllMocks();
  jest.resetModules();
});

const getContentfulClient = async (): Promise<ClientAPI> =>
  (await import("../contentfulClient")).getContentfulClient();

describe("getContentfulClient", () => {
  it("should error if MANAGEMENT_ACCESS_TOKEN is not set", async () => {
    delete process.env.MANAGEMENT_ACCESS_TOKEN;

    try {
      await getContentfulClient();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "MANAGEMENT_ACCESS_TOKEN was not provided"
      );
    }
  });

  it("should return a new client", async () => {
    const expectedClient = {};
    mockClient.mockReturnValue(expectedClient);

    const contentfulClient = await getContentfulClient();

    expect(contentfulClient).toStrictEqual(expectedClient);
    expect(mockClient).toBeCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN!
    });
  });

  it("should only create a new client once if called multiple times", async () => {
    const expectedClient = {};
    mockClient.mockReturnValue(expectedClient);

    await getContentfulClient();
    await getContentfulClient();

    expect(mockClient).toBeCalledTimes(1);
    expect(mockClient).toBeCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN!
    });
  });
});
