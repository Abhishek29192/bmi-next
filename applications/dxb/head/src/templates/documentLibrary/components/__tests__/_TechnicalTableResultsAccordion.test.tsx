import { DownloadListContext } from "@bmi-digital/components";
import {
  createFullyPopulatedPimProductDocument,
  createPimProductDocument,
  PimProductDocument
} from "@bmi/elasticsearch-types";
import { fireEvent, screen } from "@testing-library/react";
import mediaQuery from "css-mediaquery";
import React from "react";
import createAssetType from "../../../../__tests__/helpers/AssetTypeHelper";
import { renderWithProviders } from "../../../../__tests__/renderWithProviders";
import { ContentfulAssetType as AssetTypeData } from "../../../../types/AssetType";
import TechnicalTableResultsAccordion from "../_TechnicalTableResultsAccordion";

const createMatchMedia = (width: number) => {
  return (query: string): MediaQueryList =>
    ({
      matches: mediaQuery.match(query, { width }),
      addListener: () => {},
      removeListener: () => {}
    } as unknown as MediaQueryList);
};

describe("MobileDocumentTechnicalTableResults component", () => {
  describe("Renders correctly", () => {
    it("when only single documents are present for asset types", () => {
      const assetTypes: AssetTypeData[] = [createAssetType()];
      const documentsByProduct: [string, PimProductDocument[]][] = [
        ["product1", [createPimProductDocument()]]
      ];

      const { baseElement } = renderWithProviders(
        <TechnicalTableResultsAccordion
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
        ["product1", [createPimProductDocument({ assetType: assetTypes[0] })]]
      ];

      const { baseElement } = renderWithProviders(
        <TechnicalTableResultsAccordion
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
        ]
      ];

      const { baseElement } = renderWithProviders(
        <TechnicalTableResultsAccordion
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
        <TechnicalTableResultsAccordion
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
        <TechnicalTableResultsAccordion
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

    it("should disable selection if there are only link documents", () => {
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
                },
                isLinkDocument: true,
                productName: "Zanda protector"
              })
            )
          ]
        ]
      ];

      renderWithProviders(
        <TechnicalTableResultsAccordion
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
        />
      );
      expect(
        screen.getByLabelText("Select all documents for Zanda protector")
      ).toBeDisabled();
    });

    it("should ignore link documents when calculating files size", () => {
      const updateListMock = jest.fn();
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
                },
                fileSize: 100,
                productName: "Zanda protector",
                isLinkDocument: false
              })
            ),
            createPimProductDocument(
              createFullyPopulatedPimProductDocument({
                assetType: {
                  code: "pim-code",
                  pimCode: "pim-code",
                  name: "pim-code"
                },
                fileSize: 150,
                productName: "Zanda protector",
                isLinkDocument: true
              })
            )
          ]
        ]
      ];

      renderWithProviders(
        <DownloadListContext.Provider
          value={{
            updateList: updateListMock,
            size: 0,
            list: {},
            resetList: jest.fn(),
            resetAllListItems: jest.fn(),
            count: 0,
            remainingSize: 0,
            isLoading: false,
            setIsLoading: jest.fn(),
            allListItemsWithPages: {},
            updateAllListItems: jest.fn(),
            selectedAllCheckboxDisabledByPages: { 0: false },
            selectedAllCheckboxCheckedByPages: { 0: false },
            setSelectAllCheckboxDisabledByPage: () => jest.fn(),
            setSelectAllCheckboxCheckedByPage: () => jest.fn(),
            currentPage: 0,
            setCurrentPage: jest.fn()
          }}
        >
          <TechnicalTableResultsAccordion
            documentsByProduct={documentsByProduct}
            assetTypes={assetTypes}
          />
        </DownloadListContext.Provider>
      );
      fireEvent.click(
        screen.getByLabelText("Select all documents for Zanda protector")
      );
      expect(updateListMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        100
      );
    });

    it("renders correctly if there are selected documents", () => {
      const assetTypes = [
        createAssetType({
          code: "pim-code",
          pimCode: "pim-code"
        })
      ];
      const selectedDocument = createPimProductDocument(
        createFullyPopulatedPimProductDocument({
          assetType: {
            code: "pim-code",
            pimCode: "pim-code",
            name: "pim-code"
          },
          productBaseCode: "base-product-code"
        })
      );
      const documentsByProduct: [string, PimProductDocument[]][] = [
        ["product1", [selectedDocument]]
      ];

      renderWithProviders(
        <DownloadListContext.Provider
          value={{
            updateList: jest.fn(),
            size: 10,
            list: { "base-product-code": [selectedDocument] },
            resetList: jest.fn(),
            resetAllListItems: jest.fn(),
            count: 0,
            remainingSize: 0,
            isLoading: false,
            setIsLoading: jest.fn(),
            allListItemsWithPages: {},
            updateAllListItems: jest.fn(),
            selectedAllCheckboxDisabledByPages: { 0: false },
            selectedAllCheckboxCheckedByPages: { 0: false },
            setSelectAllCheckboxDisabledByPage: () => jest.fn(),
            setSelectAllCheckboxCheckedByPage: () => jest.fn(),
            currentPage: 0,
            setCurrentPage: jest.fn()
          }}
        >
          <TechnicalTableResultsAccordion
            documentsByProduct={documentsByProduct}
            assetTypes={assetTypes}
          />
        </DownloadListContext.Provider>
      );

      const accordionItem = screen.getByTestId(
        "tech-table-accordion-item-base-product-code"
      );
      expect(accordionItem).toHaveClass(
        "DocumentTechnicalTableResults-selected"
      );
    });

    it("renders with divider component", () => {
      window.matchMedia = createMatchMedia(700);
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
                },
                productBaseCode: "base-product-code"
              })
            )
          ]
        ]
      ];

      renderWithProviders(
        <TechnicalTableResultsAccordion
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
          pageNumber={0}
        />
      );
      expect(
        screen.getByTestId("tech-table-divider-base-product-code")
      ).toBeInTheDocument();
    });

    it("should not render divider component if screen is smaller than 600px", () => {
      window.matchMedia = createMatchMedia(599);
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
                },
                productBaseCode: "base-product-code"
              })
            )
          ]
        ]
      ];

      renderWithProviders(
        <TechnicalTableResultsAccordion
          documentsByProduct={documentsByProduct}
          assetTypes={assetTypes}
          pageNumber={0}
        />
      );
      expect(
        screen.queryByTestId("tech-table-divider-base-product-code")
      ).not.toBeInTheDocument();
    });
  });
});
