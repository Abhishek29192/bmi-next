import { Node as GatsbyNode } from "gatsby";
import { GraphQLOutputType } from "graphql-compose/lib/graphql";
import {
  Asset,
  Category,
  Classification,
  VariantOption
} from "../../components/types/pim";
import {
  PIMDocumentData,
  PIMLinkDocumentData
} from "../../components/types/PIMDocumentBase";
import { HubspotFieldNames, HubspotFieldTypes } from "./ContentfulFormSection";

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
  assetTypes___NODE?: string[];
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
  documents?: (PIMDocumentData | PIMLinkDocumentData)[];
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
}

export interface ResolveArgs {
  pimClassificationCatalogueNamespace: string;
  categoryCodes: string[];
  allowFilterBy: string[];
  showBrandFilter?: boolean;
}

type PageDependencies = {
  path?: string;
  connectionType?: string;
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

  getAllNodes: (
    args: { type?: string | GraphQLOutputType },
    pageDependencies?: PageDependencies
  ) => Promise<Node[]>;

  runQuery: (
    args: {
      query: { filter?: unknown; sort?: unknown };
      type: string | GraphQLOutputType;
      firstOnly?: boolean;
    },
    pageDependencies?: PageDependencies
  ) => Promise<Node[] | Node>;

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
