import logger from "@bmi-digital/functions-logger";
import { Category } from "@bmi/pim-types";
import { ESIndexObject, groupBy, IndexedItemGroup } from "../CLONE";

export const getCategoryFilters = (categories: readonly Category[]) => {
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
