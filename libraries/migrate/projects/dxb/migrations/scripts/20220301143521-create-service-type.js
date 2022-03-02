"use strict";

module.exports.description = "Create content model for service Types";

const {
  getEntriesbyContentType,
  unpublishEntry,
  deleteEntry
} = require("../../../../utils/makeRequestUtils");

module.exports.up = (migration) => {
  const serviceType = migration
    .createContentType("serviceType")
    .name("service Type")
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

module.exports.down = async (migration, { makeRequest }) => {
  const serviceTypeContentType = migration.editContentType("serviceType");

  // delete entries of the service type conent type

  const allServiceTypeEntries = await getEntriesbyContentType(
    makeRequest,
    serviceTypeContentType.id
  );
  if (allServiceTypeEntries.total > 0) {
    await Promise.all(
      allServiceTypeEntries.items.map((serviceTypeEntry) => {
        return unpublishEntry(
          makeRequest,
          serviceTypeEntry.sys.id,
          serviceTypeEntry.sys.version
        );
      })
    );

    await Promise.all(
      allServiceTypeEntries.items.map((serviceTypeEntry) => {
        return deleteEntry(
          makeRequest,
          serviceTypeEntry.sys.id,
          serviceTypeEntry.sys.version
        );
      })
    );
  }
  //delete `serviceType` content type
  migration.deleteContentType("serviceType");
};
