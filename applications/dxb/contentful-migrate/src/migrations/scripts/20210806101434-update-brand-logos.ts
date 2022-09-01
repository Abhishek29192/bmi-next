import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { brands as previousIcons } from "../../variables/icons/20210512134828";
import { brands as newIcons } from "../../variables/icons/20210803135831";

export const description = "Update brand logos to latest available";

const contentTypeName = "page";
const fieldName = "brandLogo";

export const up: MigrationFunction = (migration: Migration) => {
  migration.editContentType(contentTypeName).editField(fieldName, {
    type: "Symbol",
    validations: [{ in: newIcons }]
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.editContentType(contentTypeName).editField(fieldName, {
    type: "Symbol",
    validations: [{ in: previousIcons }]
  });
};
