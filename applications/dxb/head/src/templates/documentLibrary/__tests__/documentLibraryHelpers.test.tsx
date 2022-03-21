import { sourceToSortMap } from "../helpers/documnetLibraryHelpers";
import createPimDocument from "../../../__tests__/PimDocumentHelper";
import createProduct from "../../../__tests__/PimDocumentProductHelper";
import createCategory from "../../../__tests__/CategoryHelper";
import createClassification from "../../../__tests__/ClassificationHelper";
import createAssetType from "../../../__tests__/AssetTypeHelper";
import { PIMDocumentData } from "../../../components/types/PIMDocumentBase";

describe("documentLibraryHelpers", () => {
  describe("sourceToSortMap", () => {
    const pimDocument: PIMDocumentData = createPimDocument({
      id: `pim-doc-id`,
      url: `pim-doc-url`,
      title: "documentTitle",
      product: createProduct({
        categories: [createCategory({ categoryType: "Brand" })],
        classifications: [createClassification()]
      })
    });
    const documents = [
      {
        ...pimDocument,
        id: "2",
        url: "2",
        title: "documentTitle2",
        assetType: createAssetType({ name: "c", code: "c" }),
        brand: "c"
      },
      {
        ...pimDocument,
        id: "3",
        url: "3",
        title: "documentTitle2",
        assetType: createAssetType({ name: "e", code: "e" }),
        brand: "e"
      },
      {
        ...pimDocument,
        id: "5",
        url: "5",
        title: "documentTitle5",
        assetType: createAssetType({ name: "c", code: "c" }),
        brand: "c"
      },
      {
        ...pimDocument,
        id: "6",
        url: "6",
        title: "documentTitle6",
        assetType: createAssetType({ name: "e", code: "e" }),
        brand: "e"
      },
      {
        ...pimDocument,
        id: "0",
        url: "0",
        title: "documentTitle4",
        assetType: createAssetType({ name: "e", code: "e" }),
        brand: "e"
      },
      {
        ...pimDocument,
        id: "1",
        url: "1",
        title: "documentTitle1",
        assetType: createAssetType({ name: "d", code: "d" }),
        brand: "d"
      }
    ];
    it("sort documents correctly using ALL", () => {
      const result = sourceToSortMap["ALL"](documents);

      expect(result).toEqual(
        expect.arrayContaining([
          documents[5],
          documents[0],
          documents[2],
          documents[1],
          documents[3],
          documents[4]
        ])
      );
    });

    it("sort documents correctly using PIM", () => {
      const result = sourceToSortMap["PIM"](documents);

      expect(result).toEqual(
        expect.arrayContaining([
          documents[5],
          documents[0],
          documents[2],
          documents[1],
          documents[3],
          documents[4]
        ])
      );
    });

    it("sort documents correctly using CMS", () => {
      const result = sourceToSortMap["CMS"](documents);

      expect(result).toEqual(
        expect.arrayContaining([
          documents[5],
          documents[0],
          documents[2],
          documents[1],
          documents[3],
          documents[4]
        ])
      );
    });
  });
});
