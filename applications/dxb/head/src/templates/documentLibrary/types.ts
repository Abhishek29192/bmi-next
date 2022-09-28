import { Data as BreadcrumbsData } from "../../components/Breadcrumbs";
import { Data as PageData } from "../../components/Page";
import { Data as PageInfoData } from "../../components/PageInfo";
import { RichTextData } from "../../components/RichText";
import { Data as SiteData } from "../../components/Site";
import { DocumentsFilters } from "../../schema/resolvers/types/DocumentsFilters";
import { ContentfulDocument } from "../../types/Document";
import { ProductDocument } from "../../types/pim";
import { ResultType, Source, URLFilter } from "../../utils/filters";

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
  | ProductDocument["__typename"]
  | "";
