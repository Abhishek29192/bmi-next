import React from "react";
import { render, cleanup } from "@testing-library/react";
import Component from "../tabLeadBlock";
import dataJson from "../../../data/pim-mock-data.json";
import "@testing-library/jest-dom";
import { renderWithRouter } from "../../../test/renderWithRouter";

describe("TabLeadBlock tests", () => {
  afterEach(cleanup);

  it("should render the about tab", () => {
    const { container, getByText } = render(
      <Component longDescription={dataJson.longDescription} />
    );

    const aboutTabButton = getByText("sdp.leadBlock.about", {
      exact: false
    });

    expect(container).toMatchSnapshot();
    expect(aboutTabButton).toBeInTheDocument();
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
});
