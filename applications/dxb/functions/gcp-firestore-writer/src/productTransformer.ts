import type {
  CategoryGroup,
  Classification,
  Filter,
  Product,
  ProductDocument,
  RelatedVariant,
  UnitValue
} from "@bmi/firestore-types";
import {
  AwardAndCertificateAssetType,
  GuaranteesAndWarrantiesAssetType
} from "@bmi/firestore-types";
import type {
  Category as PimCategory,
  Classification as PimClassification,
  Feature,
  Product as PimProduct
} from "@bmi/pim-types";
import { Category } from "@bmi/pim-types";
import {
  generateHashFromString,
  generateUrl,
  getYoutubeId,
  isDefined
} from "@bmi/utils";
import { productIgnorableAttributes } from "./ignorableFeatureCodes";
import {
  filterClassifications,
  getAwardAndCertificateAsset,
  getBim,
  getBrand,
  getGuaranteesAndWarrantiesAsset,
  getScoringWeight,
  groupImages,
  mapClassification,
  mapDocuments,
  mapImages
} from "./transformerUtils";

export const transformProducts = (products: PimProduct[]): Product[] =>
  products
    .flatMap((product) => {
      if (product.approvalStatus !== "approved") {
        return undefined;
      }
      return (product.variantOptions || []).map((variant) => {
        if (variant.approvalStatus !== "approved") {
          return undefined;
        }

        const groupedImages = groupImages([
          ...(variant.images || []),
          ...(product.images || [])
        ]);

        const mergedClassifications = mergeClassifications(
          product.classifications || [],
          variant.classifications || []
        );
        const filteredClassifications = filterClassifications(
          mergedClassifications,
          product.variantOptions!.length === 1
            ? productIgnorableAttributes.concat(
                "appearanceAttributes.colour",
                "appearanceAttributes.texturefamily",
                "appearanceAttributes.colourfamily",
                "appearanceAttributes.variantattribute"
              )
            : productIgnorableAttributes
        );
        const classifications = groupClassifications(filteredClassifications);
        let colour: string | undefined;
        let colourFamily: string | undefined;
        let textureFamily: string | undefined;
        let variantAttribute: string | undefined;
        let materials: string | undefined;
        let length: UnitValue | undefined;
        let width: UnitValue | undefined;
        let height: UnitValue | undefined;
        let thickness: UnitValue | undefined;
        let volume: UnitValue | undefined;
        let grossWeight: UnitValue | undefined;
        let netWeight: UnitValue | undefined;
        let weightPerPallet: UnitValue | undefined;
        let weightPerPiece: UnitValue | undefined;
        let weightPerSqm: UnitValue | undefined;
        mergedClassifications.forEach((classification) => {
          classification.features?.forEach((feature) => {
            const featureCode = feature.code.split("/").pop()!;
            // TODO: Remove upercase checks - DXB-3449
            if (
              featureCode.toUpperCase() ===
              "appearanceAttributes.colour".toUpperCase()
            ) {
              colour = feature.featureValues[0].value;
            } else if (
              featureCode.toUpperCase() ===
              "appearanceAttributes.colourfamily".toUpperCase()
            ) {
              colourFamily = feature.featureValues[0].value;
            } else if (
              featureCode.toUpperCase() ===
              "appearanceAttributes.texturefamily".toUpperCase()
            ) {
              textureFamily = feature.featureValues[0].value;
            } else if (
              featureCode.toUpperCase() ===
              "appearanceAttributes.variantattribute".toUpperCase()
            ) {
              variantAttribute = feature.featureValues[0].value;
            } else if (
              featureCode.toUpperCase() ===
              "generalInformation.materials".toUpperCase()
            ) {
              materials = feature.featureValues[0].value;
            } else if (
              featureCode.toUpperCase() === "measurements.length".toUpperCase()
            ) {
              length = {
                value: feature.featureValues[0].value,
                unit: feature.featureUnit?.symbol || ""
              };
            } else if (
              featureCode.toUpperCase() === "measurements.width".toUpperCase()
            ) {
              width = {
                value: feature.featureValues[0].value,
                unit: feature.featureUnit?.symbol || ""
              };
            } else if (
              featureCode.toUpperCase() === "measurements.height".toUpperCase()
            ) {
              height = {
                value: feature.featureValues[0].value,
                unit: feature.featureUnit?.symbol || ""
              };
            } else if (
              featureCode.toUpperCase() ===
              "measurements.thickness".toUpperCase()
            ) {
              thickness = {
                value: feature.featureValues[0].value,
                unit: feature.featureUnit?.symbol || ""
              };
            } else if (
              featureCode.toUpperCase() === "measurements.volume".toUpperCase()
            ) {
              volume = {
                value: feature.featureValues[0].value,
                unit: feature.featureUnit?.symbol || ""
              };
            } else if (
              featureCode.toUpperCase() ===
              "weightAttributes.grossweight".toUpperCase()
            ) {
              grossWeight = {
                value: feature.featureValues[0].value,
                unit: feature.featureUnit?.symbol || ""
              };
            } else if (
              featureCode.toUpperCase() ===
              "weightAttributes.netweight".toUpperCase()
            ) {
              netWeight = {
                value: feature.featureValues[0].value,
                unit: feature.featureUnit?.symbol || ""
              };
            } else if (
              featureCode.toUpperCase() ===
              "weightAttributes.weightperpallet".toUpperCase()
            ) {
              weightPerPallet = {
                value: feature.featureValues[0].value,
                unit: feature.featureUnit?.symbol || ""
              };
            } else if (
              featureCode.toUpperCase() ===
              "weightAttributes.weightperpiece".toUpperCase()
            ) {
              weightPerPiece = {
                value: feature.featureValues[0].value,
                unit: feature.featureUnit?.symbol || ""
              };
            } else if (
              featureCode.toUpperCase() ===
              "weightAttributes.weightpersqm".toUpperCase()
            ) {
              weightPerSqm = {
                value: feature.featureValues[0].value,
                unit: feature.featureUnit?.symbol || ""
              };
            }
          });
        });
        const hashedCode = generateHashFromString(variant.code, false);
        const name = product.name;

        const transformedProduct: Product = {
          awardsAndCertificateDocuments: getAwardAndCertificateAsset(
            AwardAndCertificateAssetType.Documents,
            product.assets
          ),
          awardsAndCertificateImages: getAwardAndCertificateAsset(
            AwardAndCertificateAssetType.Images,
            product.assets
          ),
          baseCode: product.code,
          baseScoringWeight: getScoringWeight(product.classifications),
          bimIframeUrl: getBim(product.assets)?.url,
          brand: getBrand(product.categories),
          categories: product.categories || [],
          classifications,
          code: variant.code,
          colour,
          colourMicrocopy: getMicroCopy(
            mergedClassifications,
            "appearanceAttributes.colour"
          ),
          colourFamily,
          description: variant.longDescription || product.description,
          documents: mapProductDocuments(product),
          externalProductCode:
            variant.externalProductCode ?? product.externalProductCode,
          filters: getFilters(mergedClassifications, product.categories || []),
          fixingToolIframeUrl: product.assets?.find(
            (asset) => asset.assetType === "FIXING_TOOL"
          )?.url,
          galleryImages: mapImages(groupedImages, "GALLERY"),
          groups: getGroups(product.categories || []),
          guaranteesAndWarrantiesImages: getGuaranteesAndWarrantiesAsset(
            GuaranteesAndWarrantiesAssetType.Images,
            product.assets
          ),
          guaranteesAndWarrantiesLinks: getGuaranteesAndWarrantiesAsset(
            GuaranteesAndWarrantiesAssetType.Links,
            product.assets
          ),
          hashedCode,
          isSampleOrderAllowed:
            process.env.ENABLE_SAMPLE_ORDERING == "true" &&
            (variant.isSampleOrderAllowed ??
              product.isSampleOrderAllowed ??
              false),
          masterImages: mapImages(groupedImages, "MASTER_IMAGE"),
          materials,
          measurements: {
            length,
            width,
            height,
            thickness,
            volume,
            label: getSizeLabel(length, width, height)
          },
          name,
          path: `/p/${generateProductUrl(
            name,
            hashedCode,
            colour,
            materials,
            textureFamily,
            variantAttribute
          )}`,
          productBenefits: variant.productBenefits ?? product.productBenefits,
          relatedVariants: mapRelatedVariants(product, variant.code),
          specificationIframeUrl: product.assets?.find(
            (asset) => asset.assetType === "SPECIFICATION"
          )?.url,
          techDrawings: mapImages(groupedImages, "TECHNICAL_DRAWINGS"),
          textureFamily,
          textureFamilyMicrocopy: getMicroCopy(
            mergedClassifications,
            "appearanceAttributes.texturefamily"
          ),
          variantAttribute,
          videos: (product.assets || [])
            .filter((asset) => asset.assetType === "VIDEO")
            .map((asset) => ({
              title: "",
              label: asset.name,
              subtitle: null,
              previewMedia: null,
              videoRatio: null,
              youtubeId: asset.url ? getYoutubeId(asset.url) : ""
            })),
          weight: {
            grossWeight,
            netWeight,
            weightPerPallet,
            weightPerPiece,
            weightPerSqm
          }
        };
        return transformedProduct;
      });
    })
    .filter(isDefined);

const mergeClassifications = (
  productClassifications: readonly PimClassification[],
  variantClassifications: readonly PimClassification[]
): PimClassification[] => {
  const productClassificationMap = new Map(
    productClassifications.map((classification) => [
      classification.code,
      classification
    ])
  );

  const variantClassificationsMap = new Map(
    variantClassifications.map((classification) => [
      classification.code,
      classification
    ])
  );

  // take all COMMON classifications and Variant ONLY classifications
  // merge their features in such that base features
  // are overwritten by variant features of same classifications
  const mergedClassifications: Map<string, PimClassification> = new Map(
    [...variantClassificationsMap.entries()].map(
      ([key, variantClassification]) => {
        const mergedFeaturesMap: Map<string, Feature> = new Map(
          (variantClassification.features || []).map((feature) => [
            feature.code,
            feature
          ])
        );

        const productFeaturesMap = new Map(
          (productClassificationMap.get(key)?.features || []).map((feature) => [
            feature.code,
            feature
          ])
        );

        // only set the product features which do not exist in variant features!
        productFeaturesMap.forEach((productFeature, key) => {
          if (mergedFeaturesMap.get(key) === undefined) {
            mergedFeaturesMap.set(key, productFeature);
          }
        });
        variantClassification.features = Array.from(mergedFeaturesMap.values());
        return [key, variantClassification];
      }
    )
  );

  // process remaining classifications that exists ONLY in base/product
  // add them to collection at the end
  productClassificationMap.forEach((classification, key) => {
    if (variantClassificationsMap.get(key) === undefined) {
      mergedClassifications.set(key, classification);
    }
  });

  return [...mergedClassifications.values()];
};

const groupClassifications = (
  classifications: readonly PimClassification[]
): Classification[] => {
  return classifications
    .map(mapClassification)
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
};

const getFilters = (
  classifications: readonly PimClassification[],
  categories: readonly PimCategory[]
): Filter[] => {
  const classificationFilters: Filter[] = classifications
    .filter(
      (classification) =>
        // TODO: Remove upercase checks - DXB-3449
        classification.code.toUpperCase() !==
        "scoringWeightAttributes".toUpperCase()
    )
    .flatMap((classification) =>
      (classification.features || []).map((feature) => ({
        filterCode: feature.code.split("/").pop()!,
        name: feature.name,
        value: feature.featureValues[0].value,
        code: feature.featureValues[0].code || "",
        unit: feature.featureUnit?.symbol,
        groupLabel: feature.name,
        parentFilterCode: "",
        isCategory: false
      }))
    );

  const categoryFilters = categories.flatMap((category) => {
    let groupLabel = undefined;
    if (category.parentCategoryCode && category.parentCategoryCode.length > 0) {
      const parentCaegory: PimCategory[] = categories.filter(
        (cat) => cat.code === category.parentCategoryCode
      );
      if (
        parentCaegory &&
        parentCaegory.length &&
        parentCaegory[0].name.length
      ) {
        groupLabel = parentCaegory[0].name;
      }
    }
    const categoryType: Filter = {
      filterCode: category.categoryType,
      name: category.name,
      value: category.code,
      code: category.code,
      parentFilterCode: category.parentCategoryCode || "",
      groupLabel,
      isCategory: true
    };
    return [categoryType].filter(isDefined);
  });
  return [...classificationFilters, ...categoryFilters];
};

const getGroups = (categories: readonly Category[]): CategoryGroup[] => {
  const categoryTypeCategories = categories.filter(
    ({ categoryType }) => categoryType === "Category"
  );
  return categoryTypeCategories
    .filter(({ parentCategoryCode }) => parentCategoryCode === "")
    .map((rootCategory) => {
      let path = [{ label: rootCategory.name, code: rootCategory.code }];
      let currentNode: Category | undefined = rootCategory;

      while (currentNode) {
        currentNode = categories.find(
          ({ parentCategoryCode }) =>
            parentCategoryCode &&
            currentNode &&
            parentCategoryCode === currentNode.code
        );

        if (currentNode) {
          path = [...path, { label: currentNode.name, code: currentNode.code }];
        }
      }

      return path;
    })
    .map((tree) => tree[tree.length - 2]);
};

const generateProductUrl = (
  name: string,
  hashedCode: string,
  colour?: string,
  materials?: string,
  textureFamily?: string,
  variantAttribute?: string
): string => {
  // this is currently feature flagged so that countries can opt-in for 'variant attributes'
  if (
    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL === "true" &&
    variantAttribute
  ) {
    return generateUrl([name, variantAttribute, hashedCode]);
  }

  return generateUrl(
    [name, colour, textureFamily, materials, hashedCode].filter(isDefined)
  );
};

const mapRelatedVariants = (
  product: PimProduct,
  variantCode: string
): RelatedVariant[] =>
  product
    .variantOptions!.filter(
      (variant) =>
        variant.approvalStatus === "approved" && variant.code !== variantCode
    )
    .map((variant) => {
      const classifications = mergeClassifications(
        product.classifications || [],
        variant.classifications || []
      );
      let colour: string | undefined;
      let colourFamily: string | undefined;
      let textureFamily: string | undefined;
      let variantAttribute: string | undefined;
      let materials: string | undefined;
      let length: UnitValue | undefined;
      let width: UnitValue | undefined;
      let height: UnitValue | undefined;
      let thickness: UnitValue | undefined;
      let volume: UnitValue | undefined;
      classifications.forEach((classification) => {
        classification.features!.forEach((feature) => {
          const featureCode = feature.code.split("/").pop()!;
          // TODO: Remove upercase checks - DXB-3449
          if (
            featureCode.toUpperCase() ===
            "appearanceAttributes.colour".toUpperCase()
          ) {
            colour = feature.featureValues[0].value;
          } else if (
            featureCode.toUpperCase() ===
            "appearanceAttributes.colourfamily".toUpperCase()
          ) {
            colourFamily = feature.featureValues[0].value;
          } else if (
            featureCode.toUpperCase() ===
            "appearanceAttributes.texturefamily".toUpperCase()
          ) {
            textureFamily = feature.featureValues[0].value;
          } else if (
            featureCode.toUpperCase() ===
            "appearanceAttributes.variantattribute".toUpperCase()
          ) {
            variantAttribute = feature.featureValues[0].value;
          } else if (
            featureCode.toUpperCase() ===
            "generalInformation.materials".toUpperCase()
          ) {
            materials = feature.featureValues[0].value;
          } else if (
            featureCode.toUpperCase() === "measurements.length".toUpperCase()
          ) {
            length = {
              value: feature.featureValues[0].value,
              unit: feature.featureUnit?.symbol || ""
            };
          } else if (
            featureCode.toUpperCase() === "measurements.width".toUpperCase()
          ) {
            width = {
              value: feature.featureValues[0].value,
              unit: feature.featureUnit?.symbol || ""
            };
          } else if (
            featureCode.toUpperCase() === "measurements.height".toUpperCase()
          ) {
            height = {
              value: feature.featureValues[0].value,
              unit: feature.featureUnit?.symbol || ""
            };
          } else if (
            featureCode.toUpperCase() === "measurements.thickness".toUpperCase()
          ) {
            thickness = {
              value: feature.featureValues[0].value,
              unit: feature.featureUnit?.symbol || ""
            };
          } else if (
            featureCode.toUpperCase() === "measurements.volume".toUpperCase()
          ) {
            volume = {
              value: feature.featureValues[0].value,
              unit: feature.featureUnit?.symbol || ""
            };
          }
        });
      });
      return {
        code: variant.code,
        name: product.name,
        thumbnail: variant.images?.find(
          (image) =>
            image.assetType === "MASTER_IMAGE" &&
            image.format === "Product-Color-Selector-Mobile"
        )?.url,
        colour,
        colourFamily,
        hashedCode: generateHashFromString(variant.code),
        textureFamily,
        materials,
        measurements: {
          length,
          width,
          height,
          thickness,
          volume,
          label: getSizeLabel(length, width, height)
        },
        variantAttribute
      };
    });

const getMicroCopy = (
  classifications: PimClassification[],
  featureCode: string
): string | undefined =>
  classifications
    .map(
      (classification) =>
        (classification.features || []).find(
          (feature) =>
            // TODO: Remove upercase checks - DXB-3449
            feature.code.split("/").pop()!.toUpperCase() ===
            featureCode.toUpperCase()
        )?.name
    )
    .filter(isDefined)[0];

const mapProductDocuments = (product: PimProduct): ProductDocument[] =>
  mapDocuments(product.assets).map((document) => ({
    ...document,
    productBaseCode: product.code,
    productName: product.name,
    productCategories: (product.categories || []).map((category) => ({
      code: category.code,
      parentCategoryCode: category.parentCategoryCode
    }))
  }));

const getSizeLabel = (
  length?: UnitValue,
  width?: UnitValue,
  height?: UnitValue
) => {
  const measurementValues = [length, width, height].filter(isDefined);
  if (measurementValues.length === 0) {
    return "";
  }

  const sameUnit = measurementValues.every(
    (value, i, arr) => value.unit === arr[0].unit
  );
  const unit = sameUnit ? measurementValues[0].unit : "";

  return (
    measurementValues
      .map((unitValue) => unitValue.value + (!sameUnit ? unitValue.unit : ""))
      // Add extra space if units don't match
      .join(sameUnit ? "x" : " x ") + unit
  );
};
