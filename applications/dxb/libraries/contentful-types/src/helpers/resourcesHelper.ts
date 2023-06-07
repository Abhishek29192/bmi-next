import createRichText from "./richTextHelper";
import createEntrySys from "./entrySysHelper";
import { createFullyPopulatedNavigation } from "./navigationHelper";
import { createFullyPopulatedShareWidget } from "./shareWidgetHelper";
import { createFullyPopulatedTitleWithContent } from "./titleWithContentHelper";
import { createFullyPopulatedLink } from "./linkHelper";
import createSimplePage from "./simplePageHelper";
import { createFullyPopulatedPromo } from "./promoHelper";
import { createFullyPopulatedSignupBlock } from "./signupBlockHelper";
import { createFullyPopulatedSpecificationNotes } from "./specificationNotesHelper";
import type { TypeResources } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedResources = (
  contentfulResources?: EntryPartial<TypeResources<undefined, "en-US">>
): TypeResources<undefined, "en-US"> => {
  const resources = createResources(contentfulResources);
  return {
    ...resources,
    fields: {
      pdpCardsTitle: "pdp cards title",
      pdpCards: [],
      pdpExploreBar: createFullyPopulatedNavigation(),
      pdpShareWidget: createFullyPopulatedShareWidget(),
      errorFourOFour: createFullyPopulatedPromo(),
      errorGeneral: createFullyPopulatedPromo(),
      searchPageSearchTips: createFullyPopulatedTitleWithContent(),
      searchPageSidebarItems: createFullyPopulatedTitleWithContent(),
      searchPageNextBestActions: [],
      searchPageExploreBar: createFullyPopulatedNavigation(),
      welcomeDialogTitle: "welcome dialog title",
      welcomeDialogBrands: ["AeroDek"],
      welcomeDialogBody: createRichText(),
      productDocumentNameMap: "Document name",
      visualiserShareWidget: createFullyPopulatedShareWidget(),
      sdpShareWidget: createFullyPopulatedShareWidget(),
      sdpLeadBlockCta: createFullyPopulatedLink(),
      sdpSidebarItems: [],
      sdpBimDescription: createRichText(),
      maximumSamples: 1,
      sampleBasketLink: createSimplePage(),
      keyAssetTypes: [],
      pdpFixingToolTitle: "pdp fixing tool title",
      pdpFixingToolDescription: createRichText(),
      pdpSpecificationTitle: "pdp specification title",
      pdpSpecificationDescription: createRichText(),
      pdpSignupBlock: createFullyPopulatedSignupBlock(),
      sdpSpecificationNotesCta: createFullyPopulatedSpecificationNotes(),
      ieDialogTitle: "IE dialog title",
      ieDialogBody: createRichText(),
      ieDialogActionLabel: "IE dialog action label",
      ieDialogActionLink: "IE dialog action link",
      ...resources.fields
    }
  };
};

const createResources = (
  contentfulResources?: EntryPartial<TypeResources<undefined, "en-US">>
): TypeResources<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "resources"
      }
    },
    ...contentfulResources?.sys
  },
  metadata: {
    tags: [],
    ...contentfulResources?.metadata
  },
  fields: {
    title: "resource title",
    microCopy: [],
    pdpSidebarItems: [],
    countryNavigationIntroduction: createRichText(),
    documentDisplayFormat: "Asset type",
    ...contentfulResources?.fields
  }
});

export default createResources;
