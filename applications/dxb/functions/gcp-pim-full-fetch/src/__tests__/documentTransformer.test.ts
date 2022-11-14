import {
  createDocument as createContentfulDocument,
  createEntry,
  createFullyPopulatedDocument as createFullyPopulatedContentfulDocument,
  createFullyPopulatedEntry
} from "@bmi/contentful-types";
import { transformDocuments } from "../documentTransformer";

describe("transformDocuments", () => {
  it("should return minimally populated ES Contentful document", () => {
    const contentfulDocument = createEntry({
      fields: createContentfulDocument()
    });
    const transformedDocuments = transformDocuments([contentfulDocument]);
    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
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
          "title": "contentful document title",
          "titleAndSize": "contentful document title_1",
        },
      ]
    `);
  });

  it("should return fully populated ES Contentful document", () => {
    const contentfulDocument = createFullyPopulatedEntry({
      fields: createFullyPopulatedContentfulDocument()
    });
    const transformedDocuments = transformDocuments([contentfulDocument]);
    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "BRAND": Object {
            "code": "AeroDek",
            "name": "AeroDek",
          },
          "__typename": "ContentfulDocument",
          "asset": Object {
            "file": Object {
              "contentType": "image/jpeg",
              "details": Object {
                "size": 1,
              },
              "fileName": "asset-filename.jpg",
              "url": "https://localhost:9000/asset-filename.jpg",
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
          "noIndex": false,
          "realFileName": "asset-filename.jpg",
          "title": "contentful document title",
          "titleAndSize": "contentful document title_1",
        },
      ]
    `);
  });
});
