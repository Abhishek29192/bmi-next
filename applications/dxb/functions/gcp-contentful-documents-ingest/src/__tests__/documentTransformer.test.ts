import {
  createAsset,
  createAssetLink,
  createAssetType,
  createDocumentLocalisedUnlinked,
  createEntryLink,
  createFullyPopulatedAssetType,
  createFullyPopulatedDocumentLocalisedUnlinked,
  createFullyPopulatedImage
} from "@bmi/contentful-types";
import { ContentfulDocument } from "../types";
import type { Asset } from "contentful";

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

const transformDocument = async (document: ContentfulDocument) =>
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
      await transformDocument(createFullyPopulatedDocumentLocalisedUnlinked());
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).not.toHaveBeenCalled();
    expect(getEntry).not.toHaveBeenCalled();
  });

  it("should throw error if asset link not found for the locale", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked({
      fields: { asset: { eo: { sys: createAssetLink() } } }
    });

    try {
      await transformDocument(contentfulDocument);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Could not find an asset link for locale ${process.env.MARKET_LOCALE}.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).not.toHaveBeenCalled();
    expect(getEntry).not.toHaveBeenCalled();
  });

  it("should throw error if asset can't be found", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked();
    getAsset.mockRejectedValueOnce(Error("Expected error"));

    try {
      await transformDocument(contentfulDocument);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Asset ${
          contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id
        } could not be found in Contentful.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).not.toHaveBeenCalled();
  });

  it("should throw error if asset file not returned", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked();
    const asset = createAsset({ fields: { file: undefined } });
    getAsset.mockResolvedValueOnce(asset);

    try {
      await transformDocument(contentfulDocument);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Asset file was not present for ${asset.sys.id}.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).not.toHaveBeenCalled();
  });

  it("should throw error if asset type link not found for the locale", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked({
      fields: {
        asset: { [process.env.MARKET_LOCALE!]: { sys: createAssetLink() } },
        assetType: { eo: { sys: createEntryLink() } }
      }
    });
    getAsset.mockResolvedValueOnce(createAsset());

    try {
      await transformDocument(contentfulDocument);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Could not find an asset type link for locale ${process.env.MARKET_LOCALE}.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).not.toHaveBeenCalled();
  });

  it("should throw error if asset type can't be found", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked();
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry.mockRejectedValueOnce(Error("Expected error"));

    try {
      await transformDocument(contentfulDocument);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Asset Type ${
          contentfulDocument.fields.assetType[process.env.MARKET_LOCALE!]!.sys
            .id
        } could not be found in Contentful.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledWith(
      contentfulDocument.fields.assetType[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should throw error if featured media link not found for the locale", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked({
      fields: {
        asset: { [process.env.MARKET_LOCALE!]: { sys: createAssetLink() } },
        assetType: { [process.env.MARKET_LOCALE!]: { sys: createEntryLink() } },
        featuredMedia: {
          eo: {
            sys: createEntryLink()
          }
        }
      }
    });
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry.mockResolvedValueOnce(createAssetType());

    try {
      await transformDocument(contentfulDocument);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Could not find a featured media link for locale ${process.env.MARKET_LOCALE}`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledTimes(1);
    expect(getEntry).toHaveBeenNthCalledWith(
      1,
      contentfulDocument.fields.assetType[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should throw error if featured media can't be found", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked({
      fields: {
        featuredMedia: {
          [process.env.MARKET_LOCALE!]: {
            sys: createEntryLink({
              id: "featured-media-id"
            })
          }
        }
      }
    });
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry
      .mockResolvedValueOnce(createAssetType())
      .mockRejectedValueOnce(Error("Expected error"));

    try {
      await transformDocument(contentfulDocument);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Image ${
          contentfulDocument.fields.featuredMedia![process.env.MARKET_LOCALE!]!
            .sys.id
        } could not be found in Contentful.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledTimes(2);
    expect(getEntry).toHaveBeenNthCalledWith(
      1,
      contentfulDocument.fields.assetType[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenNthCalledWith(
      2,
      contentfulDocument.fields.featuredMedia![process.env.MARKET_LOCALE!]!.sys
        .id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should throw error if featured media has a broken link to an image", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked();
    getAsset.mockResolvedValueOnce(createAsset());
    const featuredMedia = createFullyPopulatedImage({
      fields: { image: { sys: createAssetLink() } }
    });
    getEntry
      .mockResolvedValueOnce(createAssetType())
      .mockResolvedValueOnce(featuredMedia);

    try {
      await transformDocument(contentfulDocument);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Unable to find an image for ${featuredMedia.sys.id}.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledTimes(2);
    expect(getEntry).toHaveBeenNthCalledWith(
      1,
      contentfulDocument.fields.assetType[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenNthCalledWith(
      2,
      contentfulDocument.fields.featuredMedia![process.env.MARKET_LOCALE!]!.sys
        .id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should throw error if featured media image file not returned", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked();
    getAsset.mockResolvedValueOnce(createAsset());
    const featuredMedia = createFullyPopulatedImage({
      fields: {
        image: createAsset({ fields: { file: undefined } })
      }
    });
    getEntry
      .mockResolvedValueOnce(createAssetType())
      .mockResolvedValueOnce(featuredMedia);

    try {
      await transformDocument(contentfulDocument);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Unable to find an image for ${featuredMedia.sys.id}.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledTimes(2);
    expect(getEntry).toHaveBeenNthCalledWith(
      1,
      contentfulDocument.fields.assetType[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenNthCalledWith(
      2,
      contentfulDocument.fields.featuredMedia![process.env.MARKET_LOCALE!]!.sys
        .id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should throw error if localised title can't be found", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked({
      fields: {
        asset: { [process.env.MARKET_LOCALE!]: { sys: createAssetLink() } },
        assetType: { [process.env.MARKET_LOCALE!]: { sys: createEntryLink() } },
        featuredMedia: {
          [process.env.MARKET_LOCALE!]: { sys: createEntryLink() }
        },
        title: {
          eo: "Title to not be found"
        }
      }
    });
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry
      .mockResolvedValueOnce(createAssetType())
      .mockResolvedValueOnce(createFullyPopulatedImage());

    try {
      await transformDocument(contentfulDocument);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Title was not populated for locale ${process.env.MARKET_LOCALE}.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledTimes(2);
    expect(getEntry).toHaveBeenNthCalledWith(
      1,
      contentfulDocument.fields.assetType[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenNthCalledWith(
      2,
      contentfulDocument.fields.featuredMedia![process.env.MARKET_LOCALE!]!.sys
        .id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should throw error if localised brand can't be found", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked({
      fields: {
        asset: { [process.env.MARKET_LOCALE!]: { sys: createAssetLink() } },
        assetType: { [process.env.MARKET_LOCALE!]: { sys: createEntryLink() } },
        featuredMedia: {
          [process.env.MARKET_LOCALE!]: { sys: createEntryLink() }
        },
        brand: {
          eo: "Awak"
        }
      }
    });
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry
      .mockResolvedValueOnce(createAssetType())
      .mockResolvedValueOnce(createFullyPopulatedImage());

    try {
      await transformDocument(contentfulDocument);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Brand was not populated for locale ${process.env.MARKET_LOCALE}.`
      );
    }

    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledTimes(2);
    expect(getEntry).toHaveBeenNthCalledWith(
      1,
      contentfulDocument.fields.assetType[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenNthCalledWith(
      2,
      contentfulDocument.fields.featuredMedia![process.env.MARKET_LOCALE!]!.sys
        .id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should return ES Contentful document with minimal data", async () => {
    const contentfulDocument = createDocumentLocalisedUnlinked();
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry.mockResolvedValueOnce(createAssetType());

    const transformedDocument = await transformDocument(contentfulDocument);

    expect(transformedDocument).toMatchInlineSnapshot(`
      {
        "BRAND": undefined,
        "__typename": "ContentfulDocument",
        "asset": {
          "file": {
            "contentType": "application/pdf",
            "details": {
              "size": 1,
            },
            "fileName": "asset-filename.pdf",
            "url": "https://localhost:9000/asset-filename.pdf",
          },
        },
        "assetType": {
          "code": "contentful asset type code",
          "name": "contentful asset type name",
        },
        "featuredMedia": undefined,
        "id": "entry-id",
        "noIndex": false,
        "realFileName": "asset-filename.pdf",
        "title": "contentful document title",
        "titleAndSize": "contentful document title 1",
      }
    `);
    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledWith(
      contentfulDocument.fields.assetType[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should return ES Contentful document with full data", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked();
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry
      .mockResolvedValueOnce(createFullyPopulatedAssetType())
      .mockResolvedValueOnce(createFullyPopulatedImage());

    const transformedDocument = await transformDocument(contentfulDocument);

    expect(transformedDocument).toMatchInlineSnapshot(`
      {
        "BRAND": {
          "code": "AeroDek",
          "name": "AeroDek",
        },
        "__typename": "ContentfulDocument",
        "asset": {
          "file": {
            "contentType": "application/pdf",
            "details": {
              "size": 1,
            },
            "fileName": "asset-filename.pdf",
            "url": "https://localhost:9000/asset-filename.pdf",
          },
        },
        "assetType": {
          "code": "contentful asset type code",
          "name": "contentful asset type name",
        },
        "featuredMedia": {
          "altText": "image alt text",
          "focalPoint": {
            "x": 0,
            "y": 0,
          },
          "image": {
            "file": {
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
        "title": "contentful document title",
        "titleAndSize": "contentful document title 1",
      }
    `);
    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledTimes(2);
    expect(getEntry).toHaveBeenNthCalledWith(
      1,
      contentfulDocument.fields.assetType[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenNthCalledWith(
      2,
      contentfulDocument.fields.featuredMedia![process.env.MARKET_LOCALE!]!.sys
        .id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });

  it("should return ES Contentful document with no index defaulted to false if undefined", async () => {
    const contentfulDocument = createFullyPopulatedDocumentLocalisedUnlinked({
      fields: { noIndex: undefined }
    });
    getAsset.mockResolvedValueOnce(createAsset());
    getEntry.mockResolvedValueOnce(createAssetType());

    const transformedDocument = await transformDocument(contentfulDocument);

    expect(transformedDocument.noIndex).toEqual(false);
    expect(getContentfulClient).toHaveBeenCalled();
    expect(getAsset).toHaveBeenCalledWith(
      contentfulDocument.fields.asset[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
    expect(getEntry).toHaveBeenCalledWith(
      contentfulDocument.fields.assetType[process.env.MARKET_LOCALE!]!.sys.id,
      {
        locale: process.env.MARKET_LOCALE
      }
    );
  });
});
