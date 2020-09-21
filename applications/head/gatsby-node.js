"use strict";

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const findUp = require("find-up");
const path = require("path");
const { withConfigs, styles } = require("@bmi/webpack");

require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`
});

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const componentMap = {
    ContentfulSimplePage: path.resolve("./src/templates/simple-page.tsx"),
    ContentfulHomePage: path.resolve("./src/templates/home-page.tsx"),
    ContentfulContactUsPage: path.resolve(
      "./src/templates/contact-us-page.tsx"
    ),
    ContentfulTeamPage: path.resolve("./src/templates/team-page.tsx")
  };

  const result = await graphql(`
    {
      allContentfulSite {
        nodes {
          id
          countryCode
          pages {
            ... on ContentfulContactUsPage {
              __typename
              id
              slug
            }
            ... on ContentfulSimplePage {
              __typename
              id
              slug
            }
            ... on ContentfulTeamPage {
              __typename
              id
              slug
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
    (site.pages || []).forEach((page) => {
      const component = componentMap[page.__typename];

      if (!component) {
        console.warn(
          "CreatePage: Could not map the page to any component. Make sure you handle the __typename with a template."
        );
        return;
      }

      createPage({
        path: `/${site.countryCode}/${page.slug || ""}`,
        component: component,
        context: {
          pageId: page.id,
          siteId: site.id
        }
      });
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
