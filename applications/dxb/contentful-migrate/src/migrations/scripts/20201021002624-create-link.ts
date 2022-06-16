import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Link";

export const up: MigrationFunction = (migration: Migration) => {
  const link = migration
    .createContentType("link")
    .name("Link")
    .displayField("label")
    .description("This links to a Page or URL");

  link.createField("label").name("Label").type("Symbol").required(true);

  link
    .createField("linkedPage")
    .name("Linked Page")
    .type("Link")
    .validations([{ linkContentType: ["contactUsPage", "page", "teamPage"] }])
    .linkType("Entry");

  link
    .createField("icon")
    .name("Icon")
    .type("Symbol")
    .validations([
      { regexp: { pattern: "" } },
      {
        in: [
          "Facebook",
          "Twitter",
          "LinkedIn",
          "User",
          "BMI",
          "Phone",
          "Mail",
          "YouTube",
          "Icopal",
          "Monier",
          "Monarplan",
          "Arrow",
          "Zanda",
          "AeroDek"
        ]
      }
    ]);

  link.createField("isLabelHidden").name("Is Label Hidden").type("Boolean");

  link.createField("url").name("URL").type("Symbol");

  link.changeFieldControl("label", "builtin", "singleLine");
  link.changeFieldControl("linkedPage", "builtin", "entryLinkEditor");
  link.changeFieldControl("icon", "builtin", "dropdown");
  link.changeFieldControl("isLabelHidden", "builtin", "boolean");
  link.changeFieldControl("url", "builtin", "urlEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("link");
