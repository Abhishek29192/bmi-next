import type { MigrationFunction } from "contentful-migration";

export const description =
  "add SameAs filed to SEO content type for org schema";

export const up: MigrationFunction = async (migration) => {
  const seoContent = migration.editContentType("seoContent");
  seoContent
    .createField("sameAs")
    .name("Same As field for org schema")
    .type("Symbol");

  seoContent.changeFieldControl("sameAs", "builtin", "singleLine", {
    helpText:
      "URLs of a reference Web page that unambiguously indicates the item's identity. " +
      'You can provide multiple urls using comma "," as a separator'
  });
};

export const down: MigrationFunction = async (migration) => {
  const seoContent = migration.editContentType("seoContent");
  seoContent.deleteField("sameAs");
};
