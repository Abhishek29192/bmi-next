import logger from "@bmi-digital/functions-logger";
import {
  AwardAndCertificateAssetType,
  GuaranteesAndWarrantiesAssetType
} from "@bmi/firestore-types";
import {
  ApprovalStatus,
  type Asset,
  type ClassificationWithFeatures,
  type Feature,
  type Category as PimCategory,
  type Classification as PimClassification,
  type Product as PimProduct,
  type VariantOption
} from "@bmi/pim-types";
import {
  generateHashFromString,
  generateUrl,
  getIsApprovedOrDiscontinuedProduct,
  isDefined
} from "@bmi/utils";
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
  productIgnorableAttributes,
  productIgnorableClassfications
} from "./ignorableFeatureCodes.js";
import {
  filterClassifications,
  getAwardAndCertificateAsset,
  getBim,
  getBrand,
  getCategories,
  getGuaranteesAndWarrantiesAsset,
  getScoringWeight,
  getVideoUrl,
  groupImages,
  mapClassification,
  mapDocuments,
  mapImages
} from "./transformerUtils.js";

export const transformProduct = (
  product: PimProduct,
  allowPreviewStatus?: boolean
): Product[] => {
  const isApprovedOrDiscontinuedProduct =
    getIsApprovedOrDiscontinuedProduct(product);
  const isPreviewProduct = product.approvalStatus === ApprovalStatus.Preview;

  const handlePreviewProducts = Boolean(
    allowPreviewStatus && (isApprovedOrDiscontinuedProduct || isPreviewProduct)
  );

  const handleNonPreviewProducts = Boolean(
    product.name && isApprovedOrDiscontinuedProduct
  );

  if (!handlePreviewProducts && !handleNonPreviewProducts) {
    return [];
  }
  const filteredVariants = (product.variantOptions || []).filter((variant) => {
    if (allowPreviewStatus) {
      //If base product status === "preview", will use all variants except of 'check' or 'unapproved' products
      //If bse product status !== preview, will use only variants of 'preview' status
      return isPreviewProduct
        ? variant.approvalStatus !== ApprovalStatus.Check &&
            variant.approvalStatus !== ApprovalStatus.Unapproved
        : variant.approvalStatus === ApprovalStatus.Preview;
    }

    return getIsApprovedOrDiscontinuedProduct(variant);
  });

  return filteredVariants.map((variant) => {
    const groupedImages = groupImages([
      ...(variant.images || []),
      ...(product.images || [])
    ]);

    const mergedClassifications = mergeClassifications(
      product.classifications || [],
      variant.classifications || []
    );

    const additionalIgnoreList = [
      "appearanceAttributes.colour",
      "appearanceAttributes.texturefamily",
      "appearanceAttributes.textureFamily",
      "appearanceAttributes.colourfamily",
      "appearanceAttributes.variantattribute"
    ];
    const filteredClassifications = filterClassifications(
      mergedClassifications,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      product.variantOptions!.length === 1
        ? productIgnorableClassfications.concat(additionalIgnoreList)
        : productIgnorableClassfications
    );
    const classificationsForFilters = filterClassifications(
      mergedClassifications,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      product.variantOptions!.length === 1
        ? productIgnorableAttributes.concat(additionalIgnoreList)
        : productIgnorableAttributes
    );
    logger.info({
      message: `---- filteredClassifications ----`
    });
    logger.info({
      message: `${JSON.stringify(filteredClassifications)}`
    });
    logger.info({
      message: `---- filteredClassifications ----`
    });

    logger.info({
      message: `---- classificationsForFilters ----`
    });
    logger.info({
      message: `${JSON.stringify(classificationsForFilters)}`
    });
    logger.info({
      message: `---- classificationsForFilters ----`
    });
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
    const name = product.name || "";

    product.categories?.forEach((category) => {
      if (!category.name) {
        logger.info({
          message: `Product's category doesn't have a name. Product: ${product.name}, Category Code: ${category.code}`
        });
      }
    });

    if (
      product.approvalStatus === ApprovalStatus.Discontinued &&
      variant.approvalStatus === ApprovalStatus.Approved
    ) {
      variant.approvalStatus = ApprovalStatus.Discontinued;
    }

    const baseProductAndCategoryAssets = [
      ...(product.assets || []),
      ...(variant.categoryAssets || product.categoryAssets || [])
    ];

    const transformedProduct: Product = {
      approvalStatus: allowPreviewStatus
        ? ApprovalStatus.Preview
        : (variant.approvalStatus as
            | ApprovalStatus.Approved
            | ApprovalStatus.Discontinued),
      awardsAndCertificateDocuments: getAwardAndCertificateAsset(
        AwardAndCertificateAssetType.Documents,
        baseProductAndCategoryAssets
      ),
      awardsAndCertificateImages: getAwardAndCertificateAsset(
        AwardAndCertificateAssetType.Images,
        baseProductAndCategoryAssets
      ),
      baseCode: product.code,
      baseScoringWeight: getScoringWeight(product.classifications),
      bimIframeUrl: getBim(baseProductAndCategoryAssets)?.url,
      brand: getBrand(product.categories),
      categories: getCategories(product.categories || []),
      classifications: getClassification(classifications),
      code: variant.code || "",
      colour,
      colourMicrocopy: getMicroCopy(
        mergedClassifications,
        "appearanceAttributes.colour"
      ),
      colourFamily,
      description: variant.longDescription || product.description || "",
      documents: mapProductDocuments(product, variant),
      externalProductCode:
        variant.externalProductCode ?? product.externalProductCode,
      filters: getFilters(classificationsForFilters, product.categories || []),
      fixingToolIframeUrl: baseProductAndCategoryAssets.find(
        (asset) => asset.assetType === "FIXING_TOOL"
      )?.url,
      galleryImages: mapImages(groupedImages, "GALLERY"),
      goodBetterBest: product.goodBetterBest,
      groups: getGroups(product.categories || []),
      guaranteesAndWarrantiesImages: getGuaranteesAndWarrantiesAsset(
        GuaranteesAndWarrantiesAssetType.Images,
        baseProductAndCategoryAssets
      ),
      guaranteesAndWarrantiesLinks: getGuaranteesAndWarrantiesAsset(
        GuaranteesAndWarrantiesAssetType.Links,
        baseProductAndCategoryAssets
      ),
      hashedCode,
      isSampleOrderAllowed:
        process.env.ENABLE_SAMPLE_ORDERING == "true" &&
        (variant.isSampleOrderAllowed ?? product.isSampleOrderAllowed ?? false),
      isVisualiserAvailable: getIsVisualiserAvailable(
        product.categories || [],
        mergedClassifications,
        variant.visualiserAssets || product.visualiserAssets
      ),
      masterImage: mapImages(groupedImages, "MASTER_IMAGE")[0],
      materials,
      measurements: {
        length,
        width,
        height,
        thickness,
        volume,
        label: getSizeLabel(width, length, height, thickness)
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
      relatedVariants: mapRelatedVariants(
        product,
        variant.code,
        handlePreviewProducts
      ),
      specificationIframeUrl: baseProductAndCategoryAssets.find(
        (asset) => asset.assetType === "SPECIFICATION"
      )?.url,
      techDrawings: mapImages(groupedImages, "TECHNICAL_DRAWINGS"),
      textureFamily,
      textureFamilyMicrocopy: getMicroCopy(
        mergedClassifications,
        "appearanceAttributes.texturefamily"
      ),
      variantAttribute,
      videos: baseProductAndCategoryAssets
        .filter((asset) => asset.assetType === "VIDEO")
        .map((asset) => ({
          title: "",
          label: asset.name,
          subtitle: null,
          previewMedia: null,
          videoRatio: null,
          videoUrl: getVideoUrl(asset.url)
        })),
      weight: {
        grossWeight,
        netWeight,
        weightPerPallet,
        weightPerPiece,
        weightPerSqm
      },
      seoTitle: variant.seoTitle || product.seoTitle,
      seoTags: variant.seoTags || product.seoTags,
      seoDescription: variant.seoDescription || product.seoDescription
    };
    return transformedProduct;
  });
};

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
  return classifications.map(mapClassification);
  // .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
};

const getClassification = (
  classification: Classification[]
): Classification[] => {
  if (process.env.ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING !== "true") {
    classification
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((classification) => {
        if (classification.features.length === 1) {
          return classification;
        } else {
          classification?.features.sort((a, b) => {
            return String(a?.name) > String(b?.name)
              ? 1
              : String(a?.name) < String(b?.name)
                ? -1
                : 0;
          });
        }
      });
  }
  return classification;
};

const getFilters = (
  classifications: ClassificationWithFeatures[],
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
      classification.features.map((feature) => ({
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
      const parentCategory: PimCategory[] = categories.filter(
        (cat) => cat.code === category.parentCategoryCode
      );
      if (parentCategory[0]?.name?.length) {
        groupLabel = parentCategory[0].name;
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

export type CategoryWithName = PimCategory & { name: string };

const getGroups = (categories: readonly PimCategory[]): CategoryGroup[] => {
  const categoryTypeCategories = categories.filter(
    ({ categoryType }) => categoryType === "Category"
  );
  return categoryTypeCategories
    .filter((category): category is CategoryWithName =>
      Boolean(category.parentCategoryCode === "" && category.name?.length)
    )
    .map((rootCategory) => {
      let path = [{ label: rootCategory.name, code: rootCategory.code }];
      let currentNode: CategoryWithName | undefined = rootCategory;

      while (currentNode) {
        currentNode = categories.find(
          (category): category is CategoryWithName =>
            Boolean(
              category.parentCategoryCode &&
                currentNode &&
                category.parentCategoryCode === currentNode.code &&
                category.name?.length
            )
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
  variantCode: string,
  allowPreviewProducts: boolean
): RelatedVariant[] =>
  product
    .variantOptions!.filter((variant) => {
      if (variant.code === variantCode) {
        return false;
      }

      if (allowPreviewProducts) {
        return (
          variant.approvalStatus !== ApprovalStatus.Check &&
          variant.approvalStatus !== ApprovalStatus.Unapproved
        );
      }

      return variant.approvalStatus === ApprovalStatus.Approved;
    })
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
      const groupedImages = groupImages([
        ...(variant.images || []),
        ...(product.images || [])
      ]);
      const hashedCode = generateHashFromString(variant.code);
      const name = product.name || "";
      return {
        code: variant.code || "",
        name,
        thumbnail: mapImages(groupedImages, "MASTER_IMAGE")[0]?.thumbnail,
        colour,
        colourFamily,
        hashedCode,
        textureFamily,
        materials,
        measurements: {
          width,
          length,
          height,
          thickness,
          volume,
          label: getSizeLabel(width, length, height, thickness)
        },
        path: `/p/${generateProductUrl(
          name,
          hashedCode,
          colour,
          materials,
          textureFamily,
          variantAttribute
        )}`,
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

const mapProductDocuments = (
  baseProduct: PimProduct,
  variant: VariantOption
): ProductDocument[] => {
  const productCategories = (baseProduct.categories || []).map((category) => ({
    code: category.code,
    parentCategoryCode: category.parentCategoryCode
  }));

  const assets = [
    ...(variant.assets || baseProduct.assets || []),
    ...(variant.categoryAssets || baseProduct.categoryAssets || [])
  ];

  return mapDocuments(assets).map((document) => ({
    ...document,
    productBaseCode: baseProduct.code,
    productName: baseProduct.name || "",
    productCategories
  }));
};

export const getSizeLabel = (
  width?: UnitValue,
  length?: UnitValue,
  height?: UnitValue,
  thickness?: UnitValue
) => {
  const measurementValues = [width, length, height, thickness].filter(
    isDefined
  );
  if (measurementValues.length === 0) {
    return "";
  }

  const sameUnit = measurementValues.every(
    (value, i, arr) => value.unit === arr[0].unit
  );
  const unit = sameUnit ? measurementValues[0].unit : "";

  return (
    measurementValues
      .map((unitValue) => {
        return unitValue.value + (!sameUnit ? unitValue.unit : "");
      })
      // Add extra space if units don't match
      .join(sameUnit ? "x" : " x ") + unit
  );
};

const getIsVisualiserAvailable = (
  categories: readonly PimCategory[],
  mergedClassifications: PimClassification[],
  visualiserAssets?: readonly Asset[]
): boolean => {
  const requiredClassificationFeatures = [
    "tilesAttributes.verticalOverlap",
    "tilesAttributes.horizontalOverlap",
    "tilesAttributes.horizontalOffset",
    "tilesAttributes.snowFenceActive",
    "tilesAttributes.largeTile"
  ];

  const hasChannel = categories.find(
    (category) =>
      category.categoryType === "Channel" && category.code === "VISUALISER"
  );

  if (!hasChannel) {
    return false;
  }

  const hasNeededAssets = hasRequiredVisualiserAssets(visualiserAssets);
  if (!hasNeededAssets) {
    return false;
  }

  const requiredClassifications = mergedClassifications.filter(
    (classification) =>
      classification.code === "generalInformation" || "tilesAttributes"
  );

  const features = requiredClassifications.flatMap(
    (classification) => classification.features || []
  );

  const category = features.find((feature) =>
    feature.code.includes("generalInformation.classification")
  );

  if (
    !category ||
    !["clay", "metal", "concrete"].includes(
      category.featureValues[0].value.toLowerCase()
    )
  ) {
    return false;
  }

  return requiredClassificationFeatures.every((requiredFeature) =>
    features.find(({ code, featureValues }) => {
      const featureCode = code.replace("bmiClassificationCatalog/1.0/", "");

      if (featureCode !== requiredFeature) {
        return false;
      }

      if (
        featureCode === "tilesAttributes.verticalOverlap" ||
        featureCode === "tilesAttributes.horizontalOverlap" ||
        featureCode === "tilesAttributes.horizontalOffset"
      ) {
        return (
          Number(featureValues[0].value) === 0 ||
          Boolean(Number(featureValues[0].value))
        );
      }

      return true;
    })
  );
};

const hasRequiredVisualiserAssets = (
  visualiserAssets?: readonly Asset[]
): boolean => {
  const requiredAssets = [
    "HIGH_DETAIL_MESH_REFERENCE",
    "LOW_DETAIL_MESH_REFERENCE",
    "METALLIC_ROUGHNESS_MAP_REFERENCE",
    "NORMAL_MAP_REFERENCE",
    "DIFFUSE_MAP_REFERENCE",
    "RIDGE_REFERENCE"
  ];

  if (!visualiserAssets) {
    return false;
  }

  return requiredAssets.every((assetType) => {
    return visualiserAssets.find(
      (visualiserAsset) => visualiserAsset.assetType === assetType
    );
  });
};
