/* eslint-disable security/detect-object-injection */
import { Filter as FirestoreFilter } from "@bmi/firestore-types";
import { ProductFilter } from "../types/pim";

export interface IndexedItem<T = any> {
  [key: string]: T;
}

export interface IndexedItemGroup<T> {
  [key: string]: T[];
}

export const removePLPFilterPrefix = (filterName: string) => {
  return (filterName || "").replace("filterLabels.", "");
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

export const generateFilters = (
  firestoreFilters: FirestoreFilter[] = [],
  allowedCategoryFilters: Map<string, string[]> = new Map(),
  allowedFeatureFilters: Map<string, string[]> = new Map()
): ProductFilter[] => {
  if (
    !firestoreFilters ||
    (!allowedCategoryFilters && !allowedFeatureFilters)
  ) {
    return [];
  }
  if (
    allowedCategoryFilters &&
    allowedCategoryFilters.size === 0 &&
    allowedFeatureFilters &&
    allowedFeatureFilters.size === 0
  ) {
    return [];
  }

  const eligibleCategories =
    allowedCategoryFilters && allowedCategoryFilters.size > 0
      ? firestoreFilters.filter((firestoreFilter) =>
          allowedCategoryFilters.has(firestoreFilter.filterCode)
        )
      : [];

  const groupedCategories = groupDistinctBy(
    eligibleCategories,
    "filterCode",
    "code"
  );

  const categoryCodeEligibleCategories =
    allowedCategoryFilters && allowedCategoryFilters.size > 0
      ? firestoreFilters.filter((firestoreFilter) =>
          allowedCategoryFilters.has(firestoreFilter.parentFilterCode)
        )
      : [];

  const groupedByParentCategoryCode = groupDistinctBy(
    categoryCodeEligibleCategories,
    "parentFilterCode",
    "code"
  );

  const eligibleFirestoreClassFilters =
    allowedFeatureFilters && allowedFeatureFilters.size > 0
      ? firestoreFilters.filter((firestoreFilter) =>
          allowedFeatureFilters.has(firestoreFilter.filterCode.toLowerCase())
        )
      : [];

  const groupedClassificationFilters = groupDistinctBy(
    eligibleFirestoreClassFilters,
    "filterCode",
    "value"
  );

  const combinedGroupedFirestoreFilterValues = {
    ...groupedClassificationFilters,
    ...groupedCategories,
    ...groupedByParentCategoryCode
  };

  const categoryFilterGroup = Object.keys(combinedGroupedFirestoreFilterValues)
    .filter((key) => key.length > 0)
    .reduce((prevValue, filterNameKey) => {
      const firestoreFilters: FirestoreFilter[] =
        combinedGroupedFirestoreFilterValues[filterNameKey];
      const anyFilterWithGroupLabel = (firestoreFilters || []).find(
        (filter) => (filter.groupLabel || "").length > 0
      );

      // grpLabel : cannot be undefined. it breaks the UI ( matchin checkboxed etc.)
      // TODO: need to see, if we can use name field
      const groupLabel =
        firestoreFilters &&
        firestoreFilters.length &&
        firestoreFilters[0].groupLabel
          ? firestoreFilters[0].groupLabel
          : anyFilterWithGroupLabel?.groupLabel
          ? anyFilterWithGroupLabel.groupLabel
          : `filterLabels.${filterNameKey}`;

      const tryConvertToNumber = (value: string) =>
        parseInt(value.replace(/\D+/gi, ""));

      const getLabel = (firestoreFilter: FirestoreFilter) => {
        if (firestoreFilter.isCategory) {
          return firestoreFilter.name.trim();
        }
        return `${firestoreFilter.value} ${firestoreFilter.unit || ""}`.trim();
      };

      const getSortValue = (firestoreFilter: FirestoreFilter) => {
        const optionSortValue = tryConvertToNumber(firestoreFilter.value);
        if (firestoreFilter.isCategory) {
          return firestoreFilter.name.trim();
        }
        return isNaN(optionSortValue) ? firestoreFilter.value : optionSortValue;
      };

      const getValue = (firestoreFilter: FirestoreFilter) => {
        if (firestoreFilter.isCategory) {
          return `${firestoreFilter.code || ""}`.trim();
        }

        return `${firestoreFilter.code || firestoreFilter.value || ""}${
          firestoreFilter.unit || ""
        }`.trim();
      };

      let allOptions = combinedGroupedFirestoreFilterValues[filterNameKey].map(
        (firestoreFilter) => {
          const filterOption = {
            label: getLabel(firestoreFilter),
            value: getValue(firestoreFilter),
            sortValue: getSortValue(firestoreFilter)
          };
          return filterOption;
        }
      );

      allOptions = Object.values(
        groupBy([...(prevValue["options"] || []), ...allOptions], "value")
      ).flatMap((item) => item[0]);

      if (allOptions.length === 0) return undefined;

      // check if individual options are configured for this category!
      // i.e. if the categoryFilterWithOptiosOnly has this categor?
      const optionsCollection: string[] =
        allowedCategoryFilters.get(filterNameKey) || [];

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
        [filterNameKey]: {
          name: filterNameKey,
          filterCode: filterNameKey,
          label: groupLabel,
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
        } as ProductFilter
      };
    }, {});

  return Object.values(categoryFilterGroup);
};

export const extractAllowedFeatures = (
  allowedFilters: string[]
): Map<string, string[]> => {
  if (!allowedFilters) {
    return new Map();
  }
  const featuresFilters = new Set(
    allowedFilters
      .filter((allowedFilter) => allowedFilter.indexOf(".") > -1)
      .map((allowedFilter) => allowedFilter.toLowerCase())
  );
  const eligibleFeatureFilters = new Map<string, string[]>();
  featuresFilters.forEach((key) => {
    eligibleFeatureFilters.set(key, []);
  });
  return eligibleFeatureFilters;
};

export const extractAllowedCategories = (
  allowedFilters: string[]
): Map<string, string[]> => {
  if (!allowedFilters) {
    return new Map();
  }
  const allowedCategoryFiltersWithoutPipe = new Set(
    allowedFilters
      .filter(
        (allowedFilter) =>
          allowedFilter.indexOf("|") === -1 && allowedFilter.indexOf(".") === -1
      )
      .map((filter) => filter)
  );

  const exclusiveAllowedFilterWithPipe = new Set(
    allowedFilters
      .filter(
        (allowedFilter) =>
          allowedFilter.indexOf("|") > -1 &&
          !allowedCategoryFiltersWithoutPipe.has(
            allowedFilter.split("|")[0].trim()
          )
      )
      .map((allowedFilter) => allowedFilter)
  );

  const eligibleFilterCategories = new Map<string, string[]>();
  exclusiveAllowedFilterWithPipe.forEach((key) => {
    const keyArray = key.split("|");
    const filterKeyName = keyArray[0].trim();
    const filterKeyOptionName = keyArray[1].trim();

    const collection = eligibleFilterCategories.get(filterKeyName) || [];
    eligibleFilterCategories.set(filterKeyName, [
      ...collection,
      filterKeyOptionName
    ]);
  });

  allowedCategoryFiltersWithoutPipe.forEach((categoryWithoutPipe) =>
    eligibleFilterCategories.set(categoryWithoutPipe, [])
  );
  return eligibleFilterCategories;
};
