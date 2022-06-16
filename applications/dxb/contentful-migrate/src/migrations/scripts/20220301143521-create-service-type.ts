import {
  deleteEntry,
  getEntriesByContentType,
  unpublishEntry
} from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Create content model for Service Types";

export const up: MigrationFunction = (migration: Migration) => {
  const serviceType = migration
    .createContentType("serviceType")
    .name("Service Type")
    .displayField("name")
    .description("This content type defines various service types");

  serviceType
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  serviceType.changeFieldControl("name", "builtin", "singleLine");
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const serviceTypeContentType = migration.editContentType("serviceType");

  // delete entries of the service type conent type

  const allServiceTypeEntries = await getEntriesByContentType(
    context!.makeRequest,
    serviceTypeContentType.id
  );
  if (allServiceTypeEntries.total > 0) {
    await Promise.all(
      allServiceTypeEntries.items.map((serviceTypeEntry) => {
        return unpublishEntry(
          context!.makeRequest,
          serviceTypeEntry.sys.id,
          serviceTypeEntry.sys.version
        );
      })
    );

    await Promise.all(
      allServiceTypeEntries.items.map((serviceTypeEntry) => {
        return deleteEntry(
          context!.makeRequest,
          serviceTypeEntry.sys.id,
          serviceTypeEntry.sys.version
        );
      })
    );
  }
  //delete `serviceType` content type
  migration.deleteContentType("serviceType");
};
