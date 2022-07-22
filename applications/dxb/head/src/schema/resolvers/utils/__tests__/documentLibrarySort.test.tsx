import createContentfulAssetType from "../../types/helpers/ContentfulAssetTypeHelper";
import createContentfulDocument from "../../types/helpers/ContentfulDocumentHelper";
import createProductDocument from "../../types/helpers/ProductDocumentHelper";
import {
  sortAllDocuments,
  sortCmsDocuments,
  sortPimDocuments
} from "../documentLibrarySort";

describe("documentLibraryHelpers", () => {
  describe("sourceToSortMap", () => {
    it("sort documents correctly using ALL", () => {
      const assetTypes = [
        createContentfulAssetType({
          id: "a",
          name: "a",
          code: "a",
          pimCode: "a"
        }),
        createContentfulAssetType({
          id: "b",
          name: "b",
          code: "b",
          pimCode: "b"
        })
      ];
      const documents = [
        createContentfulDocument({
          id: "2",
          url: "2",
          title: "documentTitle2",
          assetType___NODE: "b"
        }),
        createProductDocument({
          id: "3",
          url: "3",
          title: "documentTitle3",
          assetType___NODE: "a"
        }),
        createContentfulDocument({
          id: "4",
          url: "4",
          title: "documentTitle3",
          assetType___NODE: "a"
        }),
        createProductDocument({
          id: "1",
          url: "1",
          title: "documentTitle1",
          assetType___NODE: "a"
        })
      ];

      const result = sortAllDocuments(documents, assetTypes);

      expect(result).toEqual([
        documents[3],
        documents[1],
        documents[2],
        documents[0]
      ]);
    });

    it("sort documents correctly using PIM", () => {
      const documents = [
        createProductDocument({
          id: "2",
          url: "2",
          title: "documentTitle2",
          assetType___NODE: "b"
        }),
        createProductDocument({
          id: "3",
          url: "3",
          title: "documentTitle3",
          assetType___NODE: "a"
        }),
        createProductDocument({
          id: "4",
          url: "4",
          title: "documentTitle3",
          assetType___NODE: "a"
        }),
        createProductDocument({
          id: "1",
          url: "1",
          title: "documentTitle1",
          assetType___NODE: "a"
        })
      ];

      const result = sortPimDocuments(documents);

      expect(result).toEqual([
        documents[3],
        documents[0],
        documents[1],
        documents[2]
      ]);
    });

    it("sort documents correctly using CMS", () => {
      const documents = [
        createContentfulDocument({
          id: "2",
          url: "2",
          title: "documentTitle2",
          brand: "b"
        }),
        createContentfulDocument({
          id: "3",
          url: "3",
          title: "documentTitle3",
          brand: "a"
        }),
        createContentfulDocument({
          id: "4",
          url: "4",
          title: "documentTitle3",
          brand: "a"
        }),
        createContentfulDocument({
          id: "1",
          url: "1",
          title: "documentTitle1",
          brand: "a"
        })
      ];

      const result = sortCmsDocuments(documents);

      expect(result).toEqual([
        documents[3],
        documents[1],
        documents[2],
        documents[0]
      ]);
    });

    it("sort documents correctly using CMS if at least one document's brand is null", () => {
      const documents = [
        createContentfulDocument({
          id: "3",
          url: "3",
          title: "documentTitle3",
          brand: "b"
        }),
        createContentfulDocument({
          id: "4",
          url: "4",
          title: "documentTitle4",
          brand: "a"
        }),
        createContentfulDocument({
          id: "5",
          url: "5",
          title: "documentTitle4",
          brand: "a"
        }),
        createContentfulDocument({
          id: "1",
          url: "1",
          title: "documentTitle1",
          brand: "a"
        }),
        createContentfulDocument({
          id: "2",
          url: "2",
          title: "documentTitle2",
          brand: null
        })
      ];

      const result = sortCmsDocuments(documents);

      expect(result).toEqual([
        documents[3],
        documents[4],
        documents[0],
        documents[2],
        documents[1]
      ]);
    });
  });
});
