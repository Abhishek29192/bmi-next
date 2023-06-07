import {
  createAsset,
  createAssetLink,
  createDocument as createContentfulDocument,
  createEntryLink,
  createFullyPopulatedDocument as createFullyPopulatedContentfulDocument,
  createImage
} from "@bmi/contentful-types";
import { transformDocuments } from "../documentTransformer";

describe("transformDocuments", () => {
  it("should throw error if document has a broken link to an asset", () => {
    const contentfulDocument = createContentfulDocument({
      fields: { asset: { sys: createAssetLink() } }
    });
    expect(() => transformDocuments([contentfulDocument])).toThrow(
      `Asset not found for ${contentfulDocument.sys.id}`
    );
  });

  it("should throw error if document doesn't have a file", () => {
    const contentfulDocument = createContentfulDocument({
      fields: { asset: createAsset({ fields: { file: undefined } }) }
    });
    expect(() => transformDocuments([contentfulDocument])).toThrow(
      `Asset not found for ${contentfulDocument.sys.id}`
    );
  });

  it("should throw error if document doesn't have an asset type", () => {
    const contentfulDocument = createContentfulDocument({
      fields: { assetType: undefined }
    });
    expect(() => transformDocuments([contentfulDocument])).toThrow(
      `AssetType not found for ${contentfulDocument.sys.id}`
    );
  });

  it("should throw error if document has a broken link to an asset type", () => {
    const contentfulDocument = createContentfulDocument({
      fields: { assetType: { sys: createEntryLink() } }
    });
    expect(() => transformDocuments([contentfulDocument])).toThrow(
      `AssetType not found for ${contentfulDocument.sys.id}`
    );
  });

  it("should throw error if featured media is a broken link", () => {
    const featuredMediaLink = createEntryLink();
    const contentfulDocument = createContentfulDocument({
      fields: { featuredMedia: { sys: featuredMediaLink } }
    });
    expect(() => transformDocuments([contentfulDocument])).toThrow(
      `Unable to find the Image ${featuredMediaLink.id}.`
    );
  });

  it("should throw error if featured media has a broken link to an Image", () => {
    const featuredMedia = createImage({
      fields: { image: { sys: createAssetLink() } }
    });
    const contentfulDocument = createContentfulDocument({
      fields: {
        featuredMedia: featuredMedia
      }
    });
    expect(() => transformDocuments([contentfulDocument])).toThrow(
      `${featuredMedia.sys.id} doesn't have an actual image.`
    );
  });

  it("should throw error if featured media image doesn't have a file", () => {
    const featuredMedia = createImage({
      fields: { image: createAsset({ fields: { file: undefined } }) }
    });
    const contentfulDocument = createContentfulDocument({
      fields: {
        featuredMedia: featuredMedia
      }
    });
    expect(() => transformDocuments([contentfulDocument])).toThrow(
      `${featuredMedia.sys.id} doesn't have an actual image.`
    );
  });

  it("should return minimally populated ES Contentful document", () => {
    const contentfulDocument = createContentfulDocument();
    const transformedDocuments = transformDocuments([contentfulDocument]);
    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
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
          "titleAndSize": "contentful document title_1",
        },
      ]
    `);
  });

  it("should return fully populated ES Contentful document", () => {
    const contentfulDocument = createFullyPopulatedContentfulDocument();
    const transformedDocuments = transformDocuments([contentfulDocument]);
    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
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
          "noIndex": false,
          "realFileName": "asset-filename.pdf",
          "title": "contentful document title",
          "titleAndSize": "contentful document title_1",
        },
      ]
    `);
  });
});
