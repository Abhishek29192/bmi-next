"use strict";

const path = require("path");
const fs = require("fs");
const getCredentialData = require("./src/utils/get-credentials-data");
require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`
});

const contentfulCredentialData = getCredentialData(process.env);

let useCountryCode = true;
if (process.env.GATSBY_DONT_USE_COUNTRY_CODE === "true") {
  useCountryCode = false;
}

const documentsQuery = `{
  allPIMDocument {
    __typename
    id
    title
    url
    fileSize
    format
    extension
    realFileName
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
            fileName
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
  process.env.GATSBY_ES_INDEX_NAME_PAGES && {
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
                // Note: subtitle isn't available for some pages
                subtitle: page.subtitle,
                slug: page.slug,
                path: page.path,
                // only "Page type" tags are relevant to search
                tags: (page.tags || []).filter(
                  ({ type }) => type === "Page type"
                ),
                pageData: JSON.stringify(pageData)
              };
            }
          } catch (error) {
            console.log(`Error getting file from: ${dataJSONPath}`);
            console.log(error);
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
  process.env.GATSBY_ES_INDEX_NAME_DOCUMENTS && {
    query: documentsQuery,
    transformer: ({ data }) => {
      if (!data) {
        throw new Error("No data");
      }

      const { allPIMDocument, allContentfulDocument } = data;

      return [
        ...allPIMDocument.map((item) => ({
          titleAndSize: `${item.title}_${item.fileSize}`,
          ...item
        })),
        ...allContentfulDocument.edges.map(({ node }) => ({
          titleAndSize: `${node.title}_${node.asset.file.details.size}`,
          realFileName: `${node.asset.file.fileName}`,
          ...node
        }))
      ];
    },
    indexName: process.env.GATSBY_ES_INDEX_NAME_DOCUMENTS
  }
].filter(Boolean);

const elasticSearchPlugin =
  process.env.GATSBY_PREVIEW || process.env.DISABLE_ES_INDEXING
    ? []
    : [
        {
          resolve: `@bmi/gatsby-plugin-elasticsearch`,
          options: {
            node: process.env.GATSBY_ES_ENDPOINT,
            auth: {
              username: process.env.ES_ADMIN_USERNAME,
              password: process.env.ES_ADMIN_PASSWORD
            },
            queries,
            chunkSize: 100
          }
        }
      ];

module.exports = {
  siteMetadata: {
    title: `BMI dxb`,
    description: ``,
    author: `bmi`,
    siteUrl: `https://www.bmigroup.com`
  },
  assetPrefix: process.env.GATSBY_ASSET_PREFIX,
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `mockData`,
        path: `${__dirname}/src/data`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `region`,
        path: `${__dirname}/src/countries`
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
      resolve: "@bmi/gatsby-plugin-firestore",
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
          },
          {
            type: "Systems",
            collection: `${process.env.FIRESTORE_ROOT_COLLECTION}/root/systems`,
            map: (doc) => {
              return {
                ...doc
              };
            }
          }
        ]
      }
    },
    ...elasticSearchPlugin,
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true
        }
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        cssLoaderOptions: {
          esModule: false,
          modules: {
            namedExport: false,
            exportLocalsConvention: "asIs",
            localIdentName: "[name]__[local]--[hash:base64:5]"
          }
        }
      }
    },
    `gatsby-plugin-image`,
    // `gatsby-plugin-offline`,
    `gatsby-plugin-remove-serviceworker`,
    {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {
        disable: process.env.NODE_ENV !== "development"
      }
    },
    ...(process.env.SPACE_MARKET_CODE && !process.env.GATSBY_PREVIEW
      ? [
          {
            resolve: "gatsby-plugin-sitemap",
            options: {
              output: useCountryCode
                ? `/${process.env.SPACE_MARKET_CODE}/sitemap.xml`
                : `/sitemap.xml`,
              sitemapSize: 50000
            }
          }
        ]
      : []),
    ...(process.env.SPACE_MARKET_CODE && !process.env.GATSBY_PREVIEW
      ? [
          {
            resolve: "gatsby-plugin-sitemap",
            options: {
              output: useCountryCode
                ? `/${process.env.SPACE_MARKET_CODE}/images.xml`
                : `/images.xml`,
              sitemapSize: 50000,
              query: `
              {
                site {
                  siteMetadata {
                    siteUrl
                  }
                }
                allSitePage {
                  nodes {
                    path
                  }
                }
                allContentfulAsset {
                  nodes {
                    file {
                      url
                    }
                  }
                }
              }`,
              resolveSiteUrl: ({ site }) => site.siteMetadata.siteUrl,
              serialize: ({ allContentfulAsset }) =>
                allContentfulAsset.nodes.map((node) => ({
                  url: `https:${node.file.url}`,
                  changefreq: "daily",
                  priority: 0.7
                }))
            }
          }
        ]
      : []),
    ...(process.env.GOOGLE_TAGMANAGER_ID && !process.env.GATSBY_PREVIEW
      ? [
          {
            resolve: "gatsby-plugin-google-tagmanager",
            options: {
              id: process.env.GOOGLE_TAGMANAGER_ID,
              includeInDevelopment: true,
              defaultDataLayer: {
                platform: "gatsby",
                env: process.env.NODE_ENV
              }
            }
          }
        ]
      : []),
    ...(process.env.GOOGLE_TAGMANAGER_MARKET_MEDIA_ID &&
    !process.env.GATSBY_PREVIEW
      ? [
          {
            resolve: "gatsby-plugin-google-tagmanager",
            options: {
              id: process.env.GOOGLE_TAGMANAGER_MARKET_MEDIA_ID,
              includeInDevelopment: true,
              defaultDataLayer: {
                platform: "gatsby",
                env: process.env.NODE_ENV
              }
            }
          }
        ]
      : []),
    ...(process.env.GATSBY_HUBSPOT_ID && !process.env.GATSBY_PREVIEW
      ? [
          {
            resolve: "gatsby-plugin-hubspot",
            options: {
              trackingCode: process.env.GATSBY_HUBSPOT_ID,
              respectDNT: true,
              productionOnly: false
            }
          }
        ]
      : []),
    ...(process.env.HUBSPOT_API_KEY
      ? [
          {
            resolve: "gatsby-source-hubspot-forms",
            options: {
              apiKey: process.env.HUBSPOT_API_KEY
            }
          }
        ]
      : []),
    ...(process.env.GATSBY_LEADOO_ID && !process.env.GATSBY_PREVIEW
      ? [
          {
            resolve: "@bmi/gatsby-plugin-leadoo",
            options: {
              companyCode: process.env.GATSBY_LEADOO_ID,
              productionOnly: false
            }
          }
        ]
      : []),
    {
      resolve: `gatsby-plugin-gatsby-cloud`,
      options: {
        headers: {
          "/*": [
            `Content-Security-Policy: ${process.env.CONTENT_SECURITY_POLICY}`,
            "X-Frame-Options: DENY",
            `X-Robots-Tag: ${process.env.X_ROBOTS_TAG}`,
            "X-XSS-Protection: 1; mode=block",
            "X-Content-Type-Options: nosniff",
            "Referrer-Policy: strict-origin-when-cross-origin",
            `Access-Control-Allow-Origin: ${process.env.ACCESS_CONTROL_ALLOW_ORIGIN}`
          ]
        }, // option to add more headers. `Link` headers are transformed by the below criteria
        allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
        mergeSecurityHeaders: true, // boolean to turn off the default security headers
        mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers
        mergeCachingHeaders: true, // boolean to turn off the default caching headers
        // eslint-disable-next-line no-unused-vars
        transformHeaders: (headers, path) => headers, // optional transform for manipulating headers under each path (e.g.sorting), etc.
        generateMatchPathRewrites: true // boolean to turn off automatic creation of redirect rules for client only paths
      }
    },
    // Avoid extra memory consumption as these shouldn't be needed on prod
    {
      resolve: "gatsby-plugin-no-sourcemaps"
    }
  ],
  flags: {
    DEV_SSR: false,
    FAST_DEV: true,
    PARALLEL_SOURCING: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
    PRESERVE_WEBPACK_CACHE: true
  }
};
