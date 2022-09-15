import {
  createProduct as createESProduct,
  Product as ESProduct,
  ProductReference
} from "@bmi/elasticsearch-types";
import { convertStrToBool } from "../../../utils/convertStrToBool";
import groupBy from "../../../utils/groupBy";
import {
  Accessory,
  Data,
  GutterHook,
  GutterVariant,
  LengthBasedProduct,
  lengthBasedProducts,
  multiValueProducts,
  NestedProductReferences,
  ProductType,
  ReferencedTileProducts,
  RidgeOption,
  Tile,
  Underlay,
  VergeOption,
  WidthBasedProduct,
  widthBasedProducts
} from "../types/v2";

// Function overloads to make it working correctly with products of different types
export function transformClassificationAttributes(
  products: ESProduct[],
  productType: ProductType.tile
): Tile[];
export function transformClassificationAttributes(
  products: ESProduct[],
  productType: ProductType.underlay
): Underlay[];
export function transformClassificationAttributes(
  products: ESProduct[],
  productType: ProductType.gutterHook | ProductType.gutter
): Array<GutterHook | GutterVariant>;
export function transformClassificationAttributes(
  products: ESProduct[]
): (RidgeOption | LengthBasedProduct | WidthBasedProduct | Accessory)[];
export function transformClassificationAttributes(
  products: ESProduct[],
  productType?: ProductType
) {
  if (!products) {
    return [];
  }

  return products
    .map((product) => {
      const {
        "APPEARANCEATTRIBUTES.COLOUR": color,
        "GENERALINFORMATION.CLASSIFICATION": category,
        "TILESATTRIBUTES.BROKENBOND": brokenBond,
        "MEASUREMENTS.WIDTH": width,
        "TILESATTRIBUTES.MINIMUMBATTENSPACING": minBattenSpacing,
        "TILESATTRIBUTES.MAXIMUMBATTENSPACING": maxBattenSpacing,
        "TILESATTRIBUTES.RIDGESPACE": ridgeSpacing,
        "TILESATTRIBUTES.EAVEGAUGE": eaveGauge,
        "MEASUREMENTS.LENGTH": length,
        "UNDERLAYATTRIBUTES.OVERLAP": overlap,
        "PACKAGINGINFORMATION.QUANTITYPERUNIT": packSize,
        ...rest
      } = product;

      // Code in catch block will be executed if the value expected to be number isn't a number
      try {
        const initialData = {
          ...rest,
          packSize: Number(packSize?.[0].value) || 1
        };

        if (productType === ProductType.tile) {
          return {
            ...initialData,
            brokenBond: convertStrToBool(brokenBond?.[0].value),
            category: category[0].name,
            color: color[0].name,
            width: convertToCentimeters(width[0]),
            length: convertToCentimeters(length[0]),
            minBattenSpacing: convertToCentimeters(minBattenSpacing[0]),
            maxBattenSpacing: convertToCentimeters(maxBattenSpacing[0]),
            ridgeSpacing: convertToCentimeters(ridgeSpacing[0]),
            eaveGauge: convertToCentimeters(eaveGauge[0])
          };
        }

        if (productType === ProductType.underlay) {
          return {
            ...initialData,
            overlap: convertToCentimeters(overlap[0]),
            width: convertToCentimeters(width[0]),
            length: convertToCentimeters(length[0])
          };
        }

        if (
          productType === ProductType.gutter ||
          productType === ProductType.gutterHook
        ) {
          return {
            ...initialData,
            length: convertToCentimeters(length[0])
          };
        }

        return {
          ...initialData,
          category: category?.[0].name,
          length: convertToCentimeters(length?.[0], false),
          width: convertToCentimeters(width?.[0], false)
        };
      } catch (err) {
        return null;
      }
    })
    .filter(Boolean);
}

export const groupByProductType = (
  products: ESProduct[]
): {
  tiles: Tile[];
  underlays: Underlay[];
  gutters: GutterVariant[];
  gutterHooks: GutterHook[];
} => {
  const groupedProducts = groupBy(
    products,
    (product) => product["GENERALINFORMATION.PRODUCTTYPE"][0].code
  );

  return {
    tiles: transformClassificationAttributes(
      groupedProducts.MAIN_TILE,
      ProductType.tile
    ),
    underlays: transformClassificationAttributes(
      groupedProducts.UNDERLAY,
      ProductType.underlay
    ),
    gutters: transformClassificationAttributes(
      groupedProducts.GUTTER,
      ProductType.gutter
    ),
    gutterHooks: transformClassificationAttributes(
      groupedProducts.GUTTER_HOOK,
      ProductType.gutterHook
    )
  };
};

export const prepareProducts = (products: ESProduct[]): Data => {
  const transformedProducts = groupByProductType(products);

  const groupedTiles = groupBy(
    transformedProducts.tiles,
    (tile) => tile.baseProduct.code
  );

  const groupedGutters = groupBy(
    transformedProducts.gutters,
    (gutter) => gutter.baseProduct.code
  );

  return {
    tiles: groupedTiles,
    gutters: groupedGutters,
    gutterHooks: transformedProducts.gutterHooks,
    underlays: transformedProducts.underlays
  };
};

export const convertToCentimeters = (
  input: {
    value: string;
    code: string;
    name: string;
  },
  throwOnTypeError = true
): number => {
  const numberValue = Number(input?.value);

  if (!numberValue) {
    if (throwOnTypeError) {
      throw new Error("Value is not a number");
    }

    return null;
  }

  const { code, value } = input;

  //cm, mm, m, μm
  const unitOfLength = code.slice(value.length).toLowerCase();
  switch (unitOfLength) {
    case "mm":
      return numberValue / 10;
    case "m":
      return numberValue * 100;
    case "μm":
      return numberValue / 10000;
    default:
      return numberValue;
  }
};

const getProductsByReference = (
  productReferences: ProductReference[],
  products: ESProduct[]
) =>
  productReferences
    .map((productReference) => {
      const product = products.find(
        (product) => product.code === productReference.code
      );

      if (!product) {
        return null;
      }

      const transformedProduct = transformClassificationAttributes([
        product
      ])[0];

      const isLengthBasedProduct = lengthBasedProducts.includes(
        productReference.type
      );
      const isWidthBasedProduct = widthBasedProducts.includes(
        productReference.type
      );

      if (isLengthBasedProduct && !transformedProduct.length) {
        return null;
      }

      if (isWidthBasedProduct && !transformedProduct.width) {
        return null;
      }

      return {
        referenceType: productReference.type,
        product: transformedProduct
      };
    })
    .filter(Boolean);

export const transformProductReferences = <
  T = NestedProductReferences | ReferencedTileProducts
>(
  productReferences: ProductReference[],
  products: ESProduct[],
  fieldsMapper: Record<string, string>
): Partial<T> => {
  const groupedReferencesProducts = getProductsByReference(
    productReferences,
    products
  );
  const references = Object.keys(fieldsMapper);
  return references.reduce((prev, productReference) => {
    const isArray = multiValueProducts.includes(productReference);
    // eslint-disable-next-line security/detect-object-injection
    const key = fieldsMapper[productReference];

    return {
      ...prev,
      [key]: isArray
        ? groupedReferencesProducts
            .filter(({ referenceType }) => referenceType === productReference)
            .map(({ product }) => product)
        : groupedReferencesProducts.find(
            ({ referenceType }) => referenceType === productReference
          )?.product
    };
  }, {});
};

export const getVergeOption = (
  productReferences: Partial<VergeOption>
): VergeOption | undefined => {
  const { left, right, rightStart, leftStart, halfLeft, halfRight } =
    productReferences;
  if (!left || !right) {
    return undefined;
  }

  return {
    left,
    right,
    rightStart,
    leftStart,
    halfLeft,
    halfRight
  };
};

export const createProduct = <T extends ESProduct>(data: Partial<T>): T =>
  ({
    ...createESProduct(),
    ...data
  } as T);
