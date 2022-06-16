import {
  getEnabledNodeTypesValidations,
  getMessageFromEnabledNodeTypes
} from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Edit the text field for the Lead Block Section";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
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
        // TODO: Semantic component for presentational variant of headings
        // Tracked by https://bmigroup.atlassian.net/browse/DXB-1179
        "heading-5"
      ],
      message: getMessageFromEnabledNodeTypes([
        ...(enabledNodeTypesValidation?.enabledNodeTypes || []),
        "heading-5"
      ])
    }
  ]);
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const leadBlockSection = migration.editContentType("leadBlockSection");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    context!.makeRequest,
    "leadBlockSection",
    "text"
  );

  const previousEnabledNodes =
    enabledNodeTypesValidation?.enabledNodeTypes.filter(
      (node) => node !== "heading-5"
    ) || [];

  leadBlockSection.editField("text").validations([
    {
      enabledNodeTypes: previousEnabledNodes,
      message: getMessageFromEnabledNodeTypes(previousEnabledNodes)
    }
  ]);
};
