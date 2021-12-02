import React from "react";
import { render, cleanup } from "@testing-library/react";
import Component from "../tabLeadBlock";
import createSystemDetails from "../../../test/systemDetailsMockData";
import "@testing-library/jest-dom";
import { renderWithRouter } from "../../../test/renderWithRouter";
import { Classification } from "../../../components/types/pim";
import { DocumentData } from "../types";
import { BimContent } from "../tabLeadBlock";

const techSpecValue = "accordion item value 1";
const systemDetailsMockData = createSystemDetails();
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
const bimContent: BimContent = {
  title: "bmi iframe title",
  description: {
    raw: '{"nodeType":"document","data":{},"content":[]}',
    references: []
  },
  bimIframeUrl: "https://google.com"
};
const documents: DocumentData[] = [
  {
    __typename: "SDPDocument",
    id: "0",
    title: "title",
    assetType: {
      name: "CAD name",
      pimCode: "CAD"
    },
    asset: {
      file: {
        fileName: "1344416763.pdf",
        url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h92/h36/9012208173086/1344416763pdf",
        contentType: "application/pdf",
        details: {
          size: 270539
        }
      }
    }
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
        longDescription={systemDetailsMockData.longDescription}
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
        longDescription={systemDetailsMockData.longDescription}
        documentsAndDownloads={documents}
      />
    );
    expect(container.querySelector("#tabpanel-three")).toMatchSnapshot();
  });

  it("should not render the documents and downloads", () => {
    const { container } = renderWithRouter(
      <Component
        longDescription={systemDetailsMockData.longDescription}
        documentsAndDownloads={null}
      />
    );
    expect(container.querySelector("#tabpanel-three")).toBe(null);
  });

  it("should not render the documents and downloads when its empty array", () => {
    const { container } = renderWithRouter(
      <Component
        longDescription={systemDetailsMockData.longDescription}
        documentsAndDownloads={[]}
      />
    );
    expect(container.querySelector("#tabpanel-three")).toBe(null);
  });

  it("should render the bimIframe tab", () => {
    const { container, queryByText, queryByTestId } = renderWithRouter(
      <Component
        longDescription={systemDetailsMockData.longDescription}
        bimContent={bimContent}
      />
    );
    expect(container.querySelector("#tabpanel-four")).toMatchSnapshot();
    expect(queryByText(bimContent.title)).toBeTruthy();
    expect(container.querySelector("#tabpanel-four .RichText")).toBeTruthy();
    expect(queryByTestId("bmi-iframe")).toHaveAttribute(
      "src",
      bimContent.bimIframeUrl
    );
  });

  it("should not render the bimIframe tab", () => {
    const { container } = renderWithRouter(
      <Component
        longDescription={systemDetailsMockData.longDescription}
        bimContent={{ ...bimContent, bimIframeUrl: null }}
      />
    );
    expect(container.querySelector("#tabpanel-four")).toBe(null);
  });

  it("should not render technical Specification tab", () => {
    const { container } = render(
      <Component
        longDescription={systemDetailsMockData.longDescription}
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
