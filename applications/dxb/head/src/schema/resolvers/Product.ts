import {
  Product,
  ProductDocument as FirestoreProductDocument
} from "../../../../libraries/firestore-types/src";
import {
  generateHashFromString,
  isDefined
} from "../../../../libraries/utils/src";
import { Data } from "../../components/Resources";
import { AssetType } from "../../types/pim";
import groupBy from "../../utils/groupBy";
import { Resource } from "./types/Contentful";
import { Context, Node, ResolveArgs } from "./types/Gatsby";
import { getUrlFromPath, Path, resolvePath } from "./utils/path";

const getSlugAttributes = (source: Product) =>
  [source.colour, source.textureFamily].filter(isDefined);

const getSlug = (string: string) =>
  string.toLowerCase().replace(/[-_\s]+/gi, "-");

const resolvePathFromFamily = async (
  source: Node,
  args: ResolveArgs,
  context: Context
): Promise<Path> => {
  const { entries } = await context.nodeModel.findAll<Node>({
    query: {
      filter: {
        categoryCodes: {
          in: (source.categories || []).map(({ code }) => code)
        }
      }
    },
    type: "ContentfulProductListerPage"
  });

  const parentFamilies = [...entries];

  if (!parentFamilies.length) {
    return [];
  }

  return resolvePath(parentFamilies[0], args, context);
};

export default {
  // Could be done in firestore writer, but requires the path of the PLP
  breadcrumbs: {
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      const fullPath = await resolvePathFromFamily(source, args, context);
      return fullPath.concat({
        id: source.hashedCode as string,
        label: source.name,
        slug: getSlug(
          [
            source.name,
            ...getSlugAttributes(source as unknown as Product),
            source.hashedCode
          ].join("/")
        )
      });
    }
  },
  productDocuments: {
    type: ["ProductDocumentResponse"],
    async resolve(source: Product, args: ResolveArgs, context: Context) {
      if (!source.documents || !source.documents.length) {
        return [];
      }
      const { entries } = await context.nodeModel.findAll<AssetType>(
        {
          query: {},
          type: "ContentfulAssetType"
        },
        { connectionType: "ContentfulAssetType" }
      );

      const assetTypes = [...entries]
        .filter(
          (assetType) =>
            !["BIM", "FIXING_TOOL", "SPECIFICATION", "VIDEO"].find(
              (pimCode) => pimCode === assetType.pimCode
            )
        )
        .map((assetType) => assetType.pimCode);
      const { documentDisplayFormat } = await context.nodeModel.findOne<Data>(
        {
          query: {},
          type: `ContentfulResources`
        },
        { connectionType: `ContentfulResources` }
      );
      const documents: FirestoreProductDocument[] = source.documents
        .filter(
          (document) =>
            document.assetType &&
            assetTypes.some((assetType) => assetType === document.assetType)
        )
        .map((doc) => ({
          ...doc,
          internal: { type: "PIMDocument", owner: "@bmi/resolvers" }
        }));

      if (documentDisplayFormat === "Asset name") {
        return documents;
      }

      const groupedDocuments: Record<string, FirestoreProductDocument[]> =
        documents.reduce((documents, document) => {
          return {
            ...documents,
            [document.assetType]: [
              ...(documents[document.assetType] || []),
              document
            ]
          };
        }, {});
      return Object.entries(groupedDocuments).flatMap(
        ([assetType, documents]: [string, FirestoreProductDocument[]]) => {
          if (documents.length === 1) {
            return documents;
          }
          const filterZipDocument: FirestoreProductDocument[] =
            documents.filter(
              (document: FirestoreProductDocument) =>
                !(
                  document.isLinkDocument ||
                  document.format === "application/zip"
                )
            );
          const pseudoZipDocument =
            filterZipDocument.length > 1
              ? {
                  __typename: "PIMDocumentWithPseudoZip",
                  id: generateHashFromString(JSON.stringify(filterZipDocument)),
                  assetType: filterZipDocument[0].assetType,
                  format: "application/zip",
                  fileSize: filterZipDocument.reduce(
                    (a, doc) => a + doc.fileSize,
                    0
                  ),
                  isLinkDocument: false,
                  productName: filterZipDocument[0].productName,
                  productBaseCode: filterZipDocument[0].productBaseCode,
                  documentList: filterZipDocument,
                  internal: {
                    type: "PIMDocumentWithPseudoZip",
                    owner: "@bmi/resolvers"
                  },
                  title: filterZipDocument[0].assetType
                }
              : filterZipDocument[0];
          return [
            ...documents.filter(
              (document) =>
                document.isLinkDocument || document.format === "application/zip"
            ),
            pseudoZipDocument
          ].filter(isDefined);
        }
      );
    }
  },
  // Could be done in firestore writer, but requires a list of valid AssetTypes from Contentful
  keyAssetDocuments: {
    type: ["KeyAssetDocument"],
    async resolve(source: Product, args: ResolveArgs, context: Context) {
      if (!source.documents || !source.documents.length) {
        return [];
      }
      const resource = await context.nodeModel.findOne<Resource>(
        {
          query: {},
          type: "ContentfulResources"
        },
        { connectionType: "ContentfulAssetType" }
      );

      const keyAssetTypes = resource.keyAssetTypes;

      if (!keyAssetTypes) {
        return [];
      }

      const groupedDocuments = groupBy(
        source.documents.filter(
          (document) =>
            document.assetType &&
            keyAssetTypes.some((assetType) => assetType === document.assetType)
        ),
        "assetType"
      );
      return Object.keys(groupedDocuments).map((key) => {
        return {
          assetType: key,
          // eslint-disable-next-line security/detect-object-injection
          documents: groupedDocuments[key]
        };
      });
    }
  },
  // TODO: Move this to firestore writer?
  oldPath: {
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      const fullPath = await resolvePathFromFamily(source, args, context);
      const breadcrumbs = fullPath.concat({
        id: source.hashedCode as string,
        label: source.name,
        slug: getSlug(
          [
            source.name,
            ...getSlugAttributes(source as unknown as Product),
            source.hashedCode
          ].join("/")
        )
      });
      return `p/${getUrlFromPath(breadcrumbs)}`;
    }
  },
  // TODO: Move this to firestore writer?
  path: {
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      if (process.env.GATSBY_USE_SIMPLE_PDP_URL_STRUCTURE === "true") {
        return source.path;
      } else {
        const fullPath = await resolvePathFromFamily(source, args, context);
        const breadcrumbs = fullPath.concat({
          id: source.hashedCode as string,
          label: source.name,
          slug: getSlug(
            [
              source.name,
              ...getSlugAttributes(source as unknown as Product),
              source.hashedCode
            ].join("/")
          )
        });
        return `p/${getUrlFromPath(breadcrumbs)}`;
      }
    }
  },
  relatedProducts: {
    async resolve(source: Product, args: ResolveArgs, context: Context) {
      if (process.env.GATSBY_HIDE_RECOMMENDED_PRODUCTS === "true") {
        return [];
      }

      const productFamilyCode = (
        source.categories.find(({ categoryType }) => {
          return categoryType === "ProductFamily";
        }) || {}
      )?.code;

      if (!productFamilyCode) {
        return [];
      }

      const { entries } = await context.nodeModel.findAll<Product>({
        query: {
          filter: {
            categories: { elemMatch: { code: { eq: productFamilyCode } } }
          }
        },
        type: "Product"
      });

      return [...entries]
        .reduce<Product[]>((products, product) => {
          products.find((prod) => prod.name === product.name) ||
            products.push(product);
          return products;
        }, [])
        .sort((a, b) => {
          const weightA = a.baseScoringWeight;
          const weightB = b.baseScoringWeight;

          if (weightB === weightA) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
          }

          return weightB - weightA;
        });
    }
  },
  video: {
    async resolve(source: Product, args: ResolveArgs, context: Context) {
      return source.videos.map((video) => ({
        __typename: "PIMVideo",
        ...video
      }));
    }
  }
};
