import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add feature flag to show/hide result list on page load";

const contentTypeName = "serviceLocatorSection";
const fieldName = "showDefaultResultList";

export const up: MigrationFunction = (migration: Migration) => {
  const section = migration.editContentType(contentTypeName);

  section.createField(fieldName, {
    name: "Show The Result List On Page Load",
    type: "Boolean",
    required: false
  });

  section.changeFieldControl(fieldName, "builtin", "boolean");

  section.moveField(fieldName).afterField("type");

  migration.transformEntries({
    contentType: contentTypeName,
    from: [fieldName],
    to: [fieldName],
    transformEntryForLocale: async () => {
      return {
        [fieldName]: true
      };
    },
    shouldPublish: "preserve"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.editContentType(contentTypeName).deleteField(fieldName);
};
