import branchTypes from "../variables/branchTypes/20210928085352.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Branch Types and options";

export const up: MigrationFunction = async (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer
    .createField("branchType")
    .name("Type of branch")
    .type("Array")
    .items({
      type: "Symbol",
      validations: [
        {
          in: branchTypes
        }
      ]
    });

  roofer.moveField("branchType").afterField("type");

  roofer.changeFieldControl("branchType", "builtin", "checkbox");
};

export const down: MigrationFunction = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.deleteField("branchType");
};
