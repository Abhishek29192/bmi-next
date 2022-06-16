import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Content Article";

export const up: MigrationFunction = (migration: Migration) => {
  const contentArticle = migration
    .createContentType("contentArticle")
    .name("Content Article")
    .displayField("title")
    .description(
      "A standard webpage with just information and no iteractive functionality.  Currently limited to those pages targeted in the footer, which are Cookies Policy, Terms of use and the Privacy Policy"
    );

  contentArticle
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  contentArticle
    .createField("relativePath")
    .name("Relative path")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }, { regexp: { pattern: "\\/.+" } }]);

  contentArticle
    .createField("body")
    .name("Body")
    .type("RichText")
    .required(true)
    .validations([{ nodes: {} }]);

  contentArticle.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "The HTML title of the page"
  });
  contentArticle.changeFieldControl("relativePath", "builtin", "singleLine");
  contentArticle.changeFieldControl("body", "builtin", "richTextEditor", {
    helpText: "Markdown content"
  });
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("contentArticle");
