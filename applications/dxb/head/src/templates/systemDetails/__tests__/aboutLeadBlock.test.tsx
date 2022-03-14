import { ThemeProvider } from "@bmi/components";
import { cleanup, render } from "@testing-library/react";
import React from "react";
import { Data as TitleWithContentData } from "../../../components/TitleWithContent";
import createSystem from "../../../__tests__/helpers/SystemHelper";
import AboutLeadBlock from "../aboutLeadBlock";

const guaranteesWarrantiesMicroCopy = "pdp.leadBlock.guaranteesWarranties";
const awardsCertificatesMicroCopy = "pdp.leadBlock.awardsCertificates";
const specificationMicroCopy = "sdp.leadBlock.specification";
const systemBenefitsMicroCopy = "sdp.leadBlock.systemBenefits";
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

    const { container, queryByText } = render(
      <ThemeProvider>
        <AboutLeadBlock
          system={systemDetailsMockData}
          sidebarItem={sidebarItem}
        />
      </ThemeProvider>
    );
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
    expect(guaranteesWarrantiesTitle).toBeInTheDocument();
    expect(awardsCertificatesTitle).toBeInTheDocument();
    expect(specificationTitle).toBeInTheDocument();
    expect(specificationButton).toBeInTheDocument();
    expect(genericContentTitle).toBeInTheDocument();
  });

  describe("should not render", () => {
    it("if no guaranteesAndWarranties assets", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.awardsAndCertificateDocuments = null;
      systemDetailsMockData.awardsAndCertificateImages = null;
      const { container, queryByText } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );
      const text = queryByText("sdp.leadBlock.guaranteesWarranties", {
        exact: false
      });
      expect(container).toMatchSnapshot();
      expect(text).not.toBeInTheDocument();
    });

    it("if no awardsAndCertificate images and document assets are provided", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.awardsAndCertificateImages = null;
      systemDetailsMockData.awardsAndCertificateDocuments = null;
      const { container, queryByText } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );
      const text = queryByText(awardsCertificatesMicroCopy, {
        exact: false
      });
      expect(container).toMatchSnapshot();
      expect(text).not.toBeInTheDocument();
    });

    it("if no keyFeatures", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.keyFeatures = null;
      const { container, queryByText } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );
      const text = queryByText("Key Features", {
        exact: false
      });
      expect(container).toMatchSnapshot();
      expect(text).not.toBeInTheDocument();
    });

    it("if no systemBenefits", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.systemBenefits = null;
      const { container, queryByText } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );

      const text = queryByText(systemBenefitsMicroCopy, {
        exact: false
      });
      expect(container).toMatchSnapshot();
      expect(text).not.toBeInTheDocument();
    });

    it("if no keyFeatures and systemBenefits", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.keyFeatures = null;
      systemDetailsMockData.systemBenefits = null;
      const { container, queryByTestId } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );
      const sidebar = queryByTestId("sidebar");
      expect(container).toMatchSnapshot();
      expect(sidebar.querySelector("h4").innerHTML).toBe(
        aboutLeadBlockSidebarTitle
      );
    });

    it("if no siderbar, keyFeatures and systemBenefits", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.keyFeatures = null;
      systemDetailsMockData.systemBenefits = null;
      const { container, queryByTestId } = render(
        <ThemeProvider>
          <AboutLeadBlock system={systemDetailsMockData} sidebarItem={null} />
        </ThemeProvider>
      );

      expect(container).toMatchSnapshot();
      expect(queryByTestId("sidebar")).toBeFalsy();
    });

    it("if no specification asset", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.specification = null;
      const { container, queryByText } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
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
      const systemDetailsMockData = createSystem();
      const { container } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );

      const specificationButton = container.querySelector(
        `[rel="noopener noreferrer"]`
      );
      expect(specificationButton).toHaveAttribute(
        "href",
        systemDetailsMockData.specification.url
      );
      expect(specificationButton).toHaveAttribute("target", "_blank");
    });

    it("move up if no guaranteesAndWarranties assets and awardsAndCertificates assets", () => {
      const systemDetailsMockData = createSystem();
      systemDetailsMockData.guaranteesAndWarrantiesImages = null;
      systemDetailsMockData.guaranteesAndWarrantiesLinks = null;
      systemDetailsMockData.awardsAndCertificateImages = null;
      systemDetailsMockData.awardsAndCertificateDocuments = null;
      const { container, queryByText } = render(
        <ThemeProvider>
          <AboutLeadBlock
            system={systemDetailsMockData}
            sidebarItem={sidebarItem}
          />
        </ThemeProvider>
      );
      expect(container).toMatchSnapshot();
      const leadBlockSections = container.querySelectorAll(
        "[class*='leadBlockContentSection']"
      );

      const specificationSection = queryByText(specificationMicroCopy, {
        exact: false
      }).closest("[class*='leadBlockContentSection']");
      expect(leadBlockSections[1]).toBe(specificationSection);
    });
  });
});
