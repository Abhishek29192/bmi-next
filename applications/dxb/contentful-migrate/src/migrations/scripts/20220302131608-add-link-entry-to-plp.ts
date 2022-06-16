import {
  getEnabledNodeTypesValidations,
  getMessageFromEnabledNodeTypes
} from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Add link entry to PLP";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const productListerPage = migration.editContentType("productListerPage");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    context!.makeRequest,
    "productListerPage",
    "content"
  );

  const newValidEntries = [
    "brandLandingPage",
    "contactUsPage",
    "documentLibraryPage",
    "homePage",
    "link",
    "page",
    "productListerPage"
  ];

  productListerPage.editField("content").validations([
    {
      enabledNodeTypes: [
        ...(enabledNodeTypesValidation?.enabledNodeTypes || []),
        "entry-hyperlink",
        "asset-hyperlink"
      ],
      message: getMessageFromEnabledNodeTypes([
        ...(enabledNodeTypesValidation?.enabledNodeTypes || []),
        "entry-hyperlink",
        "asset-hyperlink"
      ])
    },
    {
      nodes: {
        "entry-hyperlink": [{ linkContentType: newValidEntries }]
      }
    }
  ]);
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const leadBlockSection = migration.editContentType("productListerPage");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    context!.makeRequest,
    "productListerPage",
    "content"
  );

  const previousEnabledNodes =
    enabledNodeTypesValidation?.enabledNodeTypes.filter(
      (node) => node !== "entry-hyperlink"
    ) || [];

  leadBlockSection.editField("content").validations([
    {
      enabledNodeTypes: previousEnabledNodes,
      message: getMessageFromEnabledNodeTypes(previousEnabledNodes)
    }
  ]);
};
