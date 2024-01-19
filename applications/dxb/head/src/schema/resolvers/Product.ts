import { generateHashFromString, isDefined } from "@bmi/utils";
import type { Product } from "@bmi/firestore-types";
import { getDefaultYoutubePreviewImage } from "./utils/getDefaultYoutubePreviewImage";
import { getUrlFromPath, resolvePath } from "./utils/path";
import type { Node as GatsbyNode } from "gatsby";
import type { Data } from "../../components/Resources";
import type { AssetType, ProductDocumentWithAssetType } from "../../types/pim";
import type { Resource } from "./types/Contentful";
import type { Context, Node, ResolveArgs } from "./types/Gatsby";
import type { Path } from "./utils/path";

const getSlugAttributes = (source: Product) =>
  [source.colour, source.textureFamily].filter(isDefined);

const getSlug = (string: string) =>
  string.toLowerCase().replace(/[-_\s]+/gi, "-");

const resolvePathFromFamily = async (
  source: Node,
  args: ResolveArgs,
  context: Context
): Promise<Path> => {
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

  const { entries } = await context.nodeModel.findAll<Node>({
    query: {
      filter: {
        categoryCodes: {
          in: (source.categories || []).map(({ code }) => code)
        },
        ...marketFilters
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
      const { entries } = await context.nodeModel.findAll<
        AssetType & GatsbyNode
      >(
        {
          query: { filter: marketFilters },
          type: "ContentfulAssetType"
        },
        { connectionType: "ContentfulAssetType" }
      );

      const marketAssetTypes = [...entries].filter(
        (assetType) =>
          !["BIM", "FIXING_TOOL", "SPECIFICATION", "VIDEO"].find(
            (pimCode) => pimCode === assetType.pimCode
          )
      );

      const validPimCodes = marketAssetTypes.map(
        (assetType) => assetType.pimCode
      );
      const { documentDisplayFormat } = await context.nodeModel.findOne<
        Data & GatsbyNode
      >(
        {
          query: { filter: marketFilters },
          type: `ContentfulResources`
        },
        { connectionType: `ContentfulResources` }
      );
      const documents: ProductDocumentWithAssetType[] = source.documents
        .filter(
          (document) =>
            document.assetType &&
            validPimCodes.some((assetType) => assetType === document.assetType)
        )
        .map((doc) => ({
          ...doc,
          internal: { type: "PIMDocument", owner: "@bmi/resolvers" },
          assetType: marketAssetTypes.find(
            (fullAssetType) => fullAssetType.pimCode === doc.assetType
          )
        }));

      if (documentDisplayFormat === "Asset name") {
        return documents;
      }

      const groupedDocuments: Record<string, ProductDocumentWithAssetType[]> =
        documents.reduce((documents, document) => {
          return {
            ...documents,
            [document.assetType.pimCode]: [
              ...(documents[document.assetType.pimCode] || []),
              document
            ]
          };
        }, {});
      return Object.entries(groupedDocuments).flatMap(
        ([pimcode, documents]: [string, ProductDocumentWithAssetType[]]) => {
          if (documents.length === 1) {
            return documents;
          }
          const filterZipDocument: ProductDocumentWithAssetType[] =
            documents.filter(
              (document) =>
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
                  title: filterZipDocument[0].assetType.pimCode,
                  assetType: marketAssetTypes.find(
                    (fullAssetType) => fullAssetType.pimCode === pimcode
                  )
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

      const { entries } = await context.nodeModel.findAll<
        AssetType & GatsbyNode
      >(
        {
          query: { filter: marketFilters },
          type: "ContentfulAssetType"
        },
        { connectionType: "ContentfulAssetType" }
      );

      // all market asset types are valid.
      // todo: check, if we need to filter out ["BIM", "FIXING_TOOL", "SPECIFICATION", "VIDEO"]
      const marketAssetTypes = [...entries];

      const validPimCodes = marketAssetTypes.map(
        (assetType) => assetType.pimCode
      );
      const resource = await context.nodeModel.findOne<Resource>(
        {
          query: { filter: marketFilters },
          type: "ContentfulResources"
        },
        { connectionType: "ContentfulAssetType" }
      );

      const keyAssetTypes = resource.keyAssetTypes;

      if (!keyAssetTypes) {
        return [];
      }

      const documents: ProductDocumentWithAssetType[] = source.documents
        .filter(
          (document) =>
            document.assetType &&
            keyAssetTypes.some(
              (assetType) => assetType === document.assetType
            ) &&
            validPimCodes.some((assetType) => assetType === document.assetType)
        )
        .map((doc) => ({
          ...doc,
          assetType: marketAssetTypes.find(
            (fullAssetType) => fullAssetType.pimCode === doc.assetType
          )
        }));

      const groupedDocuments: Record<string, ProductDocumentWithAssetType[]> =
        documents.reduce((documents, document) => {
          return {
            ...documents,
            [document.assetType.pimCode]: [
              ...(documents[document.assetType.pimCode] || []),
              document
            ]
          };
        }, {});

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

      const { entries } = await context.nodeModel.findAll<Product & GatsbyNode>(
        {
          query: {
            filter: {
              categories: { elemMatch: { code: { eq: productFamilyCode } } },
              approvalStatus: { eq: "approved" }
            }
          },
          type: "Product"
        }
      );

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
  videos: {
    type: ["PimVideo"],
    async resolve(source: Product, args: ResolveArgs, context: Context) {
      return await Promise.all(
        source.videos.map(async (video) => {
          const defaultYouTubePreviewImage =
            await getDefaultYoutubePreviewImage(video.videoUrl);
          return {
            __typename: "PimVideo",
            defaultYouTubePreviewImage,
            ...video
          };
        })
      );
    }
  }
};
