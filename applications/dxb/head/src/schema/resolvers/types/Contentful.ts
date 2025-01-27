/**
 * These types are not fully complete, they are just here to allow type
 * expectations for the resolvers. These types should match what is in the
 * main types, but with any "link" fields and without any resolver created
 * fields.
 */
import type { MicroCopyValues } from "@bmi/microcopies";
import type { Node as GatsbyNode } from "gatsby";
import type { Region } from "../../../components/Header";
import type { Data as ContentfulImage } from "../../../components/image/contentful-image/types";
import type { RichTextData } from "../../../components/RichText";
import type { ContentfulVideoData } from "../../../components/video/types";
import type { CalculatorConfig } from "../../../components/pitched-roof-calculator/types";
import type { HouseType } from "../../../components/visualiser/Types";
import type { AccountPage } from "../../../templates/myAccountPage/types";
import type { TrainingListerPageData as TrainingListerPageProps } from "../../../templates/trainingListerPage/types";
import type { Node } from "./Gatsby";

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

export type ResultsType =
  | "Simple"
  | "Simple Archive"
  | "Card Collection"
  | "Technical";

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
  siteData: ContentfulSite | null;
  errorPageData: ContentfulPromoCard | null;
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
  accountPage: AccountPage | null;
};
export type CTAType = {
  linkedPage: { path: string };
  url: string;
  label: string | null;
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
  featuredVideo: ContentfulVideoData | null;
  featuredMedia: ContentfulImage;
  resources___NODE: string[];
  metadata: ContentfulTag;
};

export type ContentfulDocumentDownloadSection = Omit<Node, "description"> & {
  __typename: "ContentfulDocumentDownloadSection";
  title: string | null;
  description: RichTextData | null;
  documents___NODE: string[];
};

export type TrainingListerPage = Pick<
  TrainingListerPageProps,
  "breadcrumbTitle" | "title" | "subtitle"
> &
  GatsbyNode & {
    name: string;
    slug: string;
    featuredMedia___NODE: string;
    seo___NODE: string | null;
    parentPage___NODE: string | null;
    id: string;
    spaceId: string;
    contentful_id: string;
    createdAt: string;
    updatedAt: string;
    children: [];
  };

export type MicroCopyNode = GatsbyNode & {
  esources___NODE: string[];
  spaceId: string;
  contentful_id: string;
  key: MicroCopyValues;
  value: string;
};

export type ContentfulImageNode = GatsbyNode & {
  title: string;
  altText: string;
  type: string | null;
  image___NODE: string;
  focalPoint___NODE: string | null;
  caption___NODE: string | null;
};

export type ContentfulAssetNode = GatsbyNode & {
  file: {
    url: string;
    details: {
      image: { width: number; height: number } | null;
      size: number;
    };
    fileName: string;
    contentType: string;
  };
  title: string | null;
  description: string | null;
  url: string;
  placeholderUrl: string;
  mimeType: string;
  filename: string;
  width: number | null;
  height: number | null;
  size: number;
};
