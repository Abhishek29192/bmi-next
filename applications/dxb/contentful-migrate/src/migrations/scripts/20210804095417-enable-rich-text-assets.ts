import {
  getEnabledNodeTypesValidations,
  getMessageFromEnabledNodeTypes
} from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Allow embedding assets in description";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const systemConfiguratorBlock = migration.editContentType(
    "systemConfiguratorBlock"
  );

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    context!.makeRequest,
    "systemConfiguratorBlock",
    "description"
  );

  systemConfiguratorBlock.editField("description").validations([
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
  const systemConfiguratorBlock = migration.editContentType(
    "systemConfiguratorBlock"
  );

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    context!.makeRequest,
    "systemConfiguratorBlock",
    "description"
  );

  const previousEnabledNodes =
    enabledNodeTypesValidation?.enabledNodeTypes.filter(
      (node) => node !== "embedded-asset-block"
    ) || [];

  systemConfiguratorBlock.editField("description").validations([
    {
      enabledNodeTypes: previousEnabledNodes,
      message: getMessageFromEnabledNodeTypes(previousEnabledNodes)
    }
  ]);
};
