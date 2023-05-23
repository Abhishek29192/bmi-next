import type { MigrationFunction } from "contentful-migration";

export const description = "Create content type for SEO content";

export const up: MigrationFunction = (migration) => {
  const seoContent = migration
    .createContentType("seoContent")
    .name("SEO content")
    .displayField("title")
    .description("");

  seoContent.createField("title").name("Title").type("Symbol").required(true);

  seoContent.createField("metaTitle").name("Meta Title").type("Symbol");

  seoContent
    .createField("metaDescription")
    .name("Meta Description")
    .type("Symbol");
};

export const down: MigrationFunction = (migration) =>
  migration.deleteContentType("seoContent");
