import {
  getEnabledNodeTypesValidations,
  getMessageFromEnabledNodeTypes
} from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Edit the text field for the Lead Block Section";

export const up: MigrationFunction = async (migration, context) => {
  const leadBlockSection = migration.editContentType("leadBlockSection");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    context!.makeRequest,
    "leadBlockSection",
    "text"
  );

  leadBlockSection.editField("text").validations([
    {
      enabledNodeTypes: [
        ...(enabledNodeTypesValidation?.enabledNodeTypes || []),
        "heading-2"
      ],
      message: getMessageFromEnabledNodeTypes([
        ...(enabledNodeTypesValidation?.enabledNodeTypes || []),
        "heading-2"
      ])
    }
  ]);
};

export const down: MigrationFunction = async (migration, context) => {
  const leadBlockSection = migration.editContentType("leadBlockSection");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    context!.makeRequest,
    "leadBlockSection",
    "text"
  );

  const previousEnabledNodes =
    enabledNodeTypesValidation?.enabledNodeTypes.filter(
      (node) => node !== "heading-2"
    ) || [];

  leadBlockSection.editField("text").validations([
    {
      enabledNodeTypes: previousEnabledNodes,
      message: getMessageFromEnabledNodeTypes(previousEnabledNodes)
    }
  ]);
};
