import { uniqBy, map } from "lodash";
import { Product, Category } from "../templates/product-details-page";
import { Data as DocumentResultsData } from "../components/DocumentResults";
import { Data as PIMDocumentData } from "../components/PIMDocument";
import { Data as PIMLinkDocumentData } from "../components/PIMLinkDocument";
import {
  findAllCategories,
  mapProductClassifications,
  ProductCategoryTree
} from "./product-details-transforms";

export type ProductFilter = {
  label: string;
  name: string;
  options: ReadonlyArray<{
    label: string;
    value: string;
  }>;
};

export const isPIMDocument = (
  item: DocumentResultsData[0]
): item is PIMDocumentData | PIMLinkDocumentData => {
  return ["PIMDocument", "PIMLinkDocument"].includes(item.__typename);
};

const getProductsFromDocuments = (documents: DocumentResultsData) => {
  return uniqBy(
    documents
      .map((document) => {
        if (isPIMDocument(document)) {
          return document.product;
        }
      })
      .filter(Boolean),
    "code"
  );
};

export const sortAlphabeticallyBy = (propName) => (a, b) => {
  if (a[propName] < b[propName]) {
    return -1;
  }
  if (a[propName] > b[propName]) {
    return 1;
  }
  return 0;
};

export const findPIMDocumentBrandCategory = (
  document: PIMDocumentData | PIMLinkDocumentData
): Category => {
  return (document.product.categories || []).find(
    ({ categoryType }) => categoryType === "Brand"
  );
};

// Returns a Category like object
const getBrandCategoryFromDocuments = (documents: DocumentResultsData) => {
  return uniqBy(
    documents
      .map((document) => {
        if (isPIMDocument(document)) {
          return findPIMDocumentBrandCategory(document);
        }

        // Using single value available in Contentful Document
        return {
          name: document.brand,
          code: document.brand
        };
      })
      .filter(Boolean),
    "code"
    // We might get a result of an empty filter if documents don't have brand
  ).filter(({ name }) => name);
};

export const getAssetTypeFilterFromDocuments = (
  documents: DocumentResultsData
) => {
  // Find Unique assetTypes, they're the same as far as TS is concerned
  const allValues = uniqBy(
    documents.map(({ assetType }) => assetType).filter(Boolean),
    "code"
  );

  if (allValues.length === 0) {
    return;
  }

  return {
    // TODO: Microcopy for label
    label: "Aktivatype",
    name: "contentfulAssetType",
    value: [],
    options: allValues.sort(sortAlphabeticallyBy("name")).map((assetType) => ({
      label: assetType.name,
      value: assetType.code
    }))
  };
};

export const getBrandFilterFromDocuments = (documents: DocumentResultsData) => {
  const allValues = getBrandCategoryFromDocuments(documents);

  if (allValues.length === 0) {
    return;
  }

  return {
    // TODO: Microcopy for label
    label: "Merkevare",
    name: "brand",
    value: [],
    options: allValues
      .sort(sortAlphabeticallyBy("name"))
      .map((brandCategory) => ({
        label: brandCategory.name,
        value: brandCategory.code
      }))
  };
};

export const getProductFamilyFilterFromDocuments = (
  documents: DocumentResultsData
) => {
  return getProductFamilyFilter(getProductsFromDocuments(documents));
};

const getProductFamilyFilter = (
  products: readonly Pick<Product, "categories">[]
) => {
  const allFamilyCategories = uniqBy(
    products.reduce<Category[]>((allCategories, product) => {
      const productFamilyCategories = (product.categories || []).filter(
        ({ categoryType }) => categoryType === "ProductFamily"
      );

      return [...allCategories, ...productFamilyCategories];
    }, []),
    "code"
  );

  if (allFamilyCategories.length === 0) {
    return;
  }

  return {
    // TODO: Microcopy for label
    label: "Produktfamilie",
    name: "productFamily",
    value: [],
    options: allFamilyCategories
      .sort(sortAlphabeticallyBy("name"))
      .map((category) => ({
        label: category.name,
        value: category.code
      }))
  };
};

// Gets the values of colourfamily classification for the Filters pane
const getColorFilter = (
  classificationNamespace: string,
  products: readonly Product[]
) => {
  const colorFilters = products
    .reduce((allColors, product) => {
      const productClassifications = mapProductClassifications(
        product,
        classificationNamespace
      );

      return [
        ...allColors,
        ...Object.values(productClassifications).map((classifications) => {
          return classifications.colourfamily;
        })
      ];
    }, [])
    .filter(Boolean);

  if (colorFilters.length === 0) {
    return;
  }

  // Assuming all colours have the same label
  const label = colorFilters[0]?.name;
  const values = uniqBy(map(colorFilters, "value"), "code");

  return {
    label,
    name: "colour",
    value: [],
    options: values
      .sort(sortAlphabeticallyBy("value"))
      .map(({ code, value }) => ({
        label: value,
        value: code
      }))
  };
};

export const getTextureFilterFromDocuments = (
  classificationNamespace: string,
  documents: DocumentResultsData
) => {
  const products = getProductsFromDocuments(documents);

  return getTextureFilter(classificationNamespace, products);
};

// Gets the values of materialfamily classification for the Filters pane
const getTextureFilter = (
  classificationNamespace: string,
  products: readonly Pick<Product, "code" | "classifications">[]
) => {
  const textures = products
    .reduce((allTextures, product) => {
      const productClassifications = mapProductClassifications(
        product,
        classificationNamespace
      );

      return [
        ...allTextures,
        ...Object.values(productClassifications).map((classifications) => {
          return classifications.texturefamily;
        })
      ];
    }, [])
    .filter(Boolean);

  if (textures.length === 0) {
    return;
  }

  // Assuming all texturefamily classifications have the same label
  const label = textures[0]?.name;
  const values = uniqBy(map(textures, "value"), "code");

  return {
    label,
    name: "texturefamily",
    value: [],
    options: values
      .sort(sortAlphabeticallyBy("value"))
      .map(({ code, value }) => ({
        label: value,
        value: code
      }))
  };
};

const getCategoryFilters = (productCategories: ProductCategoryTree) => {
  return Object.entries(productCategories)
    .sort((a, b) => {
      if (a[1]["name"] < b[1]["name"]) {
        return -1;
      }
      if (a[1]["name"] > b[1]["name"]) {
        return 1;
      }
      return 0;
    })
    .map(([categoryKey, category]) => {
      return {
        label: category.name,
        name: categoryKey,
        value: [],
        options: category.values
          .sort(sortAlphabeticallyBy("name"))
          .map((category) => ({
            label: category.name,
            value: category.code
          }))
      };
    });
};

export const getFilters = (
  pimClassificationNamespace: string,
  products: readonly Product[],
  pageCategory?: Category
) => {
  const allCategories = findAllCategories(products);
  let showProductFamilyFilter = true;
  let showCategoryFilters = true;

  if (pageCategory) {
    showProductFamilyFilter = pageCategory.categoryType !== "ProductFamily";
    showCategoryFilters = pageCategory.categoryType !== "Category";
  }

  return [
    showProductFamilyFilter ? getProductFamilyFilter(products) : undefined,
    getColorFilter(pimClassificationNamespace, products),
    getTextureFilter(pimClassificationNamespace, products),
    ...(showCategoryFilters ? getCategoryFilters(allCategories) : [])
  ].filter(Boolean);
};

// TODO: Nicer way of doing this?
export const updateFilterValue = (
  filters,
  filterName,
  filterValue,
  checked
) => {
  const addToArray = (array, value) => [...array, value];
  const removeFromArray = (array, value) => array.filter((v) => v !== value);
  const getNewValue = (filter, checked, value) => {
    return checked
      ? addToArray(filter.value || [], value)
      : removeFromArray(filter.value || [], value);
  };

  return filters.map((filter) => {
    return {
      ...filter,
      value:
        filter.name === filterName
          ? getNewValue(filter, checked, filterValue)
          : filter.value
    };
  });
};

export const clearFilterValues = (filters) => {
  return filters.map((filter) => ({
    ...filter,
    value: []
  }));
};
