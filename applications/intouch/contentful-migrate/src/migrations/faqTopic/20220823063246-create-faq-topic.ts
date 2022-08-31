import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for FAQ Topic";

export const up: MigrationFunction = (migration: Migration) => {
  const faqTopic = migration
    .createContentType("faqTopic")
    .name("FAQ Topic")
    .displayField("title")
    .description("A single FAQ Topic with a collection of Items.");

  faqTopic.createField("title").name("Title").type("Symbol").required(true);

  faqTopic
    .createField("audienceTiers")
    .name("Audience Tiers")
    .type("Array")
    .required(true)
    .items({
      type: "Symbol",
      validations: [{ in: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"] }]
    });

  faqTopic
    .createField("audienceRole")
    .name("Audience Role")
    .type("Array")
    .required(true)
    .items({
      type: "Symbol",
      validations: [
        {
          in: [
            "INSTALLER",
            "COMPANY_ADMIN",
            "MARKET_ADMIN",
            "SUPER_ADMIN",
            "AUDITOR"
          ]
        }
      ]
    });

  faqTopic
    .createField("weight")
    .name("Weight")
    .type("Integer")
    .required(true)
    .validations([{ range: { min: 1 }, message: "Min value is 1" }]);

  faqTopic
    .createField("list")
    .name("List")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["faqItem"] }],
      linkType: "Entry"
    });

  faqTopic.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "The HTML title of the FAQ Topic"
  });
  faqTopic.changeFieldControl("audienceTiers", "builtin", "checkbox");
  faqTopic.changeFieldControl("audienceRole", "builtin", "checkbox");
  faqTopic.changeFieldControl("weight", "builtin", "numberEditor");
  faqTopic.changeFieldControl("list", "builtin", "entryCardsEditor", {
    helpText: "Enter the list of items in the order you want them to appear",
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: true
  });
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("faqTopic");
