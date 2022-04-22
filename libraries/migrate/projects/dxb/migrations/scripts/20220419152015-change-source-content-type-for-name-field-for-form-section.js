module.exports.description = "Copy title to name field for form section";

module.exports.up = (migration) => {
  migration.transformEntries({
    contentType: "form",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => {
      return {
        name: (title && title[currentLocale]).replace(/\|/gi, "") || "Untitled",
        title: !title[currentLocale] ? "Untitled" : title[currentLocale]
      };
    },
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  migration.transformEntries({
    contentType: "form",
    from: ["name", "title"],
    to: ["title"],
    shouldPublish: "preserve",
    transformEntryForLocale: async ({ name, title }, currentLocale) => {
      if (title[currentLocale]) {
        return {
          name: title[currentLocale].replace(/\|/gi, "")
        };
      }

      return {
        title: (name && name[currentLocale]) || "Untitled",
        name: (name && name[currentLocale]) || "Untitled"
      };
    }
  });
};
