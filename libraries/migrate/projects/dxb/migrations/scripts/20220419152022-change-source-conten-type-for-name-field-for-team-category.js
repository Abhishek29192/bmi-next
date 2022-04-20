module.exports.description = "Copy title to name field for team category";

module.exports.up = (migration) => {
  migration.transformEntries({
    contentType: "teamCategory",
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
    contentType: "teamCategory",
    from: ["name"],
    to: ["title"],
    transformEntryForLocale: async ({ name }, currentLocale) => ({
      title: name && name[currentLocale]
    }),
    shouldPublish: "preserve"
  });
};
