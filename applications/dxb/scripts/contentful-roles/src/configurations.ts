import { calculatorConfig } from "./calculatorConfig";
import { IMarket, RolesEnum } from "./types";
import type { CreateRoleProps, RoleProps } from "contentful-management";

export const getMarketsToRun = () => [];

export const roles = [RolesEnum.publisher, RolesEnum.editor];

export const getRolesPermissionsToCreate = (
  role: RolesEnum,
  market: IMarket,
  otherMarketsTags: string[]
): CreateRoleProps => {
  const name = `DXB - ${market.name} content ${role}`;
  switch (role) {
    case RolesEnum.publisher:
      return {
        name,
        description: undefined,
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
          },
          { ...calculatorConfig }
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
        description: undefined,
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
          },
          { ...calculatorConfig }
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

export const getRolesPermissionsToUpdate = (
  existingRole: RoleProps
): RoleProps => ({
  ...existingRole,
  policies: [
    ...existingRole.policies
    /**
     * This is just a template. All the new policies can be added as an array of objects.
     * Example: 
     {
      effect: "deny",
      constraint: {
        and: [
          { equals: [{ doc: "sys.type" }, "Entry"] },
          {
            equals: [{ doc: "sys.contentType.sys.id" }, "calculatorRoofShape"]
          }
        ]
      },
      actions: ["create", "archive", "unarchive"]
    } 
     */
  ]
});
