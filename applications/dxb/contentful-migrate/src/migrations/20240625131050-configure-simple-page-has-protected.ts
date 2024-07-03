import { getLocales } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add radio group button to make Simple Page protected";

export const up: MigrationFunction = async (migration, context) => {
  if (!context) {
    throw new Error("Context was not provided");
  }

  const page = migration.editContentType("page");

  const defaultValue = (await getLocales(context.makeRequest)).items.reduce(
    (defaultValue, localeInfo) => {
      return { ...defaultValue, [localeInfo.code]: false };
    },
    {}
  );

  page
    .createField("isSimplePageProtected")
    .name("Protected Page")
    .type("Boolean")
    .localized(true)
    .required(true)
    .defaultValue(defaultValue);
};

export const down: MigrationFunction = async (migration, context) => {
  const page = migration.editContentType("page");
  page.deleteField("isSimplePageProtected");
};
