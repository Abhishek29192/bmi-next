import { ThemeProvider } from "@bmi-digital/components";
import { createPimProductDocument as createESPimProductDocument } from "@bmi/elasticsearch-types";
import { useMediaQuery } from "@mui/material";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ProductDocument as PIMDocument } from "../../types/pim";
import createAssetType from "../../__tests__/helpers/AssetTypeHelper";
import createContentfulDocument from "../../__tests__/helpers/ContentfulDocumentHelper";
import createPimDocument, {
  createPseudoZipDocument
} from "../../__tests__/helpers/PimDocumentHelper";
import createPimSystemDocument from "../../__tests__/helpers/PimSystemDocumentHelper";
import DocumentSimpleTableResults, {
  formatDate,
  getProductStatus,
  getUniqueId,
  isLinkDocument,
  isPIMDocument,
  mapAssetToFileDownload,
  Props
} from "../DocumentSimpleTableResults";

jest.mock("@mui/material", () => ({
  ...(jest.requireActual("@mui/material") as any),
  useMediaQuery: jest.fn()
}));

jest.mock("../DocumentSimpleTableResultsMobile", () => ({
  DocumentSimpleTableResultsMobile: () => <div>Mobile Results</div>
}));

const pimLinkDocument: PIMDocument = createPimDocument({
  isLinkDocument: true
});

const pimDocument: PIMDocument = createPimDocument({ isLinkDocument: false });
const pseudoZipAssetTypeName = "pseudo-zip-asset-type";
const pseudoZipPIMDocument = createPseudoZipDocument({
  assetType: createAssetType({ name: pseudoZipAssetTypeName })
});
const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;

const renderDocumentResults = (props?: Partial<Props>) => {
  const defaultProps: Props = {
    documents: []
  };
  return render(
    <ThemeProvider>
      <DocumentSimpleTableResults {...defaultProps} {...props} />
    </ThemeProvider>
  );
};

describe("isLinkDocument", () => {
  it("should return true if the document has the 'isLinkDocument' property and its value is true", () => {
    const pimLinkDocument: PIMDocument = createPimDocument({
      isLinkDocument: true
    });
    expect(isLinkDocument(pimLinkDocument)).toBe(true);
  });

  it("should return false if the document does not have the 'isLinkDocument' property", () => {
    const pimLinkDocument: PIMDocument = createPimDocument({});
    expect(isLinkDocument(pimLinkDocument)).toBe(false);
  });

  it("should return false if the 'isLinkDocument' property is present but its value is false", () => {
    const pimLinkDocument: PIMDocument = createPimDocument({
      isLinkDocument: false
    });
    expect(isLinkDocument(pimLinkDocument)).toBe(false);
  });
});

describe("isPimDocument", () => {
  it("should return true for PimDocument", () => {
    const document = createPimDocument();
    expect(isPIMDocument(document)).toBe(true);
  });

  test("returns true for a PIM system document", () => {
    const document = createPimSystemDocument();
    expect(isPIMDocument(document)).toBe(true);
  });

  test("returns false for a non-PIM document", () => {
    const document: any = createContentfulDocument();
    expect(isPIMDocument(document)).toBe(false);
  });
});

describe("getUniqueID", () => {
  it("should return a concatenated string with spaces between words replaced with underscores", () => {
    const document: PIMDocument = createPimDocument({
      id: "123",
      title: "This is a Test Document"
    });
    const expectedID = "123-This_is_a_Test_Document";
    expect(getUniqueId(document)).toBe(expectedID);
  });
});

describe("DocumentSimpleTableResult", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("in desktop view", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValueOnce(false);
    });

    describe("when there are PIMLinkDocuments", () => {
      it("should render external link icon", () => {
        renderDocumentResults({ documents: [pimLinkDocument] });
        const link = screen.getByRole("link");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", pimLinkDocument.url);
      });

      it("should render checkboxes for selection", () => {
        renderDocumentResults({ documents: [pimDocument] });
        expect(
          screen.getByRole("checkbox", {
            name: "MC: documentLibrary.download Pim Document"
          })
        ).toBeInTheDocument();
      });

      it("should render productStatus and validityDate headers", () => {
        renderDocumentResults({
          documents: [pimDocument],
          headers: ["name", "title", "validityDate", "productStatus"]
        });
        expect(
          screen.getByText("MC: documentLibrary.headers.productStatus")
        ).toBeInTheDocument();
        expect(
          screen.getByText("MC: documentLibrary.headers.validityDate")
        ).toBeInTheDocument();
      });

      it("should render document with product status cell", () => {
        renderDocumentResults({
          headers: ["productStatus"],
          documents: [{ ...pimDocument, approvalStatus: "approved" }]
        });
        expect(
          screen.getByText("MC: document.status.available")
        ).toBeInTheDocument();
      });
    });

    describe("when all headers are present", () => {
      it("should render documents", () => {
        renderDocumentResults({
          documents: [pimDocument],
          headers: ["typeCode", "type", "name", "title", "download", "add"]
        });
        expect(
          screen.getByRole("checkbox", {
            name: "MC: documentLibrary.download Pim Document"
          })
        ).toBeInTheDocument();
      });
    });

    describe("when multiple types of documents are present", () => {
      it("should render documents", () => {
        renderDocumentResults({
          documents: [pimDocument, pseudoZipPIMDocument],
          headers: ["typeCode", "type", "name", "title", "download", "add"]
        });
        expect(
          screen.getByRole("checkbox", {
            name: "MC: documentLibrary.download Pim Document"
          })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("checkbox", {
            name: `MC: documentLibrary.download ${pseudoZipAssetTypeName}`
          })
        ).toBeInTheDocument();
      });
    });

    describe("when multiple types of documents are present with pagination", () => {
      it("should render documents", () => {
        renderDocumentResults({
          documents: [null],
          headers: ["typeCode", "type", "name", "title", "download", "add"]
        });
        expect(
          screen.queryAllByRole("checkbox", {
            name: "MC: documentLibrary.download Pim Document"
          }).length
        ).toEqual(0);
      });
    });
  });

  describe("in mobile view", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValueOnce(true);
    });

    it("should render mobile results view", () => {
      renderDocumentResults();
      expect(screen.getByText("Mobile Results")).toBeInTheDocument();
    });
  });
});

describe("getProductStatus", () => {
  it("should return '-'", () => {
    const document = createESPimProductDocument();
    delete document.approvalStatus;
    const productStatus = getProductStatus(document, jest.fn());
    expect(productStatus).toBe("-");
  });

  it("should return status 'Available'", () => {
    const getMicroCopy = jest.fn();
    const document = createESPimProductDocument({ approvalStatus: "approved" });
    getProductStatus(document, getMicroCopy);
    expect(getMicroCopy).toHaveBeenCalledWith("document.status.available");
  });

  it("should return status 'Discontinued'", () => {
    const getMicroCopy = jest.fn();
    const document = createESPimProductDocument({
      approvalStatus: "discontinued"
    });
    getProductStatus(document, getMicroCopy);
    expect(getMicroCopy).toHaveBeenCalledWith("document.status.discontinued");
  });
});

describe("formatDate", () => {
  it("should return '-'", () => {
    const document = createESPimProductDocument();
    delete document.validUntil;
    const formattedDate = formatDate(document);
    expect(formattedDate).toBe("-");

    document.validUntil = undefined;
    expect(formattedDate).toBe("-");
  });

  it("should return date", () => {
    const document = createESPimProductDocument({
      validUntil: new Date("2023-10-27T08:23:59+0000").getTime()
    });
    const formattedDate = formatDate(document);
    expect(formattedDate).toBe("27.10.2023");
  });

  it("should return date in correct format if day or month is less than 10", () => {
    const document = createESPimProductDocument({
      validUntil: new Date("2023-08-03T08:23:59+0000").getTime()
    });
    const formattedDate = formatDate(document);
    expect(formattedDate).toBe("03.08.2023");
  });
});

describe("mapAssetToFileDownload", () => {
  it("should map PIMDocument types to FileDownloadButtonProps correctly", () => {
    const document = createPimDocument();
    const getMicroCopy = jest.fn();
    const expected = {
      url: "http://pimDocument",
      format: "application/pdf",
      size: 10,
      assetTypeName: "asset-name",
      title: "Pim Document",
      isLinkDocument: false,
      productStatus: "-",
      validUntil: "-"
    };
    expect(mapAssetToFileDownload(document, getMicroCopy)).toEqual(expected);
  });
  it("should map PIMSystemDocument types to FileDownloadButtonProps correctly", () => {
    const document = createPimSystemDocument();
    const getMicroCopy = jest.fn();
    const expected = {
      url: "http://localhost/pim-link-document-id",
      format: "application/pdf",
      size: 10,
      assetTypeName: "asset-name",
      title: "pim-link-document-title",
      isLinkDocument: true,
      productStatus: "-",
      validUntil: "-"
    };
    expect(mapAssetToFileDownload(document, getMicroCopy)).toEqual(expected);
  });
});
