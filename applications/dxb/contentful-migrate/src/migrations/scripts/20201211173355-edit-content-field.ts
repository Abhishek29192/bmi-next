import {
  getEnabledNodeTypesValidations,
  getMessageFromEnabledNodeTypes
} from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Edit the content time for the Product Lister Page";

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

  productListerPage.editField("content").validations([
    {
      enabledNodeTypes: [
        ...(enabledNodeTypesValidation?.enabledNodeTypes || []),
        "embedded-asset-block"
      ],
      message: getMessageFromEnabledNodeTypes([
        ...(enabledNodeTypesValidation?.enabledNodeTypes || []),
        "embedded-asset-block"
      ])
    }
  ]);
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const productListerPage = migration.editContentType("productListerPage");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    context!.makeRequest,
    "productListerPage",
    "content"
  );

  const previousEnabledNodes =
    enabledNodeTypesValidation?.enabledNodeTypes.filter(
      (node) => node !== "embedded-asset-block"
    ) || [];

  productListerPage.editField("content").validations([
    {
      enabledNodeTypes: previousEnabledNodes,
      message: getMessageFromEnabledNodeTypes(previousEnabledNodes)
    }
  ]);
};
