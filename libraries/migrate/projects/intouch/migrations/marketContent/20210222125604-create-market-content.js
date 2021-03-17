module.exports.description = "Create content model for Market Content";

module.exports.up = (migration) => {
  const marketContent = migration
    .createContentType("marketContent")
    .name("Market Content")
    .displayField("name")
    .description("");

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
    .createField("benefits")
    .name("Benefits")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["benefit"] }],
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
    .createField("heroImageHome")
    .name("Hero Image Home")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["imageSet"] }])
    .linkType("Entry");

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

  marketContent.createField("name").name("Name").type("Symbol").required(true);

  marketContent.changeFieldControl(
    "partnerBrands",
    "builtin",
    "entryCardsEditor"
  );
  marketContent.changeFieldControl("benefits", "builtin", "entryLinksEditor");
  marketContent.changeFieldControl("contacts", "builtin", "entryCardsEditor");
  marketContent.changeFieldControl(
    "heroImageHome",
    "builtin",
    "entryLinkEditor"
  );
  marketContent.changeFieldControl("newsItemUrl", "builtin", "urlEditor");
  marketContent.changeFieldControl("name", "builtin", "singleLine", {
    helpText:
      "The name of the entry shown when searching in the Contentful Web App. This field is needed to automatically perform content migrations from code."
  });
};

module.exports.down = (migration) =>
  migration.deleteContentType("marketContent");
