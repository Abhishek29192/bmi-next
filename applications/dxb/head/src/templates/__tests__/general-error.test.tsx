import React from "react";
import GeneralError from "../general-error";
import { renderWithRouter } from "../../test/renderWithRouter";
import { Data as SiteData } from "../../components/Site";
import { Data as LinkData } from "../../components/Link";

describe("General Error", () => {
  const link: LinkData = {
    __typename: "ContentfulLink",
    id: "string",
    label: "string",
    icon: null,
    isLabelHidden: null,
    url: "https://www.external.co.uk",
    linkedPage: null,
    type: null,
    parameters: null,
    dialogContent: null,
    hubSpotCTAID: null
  };
  const data: { contentfulSite: SiteData } = {
    contentfulSite: {
      node_locale: "it",
      homePage: { title: "Home Page" },
      countryCode: "no",
      menuNavigation: {
        __typename: "ContentfulNavigation",
        label: "Main navigation",
        link,
        links: [link]
      },
      menuUtilities: {
        __typename: "ContentfulNavigation",
        label: "label",
        link,
        links: [link]
      },
      footerMainNavigation: {
        __typename: "ContentfulNavigation",
        label: "Get in touch",
        link,
        links: [link]
      },
      footerSecondaryNavigation: {
        __typename: "ContentfulNavigation",
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
        pdpInputBanner: null,
        documentDisplayFormat: null,
        searchPageSearchTips: null,
        searchPageSidebarItems: null,
        searchPageNextBestActions: null,
        searchPageExploreBar: null,
        errorFourOFour: null,
        errorGeneral: {
          __typename: "ContentfulPromo",
          id: "errorGeneralId",
          title: "errorGeneralTitle",
          name: null,
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
        pdpSpecificationDescription: null
      },
      headScripts: null,
      scriptOnetrust: null,
      regions: [
        {
          label: "Europe",
          menu: [
            { code: "al", label: "Albania", icon: "/icons/flags/al.svg" },
            { code: "at", label: "Österreich", icon: "/icons/flags/at.svg" },
            { code: "no", label: "Norge", icon: "/icons/flags/no.svg" }
          ]
        }
      ]
    }
  };

  it("render correctly", () => {
    const { container, queryAllByText, getByTestId } = renderWithRouter(
      <GeneralError data={data} pageContext={{ variantCodeToPathMap: {} }} />
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelector("header")).toBeTruthy();
    expect(container.querySelector(".Footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelector(".PromoSection")).toBeTruthy();
    expect(
      queryAllByText(data.contentfulSite.resources.errorGeneral.title).length
    ).toBe(2);
  });

  it("render correctly when errorGeneral is falsy", () => {
    const newData = JSON.parse(JSON.stringify(data));
    newData.contentfulSite.resources.errorGeneral = null;

    const { container, queryAllByText } = renderWithRouter(
      <GeneralError data={newData} />
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelector(".PromoSection")).toBeTruthy();
    expect(
      queryAllByText(data.contentfulSite.resources.errorGeneral.title).length
    ).toBe(0);
  });
});
