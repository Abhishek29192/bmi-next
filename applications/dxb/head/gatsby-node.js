"use strict";

// Enables requiring .ts files
require("ts-node").register();

const path = require("path");
const fs = require("fs");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const findUp = require("find-up");
require("graphql-import-node");
const jsonfile = require("jsonfile");
const toml = require("toml");
const { getPathWithCountryCode } = require("./src/utils/path");
const typeDefs = require("./src/schema/schema.graphql");
const resolvers = require("./src/schema/resolvers");
const { createSystemPages } = require("./src/gatsby/systemDetailsPages");

require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`
});

const pimClassificationCatalogueNamespace =
  process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE;

const enableOldPDPUrlRedirects =
  process.env.GATSBY_ENABLE_OLD_PDP_URL_REDIRECTS;

const createProductPages = async (
  siteId,
  countryCode,
  { graphql, actions },
  variantCodeToPathMap
) => {
  if (!pimClassificationCatalogueNamespace) {
    console.warn(
      "createProductPages: You have to provide a PIM_CLASSIFICATION_CATALOGUE_NAMESPACE in your env file"
    );

    return;
  }
  const { createPage, createRedirect } = actions;

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
            path
            oldPath
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
      allProducts: { nodes: products }
    }
  } = result;

  await Promise.all(
    products.map(async (product) => {
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

      await Promise.all(
        (product.variantOptions || []).map(async (variantOption) => {
          variantCodeToPathMap[variantOption.code] = variantOption.path;
          const path = getPathWithCountryCode(countryCode, variantOption.path);

          // market has enabled PDP URL Redirects and
          // OLD and new path are not the same hence write the redirects
          if (
            enableOldPDPUrlRedirects === "true" &&
            (variantOption.oldPath || "") !== (variantOption.path || "")
          ) {
            const oldPath = getPathWithCountryCode(
              countryCode,
              variantOption.oldPath
            );
            console.log(`creating redirect from '${oldPath}' to '${path}'`);
            createRedirect({
              fromPath: oldPath,
              toPath: path,
              isPermanent: true
            });
          }
          await createPage({
            path,
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
        })
      );
    })
  );
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  const componentMap = {
    ContentfulSimplePage: path.resolve("./src/templates/simple-page.tsx"),
    ContentfulHomePage: path.resolve("./src/templates/home-page.tsx"),
    ContentfulContactUsPage: path.resolve(
      "./src/templates/contact-us-page.tsx"
    ),
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
            path
          }
          pages {
            ... on ContentfulPage {
              __typename
              id
              path
              title

              ... on ContentfulProductListerPage {
                categoryCodes
                allowFilterBy
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

  for (const site of sites) {
    // TODO: This is temporary until we'll have the path inside ES.
    const variantCodeToPathMap = {};

    if (!process.env.GATSBY_PREVIEW) {
      await createProductPages(
        site.id,
        site.countryCode,
        { graphql, actions },
        variantCodeToPathMap
      );
    }

    await Promise.all(
      ([site.homePage, ...site.pages] || []).map(async (page) => {
        const component = componentMap[page.__typename];

        if (!component) {
          console.warn(
            "CreatePage: Could not map the page to any component. Make sure you handle the __typename with a template."
          );
          return;
        }

        await createPage({
          // TODO: This removes the extra / for the homepage. The country code
          // could live in the page.path instead.
          path: getPathWithCountryCode(site.countryCode, page.path).replace(
            /\/+/gi,
            "/"
          ),
          component,
          context: {
            pageId: page.id,
            siteId: site.id,
            categoryCodes: page.categoryCodes,
            allowFilterBy: page.allowFilterBy,
            pimClassificationCatalogueNamespace,
            variantCodeToPathMap
          }
        });
      })
    );

    if (process.env.NODE_ENV === "development") {
      const dataFilePath = "./.temp/microCopyKeys.json";

      await createPage({
        path: getPathWithCountryCode(site.countryCode, `global-reources/`),
        component: path.resolve("./src/templates/_global-resources.tsx"),
        context: {
          siteId: site.id,
          micropCopyData: fs.existsSync(path.join(__dirname, dataFilePath))
            ? jsonfile.readFileSync(path.join(__dirname, dataFilePath))
            : null
        }
      });
    }

    await createPage({
      path: getPathWithCountryCode(site.countryCode, `search`),
      component: path.resolve("./src/templates/search-page.tsx"),
      context: {
        siteId: site.id,
        countryCode: site.countryCode,
        pimClassificationCatalogueNamespace,
        variantCodeToPathMap
      }
    });

    await createPage({
      path: getPathWithCountryCode(site.countryCode, `422/`),
      component: path.resolve("./src/templates/general-error.tsx"),
      context: {
        siteId: site.id
      }
    });

    if (process.env.GATSBY_PREVIEW) {
      await createPage({
        path: `/previewer/`,
        component: path.resolve("./src/templates/previewer.tsx"),
        context: {
          siteId: site.id
        }
      });
    }

    if (!process.env.GATSBY_PREVIEW) {
      await createPage({
        path: getPathWithCountryCode(site.countryCode, `sitemap/`),
        component: path.resolve("./src/templates/sitemap.tsx"),
        context: {
          siteId: site.id
        }
      });
    }

    if (process.env.GATSBY_ENABLE_SYSTEM_DETAILS_PAGES === "true") {
      await createSystemPages({
        siteId: site.id,
        countryCode: site.countryCode,
        createPage: actions.createPage,
        graphql
      });
    }
  }

  const redirectsTomlFile = `./redirects_${process.env.SPACE_MARKET_CODE}.toml`;
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (fs.existsSync(redirectsTomlFile)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const redirectsToml = fs.readFileSync(redirectsTomlFile);

    const redirects = toml.parse(redirectsToml);
    redirects.redirects.forEach((redirect) =>
      createRedirect({
        fromPath: redirect.from,
        toPath: redirect.to,
        isPermanent: !redirect.status || redirect.status == "301"
      })
    );
  }
};

const areValuesEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a === "function") {
    return a.toString() === b.toString();
  }
  if (typeof a === "object") {
    if (a instanceof RegExp && b instanceof RegExp) {
      return a.toString() === b.toString();
    }
    return areDeepEqualObjects(a, b);
  }
};

const areDeepEqualObjects = (a, b) =>
  Object.keys(a).length === Object.keys(b).length &&
  Object.keys(a).every((key) => areValuesEqual(a[key], b[key]));

exports.onCreateWebpackConfig = ({ actions, stage, getConfig, rules }) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [
        new TsconfigPathsPlugin({
          configFile: findUp.sync("tsconfig.json")
        })
      ]
    }
  });
  // NOTE: This ignores the order conflict warnings caused by the CSS Modules
  // only when building production.
  if (stage === "build-javascript") {
    const config = getConfig();

    // Find dependencies rule similar to how gatsby-plugin-remove-dependency-transpilation does it
    const dependenciesRuleExample = rules.dependencies();
    // dependencies rule compiles most node_modules files which tend to be already compiled,
    // it excludes  a few popular packages (to speed up the build and reduce the memory consumption),
    // here we remove the rule to avoid overloading the memory.
    // NOTE: if the issue continues and no notable performance imporvments were introduced by gatsby/webpack/babel, consider upgrading the pipeline memory
    // and setting --max_old_space_size to the new limit.
    config.module.rules = config.module.rules.filter(
      (rule) => !areDeepEqualObjects(rule, dependenciesRuleExample)
    );

    const miniCssExtractPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === "MiniCssExtractPlugin"
    );
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
    actions.replaceWebpackConfig(config);
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(typeDefs);
};

exports.createResolvers = ({ createResolvers }) => {
  createResolvers(resolvers);
};
