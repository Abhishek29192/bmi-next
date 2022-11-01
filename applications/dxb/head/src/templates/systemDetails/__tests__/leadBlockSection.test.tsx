import { ThemeProvider } from "@bmi-digital/components";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import { render } from "@testing-library/react";
import React from "react";
import { iconMap } from "../../../components/Icon";
import { Data as LinkData, DataTypeEnum } from "../../../components/Link";
import LeadBlockSection from "../leadBlockSection";

const leadBlockSectionName = "lead Block section";
const uniqueSellingPropositions = ["feature 1", "feature 2"];

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
      <ThemeProvider>
        <LocationProvider>
          <LeadBlockSection
            name={leadBlockSectionName}
            cta={linkData}
            brandLogo={iconMap.Icopal}
          />
        </LocationProvider>
      </ThemeProvider>
    );

    const setionName = queryByText(leadBlockSectionName);
    const ctaLabelElement = queryByText(ctaLabel);
    expect(container).toMatchSnapshot();
    expect(setionName).toBeInTheDocument();
    expect(ctaLabelElement).toBeInTheDocument();
  });

  it("should render with uniqueSellingPropositions", () => {
    const { container, queryByText, queryByTestId } = render(
      <ThemeProvider>
        <LocationProvider>
          <LeadBlockSection
            name={leadBlockSectionName}
            cta={linkData}
            uniqueSellingPropositions={uniqueSellingPropositions}
            brandLogo={iconMap.Icopal}
          />
        </LocationProvider>
      </ThemeProvider>
    );

    const setionName = queryByText(leadBlockSectionName);
    const ctaLabelElement = queryByText(ctaLabel);
    const systemAttributesContent = queryByTestId("system-attributes-card");
    const feature = queryByText(uniqueSellingPropositions[0]);
    expect(container).toMatchSnapshot();
    expect(setionName).toBeInTheDocument();
    expect(ctaLabelElement).toBeInTheDocument();
    expect(systemAttributesContent).toBeTruthy();
    expect(feature).toBeInTheDocument();
  });

  it("should not render systemAttributes Card with empty uniqueSellingPropositions", () => {
    const { container, queryByText, queryByTestId } = render(
      <ThemeProvider>
        <LocationProvider>
          <LeadBlockSection
            name={leadBlockSectionName}
            cta={linkData}
            brandLogo={iconMap.Icopal}
            uniqueSellingPropositions={[]}
          />
        </LocationProvider>
      </ThemeProvider>
    );

    const setionName = queryByText(leadBlockSectionName);
    const ctaLabelElement = queryByText(ctaLabel);
    const systemAttributesContent = queryByTestId("system-attributes-card");
    expect(container).toMatchSnapshot();
    expect(setionName).toBeInTheDocument();
    expect(ctaLabelElement).toBeInTheDocument();
    expect(systemAttributesContent).toBeFalsy();
  });

  describe("When user navigates with selected systems query string", () => {
    it("should render back to your selection button", () => {
      const route =
        "/jest-test-page?selected_system=123&prev_page=system-configurator-page&referer=sys_details";
      const history = createHistory(createMemorySource(route));
      const { container, queryByText } = render(
        <ThemeProvider>
          <LocationProvider history={history}>
            <LeadBlockSection
              name={leadBlockSectionName}
              cta={linkData}
              brandLogo={iconMap.Icopal}
            />
          </LocationProvider>
        </ThemeProvider>
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
