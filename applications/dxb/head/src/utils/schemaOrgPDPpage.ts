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
  getSizeLabel,
  TransformedMeasurementValue
} from "./product-details-transforms";
import {
  AttributeCodeMap,
  getClassificationFeaturesByFeatureCodes
} from "./product-url-path";

export interface ProductData {
  type: SchemaOrgFieldsEnum;
  variant?: VariantOption;
  baseProduct?: Product;
  classifications?: Classification[];
}

export enum SchemaOrgFieldsEnum {
  CONTEXT = "@context",
  TYPE = "@type",
  AWARD = "award",
  BRAND = "brand",
  CATEGORY = "category",
  COLOR = "color",
  LOGO = "logo",
  MATERIAL = "material",
  POTENTIAL_ACTION = "potentialAction",
  WEIGHT = "weight",
  WIDTH = "width",
  HEIGHT = "height",
  SIZE = "size",
  IMAGE = "image",
  PRODUCT_ID = "productID",
  PATTERN = "patternt",
  MODEL = "model",
  PRODUCT_GROUP = "ProductGroup",
  HAS_VARIANT = "hasVariant",
  NAME = "name",
  DESCRIPTION = "description",
  URL = "url"
}

export const schemaOrgConfigForPdpPage: SchemaOrgFieldsEnum[] = [
  SchemaOrgFieldsEnum.CONTEXT,
  SchemaOrgFieldsEnum.TYPE,
  SchemaOrgFieldsEnum.AWARD,
  SchemaOrgFieldsEnum.BRAND,
  SchemaOrgFieldsEnum.CATEGORY,
  SchemaOrgFieldsEnum.COLOR,
  SchemaOrgFieldsEnum.LOGO,
  SchemaOrgFieldsEnum.MATERIAL,
  SchemaOrgFieldsEnum.POTENTIAL_ACTION,
  SchemaOrgFieldsEnum.WEIGHT,
  SchemaOrgFieldsEnum.WIDTH,
  SchemaOrgFieldsEnum.HEIGHT,
  SchemaOrgFieldsEnum.SIZE,
  SchemaOrgFieldsEnum.IMAGE,
  SchemaOrgFieldsEnum.PRODUCT_ID,
  SchemaOrgFieldsEnum.PATTERN,
  SchemaOrgFieldsEnum.MODEL,
  SchemaOrgFieldsEnum.PRODUCT_GROUP,
  SchemaOrgFieldsEnum.HAS_VARIANT,
  SchemaOrgFieldsEnum.NAME,
  SchemaOrgFieldsEnum.DESCRIPTION,
  SchemaOrgFieldsEnum.URL
];

export const createSchemaOrgDataForPdpPage = (
  fieldsConfig: SchemaOrgFieldsEnum[] = [],
  baseProduct: Product,
  variant: VariantOption
): Record<string, unknown> => {
  const classifications: Classification[] = combineVariantClassifications(
    baseProduct,
    variant
  );
  return fieldsConfig.reduce(
    (acc: Record<string, unknown>, schemaOrgKey: SchemaOrgFieldsEnum) => {
      return {
        ...acc,
        ...createSchemaOrgDataFields[schemaOrgKey]({
          baseProduct,
          variant,
          classifications,
          type: schemaOrgKey
        })
      };
    },
    {}
  );
};

export const getSchemaOrgContextData = ({
  type
}: ProductData): Record<string, unknown> => ({
  [type]: "https://schema.org"
});

export const getSchemaOrgTypeData = ({
  type
}: ProductData): Record<string, unknown> => ({
  [type]: "Product"
});

export const getSchemaOrgAwardData = ({
  type,
  baseProduct
}: ProductData): Record<string, string | undefined> => {
  const productAwardsAssetName: string | undefined =
    getProductAssetPropByAssetType(baseProduct, "AWARDS", "name");
  if (productAwardsAssetName) {
    return {
      [type]: productAwardsAssetName
    };
  }
  return {};
};

export const getSchemaOrgBrandData = ({
  type,
  baseProduct
}: ProductData): Record<string, unknown> => {
  const category: Category = getProductCategoriesByCategoryType(
    baseProduct,
    "Brand"
  )[0];
  const productBrandCategoryName: string | Record<string, unknown> | undefined =
    getProductCategoryPropByCategoryType(category, "name");
  if (productBrandCategoryName) {
    return {
      [type]: {
        ["@type"]: "Brand",
        name: productBrandCategoryName
      }
    };
  }
  return {};
};

export const getSchemaOrgCategoryData = ({
  type,
  baseProduct
}: ProductData): Record<string, unknown> => {
  const categories: Category[] = getProductCategoriesByCategoryType(
    baseProduct,
    "Category"
  );
  const categoriesNames: string[] = Array.from(
    categories.reduce((acc: Set<string>, category: Category) => {
      const name: string | Record<string, unknown> | undefined =
        getProductCategoryPropByCategoryType(category, "name");
      if (typeof name === "string") {
        acc.add(name);
      }
      return acc;
    }, new Set<string>())
  );

  if (categoriesNames && categoriesNames.length) {
    return {
      [type]: categoriesNames.length > 1 ? categoriesNames : categoriesNames[0]
    };
  }
  return {};
};

export const getSchemaOrgColorData = ({
  type,
  classifications
}: ProductData): Record<string, unknown> => {
  const colorAttributeCodeMap: AttributeCodeMap = {
    [ClassificationCodeEnum.APPEARANCE_ATTRIBUTE]: [
      { attrName: FeatureCodeEnum.COLOUR }
    ]
  };
  const featureByClassifications: { [key in FeatureCodeEnum]?: Feature } =
    getClassificationFeaturesByFeatureCodes(
      classifications,
      colorAttributeCodeMap
    );
  const featureValue = getFeatureValueByType(
    featureByClassifications,
    FeatureCodeEnum.COLOUR
  );
  if (featureValue) {
    return {
      [type]: featureValue
    };
  }
  return {};
};

export const getSchemaOrgBrandLogoData = ({
  type,
  baseProduct
}: ProductData): Record<string, unknown> => {
  const productBrandCategory: Category = getProductCategoriesByCategoryType(
    baseProduct,
    "Brand"
  )[0];
  if (productBrandCategory) {
    const productBrandCategoryImage: Record<string, unknown> =
      getProductCategoryPropByCategoryType(
        productBrandCategory,
        "image"
      ) as Record<string, unknown>;
    if (productBrandCategoryImage && productBrandCategoryImage.url) {
      return {
        [type]: productBrandCategoryImage.url
      };
    }
  }

  return {};
};

export const getSchemaOrgMaterialData = ({
  type,
  classifications
}: ProductData): Record<string, unknown> => {
  const materialsAttributeCodeMap: AttributeCodeMap = {
    [ClassificationCodeEnum.GENERAL_INFORMATION]: [
      { attrName: FeatureCodeEnum.MATERIALS }
    ]
  };
  const featureByClassifications: { [key in FeatureCodeEnum]?: Feature } =
    getClassificationFeaturesByFeatureCodes(
      classifications,
      materialsAttributeCodeMap
    );
  const featureValue = getFeatureValueByType(
    featureByClassifications,
    FeatureCodeEnum.MATERIALS
  );
  if (featureValue) {
    return {
      [type]: featureValue
    };
  }
  return {};
};

export const getSchemaOrgPotentialActionData = ({
  type,
  baseProduct,
  variant
}: ProductData): Record<string, unknown> => {
  const variantImagesUrls: string[] = getGalleyImages(variant);
  if (variantImagesUrls && variantImagesUrls.length) {
    return {
      [type]: variantImagesUrls
    };
  }

  const baseProductImagesUrls: string[] = getGalleyImages(baseProduct);
  if (baseProductImagesUrls && baseProductImagesUrls.length) {
    return {
      [type]: baseProductImagesUrls
    };
  }

  return {};
};

export const getSchemaOrgWeightData = ({
  type,
  classifications
}: ProductData): Record<string, unknown> => {
  const typeValue = "QuantitativeValue";
  const weightValuesPriorityArray: FeatureCodeEnum[] = [
    FeatureCodeEnum.WEIGHT_PER_PRICE,
    FeatureCodeEnum.GROSS_WEIGHT,
    FeatureCodeEnum.NET_WEIGHT,
    FeatureCodeEnum.WEIGHT_PER_SQM,
    FeatureCodeEnum.WEIGHT_PER_PALLET
  ];
  const weightAttributeCodeMap: AttributeCodeMap = {
    [ClassificationCodeEnum.WEIGHT_ATTRIBUTES]: [
      { attrName: FeatureCodeEnum.WEIGHT_PER_PRICE },
      { attrName: FeatureCodeEnum.GROSS_WEIGHT },
      { attrName: FeatureCodeEnum.NET_WEIGHT },
      { attrName: FeatureCodeEnum.WEIGHT_PER_SQM },
      { attrName: FeatureCodeEnum.WEIGHT_PER_PALLET }
    ]
  };
  const featureByClassifications: { [key in FeatureCodeEnum]?: Feature } =
    getClassificationFeaturesByFeatureCodes(
      classifications,
      weightAttributeCodeMap
    );
  if (Object.keys(featureByClassifications).length) {
    const featureClassificationPriority: {
      [key in FeatureCodeEnum]?: Feature;
    } = getFeatureClassificationByPriority(
      featureByClassifications,
      weightValuesPriorityArray
    );

    const featureValue = getFeatureValueByType(
      featureClassificationPriority,
      Object.keys(featureClassificationPriority)[0] as FeatureCodeEnum
    );
    const featureUnit = getFeatureUnitByType(
      featureClassificationPriority,
      Object.keys(featureClassificationPriority)[0] as FeatureCodeEnum
    );
    if (featureValue && featureUnit) {
      return {
        [type]: {
          ["@type"]: typeValue,
          value: featureValue,
          valueReference: featureUnit
        }
      };
    } else if (featureValue) {
      return {
        [type]: {
          ["@type"]: typeValue,
          value: featureValue
        }
      };
    } else if (featureUnit) {
      return {
        [type]: {
          ["@type"]: typeValue,
          valueReference: featureUnit
        }
      };
    }
  }
  return {};
};

export const getSchemaOrgWidthData = ({
  type,
  classifications
}: ProductData): Record<string, unknown> => {
  const typeValue = "QuantitativeValue";
  const widthAttributeCodeMap: AttributeCodeMap = {
    [ClassificationCodeEnum.MEASUREMENTS]: [{ attrName: FeatureCodeEnum.WIDTH }]
  };
  const featureByClassifications: { [key in FeatureCodeEnum]?: Feature } =
    getClassificationFeaturesByFeatureCodes(
      classifications,
      widthAttributeCodeMap
    );
  const featureValue = getFeatureValueByType(
    featureByClassifications,
    FeatureCodeEnum.WIDTH
  );
  const featureUnit = getFeatureUnitByType(
    featureByClassifications,
    FeatureCodeEnum.WIDTH
  );
  if (featureValue && featureUnit) {
    return {
      [type]: {
        ["@type"]: typeValue,
        value: featureValue,
        valueReference: featureUnit
      }
    };
  } else if (featureValue) {
    return {
      [type]: {
        ["@type"]: typeValue,
        value: featureValue
      }
    };
  } else if (featureUnit) {
    return {
      [type]: {
        ["@type"]: typeValue,
        valueReference: featureUnit
      }
    };
  }
  return {};
};

export const getSchemaOrgHeightData = ({
  type,
  classifications
}: ProductData): Record<string, unknown> => {
  const typeValue = "QuantitativeValue";
  const heightAttributeCodeMap: AttributeCodeMap = {
    [ClassificationCodeEnum.MEASUREMENTS]: [
      { attrName: FeatureCodeEnum.HEIGHT }
    ]
  };
  const featureByClassifications: { [key in FeatureCodeEnum]?: Feature } =
    getClassificationFeaturesByFeatureCodes(
      classifications,
      heightAttributeCodeMap
    );
  const featureValue = getFeatureValueByType(
    featureByClassifications,
    FeatureCodeEnum.HEIGHT
  );
  const featureUnit = getFeatureUnitByType(
    featureByClassifications,
    FeatureCodeEnum.HEIGHT
  );
  if (featureValue && featureUnit) {
    return {
      [type]: {
        ["@type"]: typeValue,
        value: featureValue,
        valueReference: featureUnit
      }
    };
  } else if (featureValue) {
    return {
      [type]: {
        ["@type"]: typeValue,
        value: featureValue
      }
    };
  } else if (featureUnit) {
    return {
      [type]: {
        ["@type"]: typeValue,
        valueReference: featureUnit
      }
    };
  }
  return {};
};

export const getSchemaOrgSizeData = ({
  type,
  classifications
}: ProductData): Record<string, unknown> => {
  const mesurementsAttributeCodeMap: AttributeCodeMap = {
    [ClassificationCodeEnum.MEASUREMENTS]: [
      { attrName: FeatureCodeEnum.HEIGHT },
      { attrName: FeatureCodeEnum.WIDTH },
      { attrName: FeatureCodeEnum.LENGTH }
    ]
  };
  const mesurementsFeaturesByClassifications: {
    [key in FeatureCodeEnum]?: Feature;
  } = getClassificationFeaturesByFeatureCodes(
    classifications,
    mesurementsAttributeCodeMap
  );
  const transformedMeasurementValue: TransformedMeasurementValue =
    mesurementsAdapter(mesurementsFeaturesByClassifications);
  const sizeLabel: string = getSizeLabel(transformedMeasurementValue);

  if (sizeLabel) {
    return {
      [type]: sizeLabel
    };
  }

  const sizeAttributeCodeMap: AttributeCodeMap = {
    [ClassificationCodeEnum.MEASUREMENTS]: [
      { attrName: FeatureCodeEnum.VOLUME }
    ]
  };
  const featureByClassifications: { [key in FeatureCodeEnum]?: Feature } =
    getClassificationFeaturesByFeatureCodes(
      classifications,
      sizeAttributeCodeMap
    );
  const featureValue = getFeatureValueByType(
    featureByClassifications,
    FeatureCodeEnum.VOLUME
  );
  if (featureValue) {
    return {
      [type]: featureValue
    };
  }
  return {};
};

export const getSchemaOrgImageData = ({
  type,
  baseProduct,
  variant
}: ProductData): Record<string, unknown> => {
  const variantImagesUrls: string[] = getMasterImages(variant);
  if (variantImagesUrls && variantImagesUrls.length) {
    return {
      [type]:
        variantImagesUrls.length > 1 ? variantImagesUrls : variantImagesUrls[0]
    };
  }

  const baseProductImagesUrls: string[] = getMasterImages(baseProduct);
  if (baseProductImagesUrls && baseProductImagesUrls.length) {
    return {
      [type]:
        baseProductImagesUrls.length > 1
          ? baseProductImagesUrls
          : baseProductImagesUrls[0]
    };
  }

  return {};
};

export const getSchemaOrgProductIdData = ({
  type,
  variant
}: ProductData): Record<string, unknown> => {
  const productID: string = variant.code;
  if (productID) {
    return {
      [type]: productID
    };
  }

  return {};
};

export const getSchemaOrgPatternData = ({
  type,
  classifications
}: ProductData): Record<string, unknown> => {
  const materialsAttributeCodeMap: AttributeCodeMap = {
    [ClassificationCodeEnum.APPEARANCE_ATTRIBUTE]: [
      { attrName: FeatureCodeEnum.TEXTURE_FAMILY }
    ]
  };
  const featureByClassifications: { [key in FeatureCodeEnum]?: Feature } =
    getClassificationFeaturesByFeatureCodes(
      classifications,
      materialsAttributeCodeMap
    );
  const featureValue = getFeatureValueByType(
    featureByClassifications,
    FeatureCodeEnum.TEXTURE_FAMILY
  );
  if (featureValue) {
    return {
      [type]: featureValue
    };
  }
  return {};
};

export const getSchemaOrgModelData = ({
  type,
  baseProduct
}: ProductData): Record<string, unknown> => {
  const model: string = baseProduct.name;
  if (model) {
    return {
      [type]: model
    };
  }

  return {};
};

export const getSchemaOrgProductGroupData = ({
  type,
  baseProduct
}: ProductData): Record<string, unknown> => {
  const productGroup: string = baseProduct.code;
  if (productGroup) {
    return {
      [type]: productGroup
    };
  }

  return {};
};

export const getSchemaOrgHasVariantData = ({
  type,
  variant
}: ProductData): Record<string, unknown> => {
  const hasVariant: string | undefined = variant.code;
  if (hasVariant) {
    return {
      [type]: hasVariant
    };
  }

  return {};
};

export const getSchemaOrgNameData = ({
  type,
  baseProduct
}: ProductData): Record<string, unknown> => {
  const name: string = baseProduct.name;
  if (name) {
    return {
      [type]: name
    };
  }

  return {};
};

export const getSchemaOrgDescriptionData = ({
  type,
  baseProduct,
  variant
}: ProductData): Record<string, unknown> => {
  const description: string =
    variant.longDescription || baseProduct.description;
  if (description) {
    return {
      [type]: description
    };
  }

  return {};
};

export const getSchemaOrgUrlData = ({
  type
}: ProductData): Record<string, unknown> => {
  const url: string | undefined = window.location && window.location.href;
  if (url) {
    return {
      [type]: url
    };
  }

  return {};
};

export const getProductAssetByAssetType = (
  product: Product,
  assetType: string
): Asset | undefined => {
  return (
    product.assets &&
    product.assets.find((asset: Asset) => asset.assetType === assetType)
  );
};

export const getProductImagesByAssetType = (
  product: Product | VariantOption,
  assetType: string
): Image[] => {
  return (
    product.images &&
    product.images.filter((image: Image) => image.assetType === assetType)
  );
};

export const getProductAssetPropByAssetType = (
  product: Product,
  assetType: string,
  prop: string
): string | undefined => {
  const asset = getProductAssetByAssetType(product, assetType);
  return asset ? asset[prop] : undefined;
};

export const getProductCategoriesByCategoryType = (
  product: Product,
  categoryType: string
): Category[] => {
  return (
    product.categories &&
    product.categories.filter(
      (category: Category) => category.categoryType === categoryType
    )
  );
};

export const getProductCategoryPropByCategoryType = (
  category: Category,
  prop: string
): string | Record<string, unknown> | undefined => {
  return category ? category[prop] : undefined;
};

export const getFeatureValueByType = (
  featureByClassifications: { [key in FeatureCodeEnum]?: Feature },
  type: FeatureCodeEnum
): string | undefined => {
  return featureByClassifications[type]?.featureValues[0]?.value;
};

export const getFeatureUnitByType = (
  featureByClassifications: { [key in FeatureCodeEnum]?: Feature },
  type: FeatureCodeEnum
): string | undefined => {
  return featureByClassifications[type]?.featureUnit?.symbol;
};

export const getGalleyImages = (product: Product | VariantOption): string[] => {
  const imagesByAssetType: Image[] = getProductImagesByAssetType(
    product,
    ImageAssetTypesEnum.GALLERY
  );
  if (imagesByAssetType && imagesByAssetType.length) {
    return getImagesUrls(imagesByAssetType);
  }
  return [];
};

export const getMasterImages = (product: Product | VariantOption): string[] => {
  const imagesByAssetType: Image[] = getProductImagesByAssetType(
    product,
    ImageAssetTypesEnum.MASTER_IMAGE
  );
  if (imagesByAssetType && imagesByAssetType.length) {
    return getImagesUrls(imagesByAssetType);
  }
  return [];
};

export const getImagesUrls = (imagesByAssetType: Image[]): string[] => {
  const imagesByAssetTypeNullFormat: Image[] = imagesByAssetType.filter(
    (image: Image) => image.format === null
  );
  if (imagesByAssetTypeNullFormat && imagesByAssetTypeNullFormat.length) {
    const imagesUrlsByAssetTypeNullFormat: string[] =
      imagesByAssetTypeNullFormat.map((image: Image) => image.url);
    return imagesUrlsByAssetTypeNullFormat;
  }
  return [];
};

export const mesurementsAdapter = (
  mesurementsFeaturesByClassifications: { [key in FeatureCodeEnum]?: Feature }
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
              value: feature.featureValues[0].value
            },
            unit: feature.featureUnit.symbol
          }
        }
      };
    },
    {}
  );
};

export const getFeatureClassificationByPriority = (
  features: { [key in FeatureCodeEnum]?: Feature },
  order: FeatureCodeEnum[]
): { [key in FeatureCodeEnum]?: Feature } => {
  for (let index = 0; index < order.length; index++) {
    const prop = order[index];
    if (features[prop]) {
      return { [prop]: features[prop] };
    }
    continue;
  }
  return {};
};

export const createSchemaOrgDataFields: Record<
  string,
  ({ variant, baseProduct }: ProductData) => Record<string, unknown>
> = {
  [SchemaOrgFieldsEnum.CONTEXT]: getSchemaOrgContextData,
  [SchemaOrgFieldsEnum.TYPE]: getSchemaOrgTypeData,
  [SchemaOrgFieldsEnum.AWARD]: getSchemaOrgAwardData,
  [SchemaOrgFieldsEnum.BRAND]: getSchemaOrgBrandData,
  [SchemaOrgFieldsEnum.CATEGORY]: getSchemaOrgCategoryData,
  [SchemaOrgFieldsEnum.COLOR]: getSchemaOrgColorData,
  [SchemaOrgFieldsEnum.LOGO]: getSchemaOrgBrandLogoData,
  [SchemaOrgFieldsEnum.MATERIAL]: getSchemaOrgMaterialData,
  [SchemaOrgFieldsEnum.POTENTIAL_ACTION]: getSchemaOrgPotentialActionData,
  [SchemaOrgFieldsEnum.WEIGHT]: getSchemaOrgWeightData,
  [SchemaOrgFieldsEnum.WIDTH]: getSchemaOrgWidthData,
  [SchemaOrgFieldsEnum.HEIGHT]: getSchemaOrgHeightData,
  [SchemaOrgFieldsEnum.SIZE]: getSchemaOrgSizeData,
  [SchemaOrgFieldsEnum.IMAGE]: getSchemaOrgImageData,
  [SchemaOrgFieldsEnum.PRODUCT_ID]: getSchemaOrgProductIdData,
  [SchemaOrgFieldsEnum.PATTERN]: getSchemaOrgPatternData,
  [SchemaOrgFieldsEnum.MODEL]: getSchemaOrgModelData,
  [SchemaOrgFieldsEnum.PRODUCT_GROUP]: getSchemaOrgProductGroupData,
  [SchemaOrgFieldsEnum.HAS_VARIANT]: getSchemaOrgHasVariantData,
  [SchemaOrgFieldsEnum.NAME]: getSchemaOrgNameData,
  [SchemaOrgFieldsEnum.DESCRIPTION]: getSchemaOrgDescriptionData,
  [SchemaOrgFieldsEnum.URL]: getSchemaOrgUrlData
};
