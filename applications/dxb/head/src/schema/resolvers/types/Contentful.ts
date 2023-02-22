/**
 * These types are not fully complete, they are just here to allow type
 * expectations for the resolvers. These types should match what is in the
 * main types, but with any "link" fields and without any resolver created
 * fields.
 */
import { Region } from "../../../components/Header";
import { Data as ContentfulImage } from "../../../components/Image";
import { CalculatorConfig } from "../../../components/pitched-roof-calculator/types";
import { RichTextData } from "../../../components/RichText";
import { Data as ContentfulVideo } from "../../../components/Video";
import { HouseType } from "../../../components/visualiser/Types";
import { Node } from "./Gatsby";

export type Resource = Node & {
  keyAssetTypes: string[] | null;
};

export type ContentfulAssetType = Node & {
  __typename: "ContentfulAssetType";
  id: string;
  name: string;
  code: string;
  description: RichTextData | null;
  pimCode: string | null;
};

export type Source = "PIM" | "CMS" | "ALL";

export type ResultsType = "Simple" | "Card Collection" | "Technical";

export type ContentfulDocumentLibraryPage = Node & {
  source: Source;
  resultsType: ResultsType;
  allowFilterBy: readonly string[] | null;
  assetTypes___NODE: readonly string[] | null;
};

export type ContentfulDocument = Node & {
  __typename: "ContentfulDocument";
  id: string;
  title: string;
  assetType___NODE: string;
  featuredMedia___Node: string | null;
  asset___Node: string | null;
  // TODO: add validations for this Rich Text field in CMS
  description: RichTextData | null;
  brand: string;
  noIndex: boolean;
};

export type FourOFourResponse = {
  siteData: ContentfulSite;
  errorPageData: ContentfulPromoCard;
};

export type ContentfulTag = {
  tags___NODE: string[];
};

export type ContentfulSite = Node & {
  id: string;
  spaceId: string;
  contentful_id: string;
  createdAt: string;
  node_locale: string;
  countryCode: string;
  menuUtilities___NODE: string | null;
  menuNavigation___NODE: string | null;
  homePage___NODE: string | null;
  pages___NODE: string[];
  footerMainNavigation___NODE: string | null;
  footerSecondaryNavigation___NODE: string | null;
  resources___NODE: string | null;
  metadata: ContentfulTag;
  homePage: null;
  footerMainNavigation: null;
  footerSecondaryNavigation: null;
  menuNavigation: null;
  menuUtilities: null;
  resources: null;
  regions: Region[] | null;
  pitchedRoofCalculatorConfig: CalculatorConfig | null;
  visualiserHouseTypes: HouseType[] | null;
};
export type CTAType = {
  linkedPage: { path: string };
  url: string;
  label: string;
};
export type ContentfulPromoCard = Node & {
  id: string;
  spaceId: string;
  contentful_id: string;
  createdAt: string;
  updatedAt: string;
  parent: string;
  node_locale: string;
  title: string | null;
  subtitle: string | null;
  body: RichTextData | null;
  cta___NODE: string | null;
  cta: CTAType | null;
  featuredVideo: ContentfulVideo | null;
  featuredMedia: ContentfulImage;
  resources___NODE: string[];
  metadata: ContentfulTag;
};
