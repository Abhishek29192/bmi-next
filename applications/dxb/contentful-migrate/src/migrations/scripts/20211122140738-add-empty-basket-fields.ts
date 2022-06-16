import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add empty basket fields on sample basket content type";

export const up: MigrationFunction = (migration: Migration) => {
  const sampleBasket = migration.editContentType("sampleBasket");

  sampleBasket
    .createField("emptyBasketMessage")
    .name("Empty Basket Message")
    .type("RichText")
    .localized(true)
    .required(true);

  sampleBasket
    .createField("browseProductsCTALabel")
    .name("Browse products CTA label")
    .type("Symbol")
    .localized(true)
    .required(true);

  sampleBasket
    .createField("browseProductsCTA")
    .name("Browse products CTA Link page")
    .type("Link")
    .required(true)
    .validations([
      {
        linkContentType: [
          "page",
          "contactUsPage",
          "teamPage",
          "homePage",
          "productListerPage",
          "documentLibraryPage",
          "brandLandingPage"
        ]
      }
    ])
    .linkType("Entry");

  //editors and help text for fields
  sampleBasket.changeFieldControl(
    "emptyBasketMessage",
    "builtin",
    "richTextEditor",
    {
      helpText:
        "This text will be visible to user when basket becomes empty. e.g. 'Your basket is empty.'"
    }
  );

  sampleBasket.changeFieldControl(
    "browseProductsCTALabel",
    "builtin",
    "singleLine",
    {
      helpText:
        "Provide label for a CTA which will be shown to user when basket is empty. e.g. 'Browse our products'"
    }
  );

  //move fields to right places
  sampleBasket
    .moveField("emptyBasketMessage")
    .afterField("checkoutFormSection");

  sampleBasket
    .moveField("browseProductsCTALabel")
    .afterField("emptyBasketMessage");

  sampleBasket
    .moveField("browseProductsCTA")
    .afterField("browseProductsCTALabel");
};

export const down: MigrationFunction = (migration: Migration) => {
  const sampleBasket = migration.editContentType("sampleBasket");
  sampleBasket.deleteField("emptyBasketMessage");
  sampleBasket.deleteField("browseProductsCTALabel");
  sampleBasket.deleteField("browseProductsCTA");
};
