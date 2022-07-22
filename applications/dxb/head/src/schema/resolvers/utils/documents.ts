// TODO: Find another place for this file.
import { Product } from "applications/dxb/libraries/firestore-types/src";
import {
  generateDigestFromData,
  isDefined
} from "../../../../../libraries/utils/src";
import { ProductFilter } from "../../../types/pim";
import { ContentfulAssetType, ContentfulDocument } from "../types/Contentful";
import {
  ContentfulDocumentsWithFilters,
  ProductDocumentsWithFilters
} from "../types/DocumentsWithFilters";
import { Context, MicroCopy, Node } from "../types/Gatsby";
import { ProductDocument } from "../types/pim";
import { getPlpFilters } from "./filters";

export const resolveDocumentsFromProducts = async (
  assetTypes: ContentfulAssetType[],
  { source, context }: { source: Partial<Node>; context: Context },
  allowedFilters?: string[]
): Promise<ProductDocumentsWithFilters> => {
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
    return { documents: [], filters: [] };
  }

  const resources = await context.nodeModel.findOne<Node>({
    query: {
      filter: {
        site: {
          elemMatch: {
            countryCode: { eq: process.env.SPACE_MARKET_CODE }
          }
        }
      }
    },
    type: "ContentfulResources"
  });

  const { entries: resourceEntries } =
    await context.nodeModel.findAll<MicroCopy>(
      {
        query: {},
        type: "ContentfulMicroCopy"
      },
      { connectionType: "ContentfulMicroCopy" }
    );
  const filterMicroCopies: Map<string, string> = [...resourceEntries].reduce(
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

  let result = products.flatMap((product: Product) =>
    (product.documents || [])
      .filter(
        (document) =>
          document.assetType && pimAssetTypes.includes(document.assetType)
      )
      .map((document) => {
        const assetType = assetTypes.find(
          (assetType) => assetType.pimCode === document.assetType
        );

        const updatedTitle = {
          "Product name + asset type": `${product.name} ${assetType.name}`,
          "Document name": document.title || `${product.name} ${assetType.name}`
        }[(resources && resources.productDocumentNameMap) || "Document name"];

        const fieldData = {
          ...document,
          title: updatedTitle,
          assetType___NODE: assetType.id,
          isLinkDocument: document.isLinkDocument,
          productFilters: product.filters
        };

        if (document.isLinkDocument) {
          return {
            ...fieldData,
            parent: source.id,
            children: [],
            internal: {
              type: "PIMDocument",
              owner: "@bmi/resolvers",
              contentDigest: generateDigestFromData(fieldData)
            }
          } as unknown as ProductDocument;
        }

        return {
          ...fieldData,
          parent: source.id,
          children: [],
          internal: {
            type: "PIMDocument",
            owner: "@bmi/resolvers",
            contentDigest: generateDigestFromData(fieldData)
          }
        } as unknown as ProductDocument;
      })
  );
  // DXB-2042: this needs to be done only for "Simple" table results
  if (source.resultsType === "Simple") {
    result = result.reduce<ProductDocument[]>((documents, document) => {
      const foundDocument = documents.find(
        (doc) => doc.title === document.title && doc.url === document.url
      );
      if (foundDocument) {
        return documents.map((doc) => {
          if (doc.title === document.title && doc.url === document.url) {
            return {
              ...doc,
              productFilters: [
                ...(doc.productFilters as ProductFilter[]).reduce(
                  (filters, filter) => {
                    if (
                      filters.find(
                        (fil) =>
                          fil.filterCode === filter.filterCode &&
                          fil.value === filter.value
                      )
                    ) {
                      return filters;
                    }
                    return [...filters, filter];
                  },
                  []
                )
              ]
            };
          }
          return doc;
        });
      }
      return [...documents, document];
    }, []);
  }
  return {
    filters: productFilters,
    documents: result
  };
};

export const resolveDocumentsFromContentful = async (
  assetTypes: ContentfulAssetType[],
  { source, context }: { source: Partial<Node>; context: Context },
  allowedFilters: string[]
): Promise<ContentfulDocumentsWithFilters> => {
  const filter = assetTypes.length
    ? { assetType: { id: { in: assetTypes.map(({ id }) => id) } } }
    : {};

  const { entries } = await context.nodeModel.findAll<ContentfulDocument>({
    query: {
      filter
    },
    type: "ContentfulDocument"
  });

  const documents = [...entries];
  if (!documents.length) {
    return { documents: [], filters: [] };
  }

  let brandFilter = undefined;
  if (allowedFilters.some((filterName) => filterName === "Brand")) {
    brandFilter = await generateBrandFilterFromDocuments(documents, context);
  }

  let assetTypeFilter = undefined;
  if (allowedFilters.some((filterName) => filterName === "AssetType")) {
    assetTypeFilter = await generateAssetTypeFilterFromDocuments(
      assetTypes,
      documents,
      context
    );
  }
  return {
    documents: documents,
    filters: [brandFilter, assetTypeFilter].filter(isDefined)
  };
};

const generateBrandFilterFromDocuments = async (
  documents: ContentfulDocument[],
  context: Context
): Promise<ProductFilter> => {
  const microCopyKey = "filterLabels.Brand";

  const { entries: resourceEntries } =
    await context.nodeModel.findAll<MicroCopy>(
      {
        query: {
          filter: {
            key: {
              in: [microCopyKey]
            }
          }
        },
        type: "ContentfulMicroCopy"
      },
      { connectionType: "ContentfulMicroCopy" }
    );
  const filterMicroCopies = [...resourceEntries];

  // Find Unique assetTypes, they're the same as far as TS is concerned
  const allValues = [
    ...new Set(documents.map(({ brand }) => brand).filter(Boolean))
  ];

  if (allValues.length === 0) {
    return;
  }
  const filterLabel =
    filterMicroCopies.find((item) => item.key === microCopyKey)?.value ||
    microCopyKey;

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
  const microCopyKey = "filterLabels.AssetType";
  const { entries: resourceEntries } =
    await context.nodeModel.findAll<MicroCopy>(
      {
        query: {
          filter: {
            key: {
              in: [microCopyKey]
            }
          }
        },
        type: "ContentfulMicroCopy"
      },
      { connectionType: "ContentfulMicroCopy" }
    );
  const filterMicroCopies = [...resourceEntries];

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

  const filterLabel =
    filterMicroCopies.find((item) => item.key === microCopyKey)?.value ||
    microCopyKey;
  return {
    filterCode: microCopyKey,
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
