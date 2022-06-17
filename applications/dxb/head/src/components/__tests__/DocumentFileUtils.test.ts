import { ProductDocument } from "../../types/pim";
import createPimDocument from "../../__tests__/helpers/PimDocumentHelper";
import createAssetFileCountMap, {
  AssetUniqueFileCountMap,
  generateFilenameByRealFileName,
  generateFileNamebyTitle
} from "../DocumentFileUtils";

const createAssetsWithRealFileNames = (
  realFileNames: string[]
): ProductDocument[] => {
  return realFileNames.map((filename) =>
    createPimDocument({
      realFileName: filename
    })
  );
};

const createAssetsWithTitles = (titles: string[]): ProductDocument[] => {
  return titles.map((title) =>
    createPimDocument({
      title: title,
      realFileName: ""
    })
  );
};

describe("DocumentFileUtils Tests", () => {
  describe("createAssetFileCountMap Tests", () => {
    describe("When Assets are empty", () => {
      it("returns empty unique File Count Map", () => {
        const resultFileCountMap: AssetUniqueFileCountMap =
          createAssetFileCountMap([]);
        expect(resultFileCountMap).toEqual({
          uniqueFileMap: {},
          fileIndexCount: []
        });
      });
    });

    describe("Assets with realFileNames tests", () => {
      describe("When Assets has single unique realFileNames", () => {
        it("returns unique File Count Map with realFileNames", () => {
          const assets = createAssetsWithRealFileNames([
            "file1.pdf",
            "file2.pdf",
            "file3.pdf",
            "file4.pdf"
          ]);
          const resultFileCountMap: AssetUniqueFileCountMap =
            createAssetFileCountMap(assets);
          expect(resultFileCountMap).toEqual({
            uniqueFileMap: {
              "file1.pdf": 1,
              "file2.pdf": 1,
              "file3.pdf": 1,
              "file4.pdf": 1
            },
            fileIndexCount: [1, 1, 1, 1]
          });
        });
      });

      describe("When Assets has multiple realFileNames", () => {
        it("returns correct File Count Map and unique file names map", () => {
          const assets = createAssetsWithRealFileNames([
            "file1.pdf",
            "file1.pdf",
            "file2.pdf",
            "file2.pdf"
          ]);
          const resultFileCountMap: AssetUniqueFileCountMap =
            createAssetFileCountMap(assets);
          expect(resultFileCountMap).toEqual({
            uniqueFileMap: { "file1.pdf": 2, "file2.pdf": 2 },
            fileIndexCount: [1, 2, 1, 2]
          });
        });
      });
    });

    describe("Assets with title and extension tests", () => {
      describe("When Assets has single unique title and extension", () => {
        it("returns unique File Count Map with realFileNames", () => {
          const assets = createAssetsWithTitles([
            "file-title1",
            "file-title2",
            "file-title3",
            "file-title4"
          ]);
          const resultFileCountMap: AssetUniqueFileCountMap =
            createAssetFileCountMap(assets);
          expect(resultFileCountMap).toEqual({
            uniqueFileMap: {
              "file-title1.pdf": 1,
              "file-title2.pdf": 1,
              "file-title3.pdf": 1,
              "file-title4.pdf": 1
            },
            fileIndexCount: [1, 1, 1, 1]
          });
        });
      });

      describe("When Assets has duplicate title and extension", () => {
        it("returns correct File Count Map and unique file names map", () => {
          const assets = createAssetsWithTitles([
            "file-title1",
            "file-title2",
            "file-title1",
            "file-title2"
          ]);
          const resultFileCountMap: AssetUniqueFileCountMap =
            createAssetFileCountMap(assets);
          expect(resultFileCountMap).toEqual({
            uniqueFileMap: {
              "file-title1.pdf": 2,
              "file-title2.pdf": 2
            },
            fileIndexCount: [1, 1, 2, 2]
          });
        });
      });
    });
  });

  describe("generateFilenameByRealFileName Tests", () => {
    describe("When asset with unique real file name does NOT exists in the file count map", () => {
      it("returns original filename", () => {
        const assets = createAssetsWithRealFileNames(["file5.pdf"]);
        const generatedFileName = generateFilenameByRealFileName(
          {
            uniqueFileMap: {
              "file1.pdf": 1,
              "file2.pdf": 1,
              "file3.pdf": 1,
              "file4.pdf": 1
            },
            fileIndexCount: [1, 1, 1, 1]
          },
          assets[0],
          0
        );

        expect(generatedFileName).toEqual("file5.pdf");
      });
    });

    describe("When asset with unique real file name exists in the file count map", () => {
      it("generates correct filename(s)", () => {
        const assets = createAssetsWithRealFileNames(["file1.pdf"]);
        const generatedFileName = generateFilenameByRealFileName(
          {
            uniqueFileMap: {
              "file1.pdf": 1,
              "file2.pdf": 1,
              "file3.pdf": 1,
              "file4.pdf": 1
            },
            fileIndexCount: [1, 1, 1, 1]
          },
          assets[0],
          0
        );

        expect(generatedFileName).toEqual("file1.pdf");
      });
    });

    describe("When asset with duplicate and single real file name(s) exists in the file count map", () => {
      it("generates correct filename(s) with suffix", () => {
        const assets = createAssetsWithRealFileNames([
          "file1.pdf",
          "file1.pdf",
          "file2.pdf",
          "file3.pdf",
          "file3.pdf",
          "file4.pdf"
        ]);
        const uniqueFileMap = {
          uniqueFileMap: {
            "file1.pdf": 2,
            "file2.pdf": 1,
            "file3.pdf": 2,
            "file4.pdf": 1
          },
          fileIndexCount: [1, 2, 1, 1, 2, 1]
        };
        let generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[0],
          0
        );

        expect(generatedFileName).toEqual("file1-1.pdf");

        generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[1],
          1
        );
        expect(generatedFileName).toEqual("file1-2.pdf");

        generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[2],
          2
        );
        expect(generatedFileName).toEqual("file2.pdf");

        generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[3],
          3
        );
        expect(generatedFileName).toEqual("file3-1.pdf");

        generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[4],
          4
        );
        expect(generatedFileName).toEqual("file3-2.pdf");

        generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[5],
          5
        );
        expect(generatedFileName).toEqual("file4.pdf");
      });

      it("generates correct filename(s) with suffix :: in any order", () => {
        const assets = createAssetsWithRealFileNames([
          "file4.pdf",
          "file3.pdf",
          "file1.pdf",
          "file2.pdf",
          "file1.pdf",
          "file3.pdf"
        ]);
        const uniqueFileMap = {
          uniqueFileMap: {
            "file4.pdf": 1,
            "file3.pdf": 2,
            "file1.pdf": 2,
            "file2.pdf": 1
          },
          fileIndexCount: [1, 1, 1, 1, 2, 2]
        };

        let generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[5],
          5
        );
        expect(generatedFileName).toEqual("file3-2.pdf");

        generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[0],
          0
        );
        expect(generatedFileName).toEqual("file4.pdf");

        generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[2],
          2
        );
        expect(generatedFileName).toEqual("file1-1.pdf");

        generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[1],
          1
        );
        expect(generatedFileName).toEqual("file3-1.pdf");

        generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[3],
          3
        );
        expect(generatedFileName).toEqual("file2.pdf");

        generatedFileName = generateFilenameByRealFileName(
          uniqueFileMap,
          assets[4],
          4
        );
        expect(generatedFileName).toEqual("file1-2.pdf");
      });
    });
  });

  describe("createPDFAssetsWithTitles Tests", () => {
    describe("When asset with title does NOT exists in the file count map", () => {
      it("returns original filename", () => {
        const assets = createAssetsWithTitles(["file-title5"]);

        const uniqueFileMap: AssetUniqueFileCountMap = {
          uniqueFileMap: {
            "file-title1.pdf": 2,
            "file-title2.pdf": 1,
            "file-title3.pdf": 2,
            "file-title4.pdf": 1
          },
          fileIndexCount: [1, 2, 1, 1, 2, 1]
        };

        const generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[0].title,
          assets[0].extension,
          0
        );
        expect(generatedFileName).toEqual("file-title5.pdf");
      });
    });

    describe("When asset with duplicate and single title(s) exists in the file count map", () => {
      it("generates correct filename(s) with suffix", () => {
        const assets = createAssetsWithTitles([
          "file-title1",
          "file-title1",
          "file-title2",
          "file-title3",
          "file-title3",
          "file-title4"
        ]);

        const uniqueFileMap: AssetUniqueFileCountMap = {
          uniqueFileMap: {
            "file-title1.pdf": 2,
            "file-title2.pdf": 1,
            "file-title3.pdf": 2,
            "file-title4.pdf": 1
          },
          fileIndexCount: [1, 2, 1, 1, 2, 1]
        };

        let generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[0].title,
          assets[0].extension,
          0
        );
        expect(generatedFileName).toEqual("file-title1-1.pdf");

        generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[1].title,
          assets[1].extension,
          1
        );
        expect(generatedFileName).toEqual("file-title1-2.pdf");

        generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[2].title,
          assets[2].extension,
          2
        );
        expect(generatedFileName).toEqual("file-title2.pdf");

        generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[3].title,
          assets[3].extension,
          3
        );
        expect(generatedFileName).toEqual("file-title3-1.pdf");

        generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[4].title,
          assets[4].extension,
          4
        );
        expect(generatedFileName).toEqual("file-title3-2.pdf");

        generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[5].title,
          assets[5].extension,
          5
        );
        expect(generatedFileName).toEqual("file-title4.pdf");
      });

      it("generates correct filename(s) with suffix :: in any order", () => {
        const assets = createAssetsWithTitles([
          "file-title3",
          "file-title1",
          "file-title2",
          "file-title4",
          "file-title3",
          "file-title1"
        ]);

        const uniqueFileMap: AssetUniqueFileCountMap = {
          uniqueFileMap: {
            "file-title3.pdf": 2,
            "file-title1.pdf": 2,
            "file-title2.pdf": 1,
            "file-title4.pdf": 1
          },
          fileIndexCount: [1, 1, 1, 1, 2, 2]
        };

        let generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[0].title,
          assets[0].extension,
          0
        );
        expect(generatedFileName).toEqual("file-title3-1.pdf");

        generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[1].title,
          assets[1].extension,
          1
        );
        expect(generatedFileName).toEqual("file-title1-1.pdf");

        generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[4].title,
          assets[4].extension,
          4
        );
        expect(generatedFileName).toEqual("file-title3-2.pdf");

        generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[3].title,
          assets[3].extension,
          3
        );
        expect(generatedFileName).toEqual("file-title4.pdf");

        generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[2].title,
          assets[2].extension,
          2
        );
        expect(generatedFileName).toEqual("file-title2.pdf");

        generatedFileName = generateFileNamebyTitle(
          uniqueFileMap,
          assets[5].title,
          assets[5].extension,
          5
        );
        expect(generatedFileName).toEqual("file-title1-2.pdf");
      });
    });
  });
});
