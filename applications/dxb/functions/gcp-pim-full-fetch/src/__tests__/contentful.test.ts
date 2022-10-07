import {
  createDocument,
  createEntry,
  createResponse
} from "@bmi/contentful-types";

const mockGetEntries = jest.fn();
jest.mock("@bmi/functions-contentful-client", () => {
  return {
    getContentfulClient: jest.fn().mockImplementation(() => ({
      getEntries: (params: Record<string, string>) => mockGetEntries(params)
    }))
  };
});

const getDocuments = async (locale: string, page: number, tag?: string) =>
  (await import("../contentful")).getDocuments(locale, page, tag);

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

describe("getDocuments", () => {
  it("throws error when getEntries throws error", async () => {
    mockGetEntries.mockRejectedValueOnce(Error("Expected error"));

    try {
      await getDocuments("en-GB", 0);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "document",
      locale: "en-GB",
      skip: 0,
      limit: 1000
    });
  });

  it("throws error when getEntries returns errors", async () => {
    mockGetEntries.mockResolvedValueOnce(
      createResponse({
        errors: [
          {
            name: "unknownContentType",
            value: "DOESNOTEXIST"
          }
        ]
      })
    );

    try {
      await getDocuments("en-GB", 0);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Errors: [{"name":"unknownContentType","value":"DOESNOTEXIST"}]'
      );
    }

    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "document",
      locale: "en-GB",
      skip: 0,
      limit: 1000
    });
  });

  it("returns documents", async () => {
    const contentfulResponse = createResponse();
    mockGetEntries.mockResolvedValueOnce(contentfulResponse);

    const documents = await getDocuments("en-GB", 0);

    expect(documents).toEqual(contentfulResponse.items);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "document",
      locale: "en-GB",
      skip: 0,
      limit: 1000
    });
  });

  it("skips 1000 documents for second page", async () => {
    const contentfulResponse = createResponse();
    mockGetEntries.mockResolvedValueOnce(contentfulResponse);

    const documents = await getDocuments("en-GB", 1);

    expect(documents).toEqual(contentfulResponse.items);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "document",
      locale: "en-GB",
      skip: 1000,
      limit: 1000
    });
  });

  it("filters by tag if provided", async () => {
    const contentfulResponse = createResponse({
      items: [createEntry({ fields: createDocument() })]
    });
    const tag = "market__belgium";
    mockGetEntries.mockResolvedValueOnce(contentfulResponse);

    const documents = await getDocuments("en-GB", 1, tag);

    expect(documents).toEqual(contentfulResponse.items);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "document",
      locale: "en-GB",
      skip: 1000,
      limit: 1000,
      "metadata.tags.sys.id[all]": tag
    });
  });
});
