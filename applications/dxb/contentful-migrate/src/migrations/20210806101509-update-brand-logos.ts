import { brands as previousIcons } from "../variables/icons/20210512134828.js";
import { brands as newIcons } from "../variables/icons/20210803135831.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update brand logos to latest available";

const contentTypeName = "promo";
const fieldName = "brandLogo";

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
