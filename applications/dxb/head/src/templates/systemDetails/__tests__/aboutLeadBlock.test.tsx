import React from "react";
import { render, cleanup } from "@testing-library/react";
import AboutLeadBlock from "../aboutLeadBlock";
import dataJson from "../../../data/pim-mock-data.json";
import "@testing-library/jest-dom";
import { Assets, Feature } from "../types";

const guaranteesAndWarranties = dataJson.assets.filter(
  ({ assetType }) => assetType === "WARRANTIES"
) as Assets[];

const awardsAndCertificates = dataJson.assets.filter(
  ({ assetType }) => assetType === "AWARDS"
) as Assets[];

const keyFeatures: Feature = {
  code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.keyfeatures",
  featureValues: [
    {
      value: "Sample KF value"
    },
    {
      value: "Sample KF value 2"
    }
  ],
  name: "Key Features"
};

const systemBenefits = dataJson.systemBenefits;

describe("AboutLeadBlock tests", () => {
  afterEach(cleanup);

  it("should render", () => {
    const longDescription = "longDescription";
    const { container, queryByText } = render(
      <AboutLeadBlock
        longDescription={longDescription}
        guaranteesAndWarranties={guaranteesAndWarranties}
        awardsAndCertificates={awardsAndCertificates}
        keyFeatures={keyFeatures}
        systemBenefits={systemBenefits}
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
          keyFeatures={keyFeatures}
          systemBenefits={systemBenefits}
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
          keyFeatures={keyFeatures}
          systemBenefits={systemBenefits}
        />
      );
      const text = queryByText("sdp.leadBlock.awardsCertificates", {
        exact: false
      });
      expect(container).toMatchSnapshot();
      expect(text).not.toBeInTheDocument();
    });

    it("if no keyFeatures", () => {
      const { container, queryByText } = render(
        <AboutLeadBlock
          longDescription={dataJson.longDescription}
          guaranteesAndWarranties={guaranteesAndWarranties}
          awardsAndCertificates={awardsAndCertificates}
          keyFeatures={null}
          systemBenefits={systemBenefits}
        />
      );
      const text = queryByText(keyFeatures.name, {
        exact: false
      });
      expect(container).toMatchSnapshot();
      expect(text).not.toBeInTheDocument();
    });

    it("if no systemBenefits", () => {
      const { container, queryByText } = render(
        <AboutLeadBlock
          longDescription={dataJson.longDescription}
          guaranteesAndWarranties={guaranteesAndWarranties}
          awardsAndCertificates={awardsAndCertificates}
          keyFeatures={keyFeatures}
          systemBenefits={null}
        />
      );
      const text = queryByText("sdp.leadBlock.systemBenefits", {
        exact: false
      });
      expect(container).toMatchSnapshot();
      expect(text).not.toBeInTheDocument();
    });

    it("if no keyFeatures and systemBenefits", () => {
      const { container } = render(
        <AboutLeadBlock
          longDescription={dataJson.longDescription}
          guaranteesAndWarranties={guaranteesAndWarranties}
          awardsAndCertificates={awardsAndCertificates}
          keyFeatures={null}
          systemBenefits={null}
        />
      );
      const card = container.querySelector('[class^="PostItCard"]');

      expect(container).toMatchSnapshot();
      expect(card).not.toBeInTheDocument();
    });
  });
});
