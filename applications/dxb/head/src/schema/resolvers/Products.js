"use strict";

const { find, flatten } = require("lodash");
const {
  generateIdFromString,
  generateDigestFromData
} = require("../../utils/encryption");
const { combineVariantClassifications } = require("../../utils/filters");
const {
  getFormatFromFileName,
  isPimLinkDocument
} = require("./utils/documents");

const { resolvePath, getUrlFromPath } = require("./utils/path");

const getSlugAttributes = (source) => {
  if (!source.classifications || !source.classifications.length) {
    return [];
  }

  return flatten(
    ["colour", "texturefamily"].map((attribute) => {
      return (source.classifications || [])
        .map(({ features }) => {
          const feature = find(
            features,
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
    })
  );
};

const getSlug = (string) => string.toLowerCase().replace(/[-_\s]+/gi, "-");

const resolvePathFromFamily = async (source, args, context) => {
  const parentFamilies = await context.nodeModel.runQuery({
    query: {
      filter: {
        categoryCodes: {
          in: (source.categories || []).map(({ code }) => code)
        }
      }
    },
    type: "ContentfulProductListerPage"
  });

  if (!parentFamilies.length) {
    return [];
  }

  return resolvePath(parentFamilies[0], args, context);
};

const getSimpleUrlStructure = (source, variant, id) => {
  const productName = variant.name || source.name;
  const classifications = combineVariantClassifications(source, variant);
  const featuresCodesForUrlParams = {
    appearanceAttributes: ["colour", "texturefamily"],
    generalInformation: ["materials"]
  };

  const classificationsPath = classifications.reduce(
    (urlFromClassifications, classification) => {
      const featuresCodes = featuresCodesForUrlParams[classification.code];
      if (featuresCodes) {
        const urlParamsFromClassificationFeatures = featuresCodes.reduce(
          (urlFromFeatures, featuresCode) => {
            const featureByFeatureCode = classification.features.find(
              (feature) =>
                feature.code.toLocaleLowerCase().endsWith(featuresCode)
            );
            if (featureByFeatureCode) {
              const featureValue = featureByFeatureCode.featureValues[0].value;
              urlFromFeatures.push(featureValue);
            }
            return urlFromFeatures;
          },
          []
        );
        urlFromClassifications.push(...urlParamsFromClassificationFeatures);
      }
      return urlFromClassifications;
    },
    []
  );
  return [productName, ...classificationsPath, id]
    .join("-")
    .replace(/\s+/g, "-")
    .replace("*", "")
    .replace('"', "")
    .toLowerCase();
};

module.exports = {
  variantOptions: {
    async resolve(source, args, context) {
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
                ? `p/${getSimpleUrlStructure(source, variant, id)}`
                : oldPath,
            oldPath,
            breadcrumbs
          };
        });
    }
  },
  documents: {
    type: ["ProductDocument"],
    async resolve(source, args, context) {
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
          const assetType = find(assetTypes, { pimCode: asset.assetType });

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
