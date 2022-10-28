import createEntry from "./entryHelper";
import createRichText from "./richTextHelper";
import { Resources } from "./types";

export const createFullyPopulatedResources = (
  resources?: Partial<Resources>
): Resources => ({
  ...createResources(),
  pdpCardsTitle: "pdp cards title",
  pdpCards: [],
  pdpExploreBar: createEntry(),
  pdpShareWidget: createEntry(),
  errorFourOFour: createEntry(),
  errorGeneral: createEntry(),
  searchPageSearchTips: createEntry(),
  searchPageSidebarItems: createEntry(),
  searchPageNextBestActions: [],
  searchPageExploreBar: createEntry(),
  welcomeDialogTitle: "welcome dialog title",
  welcomeDialogBrands: ["AeroDek"],
  welcomeDialogBody: createRichText(),
  productDocumentNameMap: "Document name",
  visualiserShareWidget: createEntry(),
  sdpShareWidget: createEntry(),
  sdpLeadBlockCta: createEntry(),
  sdpSidebarItems: [],
  sdpBimDescription: createRichText(),
  maximumSamples: 1,
  sampleBasketLink: createEntry(),
  keyAssetTypes: [],
  pdpFixingToolTitle: "pdp fixing tool title",
  pdpFixingToolDescription: createRichText(),
  pdpSpecificationTitle: "pdp specification title",
  pdpSpecificationDescription: createRichText(),
  pdpSignupBlock: createEntry(),
  sdpSpecificationNotesCta: createEntry(),
  ieDialogTitle: "IE dialog title",
  ieDialogBody: createRichText(),
  ieDialogActionLabel: "IE dialog action label",
  ieDialogActionLink: "IE dialog action link",
  ...resources
});

const createResources = (resources?: Partial<Resources>): Resources => ({
  title: "resource title",
  microCopy: [],
  pdpSidebarItems: [],
  countryNavigationIntroduction: createRichText(),
  documentDisplayFormat: "Asset type",
  ...resources
});

export default createResources;
