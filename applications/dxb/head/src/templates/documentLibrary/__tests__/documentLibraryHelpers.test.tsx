import createAssetType from "../../../__tests__/helpers/AssetTypeHelper";
import createPimDocument from "../../../__tests__/helpers/PimDocumentHelper";
import { sourceToSortMap } from "../helpers/documnetLibraryHelpers";

describe("documentLibraryHelpers", () => {
  describe("sourceToSortMap", () => {
    const pimDocument = createPimDocument({
      id: `pim-doc-id`,
      url: `pim-doc-url`,
      title: "documentTitle"
    });
    const documents = [
      {
        ...pimDocument,
        id: "2",
        url: "2",
        title: "documentTitle2",
        assetType: createAssetType({ name: "c", code: "c", pimCode: "c" }),
        brand: "c"
      },
      {
        ...pimDocument,
        id: "3",
        url: "3",
        title: "documentTitle2",
        assetType: createAssetType({ name: "e", code: "e", pimCode: "e" }),
        brand: "e"
      },
      {
        ...pimDocument,
        id: "5",
        url: "5",
        title: "documentTitle5",
        assetType: createAssetType({ name: "c", code: "c", pimCode: "c" }),
        brand: "c"
      },
      {
        ...pimDocument,
        id: "6",
        url: "6",
        title: "documentTitle6",
        assetType: createAssetType({ name: "e", code: "e", pimCode: "e" }),
        brand: "e"
      },
      {
        ...pimDocument,
        id: "0",
        url: "0",
        title: "documentTitle4",
        assetType: createAssetType({ name: "e", code: "e", pimCode: "e" }),
        brand: "e"
      },
      {
        ...pimDocument,
        id: "1",
        url: "1",
        title: "documentTitle1",
        assetType: createAssetType({ name: "d", code: "d", pimCode: "d" }),
        brand: "d"
      }
    ];
    it("sort documents correctly using ALL", () => {
      const result = sourceToSortMap["ALL"](documents);

      expect(result).toEqual([
        documents[5],
        documents[0],
        documents[2],
        documents[1],
        documents[3],
        documents[4]
      ]);
    });

    it("sort documents correctly using PIM", () => {
      const result = sourceToSortMap["PIM"](documents);
      expect(result).toEqual([
        documents[5],
        documents[0],
        documents[2],
        documents[1],
        documents[3],
        documents[4]
      ]);
    });

    it("sort documents correctly using CMS", () => {
      const result = sourceToSortMap["CMS"](documents);

      expect(result).toEqual([
        documents[5],
        documents[0],
        documents[2],
        documents[1],
        documents[3],
        documents[4]
      ]);
    });
    it("sort documents correctly using CMS if at least one document's brand is null", () => {
      const testDoc = {
        ...pimDocument,
        id: "77",
        url: "88",
        title: "AdocumentTitleTest1",
        assetType: createAssetType({ name: "test", code: "code" }),
        brand: null
      };
      const docs = [...documents, testDoc];
      const result = sourceToSortMap["CMS"](docs);

      expect(result).toEqual([
        testDoc,
        documents[5],
        documents[1],
        documents[0],
        documents[4],
        documents[2],
        documents[3]
      ]);
    });
  });
});
