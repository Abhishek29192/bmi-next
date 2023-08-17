import ContentfulDocumentDownloadSection from "../ContentfulDocumentDownloadSection";
import { ContentfulDocumentDownloadSection as ContentfulDocumentDownloadSectionType } from "../types/Contentful";
import { Context, ResolveArgs } from "../types/Gatsby";

const args: ResolveArgs = { categoryCodes: [], allowFilterBy: [] };

const getNodesByIds = jest.fn();
const context: Context = {
  nodeModel: {
    getNodesByIds,
    findAll: jest.fn(),
    findOne: jest.fn(),
    getNodeById: jest.fn()
  }
};

const source: ContentfulDocumentDownloadSectionType = {
  __typename: "ContentfulDocumentDownloadSection",
  description: null,
  documents___NODE: [],
  title: "Contentful Document Download Section",
  children: [],
  parent: null,
  id: "source",
  internal: { type: "", contentDigest: "", owner: "" }
};

describe("ContentfulDocumentDownloadSection resolver", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns empty array if there are no documents", async () => {
    const documents = await ContentfulDocumentDownloadSection.documents.resolve(
      source,
      args,
      context
    );
    expect(documents).toEqual([]);
  });

  it("requests only unique documents", async () => {
    await ContentfulDocumentDownloadSection.documents.resolve(
      {
        ...source,
        documents___NODE: ["document-id-1", "document-id-2", "document-id-1"]
      },
      args,
      context
    );
    expect(getNodesByIds).toBeCalledWith({
      type: "ContentfulDocument",
      ids: ["document-id-1", "document-id-2"]
    });
  });

  it("returns empty array if getNodesByIds returns undefined", async () => {
    getNodesByIds.mockResolvedValue(undefined);
    const documents = await ContentfulDocumentDownloadSection.documents.resolve(
      {
        ...source,
        documents___NODE: ["document-id-1", "document-id-2", "document-id-1"]
      },
      args,
      context
    );
    expect(documents).toEqual([]);
  });
});
