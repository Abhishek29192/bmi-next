import React from "react";
import { render, screen } from "@testing-library/react";
import { useMediaQuery } from "@material-ui/core";
import DocumentSimpleTableResults, {
  Props
} from "../DocumentSimpleTableResults";
import {
  PIMDocumentBase,
  PIMDocumentData,
  PIMLinkDocumentData
} from "../types/PIMDocumentBase";

jest.mock("@material-ui/core", () => ({
  ...(jest.requireActual("@material-ui/core") as any),
  useMediaQuery: jest.fn()
}));

jest.mock("../DocumentSimpleTableResultsMobile", () => ({
  DocumentSimpleTableResultsMobile: () => <div>Mobile Results</div>
}));

const defaultDocument: PIMDocumentBase = {
  id: "hash1",
  title: "document",
  product: { code: "1", name: "some-product" },
  url: "http://somelink.com",
  assetType: {
    __typename: "ContentfulAssetType",
    id: "asset-id",
    name: "asset",
    code: "asset-code",
    description: null,
    pimCode: null
  }
};

const pimLinkDocument: PIMLinkDocumentData = {
  ...defaultDocument,
  isLinkDocument: true,
  __typename: "PIMLinkDocument"
};

const pimDocument: PIMDocumentData = {
  ...defaultDocument,
  fileSize: 10,
  format: "image/jpeg",
  extension: "extension",
  realFileName: "document.jpeg",
  isLinkDocument: false,
  __typename: "PIMDocument"
};

const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;

function renderDocumentResults(props?: Partial<Props>) {
  const defaultProps: Props = {
    documents: [],
    page: 1,
    documentsPerPage: 10
  };
  return render(<DocumentSimpleTableResults {...defaultProps} {...props} />);
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
            name: "MC: documentLibrary.download document"
          })
        ).toBeInTheDocument();
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
