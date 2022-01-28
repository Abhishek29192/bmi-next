import createAsset from "../../../../__tests__/AssetHelper";
import { getFormatFromFileName, isPimLinkDocument } from "../documents";

describe("Resolver documents utils", () => {
  describe("getFormatFromFileName", () => {
    it("should return mapped extention of file", () => {
      expect(getFormatFromFileName("file-1.png")).toBe("image/png");
      expect(getFormatFromFileName("file-2.jpg")).toBe("image/jpg");
      expect(getFormatFromFileName("file-3.jpeg")).toBe("image/jpeg");
      expect(getFormatFromFileName("file-4.pdf")).toBe("application/pdf");
    });
    it("should handle invalid file-type", () => {
      expect(getFormatFromFileName("file.exe")).toBeUndefined();
    });
  });

  describe("isPimLinkDocument", () => {
    const asset = createAsset({ allowedToDownload: true });
    it("should return true if allowedToDownload is false", () => {
      expect(
        isPimLinkDocument({ ...asset, allowedToDownload: false })
      ).toBeTruthy();
    });

    it("should return true if fileSize is more than MAX_SIZE_ALLOWED_BYTES", () => {
      expect(isPimLinkDocument({ ...asset, fileSize: 41943041 })).toBeTruthy(); // 40MB + 1
    });

    it("should return true if fileSize and realFileName not exist, but url exist", () => {
      expect(
        isPimLinkDocument({
          ...asset,
          fileSize: null,
          realFileName: null,
          url: "url-to-download"
        })
      ).toBeTruthy();
    });
  });
});
