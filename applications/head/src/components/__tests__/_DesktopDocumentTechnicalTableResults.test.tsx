import React from "react";
import { render } from "@testing-library/react";
import DesktopDocumentTechnicalTableResults from "../_DesktopDocumentTechnicalTableResults";
import { Data as AssetTypeData } from "../AssetType";
import { PIMDocumentData, PIMLinkDocumentData } from "../types/PIMDocumentBase";
import createAssetType from "../../__tests__/AssetTypeHelper";
import createPimDocument from "../../__tests__/PimDocumentHelper";
import createPimLinkDocument from "../../__tests__/PimLinkDocumentHelper";
import fileIconsMap from "../FileIconsMap";

describe("DesktopDocumentTechnicalTableResults component", () => {
  describe("Renders correctly", () => {
    it("when only single documents are present for asset types", () => {
      const assetTypes: AssetTypeData[] = [createAssetType()];
      const documentsByProduct: [
        string,
        (PIMDocumentData | PIMLinkDocumentData)[]
      ][] = [
        ["product1", [createPimDocument()]],
        ["product2", [createPimLinkDocument()]],
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
      const documentsByProduct: [
        string,
        (PIMDocumentData | PIMLinkDocumentData)[]
      ][] = [
        ["product1", [createPimDocument({ assetType: assetTypes[0] })]],
        ["product2", [createPimLinkDocument({ assetType: assetTypes[1] })]],
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
      const documentsByProduct: [
        string,
        (PIMDocumentData | PIMLinkDocumentData)[]
      ][] = [
        ["product1", [createPimDocument(), createPimDocument()]],
        ["product2", [createPimLinkDocument(), createPimLinkDocument()]],
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
