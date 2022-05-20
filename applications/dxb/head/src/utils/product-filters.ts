/* eslint-disable security/detect-object-injection */
import { Category, Feature, FeatureValue } from "../components/types/pim";

type ProductFilterOption = {
  label: string;
  value: string;
};

export type ProductFilter = {
  label: string;
  name: string;
  options: ProductFilterOption[];
  value?: string[];
};

export interface IndexedItem<T = any> {
  [key: string]: T;
}

export interface IndexedItemGroup<T> {
  [key: string]: T[];
}

export const removePLPFilterPrefix = (filterName: string) => {
  return (filterName || "").replace("plpFilter.", "");
};

export const groupBy = <T extends IndexedItem>(
  array: readonly T[],
  key: keyof T
): IndexedItemGroup<T> => {
  return (array || []).reduce<IndexedItemGroup<T>>((map, item) => {
    const itemKey = item[key];
    map[itemKey] = map[itemKey] || [];
    map[itemKey].push(item);
    return map;
  }, {});
};

export const groupDistinctBy = <T extends IndexedItem>(
  array: readonly T[],
  key: keyof T,
  distinctKey: keyof T
): IndexedItemGroup<T> => {
  return (array || []).reduce<IndexedItemGroup<T>>((map, item) => {
    const itemKey = item[key];
    map[itemKey] = map[itemKey] || [];
    map[itemKey].push(item);

    //remove duplicates by distinct key
    map[itemKey] = map[itemKey].filter(
      (currItem, index, selfArr) =>
        selfArr.findIndex((t) => t[distinctKey] === currItem[distinctKey]) ===
        index
    );
    return map;
  }, {});
};

export const generateCategoryFilters = (
  categories: Category[] = [],
  allowedFilters: string[] = []
): ProductFilter[] => {
  if (allowedFilters.length === 0 || categories.length === 0) return [];

  const uniqueFiltersWithoutPipe = new Set(
    allowedFilters
      .filter((filter) => filter.indexOf("|") === -1)
      .map((filter) => filter)
  );

  const exclusiveFilterWithPipe = new Set(
    allowedFilters
      .filter(
        (allowedFilter) =>
          allowedFilter.indexOf("|") > -1 &&
          !uniqueFiltersWithoutPipe.has(allowedFilter.split("|")[0].trim())
      )
      .map((filter) => filter)
  );

  const categoryFiltersWithOptionsOnly = new Map();
  exclusiveFilterWithPipe.forEach((key) => {
    const keyArray = key.split("|");
    const filterKeyName = keyArray[0].trim();
    const filterKeyOptionName = keyArray[1].trim();

    const collection = categoryFiltersWithOptionsOnly.get(filterKeyName) || [];
    categoryFiltersWithOptionsOnly.set(filterKeyName, [
      ...collection,
      filterKeyOptionName
    ]);
  });

  const eligibleCategories = categories.filter(
    (category) =>
      uniqueFiltersWithoutPipe.has(category.categoryType) ||
      categoryFiltersWithOptionsOnly.has(category.categoryType)
  );

  const groupedCategories = groupDistinctBy(
    eligibleCategories,
    "categoryType",
    "code"
  );

  const categoryCodeEligibleCategories = categories.filter(
    (category) =>
      uniqueFiltersWithoutPipe.has(category.parentCategoryCode) ||
      categoryFiltersWithOptionsOnly.has(category.parentCategoryCode)
  );
  const groupedByParentCategoryCode = groupDistinctBy(
    categoryCodeEligibleCategories,
    "parentCategoryCode",
    "code"
  );

  const combinedGroupedCategories = {
    ...groupedCategories,
    ...groupedByParentCategoryCode
  };

  const categoryFilterGroup = Object.keys(combinedGroupedCategories)
    .filter((key) => key.length > 0)
    .reduce((prevValue, categoryNameKey) => {
      //first get list of all options from grouped categories
      let allOptions: ProductFilterOption[] = combinedGroupedCategories[
        categoryNameKey
      ]
        .map((category) => ({
          label: category.name,
          value: category.code
        }))
        .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));

      // check if individual options are configured for this category!
      // i.e. if the categoryFilterWithOptiosOnly has this categor?
      const optionsCollection: string[] =
        categoryFiltersWithOptionsOnly.get(categoryNameKey) || [];

      // remove the unwanted options from all optios and keep only the
      // individual options if they are requested!!
      if (optionsCollection.length > 0) {
        allOptions = allOptions.filter((option) =>
          optionsCollection.some((optionValue) => optionValue === option.value)
        );
        //order the options in the order specified in filterOptions
        allOptions.sort((a, b) => {
          return (
            optionsCollection.indexOf(a.value) -
            optionsCollection.indexOf(b.value)
          );
        });
      }
      return {
        ...prevValue,
        [categoryNameKey]: {
          name: `plpFilter.${categoryNameKey}`,
          label: "",
          value: [],
          options: allOptions
        }
      };
    }, {});

  return Object.values(categoryFilterGroup);
};

export const generateFeatureFilters = (
  pimClassificationNamespace: string,
  features: Feature[] = [],
  allowedFilters: string[] = []
): ProductFilter[] => {
  if ((allowedFilters || []).length === 0 || (features || []).length === 0)
    return [];

  const uniqueAllowedFilters = Array.from(
    new Set(allowedFilters.map((filter) => filter.split("|")[0].trim()))
  );

  const groupedFeatures = groupBy(features, "code");

  const featureFilters = Object.keys(groupedFeatures)
    .filter((featureCode) =>
      uniqueAllowedFilters.some(
        (uniqueCode) =>
          // TODO: DXB-3449 - remove toUpperCase when PIM has completed BPN-1055
          uniqueCode.toUpperCase() ===
          (featureCode || "")
            .replace(`${pimClassificationNamespace}/`, "")
            .toUpperCase()
      )
    )
    .map((featureCode) => {
      return groupedFeatures[featureCode].reduce((plpFilter, feature) => {
        const allFeatureValues = [
          ...(plpFilter["featureValues"] || []),
          ...(feature.featureValues || [])
        ].map((featureValue: FeatureValue) => {
          const createfeatureLabel = (item: FeatureValue) =>
            `${item.value} ${feature?.featureUnit?.symbol || ""}`.trim();

          const createOptionValueWithUnit = (item: FeatureValue) =>
            `${item.code || item.value}${
              feature?.featureUnit?.symbol || ""
            }`.trim();

          const tryConvertToNumber = (value: string) =>
            parseInt(`${value}`.replace(/[^0-9]+/gi, ""));
          const optionSortValue = tryConvertToNumber(featureValue.value);
          return {
            label: createfeatureLabel(featureValue),
            value: createOptionValueWithUnit(featureValue),
            sortValue: isNaN(optionSortValue)
              ? featureValue.value
              : optionSortValue
          };
        });
        const groupedFeatureValues = groupBy(allFeatureValues, "value");
        const resultValues = Object.values(groupedFeatureValues).flatMap(
          (item) => item[0]
        );

        const allOptions = Object.values(
          groupBy([...(plpFilter["options"] || []), ...resultValues], "value")
        ).flatMap((item) => item[0]);

        if (allOptions.length === 0) return undefined;
        return {
          ...plpFilter,
          label: feature.name,
          // TODO: DXB-3449 - remove toUpperCase when PIM has completed BPN-1055
          name: (feature.code || "")
            .replace(`${pimClassificationNamespace}/`, "")
            .toUpperCase(),
          value: [],
          options: allOptions.sort((a, b) => {
            //sort based on string or number value
            if (
              typeof a.sortValue === "string" ||
              typeof b.sortValue === "string"
            ) {
              return a.sortValue > b.sortValue ? 1 : -1;
            }
            return a.sortValue - b.sortValue;
          })
        };
      }, {});
    });

  return (featureFilters as ProductFilter[]).filter(Boolean);
};
