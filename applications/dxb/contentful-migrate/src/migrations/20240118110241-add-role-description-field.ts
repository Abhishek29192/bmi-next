import type { MigrationFunction } from "contentful-migration";

export const description = "Add role template field for the account page";

export const up: MigrationFunction = async (migration) => {
  const accountPage = migration.editContentType("accountPage");
  accountPage
    .createField("roleDescription")
    .name("Role description")
    .type("Symbol")
    .localized(true)
    .required(true);

  accountPage.changeFieldControl("roleDescription", "builtin", "singleLine", {
    helpText:
      "You can use variable {{role}} in the description. e.g. You are logged in as {{role}}."
  });

  accountPage.moveField("roleDescription").beforeField("description");

  accountPage.changeFieldControl("description", "builtin", "singleLine", {
    helpText: ""
  });
};

export const down: MigrationFunction = async (migration) => {
  const accountPage = migration.editContentType("accountPage");
  accountPage.deleteField("roleDescription");

  accountPage.changeFieldControl("description", "builtin", "singleLine", {
    helpText:
      "You can use variable {{role}} in the description. i.e. You are logged in as {{role}}. Please find out all your available tools"
  });
};
