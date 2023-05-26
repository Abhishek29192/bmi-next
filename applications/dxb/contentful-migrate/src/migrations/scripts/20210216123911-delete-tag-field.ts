import type { MigrationFunction } from "contentful-migration";

export const description =
  "Delete tag field from product lister page content type";

export const up: MigrationFunction = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage.deleteField("tag");
};
