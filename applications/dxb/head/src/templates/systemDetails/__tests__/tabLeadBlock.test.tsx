import React from "react";
import { render, cleanup } from "@testing-library/react";
import Component from "../tabLeadBlock";
import dataJson from "../../../data/pim-mock-data.json";
import "@testing-library/jest-dom";
import { SystemDetails } from "../types";

const data = dataJson as SystemDetails;

describe("TabLeadBlock tests", () => {
  afterEach(cleanup);

  it("should render", () => {
    const { container, getByText } = render(
      <Component
        longDescription={dataJson.longDescription}
        guaranteesAndWarranties={dataJson.assets.filter(
          ({ assetType }) => assetType === "WARRANTIES"
        )}
        awardsAndCertificates={dataJson.assets.filter(
          ({ assetType }) => assetType === "AWARDS"
        )}
      />
    );

    const aboutTabButton = getByText("sdp.leadBlock.about", {
      exact: false
    });

    expect(container).toMatchSnapshot();
    expect(aboutTabButton).toBeInTheDocument();
  });
});
