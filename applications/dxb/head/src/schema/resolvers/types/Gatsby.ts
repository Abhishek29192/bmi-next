import type { ProductDocument } from "@bmi/firestore-types";
import type {
  Asset,
  Category,
  Classification,
  VariantOption
} from "@bmi/pim-types";
import type { Node as GatsbyNode } from "gatsby";
import type { GraphQLOutputType } from "graphql-compose/lib/graphql";
import type { DocumentsFilters } from "./DocumentsFilters";
import type { GatsbyIterable } from "gatsby/dist/datastore/common/iterable";

export interface MetaData {
  name: string;
  value: string;
}

export interface LegalConsent {
  communicationConsentCheckboxes?: {
    communicationTypeId: string;
    label: string;
    required?: boolean;
  }[];
  isLegitimateInterest?: boolean;
  communicationConsentText?: boolean;
  processingConsentText?: boolean;
  processingConsentType?: string;
  processingConsentCheckboxLabel?: string;
  privacyPolicyText?: string;
}

/*
  Interface for GatsbyNode. By default all additinal data is
  Record<string, unknown>. Additional data is every field in every entity from
  schema.graphql. In this interface describe field only used in resolvers
*/
export interface Node extends GatsbyNode {
  site___NODE?: string[];
  microCopy___NODE?: string[];
  menuNavigation___NODE?: string;
  parentPage___NODE?: string;
  links___NODE?: string[];
  link___NODE?: string;
  linkedPage___NODE?: string;
  assetTypes___NODE?: readonly string[];
  image___NODE?: string;
  focalPoint___NODE?: string;
  parameters___NODE?: string;
  subtitle___NODE?: string;
  question___NODE?: string;
  answers___NODE?: string[];
  nextStep___NODE?: string;
  inputs___NODE?: string[];

  hubSpotFormGuid?: string;
  metaData?: MetaData[];
  title?: string;
  slug?: string;
  queryParams?: string;
  label?: string;
  source?: string;
  file?: {
    details: {
      image: {
        width: number;
        height: number;
      };
    };
  };
  focalPoint?: {
    x: number;
    y: number;
  };
  tileId?: string;
  colourId?: string;
  sidingId?: string;
  viewMode?: string | number;
  youtubeId?: string;
  code?: string;
  description?: string;
  documents?: ProductDocument[];
  longDescription?: string;
  name?: string;
  isSampleOrderAllowed?: boolean;
  shortDescription?: string;
  summary?: string;
  classifications?: Classification[];
  categories?: Category[];
  variantOptions?: VariantOption[];
  assets?: Asset[];
  pimCodes?: string[];
  categoryCodes?: string[];
  productDocumentNameMap?: string;
  subtitle?: string;
  type?: string;
  documentsFilters?: DocumentsFilters;
  allowFilterBy?: string[];
}

export interface MicroCopy extends GatsbyNode {
  key: string;
  value: string;
}

export interface ResolveArgs {
  categoryCodes: string[];
  allowFilterBy: string[];
}

type PageDependencies = {
  path?: string;
  connectionType?: string;
};

type Query = {
  limit?: number;
  skip?: number;
  filter?: unknown;
  sort?: unknown;
};

/*
  This is custom NodeModel type for context.nodeModel from gatsby Original
  documentation do not provide interface to type context More info about
  context.nodeModel:
  https://www.gatsbyjs.com/docs/reference/graphql-data-layer/node-model
*/
export interface NodeModel {
  getNodeById: <T extends GatsbyNode>(
    args: { id: string; type?: string | GraphQLOutputType },
    pageDependencies?: PageDependencies
  ) => Promise<T | null>;

  findAll: <T extends GatsbyNode>(
    args: {
      query: Query;
      type: string | GraphQLOutputType;
    },
    pageDependencies?: PageDependencies
  ) => Promise<{
    entries: GatsbyIterable<T>;
    totalCount: () => Promise<number>;
  }>;

  findOne: <T extends GatsbyNode>(
    args: {
      query: Query;
      type: string | GraphQLOutputType;
    },
    pageDependencies?: PageDependencies
  ) => Promise<T>;

  getNodesByIds: <T extends GatsbyNode>(
    args: {
      ids?: string[];
      type?: string | GraphQLOutputType;
    },
    pageDependencies?: PageDependencies
  ) => Promise<T[]>;
}

export interface Context {
  nodeModel: NodeModel;
}
