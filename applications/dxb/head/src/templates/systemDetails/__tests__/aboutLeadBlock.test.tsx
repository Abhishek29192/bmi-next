import React from "react";
import { render, cleanup } from "@testing-library/react";
import AboutLeadBlock from "../aboutLeadBlock";
import dataJson from "../../../data/pim-mock-data.json";
import "@testing-library/jest-dom";

describe("AboutLeadBlock tests", () => {
  afterEach(cleanup);

  it("should render", () => {
    const longDescription = "longDescription";
    const { container, queryByText } = render(
      <AboutLeadBlock
        longDescription={longDescription}
        guaranteesAndWarranties={dataJson.assets.filter(
          ({ assetType }) => assetType === "WARRANTIES"
        )}
        awardsAndCertificates={dataJson.assets.filter(
          ({ assetType }) => assetType === "AWARDS"
        )}
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
          awardsAndCertificates={dataJson.assets.filter(
            ({ assetType }) => assetType === "AWARDS"
          )}
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
          guaranteesAndWarranties={dataJson.assets.filter(
            ({ assetType }) => assetType === "WARRANTIES"
          )}
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
