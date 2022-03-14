import { ThemeProvider } from "@bmi/components";
import {
  createPimProductDocument,
  PimProductDocument
} from "@bmi/elasticsearch-types";
import { render } from "@testing-library/react";
import React from "react";
import fileIconsMap from "../../../../components/FileIconsMap";
import { ContentfulAssetType as AssetTypeData } from "../../../../types/AssetType";
import createAssetType from "../../../../__tests__/helpers/AssetTypeHelper";
import DesktopDocumentTechnicalTableResults from "../_DesktopDocumentTechnicalTableResults";

describe("DesktopDocumentTechnicalTableResults component", () => {
  describe("Renders correctly", () => {
    it("when only single documents are present for asset types", () => {
      const assetTypes: AssetTypeData[] = [createAssetType()];
      const documentsByProduct: [string, PimProductDocument[]][] = [
        ["product1", [createPimProductDocument()]],
        ["product3", []]
      ];

      const wrapper = render(
        <ThemeProvider>
          <DesktopDocumentTechnicalTableResults
            documentsByProduct={documentsByProduct}
            assetTypes={assetTypes}
            fileIconsMap={fileIconsMap}
          />
        </ThemeProvider>
      );

      expect(wrapper.baseElement).toMatchSnapshot();
    });
    it("when not all products have all asset types", () => {
      const assetTypes: AssetTypeData[] = [
        createAssetType(),
        createAssetType({
          id: "a different asset ID",
          name: "doesn't matter but looks good"
        })
      ];
      const documentsByProduct: [string, PimProductDocument[]][] = [
        ["product1", [createPimProductDocument({ assetType: assetTypes[0] })]],
        ["product3", []]
      ];

      const wrapper = render(
        <ThemeProvider>
          <DesktopDocumentTechnicalTableResults
            documentsByProduct={documentsByProduct}
            assetTypes={assetTypes}
            fileIconsMap={fileIconsMap}
          />
        </ThemeProvider>
      );

      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("when multiple documents are present for asset types", () => {
      const assetTypes: AssetTypeData[] = [createAssetType()];
      const documentsByProduct: [string, PimProductDocument[]][] = [
        ["product1", [createPimProductDocument(), createPimProductDocument()]],
        ["product3", []]
      ];

      const wrapper = render(
        <ThemeProvider>
          <DesktopDocumentTechnicalTableResults
            documentsByProduct={documentsByProduct}
            assetTypes={assetTypes}
            fileIconsMap={fileIconsMap}
          />
        </ThemeProvider>
      );

      expect(wrapper.baseElement).toMatchSnapshot();
    });
  });
});
