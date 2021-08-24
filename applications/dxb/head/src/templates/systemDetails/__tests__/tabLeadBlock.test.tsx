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
  beforeEach(() => {
    // resolve useDimensions (useState) hook in TechnicalSpecificationLeadBlock ProductFeatureTable
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
    cleanup();
    jest.clearAllMocks();
  });

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

  it("should render documents and downloads", () => {
    const { container } = renderWithRouter(
      <Component
        longDescription={dataJson.longDescription}
        documentsAndDownloads={[{ test: "test" }]}
      />
    );
    expect(container.querySelector("#tabpanel-three")).toMatchSnapshot();
  });

  it("should not render the documents and downloads", () => {
    const { container } = renderWithRouter(
      <Component
        longDescription={dataJson.longDescription}
        documentsAndDownloads={null}
      />
    );
    expect(container.querySelector("#tabpanel-three")).toBe(null);
  });

  it("should not render the documents and downloads when its empty array", () => {
    const { container } = renderWithRouter(
      <Component
        longDescription={dataJson.longDescription}
        documentsAndDownloads={[]}
      />
    );
    expect(container.querySelector("#tabpanel-three")).toBe(null);
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
