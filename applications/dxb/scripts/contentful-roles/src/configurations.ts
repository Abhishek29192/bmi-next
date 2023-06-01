import { IMarket, RolesEnum } from "./types";

export const getMarketsToRun = () => [];

export const roles = [RolesEnum.publisher, RolesEnum.editor];

export const getRolesPermissionsToCreate = (
  role: RolesEnum,
  market: IMarket,
  otherMarketsTags: string[]
) => {
  const name = `DXB - ${market.name} content ${role}`;
  switch (role) {
    case RolesEnum.publisher:
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
    case RolesEnum.editor:
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
};

/* get permision configuration depends on the role type to update */
export const getRolesPermissionsToUpdate = (
  role: RolesEnum,
  market: IMarket,
  otherMarketsTags: string[]
) => {
  switch (role) {
    case RolesEnum.editor:
      return {};
    case RolesEnum.publisher:
      return {};
  }
};
