// TODO: Find another place for this file.
import {
  generateDigestFromData,
  isDefined
} from "../../../../../libraries/utils/src";
import { Data as ContentfulDocument } from "../../../types/Document";
import {
  ContentfulDocumentsWithFilters,
  ProductDocumentsWithFilters
} from "../../../types/documentsWithFilters";
import {
  AssetType,
  Product,
  ProductDocument,
  ProductFilter
} from "../../../types/pim";
import { Context, MicroCopy, Node } from "../types/Gatsby";
import { getPlpFilters } from "./filters";

export const resolveDocumentsFromProducts = async (
  assetTypes: AssetType[],
  { source, context }: { source: Partial<Node>; context: Context },
  allowedFilters?: string[]
): Promise<ProductDocumentsWithFilters> => {
  const pimAssetTypes = assetTypes
    .map(({ pimCode }) => pimCode)
    .filter(isDefined);
  const filter = assetTypes.length
    ? {
        documents: {
          elemMatch: { assetType: { code: { in: pimAssetTypes } } }
        },
        ...(source.pimCodes && source.pimCodes.length
          ? { code: { in: source.pimCodes } }
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

  const products = [...entries];

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

  const productFilters = getPlpFilters({
    products: products,
    allowedFilters: allowedFilters || []
  });

  const result = products.flatMap((product) =>
    (product.documents || [])
      .filter((document) => pimAssetTypes.includes(document.assetType))
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
          isLinkDocument: false,
          product___NODE: product.code,
          productFilters: product.filters
        };

        if (document.isLinkDocument) {
          return {
            ...document,
            ...fieldData,
            parent: source.id,
            children: [],
            internal: {
              type: "PIMDocument",
              owner: "@bmi/resolvers",
              contentDigest: generateDigestFromData(fieldData)
            }
          };
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
        };
      })
      .filter(isDefined)
  );
  return {
    filters: productFilters,
    documents: result as unknown as ProductDocument[]
  };
};

export const resolveDocumentsFromContentful = async (
  assetTypes: AssetType[],
  { source, context }: { source: Partial<Node>; context: Context },
  allowedFilters: string[]
): Promise<ContentfulDocumentsWithFilters> => {
  const filter = assetTypes.length
    ? { assetType: { id: { in: assetTypes.map(({ id }) => id) } } }
    : {};

  const { entries } = await context.nodeModel.findAll<Node>({
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
    brandFilter = await generateBrandFilterFromDocuments(
      documents as unknown as ContentfulDocument[],
      context
    );
  }

  let assetTypeFilter = undefined;
  if (allowedFilters.some((filterName) => filterName === "AssetType")) {
    assetTypeFilter = await generateAssetTypeFilterFromDocuments(
      assetTypes,
      documents as unknown as ContentfulDocument[],
      context
    );
  }
  return {
    documents: documents as unknown as ContentfulDocument[],
    filters: [brandFilter, assetTypeFilter].filter(Boolean)
  };
};

const generateBrandFilterFromDocuments = async (
  documents: ContentfulDocument[],
  context: Context
): Promise<ProductFilter> => {
  const microCopyKey = "plpFilter.Brand";

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
    filterMicroCopies.find((item) => item.key === microCopyKey).value ||
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
  assetTypes: AssetType[],
  documents: ContentfulDocument[],
  context: Context
): Promise<ProductFilter> => {
  const microCopyKey = "filterLabels.assetType";
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
    .filter(Boolean)
    .reduce(uniqueByCode, []);

  if (allValues.length === 0) {
    return;
  }

  const filterLabel =
    filterMicroCopies.find((item) => item.key === microCopyKey).value ||
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
