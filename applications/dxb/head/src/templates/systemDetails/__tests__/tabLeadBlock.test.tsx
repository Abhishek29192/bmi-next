import { ThemeProvider } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import { renderWithRouter } from "../../../test/renderWithRouter";
import createRelatedSystem from "../../../__tests__/helpers/RelatedSystemHelper";
import createSystem from "../../../__tests__/helpers/SystemHelper";
import Component from "../tabLeadBlock";

const systemDetailsMockData = createSystem({
  code: "1234",
  relatedSystems: [
    createRelatedSystem({
      code: "related-system-code",
      brand: { code: "brand-code" },
      name: "related-system-1",
      scoringWeight: 1,
      shortDescription: "related-short-desc",
      path: "related-path"
    })
  ]
});

describe("TabLeadBlock tests", () => {
  it("should render", () => {
    const { container, getByText } = render(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );

    const aboutTabButton = getByText("sdp.leadBlock.about", {
      exact: false
    });
    expect(container).toMatchSnapshot();
    expect(aboutTabButton).toBeInTheDocument();
  });

  it("should render documents and downloads", () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );
    expect(container.querySelector("#tabpanel-three")).toMatchSnapshot();
  });

  it("should not render the documents and downloads", () => {
    systemDetailsMockData.documents = null;
    const { container } = renderWithRouter(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );
    expect(container.querySelector("#tabpanel-three")).toBe(null);
  });

  it("should not render the documents and downloads when its empty array", () => {
    systemDetailsMockData.documents = [];
    const { container } = renderWithRouter(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );
    expect(container.querySelector("#tabpanel-three")).toBe(null);
  });

  it("should render the bimIframe tab", () => {
    systemDetailsMockData.bim = {
      name: "BIM_CODE",
      url: "http://nowhere.com"
    };
    const { container, queryByTestId } = renderWithRouter(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );
    expect(container.querySelector("#tabpanel-four")).toMatchSnapshot();
    expect(queryByTestId("bmi-iframe")).toHaveAttribute(
      "src",
      systemDetailsMockData.bim.url
    );
  });

  it("should not render the bimIframe tab", () => {
    systemDetailsMockData.bim = null;
    const { container } = renderWithRouter(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );

    expect(container.querySelector("#tabpanel-four")).toBe(null);
  });

  it("should not render technical Specification tab", () => {
    systemDetailsMockData.classifications = [];
    const { container } = render(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );
    const techSepcSection = container.querySelector(
      ".SystemDetailsTechnicalSpec"
    );

    expect(container).toMatchSnapshot();
    expect(techSepcSection).not.toBeInTheDocument();
  });
});
