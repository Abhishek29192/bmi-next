import toolTypes from "../variables/toolTypes/20210928085352.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Rename Allow Tools to Global tools";

export const up: MigrationFunction = async (migration) => {
  const accountPage = migration.editContentType("accountPage");

  accountPage.editField("allowTools", {
    newId: "globalTools",
    name: "Global Tools",
    type: "Array",
    items: {
      type: "Symbol",
      validations: [
        {
          in: toolTypes
        }
      ]
    }
  });
};

export const down: MigrationFunction = async (migration) => {
  const accountPage = migration.editContentType("accountPage");

  accountPage.editField("globalTools", {
    newId: "allowTools",
    name: "Allowed Tools",
    type: "Array",
    items: {
      type: "Symbol",
      validations: [
        {
          in: toolTypes
        }
      ]
    }
  });
};
