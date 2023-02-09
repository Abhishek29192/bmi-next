import { ThemeProvider } from "@bmi-digital/components";
import { useMediaQuery } from "@mui/material";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ProductDocument as PIMDocument } from "../../types/pim";
import createAssetType from "../../__tests__/helpers/AssetTypeHelper";
import createPimDocument, {
  createPseudoZipDocument
} from "../../__tests__/helpers/PimDocumentHelper";
import DocumentSimpleTableResults, {
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
