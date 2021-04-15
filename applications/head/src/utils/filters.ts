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

const findPIMProductBrandCategory = (
  product: Pick<Product, "categories">
): Category => {
  return (product.categories || []).find(
    ({ categoryType }) => categoryType === "Brand"
  );
};

export const findPIMDocumentBrandCategory = (
  document: PIMDocumentData | PIMLinkDocumentData
): Category => {
  return findPIMProductBrandCategory(document.product);
};

// Returns a Category like object
const getBrandCategoryFromProducts = (products: readonly Product[]) => {
  return uniqBy(
    products
      .map((product) => {
        return findPIMProductBrandCategory(product);
      })
      .filter(Boolean),
    "code"
    // We might get a result of an empty filter if documents don't have brand
  ).filter(({ name }) => name);
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
    label: "filterLabels.assetType",
    name: "contentfulAssetType",
    value: [],
    options: allValues.sort(sortAlphabeticallyBy("name")).map((assetType) => ({
      label: assetType.name,
      value: assetType.code
    }))
  };
};

const getBrandFilterFromProducts = (products: readonly Product[]) => {
  const allValues = getBrandCategoryFromProducts(products);

  if (allValues.length === 0) {
    return;
  }

  return {
    label: "filterLabels.brand",
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

export const getBrandFilterFromDocuments = (documents: DocumentResultsData) => {
  const allValues = getBrandCategoryFromDocuments(documents);

  if (allValues.length === 0) {
    return;
  }

  return {
    label: "filterLabels.brand",
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
    label: "filterLabels.productFamily",
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

const getProductLineFilter = (
  products: readonly Pick<Product, "categories">[]
) => {
  const allProductLineCategories = uniqBy(
    products.reduce<Category[]>((allCategories, product) => {
      const productLineCategories = (product.categories || []).filter(
        ({ categoryType }) => categoryType === "ProductLine"
      );

      return [...allCategories, ...productLineCategories];
    }, []),
    "code"
  );

  if (allProductLineCategories.length === 0) {
    return;
  }

  return {
    label: "filterLabels.productLine",
    name: "productLine",
    value: [],
    options: allProductLineCategories
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
    label: "filterLabels.colour",
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
    label: "filterLabels.textureFamily",
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

// Gets the values of materialfamily classification for the Filters pane
const getMaterialsFilter = (
  classificationNamespace: string,
  products: readonly Pick<Product, "code" | "classifications">[]
) => {
  const materials = products
    .reduce((allMaterials, product) => {
      const productClassifications = mapProductClassifications(
        product,
        classificationNamespace
      );

      return [
        ...allMaterials,
        ...Object.values(productClassifications).map((classifications) => {
          return classifications.materials;
        })
      ];
    }, [])
    .filter(Boolean);

  if (materials.length === 0) {
    return;
  }

  // Assuming all texturefamily classifications have the same label
  const label = materials[0]?.name;
  const values = uniqBy(map(materials, "value"), "code");

  return {
    label: "filterLabels.materials",
    name: "materials",
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
  pageCategory?: Category,
  showBrandFilter?: boolean
) => {
  const allCategories = findAllCategories(products);

  let showProductFamilyFilter = true;
  let showCategoryFilters = true;
  let showProductLineFilters = true;

  if (pageCategory) {
    showProductFamilyFilter = pageCategory.categoryType !== "ProductFamily";
    showCategoryFilters = pageCategory.categoryType !== "Category";
    showProductLineFilters = pageCategory.categoryType !== "ProductLine";
  }

  return [
    showBrandFilter ? getBrandFilterFromProducts(products) : undefined,
    showProductFamilyFilter ? getProductFamilyFilter(products) : undefined,
    showProductLineFilters ? getProductLineFilter(products) : undefined,
    getColorFilter(pimClassificationNamespace, products),
    getMaterialsFilter(pimClassificationNamespace, products),
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
