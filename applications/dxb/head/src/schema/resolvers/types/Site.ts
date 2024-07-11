import type { Data as ResourcesData } from "../../../components/Resources";
import type { CalculatorConfig } from "../../../components/pitched-roof-calculator/types";
import type { HouseType } from "../../../components/visualiser/Types";
import type { AccountPage } from "../../../templates/myAccountPage/my-account";
import type {
  NavigationData,
  NavigationItem
} from "../../../components/link/types";
import type { ContentfulTitleWithContentData } from "./TitleWithContent";
import type { ContentfulLink } from "./Link";
import type { ContentfulRichText } from "./RichText";
import type { ContentfulPromo } from "./Promo";
import type { Region } from "../../../components/Header";

export type Navigation = Omit<NavigationData, "links" | "promos" | "link"> & {
  linksCollection: {
    items: (Navigation | NavigationItem | ContentfulLink)[];
  };
  sys: {
    id: string;
  };
  promosCollection: {
    items: ContentfulPromo[];
  } | null;
  link: ContentfulLink | null;
};

type ContentfulResources = Omit<
  ResourcesData,
  "microCopy" | "welcomeDialogBody"
> & { welcomeDialogBody: ContentfulRichText | null };

export type ContentfulSite = {
  sys: {
    locale: string;
  };
  homePage: {
    title: string;
    sys: { id: string };
  };
  countryCode: string;
  footerMainNavigation: Navigation | null;
  footerSecondaryNavigation: Navigation | null;
  menuUtilities: Navigation | null;
  resources: ContentfulResources | null;
  regions: Region[];
  pitchedRoofCalculatorConfig:
    | (Pick<CalculatorConfig, "hubSpotFormId"> & {
        roofShapesCollection: {
          items: CalculatorConfig["roofShapes"];
        };
        needHelpSection: ContentfulTitleWithContentData;
      })
    | null;
  visualiserHouseTypesCollection: { items: HouseType[] } | null;
  accountPage: AccountPage | null;
};
