// istanbul ignore file: doesn't hold any logic
import { Filter } from "@bmi-digital/components/filters";
import {
  ContentfulDocument,
  createPimProductDocument,
  PimProductDocument,
  PimSystemDocument
} from "@bmi/elasticsearch-types";
import { Data as SiteData } from "../../../components/Site";
import createContentfulAssetType from "../../../schema/resolvers/types/helpers/ContentfulAssetTypeHelper";
import { createMockSiteData } from "../../../test/mockSiteData";
import { ContentfulDocumentLibraryPage } from "../types";

export const createCollapseData = (
  documents: (PimProductDocument | PimSystemDocument | ContentfulDocument)[] = [
    createPimProductDocument({
      fileSize: 111111,
      url: "https://url"
    })
  ]
) => ({
  inner_hits: {
    related_documents: {
      hits: {
        hits: documents.map((document) => ({ _source: document }))
      }
    }
  }
});

export const createESDocumentHitResponseMock = (
  customDocumentFields:
    | PimProductDocument
    | PimSystemDocument
    | ContentfulDocument = createPimProductDocument(),
  customEsResponseFields = {}
) => {
  return {
    _source: {
      ...customDocumentFields
    },
    ...customEsResponseFields
  };
};

export const filtersMock = (customFilters: Filter[] = []) => {
  return [
    {
      filterCode: "Brand",
      label: "filterLabels.Brand",
      name: "Brand",
      options: [
        {
          label: "AeroDek",
          value: "AeroDek",
          isDisabled: false
        },
        {
          label: "BMI Components",
          value: "BMI_Components",
          isDisabled: false
        }
      ]
    },
    ...customFilters
  ];
};

export const createData = (
  documentFilters: Filter[] = [],
  contentfulDocumentLibraryPageData: Partial<ContentfulDocumentLibraryPage> = {}
): {
  contentfulDocumentLibraryPage: ContentfulDocumentLibraryPage;
  contentfulSite: SiteData;
} => ({
  contentfulDocumentLibraryPage: {
    __typename: "ContentfulDocumentLibraryPage",
    id: "id",
    title: "title",
    subtitle: null,
    brandLogo: null,
    slug: "slug",
    date: null,
    rawDate: null,
    tags: null,
    featuredMedia: null,
    featuredVideo: null,
    signupBlock: null,
    seo: null,
    path: "/path",
    description: null,
    allowFilterBy: null,
    source: "PIM",
    resultsType: "Simple",
    contentfulAssetTypes: [
      createContentfulAssetType({
        code: createESDocumentHitResponseMock()._source.assetType.code
      })
    ],
    documentsFilters: { filters: [...documentFilters] },
    breadcrumbs: [
      {
        id: "abc123",
        label: "documentlibrary",
        slug: "document-library"
      }
    ],
    categoryCodes: ["categoryCodes"],
    breadcrumbTitle: "breadcrumbTitle",
    ...contentfulDocumentLibraryPageData
  },
  contentfulSite: createMockSiteData()
});
