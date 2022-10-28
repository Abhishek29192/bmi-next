import { useMediaQuery } from "@material-ui/core";
import { render } from "@testing-library/react";
import React from "react";
import { createPimProductDocument } from "@bmi/elasticsearch-types";
import DocumentTechnicalTableResults from "../DocumentTechnicalTableResults";
import createAssetType from "../../../../__tests__/helpers/AssetTypeHelper";

jest.mock("@material-ui/core", () => ({
  ...(jest.requireActual("@material-ui/core") as any),
  useMediaQuery: jest.fn()
}));

const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;
const pimDocument = createPimProductDocument({
  isLinkDocument: false
});

const assetType = createAssetType({ code: pimDocument.assetType.code });

describe("DocumentTechnicalTableResults component", () => {
  describe("in desktop view", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValueOnce(false);
    });
    it("renders correctly", () => {
      const { container } = render(
        <DocumentTechnicalTableResults
          documents={[pimDocument]}
          assetTypes={[assetType]}
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
          assetTypes={[assetType]}
        />
      );

      expect(container).toMatchSnapshot();
    });
  });
});
