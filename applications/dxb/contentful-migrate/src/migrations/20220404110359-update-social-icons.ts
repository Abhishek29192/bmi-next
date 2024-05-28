import previousIcons from "../variables/icons/20210824154700.js";
import newIcons from "../variables/icons/20220404105849.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update social logos to latest available";

const contentTypeName = "link";
const fieldName = "icon";

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