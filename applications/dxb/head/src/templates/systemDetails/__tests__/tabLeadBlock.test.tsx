import React from "react";
import { render, cleanup } from "@testing-library/react";
import Component from "../tabLeadBlock";
import dataJson from "../../../data/pim-mock-data.json";
import "@testing-library/jest-dom";
import { renderWithRouter } from "../../../test/renderWithRouter";
import { Classification } from "../types";

const techSpecValue = "accordion item value 1";
const technicalSpecClassifications: Classification[] = [
  {
    code: "systemAttributes",
    features: [
      {
        code: "bmiSystemsClassificationCatalog/1.0/scoringWeightAttributes.roofbuildup",
        name: "Promotional Content",
        featureValues: [
          {
            value: techSpecValue
          }
        ]
      }
    ],
    name: "Accoridion Title 1"
  }
];

describe("TabLeadBlock tests", () => {
  afterEach(cleanup);

  it("should render", () => {
    const { container, getByText } = render(
      <Component
        longDescription={dataJson.longDescription}
        technicalSpecClassifications={technicalSpecClassifications}
      />
    );

    const aboutTabButton = getByText("sdp.leadBlock.about", {
      exact: false
    });
    const techSpecText = getByText(techSpecValue, { exact: false });

    expect(container).toMatchSnapshot();
    expect(aboutTabButton).toBeInTheDocument();
    expect(techSpecText).toBeInTheDocument();
  });

  it("should render the bimIframe tab", () => {
    const { container } = renderWithRouter(
      <Component
        longDescription={dataJson.longDescription}
        bimIframeUrl="https://google.com"
      />
    );
    expect(container.querySelector("#tabpanel-four")).toMatchSnapshot();
  });

  it("should not render the bimIframe tab", () => {
    const { container } = renderWithRouter(
      <Component
        longDescription={dataJson.longDescription}
        bimIframeUrl={null}
      />
    );
    expect(container.querySelector("#tabpanel-four")).toBe(null);
  });

  it("should not render technical Specification tab", () => {
    const { container } = render(
      <Component
        longDescription={dataJson.longDescription}
        technicalSpecClassifications={[]}
      />
    );
    const techSepcSection = container.querySelector(
      ".SystemDetailsTechnicalSpec"
    );

    expect(container).toMatchSnapshot();
    expect(techSepcSection).not.toBeInTheDocument();
  });
});
