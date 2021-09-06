module.exports.description =
  "Add display type field to support Merhants and Branchs";

module.exports.up = (migration) => {
  const serviceLocatorSection = migration.editContentType(
    "serviceLocatorSection"
  );

  serviceLocatorSection
    .createField("type")
    .name("Type")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["Roofer", "Branch", "Merchant"] }]);

  serviceLocatorSection.moveField("type").beforeField("title");

  migration.transformEntries({
    contentType: "serviceLocatorSection",
    from: [],
    to: ["type"],
    transformEntryForLocale: () => {
      // All entries before this migration are of type "Roofer"
      return { type: "Roofer" };
    },
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  const serviceLocatorSection = migration.editContentType(
    "serviceLocatorSection"
  );

  serviceLocatorSection.deleteField("type");
};
