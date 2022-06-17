import React from "react";
import { render, screen } from "@testing-library/react";
import { useMediaQuery } from "@material-ui/core";
import { ProductDocument as PIMDocument } from "../../types/pim";
import DocumentSimpleTableResults, {
  Props
} from "../DocumentSimpleTableResults";
import createPimDocument from "../../__tests__/helpers/PimDocumentHelper";

jest.mock("@material-ui/core", () => ({
  ...(jest.requireActual("@material-ui/core") as any),
  useMediaQuery: jest.fn()
}));

jest.mock("../DocumentSimpleTableResultsMobile", () => ({
  DocumentSimpleTableResultsMobile: () => <div>Mobile Results</div>
}));

const pimLinkDocument: PIMDocument = createPimDocument({
  isLinkDocument: true
});

const pimDocument: PIMDocument = createPimDocument({ isLinkDocument: false });

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
            name: "MC: documentLibrary.download Pim Document"
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
