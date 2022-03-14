import type {
  ContentfulDocument,
  PimProductDocument,
  PimSystemDocument
} from "@bmi/elasticsearch-types";
import type { Data as BreadcrumbsData } from "../../components/Breadcrumbs";
import type { Data as PageData } from "../../components/Page";
import type { Data as PageInfoData } from "../../components/PageInfo";
import type { RichTextData } from "../../components/RichText";
import type { Data as SiteData } from "../../components/Site";
import type { DocumentsFilters } from "../../schema/resolvers/types/DocumentsFilters";
import type { ResultType, Source, URLFilter } from "../../utils/filters";

export type QueryParams = {
  filters: URLFilter[];
};

export interface DocumentLibraryPageContext {
  pageId: string;
  siteId: string;
  categoryCode: string;
  variantCodeToPathMap?: Record<string, string>;
}

export interface ContentfulDocumentLibraryPage extends PageInfoData, PageData {
  description: RichTextData | null;
  allowFilterBy: string[] | null;
  source: Source;
  resultsType: ResultType;
  breadcrumbs: BreadcrumbsData;
  categoryCodes: string[];
  breadcrumbTitle: string;
  documentsFilters: DocumentsFilters | null;
  contentfulAssetTypes: AssetType[];
}

export interface DocumentLibraryProps {
  pageContext: DocumentLibraryPageContext;
  data: {
    contentfulDocumentLibraryPage: ContentfulDocumentLibraryPage;
    contentfulSite: SiteData;
  };
}

export type DocumentType =
  | ContentfulDocument["__typename"]
  | PimProductDocument["__typename"]
  | PimSystemDocument["__typename"];

export type AssetType = {
  name: string;
  code: string;
  description: RichTextData;
  pimCode: string;
};
