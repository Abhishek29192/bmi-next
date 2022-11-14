import type Migration from "contentful-migration";

module.exports.description = "Create operation Type content model";

module.exports.up = (migration: Migration) => {
  const operationType = migration
    .createContentType("operationType")
    .name("Operation Type")
    .description(
      "Company Operation Type being used for display name and list options"
    );

  operationType
    .createField("type")
    .name("Operation Type")
    .type("Symbol")
    .required(true)
    .validations([
      { unique: true },
      {
        in: ["FLAT", "PITCHED", "SOLAR", "BITUMEN", "TILE", "COATER", "GREEN"]
      }
    ]);
  operationType.changeFieldControl("type", "builtin", "dropdown", {
    helpText:
      "Please Select the relevant operation type which is avaiable in the DB"
  });

  operationType
    .createField("displayName")
    .name("Display Name")
    .type("Symbol")
    .required(true);
  operationType.changeFieldControl("displayName", "builtin", "singleLine");

  operationType.displayField("type");
};

module.exports.down = (migration: Migration) => {
  migration.deleteContentType("operationType");
};
