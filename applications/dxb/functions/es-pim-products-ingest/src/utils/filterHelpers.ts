import logger from "@bmi-digital/functions-logger";
import {
  Category,
  FeatureValue,
  Product as PIMProduct,
  VariantOption
} from "@bmi/pim-types";
import { ESIndexObject, groupBy, IndexedItemGroup } from "../CLONE";

export const getCategoryFilters = (
  categories: readonly Category[]
): IndexedItemGroup<ESIndexObject> => {
  const categoryGroups: IndexedItemGroup<Category> = groupBy(
    categories,
    "categoryType"
  );
  const groupsByParentCategoryCodes: IndexedItemGroup<Category> = groupBy(
    categories,
    "parentCategoryCode"
  );

  const allGroupsOfCategories = {
    ...categoryGroups,
    ...groupsByParentCategoryCodes
  };

  logger.info({
    message: `allGroupsOfCategories: ${allGroupsOfCategories}`
  });

  //TODO: remove `toUpperCase` when case agnostic to be reverted!
  const allCategoriesAsProps: IndexedItemGroup<ESIndexObject> = Object.keys(
    allGroupsOfCategories
  )
    .filter((key) => key.length > 0 && key !== "undefined")
    .reduce((categoryAsProps, catName) => {
      const origialCatName = catName;
      const catNameCapitalised = catName.toUpperCase();
      // eslint-disable-next-line security/detect-object-injection
      const nameAndCodeValues = allGroupsOfCategories[origialCatName].map(
        (cat) => {
          return {
            code: cat.code,
            name: cat.name
          };
        }
      );
      return {
        ...categoryAsProps,
        [catNameCapitalised]: nameAndCodeValues
      };
    }, {});

  return allCategoriesAsProps;
};

export const getClassificationsFilters = (product: PIMProduct) => {
  let classifications = product.classifications
    ? [...product.classifications]
    : [];
  product.variantOptions?.forEach((variant: VariantOption) => {
    if (variant.classifications) {
      classifications = [...classifications, ...variant.classifications];
    }
  });
  const appearanceAttributes = classifications.filter(
    (classification) => classification.code === "appearanceAttributes"
  );
  const listOfFilters = appearanceAttributes.reduce<FeatureValue[]>(
    (filters, appearanceAttribute) => {
      const textureFamily = appearanceAttribute?.features?.find((feature) =>
        feature.code.includes("appearanceAttributes.textureFamily")
      );
      if (textureFamily) {
        filters = [...filters, ...textureFamily.featureValues];
      }

      return filters;
    },
    []
  );
  if (listOfFilters.length) {
    return {
      "APPEARANCEATTRIBUTES.TEXTUREFAMILY": [
        ...new Set(
          listOfFilters.map(({ code, value }) =>
            JSON.stringify({ code, name: value })
          )
        )
      ].map((item) => JSON.parse(item))
    };
  } else return {};
};
