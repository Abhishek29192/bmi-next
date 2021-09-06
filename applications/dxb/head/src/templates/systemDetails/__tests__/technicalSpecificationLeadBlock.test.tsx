import React from "react";
import { render } from "@testing-library/react";
import Component from "../technicalSpecificationLeadBlock";
import { Classification, Feature } from "../types";
import "@testing-library/jest-dom";

const technicalSpecClassifications: Classification[] = [
  {
    code: "systemAttributes",
    name: "test name",
    features: [
      {
        name: "feature1",
        code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofbuildup",
        featureValues: [{ value: "200" }]
      }
    ]
  }
];

const featureUnit = {
  name: "height",
  unitType: "metric",
  symbol: "in"
};

const featureWithUnit: Feature = {
  ...technicalSpecClassifications[0].features[0],
  featureUnit
};

describe("TechnicalSpecificationLeadBlock tests", () => {
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

  describe("should render correctly", () => {
    describe("when One classifications provided", () => {
      it("With no feature units", () => {
        const { container, queryByText } = render(
          <Component
            technicalSpecClassifications={technicalSpecClassifications}
          />
        );
        const accordion = container.querySelectorAll(".Accordion");
        const techTable = container.querySelectorAll(
          ".SystemDetailsTechnicalSpec"
        );
        const unitTypeText = queryByText(featureUnit.symbol, { exact: false });

        expect(container).toMatchSnapshot();
        expect(accordion.length).toBeFalsy();
        expect(techTable.length).toBeTruthy();
        expect(unitTypeText).not.toBeInTheDocument();
      });

      it("With a feature units", () => {
        const classifications: Classification[] = [
          {
            name: "class1",
            code: "systemAttributes",
            features: [featureWithUnit]
          }
        ];
        const { container, queryByText } = render(
          <Component technicalSpecClassifications={classifications} />
        );
        const unitTypeText = queryByText(featureUnit.symbol, { exact: false });

        expect(container).toMatchSnapshot();
        expect(unitTypeText).toBeInTheDocument();
      });
    });

    describe("when Multiple classifications provided", () => {
      it("With no feature units", () => {
        const { container, queryByText } = render(
          <Component
            technicalSpecClassifications={[
              ...technicalSpecClassifications,
              ...technicalSpecClassifications
            ]}
          />
        );
        const accordion = container.querySelectorAll(".Accordion");
        const techTable = container.querySelectorAll(
          ".SystemDetailsTechnicalSpec"
        );
        const unitTypeText = queryByText(featureUnit.symbol, { exact: false });

        expect(container).toMatchSnapshot();
        expect(accordion.length).toBeTruthy();
        expect(techTable.length).toBeTruthy();
        expect(unitTypeText).not.toBeInTheDocument();
      });

      it("With more than one feature units", () => {
        const classifications: Classification[] = [
          {
            name: "class1",
            code: "systemAttributes",
            features: [featureWithUnit, featureWithUnit]
          },
          {
            name: "class2",
            code: "systemAttributes",
            features: [featureWithUnit, featureWithUnit]
          }
        ];
        const { container, queryAllByText } = render(
          <Component technicalSpecClassifications={classifications} />
        );
        const unitTypeText = queryAllByText(featureUnit.symbol, {
          exact: false
        });

        expect(container).toMatchSnapshot();
        expect(unitTypeText.length).toBeTruthy();
      });
    });
  });
});
