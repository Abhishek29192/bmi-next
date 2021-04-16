import React from "react";
import { render } from "@testing-library/react";
import { iconMap } from "@bmi/icon";
import DesktopDocumentTechnicalTableResults from "../_DesktopDocumentTechnicalTableResults";
import { Data as AssetTypeData } from "../AssetType";
import { Data as PIMDocumentData } from "../PIMDocument";
import { Data as PIMLinkDocumentData } from "../PIMLinkDocument";
import { Format } from "../types";
import createAssetType from "../../test/AssetTypeHelper";
import createPimDocument from "../../test/PimLinkDocumentHelper";
import createPimLinkDocument from "../../test/PimLinkDocumentHelper";

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
      const fileIconsMap: Record<Format, React.ComponentType> = {
        "application/pdf": iconMap.FilePDF,
        "application/zip": iconMap.FileZIP,
        "image/jpg": iconMap.FileJPG,
        "image/jpeg": iconMap.FileJPEG,
        "image/png": iconMap.FilePNG
      };

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
      const fileIconsMap: Record<Format, React.ComponentType> = {
        "application/pdf": iconMap.FilePDF,
        "application/zip": iconMap.FileZIP,
        "image/jpg": iconMap.FileJPG,
        "image/jpeg": iconMap.FileJPEG,
        "image/png": iconMap.FilePNG
      };

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
      const fileIconsMap: Record<Format, React.ComponentType> = {
        "application/pdf": iconMap.FilePDF,
        "application/zip": iconMap.FileZIP,
        "image/jpg": iconMap.FileJPG,
        "image/jpeg": iconMap.FileJPEG,
        "image/png": iconMap.FilePNG
      };

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
