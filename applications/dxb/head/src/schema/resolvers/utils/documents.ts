// TODO: Find another place for this file.
import { isDefined } from "@bmi/utils";
import { microCopy } from "@bmi/microcopies";
import type { Product } from "@bmi/firestore-types";
import { getPlpFilters } from "./filters";
import { getMicroCopies } from "./getMicrocopies";
import type { Node as GatsbyNode } from "gatsby";
import type { ProductFilter } from "../../../types/pim";
import type {
  ContentfulAssetType,
  ContentfulDocument
} from "../types/Contentful";
import type { Context, Node } from "../types/Gatsby";

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

  const { entries } = await context.nodeModel.findAll<Product & GatsbyNode>({
    query: {
      filter
    },
    type: "Product"
  });

  const products: Product[] = [...entries];

  if (products.length === 0) {
    return [];
  }

  const microCopies = await getMicroCopies(context);

  if (!microCopies) {
    console.error("Did not manage to get microcopies");
    return [];
  }

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

  const brandFilter = allowedFilters.some(
    (filterName) => filterName === "Brand"
  )
    ? await generateBrandFilterFromDocuments(documents, context)
    : null;

  const assetTypeFilter = allowedFilters.some(
    (filterName) => filterName === "AssetType"
  )
    ? await generateAssetTypeFilterFromDocuments(assetTypes, documents, context)
    : null;

  return [brandFilter, assetTypeFilter]
    .flatMap((filter) => (filter ? [filter] : []))
    .filter(Boolean);
};

const generateBrandFilterFromDocuments = async (
  documents: ContentfulDocument[],
  context: Context
): Promise<ProductFilter> => {
  const microCopyKey = "filterLabels.Brand";

  const microCopies = await getMicroCopies(context);

  if (!microCopies) {
    console.error("Did not manage to get microcopies");
    return;
  }

  const filterMicroCopies = microCopies.filter(
    (microCopy) => microCopy.key === microCopyKey
  );

  // Find Unique assetTypes, they're the same as far as TS is concerned
  const allValues = [
    ...new Set(documents.map(({ brand }) => brand).filter(Boolean))
  ];

  if (allValues.length === 0) {
    return undefined;
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
): Promise<ProductFilter | undefined> => {
  const microCopyKey = microCopy.FILTER_LABELS_ASSET_TYPE;

  const microCopies = await getMicroCopies(context);

  if (!microCopies) {
    console.error("Did not manage to get microcopies");
    return;
  }

  const filterMicroCopies = microCopies.filter(
    (microCopy) => microCopy.key === microCopyKey
  );

  const allAssetTypeIds: string[] = [
    ...new Set(documents.map((document) => document["assetType___NODE"]))
  ];

  const documentReferencedAssetTypes = assetTypes.filter((assetType) =>
    allAssetTypeIds.includes(assetType.id)
  );
  // Find Unique assetTypes, they're the same as far as TS is concerned
  const allValues = documentReferencedAssetTypes
    .filter(isDefined)
    .reduce(uniqueByCode, []);

  if (allValues.length === 0) {
    return undefined;
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

const uniqueByCode = (
  uniqueObjects: ContentfulAssetType[],
  object: ContentfulAssetType
) => {
  uniqueObjects.find((unique) => unique.code === object.code) ||
    uniqueObjects.push(object);
  return uniqueObjects;
};
