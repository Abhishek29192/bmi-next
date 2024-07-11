import { RegionCode } from "@bmi-digital/components/language-selection";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { screen } from "@testing-library/react";
import React from "react";
import { Data as SiteData } from "../../components/Site";
import { DataTypeEnum, Data as LinkData } from "../../components/link/types";
import { renderWithRouter } from "../../test/renderWithRouter";
import GeneralError from "../general-error";

describe("General Error", () => {
  const link: LinkData = {
    __typename: "Link",
    id: "string",
    label: "string",
    icon: null,
    isLabelHidden: null,
    url: "https://www.external.co.uk",
    linkedPage: null,
    type: DataTypeEnum.Internal,
    parameters: null,
    dialogContent: null,
    hubSpotCTAID: null,
    queryParams: null
  };
  const errorGeneralTitle = "errorGeneralTitle";

  const data: { contentfulSite: SiteData } = {
    contentfulSite: {
      sys: {
        locale: "it"
      },
      homePage: { title: "Home Page", sys: { id: "home-page-id" } },
      countryCode: "no",
      menuNavigation: {
        __typename: "Navigation",
        label: "Main navigation",
        link,
        links: [link]
      },
      menuUtilities: {
        __typename: "Navigation",
        label: "label",
        link,
        links: [link]
      },
      footerMainNavigation: {
        __typename: "Navigation",
        label: "Get in touch",
        link,
        links: [link]
      },
      footerSecondaryNavigation: {
        __typename: "Navigation",
        label: "Secondary Navigation ",
        link,
        links: [link]
      },
      resources: {
        microCopy: [],
        pdpSidebarItems: null,
        pdpCardsTitle: null,
        pdpCards: null,
        pdpExploreBar: null,
        pdpShareWidget: null,
        sdpShareWidget: null,
        sdpLeadBlockCta: null,
        sdpSidebarItems: null,
        sdpBimDescription: null,
        visualiserShareWidget: null,
        pdpSignupBlock: null,
        documentDisplayFormat: null,
        searchPageSearchTips: null,
        searchPageSidebarItems: null,
        searchPageNextBestActions: null,
        searchPageExploreBar: null,
        errorFourOFour: null,
        errorGeneral: {
          __typename: "Promo",
          id: "errorGeneralId",
          title: errorGeneralTitle,
          name: "",
          subtitle: null,
          body: null,
          brandLogo: null,
          tags: null,
          featuredMedia: null,
          cta: null,
          featuredVideo: null,
          backgroundColor: null
        },
        welcomeDialogTitle: null,
        welcomeDialogBrands: null,
        welcomeDialogBody: null,
        ieDialogTitle: null,
        ieDialogBody: null,
        ieDialogActionLabel: null,
        ieDialogActionLink: null,
        countryNavigationIntroduction: null,
        maximumSamples: null,
        sampleBasketLink: null,
        keyAssetTypes: null,
        pdpFixingToolTitle: null,
        pdpFixingToolDescription: null,
        pdpSpecificationTitle: null,
        pdpSpecificationDescription: null,
        sdpSpecificationNotesCta: null
      },
      pitchedRoofCalculatorConfig: null,
      visualiserHouseTypes: null,
      regions: [
        {
          label: "Europe",
          regionCode: RegionCode.Europe,
          menu: [
            { code: "al", label: "Albania", icon: "/icons/flags/al.svg" },
            { code: "at", label: "Österreich", icon: "/icons/flags/at.svg" },
            { code: "no", label: "Norge", icon: "/icons/flags/no.svg" }
          ]
        }
      ],
      accountPage: null
    }
  };

  it("render correctly", () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <GeneralError data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByTestId("footer")).toBeTruthy();
    expect(screen.getByTestId("brand-colors-provider")).toBeTruthy();
    expect(screen.getByTestId("promo-section")).toBeInTheDocument();
    expect(screen.queryAllByText(errorGeneralTitle).length).toBe(2);
  });

  it("render correctly when errorGeneral is falsy", () => {
    const newData = JSON.parse(JSON.stringify(data));
    newData.contentfulSite.resources.errorGeneral = null;

    const { container } = renderWithRouter(
      <ThemeProvider>
        <GeneralError data={newData} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByTestId("promo-section")).toBeInTheDocument();
    expect(screen.queryAllByText(errorGeneralTitle).length).toBe(0);
  });
});
