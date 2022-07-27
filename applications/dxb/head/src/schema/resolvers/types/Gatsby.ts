import { ProductDocument } from "@bmi/firestore-types";
import { Asset, Category, Classification, VariantOption } from "@bmi/pim-types";
import { Node as GatsbyNode } from "gatsby";
import type { GatsbyIterable } from "gatsby/dist/datastore/common/iterable";
import { GraphQLOutputType } from "graphql-compose/lib/graphql";
import { DocumentsWithFilters } from "../../../types/documentsWithFilters";
import { HubspotFieldNames, HubspotFieldTypes } from "../ContentfulFormSection";

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
  formFieldGroups?: {
    isPageBreak: boolean;
    fields: {
      name: HubspotFieldNames;
      label: string;
      fieldType: HubspotFieldTypes;
      required: boolean;
      options: { value: string }[];
    }[];
  }[];
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
  documentsWithFilters?: DocumentsWithFilters;
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
  getNodeById: (
    args: { id: string; type?: string | GraphQLOutputType },
    pageDependencies?: PageDependencies
  ) => Promise<Node | null>;

  findAll: <T>(
    args: {
      query: Query;
      type: string | GraphQLOutputType;
    },
    pageDependencies?: PageDependencies
  ) => Promise<{
    entries: GatsbyIterable<T>;
    totalCount: () => Promise<number>;
  }>;

  findOne: <T>(
    args: {
      query: Query;
      type: string | GraphQLOutputType;
    },
    pageDependencies?: PageDependencies
  ) => Promise<T>;

  getNodesByIds: (
    args: {
      ids: string[];
      type?: string | GraphQLOutputType;
    },
    pageDependencies?: PageDependencies
  ) => Promise<Node[]>;
}

export interface Context {
  nodeModel: NodeModel;
}
