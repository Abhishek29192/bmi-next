import type Migration from "contentful-migration";

module.exports.description = "Create operation Type content model";

module.exports.up = (migration: Migration) => {
  const operationType = migration.editContentType("operationType");

  operationType.editField("type").validations([
    {
      in: ["FLAT", "PITCHED", "SOLAR", "BITUMEN", "TILE", "COATER", "GREEN"]
    }
  ]);
  operationType.changeFieldControl("type", "builtin", "dropdown", {
    helpText:
      "Please Select the relevant operation type which is avaiable in the DB"
  });
};

module.exports.down = (migration: Migration) => {
  const operationType = migration.editContentType("operationType");

  operationType.editField("type").validations([
    { unique: true },
    {
      in: ["FLAT", "PITCHED", "SOLAR", "BITUMEN", "TILE", "COATER", "GREEN"]
    }
  ]);
};
