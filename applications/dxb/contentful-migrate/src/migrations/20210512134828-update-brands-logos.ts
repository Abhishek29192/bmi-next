import { brands as previousIcons } from "../variables/icons/20210324110455.js";
import { brands as newIcons } from "../variables/icons/20210512134828.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update brand logos to latest available";

const contentTypeName = "document";
const fieldName = "brand";

export const up: MigrationFunction = (migration) => {
  migration.editContentType(contentTypeName).editField(fieldName, {
    type: "Symbol",
    validations: [{ in: newIcons }]
  });
};

export const down: MigrationFunction = (migration) => {
  migration.editContentType(contentTypeName).editField(fieldName, {
    type: "Symbol",
    validations: [{ in: previousIcons }]
  });
};
