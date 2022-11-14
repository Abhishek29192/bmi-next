// TODO: Find another place for this file.
import { Product } from "applications/dxb/libraries/firestore-types/src";
import { isDefined } from "../../../../../libraries/utils/src";
import { microCopy } from "../../../constants/microCopies";
import { ProductFilter } from "../../../types/pim";
import {
  ContentfulAssetType,
  ContentfulDocument,
  ContentfulSite
} from "../types/Contentful";
import { Context, Node } from "../types/Gatsby";
import { getPlpFilters } from "./filters";

export const resolveDocumentsFiltersFromProducts = async (
  assetTypes: ContentfulAssetType[],
  { source, context }: { source: Partial<Node>; context: Context },
  allowedFilters?: string[]
): Promise<ProductFilter[]> => {
  const pimAssetTypes = assetTypes
    .map(({ pimCode }) => pimCode)
    .filter(isDefined);
  const filter = assetTypes.length
    ? {
        documents: {
          elemMatch: { assetType: { in: pimAssetTypes } }
        },
        ...(source.pimCodes && source.pimCodes.length
          ? { baseCode: { in: source.pimCodes } }
          : {}),
        ...(source.categoryCodes && source.categoryCodes.length
          ? {
              categories: { elemMatch: { code: { in: source.categoryCodes } } }
            }
          : {})
      }
    : {};

  const { entries } = await context.nodeModel.findAll<Product>({
    query: {
      filter
    },
    type: "Product"
  });

  const products: Product[] = [...entries];

  if (products.length === 0) {
    return [];
  }

  const marketCode = process.env.SPACE_MARKET_CODE;
  const localeCode = process.env.GATSBY_MARKET_LOCALE_CODE;
  if (!marketCode || !localeCode) {
    // eslint-disable-next-line no-console
    console.warn(
      `Please check enviroment variables 'SPACE_MARKET_CODE' or 'GATSBY_MARKET_LOCALE_CODE' not set!`
    );
    return [];
  }
  const currSite = await context.nodeModel.findOne<ContentfulSite>(
    {
      query: {
        filter: {
          countryCode: { eq: marketCode },
          node_locale: { eq: localeCode }
        }
      },
      type: "ContentfulSite"
    },
    { connectionType: "ContentfulSite" }
  );
  if (!currSite) {
    // eslint-disable-next-line no-console
    console.warn(
      `Site not found in contentful: for country code: '${marketCode}' and locale: '${localeCode}'.`
    );
    return [];
  }
  const resource = await context.nodeModel.getNodeById({
    id: currSite.resources___NODE as string,
    type: "ContentfulResources"
  });
  if (!resource) {
    // eslint-disable-next-line no-console
    console.warn(
      `Resource not found: for site in contentful with id: '${currSite.contentful_id}'.`
    );
    return [];
  }

  // MC access in consistently happens only via resource content type
  // that means a market is only aware of MCs which are associated with the resource
  const microCopies = await context.nodeModel.getNodesByIds({
    ids: resource.microCopy___NODE,
    type: "ContentfulMicroCopy"
  });

  const filterMicroCopies: Map<string, string> = microCopies.reduce(
    (map, microCopy) => {
      return map.set(microCopy.key, microCopy.value);
    },
    new Map()
  );

  const productFilters = getPlpFilters({
    products: products,
    allowedFilters: allowedFilters || [],
    microCopies: filterMicroCopies
  });

  const createAssetTypeFilter = allowedFilters?.includes("AssetType");

  if (createAssetTypeFilter) {
    const assetTypeFilter: ProductFilter = {
      filterCode: "AssetType",
      label:
        filterMicroCopies.get(`filterLabels.AssetType`) ||
        "MC:filterLabels.AssetType",
      name: "contentfulassettype", // Force it to work with the same filter group as the Contentful documents for ALL source tables
      options: []
    };

    products.forEach((product: Product) =>
      (product.documents || [])
        .filter(
          (document) =>
            document.assetType && pimAssetTypes.includes(document.assetType)
        )
        .forEach((document) => {
          const assetType = assetTypes.find(
            (assetType) => assetType.pimCode === document.assetType
          );
          if (
            assetType &&
            !assetTypeFilter.options.find(
              (option) => option.value === assetType.code
            )
          ) {
            assetTypeFilter.options.push({
              label: assetType.name,
              value: assetType.code
            });
          }
        })
    );

    productFilters.push(assetTypeFilter);
  }

  return productFilters;
};

export const resolveDocumentsFiltersFromContentful = async (
  assetTypes: ContentfulAssetType[],
  { source, context }: { source: Partial<Node>; context: Context },
  allowedFilters: string[]
): Promise<ProductFilter[]> => {
  const marketFilters = process.env.MARKET_TAG_NAME
    ? {
        metadata: {
          tags: {
            elemMatch: {
              contentful_id: {
                eq: process.env.MARKET_TAG_NAME
              }
            }
          }
        }
      }
    : {};
  const assetTypeFilters = assetTypes.length
    ? { assetType: { id: { in: assetTypes.map(({ id }) => id) } } }
    : {};

  const { entries } = await context.nodeModel.findAll<ContentfulDocument>({
    query: {
      filter: {
        ...assetTypeFilters,
        ...marketFilters
      }
    },
    type: "ContentfulDocument"
  });

  const documents = [...entries];
  if (!documents.length) {
    return [];
  }

  let brandFilter: ProductFilter = undefined;
  if (allowedFilters.some((filterName) => filterName === "Brand")) {
    brandFilter = await generateBrandFilterFromDocuments(documents, context);
  }

  let assetTypeFilter: ProductFilter = undefined;
  if (allowedFilters.some((filterName) => filterName === "AssetType")) {
    assetTypeFilter = await generateAssetTypeFilterFromDocuments(
      assetTypes,
      documents,
      context
    );
  }
  return [brandFilter, assetTypeFilter].filter(Boolean);
};

const generateBrandFilterFromDocuments = async (
  documents: ContentfulDocument[],
  context: Context
): Promise<ProductFilter> => {
  const microCopyKey = "filterLabels.Brand";

  const marketCode = process.env.SPACE_MARKET_CODE;
  const localeCode = process.env.GATSBY_MARKET_LOCALE_CODE;
  if (!marketCode || !localeCode) {
    // eslint-disable-next-line no-console
    console.warn(
      `Please check enviroment variables 'SPACE_MARKET_CODE' or 'GATSBY_MARKET_LOCALE_CODE' not set!`
    );
    return;
  }
  const currSite = await context.nodeModel.findOne<ContentfulSite>(
    {
      query: {
        filter: {
          countryCode: { eq: marketCode },
          node_locale: { eq: localeCode }
        }
      },
      type: "ContentfulSite"
    },
    { connectionType: "ContentfulSite" }
  );
  if (!currSite) {
    // eslint-disable-next-line no-console
    console.warn(
      `Site not found in contentful: for country code: '${marketCode}' and locale: '${localeCode}'.`
    );
    return;
  }
  const resource = await context.nodeModel.getNodeById({
    id: currSite.resources___NODE as string,
    type: "ContentfulResources"
  });
  if (!resource) {
    // eslint-disable-next-line no-console
    console.warn(
      `Resource not found: for site in contentful with id: '${currSite.contentful_id}'.`
    );
    return;
  }

  // MC access in consistently happens only via resource content type
  // that means a market is only aware of MCs which are associated with the resource
  const microCopies = await context.nodeModel.getNodesByIds({
    ids: resource.microCopy___NODE,
    type: "ContentfulMicroCopy"
  });

  const filterMicroCopies = microCopies.filter(
    (microCopy) => microCopy.key === microCopyKey
  );

  // Find Unique assetTypes, they're the same as far as TS is concerned
  const allValues = [
    ...new Set(documents.map(({ brand }) => brand).filter(Boolean))
  ];

  if (allValues.length === 0) {
    return;
  }
  const filterLabel = (filterMicroCopies.find(
    (item) => item.key === microCopyKey
  )?.value || microCopyKey) as string;

  return {
    filterCode: "Brand",
    label: filterLabel,
    name: "Brand",
    value: [],
    options: allValues.sort(sortAlphabeticallyBy("name")).map((brand) => ({
      label: brand,
      value: brand
    }))
  };
};

const generateAssetTypeFilterFromDocuments = async (
  assetTypes: ContentfulAssetType[],
  documents: ContentfulDocument[],
  context: Context
): Promise<ProductFilter> => {
  const microCopyKey = microCopy.FILTER_LABELS_ASSET_TYPE;
  const marketCode = process.env.SPACE_MARKET_CODE;
  const localeCode = process.env.GATSBY_MARKET_LOCALE_CODE;
  if (!marketCode || !localeCode) {
    // eslint-disable-next-line no-console
    console.warn(
      `Please check enviroment variables 'SPACE_MARKET_CODE' or 'GATSBY_MARKET_LOCALE_CODE' not set!`
    );
    return;
  }
  const currSite = await context.nodeModel.findOne<ContentfulSite>(
    {
      query: {
        filter: {
          countryCode: { eq: marketCode },
          node_locale: { eq: localeCode }
        }
      },
      type: "ContentfulSite"
    },
    { connectionType: "ContentfulSite" }
  );
  if (!currSite) {
    // eslint-disable-next-line no-console
    console.warn(
      `Site not found in contentful: for country code: '${marketCode}' and locale: '${localeCode}'.`
    );
    return;
  }
  const resource = await context.nodeModel.getNodeById({
    id: currSite.resources___NODE as string,
    type: "ContentfulResources"
  });
  if (!resource) {
    // eslint-disable-next-line no-console
    console.warn(
      `Resource not found: for site in contentful with id: '${currSite.contentful_id}'.`
    );
    return;
  }

  // MC access in consistently happens only via resource content type
  // that means a market is only aware of MCs which are associated with the resource
  const microCopies = await context.nodeModel.getNodesByIds({
    ids: resource.microCopy___NODE,
    type: "ContentfulMicroCopy"
  });

  const filterMicroCopies = microCopies.filter(
    (microCopy) => microCopy.key === microCopyKey
  );

  const allsAssetTypeIds: string[] = [
    ...new Set(documents.map((document) => document["assetType___NODE"]))
  ];

  const documentReferencedAssetTypes = assetTypes.filter((assetType) =>
    allsAssetTypeIds.includes(assetType.id)
  );
  // Find Unique assetTypes, they're the same as far as TS is concerned
  const allValues = documentReferencedAssetTypes
    .filter(isDefined)
    .reduce(uniqueByCode, []);

  if (allValues.length === 0) {
    return;
  }

  const filterLabel = (filterMicroCopies.find(
    (item) => item.key === microCopyKey
  )?.value || microCopyKey) as string;

  return {
    filterCode: "AssetType",
    label: filterLabel,
    name: microCopyKey,
    value: [],
    options: allValues.sort(sortAlphabeticallyBy("name")).map((assetType) => ({
      label: assetType.name,
      value: assetType.code
    }))
  };
};

const sortAlphabeticallyBy = (propName) => (a, b) => {
  // eslint-disable-next-line security/detect-object-injection
  if (a[propName] < b[propName]) {
    return -1;
  }
  // eslint-disable-next-line security/detect-object-injection
  if (a[propName] > b[propName]) {
    return 1;
  }
  return 0;
};

const uniqueByCode = (uniqueObjects, object) => {
  uniqueObjects.find((unique) => unique.code === object.code) ||
    uniqueObjects.push(object);
  return uniqueObjects;
};
