import { DownloadListContext, ThemeProvider } from "@bmi-digital/components";
import { useMediaQuery } from "@mui/material";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import createAssetType from "../../__tests__/helpers/AssetTypeHelper";
import createContentfulDocument from "../../__tests__/helpers/ContentfulDocumentHelper";
import createPimDocument, {
  createPseudoZipDocument
} from "../../__tests__/helpers/PimDocumentHelper";
import { DocumentListProvider } from "../../contexts/DocumentContext";
import createPimSystemDocument from "../../__tests__/helpers/PimSystemDocumentHelper";
import { ProductDocument as PIMDocument } from "../../types/pim";
import DocumentSimpleTableResults, {
  Props,
  isPIMDocument
} from "../DocumentSimpleTableResults";
import { renderWithProviders } from "../../__tests__/renderWithProviders";

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
      <DocumentListProvider>
        <DocumentSimpleTableResults {...defaultProps} {...props} />
      </DocumentListProvider>
    </ThemeProvider>
  );
};

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

describe("DocumentSimpleTableResult", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("in desktop view", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValueOnce(false);
    });

    it("should not render copy url button if document is PIMDocumentWithPseudoZip", () => {
      renderDocumentResults({ documents: [pseudoZipPIMDocument] });
      expect(screen.getByText(pseudoZipPIMDocument.title)).toBeInTheDocument();
      expect(
        screen.queryByLabelText(`Copy ${pseudoZipPIMDocument.title}`)
      ).not.toBeInTheDocument();
    });

    describe("when there are PIMLinkDocuments", () => {
      it("should render external link icon", () => {
        renderDocumentResults({ documents: [pimLinkDocument] });
        const link = screen.getByRole("link");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", pimLinkDocument.url);
      });

      it("should not render file size and download button if document is PIMLinkDocuments", () => {
        renderDocumentResults({ documents: [pimLinkDocument] });
        const fileSizeCell = screen.getByTestId(
          `document-table-size-${pimLinkDocument.id}`
        );
        expect(fileSizeCell.textContent).toBe("-");
        expect(
          screen.queryByTestId(
            `document-table-actions-download-${pimDocument.id}`
          )
        ).not.toBeInTheDocument();
      });
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

    it("renders assetType field as a title if title header does not exist", () => {
      renderDocumentResults({
        headers: ["type"],
        documents: [
          {
            ...pimDocument,
            assetType: createAssetType({ name: "Assembly instructions" })
          }
        ]
      });
      expect(screen.getByText("Assembly instructions")).toBeInTheDocument();
    });
  });

  describe("when all headers are present", () => {
    it("should render documents", () => {
      renderDocumentResults({
        documents: [pimDocument],
        headers: ["add", "typeCode", "type", "name", "title", "size", "actions"]
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
        headers: ["add", "typeCode", "type", "name", "title", "size", "actions"]
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
        documents: [],
        headers: ["add", "typeCode", "type", "name", "title", "size", "actions"]
      });
      expect(
        screen.queryAllByRole("checkbox", {
          name: "MC: documentLibrary.download Pim Document"
        }).length
      ).toEqual(0);
    });
  });

  describe("test selectAll functionality", () => {
    it("select all functionality", async () => {
      const documents = [createPimDocument()];
      const updateList = jest.fn();

      const MockDownloadListProvider = ({ children }) => (
        <DownloadListContext.Provider
          value={{
            size: 0,
            list: {},
            updateList,
            resetList: jest.fn(),
            count: 0,
            remainingSize: Infinity,
            isLoading: false,
            setIsLoading: jest.fn()
          }}
        >
          {children}
        </DownloadListContext.Provider>
      );

      render(
        <ThemeProvider>
          <MockDownloadListProvider>
            <DocumentListProvider>
              <DocumentSimpleTableResults documents={documents} />
            </DocumentListProvider>
          </MockDownloadListProvider>
        </ThemeProvider>
      );
      const selectAllCheckbox = screen.getByTestId("document-table-select-all");
      fireEvent.click(selectAllCheckbox);
      expect(selectAllCheckbox).toHaveClass("Mui-checked");
      expect(updateList).toHaveBeenCalledTimes(1);

      fireEvent.click(selectAllCheckbox);
      expect(selectAllCheckbox).not.toHaveClass("Mui-checked");
    });

    it("should not select the same document twice", async () => {
      const selectedDocument = createPimDocument({
        id: "1",
        productBaseCode: "selected-document",
        productName: "selected document",
        title: "selected document"
      });
      const documents = [createPimDocument(), selectedDocument];
      const updateListMock = jest.fn();
      renderWithProviders(
        <DownloadListContext.Provider
          value={{
            size: selectedDocument.fileSize!,
            list: { "1-selected_document": selectedDocument },
            updateList: updateListMock,
            resetList: jest.fn(),
            count: 0,
            remainingSize: Infinity,
            isLoading: false,
            setIsLoading: jest.fn()
          }}
        >
          <DocumentListProvider>
            <DocumentSimpleTableResults documents={documents} />
          </DocumentListProvider>
        </DownloadListContext.Provider>
      );

      const selectAllCheckbox = screen.getByTestId("document-table-select-all");
      fireEvent.click(selectAllCheckbox);
      expect(updateListMock).toHaveBeenCalledTimes(1);
    });
  });
});

describe("in mobile view", () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(true);
  });

  it("should render mobile results view", () => {
    renderDocumentResults();
    expect(screen.getByText("Mobile Results")).toBeInTheDocument();
  });
});
