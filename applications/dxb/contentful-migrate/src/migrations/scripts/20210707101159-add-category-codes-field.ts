import { isDryRun } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update Category Codes field on Product Lister Page";

export const up: MigrationFunction = (migration: Migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage
    .createField("categoryCodes")
    .name("Category Codes")
    .type("Array")
    .required(true)
    .items({
      type: "Symbol",
      validations: []
    });
  productListerPage.moveField("categoryCodes").afterField("categoryCode");

  if (isDryRun) {
    return;
  }

  migration.transformEntries({
    contentType: "productListerPage",
    from: ["categoryCode"],
    to: ["categoryCodes"],
    transformEntryForLocale: async ({ categoryCode }, currentLocale) => {
      if (!categoryCode) {
        return;
      }

      return {
        categoryCodes: [categoryCode[currentLocale]]
      };
    }
  });

  productListerPage.editField("categoryCode").disabled(true).omitted(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage.editField("categoryCode").disabled(false).omitted(false);

  productListerPage.deleteField("categoryCodes");
};
