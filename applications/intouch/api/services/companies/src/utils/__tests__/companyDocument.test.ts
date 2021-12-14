import { getDocumentType, isCompanyDocumentType } from "../companyDocument";

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
  it("should return true if path is contain exist company document", async () => {
    expect(isCompanyDocumentType(null)).toBeFalsy();
    expect(isCompanyDocumentType(undefined)).toBeFalsy();
    expect(isCompanyDocumentType("company/1/image.gif")).toBeFalsy();
    expect(isCompanyDocumentType("company/1/image.exe")).toBeFalsy();
  });
  it("should return false if path is not contain exist company document", async () => {
    expect(isCompanyDocumentType("company/1/file.pdf")).toBeTruthy();
    expect(isCompanyDocumentType("company/1/image.jpg")).toBeTruthy();
    expect(isCompanyDocumentType("company/1/image.jpeg")).toBeTruthy();
    expect(isCompanyDocumentType("company/1/image.png")).toBeTruthy();
  });
});
