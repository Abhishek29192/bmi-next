import {
  createAsset,
  createAssetType,
  createEntry,
  createFullyPopulatedAssetType,
  createFullyPopulatedImage
} from "@bmi/contentful-types";
import { Asset, Entry } from "contentful";
import { ContentfulDocument } from "../types";
import createContentfulDocument, {
  createFullyPopulatedDocument
} from "./helpers/contentfulDocumentHelper";
import createSysLink from "./helpers/sysLinkHelper";

const getContentfulClient = jest.fn();
const getAsset: jest.Mock<Promise<Asset>, [string, any]> = jest.fn();
const getEntry = jest.fn();
getContentfulClient.mockReturnValue({
  getAsset: (id: string, query?: any) => getAsset(id, query),
  getEntry: (id: string, query?: any) => getEntry(id, query)
});
jest.mock("@bmi/functions-contentful-client", () => ({
  getContentfulClient: () => getContentfulClient()
}));

const transformDocument = async (document: Entry<ContentfulDocument>) =>
  (await import("../documentTransformer")).transformDocument(document);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  process.env.MARKET_LOCALE = "en-US";
});

describe("transformDocument", () => {
  it("should throw error if getContentfulClient throws error", async () => {
    getContentfulClient.mockImplementationOnce(() => {
      throw new Error("Expected error");
    });

    try {
      await transformDocument(
        createEntry({ fields: createContentfulDocument() })
      );
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).not.toHaveBeenCalled();
    expect(getEntry).not.toHaveBeenCalled();
  });

  it("should throw error if locale can't be found on the document", async () => {
    const originalMarketLocale = process.env.MARKET_LOCALE;
    process.env.MARKET_LOCALE = "eo";

    try {
      await transformDocument(
        createEntry({ fields: createContentfulDocument() })
      );
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Locale ${process.env.MARKET_LOCALE} not found on the document.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).not.toHaveBeenCalled();
    expect(getEntry).not.toHaveBeenCalled();

    process.env.MARKET_LOCALE = originalMarketLocale;
  });

  it("should throw error if asset can't be found", async () => {
    const contentfulDocument = createContentfulDocument();
    getAsset.mockRejectedValueOnce(Error("Expected error"));

    try {
      await transformDocument(createEntry({ fields: contentfulDocument }));
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Asset ${
          contentfulDocument.asset[process.env.MARKET_LOCALE!].sys.id
        } could not be found in Contentful.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.asset[process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).not.toHaveBeenCalled();
  });

  it("should throw error if asset type can't be found", async () => {
    const contentfulDocument = createContentfulDocument();
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry.mockRejectedValueOnce(Error("Expected error"));

    try {
      await transformDocument(createEntry({ fields: contentfulDocument }));
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Asset Type ${
          contentfulDocument.assetType[process.env.MARKET_LOCALE!].sys.id
        } could not be found in Contentful.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.asset[process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledWith(
      contentfulDocument.assetType[process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should throw error if featured media can't be found", async () => {
    const contentfulDocument = createContentfulDocument({
      featuredMedia: {
        [process.env.MARKET_LOCALE!]: {
          sys: createSysLink<"Entry">({
            id: "featured-media-id"
          })
        }
      }
    });
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry
      .mockResolvedValueOnce(createEntry())
      .mockRejectedValueOnce(Error("Expected error"));

    try {
      await transformDocument(createEntry({ fields: contentfulDocument }));
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Image ${
          contentfulDocument.featuredMedia![process.env.MARKET_LOCALE!].sys.id
        } could not be found in Contentful.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.asset[process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledTimes(2);
    expect(getEntry).toHaveBeenNthCalledWith(
      1,
      contentfulDocument.assetType[process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenNthCalledWith(
      2,
      contentfulDocument.featuredMedia![process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should return ES Contentful document with minimal data", async () => {
    const contentfulDocument = createContentfulDocument();
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry.mockResolvedValueOnce(createEntry({ fields: createAssetType() }));

    const transformedDocument = await transformDocument(
      createEntry({ fields: contentfulDocument })
    );

    expect(transformedDocument).toMatchInlineSnapshot(`
      Object {
        "BRAND": undefined,
        "__typename": "ContentfulDocument",
        "asset": Object {
          "file": Object {
            "contentType": "application/pdf",
            "details": Object {
              "size": 1,
            },
            "fileName": "asset-filename.pdf",
            "url": "https://localhost:9000/asset-filename.pdf",
          },
        },
        "assetType": Object {
          "code": "contentful asset type code",
          "name": "contentful asset type name",
        },
        "featuredMedia": undefined,
        "id": "entry-id",
        "noIndex": false,
        "realFileName": "asset-filename.pdf",
        "title": "Contentful Document Title",
        "titleAndSize": "Contentful Document Title 1",
      }
    `);
    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.asset[process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledWith(
      contentfulDocument.assetType[process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should return ES Contentful document with full data", async () => {
    const contentfulDocument = createFullyPopulatedDocument();
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry
      .mockResolvedValueOnce(
        createEntry({ fields: createFullyPopulatedAssetType() })
      )
      .mockResolvedValueOnce(
        createEntry({ fields: createFullyPopulatedImage() })
      );

    const transformedDocument = await transformDocument(
      createEntry({ fields: contentfulDocument })
    );

    expect(transformedDocument).toMatchInlineSnapshot(`
      Object {
        "BRAND": Object {
          "code": "AeroDek",
          "name": "AeroDek",
        },
        "__typename": "ContentfulDocument",
        "asset": Object {
          "file": Object {
            "contentType": "application/pdf",
            "details": Object {
              "size": 1,
            },
            "fileName": "asset-filename.pdf",
            "url": "https://localhost:9000/asset-filename.pdf",
          },
        },
        "assetType": Object {
          "code": "contentful asset type code",
          "name": "contentful asset type name",
        },
        "featuredMedia": Object {
          "altText": "image alt text",
          "focalPoint": Object {
            "x": 0,
            "y": 0,
          },
          "image": Object {
            "file": Object {
              "fileName": "asset-filename.jpg",
              "url": "https://localhost:9000/asset-filename.jpg",
            },
          },
          "title": "image title",
          "type": "Decorative",
        },
        "id": "entry-id",
        "noIndex": true,
        "realFileName": "asset-filename.pdf",
        "title": "Contentful Document Title",
        "titleAndSize": "Contentful Document Title 1",
      }
    `);
    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.asset[process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledTimes(2);
    expect(getEntry).toHaveBeenNthCalledWith(
      1,
      contentfulDocument.assetType[process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenNthCalledWith(
      2,
      contentfulDocument.featuredMedia![process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should return ES Contentful document with no index defaulted to false if undefined", async () => {
    const contentfulDocument = createContentfulDocument({
      noIndex: undefined
    });
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry.mockResolvedValueOnce(createEntry({ fields: createAssetType() }));

    const transformedDocument = await transformDocument(
      createEntry({ fields: contentfulDocument })
    );

    expect(transformedDocument.noIndex).toEqual(false);
    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.asset[process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledWith(
      contentfulDocument.assetType[process.env.MARKET_LOCALE!].sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });
});
