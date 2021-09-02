import React from "react";
import { renderWithRouter } from "../../../test/renderWithRouter";
import { createMockSiteData } from "../../../test/mockSiteData";
import dataJson from "../../../data/pim-mock-data.json";
import Component from "../systemDetailsPage";
import { SystemDetails, DocumentData, AssetType } from "../types";
import SystemDetailsPage, {
  IGNORED_DOCUMENTS_ASSETS
} from "../systemDetailsPage";
import { systemDetailsMockData } from "../../../test/systemDetailsMockData";
import "@testing-library/jest-dom";

const systemPageId = "1234";
const siteId = "1234";

jest.mock("gatsby");

describe("SystemDetailsPage template component", () => {
  beforeEach(() => {
    // resolve useDimensions (useState) hook in ProductFeatureTable
    jest.mock("react", () => ({
      ...(jest.requireActual("react") as any),
      useState: (initial) => [initial, jest.fn()]
    }));
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback): number => {
        callback(0);
        return 0;
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render", () => {
    process.env.GATSBY_ENABLE_BRAND_PROVIDER = "true";
    process.env.SPACE_MARKET_CODE = "no";
    const { container } = renderWithRouter(
      <Component
        data={{
          contentfulSite: createMockSiteData(),
          shareWidget: null,
          dataJson: systemDetailsMockData
        }}
        pageContext={{
          systemPageId,
          siteId
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it("should render without BrandProvider", () => {
    process.env.SPACE_MARKET_CODE = "no";
    const { container } = renderWithRouter(
      <SystemDetailsPage
        data={{
          contentfulSite: createMockSiteData(),
          shareWidget: null,
          dataJson: systemDetailsMockData
        }}
        pageContext={{
          systemPageId,
          siteId
        }}
      />
    );
    const tabSection = container.querySelector(".TabsBar");

    expect(container).toMatchSnapshot();
    expect(tabSection).toBeInTheDocument();
  });

  describe("should have function to", () => {
    it("filter and sort technical Spec features correctly", async () => {
      const valueText = "accordion item value 1";
      const valueText2 = "accordion item value 2";
      const valueText3 = "accordion item value 3";
      const valueText4 = "accordion item value 4";
      const categoryName2 = "Accoridion Title 2";
      const categoryName3 = "Accoridion Title 2";
      const newDatajson = {
        ...dataJson,
        classifications: [
          {
            code: "scoringWeightAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                name: "Promotional Content",
                featureValues: [
                  {
                    value: valueText
                  }
                ]
              }
            ],
            name: "Accoridion Title 1"
          },
          {
            code: "systemAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofbuildup",
                name: "Promotional Content",
                featureValues: [
                  {
                    value: valueText3
                  }
                ]
              }
            ],
            name: categoryName3
          },
          {
            code: "systemAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofbuildup",
                name: "Promotional Content",
                featureValues: [
                  {
                    value: valueText4
                  }
                ]
              },
              {
                code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofbuildup",
                name: "A Promotional Content",
                featureValues: [
                  {
                    value: valueText3
                  }
                ]
              },
              {
                code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.promotionalcontent",
                name: "Promotional Content",
                featureValues: [
                  {
                    value: valueText2
                  }
                ]
              }
            ],
            name: categoryName2
          }
        ],
        systemLayers: []
      };
      const { container, queryAllByText } = renderWithRouter(
        <Component
          data={{
            contentfulSite: createMockSiteData(),
            shareWidget: null,
            dataJson: newDatajson as SystemDetails
          }}
          pageContext={{
            systemPageId,
            siteId
          }}
        />
      );

      const contentToBeIngored1 = queryAllByText(valueText, { exact: false });
      const contentToBeIngored2 = queryAllByText(valueText2, { exact: false });
      const contentToBeExist = queryAllByText(valueText3, { exact: false });
      const accordionItems = container.querySelectorAll(
        ".SystemDetailsTechnicalSpec .Accordion .item"
      );
      const secondAccordionItemFeatureItems =
        accordionItems[1].querySelectorAll("tr td:last-child");

      expect(container).toMatchSnapshot();
      expect(contentToBeIngored1.length).toBeFalsy();
      expect(contentToBeIngored2.length).toBeFalsy();
      expect(contentToBeExist.length).toBeTruthy();
      //test CategoryName sorting
      expect(accordionItems[0].querySelector("h6").innerHTML).toBe(
        categoryName3
      );
      expect(accordionItems[1].querySelector("h6").innerHTML).toBe(
        categoryName2
      );
      //test featureName sorting
      expect(secondAccordionItemFeatureItems[0].innerHTML).toContain(
        valueText3
      );
      expect(secondAccordionItemFeatureItems[1].innerHTML).toContain(
        valueText4
      );
    });

    it("filter documentsAndDownload by assetsType and allowedToDownload", () => {
      const document: DocumentData = {
        __typename: "SDPDocument",
        id: "0",
        allowedToDownload: true,
        assetType: "CAD",
        fileSize: 270539,
        mime: "application/pdf",
        name: "1344416763",
        realFileName: "1344416763.pdf",
        url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h92/h36/9012208173086/1344416763pdf"
      };
      const notAllowToDownload: DocumentData = {
        ...document,
        allowedToDownload: false,
        realFileName: "notallow.pdf"
      };
      const ignoredDocument: DocumentData[] = IGNORED_DOCUMENTS_ASSETS.map(
        (ignoredAssetType: AssetType): DocumentData => {
          return {
            ...document,
            assetType: ignoredAssetType,
            realFileName: ignoredAssetType
          };
        }
      );
      const documents: DocumentData[] = [
        document,
        notAllowToDownload,
        ...ignoredDocument
      ];
      const { container, queryByText } = renderWithRouter(
        <Component
          data={{
            contentfulSite: createMockSiteData(),
            shareWidget: null,
            dataJson: { ...systemDetailsMockData, assets: documents }
          }}
          pageContext={{
            systemPageId,
            siteId
          }}
        />
      );
      const tableRows = container.querySelectorAll(".tableContainer tbody tr");

      expect(container).toMatchSnapshot();
      expect(queryByText(documents[0].realFileName)).toBeTruthy();
      expect(tableRows.length).toBe(1);
    });
  });
});
