import {
  Asset,
  Category,
  Classification,
  ClassificationCodeEnum,
  Feature,
  FeatureCodeEnum,
  Image,
  ImageAssetTypesEnum,
  Product,
  VariantOption
} from "../components/types/pim";
import { combineVariantClassifications } from "./filters";
import {
  getProductUrl,
  getSizeLabel,
  TransformedMeasurementValue
} from "./product-details-transforms";

// TODO: need to extract getting the combined categories
export const createSchemaOrgDataForPdpPage = (
  baseProduct: Product,
  variant: VariantOption,
  countryCode: string
) => {
  const classifications: Classification[] = combineVariantClassifications(
    baseProduct,
    variant
  );

  const brand = getBrand(baseProduct);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    award: getProductAssetPropByAssetType(baseProduct, "AWARDS", "name"),
    brand:
      brand && brand.name
        ? {
            "@type": brand["@type"],
            name: brand.name
          }
        : undefined,
    // category: getCategory(baseProduct),
    color: getClassificationFeatureValue(
      classifications,
      ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
      FeatureCodeEnum.COLOUR
    ),
    logo: brand?.logo || undefined,
    material: getClassificationFeatureValue(
      classifications,
      ClassificationCodeEnum.GENERAL_INFORMATION,
      FeatureCodeEnum.MATERIALS
    ),
    potentialAction: getPotentialAction(baseProduct, variant),
    weight: getWeight(classifications),
    width: getWidth(classifications),
    height: getHeight(classifications),
    size: getSize(classifications),
    image: getImage(baseProduct, variant),
    productID: variant.code || undefined,
    pattern: getClassificationFeatureValue(
      classifications,
      ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
      FeatureCodeEnum.TEXTURE_FAMILY
    ),
    model: baseProduct.name || undefined,
    name: baseProduct.name || undefined,
    description:
      variant.longDescription || baseProduct.description || undefined,
    url: getProductUrl(countryCode, variant.path)
  };
};

const getBrand = (baseProduct: Product): Record<string, unknown> => {
  const categories: Category[] = getProductCategoriesByCategoryType(
    baseProduct,
    "Brand"
  );
  if (categories && categories.length === 0) {
    return undefined;
  }
  return {
    "@type": "Brand",
    name: categories[0].name,
    logo: categories[0].image?.url
  };
};

// TODO: What is the desired category here?
// const getCategory = (baseProduct: Product) => {
//   const categories = getProductCategoriesByCategoryType(
//     baseProduct,
//     "Category"
//   );
//   return categories[0];
// };

const getPotentialAction = (baseProduct: Product, variant: VariantOption) => {
  const variantImagesUrls: string[] = getGalleyImages(variant);
  if (variantImagesUrls && variantImagesUrls.length) {
    return {
      "@type": "Action",
      image: variantImagesUrls
    };
  }

  const baseProductImagesUrls: string[] = getGalleyImages(baseProduct);
  if (baseProductImagesUrls && baseProductImagesUrls.length) {
    return {
      "@type": "Action",
      image: baseProductImagesUrls
    };
  }

  return undefined;
};

const getWeight = (classifications: Classification[]) => {
  const [
    weightPerPrice,
    weightGross,
    weightNet,
    weightPerSQM,
    weightPerPallet
  ] = getClassificationFeatures(
    classifications,
    ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
    [
      FeatureCodeEnum.WEIGHT_PER_PRICE,
      FeatureCodeEnum.GROSS_WEIGHT,
      FeatureCodeEnum.NET_WEIGHT,
      FeatureCodeEnum.WEIGHT_PER_SQM,
      FeatureCodeEnum.WEIGHT_PER_PALLET
    ]
  );

  const weight =
    weightPerPrice ||
    weightGross ||
    weightNet ||
    weightPerSQM ||
    weightPerPallet;

  if (!weight) {
    return undefined;
  }
  return {
    "@type": "QuantitativeValue",
    value: weight.featureValues?.[0]?.value,
    valueReference: weight.featureUnit?.symbol
  };
};

const getWidth = (classifications: Classification[]) => {
  const width = getClassificationFeature(
    classifications,
    ClassificationCodeEnum.MEASUREMENTS,
    FeatureCodeEnum.WIDTH
  );
  if (!width) {
    return undefined;
  }
  return {
    "@type": "QuantitativeValue",
    value: width.featureValues?.[0].value,
    valueReference: width.featureUnit?.symbol
  };
};

const getHeight = (classifications: Classification[]) => {
  const height = getClassificationFeature(
    classifications,
    ClassificationCodeEnum.MEASUREMENTS,
    FeatureCodeEnum.HEIGHT
  );
  if (!height) {
    return undefined;
  }
  return {
    "@type": "QuantitativeValue",
    value: height.featureValues?.[0].value,
    valueReference: height.featureUnit?.symbol
  };
};

const getSize = (classifications: Classification[]) => {
  const [length, thickness, width, height] = getClassificationFeatures(
    classifications,
    ClassificationCodeEnum.MEASUREMENTS,
    [
      FeatureCodeEnum.LENGTH,
      FeatureCodeEnum.THICKNESS,
      FeatureCodeEnum.WIDTH,
      FeatureCodeEnum.HEIGHT
    ]
  );
  const transformedMeasurementValue = convertToTransformedMeasurementValue(
    [length, thickness, width, height].filter(Boolean)
  );
  if (
    transformedMeasurementValue &&
    Object.values(transformedMeasurementValue).length
  ) {
    return getSizeLabel(transformedMeasurementValue);
  }

  const volume = getClassificationFeatureValue(
    classifications,
    ClassificationCodeEnum.MEASUREMENTS,
    FeatureCodeEnum.VOLUME
  );
  return volume;
};

const getImage = (baseProduct: Product, variant: VariantOption) => {
  const variantImagesUrls = getMasterImages(variant);
  if (variantImagesUrls && variantImagesUrls.length) {
    return variantImagesUrls[0];
  }

  return getMasterImages(baseProduct)[0];
};

const getProductAssetByAssetType = (
  product: Product,
  assetType: string
): Asset | undefined =>
  product.assets?.find((asset: Asset) => asset.assetType === assetType);

const getProductImagesByAssetType = (
  product: Product | VariantOption,
  assetType: string
): Image[] => {
  return product.images?.filter(
    (image: Image) => image.assetType === assetType
  );
};

const getProductAssetPropByAssetType = (
  product: Product,
  assetType: string,
  prop: string
) =>
  // eslint-disable-next-line security/detect-object-injection
  getProductAssetByAssetType(product, assetType)?.[prop];

const getProductCategoriesByCategoryType = (
  product: Product,
  categoryType: string
): Category[] =>
  product.categories?.filter(
    (category: Category) => category.categoryType === categoryType
  ) || [];

const getMasterImages = (product: Product | VariantOption): string[] => {
  const imagesByAssetType: Image[] = getProductImagesByAssetType(
    product,
    ImageAssetTypesEnum.MASTER_IMAGE
  );
  if (imagesByAssetType && imagesByAssetType.length) {
    return getImagesUrls(imagesByAssetType);
  }
  return [];
};

const getImagesUrls = (imagesByAssetType: Image[]) =>
  imagesByAssetType
    .filter((image) => image.format === null)
    .map((image) => image.url);

const convertToTransformedMeasurementValue = (
  mesurementsFeaturesByClassifications: Feature[]
): TransformedMeasurementValue => {
  return Object.values(mesurementsFeaturesByClassifications).reduce(
    (
      transformedMeasurementValue: TransformedMeasurementValue,
      feature: Feature
    ) => {
      return {
        ...transformedMeasurementValue,
        [feature.name]: {
          name: feature.name,
          value: {
            value: {
              value: feature.featureValues?.[0]?.value
            },
            unit: feature.featureUnit?.symbol
          }
        }
      };
    },
    {}
  );
};

const getClassificationFeatures = (
  classifications: Classification[],
  classificationCode: ClassificationCodeEnum,
  featureCodes: FeatureCodeEnum[]
): Feature[] => {
  const classification: Classification = classifications.find(
    (classification) => classification.code === classificationCode
  );
  return featureCodes.map((featureCode: FeatureCodeEnum) =>
    classification?.features.find((feature: Feature) =>
      feature.code?.endsWith(featureCode)
    )
  );
};

const getClassificationFeature = (
  classifications: Classification[],
  classificationCode: ClassificationCodeEnum,
  featureCode: FeatureCodeEnum
): Feature => {
  const classification: Classification = classifications.find(
    (classification) => classification.code === classificationCode
  );
  const feature: Feature = classification?.features.find((feature: Feature) =>
    feature.code?.endsWith(featureCode)
  );
  return feature;
};

const getClassificationFeatureValue = (
  classifications: Classification[],
  classificationCode: ClassificationCodeEnum,
  featureCode: FeatureCodeEnum
) =>
  getClassificationFeature(classifications, classificationCode, featureCode)
    ?.featureValues[0]?.value;

const getGalleyImages = (product: Product | VariantOption): string[] => {
  const imagesByAssetType: Image[] = getProductImagesByAssetType(
    product,
    ImageAssetTypesEnum.GALLERY
  );
  if (imagesByAssetType && imagesByAssetType.length) {
    return getImagesUrls(imagesByAssetType);
  }
  return [];
};
