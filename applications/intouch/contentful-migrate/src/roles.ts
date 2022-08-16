import type { CreateRoleProps } from "contentful-management";

const roles: CreateRoleProps[] = [
  {
    name: "Market Admin",
    description:
      "The market admin in Contentful is in charge of creating and editing entries",
    permissions: {
      ContentDelivery: "all",
      ContentModel: ["read"],
      EnvironmentAliases: [],
      Environments: [],
      Settings: [],
      Tags: []
    },
    policies: [
      {
        effect: "allow",
        actions: "all",
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
        }
      },
      {
        effect: "allow",
        actions: "all",
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
        }
      }
    ]
  }
];

export default roles;
