import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Market Content";

export const up: MigrationFunction = (migration: Migration) => {
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
    .createField("mediaLibraryRoot")
    .name("Media Library Root")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["mediaFolder"] }],
      linkType: "Entry"
    });

  marketContent
    .createField("newsItemHeading")
    .name("News Item Heading")
    .type("Symbol")
    .required(true);

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
    .createField("newsItemCta")
    .name("News Item CTA")
    .type("Symbol")
    .required(true);

  marketContent
    .createField("footerLinks")
    .name("Footer Links")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contentArticle"] }],
      linkType: "Entry"
    });

  marketContent
    .createField("contactUsPage")
    .name("Contact Us Page")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["contentArticle"] }])
    .linkType("Entry");

  marketContent
    .createField("externalLinkLabel")
    .name("External Link Label")
    .type("Symbol")
    .required(true);

  marketContent
    .createField("externalLinkUrl")
    .name("External Link URL")
    .type("Symbol")
    .required(true)
    .validations([
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
  marketContent.changeFieldControl(
    "mediaLibraryRoot",
    "builtin",
    "entryLinksEditor",
    {
      helpText:
        "Ordered List of Folders which are at the root-level of the Media Library",
      bulkEditing: false,
      showLinkEntityAction: true,
      showCreateEntityAction: true
    }
  );
  marketContent.changeFieldControl("newsItemHeading", "builtin", "singleLine");
  marketContent.changeFieldControl("newsItemUrl", "builtin", "urlEditor");
  marketContent.changeFieldControl("newsItemCta", "builtin", "singleLine");
  marketContent.changeFieldControl(
    "footerLinks",
    "builtin",
    "entryLinksEditor"
  );
  marketContent.changeFieldControl(
    "contactUsPage",
    "builtin",
    "entryCardEditor"
  );
  marketContent.changeFieldControl(
    "externalLinkLabel",
    "builtin",
    "singleLine"
  );
  marketContent.changeFieldControl("externalLinkUrl", "builtin", "urlEditor");
  marketContent.changeFieldControl("live", "builtin", "dropdown");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("marketContent");
