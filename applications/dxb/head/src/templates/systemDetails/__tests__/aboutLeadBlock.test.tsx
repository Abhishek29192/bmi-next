import { ThemeProvider } from "@bmi-digital/components";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import createSystem from "../../../__tests__/helpers/SystemHelper";
import { Data as TitleWithContentData } from "../../../components/TitleWithContent";
import AboutLeadBlock from "../aboutLeadBlock";

const guaranteesWarrantiesMicroCopy = "MC: pdp.leadBlock.guaranteesWarranties";
const awardsCertificatesMicroCopy = "MC: pdp.leadBlock.awardsCertificates";
const specificationMicroCopy = "MC: sdp.leadBlock.specification";
const systemBenefitsMicroCopy = "MC: sdp.leadBlock.systemBenefits";
const aboutLeadBlockSidebarTitle = "siderBarItem";
const sidebarItem: TitleWithContentData = {
  __typename: "ContentfulTitleWithContent",
  name: aboutLeadBlockSidebarTitle,
  title: aboutLeadBlockSidebarTitle,
  content: {
    raw: '{"nodeType":"document","data":{},"content":[]}',
    references: []
  }
};

describe("AboutLeadBlock tests", () => {
  afterEach(cleanup);

  it("should render", () => {
    const systemDetailsMockData = createSystem();

    const { container } = render(
      <ThemeProvider>
        <AboutLeadBlock
          system={systemDetailsMockData}
          sidebarItem={sidebarItem}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByText(guaranteesWarrantiesMicroCopy)).toBeInTheDocument();
    expect(screen.getByText(awardsCertificatesMicroCopy)).toBeInTheDocument();
    expect(screen.getByText(specificationMicroCopy)).toBeInTheDocument();
    expect(screen.getByTestId("specification-button")).toBeInTheDocument();
    expect(screen.getByText(aboutLeadBlockSidebarTitle)).toBeInTheDocument();
  });

  describe("should not render", () => {
    it("if no guaranteesAndWarranties assets", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.awardsAndCertificateDocuments = null;
      systemDetailsMockData.awardsAndCertificateImages = null;
      const { container } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );

      expect(container).toMatchSnapshot();
      expect(
        screen.queryByText("sdp.leadBlock.guaranteesWarranties")
      ).not.toBeInTheDocument();
    });

    it("if no awardsAndCertificate images and document assets are provided", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.awardsAndCertificateImages = null;
      systemDetailsMockData.awardsAndCertificateDocuments = null;
      const { container } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );

      expect(container).toMatchSnapshot();
      expect(
        screen.queryByText(awardsCertificatesMicroCopy)
      ).not.toBeInTheDocument();
    });

    it("if no keyFeatures", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.keyFeatures = null;
      const { container } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );

      expect(container).toMatchSnapshot();
      expect(screen.queryByText("Key Features")).not.toBeInTheDocument();
    });

    it("if no systemBenefits", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.systemBenefits = null;
      const { container } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );

      expect(container).toMatchSnapshot();
      expect(
        screen.queryByText(systemBenefitsMicroCopy)
      ).not.toBeInTheDocument();
    });

    it("if no keyFeatures and systemBenefits", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.keyFeatures = null;
      systemDetailsMockData.systemBenefits = null;
      const { container } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );
      expect(container).toMatchSnapshot();
    });

    it("if no siderbar, keyFeatures and systemBenefits", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.keyFeatures = null;
      systemDetailsMockData.systemBenefits = null;
      const { container } = render(
        <ThemeProvider>
          <AboutLeadBlock system={systemDetailsMockData} sidebarItem={null} />
        </ThemeProvider>
      );

      expect(container).toMatchSnapshot();
      expect(screen.queryByTestId("sidebar")).toBeFalsy();
    });

    it("if no specification asset", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.specification = null;
      const { container } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );

      expect(container).toMatchSnapshot();
      expect(
        screen.queryByText(specificationMicroCopy)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("specification-button")
      ).not.toBeInTheDocument();
    });
  });

  describe("specification section", () => {
    it("Button should open new tab", () => {
      const systemDetailsMockData = createSystem();
      render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );

      const specificationButton = screen.getByTestId("specification-button");
      expect(specificationButton).toHaveAttribute(
        "href",
        systemDetailsMockData.specification.url
      );
      expect(specificationButton).toHaveAttribute("target", "_blank");
      expect(specificationButton).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("move up if no guaranteesAndWarranties assets and awardsAndCertificates assets", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.guaranteesAndWarrantiesImages = null;
      systemDetailsMockData.guaranteesAndWarrantiesLinks = null;
      systemDetailsMockData.awardsAndCertificateImages = null;
      systemDetailsMockData.awardsAndCertificateDocuments = null;
      const { container } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );
      expect(container).toMatchSnapshot();
      //
      const leadBlockGridItem = screen.getByTestId("grid-item");
      expect(leadBlockGridItem).toBeInTheDocument();
      const guarenteesSection = screen.queryByTestId("guarentees-section");
      expect(guarenteesSection).toBeNull();
      const awardsSection = screen.queryByTestId("awards-section");
      expect(awardsSection).toBeNull();
      const leadBlockSection = screen.getByTestId("specification-section");
      expect(leadBlockSection).toBeInTheDocument();
    });
  });
});
