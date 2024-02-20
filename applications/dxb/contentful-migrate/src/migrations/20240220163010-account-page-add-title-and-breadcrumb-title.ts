import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add the title and breadcrumb title fields to the account page, so it can behave consistently with the other pages.";

export const up: MigrationFunction = async (migration) => {
  const accountPage = migration.editContentType("accountPage");

  accountPage
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true)
    .localized(true);

  accountPage.moveField("title").afterField("name");

  accountPage
    .createField("breadcrumbTitle")
    .name("Breadcrumb Title")
    .type("Symbol")
    .required(false)
    .localized(true);
};

export const down: MigrationFunction = async (migration) => {
  const accountPage = migration.editContentType("accountPage");

  accountPage.deleteField("title");
  accountPage.deleteField("breadcrumbTitle");
};
