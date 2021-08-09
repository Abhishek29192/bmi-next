import React from "react";
import { render, cleanup } from "@testing-library/react";
import Component from "../tabLeadBlock";
import dataJson from "../../../data/pim-mock-data.json";
import "@testing-library/jest-dom";
import { Assets } from "../types";
import { renderWithRouter } from "../../../test/renderWithRouter";

const guaranteesAndWarranties = dataJson.assets.filter(
  ({ assetType }) => assetType === "WARRANTIES"
) as Assets[];

const awardsAndCertificates = dataJson.assets.filter(
  ({ assetType }) => assetType === "AWARDS"
) as Assets[];

describe("TabLeadBlock tests", () => {
  afterEach(cleanup);

  it("should render", () => {
    const { container, getByText } = render(
      <Component
        longDescription={dataJson.longDescription}
        guaranteesAndWarranties={guaranteesAndWarranties}
        awardsAndCertificates={awardsAndCertificates}
      />
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
        guaranteesAndWarranties={guaranteesAndWarranties}
        awardsAndCertificates={awardsAndCertificates}
        bimIframeUrl="https://google.com"
      />
    );
    expect(container.querySelector("#tabpanel-four")).toMatchSnapshot();
  });

  it("should not render the bimIframe tab", () => {
    const { container } = renderWithRouter(
      <Component
        longDescription={dataJson.longDescription}
        guaranteesAndWarranties={guaranteesAndWarranties}
        awardsAndCertificates={awardsAndCertificates}
        bimIframeUrl={null}
      />
    );
    expect(container.querySelector("#tabpanel-four")).toBe(null);
  });
});
