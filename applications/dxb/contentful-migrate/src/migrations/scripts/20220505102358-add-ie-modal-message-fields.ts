import type { MigrationFunction } from "contentful-migration";

export const description = "Add Internet Explorer message for site";

export const up: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("ieDialogTitle")
    .required(false)
    .name("Internet Explorer dialog: Title")
    .type("Symbol");

  resources
    .createField("ieDialogBody")
    .required(false)
    .name("Internet Explorer dialog: Body")
    .type("RichText");

  resources
    .createField("ieDialogActionLabel")
    .required(false)
    .name("Internet Explorer dialog: Label of Action Button")
    .type("Symbol");

  resources
    .createField("ieDialogActionLink")
    .required(false)
    .name("Internet Explorer dialog: Link of Action Button")
    .type("Symbol");

  resources.changeFieldControl("ieDialogBody", "builtin", "richTextEditor", {
    helpText:
      "The Internet Explorer Dialog body content will be used for dialog content."
  });
};

export const down: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("ieDialogTitle");
  resources.deleteField("ieDialogBody");
  resources.deleteField("ieDialogActionLabel");
  resources.deleteField("ieDialogActionLink");
};
