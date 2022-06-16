import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import merchantTypes from "../../variables/merchantTypes/20210929064001.js";

export const description = "Add Merchant Types and options";

export const up: MigrationFunction = (migration: Migration) => {
  const roofer = migration.editContentType("roofer");
  roofer
    .createField("merchantType")
    .name("Type of Merchant")
    .type("Array")
    .items({
      type: "Symbol",
      validations: [
        {
          in: merchantTypes
        }
      ]
    });

  roofer.moveField("merchantType").afterField("branchType");

  roofer.changeFieldControl("merchantType", "builtin", "checkbox");
};

export const down: MigrationFunction = (migration: Migration) => {
  const roofer = migration.editContentType("roofer");
  roofer.deleteField("merchantType");
};
