import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Convert villainSection into syndicateSection";

export const up: MigrationFunction = (migration: Migration) => {
  const syndicateSection = migration.editContentType("villainSection");

  syndicateSection.name("Syndicate Section");

  syndicateSection
    .createField("villains")
    .name("Villains")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: ["contactUsPage", "promo", "page"] }]
    });

  migration.transformEntries({
    contentType: "villainSection",
    from: ["promo"],
    to: ["villains"],
    transformEntryForLocale: function ({ promo }, currentLocale) {
      const villains = promo ? [promo[currentLocale]] : [undefined];
      return { villains };
    }
  });

  syndicateSection.deleteField("promo");
};

export const down: MigrationFunction = (migration: Migration) => {
  const villainSection = migration.editContentType("villainSection");

  villainSection.name("Villain Section");

  villainSection
    .createField("promo")
    .name("Promo")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["contactUsPage", "promo", "page"] }])
    .linkType("Entry");

  migration.transformEntries({
    contentType: "villainSection",
    from: ["villains"],
    to: ["promo"],
    transformEntryForLocale: function ({ villains }, currentLocale) {
      const promo = villains ? villains[currentLocale][0] : undefined;
      return { promo };
    }
  });

  villainSection.deleteField("villains");
};
