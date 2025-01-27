import { getDownloadLink, getExtension } from "../client-download";

describe("client download functions", () => {
  describe("getDownloadLink function", () => {
    it("return download link if http provided", () => {
      expect(getDownloadLink("http://localhost:8000/some/file-name.pdf")).toBe(
        "http://localhost:8000/some/file-name.pdf"
      );
    });

    it("return download link if https provided", () => {
      expect(getDownloadLink("https://localhost:8000/some/file-name.pdf")).toBe(
        "https://localhost:8000/some/file-name.pdf"
      );
    });

    it("return download link if no protocol provided", () => {
      expect(getDownloadLink("localhost:8000/some/file-name.pdf")).toBe(
        "https://localhost:8000/some/file-name.pdf"
      );
    });

    it("return download link if no protocol provided with slashes before url", () => {
      expect(getDownloadLink("//localhost:8000/someFile.pdf")).toBe(
        "https://localhost:8000/someFile.pdf"
      );
    });
    it("should return undefined if the url is undefined", () => {
      expect(getDownloadLink(undefined)).toBeUndefined();
    });
  });

  describe("getExtension function", () => {
    it("return extension if href provided with file name", () => {
      expect(getExtension("http://localhost:8000/someFile.pdf")).toBe("pdf");
    });
  });
});
