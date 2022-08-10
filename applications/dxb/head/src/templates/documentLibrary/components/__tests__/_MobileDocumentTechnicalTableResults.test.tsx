import { render } from "@testing-library/react";
import React from "react";
import fileIconsMap from "../../../../components/FileIconsMap";
import { ContentfulAssetType as AssetTypeData } from "../../../../types/AssetType";
import { ProductDocument } from "../../../../types/pim";
import createAssetType, {
  createAssetTypeInvalid
} from "../../../../__tests__/helpers/AssetTypeHelper";
import createPimDocument from "../../../../__tests__/helpers/PimDocumentHelper";
import MobileDocumentTechnicalTableResults from "../_MobileDocumentTechnicalTableResults";

describe("MobileDocumentTechnicalTableResults component", () => {
  describe("Renders correctly", () => {
    it("when only single documents are present for asset types", () => {
      const assetTypes: AssetTypeData[] = [createAssetType()];
      const documentsByProduct: [string, ProductDocument[]][] = [
        ["product1", [createPimDocument()]],
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
      const documentsByProduct: [string, ProductDocument[]][] = [
        ["product1", [createPimDocument({ assetType: assetTypes[0] })]],
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
      const documentsByProduct: [string, ProductDocument[]][] = [
        ["product1", [createPimDocument(), createPimDocument()]],
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
      const assetTypes: AssetTypeData[] = [
        createAssetType({ pimCode: "pim-code", id: "id" })
      ];
      const documentsByProduct: [string, ProductDocument[]][] = [
        [
          "product1",
          [
            createPimDocument({
              assetType: {
                code: "pim-code",
                pimCode: "pim-code",
                name: "pim-code",
                id: "id"
              },
              isLinkDocument: false
            }),
            createPimDocument({
              assetType: {
                code: "pim-code",
                pimCode: "pim-code",
                name: "pim-code",
                id: "id-2"
              },
              isLinkDocument: false,
              format: "image/jpg"
            })
          ]
        ]
      ];

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
      const assetTypes: AssetTypeData[] = [
        createAssetTypeInvalid({ id: "id" })
      ];
      const documentsByProduct: [string, ProductDocument[]][] = [
        [
          "product1",
          [
            createPimDocument({
              assetType: {
                code: "inValid",
                pimCode: "inValid",
                name: "inValid",
                id: "id"
              }
            }),
            createPimDocument({
              assetType: {
                code: "inValid-2",
                pimCode: "inValid-2",
                name: "inValid-2",
                id: "id-2"
              }
            })
          ]
        ]
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