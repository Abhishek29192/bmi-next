import { useMediaQuery } from "@material-ui/core";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ProductDocument } from "../../../../types/pim";
import createPimDocument from "../../../../__tests__/helpers/PimDocumentHelper";
import DocumentTechnicalTableResults, {
  getCount
} from "../DocumentTechnicalTableResults";

jest.mock("@material-ui/core", () => ({
  ...(jest.requireActual("@material-ui/core") as any),
  useMediaQuery: jest.fn()
}));

const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;
const pimDocumentNoAssetType: ProductDocument = createPimDocument({
  isLinkDocument: false,
  assetType: undefined
});

const pimDocument: ProductDocument = createPimDocument({
  isLinkDocument: false
});

const pimDocument2: ProductDocument = createPimDocument({
  isLinkDocument: false,
  productBaseCode: "product-base-code-2"
});

describe("DocumentTechnicalTableResults component", () => {
  describe("in desktop view", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValueOnce(false);
    });
    it("renders correctly", () => {
      const { container } = render(
        <DocumentTechnicalTableResults
          documents={[pimDocument]}
          page={1}
          documentsPerPage={1}
        />
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe("in mobile view", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValueOnce(true);
    });
    it("renders correctly", () => {
      const { container } = render(
        <DocumentTechnicalTableResults
          documents={[pimDocument]}
          page={1}
          documentsPerPage={1}
        />
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe("when documents doesn not have any asset types", () => {
    it("renders error message correctly", () => {
      render(
        <DocumentTechnicalTableResults
          documents={[pimDocumentNoAssetType, pimDocumentNoAssetType]}
          page={1}
          documentsPerPage={1}
        />
      );

      expect(
        screen.getByText(
          "A technical table cannot being shown with no asset types."
        )
      ).toBeInTheDocument();
    });
  });

  describe("getCount tests", () => {
    describe("When all documents have same product base code", () => {
      it("returns correct count of documents after grouping", () => {
        const result = getCount([pimDocument, pimDocument]);
        expect(result).toEqual(1);
      });
    });

    describe("When all documents have different product base code", () => {
      it("returns correct count of documents after grouping", () => {
        const result = getCount([
          pimDocument,
          pimDocument2,
          pimDocument,
          pimDocument2
        ]);
        expect(result).toEqual(2);
      });
    });
  });
});
