import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import previousIcons from "../../variables/icons/20210803135831";
import newIcons from "../../variables/icons/20210824154700";

export const description = "Update brand logos to latest available";

const contentTypeName = "link";
const fieldName = "icon";

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
