import React from "react";
import { render, cleanup } from "@testing-library/react";
import AboutLeadBlock from "../aboutLeadBlock";
import dataJson from "../../../data/systems/pim-mock-data.json";
import "@testing-library/jest-dom";
import { Assets, Feature } from "../types";
import { Data as TitleWithContentData } from "../../../components/TitleWithContent";

const guaranteesAndWarranties: Assets[] = dataJson.assets.filter(
  ({ assetType }) => assetType === "WARRANTIES"
) as Assets[];
const awardsAndCertificates: Assets[] = dataJson.assets.filter(
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

const specification: Assets = {
  allowedToDownload: true,
  assetType: "SPECIFICATION",
  fileSize: 689490,
  mime: "application/pdf",
  name: "Spec Test",
  realFileName: "Teknisk-godkjenning-2012-Icopal-2-lag-asfalt-takbelegg.pdf",
  url: "test"
};

const guaranteesWarrantiesMicroCopy = "pdp.leadBlock.guaranteesWarranties";
const awardsCertificatesMicroCopy = "pdp.leadBlock.awardsCertificates";
const specificationMicroCopy = "sdp.leadBlock.specification";
const systemBenefitsMicroCopy = "sdp.leadBlock.systemBenefits";
const aboutLeadBlockSidebarTitle = "siderBarItem";
const sidebarItem: TitleWithContentData = {
  __typename: "ContentfulTitleWithContent",
  title: aboutLeadBlockSidebarTitle,
  content: {
    raw: '{"nodeType":"document","data":{},"content":[]}',
    references: []
  }
};

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
        specification={specification}
        sidebarItem={sidebarItem}
      />
    );
    const longDescriptionText = queryByText(longDescription);
    const guaranteesWarrantiesTitle = queryByText(
      guaranteesWarrantiesMicroCopy,
      {
        exact: false
      }
    );
    const awardsCertificatesTitle = queryByText(awardsCertificatesMicroCopy, {
      exact: false
    });
    const specificationTitle = queryByText(specificationMicroCopy, {
      exact: false
    });
    const specificationButton = container.querySelector(
      `[rel="noopener noreferrer"]`
    );
    const genericContentTitle = queryByText(aboutLeadBlockSidebarTitle, {
      exact: false
    });

    expect(container).toMatchSnapshot();
    expect(longDescriptionText).toBeInTheDocument();
    expect(guaranteesWarrantiesTitle).toBeInTheDocument();
    expect(awardsCertificatesTitle).toBeInTheDocument();
    expect(specificationTitle).toBeInTheDocument();
    expect(specificationButton).toBeInTheDocument();
    expect(genericContentTitle).toBeInTheDocument();
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
          specification={specification}
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
          specification={specification}
        />
      );
      const text = queryByText(awardsCertificatesMicroCopy, {
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
          specification={null}
        />
      );

      const text = queryByText(systemBenefitsMicroCopy, {
        exact: false
      });
      expect(container).toMatchSnapshot();
      expect(text).not.toBeInTheDocument();
    });

    it("if no keyFeatures and systemBenefits", () => {
      const { container, queryByTestId } = render(
        <AboutLeadBlock
          longDescription={dataJson.longDescription}
          guaranteesAndWarranties={guaranteesAndWarranties}
          awardsAndCertificates={awardsAndCertificates}
          keyFeatures={null}
          systemBenefits={null}
          sidebarItem={sidebarItem}
        />
      );
      const sidebar = queryByTestId("sidebar");
      expect(container).toMatchSnapshot();
      expect(sidebar.querySelector("h4").innerHTML).toBe(
        aboutLeadBlockSidebarTitle
      );
    });

    it("if no siderbar, keyFeatures and systemBenefits", () => {
      const { container, queryByTestId } = render(
        <AboutLeadBlock
          longDescription={dataJson.longDescription}
          guaranteesAndWarranties={[]}
          awardsAndCertificates={[]}
          keyFeatures={null}
          systemBenefits={null}
        />
      );

      expect(container).toMatchSnapshot();
      expect(queryByTestId("sidebar")).toBeFalsy();
    });

    it("if no specification asset", () => {
      const { container, queryByText } = render(
        <AboutLeadBlock
          longDescription={dataJson.longDescription}
          guaranteesAndWarranties={guaranteesAndWarranties}
          awardsAndCertificates={awardsAndCertificates}
          keyFeatures={null}
          systemBenefits={systemBenefits}
        />
      );

      const text = queryByText(specificationMicroCopy, {
        exact: false
      });
      const specificationButton = container.querySelector(
        `[rel="noopener noreferrer"]`
      );
      expect(container).toMatchSnapshot();
      expect(text).not.toBeInTheDocument();
      expect(specificationButton).not.toBeInTheDocument();
    });
  });

  describe("specification section", () => {
    it("Button should open new tab", () => {
      const { container } = render(
        <AboutLeadBlock
          longDescription={dataJson.longDescription}
          guaranteesAndWarranties={guaranteesAndWarranties}
          awardsAndCertificates={awardsAndCertificates}
          keyFeatures={keyFeatures}
          systemBenefits={systemBenefits}
          specification={specification}
        />
      );

      const specificationButton = container.querySelector(
        `[rel="noopener noreferrer"]`
      );
      expect(specificationButton).toHaveAttribute("href", specification.url);
      expect(specificationButton).toHaveAttribute("target", "_blank");
    });

    it("move up if no guaranteesAndWarranties and awardsAndCertificates assets", () => {
      const longDescription = "longDescription";
      const { container, queryByText } = render(
        <AboutLeadBlock
          longDescription={longDescription}
          guaranteesAndWarranties={[]}
          awardsAndCertificates={[]}
          specification={specification}
        />
      );
      expect(container).toMatchSnapshot();
      const leadBlockSections = container.querySelectorAll(
        ".LeadBlockContentSection"
      );
      const descriptionSection = queryByText(longDescription, {
        exact: false
      }).closest(".LeadBlockContentSection");
      const specificationSection = queryByText(specificationMicroCopy, {
        exact: false
      }).closest(".LeadBlockContentSection");
      expect(leadBlockSections[0]).toBe(descriptionSection);
      expect(leadBlockSections[1]).toBe(specificationSection);
    });
  });
});
