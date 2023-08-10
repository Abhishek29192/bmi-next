import { brands as previousIcons } from "../variables/icons/20201111103444.js";
import { brands as newIcons } from "../variables/icons/20210324110455.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update welcome dialog brands to latest available";

const contentTypeName = "resources";
const fieldName = "welcomeDialogBrands";

export const up: MigrationFunction = (migration) => {
  migration.editContentType(contentTypeName).editField(fieldName, {
    type: "Array",
    items: {
      type: "Symbol",
      validations: [{ in: newIcons }]
    }
  });
};

export const down: MigrationFunction = (migration) => {
  migration.editContentType(contentTypeName).editField(fieldName, {
    type: "Array",
    items: {
      type: "Symbol",
      validations: [{ in: previousIcons }]
    }
  });
};
