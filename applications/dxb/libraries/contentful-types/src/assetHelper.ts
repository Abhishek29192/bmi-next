import { Asset } from "contentful";

export const createFullyPopulatedAsset = (asset?: Partial<Asset>): Asset => ({
  sys: {
    space: {
      sys: { type: "Link", linkType: "Space", id: "space-id" }
    },
    id: "asset-id",
    type: "Asset",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(1).toISOString(),
    environment: {
      sys: { type: "Link", linkType: "Environment", id: "master" }
    },
    revision: 1,
    locale: "en-US",
    contentType: { sys: { type: "Link", linkType: "ContentType", id: "Asset" } } // this field doesn't actually exist for Assets, but the type requires it
  },
  fields: {
    title: "asset title",
    description: "asset description",
    file: {
      url: "https://localhost:9000/asset-filename.jpg",
      details: {
        size: 1,
        image: {
          width: 100,
          height: 100
        }
      },
      fileName: "asset-filename.jpg",
      contentType: "image/jpeg"
    }
  },
  metadata: { tags: [] },
  toPlainObject: function () {
    const { toPlainObject, ...plainObject } = this;
    return plainObject;
  },
  ...asset
});

const createAsset = (asset?: Partial<Asset>): Asset => ({
  sys: {
    space: {
      sys: { type: "Link", linkType: "Space", id: "master" }
    },
    id: "asset-id",
    type: "Asset",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(1).toISOString(),
    environment: {
      sys: { type: "Link", linkType: "Environment", id: "master" }
    },
    revision: 1,
    locale: "en-US",
    contentType: { sys: { type: "Link", linkType: "ContentType", id: "Asset" } } // this field doesn't actually exist for Assets, but the type requires it
  },
  fields: {
    title: "asset title",
    description: "asset description",
    file: {
      url: "https://localhost:9000/asset-filename.pdf",
      details: {
        size: 1
      },
      fileName: "asset-filename.pdf",
      contentType: "application/pdf"
    }
  },
  metadata: { tags: [] },
  toPlainObject: function () {
    const { toPlainObject, ...plainObject } = this;
    return plainObject;
  },
  ...asset
});

export default createAsset;
