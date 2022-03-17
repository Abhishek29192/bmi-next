import React from "react";
import { render } from "@testing-library/react";
import MobileDocumentTechnicalTableResults from "../_MobileDocumentTechnicalTableResults";
import { Data as AssetTypeData } from "../AssetType";
import { PIMDocumentData, PIMLinkDocumentData } from "../types/PIMDocumentBase";
import createAssetType, {
  createAssetTypeInvalid
} from "../../__tests__/AssetTypeHelper";
import createPimDocument from "../../__tests__/PimLinkDocumentHelper";
import createPimLinkDocument from "../../__tests__/PimLinkDocumentHelper";
import fileIconsMap from "../FileIconsMap";
import createProduct from "../../__tests__/PimDocumentProductHelper";

const createNonPimLinkDocument = (): any => ({
  __typename: "NON_PIMLinkDocument",
  id: "pim-link-document-id",
  title: "pim-link-document-title",
  product: createProduct(),
  url: "http://localhost/pim-link-document-id",
  assetType: createAssetType()
});

describe("MobileDocumentTechnicalTableResults component", () => {
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
        <MobileDocumentTechnicalTableResults
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
        <MobileDocumentTechnicalTableResults
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
        <MobileDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
          fileIconsMap={fileIconsMap}
        />
      );

      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("when valid asset types are used", () => {
      const assetTypes: AssetTypeData[] = [createAssetType()];
      const documentsByProduct: [
        string,
        (PIMDocumentData | PIMLinkDocumentData)[]
      ][] = [
        ["product1", [createNonPimLinkDocument(), createNonPimLinkDocument()]]
      ];

      documentsByProduct[0][1]["format"] = "image/jpg";

      const wrapper = render(
        <MobileDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
          fileIconsMap={fileIconsMap}
        />
      );

      expect(wrapper.baseElement).toMatchSnapshot();
      expect(wrapper.baseElement.innerHTML).toContain(
        '<svg class="format-icon"></svg>'
      );
    });

    it("when invalid asset types are used", () => {
      const assetTypes: AssetTypeData[] = [createAssetTypeInvalid()];
      const documentsByProduct: [
        string,
        (PIMDocumentData | PIMLinkDocumentData)[]
      ][] = [
        ["product1", [createNonPimLinkDocument(), createNonPimLinkDocument()]]
      ];

      documentsByProduct[0][1]["format"] = "onlv";

      const wrapper = render(
        <MobileDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
          fileIconsMap={fileIconsMap}
        />
      );

      expect(wrapper.baseElement).toMatchSnapshot();
      expect(wrapper.baseElement.innerHTML).toContain(
        '<svg class="format-icon"></svg>'
      );
    });
  });
});
