"use strict";

const path = require("path");
require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`
});

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const homePage = path.resolve("./src/templates/home-page.tsx");
  const simplePage = path.resolve("./src/templates/simple-page.tsx");
  const productListingPage = path.resolve(
    "./src/templates/product-listing-page.tsx"
  );

  const typenameTemplateMap = {
    ContentfulSimplePage: simplePage,
    ContentfulProductListing: productListingPage
  };

  const result = await graphql(`
    {
      allContentfulSite {
        edges {
          node {
            code
            homepage {
              id
            }
            pages {
              __typename
              ... on ContentfulSimplePage {
                id
                slug
              }
              ... on ContentfulProductListing {
                id
                slug
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

  result.data.allContentfulSite.edges.forEach(({ node: site }) => {
    // HOMEPAGE
    if (site.homepage) {
      createPage({
        path: `/${site.code}/`,
        component: homePage,
        context: {
          id: site.homepage.id
        }
      });
    }

    // PAGES
    site.pages.forEach((page) => {
      createPage({
        path: `/${site.code}/${page.slug}`,
        component: typenameTemplateMap[page.__typename],
        context: {
          id: page.id
        }
      });
    });

    // PRODUCT DETAIL PAGES
  });
};
