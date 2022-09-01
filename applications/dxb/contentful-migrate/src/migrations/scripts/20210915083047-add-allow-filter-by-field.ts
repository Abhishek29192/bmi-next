import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add allow filter by field on Product Lister Page";

export const up: MigrationFunction = (migration: Migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage
    .createField("allowFilterBy")
    .name("Allow Filter By")
    .type("Array")
    .required(false)
    .items({
      type: "Symbol",
      validations: []
    });

  productListerPage.changeFieldControl(
    "allowFilterBy",
    "builtin",
    "tagEditor",
    {
      helpText:
        "type the filter value and hit enter, note the value should match with the PIM name (ex:  'generalInformation.materials', 'measurements.length', 'ProductFamily', 'Category', 'Category | PITCHED_ROOF_NO', 'PITCHED_ROOF_NO')"
    }
  );

  productListerPage.moveField("allowFilterBy").afterField("categoryCodes");
};

export const down: MigrationFunction = (migration: Migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage.deleteField("allowFilterBy");
};
