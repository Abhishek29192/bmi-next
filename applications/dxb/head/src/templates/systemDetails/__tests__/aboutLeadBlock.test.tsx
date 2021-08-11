import React from "react";
import { render, cleanup } from "@testing-library/react";
import AboutLeadBlock from "../aboutLeadBlock";
import dataJson from "../../../data/pim-mock-data.json";
import "@testing-library/jest-dom";
import { Assets } from "../types";

const guaranteesAndWarranties = dataJson.assets.filter(
  ({ assetType }) => assetType === "WARRANTIES"
) as Assets[];

const awardsAndCertificates = dataJson.assets.filter(
  ({ assetType }) => assetType === "AWARDS"
) as Assets[];

describe("AboutLeadBlock tests", () => {
  afterEach(cleanup);

  it("should render", () => {
    const longDescription = "longDescription";
    const { container, queryByText } = render(
      <AboutLeadBlock
        longDescription={longDescription}
        guaranteesAndWarranties={guaranteesAndWarranties}
        awardsAndCertificates={awardsAndCertificates}
      />
    );
    const longDescriptionText = queryByText(longDescription);

    expect(container).toMatchSnapshot();
    expect(longDescriptionText).toBeInTheDocument();
  });

  describe("should not render", () => {
    it("if no guaranteesAndWarranties assets", () => {
      const { container, queryByText } = render(
        <AboutLeadBlock
          longDescription={dataJson.longDescription}
          guaranteesAndWarranties={[]}
          awardsAndCertificates={awardsAndCertificates}
        />
      );
      const text = queryByText("sdp.leadBlock.guaranteesWarranties", {
        exact: false
      });
      expect(container).toMatchSnapshot();
      expect(text).not.toBeInTheDocument();
    });

    it("if no awardsAndCertificates assets", () => {
      const { container, queryByText } = render(
        <AboutLeadBlock
          longDescription={dataJson.longDescription}
          guaranteesAndWarranties={guaranteesAndWarranties}
          awardsAndCertificates={[]}
        />
      );
      const text = queryByText("sdp.leadBlock.awardsCertificates", {
        exact: false
      });
      expect(container).toMatchSnapshot();
      expect(text).not.toBeInTheDocument();
    });
  });
});
