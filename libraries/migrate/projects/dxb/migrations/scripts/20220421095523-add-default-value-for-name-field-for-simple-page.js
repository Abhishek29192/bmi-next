module.exports.description =
  "add default valur for nam files if empty title for simple page";

module.exports.up = (migration) => {
  migration.transformEntries({
    contentType: "page",
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
    contentType: "page",
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
        name: (name && name[currentLocale]) || "Untitled",
        title: (name && name[currentLocale]) || "Untitled"
      };
    }
  });
};
