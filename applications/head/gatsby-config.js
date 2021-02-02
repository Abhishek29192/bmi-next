"use strict";

const path = require("path");
const fs = require("fs");
const getCredentialData = require("./src/utils/get-credentials-data");
require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`
});

const contentfulCredentialData = getCredentialData(process.env);

const documentsQuery = `{
  allPIMDocument {
    __typename
    id
    title
    url
    fileSize
    format
    assetType {
      name
      code
      pimCode
    }
  }
  allContentfulDocument {
    edges {
      node {
        __typename
        id
        title
        asset {
          file {
            url
            details {
              size
            }
            contentType
          }
        }
        assetType {
          name
          code
          pimCode
        }
      }
    }
  }
}
`;

const pagePathsQuery = `{
  allSitePage {
    totalCount
    edges {
      node {
        path
      }
    }
  }
}`;

const queries = [
  {
    query: pagePathsQuery,
    transformer: ({ data }) => {
      if (!data) {
        throw new Error("No data");
      }

      return data.allSitePage.edges
        .map(({ node }) => {
          const cacheJSONFilename = node.path.replace(/\//g, "_") + ".json";
          const dataJSONPath = path.resolve(
            __dirname,
            ".cache/json",
            cacheJSONFilename
          );

          try {
            const dataJSON = JSON.parse(fs.readFileSync(dataJSONPath, "utf8"));

            // Ignore contentfulSite as it's global data
            // eslint-disable-next-line no-unused-vars
            const { contentfulSite, ...pageData } =
              (dataJSON && dataJSON.data) || {};

            // Get something that might be the page data.
            // Also acts to specify what pages are handled
            // TODO: helper function to pick first?
            const page =
              pageData.contentfulHomePage ||
              pageData.contentfulProductListerPage ||
              pageData.contentfulTeamPage ||
              pageData.contentfulBrandLandingPage ||
              pageData.contentfulContactUsPage ||
              pageData.contentfulDocumentLibraryPage ||
              pageData.contentfulSimplePage;

            // If not one of the above pages, not indexed
            if (page) {
              // relying on PageInfoFragment
              return {
                __typename: page.__typename,
                title: page.title,
                // Note: subtitle isn't pulled for some pages
                subtitle: page.subtitle,
                slug: page.slug,
                // TODO: filter for only PageType tags?
                tags: page.tags,
                pageData: JSON.stringify(pageData)
              };
            }
          } catch (error) {
            console.log(`Could not find JSON file for: ${cacheJSONFilename}`);
          }
        })
        .filter(Boolean);
    },
    indexName: process.env.GATSBY_ES_INDEX_NAME_PAGES,
    indexConfig: {
      mappings: {
        properties: {
          // Tells ES to treat the stringified JSON as text
          // otherwise it tries to evaluate it
          pageData: {
            type: "text"
          }
        }
      }
    }
  },
  {
    query: documentsQuery,
    transformer: ({ data }) => {
      if (!data) {
        throw new Error("No data");
      }

      const { allPIMDocument, allContentfulDocument } = data;

      return [
        ...allPIMDocument,
        ...allContentfulDocument.edges.map(({ node }) => node)
      ];
    },
    indexName: process.env.GATSBY_ES_INDEX_NAME_DOCUMENTS
  }
];

const elasticSearchPlugin = {
  resolve: `@logilab/gatsby-plugin-elasticsearch`,
  options: {
    node: process.env.GATSBY_ES_ENDPOINT,
    auth: {
      username: process.env.ES_ADMIN_USERNAME,
      password: process.env.ES_ADMIN_PASSWORD
    },
    queries,
    chunkSize: 100
  }
};

module.exports = {
  siteMetadata: {
    title: `BMI dxb`,
    description: ``,
    author: `bmi`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `bmi-starter`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        include_favicon: true,
        cache_busting_mode: `query`,
        icon: `src/images/favicon.png`,
        icons: [
          {
            src: `icons/icon-16x16.png`,
            sizes: `16x16`,
            type: `image/png`
          },
          {
            src: `icons/icon-24x24.png`,
            sizes: `24x24`,
            type: `image/png`
          },
          {
            src: `icons/icon-32x32.png`,
            sizes: `32x32`,
            type: `image/png`
          },
          {
            src: `icons/icon-48x48.png`,
            sizes: `48x48`,
            type: `image/png`
          },
          {
            src: `icons/icon-57x57.png`,
            sizes: `57x57`,
            type: `image/png`
          },
          {
            src: `icons/icon-60x60.png`,
            sizes: `60x60`,
            type: `image/png`
          },
          {
            src: `icons/icon-64x64.png`,
            sizes: `64x64`,
            type: `image/png`
          },
          {
            src: `icons/icon-72x72.png`,
            sizes: `72x72`,
            type: `image/png`
          },
          {
            src: `icons/icon-76x76.png`,
            sizes: `76x76`,
            type: `image/png`
          },
          {
            src: `icons/icon-96x96.png`,
            sizes: `96x96`,
            type: `image/png`
          },
          {
            src: `icons/icon-114x114.png`,
            sizes: `114x114`,
            type: `image/png`
          },
          {
            src: `icons/icon-120x120.png`,
            sizes: `120x120`,
            type: `image/png`
          },
          {
            src: `icons/icon-128x128.png`,
            sizes: `128x128`,
            type: `image/png`
          },
          {
            src: `icons/icon-144x144.png`,
            sizes: `144x144`,
            type: `image/png`
          },
          {
            src: `icons/icon-152x152.png`,
            sizes: `152x152`,
            type: `image/png`
          },
          {
            src: `icons/icon-180x180.png`,
            sizes: `180x180`,
            type: `image/png`
          },
          {
            src: `icons/icon-192x192.png`,
            sizes: `192x192`,
            type: `image/png`
          },
          {
            src: `icons/icon-256x256.png`,
            sizes: `256x256`,
            type: `image/png`
          },
          {
            src: `icons/icon-512x512.png`,
            sizes: `512x512`,
            type: `image/png`
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        // jsxPragma: `jsx`, // defaults to "React"
        allExtensions: true // defaults to false
      }
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /.svg$/
        }
      }
    },
    ...contentfulCredentialData.map(
      ({ spaceId, accessToken, environment }) => ({
        resolve: `gatsby-source-contentful`,
        options: {
          spaceId,
          accessToken,
          environment,
          host: process.env.CONTENT_API_HOST || "cdn.contentful.com"
        }
      })
    ),
    {
      resolve: "gatsby-source-firestore",
      options: {
        credential: {
          type: "service_account",
          project_id: process.env.GCP_PROJECT_ID,
          private_key_id: process.env.FIRESTORE_PRIVATE_KEY_ID,
          private_key: process.env.FIRESTORE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
          client_email: process.env.FIRESTORE_CLIENT_EMAIL,
          client_id: process.env.FIRESTORE_CLIENT_ID,
          auth_uri: process.env.FIRESTORE_AUTH_URI,
          token_uri: process.env.FIRESTORE_TOKEN_URI,
          auth_provider_x509_cert_url:
            process.env.FIRESTORE_AUTH_PROVIDER_X509_CERT_URL,
          client_x509_cert_url: process.env.FIRESTORE_CLIENT_X509_CERT_URL
        },
        // TODO: Can we type these better?
        types: [
          {
            type: "Products",
            collection: `${process.env.FIRESTORE_ROOT_COLLECTION}/root/products`,
            map: (doc) => ({
              // TODO: More explicit data mapping? Any data mapping at all? This is a big complex document.
              // Certain things (the arrays) should be split into collections?
              ...doc
            })
          }
        ]
      }
    },
    // TODO: Disabled while in WIP on other things
    elasticSearchPlugin,
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true
        }
      }
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {
        disable: process.env.NODE_ENV !== "development"
      }
    }
  ]
};
