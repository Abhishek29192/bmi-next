import regions from "../../countries/region.json";
import resolveNavigation from "./ContentfulNavigation";
import resolveTitleWithContent from "./ContentfulTitleWithContent";
import getMicroCopies from "./ContentfulMicroCopy";
import resolveRichText from "./ContentfulRichText";
import type { ContentfulSite } from "./types/Site";
import type { Data as SiteData } from "../../components/Site";

const resolveContentfulSite = async ({
  menuUtilities,
  footerMainNavigation,
  footerSecondaryNavigation,
  pitchedRoofCalculatorConfig,
  visualiserHouseTypesCollection,
  resources,
  ...rest
}: ContentfulSite): Promise<SiteData> => {
  return {
    regions,
    menuUtilities: menuUtilities
      ? await resolveNavigation(menuUtilities)
      : null,
    //menuNavigation is set to null as there is a separate resolver to fetch it
    menuNavigation: null,
    footerMainNavigation: footerMainNavigation
      ? await resolveNavigation(footerMainNavigation)
      : null,
    footerSecondaryNavigation: footerSecondaryNavigation
      ? await resolveNavigation(footerSecondaryNavigation)
      : null,
    pitchedRoofCalculatorConfig: pitchedRoofCalculatorConfig
      ? {
          needHelpSection: await resolveTitleWithContent(
            pitchedRoofCalculatorConfig.needHelpSection
          ),
          hubSpotFormId: pitchedRoofCalculatorConfig.hubSpotFormId,
          roofShapes: pitchedRoofCalculatorConfig.roofShapesCollection.items
        }
      : null,
    visualiserHouseTypes: visualiserHouseTypesCollection
      ? visualiserHouseTypesCollection.items
      : null,
    resources: resources
      ? {
          ...resources,
          welcomeDialogBody: resources.welcomeDialogBody
            ? await resolveRichText(resources.welcomeDialogBody)
            : null,
          microCopy: await getMicroCopies()
        }
      : null,
    ...rest
  };
};

export default resolveContentfulSite;
