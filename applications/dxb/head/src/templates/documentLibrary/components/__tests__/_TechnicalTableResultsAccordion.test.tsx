import {
  createFullyPopulatedPimProductDocument,
  createPimProductDocument,
  PimProductDocument
} from "@bmi/elasticsearch-types";
import { screen } from "@testing-library/react";
import React from "react";
import createAssetType from "../../../../__tests__/helpers/AssetTypeHelper";
import { renderWithProviders } from "../../../../__tests__/renderWithProviders";
import { ContentfulAssetType as AssetTypeData } from "../../../../types/AssetType";
import MobileDocumentTechnicalTableResults from "../_TechnicalTableResultsAccordion";

describe("MobileDocumentTechnicalTableResults component", () => {
  describe("Renders correctly", () => {
    it("when only single documents are present for asset types", () => {
      const assetTypes: AssetTypeData[] = [createAssetType()];
      const documentsByProduct: [string, PimProductDocument[]][] = [
        ["product1", [createPimProductDocument()]],
        ["product3", []]
      ];

      const { baseElement } = renderWithProviders(
        <MobileDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
        />
      );

      expect(baseElement).toMatchSnapshot();
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

      const { baseElement } = renderWithProviders(
        <MobileDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
        />
      );

      expect(baseElement).toMatchSnapshot();
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

      const { baseElement } = renderWithProviders(
        <MobileDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
        />
      );

      expect(baseElement).toMatchSnapshot();
    });

    it("renders only assets with correct assetType", () => {
      const assetTypes: AssetTypeData[] = [createAssetType({ code: "AINS" })];
      const documentsByProduct: [string, PimProductDocument[]][] = [
        [
          "product1",
          [
            createFullyPopulatedPimProductDocument({
              assetType: {
                code: "AINS",
                pimCode: "AINS",
                name: "AINS"
              }
            }),
            createPimProductDocument({
              assetType: {
                code: "inValid",
                pimCode: "inValid",
                name: "inValid"
              }
            })
          ]
        ]
      ];

      renderWithProviders(
        <MobileDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
        />
      );

      expect(screen.queryByText("inValid")).not.toBeInTheDocument();
      expect(screen.getByText("AINS")).toBeInTheDocument();
    });

    it("renders correctly for link document", () => {
      const assetTypes: AssetTypeData[] = [
        createAssetType({ code: "pim-code", pimCode: "pim-code" })
      ];
      const document = createPimProductDocument({
        assetType: {
          code: "pim-code",
          pimCode: "pim-code",
          name: "pim-code"
        },
        isLinkDocument: true,
        format: "application/pdf",
        id: "fake-product"
      });
      const documentsByProduct: [string, PimProductDocument[]][] = [
        ["product1", [document]]
      ];

      renderWithProviders(
        <MobileDocumentTechnicalTableResults
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
        />
      );
      expect(
        screen.queryByTestId(`document-table-actions-download-${document.id}`)
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId(`tech-results-accordion-size-${document.id}`)
      ).toHaveTextContent("-");
    });
  });
});
