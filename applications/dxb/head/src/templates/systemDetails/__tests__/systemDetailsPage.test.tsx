import React from "react";
import { renderWithRouter } from "../../../test/renderWithRouter";
import { createMockSiteData } from "../../../test/mockSiteData";
import dataJson from "../../../data/pim-mock-data.json";
import Component from "../systemDetailsPage";
import { SystemDetails } from "../types";
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

  it("should render", async () => {
    const { container } = renderWithRouter(
      <Component
        data={{
          contentfulSite: createMockSiteData(),
          shareWidget: null,
          dataJson: dataJson as SystemDetails
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
    it("filter technical Spec features correctly", async () => {
      const valueText = "accordion item value 1";
      const valueText2 = "accordion item value 2";
      const valueText3 = "accordion item value 3";
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
            name: "Accoridion Title 2"
          }
        ]
      };
      const { container, queryByText, queryAllByText } = renderWithRouter(
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
      const contentToBeExist = queryByText(valueText3, { exact: false });

      expect(container).toMatchSnapshot();
      expect(contentToBeIngored1.length).toBeFalsy();
      expect(contentToBeIngored2.length).toBeFalsy();
      expect(contentToBeExist).toBeInTheDocument();
    });
  });
});
