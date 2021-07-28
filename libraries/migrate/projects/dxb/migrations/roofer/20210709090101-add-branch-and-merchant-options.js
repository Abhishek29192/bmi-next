"use strict";

const { getAppByNameFromSpace } = require("../../../../utils/app");

module.exports.description = "Add Branch and Merchant options";

module.exports.up = async (
  migration,
  { makeRequest, accessToken, spaceId }
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
    {
      makeRequest,
      accessToken,
      spaceId
    }
  );

  if (conditionalFieldsApp) {
    const { sys } = conditionalFieldsApp;
    roofer.configureEntryEditor("app", sys.id);
  }
};

module.exports.down = (migration) => {
  const roofer = migration.editContentType("roofer", { name: "Roofer" });

  roofer.editField("name").name("Company name");

  roofer.deleteField("entryType");

  roofer.deleteField("fax");

  roofer.resetEntryEditor();
};
