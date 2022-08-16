import type Migration from "contentful-migration";
import type { MigrationContext } from "contentful-migration";

export const description = "Change fields controls to unique fields app";

const UNIQUE_FIELDS_APP = "3boLz03AvMVs4noqM2ARqS";

const FIELDS_TO_EDIT = {
  navigation: "title",
  homePage: "title",
  page: "title",
  contactUsPage: "title",
  productListerPage: "title",
  resources: "title",
  imageGallerySection: "title",
  serviceType: "name"
};

export const up = async (migration: Migration, context: MigrationContext) => {
  Object.entries(FIELDS_TO_EDIT).forEach(([contentType, fieldId]) => {
    const ct = migration.editContentType(contentType);

    ct.changeFieldControl(fieldId, "app", UNIQUE_FIELDS_APP);

    const validations: any = [{ unique: false }];
    ct.editField(fieldId).validations(validations);
  });
};

export const down = (migration: Migration) => {
  Object.entries(FIELDS_TO_EDIT).forEach(([contentType, fieldId]) => {
    const ct = migration.editContentType(contentType);

    ct.resetFieldControl(fieldId);
    ct.editField(fieldId).validations([{ unique: true }]);
  });
};
