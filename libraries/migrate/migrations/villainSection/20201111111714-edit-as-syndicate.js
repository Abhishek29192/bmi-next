module.exports.description = "Convert villainSection into syndicateSection";

module.exports.up = (migration) => {
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

module.exports.down = (migration) => {
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
