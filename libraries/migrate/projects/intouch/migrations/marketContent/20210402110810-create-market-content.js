module.exports.description = "Create content model for Market Content";

module.exports.up = (migration) => {
  const marketContent = migration
    .createContentType("marketContent")
    .name("Market Content")
    .displayField("name")
    .description("");

  marketContent.createField("name").name("Name").type("Symbol").required(true);

  marketContent
    .createField("partnerBrands")
    .name("Partner Brands")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["partnerBrand"] }],
      linkType: "Entry"
    });

  marketContent
    .createField("contacts")
    .name("Contacts")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contactDetails"] }],
      linkType: "Entry"
    });

  marketContent
    .createField("newsItemUrl")
    .name("News Item Url")
    .type("Symbol")
    .required(true)
    .validations([
      { unique: true },
      {
        regexp: {
          pattern:
            "^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$"
        }
      }
    ]);

  marketContent
    .createField("live")
    .name("Live")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }, { in: ["ok"] }]);

  marketContent.changeFieldControl("name", "builtin", "singleLine", {
    helpText:
      "The name of the entry shown when searching in the Contentful Web App. This field is needed to automatically perform content migrations from code."
  });
  marketContent.changeFieldControl(
    "partnerBrands",
    "builtin",
    "entryCardsEditor"
  );
  marketContent.changeFieldControl("contacts", "builtin", "entryCardsEditor");
  marketContent.changeFieldControl("newsItemUrl", "builtin", "urlEditor");
  marketContent.changeFieldControl("live", "builtin", "dropdown");
};

module.exports.down = (migration) =>
  migration.deleteContentType("marketContent");
