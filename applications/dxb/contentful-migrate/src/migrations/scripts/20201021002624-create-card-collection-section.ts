import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Card Collection Section";

export const up: MigrationFunction = (migration: Migration) => {
  const cardCollectionSection = migration
    .createContentType("cardCollectionSection")
    .name("Card Collection Section")
    .displayField("title")
    .description("");

  cardCollectionSection.createField("title").name("Title").type("Symbol");

  cardCollectionSection
    .createField("cardType")
    .name("Card Type")
    .type("Symbol")
    .required(true)
    .validations([
      { in: ["Product Overview Card", "Next Best Action Card", "CTA Card"] }
    ]);

  cardCollectionSection
    .createField("cardLabel")
    .name("Card Label")
    .type("Symbol");

  cardCollectionSection
    .createField("cards")
    .name("Cards")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["promo", "page"] }],
      linkType: "Entry"
    });

  cardCollectionSection.changeFieldControl("title", "builtin", "singleLine");
  cardCollectionSection.changeFieldControl("cardType", "builtin", "dropdown");
  cardCollectionSection.changeFieldControl(
    "cardLabel",
    "builtin",
    "singleLine",
    {
      helpText:
        "You can use variable {{title}} in the label. i.e. Go to {{title}}"
    }
  );
  cardCollectionSection.changeFieldControl(
    "cards",
    "builtin",
    "entryCardsEditor",
    {
      bulkEditing: false,
      showLinkEntityAction: true,
      showCreateEntityAction: true
    }
  );
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("cardCollectionSection");
