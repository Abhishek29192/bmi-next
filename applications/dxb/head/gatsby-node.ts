import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import findUp from "find-up";
import type { GatsbyNode } from "gatsby";
import toml from "toml";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { createSystemPages } from "./src/gatsby/systemDetailsPages";
import resolvers from "./src/schema/resolvers";
import typeDefs from "./src/schema/schema.graphql";
import { getPathWithCountryCode } from "./src/utils/path";

dotenv.config({
  path: `./.env.${process.env.NODE_ENV}`
});

const pimClassificationCatalogueNamespace =
  process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE;

const createProductPages = async (
  siteId,
  countryCode,
  { graphql, actions },
  variantCodeToPathMap
) => {
  const { createPage, createRedirect } = actions;

  const result = await graphql(`
    {
      allProduct {
        nodes {
          __typename
          code
          path
          oldPath
        }
      }
    }
  `);

  if (result.errors) {
    throw new Error(result.errors);
  }

  const {
    data: {
      allProduct: { nodes: products }
    }
  } = result;

  const component = path.resolve("./src/templates/product-details-page.tsx");
  await Promise.all(
    products.map(async (product) => {
      variantCodeToPathMap[product.code] = product.path;
      const path = getPathWithCountryCode(countryCode, product.path);

      // market has enabled PDP URL Redirects and
      // OLD and new path are not the same hence write the redirects
      if (
        process.env.GATSBY_ENABLE_OLD_PDP_URL_REDIRECTS === "true" &&
        (product.oldPath || "") !== (product.path || "")
      ) {
        const oldPath = getPathWithCountryCode(countryCode, product.oldPath);
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
          productCode: product.code,
          siteId: siteId,
          countryCode,
          variantCodeToPathMap
        }
      });
    })
  );
};

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions
}) => {
  const { createPage, createRedirect } = actions;

  const componentMap = {
    ContentfulSimplePage: path.resolve(
      "./src/templates/simplePage/components/simple-page.tsx"
    ),
    ContentfulHomePage: path.resolve("./src/templates/home-page.tsx"),
    ContentfulContactUsPage: path.resolve(
      "./src/templates/contact-us-page.tsx"
    ),
    ContentfulProductListerPage: path.resolve(
      "./src/templates/productListerPage/components/product-lister-page.tsx"
    ),
    ContentfulDocumentLibraryPage: path.resolve(
      "./src/templates/documentLibrary/index.tsx"
    ),
    ContentfulBrandLandingPage: path.resolve(
      "./src/templates/brand-landing-page.tsx"
    )
  };

  const result = await graphql<any, any>(`
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
          // eslint-disable-next-line no-console
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

    await createPage({
      path: getPathWithCountryCode(site.countryCode, `ie-dialog/`),
      component: path.resolve("./src/templates/ie-dialog/index.tsx"),
      context: {
        siteId: site.id
      }
    });
  }

  const redirectsTomlFile = `./redirects_${process.env.SPACE_MARKET_CODE}.toml`;
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (fs.existsSync(redirectsTomlFile)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const redirectsToml = fs.readFileSync(redirectsTomlFile);

    const redirects = toml.parse(redirectsToml.toString());
    await Promise.all(
      redirects.redirects.map((redirect) =>
        createRedirect({
          fromPath: redirect.from,
          toPath: redirect.to,
          isPermanent: !redirect.status || redirect.status === "301"
        })
      )
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
  // eslint-disable-next-line security/detect-object-injection
  Object.keys(a).every((key) => areValuesEqual(a[key], b[key]));

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
  stage,
  getConfig,
  rules
}) => {
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

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    const { createTypes } = actions;
    createTypes(typeDefs);
  };

export const createResolvers: GatsbyNode["createResolvers"] = ({
  createResolvers
}) => {
  createResolvers(resolvers);
};
