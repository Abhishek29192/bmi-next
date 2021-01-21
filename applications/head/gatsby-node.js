"use strict";

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const findUp = require("find-up");
const path = require("path");
const { withConfigs, styles } = require("@bmi/webpack");
require("graphql-import-node");
const typeDefs = require("./src/schema/schema.graphql");
const resolvers = require("./src/schema/resolvers");
const jsonfile = require("jsonfile");
const fs = require("fs");

require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`
});

const pimClassificationCatalogueNamespace =
  process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE;

const createProductPages = async (
  siteId,
  countryCode,
  { graphql, actions }
) => {
  if (!pimClassificationCatalogueNamespace) {
    console.warn(
      "createProductPages: You have to provide a PIM_CLASSIFICATION_CATALOGUE_NAMESPACE in your env file"
    );

    return;
  }
  const { createPage } = actions;

  const componentMap = {
    Products: path.resolve("./src/templates/product-details-page.tsx")
  };

  const result = await graphql(`
    {
      allProducts {
        nodes {
          __typename
          approvalStatus
          id
          code
          categories {
            categoryType
            code
          }
          variantOptions {
            code
          }
        }
      }
    }
  `);

  // Dasherise product code
  const getSlug = (string) => string.toLowerCase().replace(/[-_\s]+/gi, "-");

  if (result.errors) {
    throw new Error(result.errors);
  }

  const {
    data: {
      allProducts: { nodes: products }
    }
  } = result;

  products.forEach(async (product) => {
    const component = componentMap[product.__typename];

    if (!component) {
      console.warn(
        `CreatePage: Could not map the page to any component. Make sure you handle the __typename [${product.__typename}] with a template.`
      );
      return;
    }

    const productFamilyCode = (
      (product.categories || []).find(({ categoryType }) => {
        return categoryType === "ProductFamily";
      }) || {}
    ).code;

    let relatedProductCodes = [];
    if (productFamilyCode) {
      const result = await graphql(`
      {
        categoryProducts: allProducts(
          filter: {
            categories: { elemMatch: { code: { eq: "${productFamilyCode}" } } }
          }
          ) {
            nodes {
              code
            }
          }
        }
        `);

      if (result.errors) {
        throw new Error(result.errors);
      }

      // TODO: Probably a way of abstracting this into a function
      const {
        data: {
          categoryProducts: { nodes: relatedProducts }
        }
      } = result;

      relatedProductCodes = relatedProducts.map(({ code }) => code);
    }

    (product.variantOptions || []).forEach((variantOption) => {
      createPage({
        path: `/${countryCode}/products/${getSlug(variantOption.code)}`,
        component,
        context: {
          productId: product.id,
          variantCode: variantOption.code,
          siteId: siteId,
          countryCode,
          relatedProductCodes,
          pimClassificationCatalogueNamespace
        }
      });
    });
  });
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const componentMap = {
    ContentfulSimplePage: path.resolve("./src/templates/simple-page.tsx"),
    ContentfulHomePage: path.resolve("./src/templates/home-page.tsx"),
    ContentfulContactUsPage: path.resolve(
      "./src/templates/contact-us-page.tsx"
    ),
    ContentfulTeamPage: path.resolve("./src/templates/team-page.tsx"),
    ContentfulProductListerPage: path.resolve(
      "./src/templates/product-lister-page.tsx"
    ),
    ContentfulDocumentLibraryPage: path.resolve(
      "./src/templates/document-library-page.tsx"
    ),
    ContentfulBrandLandingPage: path.resolve(
      "./src/templates/brand-landing-page.tsx"
    )
  };

  const result = await graphql(`
    {
      allContentfulSite {
        nodes {
          id
          countryCode
          homePage {
            __typename
            id
          }
          pages {
            ... on ContentfulPage {
              __typename
              id
              slug

              ... on ContentfulProductListerPage {
                categoryCode
              }
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw new Error(result.errors);
  }

  const {
    data: {
      allContentfulSite: { nodes: sites }
    }
  } = result;

  sites.forEach((site) => {
    ([site.homePage, ...site.pages] || []).forEach((page) => {
      const component = componentMap[page.__typename];

      if (!component) {
        console.warn(
          "CreatePage: Could not map the page to any component. Make sure you handle the __typename with a template."
        );
        return;
      }

      createPage({
        path: `/${site.countryCode}/${page.slug || ""}`,
        component,
        context: {
          pageId: page.id,
          siteId: site.id,
          categoryCode: page.categoryCode,
          pimClassificationCatalogueNamespace
        }
      });
    });

    createProductPages(site.id, site.countryCode, { graphql, actions });

    if (process.env.NODE_ENV === "development") {
      const dataFilePath = "./.temp/microCopyKeys.json";

      createPage({
        path: `/${site.countryCode}/global-reources`,
        component: path.resolve("./src/templates/_global-resources.tsx"),
        context: {
          siteId: site.id,
          micropCopyData: fs.existsSync(path.join(__dirname, dataFilePath))
            ? jsonfile.readFileSync(path.join(__dirname, dataFilePath))
            : null
        }
      });
    }

    createPage({
      path: `/${site.countryCode}/search`,
      component: path.resolve("./src/templates/search-page.tsx"),
      context: {
        siteId: site.id
      }
    });
  });
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig(
    withConfigs(
      {
        resolve: {
          plugins: [
            new TsconfigPathsPlugin({
              configFile: findUp.sync("tsconfig.json")
            })
          ]
        }
      },
      [styles({ dev: process.env.NODE_ENV === "development" })]
    )
  );
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(typeDefs);
};

exports.createResolvers = ({ createResolvers }) => {
  createResolvers(resolvers);
};
