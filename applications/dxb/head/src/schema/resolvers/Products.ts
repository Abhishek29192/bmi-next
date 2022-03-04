import { Product, VariantOption } from "../../components/types/pim";
import {
  generateIdFromString,
  generateDigestFromData
} from "../../utils/encryption";
import { generateSimpleProductUrl } from "../../utils/product-url-path";
import { Node, ResolveArgs, Context } from "./types";
import { getFormatFromFileName, isPimLinkDocument } from "./utils/documents";

import { resolvePath, getUrlFromPath } from "./utils/path";

const getSlugAttributes = (source: VariantOption) => {
  if (!source.classifications || !source.classifications.length) {
    return [];
  }

  return ["colour", "texturefamily"].flatMap((attribute) => {
    return (source.classifications || [])
      .map(({ features }) => {
        const feature = features.find(
          ({ code }) => code.split(".").pop() === attribute
        );
        if (
          !feature ||
          !feature.featureValues ||
          !feature.featureValues.length
        ) {
          return false;
        }

        return feature.featureValues[0].value;
      })
      .filter(Boolean);
  });
};

const getSlug = (string: string) =>
  string.toLowerCase().replace(/[-_\s]+/gi, "-");

const resolvePathFromFamily = async (
  source: Node,
  args: ResolveArgs,
  context: Context
) => {
  const parentFamilies = (await context.nodeModel.findAll({
    query: {
      filter: {
        categoryCodes: {
          in: (source.categories || []).map(({ code }) => code)
        }
      }
    },
    type: "ContentfulProductListerPage"
  })) as Node[];

  if (!parentFamilies.length) {
    return [];
  }

  return resolvePath(parentFamilies[0], args, context);
};

export default {
  variantOptions: {
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      const fullPath = await resolvePathFromFamily(source, args, context);

      return (source.variantOptions || [])
        .filter((variant) => variant.approvalStatus === "approved")
        .map((variant) => {
          const id = generateIdFromString(variant.code, false);
          const breadcrumbs = fullPath.concat({
            id,
            label: source.name,
            slug: getSlug(
              [source.name, ...getSlugAttributes(variant), id].join("/")
            )
          });
          const oldPath = `p/${getUrlFromPath(breadcrumbs)}`;

          return {
            ...variant,
            id,
            path:
              process.env.GATSBY_USE_SIMPLE_PDP_URL_STRUCTURE === "true"
                ? `p/${generateSimpleProductUrl(
                    source as Product,
                    variant,
                    id,
                    process.env.GATSBY_ENABLE_PDP_VARIANT_ATTRIBUTE_URL ===
                      "true" // this is currently feature flagged so that countries can opt-in for 'variant attributes'
                  )}`
                : oldPath,
            oldPath,
            breadcrumbs
          };
        });
    }
  },
  documents: {
    type: ["ProductDocument"],
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      const assetTypes = await context.nodeModel.getAllNodes(
        { type: "ContentfulAssetType" },
        { connectionType: "ContentfulAssetType" }
      );

      if (!source.assets || !source.assets.length) {
        return [];
      }

      return source.assets
        .map((asset) => {
          const id = generateIdFromString(source.name + asset.name, true);
          const { url, fileSize, realFileName, mime } = asset;
          const assetType = assetTypes.find(
            (assetType) => assetType.pimCode === asset.assetType
          );

          if (!assetType || !url) {
            return;
          }

          if (isPimLinkDocument(asset)) {
            const fieldData = {
              title: `${source.name} ${assetType.name}`,
              url,
              assetType___NODE: assetType.id,
              product___NODE: source.id
            };

            return {
              id,
              ...fieldData,
              parent: source.id,
              children: [],
              internal: {
                type: "PIMLinkDocument",
                owner: "@bmi/resolvers",
                contentDigest: generateDigestFromData(fieldData)
              }
            };
          }

          if (!fileSize || !realFileName) {
            return;
          }

          const fieldData = {
            title: `${source.name} ${assetType.name}`,
            url,
            assetType___NODE: assetType.id,
            fileSize,
            product___NODE: source.id,
            format: mime || getFormatFromFileName(realFileName),
            extension: realFileName.split(".").pop()
          };

          return {
            id,
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
        .filter(Boolean);
    }
  }
};
