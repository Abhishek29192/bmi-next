import React from "react";
import { render } from "@testing-library/react";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import LeadBlockSection from "../leadBlockSection";
import { Data as LinkData, DataTypeEnum } from "../../../components/Link";
import {
  Category,
  Classification,
  ClassificationCodeEnum
} from "../../../components/types/pim";
import { iconMap } from "../../../components/Icon";

const leadBlockSectionName = "lead Block section";
const leadBlockCategories: Category[] = [
  {
    categoryType: "Brand",
    code: "code_category_1",
    name: "category_1",
    image: {
      realFileName: "test",
      url: "dummy",
      fileSize: 0,
      mime: "image/png",
      name: "test_img",
      allowedToDownload: false
    }
  }
];
const leadBlockClassifications: Classification[] = [
  {
    code: ClassificationCodeEnum.SYSTEM_ATTRIBUTES,
    features: [
      {
        code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.promotionalcontent",
        featureValues: [{ value: "fature value 1" }],
        name: "feature 1"
      }
    ],
    name: ClassificationCodeEnum.SYSTEM_ATTRIBUTES
  }
];

const leadBlockClassificationsNoFeatures: Classification[] = [
  {
    code: ClassificationCodeEnum.SYSTEM_ATTRIBUTES,
    features: [],
    name: ClassificationCodeEnum.SYSTEM_ATTRIBUTES
  }
];

const ctaLabel = "cta label";
const backToYourSelectionLabel = "MC: sdp.leadBlock.backToYourSelection";
const linkData: LinkData = {
  __typename: "ContentfulLink",
  id: "string",
  label: ctaLabel,
  icon: null,
  isLabelHidden: null,
  url: "https://www.external.co.uk",
  linkedPage: null,
  type: DataTypeEnum.External,
  parameters: null,
  dialogContent: null,
  hubSpotCTAID: null
};

describe("LeadBlockSection tests", () => {
  it("should render", () => {
    const { container, queryByText } = render(
      <LocationProvider>
        <LeadBlockSection
          name={leadBlockSectionName}
          categories={[]}
          classifications={[]}
          cta={linkData}
          brandLogo={iconMap.Icopal}
        />
      </LocationProvider>
    );

    const setionName = queryByText(leadBlockSectionName);
    const ctaLabelElement = queryByText(ctaLabel);
    expect(container).toMatchSnapshot();
    expect(setionName).toBeInTheDocument();
    expect(ctaLabelElement).toBeInTheDocument();
  });

  it("should render with categories", () => {
    const { container, queryByText } = render(
      <LocationProvider>
        <LeadBlockSection
          name={leadBlockSectionName}
          categories={leadBlockCategories}
          classifications={[]}
          cta={linkData}
          brandLogo={iconMap.Icopal}
        />
      </LocationProvider>
    );

    const setionName = queryByText(leadBlockSectionName);
    const ctaLabelElement = queryByText(ctaLabel);
    const brandLogo = container.querySelector(`.brandLogo`);
    expect(container).toMatchSnapshot();
    expect(setionName).toBeInTheDocument();
    expect(ctaLabelElement).toBeInTheDocument();
    expect(brandLogo).toBeTruthy();
  });

  it("should render with uniqueSellingPropositions", () => {
    const { container, queryByText, queryByTestId } = render(
      <LocationProvider>
        <LeadBlockSection
          name={leadBlockSectionName}
          categories={[]}
          classifications={[]}
          cta={linkData}
          uniqueSellingPropositions={leadBlockClassifications[0].features[0]}
          brandLogo={iconMap.Icopal}
        />
      </LocationProvider>
    );

    const setionName = queryByText(leadBlockSectionName);
    const ctaLabelElement = queryByText(ctaLabel);
    const systemAttributesContent = queryByTestId("system-attributes-card");
    const feature = queryByText(
      leadBlockClassifications[0].features[0].featureValues[0].value
    );
    expect(container).toMatchSnapshot();
    expect(setionName).toBeInTheDocument();
    expect(ctaLabelElement).toBeInTheDocument();
    expect(systemAttributesContent).toBeTruthy();
    expect(feature).toBeInTheDocument();
  });

  it("should not render systemAttributes Card with no uniqueSellingPropositions", () => {
    const { container, queryByText, queryByTestId } = render(
      <LocationProvider>
        <LeadBlockSection
          name={leadBlockSectionName}
          categories={[]}
          classifications={[]}
          cta={linkData}
          brandLogo={iconMap.Icopal}
        />
      </LocationProvider>
    );

    const setionName = queryByText(leadBlockSectionName);
    const ctaLabelElement = queryByText(ctaLabel);
    const systemAttributesContent = queryByTestId("system-attributes-card");
    expect(container).toMatchSnapshot();
    expect(setionName).toBeInTheDocument();
    expect(ctaLabelElement).toBeInTheDocument();
    expect(systemAttributesContent).toBeFalsy();
  });

  describe("When classifications are provided", () => {
    it("should render with classifications", () => {
      const { container, queryByText } = render(
        <LocationProvider>
          <LeadBlockSection
            name={leadBlockSectionName}
            categories={leadBlockCategories}
            classifications={leadBlockClassifications}
            cta={linkData}
            brandLogo={iconMap.Icopal}
          />
        </LocationProvider>
      );

      const setionName = queryByText(leadBlockSectionName);
      const ctaLabelElement = queryByText(ctaLabel);
      expect(container).toMatchSnapshot();
      expect(setionName).toBeInTheDocument();
      expect(ctaLabelElement).toBeInTheDocument();
    });

    it("should render with classifications without features", () => {
      const { container, queryByText } = render(
        <LocationProvider>
          <LeadBlockSection
            name={leadBlockSectionName}
            categories={leadBlockCategories}
            classifications={leadBlockClassificationsNoFeatures}
            cta={linkData}
            brandLogo={iconMap.Icopal}
          />
        </LocationProvider>
      );

      const setionName = queryByText(leadBlockSectionName);
      const ctaLabelElement = queryByText(ctaLabel);
      expect(container).toMatchSnapshot();
      expect(setionName).toBeInTheDocument();
      expect(ctaLabelElement).toBeInTheDocument();
    });
  });

  describe("When user navigates with selected systems query string", () => {
    it("should render back to your selection button", () => {
      const route =
        "/jest-test-page?selected_system=123&prev_page=system-configurator-page&referer=sys_details";
      const history = createHistory(createMemorySource(route));
      const { container, queryByText } = render(
        <LocationProvider history={history}>
          <LeadBlockSection
            name={leadBlockSectionName}
            categories={[
              {
                categoryType: "Brand",
                code: "code_category_1",
                name: "category_1",
                image: {
                  realFileName: "test",
                  url: "dummy",
                  fileSize: 0,
                  mime: "image/png",
                  name: "test_img",
                  allowedToDownload: false
                }
              }
            ]}
            classifications={[]}
            cta={linkData}
            brandLogo={iconMap.Icopal}
          />
        </LocationProvider>
      );

      const setionName = queryByText(leadBlockSectionName);
      const ctaLabelElement = queryByText(ctaLabel);
      const backToYourSelectionBtn = queryByText(backToYourSelectionLabel);

      expect(container).toMatchSnapshot();
      expect(setionName).toBeInTheDocument();
      expect(ctaLabelElement).toBeInTheDocument();
      expect(backToYourSelectionBtn).toBeInTheDocument();
      expect(
        (backToYourSelectionBtn.parentElement as HTMLAnchorElement).href
      ).toContain("system-configurator-page?referer=sys_details");
    });
  });
});
