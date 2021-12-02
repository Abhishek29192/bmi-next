import { getDocumentType } from "../companyDocument";

describe("Get Document Type", () => {
  it("should not return unknown extension", async () => {
    expect(getDocumentType(null)).toBe(undefined);
    expect(getDocumentType(undefined)).toBe(undefined);
    expect(getDocumentType("/company/1/image.gif")).toBe(undefined);
  });
  it("should return extension of accepted", async () => {
    expect(getDocumentType("company/1/file.pdf")).toBe("PDF");
    expect(getDocumentType("company/1/image.jpg")).toBe("JPG");
    expect(getDocumentType("company/1/image.jpeg")).toBe("JPEG");
    expect(getDocumentType("company/1/image.png")).toBe("PNG");
  });
});
