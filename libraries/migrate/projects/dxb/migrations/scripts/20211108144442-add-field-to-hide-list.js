module.exports.description =
  "Add feature flag to show/hide result list on page load";

const contentTypeName = "serviceLocatorSection";
const fieldName = "showDefaultResultList";

module.exports.up = (migration) => {
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

module.exports.down = (migration) => {
  migration.editContentType(contentTypeName).deleteField(fieldName);
};
