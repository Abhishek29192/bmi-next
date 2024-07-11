import { RegionCode } from "@bmi-digital/components/language-selection";
import createContentfulNavigation from "./ContentfulNavigationHelper";
import createContentfulRichText from "./ContentfulRichText";
import createContentfulTitleWithContent from "./ContentfulTitleWithContent";
import type { ContentfulSite } from "../Site";

const createContentfulSite = (
  site?: Partial<ContentfulSite>
): ContentfulSite => ({
  sys: {
    locale: "en-US"
  },
  homePage: {
    title: "Home page title",
    sys: {
      id: "home-page-id"
    }
  },
  countryCode: "uk",
  footerMainNavigation: createContentfulNavigation(),
  footerSecondaryNavigation: createContentfulNavigation(),
  menuUtilities: createContentfulNavigation(),
  pitchedRoofCalculatorConfig: {
    needHelpSection: createContentfulTitleWithContent(),
    roofShapesCollection: {
      items: [{ roofShapeId: "1" }, { roofShapeId: "2" }, { roofShapeId: "3" }]
    },
    hubSpotFormId: "hub-spot-form-id"
  },
  visualiserHouseTypesCollection: { items: [] },
  regions: [
    {
      label: "Europe",
      regionCode: RegionCode.Europe,
      menu: [
        { code: "al", label: "Albania", icon: "/icons/flags/al.svg" },
        { code: "at", label: "Österreich", icon: "/icons/flags/at.svg" },
        { code: "uk", label: "United Kingdom", icon: "/icons/flags/uk.svg" }
      ]
    }
  ],
  accountPage: null,
  resources: createContentfulResources(),
  ...site
});

export const createContentfulResources = (
  resources?: Partial<ContentfulSite["resources"]>
): ContentfulSite["resources"] => ({
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
  searchPageSearchTips: null,
  searchPageSidebarItems: null,
  searchPageNextBestActions: null,
  searchPageExploreBar: null,
  errorFourOFour: null,
  errorGeneral: null,
  welcomeDialogTitle: null,
  welcomeDialogBrands: null,
  welcomeDialogBody: createContentfulRichText(),
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
  sdpSpecificationNotesCta: null,
  documentDisplayFormat: null,
  gbbGoodIndicator: undefined,
  gbbBetterIndicator: undefined,
  gbbBestIndicator: undefined,
  ...resources
});

export default createContentfulSite;
