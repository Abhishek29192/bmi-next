import type { CreateRoleProps, RoleProps } from "contentful-management";

export const createRoleData: CreateRoleProps = {
  name: "DXB - uk content publisher",
  description: undefined,
  policies: [
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
              { otherMarketsTags: [] }
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

export const role: RoleProps = {
  sys: {
    type: "Role",
    id: "fake-id",
    version: 0,
    space: {
      sys: {
        type: "Fake user type",
        linkType: "Fake link type",
        id: "fake-space-id"
      }
    },
    createdBy: {
      sys: {
        type: "Link",
        linkType: "Space",
        id: "fake-user-id"
      }
    },
    createdAt: "2013-07-04T13:06:57Z",
    updatedBy: {
      sys: {
        type: "Fake user type",
        linkType: "Fake link type",
        id: "fake-user-id"
      }
    },
    updatedAt: "2013-07-04T13:06:57Z"
  },
  ...createRoleData
};
