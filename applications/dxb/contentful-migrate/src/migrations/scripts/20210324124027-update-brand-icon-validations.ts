import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { brands as previousIcons } from "../../variables/icons/20201111103444";
import { brands as newIcons } from "../../variables/icons/20210324110455";

export const description = "Update brand logos to latest available";

const contentTypeName = "brandLandingPage";
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
