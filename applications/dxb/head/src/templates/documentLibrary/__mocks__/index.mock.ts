// istanbul ignore file: doesn't hold any logic
import { Filter } from "@bmi/components/src";
import { Data as SiteData } from "../../../components/Site";
import { createMockSiteData } from "../../../test/mockSiteData";
import { ContentfulDocumentLibraryPage } from "../types";

export const createDocument = (customFields = {}) => {
  return {
    _source: {
      BRAND: [
        {
          code: "BMI_Components",
          name: "BMI Components"
        }
      ],
      CATEGORY: [
        {
          code: "ROOF_DRAIN_ASPHALT_MEMBRANES_FLATROOF_NO",
          name: "Taksluk bitumen flate tak"
        },
        {
          code: "ROOF_DRAIN_FLATROOF_NO",
          name: "Taksluk flate tak"
        },
        {
          code: "PRODUCTS_NO",
          name: "Produkter"
        },
        {
          code: "ACCESSORIES_FLATROOF_NO",
          name: "Tilbehør flate tak"
        },
        {
          code: "FLATROOF_NO",
          name: "Flate tak"
        },
        {
          code: "ROOF_NO",
          name: "Takprodukter"
        }
      ],
      CONCRETE_FITTINGS: [
        {
          code: "CONCRETE_FITTINGS_RIDGE",
          name: "Ridge"
        }
      ],
      CONCRETE: [
        {
          code: "CONCRETE_FITTINGS",
          name: "Fittings"
        }
      ],
      PITCHED_ROOF: [
        {
          code: "CONCRETE",
          name: "Concrete"
        }
      ],
      __typename: "PIMDocument",
      id: "07070050-a9a9-414a-944e-46dd7ecb8d3c",
      url: "https://bmipimngqa.azureedge.net/sys-master-hyb",
      title: "Bro BMI Norge AeroDek",
      isLinkDocument: false,
      productCode: "base_10201B1E1GHED",
      titleAndSize: "AeroDek_5034939_3",
      docName: "Bro BMI Norge AeroDek",
      noIndex: false,
      assetType: {
        name: "Broschüren",
        code: "BRO",
        pimCode: "PRODUCT_BROCHURE"
      },
      fileSize: 5034939,
      format: "application/pdf",
      extension: "pdf",
      realFileName: "BMI-AeroDek-BRO.pdf",
      ...customFields
    }
  };
};

export const createCollapseData = (documents: [] = []) => ({
  inner_hits: {
    related_documents: {
      hits: {
        hits: [
          createDocument({
            fileSize: 111111,
            docName: "Test 1",
            url: "https://url"
          }),
          ...documents
        ]
      }
    }
  }
});

export const creatESDocumentHitResponseMock = (
  customDocumentFields = {},
  customEsResponseFields = {}
) => {
  return {
    ...createDocument(customDocumentFields),
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
    assetTypes: [],
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
