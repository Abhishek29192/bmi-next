import DownloadList, {
  DownloadListContext
} from "@bmi-digital/components/download-list";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { ApprovalStatus } from "@bmi/pim-types";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from "@testing-library/react";
import React from "react";
import createAssetType from "../../__tests__/helpers/AssetTypeHelper";
import createContentfulDocument from "../../__tests__/helpers/ContentfulDocumentHelper";
import createPimDocument, {
  createPseudoZipDocument
} from "../../__tests__/helpers/PimDocumentHelper";
import createPimSystemDocument from "../../__tests__/helpers/PimSystemDocumentHelper";
import { renderWithProviders } from "../../__tests__/renderWithProviders";
import { ProductDocument as PIMDocument } from "../../types/pim";
import { getUniqueId } from "../../utils/documentUtils";
import DocumentSimpleTableResults, {
  Props,
  isPIMDocument
} from "../DocumentSimpleTableResults";

jest.mock("@mui/material/useMediaQuery", () => ({
  __esModule: true,
  default: jest.fn()
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
    documents: [],
    pageNumber: 0
  };
  return render(
    <ThemeProvider>
      <DocumentSimpleTableResults {...defaultProps} {...props} />
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
        documents: [{ ...pimDocument, approvalStatus: ApprovalStatus.Approved }]
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

  describe("selectAll functionality", () => {
    const downloadListprops = {
      size: 0,
      totalSize: 0,
      list: {},
      selectedAllCheckboxDisabledByPages: { 0: false },
      selectedAllCheckboxCheckedByPages: { 0: false },
      allListItemsWithPages: {},
      updateList: jest.fn(),
      updateAllListItems: jest.fn(),
      resetList: jest.fn(),
      resetAllListItems: jest.fn(),
      count: 0,
      remainingSize: Infinity,
      isLoading: false,
      setIsLoading: jest.fn(),
      setSelectAllCheckboxDisabledByPage: () => jest.fn(),
      setSelectAllCheckboxCheckedByPage: () => jest.fn(),
      currentPage: 0,
      setCurrentPage: jest.fn()
    };

    it("should not add selected listitems again", async () => {
      const selectedDocument = createPimDocument({
        id: "1",
        productBaseCode: "selected-document",
        productName: "selected document",
        title: "selected document"
      });
      const documents = [createPimDocument(), selectedDocument];
      const updateList = jest.fn();
      renderWithProviders(
        <DownloadListContext.Provider
          value={{
            ...downloadListprops,
            size: selectedDocument.fileSize!,
            list: { "1-selected_document": selectedDocument },
            allListItemsWithPages: {
              0: {
                "1-selected_document": { value: selectedDocument, fileSize: 0 },
                "2-selected_document": { value: selectedDocument, fileSize: 0 },
                "3-selected_document": { value: selectedDocument, fileSize: 0 }
              }
            },
            updateList
          }}
        >
          <DocumentSimpleTableResults documents={documents} pageNumber={0} />
        </DownloadListContext.Provider>
      );

      const checkboxContainer = screen.getByTestId("document-table-select-all");
      const selectAllCheckbox = within(checkboxContainer).getByRole("checkbox");

      fireEvent.click(selectAllCheckbox);

      await screen.findByTestId("document-table-select-all");

      await waitFor(() => {
        expect(updateList).toHaveBeenCalledTimes(2);
      });
    });

    it("should select all documents correctly if there is PIMDocumentWithPseudoZip document", () => {
      const onChangeMock = jest.fn();
      const zipDocument = createPseudoZipDocument({
        id: "id",
        title: "pseudo zip document title",
        documentList: [
          createPimDocument({
            id: "pim-document-1",
            title: "pim document 1"
          }),
          createPimDocument({
            id: "pim-document-2",
            title: "pim document 2"
          })
        ],
        fileSize: 300
      });

      renderWithProviders(
        <DownloadList onChange={onChangeMock}>
          <DocumentSimpleTableResults
            documents={[zipDocument]}
            pageNumber={0}
          />
        </DownloadList>
      );

      const checkboxContainer = screen.getByTestId("document-table-select-all");
      const selectAllCheckbox = within(checkboxContainer).getByRole("checkbox");
      fireEvent.click(selectAllCheckbox);
      expect(onChangeMock).toHaveBeenCalled();
    });

    it("should deselect previously selected documents", () => {
      const documentId = getUniqueId(pimDocument);
      const onChangeMock = jest.fn();
      renderWithProviders(
        <DownloadList onChange={onChangeMock}>
          <DocumentSimpleTableResults
            documents={[pimDocument]}
            pageNumber={0}
          />
        </DownloadList>
      );
      const selectAllCheckbox = screen.getByRole("checkbox", {
        name: "MC: documentLibrary.headers.add"
      });

      fireEvent.click(selectAllCheckbox);

      expect(onChangeMock).toHaveBeenCalledWith({ [documentId]: pimDocument });

      fireEvent.click(selectAllCheckbox);
      expect(onChangeMock).toHaveBeenCalledWith({});
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
