import { getNumberOfDocuments } from "../contentful";
import { createContentfulResponse } from "./helpers/contentfulHelper";

const mockGetEntries = jest.fn();
jest.mock("@bmi/functions-contentful-client", () => {
  return {
    getContentfulClient: jest.fn().mockImplementation(() => ({
      getEntries: (params: Record<string, string>) => mockGetEntries(params)
    }))
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("getNumberOfDocuments", () => {
  it("should filter by tag if provided", async () => {
    const locale = "en-US";
    const tag = "market__indonesia";
    const contentfulResponse = createContentfulResponse();

    mockGetEntries.mockResolvedValueOnce(contentfulResponse);

    const numberOfDocuments = await getNumberOfDocuments(locale, tag);

    expect(mockGetEntries).toBeCalledWith({
      content_type: "document",
      limit: 0,
      locale,
      "metadata.tags.sys.id[all]": tag
    });

    expect(numberOfDocuments).toEqual(contentfulResponse.total);
  });

  it("should not filter by tag if not provided", async () => {
    const locale = "en-US";
    const contentfulResponse = createContentfulResponse();
    mockGetEntries.mockResolvedValueOnce(contentfulResponse);

    const numberOfDocuments = await getNumberOfDocuments(locale);

    expect(mockGetEntries).toBeCalledWith({
      content_type: "document",
      limit: 0,
      locale
    });

    expect(numberOfDocuments).toEqual(contentfulResponse.total);
  });

  it("should throw an error when errors are returned from Contentful", async () => {
    const locale = "en-US";
    mockGetEntries.mockResolvedValueOnce(
      createContentfulResponse({
        errors: [
          {
            name: "unknownContentType",
            value: "DOESNOTEXIST"
          }
        ]
      })
    );
    try {
      await getNumberOfDocuments(locale);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Errors: [{"name":"unknownContentType","value":"DOESNOTEXIST"}]'
      );
    }
    expect(mockGetEntries).toBeCalledWith({
      content_type: "document",
      limit: 0,
      locale
    });
  });

  it("should throw an error when error thrown getting entries", async () => {
    const locale = "en-US";
    mockGetEntries.mockRejectedValue(Error("Expected error"));
    try {
      await getNumberOfDocuments(locale);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }
    expect(mockGetEntries).toBeCalledWith({
      content_type: "document",
      limit: 0,
      locale
    });
  });
});
