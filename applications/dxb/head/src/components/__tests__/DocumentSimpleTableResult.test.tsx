import { ThemeProvider } from "@bmi-digital/components";
import { useMediaQuery } from "@mui/material";
import { render, screen } from "@testing-library/react";
import React from "react";
import { createPimProductDocument as createESPimProductDocument } from "@bmi/elasticsearch-types";
import { ProductDocument as PIMDocument } from "../../types/pim";
import createAssetType from "../../__tests__/helpers/AssetTypeHelper";
import createPimDocument, {
  createPseudoZipDocument
} from "../../__tests__/helpers/PimDocumentHelper";
import DocumentSimpleTableResults, {
  Props,
  getProductStatus,
  formatDate
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

function renderDocumentResults(props?: Partial<Props>) {
  const defaultProps: Props = {
    documents: []
  };
  return render(
    <ThemeProvider>
      <DocumentSimpleTableResults {...defaultProps} {...props} />
    </ThemeProvider>
  );
}

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
    });

    describe("when there are PIMDocuments", () => {
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
