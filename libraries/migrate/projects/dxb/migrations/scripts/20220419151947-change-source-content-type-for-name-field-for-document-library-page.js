module.exports.description =
  "Copy title to name field for document library page";

module.exports.up = (migration) => {
  migration.transformEntries({
    contentType: "documentLibraryPage",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]).replace(/\|/gi, "")
    }),
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  migration.transformEntries({
    contentType: "documentLibraryPage",
    from: ["name"],
    to: ["title"],
    transformEntryForLocale: async ({ name }, currentLocale) => ({
      title: name && name[currentLocale]
    }),
    shouldPublish: "preserve"
  });
};
