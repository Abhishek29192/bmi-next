import { render } from "@testing-library/react";
import React from "react";
import fileIconsMap from "../../../../components/FileIconsMap";
import { ContentfulAssetType as AssetTypeData } from "../../../../types/AssetType";
import { ProductDocument } from "../../../../types/pim";
import createAssetType from "../../../../__tests__/helpers/AssetTypeHelper";
import createPimDocument from "../../../../__tests__/helpers/PimDocumentHelper";
import DesktopDocumentTechnicalTableResults from "../_DesktopDocumentTechnicalTableResults";

describe("DesktopDocumentTechnicalTableResults component", () => {
  describe("Renders correctly", () => {
    it("when only single documents are present for asset types", () => {
      const assetTypes: AssetTypeData[] = [createAssetType()];
      const documentsByProduct: [string, ProductDocument[]][] = [
        ["product1", [createPimDocument()]],
        ["product3", []]
      ];

      const wrapper = render(
        <DesktopDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
          fileIconsMap={fileIconsMap}
        />
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
      const documentsByProduct: [string, ProductDocument[]][] = [
        ["product1", [createPimDocument({ assetType: assetTypes[0] })]],
        ["product3", []]
      ];

      const wrapper = render(
        <DesktopDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
          fileIconsMap={fileIconsMap}
        />
      );

      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("when multiple documents are present for asset types", () => {
      const assetTypes: AssetTypeData[] = [createAssetType()];
      const documentsByProduct: [string, ProductDocument[]][] = [
        ["product1", [createPimDocument(), createPimDocument()]],
        ["product3", []]
      ];

      const wrapper = render(
        <DesktopDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
          fileIconsMap={fileIconsMap}
        />
      );

      expect(wrapper.baseElement).toMatchSnapshot();
    });
  });
});
