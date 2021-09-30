import { getDownloadLink } from "../client-download";

describe("client download functions", () => {
  describe("getDownloadLink function", () => {
    it("return download link if http provided", () => {
      expect(getDownloadLink("http://localhost:8000")).toBe(
        "http://localhost:8000"
      );
    });

    it("return download link if https provided", () => {
      expect(getDownloadLink("https://localhost:8000")).toBe(
        "https://localhost:8000"
      );
    });

    it("return download link if no protocol provided", () => {
      expect(getDownloadLink("localhost:8000")).toBe("https://localhost:8000");
    });
  });
});
