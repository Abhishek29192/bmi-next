import React from "react";
import _ from "lodash";
import ColorSwatch from "../components/ColorSwatch";
import { Product, Category } from "../templates/product-details-page";
import {
  findAllCategories,
  mapProductClassifications,
  ProductCategoryTree
} from "./product-details-transforms";

const sortAlphabeticallyBy = (propName) => (a, b) => {
  if (a[propName] < b[propName]) {
    return -1;
  }
  if (a[propName] > b[propName]) {
    return 1;
  }
  return 0;
};

const getProductFamilyFilter = (products: readonly Product[]) => {
  const allFamilyCategories = _.uniqBy(
    products.reduce((allCategories, product) => {
      const productFamilyCategories = (product.categories || []).filter(
        ({ categoryType }) => categoryType === "ProductFamily"
      );

      return [...allCategories, ...productFamilyCategories];
    }, []),
    "code"
  );

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
        ...Object.values(productClassifications).map((classifications: any) => {
          return classifications.colourfamily;
        })
      ];
    }, [])
    .filter(Boolean);

  // Assuming all colours have the same label
  const label = colorFilters[0]?.name;
  const values = _.uniqBy(_.map(colorFilters, "value"), "code");

  return {
    label,
    name: "colour",
    value: [],
    options: values
      .sort(sortAlphabeticallyBy("value"))
      .map(({ code, value }) => ({
        label: (
          <>
            <ColorSwatch colorCode={code} />
            {value}
          </>
        ),
        value: code
      }))
  };
};

// Gets the values of materialfamily classification for the Filters pane
const getTextureFilter = (
  classificationNamespace: string,
  products: readonly Product[]
) => {
  const textures = products
    .reduce((allTextures, product) => {
      const productClassifications = mapProductClassifications(
        product,
        classificationNamespace
      );

      return [
        ...allTextures,
        ...Object.values(productClassifications).map((classifications: any) => {
          return classifications.texturefamily;
        })
      ];
    }, [])
    .filter(Boolean);

  // Assuming all texturefamily classifications have the same label
  const label = textures[0]?.name;
  const values = _.uniqBy(_.map(textures, "value"), "code");

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
    .reduce((filters, [categoryKey, category]) => {
      return [
        ...filters,
        {
          label: category.name,
          name: categoryKey,
          value: [],
          options: category.values
            .sort(sortAlphabeticallyBy("name"))
            .map((category) => ({
              label: category.name,
              value: category.code
            }))
        }
      ];
    }, []);
};

export const getFilters = (
  pageCategory: Category,
  pimClassificationNamespace: string,
  products: readonly Product[]
) => {
  const allCategories = findAllCategories(products);

  return [
    pageCategory.categoryType !== "ProductFamily"
      ? getProductFamilyFilter(products)
      : undefined,
    getColorFilter(pimClassificationNamespace, products),
    getTextureFilter(pimClassificationNamespace, products),
    ...(pageCategory.categoryType !== "Category"
      ? getCategoryFilters(allCategories)
      : [])
  ].filter(Boolean);
};
