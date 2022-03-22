"use strict";

const { isDryRun } = require("../../../../utils/process");

module.exports.description =
  "Update Category Codes field on Product Lister Page";

module.exports.up = (migration) => {
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

module.exports.down = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage.editField("categoryCode").disabled(false).omitted(false);

  productListerPage.deleteField("categoryCodes");
};
