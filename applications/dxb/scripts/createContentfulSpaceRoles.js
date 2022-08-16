#!/usr/bin/env node
/**
 * A script to trigger create roles for provided markets in contentful space.
 *
 * To run in Linux/MacOS:
 * ```bash
 * applications/dxb/scripts/createContentfulSpaceRoles.js
 * ```
 *
 * To run in Windows:
 * ```bat
 * node applications\dxb\scripts\createContentfulSpaceRoles.js
 * ```
 *
 * ```powershell
 * node .\applications\dxb\scripts\createContentfulSpaceRoles.js
 * ```
 */
"use strict";

const fetchRetry = require("@bmi/fetch-retry").default;

// provide CONTENTFUL_MANAGEMENT_TOKEN
const CONTENTFUL_MANAGEMENT_TOKEN = "";
// provide CONTENTFUL_SPACE_ID
const CONTENTFUL_SPACE_ID = "";
/*
 * array of market names with locales for some space
 *
 * const marketsToRun = [
 *  { "name": "uk", "locales": ["en-GB"] },
 *  { "name": "finland", "locales": ["fi-FI"] }
 * ];
 *
 */
const marketsToRun = [];

/*
 * contentful role types for each market for one space
 *
 * for now we have two roles: publisher and editor
 */
const roles = ["publisher", "editor"];

/* get permision configuration depends on the role type */
const getRequestBody = (role, market, otherMarketsTags) => {
  if (role === "publisher") {
    /* permision configurations for publisher role */
    return {
      name: `DXB - ${market.name} content publisher`,
      description: null,
      policies: [
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              }
            ]
          },
          actions: ["read"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              }
            ]
          },
          actions: ["update"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  [`market__${market.name}`]
                ]
              }
            ]
          },
          actions: ["delete"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              }
            ]
          },
          actions: ["create"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  [`market__${market.name}`]
                ]
              }
            ]
          },
          actions: ["archive", "unarchive"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              }
            ]
          },
          actions: ["publish", "unpublish"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  otherMarketsTags
                ]
              }
            ]
          },
          actions: ["read"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              },
              { equals: [{ doc: "sys.contentType.sys.id" }, "resource"] },
              { paths: [{ doc: "fields.key.%" }] }
            ]
          },
          actions: ["update"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              { equals: [{ doc: "sys.type" }, "Entry"] },
              {
                equals: [
                  { doc: "sys.contentType.sys.id" },
                  "calculatorRoofShape"
                ]
              }
            ]
          },
          actions: ["update"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              { equals: [{ doc: "sys.type" }, "Entry"] },
              {
                equals: [
                  { doc: "sys.contentType.sys.id" },
                  "calculatorRoofShape"
                ]
              }
            ]
          },
          actions: ["delete"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              { equals: [{ doc: "sys.type" }, "Entry"] },
              {
                equals: [
                  { doc: "sys.contentType.sys.id" },
                  "calculatorRoofShape"
                ]
              }
            ]
          },
          actions: ["publish", "unpublish"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              }
            ]
          },
          actions: ["read"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              }
            ]
          },
          actions: ["update"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  [`market__${market.name}`]
                ]
              }
            ]
          },
          actions: ["delete"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              }
            ]
          },
          actions: ["create"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  [`market__${market.name}`]
                ]
              }
            ]
          },
          actions: ["archive", "unarchive"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  [`market__${market.name}`]
                ]
              }
            ]
          },
          actions: ["publish", "unpublish"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  otherMarketsTags
                ]
              }
            ]
          },
          actions: ["read"]
        }
      ],
      permissions: {
        ContentModel: ["read"],
        Settings: [],
        ContentDelivery: [],
        Environments: [],
        EnvironmentAliases: [],
        Tags: []
      }
    };
  }
  if (role === "editor") {
    /* permision configurations for editor role */
    return {
      name: `DXB - ${market.name} content editor`,
      description: null,
      policies: [
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              }
            ]
          },
          actions: ["read"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              }
            ]
          },
          actions: ["update"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  [`market__${market.name}`]
                ]
              }
            ]
          },
          actions: ["delete"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              }
            ]
          },
          actions: ["create"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  [`market__${market.name}`]
                ]
              }
            ]
          },
          actions: ["archive", "unarchive"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  otherMarketsTags
                ]
              }
            ]
          },
          actions: ["read"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Entry"
                ]
              },
              { equals: [{ doc: "sys.contentType.sys.id" }, "resource"] },
              { paths: [{ doc: "fields.key.%" }] }
            ]
          },
          actions: ["update"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              { equals: [{ doc: "sys.type" }, "Entry"] },
              {
                equals: [
                  { doc: "sys.contentType.sys.id" },
                  "calculatorRoofShape"
                ]
              }
            ]
          },
          actions: ["update"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              { equals: [{ doc: "sys.type" }, "Entry"] },
              {
                equals: [
                  { doc: "sys.contentType.sys.id" },
                  "calculatorRoofShape"
                ]
              }
            ]
          },
          actions: ["delete"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              { equals: [{ doc: "sys.type" }, "Entry"] },
              {
                equals: [
                  { doc: "sys.contentType.sys.id" },
                  "calculatorRoofShape"
                ]
              }
            ]
          },
          actions: ["publish", "unpublish"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              }
            ]
          },
          actions: ["read"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              }
            ]
          },
          actions: ["update"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  [`market__${market.name}`]
                ]
              }
            ]
          },
          actions: ["delete"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              }
            ]
          },
          actions: ["create"]
        },
        {
          effect: "allow",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  [`market__${market.name}`]
                ]
              }
            ]
          },
          actions: ["archive", "unarchive"]
        },
        {
          effect: "deny",
          constraint: {
            and: [
              {
                equals: [
                  {
                    doc: "sys.type"
                  },
                  "Asset"
                ]
              },
              {
                in: [
                  {
                    doc: "metadata.tags.sys.id"
                  },
                  otherMarketsTags
                ]
              }
            ]
          },
          actions: ["read"]
        }
      ],
      permissions: {
        ContentModel: ["read"],
        Settings: [],
        ContentDelivery: [],
        Environments: [],
        EnvironmentAliases: [],
        Tags: []
      }
    };
  }
  return undefined;
};

const triggerCreateRolesForMarket = async (market, otherMarketsTags, role) => {
  console.info(`Getting request body for ${role} role for ${market.name}`);
  const body = getRequestBody(role, market, otherMarketsTags);
  if (body) {
    console.info(`Triggering create ${role} role for ${market.name}`);
    await fetchRetry(
      `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/roles`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CONTENTFUL_MANAGEMENT_TOKEN}`,
          "Content-Type": "application/vnd.contentful.management.v1+json"
        },
        body: JSON.stringify(body)
      }
    );
    console.info(`Created ${role} role for ${market.name}`);
  }
};

const main = async () => {
  await Promise.allSettled(
    marketsToRun.map(async (market) => {
      try {
        const otherMarkets = marketsToRun.filter(
          (currentMarket) => currentMarket.name !== market.name
        );
        const otherMarketsTags = otherMarkets.map((m) => `market__${m.name}`);
        console.info(`Triggering create roles for ${market.name}`);
        for (const role of roles) {
          await triggerCreateRolesForMarket(market, otherMarketsTags, role);
        }
      } catch (error) {
        console.error(error.message);
      }
    })
  );
};

main().then(() => {
  console.info(`Created contentful roles`);
});
