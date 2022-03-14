import { ThemeProvider } from "@bmi/components";
import { render } from "@testing-library/react";
import React from "react";
import {
  createFullyPopulatedPimProductDocument,
  createPimProductDocument,
  PimProductDocument
} from "@bmi/elasticsearch-types";
import fileIconsMap from "../../../../components/FileIconsMap";
import { ContentfulAssetType as AssetTypeData } from "../../../../types/AssetType";
import createAssetType, {
  createAssetTypeInvalid
} from "../../../../__tests__/helpers/AssetTypeHelper";
import MobileDocumentTechnicalTableResults from "../_MobileDocumentTechnicalTableResults";

describe("MobileDocumentTechnicalTableResults component", () => {
  describe("Renders correctly", () => {
    it("when only single documents are present for asset types", () => {
      const assetTypes: AssetTypeData[] = [createAssetType()];
      const documentsByProduct: [string, PimProductDocument[]][] = [
        ["product1", [createPimProductDocument()]],
        ["product3", []]
      ];

      const wrapper = render(
        <ThemeProvider>
          <MobileDocumentTechnicalTableResults
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
          <MobileDocumentTechnicalTableResults
            documentsByProduct={documentsByProduct}
            assetTypes={assetTypes}
            fileIconsMap={fileIconsMap}
          />
        </ThemeProvider>
      );

      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("when multiple documents are present for asset types", () => {
      const assetTypes = [
        createAssetType({
          code: "pim-code",
          pimCode: "pim-code"
        })
      ];
      const documentsByProduct: [string, PimProductDocument[]][] = [
        [
          "product1",
          [
            createPimProductDocument(
              createFullyPopulatedPimProductDocument({
                assetType: {
                  code: "pim-code",
                  pimCode: "pim-code",
                  name: "pim-code"
                }
              })
            ),
            createPimProductDocument(
              createFullyPopulatedPimProductDocument({
                assetType: {
                  code: "pim-code",
                  pimCode: "pim-code",
                  name: "pim-code"
                }
              })
            )
          ]
        ],
        ["product3", []]
      ];

      const wrapper = render(
        <ThemeProvider>
          <MobileDocumentTechnicalTableResults
            documentsByProduct={documentsByProduct}
            assetTypes={assetTypes}
            fileIconsMap={fileIconsMap}
          />
        </ThemeProvider>
      );

      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("when valid asset types are used", () => {
      const assetTypes: AssetTypeData[] = [
        createAssetType({ code: "pim-code", pimCode: "pim-code" })
      ];
      const documentsByProduct: [string, PimProductDocument[]][] = [
        [
          "product1",
          [
            createFullyPopulatedPimProductDocument({
              assetType: {
                code: "pim-code",
                pimCode: "pim-code",
                name: "pim-code"
              },
              isLinkDocument: false
            }),
            createPimProductDocument({
              assetType: {
                code: "pim-code-2",
                pimCode: "pim-code-2",
                name: "pim-code-2"
              },
              isLinkDocument: false,
              format: "image/jpg"
            })
          ]
        ]
      ];

      const wrapper = render(
        <ThemeProvider>
          <MobileDocumentTechnicalTableResults
            documentsByProduct={documentsByProduct}
            assetTypes={assetTypes}
            fileIconsMap={fileIconsMap}
          />
        </ThemeProvider>
      );
      const svg = wrapper.container.querySelector(".format-icon");

      expect(wrapper.baseElement).toMatchSnapshot();
      expect(svg).toBeTruthy();
    });

    it("when invalid asset types are used", () => {
      const assetTypes: AssetTypeData[] = [
        createAssetTypeInvalid({ code: "inValid" })
      ];
      const documentsByProduct: [string, PimProductDocument[]][] = [
        [
          "product1",
          [
            createFullyPopulatedPimProductDocument({
              assetType: {
                code: "inValid",
                pimCode: "inValid",
                name: "inValid"
              }
            }),
            createPimProductDocument({
              assetType: {
                code: "inValid-2",
                pimCode: "inValid-2",
                name: "inValid-2"
              }
            })
          ]
        ]
      ];

      documentsByProduct[0][1]["format"] = "onlv";

      const wrapper = render(
        <ThemeProvider>
          <MobileDocumentTechnicalTableResults
            documentsByProduct={documentsByProduct}
            assetTypes={assetTypes}
            fileIconsMap={fileIconsMap}
          />
        </ThemeProvider>
      );
      const svg = wrapper.container.querySelector(".format-icon");

      expect(wrapper.baseElement).toMatchSnapshot();
      expect(svg).toBeTruthy();
    });
  });
});
