"use strict";

const { isDryRun } = require("../../../../utils/process");

module.exports.description =
  "change subtitle field from short text to long text";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page
    .createField("subtitle")
    .name("Subtitle")
    .type("Text")
    .validations([{ size: { max: 400 } }]);

  page.moveField("subtitle").afterField("brandLogo");
  page.changeFieldControl("subtitle", "builtin", "multipleLine");

  if (isDryRun) {
    return;
  }

  migration.transformEntries({
    contentType: "page",
    from: ["subtitleShortText"],
    to: ["subtitle"],
    transformEntryForLocale: async ({ subtitleShortText }, currentLocale) => {
      if (!subtitleShortText) {
        return;
      }

      return {
        subtitle: subtitleShortText[currentLocale]
      };
    }
  });
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");

  page.deleteField("subtitle");
};
