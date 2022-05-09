import { Filter } from "@bmi/components";
import {
  Product,
  Category,
  VariantOption,
  Classification,
  Feature
} from "../components/types/pim";
import { Data as DocumentResultsData } from "../components/DocumentResults";
import {
  PIMDocumentData,
  PIMDocumentProduct,
  PIMLinkDocumentData
} from "../components/types/PIMDocumentBase";
import { Data as DocumentData } from "../components/Document";
import {
  findAllCategories,
  mapProductClassifications,
  ProductCategoryTree
} from "./product-details-transforms";
import {
  generateCategoryFilters,
  generateFeatureFilters,
  removePLPFilterPrefix,
  ProductFilter
} from "./product-filters";

export type filterOption = ProductFilter & {
  value: string[];
};

export type URLProductFilter = {
  name: string;
  value: string[];
};

export type ResultType = "Simple" | "Technical" | "Card Collection";

export enum ResultTypeEnum {
  Simple = "Simple",
  Technical = "Technical",
  CardCollection = "Card Collection"
}

export type Source = "PIM" | "CMS" | "ALL";

export enum SourceEnum {
  PIM = "PIM",
  CMS = "CMS",
  ALL = "ALL"
}

export const isPIMDocument = (
  item: DocumentResultsData[0]
): item is PIMDocumentData | PIMLinkDocumentData => {
  return ["PIMDocument", "PIMLinkDocument"].includes(item.__typename);
};

export const convertToURLFilters = (
  filters: readonly ProductFilter[]
): URLProductFilter[] => {
  return filters.reduce((carry, { name, value }) => {
    if (value && value.length) {
      carry.push({ name: removePLPFilterPrefix(name), value });
    }
    return carry;
  }, []);
};

const uniqueByCode = (uniqueObjects, object) => {
  uniqueObjects.find((unique) => unique.code === object.code) ||
    uniqueObjects.push(object);
  return uniqueObjects;
};

const getProductsFromDocuments = (
  documents: DocumentResultsData,
  resultsType: ResultType
) => {
  return documents
    .flatMap((document) => {
      if (isPIMDocument(document)) {
        return resultsType === ResultTypeEnum.Simple
          ? document.relatedProducts
          : document.product;
      }
    })
    .filter(Boolean)
    .reduce<PIMDocumentProduct[]>(uniqueByCode, []);
};

export const sortAlphabeticallyBy = (propName) => (a, b) => {
  // eslint-disable-next-line security/detect-object-injection
  if (a[propName] < b[propName]) {
    return -1;
  }
  // eslint-disable-next-line security/detect-object-injection
  if (a[propName] > b[propName]) {
    return 1;
  }
  return 0;
};

const findPIMProductBrandCategories = (
  product: Pick<Product, "categories">
): Category[] => {
  return (product.categories || []).filter(
    ({ categoryType }) => categoryType === "Brand"
  );
};

export const findPIMDocumentBrandCategories = (
  document: PIMDocumentData | PIMLinkDocumentData
): Category[] => {
  return findPIMProductBrandCategories(document.product);
};

// Returns a Category like object
const getBrandCategoryFromProducts = (
  products: readonly Product[]
): Category[] => {
  return (
    products
      .flatMap((product) => {
        return findPIMProductBrandCategories(product);
      })
      .filter(Boolean)
      .reduce<Category[]>(uniqueByCode, [])
      // We might get a result of an empty filter if documents don't have brand
      .filter(({ name }) => name)
  );
};

// Returns a Category like object
const findBrandCategoriesFromDocuments = (documents: DocumentResultsData) => {
  return (
    documents
      .flatMap((document) => {
        if (isPIMDocument(document)) {
          return findPIMDocumentBrandCategories(document);
        }

        // Using single value available in Contentful Document
        return {
          name: document.brand,
          code: document.brand
        };
      })
      .filter(Boolean)
      .reduce<{ name: string; code: string }[]>(uniqueByCode, [])
      // We might get a result of an empty filter if documents don't have brand
      .filter(({ name }) => name)
  );
};

export const getAssetTypeFilterFromDocuments = (
  documents: DocumentResultsData
) => {
  // Find Unique assetTypes, they're the same as far as TS is concerned
  const allValues = documents
    .map(({ assetType }) => assetType)
    .filter(Boolean)
    .reduce(uniqueByCode, []);

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
  const allValues = findBrandCategoriesFromDocuments(documents);

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
  documents: DocumentResultsData,
  resultsType: ResultType
) => {
  return getProductFamilyFilter(
    getProductsFromDocuments(documents, resultsType)
  );
};

export const getCategoryCodesFilterFromDocuments = (
  documents: DocumentResultsData,
  allowFilterBy: string[],
  resultsType: ResultType
): ProductFilter[] => {
  const productsFromDocuments = getProductsFromDocuments(
    documents,
    resultsType
  );
  const cagegoryFilters = generateCategoryFilters(
    productsFromDocuments.flatMap((product) => product.categories || []),
    allowFilterBy || []
  );
  return cagegoryFilters.filter((filt) => filt?.options?.length > 0);
};

const getProductFamilyFilter = (
  products: readonly Pick<Product, "categories">[]
) => {
  const allFamilyCategories = products
    .reduce<Category[]>((allCategories, product) => {
      const productFamilyCategories = (product.categories || []).filter(
        ({ categoryType }) => categoryType === "ProductFamily"
      );

      return [...allCategories, ...productFamilyCategories];
    }, [])
    .reduce<Category[]>(uniqueByCode, []);

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
  const allProductLineCategories = products
    .reduce<Category[]>((allCategories, product) => {
      const productLineCategories = (product.categories || []).filter(
        ({ categoryType }) => categoryType === "ProductLine"
      );

      return [...allCategories, ...productLineCategories];
    }, [])
    .reduce<Category[]>(uniqueByCode, []);

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
  const values = colorFilters
    .map((colorFilter) => colorFilter.value)
    .reduce(uniqueByCode, []);

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
  documents: DocumentResultsData,
  resultsType: ResultType
) => {
  const products = getProductsFromDocuments(documents, resultsType);

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
  const values = textures
    .map((texture) => texture.value)
    .reduce(uniqueByCode, []);

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
  const values = materials
    .map((material) => material.value)
    .reduce(uniqueByCode, []);

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

// exporting for test coverage
// since couple of statement/branches are not reached
// in the way its called from "getFilters" function
export const getCategoryFilters = (productCategories: ProductCategoryTree) => {
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

export type PlpFiltersArgs = {
  products: readonly Product[];
  allowedFilters?: string[];
  pimClassificationNamespace?: string;
  pageCategory?: Category;
};

export const combineVariantClassifications = (
  product: Product | Pick<Product, "classifications">,
  variant: VariantOption,
  includeVariantScoringWeight = false
): Classification[] => {
  const mergedClassifications: Map<string, Classification> = new Map();

  const productClassificationMap = new Map(
    (product.classifications || []).map((classification) => [
      classification.code,
      classification
    ])
  );

  // process variant classifications except "scoringWeightAttributes"
  const vairantClassificationsMap = new Map(
    ((variant || {}).classifications || [])
      .filter(
        ({ code }) =>
          includeVariantScoringWeight || code !== "scoringWeightAttributes"
      )
      .map((classification) => [classification.code, classification])
  );

  // take all COMMON classifications and Variant ONLY classifications
  // merge their features in such that base features
  // are overwritten by variant features of same classifications
  vairantClassificationsMap.forEach((variantClassification, key) => {
    const mergedFeaturesMap: Map<string, Feature> = new Map(
      (variantClassification?.features || []).map((feature) => [
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

    //only set the product features which do not exist in variant features!
    productFeaturesMap.forEach((productFeature, key) => {
      if (mergedFeaturesMap.get(key) === undefined) {
        mergedFeaturesMap.set(key, productFeature);
      }
    });
    variantClassification.features = Array.from(mergedFeaturesMap.values());
    mergedClassifications.set(key, variantClassification);
  });

  // process remaining classifications that exists ONLY in base/product
  // add them to collection at the end
  productClassificationMap.forEach((classification, key) => {
    if (vairantClassificationsMap.get(key) === undefined) {
      mergedClassifications.set(key, classification);
    }
  });

  return Array.from(mergedClassifications.values());
};

export const getPlpFilters = ({
  pimClassificationNamespace,
  products = [],
  allowedFilters = []
}: PlpFiltersArgs): ProductFilter[] => {
  if (
    !allowedFilters ||
    !products ||
    allowedFilters.length === 0 ||
    products.length === 0
  )
    return [];

  const cagegoryFilters = generateCategoryFilters(
    products.flatMap((product) => product.categories || []),
    allowedFilters
  );

  const allFeatures = products.flatMap((product) =>
    [
      ...(product.variantOptions || []).flatMap((variant) =>
        combineVariantClassifications(product, variant).flatMap(
          (classification) => classification.features
        )
      )
    ].filter(Boolean)
  );

  const classificationFeaturesFilters = generateFeatureFilters(
    pimClassificationNamespace,
    allFeatures,
    allowedFilters
  );

  const uniqueAllowFilterKeys = Array.from(
    new Set(allowedFilters.map((filter) => filter.split("|")[0].trim()))
  );

  const allFilters = [...cagegoryFilters, ...classificationFeaturesFilters];

  //order them in the `allowFilterBy` specified order
  // category filter names are now  prefixed with 'plpFilter' for Microcopy!
  return uniqueAllowFilterKeys
    .map((uniqueFilter) =>
      allFilters.find(
        ({ name }) =>
          name === uniqueFilter || removePLPFilterPrefix(name) === uniqueFilter
      )
    )
    .filter(Boolean);
};

export const getFilters = (
  pimClassificationNamespace: string,
  products: readonly Product[],
  pageCategory?: Category,
  showBrandFilter?: boolean
) => {
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
    ...(showCategoryFilters
      ? getCategoryFilters(findAllCategories(products))
      : [])
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

export const generateUniqueDocuments = (
  resultsType: ResultType,
  documents: DocumentResultsData
): DocumentResultsData => {
  //JIRA: 2042: this needs to be done only for "Simple" table results
  if (resultsType === ResultTypeEnum.Simple) {
    const allPIMDocuments = Array<PIMDocumentData | PIMLinkDocumentData>();
    const allOtherDocuments = Array<DocumentData>();
    documents.forEach((document) => {
      isPIMDocument(document)
        ? allPIMDocuments.push(document)
        : allOtherDocuments.push(document);
    });

    const uniquePIMDocuments = allPIMDocuments.reduce(
      (uniqueDocuments, document) => {
        const existingDocument = uniqueDocuments.find(
          (unique) =>
            `${unique.title}-${unique.url}` ===
            `${document.title}-${document.url}`
        );

        if (existingDocument) {
          const isProductPresent = existingDocument.relatedProducts.find(
            (product) => product.code === document.product.code
          );

          if (!isProductPresent) {
            const updatedDocument = existingDocument;
            updatedDocument.relatedProducts = [
              ...existingDocument.relatedProducts,
              document.product
            ];
            const indexOfExistingDocument =
              uniqueDocuments.indexOf(existingDocument);
            // eslint-disable-next-line security/detect-object-injection
            uniqueDocuments[indexOfExistingDocument] = updatedDocument;
          }
        } else {
          uniqueDocuments.push({
            ...document,
            relatedProducts: [document.product]
          });
        }
        return uniqueDocuments;
      },
      []
    );
    const uniqueCMSDocuments = allOtherDocuments.reduce(
      (uniqueDocuments, document) => {
        uniqueDocuments.find(
          (unique) =>
            `${unique.asset.file.fileName}` ===
            `${document.asset.file.fileName}`
        ) || uniqueDocuments.push(document);
        return uniqueDocuments;
      },
      []
    );
    return [...uniquePIMDocuments, ...uniqueCMSDocuments];
  }
  return documents;
};

export const getDocumentFilters = (
  documents: DocumentResultsData,
  source: Source,
  resultsType: ResultType,
  classificationNamespace,
  allowFilterBy: string[]
) => {
  // AC1 – view a page that displays PIM documents in a Simple Document table - INVALID

  if (source === SourceEnum.PIM && resultsType === ResultTypeEnum.Simple) {
    return [
      getBrandFilterFromDocuments(documents),
      getProductFamilyFilterFromDocuments(documents, resultsType),
      getTextureFilterFromDocuments(
        classificationNamespace,
        documents,
        resultsType
      ),
      ...getCategoryCodesFilterFromDocuments(
        documents,
        allowFilterBy,
        resultsType
      )
    ].filter(Boolean);
  }

  // AC2 – view a page that displays documents in a Technical Document table
  if (source === SourceEnum.PIM && resultsType === ResultTypeEnum.Technical) {
    return [
      getBrandFilterFromDocuments(documents),
      getProductFamilyFilterFromDocuments(documents, resultsType),
      ...getCategoryCodesFilterFromDocuments(
        documents,
        allowFilterBy,
        resultsType
      )
    ].filter(Boolean);
  }

  // AC3 – view a page that displays documents in a Card Collection
  if (
    source === SourceEnum.CMS &&
    resultsType === ResultTypeEnum.CardCollection
  ) {
    return [getBrandFilterFromDocuments(documents)].filter(Boolean);
  }

  // AC4 – view a page that displays All documents in a Simple Document table
  if (source === SourceEnum.ALL && resultsType === ResultTypeEnum.Simple) {
    return [
      getAssetTypeFilterFromDocuments(documents),
      getBrandFilterFromDocuments(documents),
      getProductFamilyFilterFromDocuments(documents, resultsType),
      ...getCategoryCodesFilterFromDocuments(
        documents,
        allowFilterBy,
        resultsType
      )
    ].filter(Boolean);
  }

  // AC5 – view a page that displays CMS documents in a Simple Document table,
  // more than one Asset Type
  // AC6 – view a page that displays CMS documents in a Simple Document table,
  // only one Asset Type
  if (source === SourceEnum.CMS && resultsType === ResultTypeEnum.Simple) {
    return [
      getBrandFilterFromDocuments(documents),
      // TODO: Should not be there if ONLY ONE OPTION AVAILABLE
      // TODO: Move this responsibility to Filters???
      getAssetTypeFilterFromDocuments(documents),
      ...getCategoryCodesFilterFromDocuments(
        documents,
        allowFilterBy,
        resultsType
      )
    ].filter(Boolean);
  }

  return [];
};

type DocumentResultData = PIMDocumentData | DocumentData | PIMLinkDocumentData;

export const filterDocuments = (
  documents: DocumentResultsData,
  filters: Array<Filter>
): DocumentResultsData => {
  const valueMatcher = {
    brand: (document: DocumentResultData, valuesToMatch: string[]): boolean =>
      isPIMDocument(document)
        ? findPIMDocumentBrandCategories(document).some((brandCategory) =>
            valuesToMatch.includes(brandCategory.code)
          )
        : valuesToMatch.includes(document.brand),
    productFamily: (
      document: DocumentResultData,
      valuesToMatch: string[]
    ): boolean =>
      isPIMDocument(document) &&
      (document.product.categories || [])
        .filter(({ categoryType }) => categoryType === "ProductFamily")
        .some((brandCategory) => valuesToMatch.includes(brandCategory.code)),
    contentfulAssetType: (
      document: DocumentResultData,
      valuesToMatch: string[]
    ): boolean => valuesToMatch.includes(document.assetType.code)
  };

  const filtersWithValues = filters.filter(({ value }) => value.length !== 0);
  //user clears ALL filters then return all documents
  if (filtersWithValues.length === 0) return documents;

  return documents.filter((document) => {
    // only work with the filters that user has checked
    // i.e. filter with values!
    return filtersWithValues.some((filter) => {
      const matcher = valueMatcher[filter.name];
      if (matcher) {
        return matcher(document, filter.value);
      }
      // no specific matchers matched!
      // hence, now try and see if the ANY categories match the selected filter value!
      return isPIMDocument(document)
        ? (document.product.categories || []).some((cat) =>
            filter.value.includes(cat.code)
          )
        : false;
    });
  });
};
