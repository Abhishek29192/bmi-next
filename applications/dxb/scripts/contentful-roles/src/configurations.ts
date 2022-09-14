// istanbul ignore file: doesn't hold any logic
import { IMarket, RolesEnum } from "./types";

/*
 * array of market names with locales for some space
 *
 * [
 *  { "name": "uk", "locales": ["en-GB"] },
 *  { "name": "finland", "locales": ["fi-FI"] }
 * ];
 *
 */
export const getMarketsToRun = () => [];

/*
 * contentful role types for each market for one space
 *
 * for now we have two roles: publisher and editor
 */
export const roles = [RolesEnum.publisher, RolesEnum.editor];

/* get permision configuration depends on the role type */
export const getRolesPermissionsToCreate = (
  role: RolesEnum,
  market: IMarket,
  otherMarketsTags: string[]
) => {
  const name = `DXB - ${market.name} content ${role}`;
  if (role === RolesEnum.publisher) {
    /* permision configurations for publisher role */
    return {
      name,
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
  if (role === RolesEnum.editor) {
    /* permision configurations for editor role */
    return {
      name,
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

/* get permision configuration depends on the role type to update */
export const getRolesPermissionsToUpdate = (
  role: RolesEnum,
  market: IMarket,
  otherMarketsTags: string[]
) => {
  if (role === RolesEnum.publisher) {
    /* permision configurations for publisher role */
    // example of body request for update role description
    // { description: `updated description for the ${market.name} ${role}` }
    return {};
  }
  if (role === RolesEnum.editor) {
    /* permision configurations for editor role */
    // example of body request for update role description
    // { description: `updated description for the ${market.name} ${role}` }
    return {};
  }
  return undefined;
};
