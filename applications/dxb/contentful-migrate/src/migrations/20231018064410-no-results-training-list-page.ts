import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add search tips field to Training lister page content type";

export const up: MigrationFunction = async (migration) => {
  const trainingListerPage = migration.editContentType("trainingListerPage");

  trainingListerPage
    .createField("searchTips")
    .name("Search Tips")
    .type("Link")
    .validations([{ linkContentType: ["titleWithContent"] }])
    .linkType("Entry")
    .localized(true);

  trainingListerPage.moveField("searchTips").afterField("breadcrumbTitle");
};

export const down: MigrationFunction = async (migration) => {
  const trainingListerPage = migration.editContentType("trainingListerPage");
  trainingListerPage.deleteField("searchTips");
};
