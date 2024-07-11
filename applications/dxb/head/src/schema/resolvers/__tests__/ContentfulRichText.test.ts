import { BLOCKS } from "@contentful/rich-text-types";
import resolveRichText from "../ContentfulRichText";
import createContentfulRichText, {
  createRichTextAsset,
  createRichTextInlinePageEntry,
  createRichTextTableEntry
} from "../types/helpers/ContentfulRichText";
import originalGetContentfulData from "../../../utils/getContentfulData";
import {
  richTextAssetReferencesQuery,
  richTextEntryReferencesQuery
} from "../../queries/richTextReferences";
import createContentfulLink from "../types/helpers/ContentfulLinkHelper";
import type { Page as PageData, Path } from "../utils/path";
import type { ContentfulLink } from "../types/Link";

const getContentfulDataMock = jest.fn();
jest.mock("../../../utils/getContentfulData", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalGetContentfulData>) =>
    getContentfulDataMock(...args)
}));

const linkResolverMock = jest.fn();
jest.mock("../ContentfulLink", () => ({
  __esModule: true,
  default: (link: ContentfulLink) => linkResolverMock(link)
}));

const resolvePathMock = jest.fn();
const getUrlFromPathMock = jest.fn();
jest.mock("../utils/path", () => ({
  resolvePath: (pageData: PageData) => resolvePathMock(pageData),
  getUrlFromPath: (path: Path) => getUrlFromPathMock(path)
}));

const pathMock: Path = [
  {
    id: "path-id",
    path: "path",
    label: "label",
    queryParams: "query params",
    slug: "slug"
  }
];

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  linkResolverMock.mockResolvedValue("resolved-link");
  resolvePathMock.mockResolvedValue(pathMock);
  getUrlFromPathMock.mockReturnValue("url-from-path");
});

describe("ContentfulRichText resolver", () => {
  it("returns assets as references if provided", async () => {
    const asset = createRichTextAsset();

    getContentfulDataMock.mockResolvedValue({
      data: {
        assetCollection: { items: [asset] }
      }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ASSET,
            data: {
              target: {
                sys: {
                  id: "asset-id",
                  type: "Link",
                  linkType: "Asset"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    const { sys, ...rest } = asset;
    const expectedReferences = new Map();
    expectedReferences.set(sys.id, rest);

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
  });

  it("throws an error if assets request returns an array of errors", async () => {
    const errors = ["error-1", "error-2"];
    getContentfulDataMock.mockResolvedValue({ errors });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ASSET,
            data: {
              target: {
                sys: {
                  id: "asset-id",
                  type: "Link",
                  linkType: "Asset"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    await expect(resolveRichText(richText)).rejects.toThrow(
      JSON.stringify(errors)
    );
  });

  it("throws an error if assets request fails", async () => {
    const error = new Error("Assets request failed");
    getContentfulDataMock.mockRejectedValue(error);
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ASSET,
            data: {
              target: {
                sys: {
                  id: "asset-id",
                  type: "Link",
                  linkType: "Asset"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    await expect(resolveRichText(richText)).rejects.toThrow(error);
  });

  it("throws an error if entries request fails", async () => {
    const error = new Error("Entries request failed");
    getContentfulDataMock.mockRejectedValue(error);
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: "entry-id",
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    await expect(resolveRichText(richText)).rejects.toThrow(error);
  });

  it("throws an error if entries request returns an array of errors", async () => {
    const errors = ["error-1", "error-2"];
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: "entry-id",
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });
    getContentfulDataMock.mockResolvedValue({ errors });

    await expect(resolveRichText(richText)).rejects.toThrow(
      JSON.stringify(errors)
    );
  });

  it("resolves nested items correctly", async () => {
    const asset1 = createRichTextAsset({
      title: "Asset 1",
      sys: { id: "asset-1" }
    });
    const asset2 = createRichTextAsset({
      title: "Asset 2",
      sys: { id: "asset-2" }
    });
    getContentfulDataMock.mockResolvedValue({
      data: { assetCollection: { items: [asset1, asset2] } }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ASSET,
            data: {
              target: {
                sys: {
                  id: asset1.sys.id,
                  type: "Link",
                  linkType: "Asset"
                }
              }
            },
            content: [
              {
                nodeType: BLOCKS.EMBEDDED_ASSET,
                data: {
                  target: {
                    sys: {
                      id: asset2.sys.id,
                      type: "Link",
                      linkType: "Asset"
                    }
                  }
                },
                content: []
              }
            ]
          }
        ]
      }
    });

    const { sys: asset1Sys, ...asset1Rest } = asset1;
    const { sys: asset2Sys, ...asset2Rest } = asset2;
    const expectedReferences = new Map();
    expectedReferences.set(asset1Sys.id, asset1Rest);
    expectedReferences.set(asset2Sys.id, asset2Rest);

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      richTextAssetReferencesQuery,
      { assetIds: [asset1Sys.id, asset2Sys.id] }
    );
  });

  it("should not add entry to the references if it is a plaintext entry", async () => {
    const asset = createRichTextAsset({
      title: "Asset 1",
      sys: { id: "asset-1" }
    });
    getContentfulDataMock.mockResolvedValue({
      data: { assetCollection: { items: [asset] } }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ASSET,
            data: {
              target: {
                sys: {
                  id: asset.sys.id,
                  type: "Link",
                  linkType: "Asset"
                }
              }
            },
            content: [
              {
                nodeType: "text",
                value: "some text",
                marks: [],
                data: {}
              }
            ]
          }
        ]
      }
    });

    const { sys, ...rest } = asset;
    const expectedReferences = new Map();
    expectedReferences.set(sys.id, rest);

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      richTextAssetReferencesQuery,
      { assetIds: [asset.sys.id] }
    );
  });

  it("resolves rich text reference correctly if there is a Table entry", async () => {
    const table = createRichTextTableEntry();
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [table] } }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: table.sys.id,
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    const expectedReferences = new Map();
    expectedReferences.set(table.sys.id, table);

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      richTextEntryReferencesQuery,
      { entryIds: [table.sys.id] }
    );
  });

  it("resolves rich text reference correctly if there is a Link entry", async () => {
    const link = createContentfulLink();
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [link] } }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: link.sys.id,
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    const expectedReferences = new Map();
    expectedReferences.set(link.sys.id, "resolved-link");

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      richTextEntryReferencesQuery,
      { entryIds: [link.sys.id] }
    );
    expect(linkResolverMock).toHaveBeenCalledWith(link);
  });

  it("throws an error if link resolver throws an error", async () => {
    const link = createContentfulLink();
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [link] } }
    });
    const error = new Error("Link resolver failed");
    linkResolverMock.mockRejectedValue(error);

    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: link.sys.id,
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    await expect(resolveRichText(richText)).rejects.toThrow(error);
  });

  it("resolves rich text reference correctly if there is a Simple Page entry", async () => {
    const pageEntry = createRichTextInlinePageEntry({ __typename: "Page" });
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [pageEntry] } }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: pageEntry.sys.id,
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    const expectedReferences = new Map();
    expectedReferences.set(pageEntry.sys.id, {
      __typename: pageEntry.__typename,
      path: "url-from-path"
    });

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      richTextEntryReferencesQuery,
      { entryIds: [pageEntry.sys.id] }
    );
    expect(resolvePathMock).toHaveBeenCalledWith({
      title: pageEntry.title,
      slug: pageEntry.slug,
      sys: pageEntry.sys,
      parentPage: pageEntry.parentPage
    });
    expect(getUrlFromPathMock).toHaveBeenCalledWith(pathMock);
  });

  it("resolves rich text reference correctly if there is a Home Page entry", async () => {
    const homePageEntry = createRichTextInlinePageEntry({
      __typename: "HomePage",
      slug: null,
      parentPage: null
    });
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [homePageEntry] } }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: homePageEntry.sys.id,
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    const expectedReferences = new Map();
    expectedReferences.set(homePageEntry.sys.id, {
      __typename: homePageEntry.__typename,
      path: "url-from-path"
    });

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      richTextEntryReferencesQuery,
      { entryIds: [homePageEntry.sys.id] }
    );
    expect(resolvePathMock).toHaveBeenCalledWith({
      title: homePageEntry.title,
      slug: "",
      sys: homePageEntry.sys,
      parentPage: null
    });
    expect(getUrlFromPathMock).toHaveBeenCalledWith(pathMock);
  });

  it("resolves rich text reference correctly if there is a Contact Us Page entry", async () => {
    const contactUsPageEntry = createRichTextInlinePageEntry({
      __typename: "ContactUsPage"
    });
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [contactUsPageEntry] } }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: contactUsPageEntry.sys.id,
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    const expectedReferences = new Map();
    expectedReferences.set(contactUsPageEntry.sys.id, {
      __typename: contactUsPageEntry.__typename,
      path: "url-from-path"
    });

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      richTextEntryReferencesQuery,
      { entryIds: [contactUsPageEntry.sys.id] }
    );
    expect(resolvePathMock).toHaveBeenCalledWith({
      title: contactUsPageEntry.title,
      slug: contactUsPageEntry.slug,
      sys: contactUsPageEntry.sys,
      parentPage: contactUsPageEntry.parentPage
    });
    expect(getUrlFromPathMock).toHaveBeenCalledWith(pathMock);
  });

  it("resolves rich text reference correctly if there is a Product Lister Page entry", async () => {
    const productListerPageEntry = createRichTextInlinePageEntry({
      __typename: "ProductListerPage"
    });
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [productListerPageEntry] } }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: productListerPageEntry.sys.id,
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    const expectedReferences = new Map();
    expectedReferences.set(productListerPageEntry.sys.id, {
      __typename: productListerPageEntry.__typename,
      path: "url-from-path"
    });

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      richTextEntryReferencesQuery,
      { entryIds: [productListerPageEntry.sys.id] }
    );
    expect(resolvePathMock).toHaveBeenCalledWith({
      title: productListerPageEntry.title,
      slug: productListerPageEntry.slug,
      sys: productListerPageEntry.sys,
      parentPage: productListerPageEntry.parentPage
    });
    expect(getUrlFromPathMock).toHaveBeenCalledWith(pathMock);
  });

  it("resolves rich text reference correctly if there is a Document Library Page entry", async () => {
    const documentLibraryPageEntry = createRichTextInlinePageEntry({
      __typename: "DocumentLibraryPage"
    });
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [documentLibraryPageEntry] } }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: documentLibraryPageEntry.sys.id,
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    const expectedReferences = new Map();
    expectedReferences.set(documentLibraryPageEntry.sys.id, {
      __typename: documentLibraryPageEntry.__typename,
      path: "url-from-path"
    });

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      richTextEntryReferencesQuery,
      { entryIds: [documentLibraryPageEntry.sys.id] }
    );
    expect(resolvePathMock).toHaveBeenCalledWith({
      title: documentLibraryPageEntry.title,
      slug: documentLibraryPageEntry.slug,
      sys: documentLibraryPageEntry.sys,
      parentPage: documentLibraryPageEntry.parentPage
    });
    expect(getUrlFromPathMock).toHaveBeenCalledWith(pathMock);
  });

  it("resolves rich text reference correctly if there is a Brand Landing Page entry", async () => {
    const brandLandingPageEntry = createRichTextInlinePageEntry({
      __typename: "BrandLandingPage"
    });
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [brandLandingPageEntry] } }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: brandLandingPageEntry.sys.id,
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    const expectedReferences = new Map();
    expectedReferences.set(brandLandingPageEntry.sys.id, {
      __typename: brandLandingPageEntry.__typename,
      path: "url-from-path"
    });

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      richTextEntryReferencesQuery,
      { entryIds: [brandLandingPageEntry.sys.id] }
    );
    expect(resolvePathMock).toHaveBeenCalledWith({
      title: brandLandingPageEntry.title,
      slug: brandLandingPageEntry.slug,
      sys: brandLandingPageEntry.sys,
      parentPage: brandLandingPageEntry.parentPage
    });
    expect(getUrlFromPathMock).toHaveBeenCalledWith(pathMock);
  });

  it("resolves rich text reference correctly if there is a Training Lister Page entry", async () => {
    const trainingListerPageEntry = createRichTextInlinePageEntry({
      __typename: "TrainingListerPage"
    });
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [trainingListerPageEntry] } }
    });
    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: trainingListerPageEntry.sys.id,
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    const expectedReferences = new Map();
    expectedReferences.set(trainingListerPageEntry.sys.id, {
      __typename: trainingListerPageEntry.__typename,
      path: "url-from-path"
    });

    expect(await resolveRichText(richText)).toEqual({
      json: richText.json,
      references: expectedReferences
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      richTextEntryReferencesQuery,
      { entryIds: [trainingListerPageEntry.sys.id] }
    );
    expect(resolvePathMock).toHaveBeenCalledWith({
      title: trainingListerPageEntry.title,
      slug: trainingListerPageEntry.slug,
      sys: trainingListerPageEntry.sys,
      parentPage: trainingListerPageEntry.parentPage
    });
    expect(getUrlFromPathMock).toHaveBeenCalledWith(pathMock);
  });

  it("throws an error if path resolver fails", async () => {
    const pageEntry = createRichTextInlinePageEntry();
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [pageEntry] } }
    });
    const error = new Error("Path resolver failed");
    resolvePathMock.mockRejectedValue(error);

    const richText = createContentfulRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  id: pageEntry.sys.id,
                  type: "Link",
                  linkType: "Entry"
                }
              }
            },
            content: []
          }
        ]
      }
    });

    await expect(resolveRichText(richText)).rejects.toThrow(error);
  });
});
