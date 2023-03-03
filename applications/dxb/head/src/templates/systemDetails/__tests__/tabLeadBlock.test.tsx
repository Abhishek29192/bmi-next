import { ThemeProvider } from "@bmi-digital/components";
import { render, screen } from "@testing-library/react";
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
    const { container } = render(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(
      screen.getByText("sdp.leadBlock.about", {
        exact: false
      })
    ).toBeInTheDocument();
  });

  it("should render documents and downloads", () => {
    renderWithRouter(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("tab-panel-lead-block-documents-and-downloads")
    ).toMatchSnapshot();
  });

  it("should not render the documents and downloads", () => {
    systemDetailsMockData.documents = null;
    renderWithRouter(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("tab-panel-lead-block-documents-and-downloads")
    ).not.toBeInTheDocument();
  });

  it("should not render the documents and downloads when its empty array", () => {
    systemDetailsMockData.documents = [];
    renderWithRouter(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("tab-panel-lead-block-documents-and-downloads")
    ).not.toBeInTheDocument();
  });

  it("should render the bimIframe tab", () => {
    systemDetailsMockData.bim = {
      name: "BIM_CODE",
      url: "http://nowhere.com"
    };
    renderWithRouter(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );

    expect(screen.queryByTestId("tab-panel-lead-block-bim")).toMatchSnapshot();
    expect(screen.queryByTestId("bmi-iframe")).toHaveAttribute(
      "src",
      systemDetailsMockData.bim.url
    );
  });

  it("should not render the bimIframe tab", () => {
    systemDetailsMockData.bim = null;
    renderWithRouter(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("tab-panel-lead-block-bim")
    ).not.toBeInTheDocument();
  });

  it("should not render technical Specification tab", () => {
    systemDetailsMockData.classifications = [];
    const { container } = render(
      <ThemeProvider>
        <Component system={systemDetailsMockData} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(
      screen.queryByTestId(
        "technical-specification-classifications-table-wrapper"
      )
    ).not.toBeInTheDocument();
  });
});
