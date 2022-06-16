import { getAppByNameFromSpace } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Add Branch and Merchant options";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const roofer = migration.editContentType("roofer", { name: "Service" });

  roofer.editField("name").name("Name");

  roofer
    .createField("entryType")
    .name("Entry type")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["Roofer", "Branch", "Merchant"] }]);

  roofer.moveField("entryType").beforeField("name");

  roofer.createField("fax").name("Fax number").type("Symbol");

  roofer.moveField("fax").afterField("website");

  migration.transformEntries({
    contentType: "roofer",
    from: [],
    to: ["entryType"],
    transformEntryForLocale: () => {
      // All entries before this migration are of type "Roofer"
      return { entryType: "Roofer" };
    },
    shouldPublish: "preserve"
  });

  const conditionalFieldsApp = await getAppByNameFromSpace(
    "Conditional fields",
    context!
  );

  if (conditionalFieldsApp) {
    const { sys } = conditionalFieldsApp;
    roofer.configureEntryEditor("app", sys.id);
  }
};

export const down: MigrationFunction = (migration: Migration) => {
  const roofer = migration.editContentType("roofer", {
    name: "Roofer"
  });

  roofer.editField("name").name("Company name");

  roofer.deleteField("entryType");

  roofer.deleteField("fax");

  // TODO: Remove casting once https://github.com/contentful/contentful-migration/issues/1093 is fixed
  (roofer as any).resetEntryEditor();
};
